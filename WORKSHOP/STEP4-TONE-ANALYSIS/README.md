# Step 4: Embedding Tone Analysis

At this point, we have now set up all the core components of the application! However, simply saving the user's transcript is not all that impressive. In this step, we will take advantage of the fact that we have a transcripted version of the speech.

## Adding the Tone Analzyer Service

In step 2 and 3, we added and bound a service through the Bluemix UI. However, we can do the same thing quicker using the CF CLI. Let's walk through how we do this with the [Tone Analyzer service][ta_url].

1. Create the Tone Analyzer service in Bluemix

  ```
  $ cf create-service tone_analyzer beta rtt-tone-analyzer
  ```
  
2. Bind the tone analyzer service instance to the `realtime-tone` app

  ```
  $ cf bind-service realtime-tone rtt-tone-analyzer
  ```

Simple as that! We still need to a _a little_ work to get it going in our app.

## Implementing Tone Analysis

1. First, we need to update [`app.js`](./app.js) with routes to handle requests for tone analysis

	```
	// Configure Watson Tone Analyzer service
	var toneCreds = getServiceCreds(appEnv, 'rtt-tone-analyzer');
	toneCreds.version = 'v3-beta';
	toneCreds.version_date = '2016-11-02';
	var toneAnalyzer = watson.tone_analyzer(toneCreds);
	
	// Request handler for tone analysis
	app.post('/api/tone', function(req, res, next) {
	  toneAnalyzer.tone(req.body, function(err, data) {
	    if (err)
	      return next(err);
	    else
	      return res.json(data);
	  });
	});
	```

2. Create a file called [`public/js/tone.js`](./public/js/tone.js) and populate it with the following code

	```
	/**
	 * AJAX Post request for tone analyzer api
	 * @param {String} request body text
	 */
	function getToneAnalysis(text)  {
	  $.post('/api/tone', {'text': text }, toneCallback)
	    .fail(err);
	}
	
	/**
	 * Converts a tone category into a flat object with tone values
	 * @param {Object} tone category returned from API
	 */
	function getToneValues(toneCategory) {
	  var tone = {
	    id: toneCategory.category_id
	  };
	  toneCategory.tones.forEach(function(toneValue) {
	    tone[toneValue.tone_id] = +((toneValue.score * 100).toFixed(2));
	  });
	
	  return tone;
	}
	
	/**
	 * Converts a set of tones into flat objects
	 * Assumes tone ids will be structured like 'category_id'
	 * @param {Object} tone level returned from API
	 */
	function getTones(tone) {
	  var tones = {};
	  tone.tone_categories.forEach(function(category) {
	    tones[category.category_id.split("_")[0]] = getToneValues(category);
	  });
	  return tones;
	}
	
	/**
	 * Success callback for tone alaysis POST request
	 * @param {Object} response data from api
	 */
	function toneCallback(data) {
	  var tone = {
	    document: {},
	    sentence: {}
	  };
	
	  // Results for the updated full transcript's tone
	  tone.document = getTones(data.document_tone);
	
	  // Results for the latest sentence's tone
	  if (data.sentences_tone && data.sentences_tone[data.sentences_tone.length - 1].tone_categories.length)
	      tone.sentence = getTones(data.sentences_tone[data.sentences_tone.length - 1]);
	
	  console.log(tone);
	}
	
	/**
	 * Error callback for tone alaysis POST request
	 * @param {Object} error
	 */
	function err(error) {
	  console.error(error);
	  var message = typeof error.responseJSON.error === 'string' ?
	    error.responseJSON.error :
	    'Error code ' + error.responseJSON.error.code + ': ' + error.responseJSON.error.message;
	  console.error(message);
	}
	```
	Calling the `getToneAnalysis()` method will invoke the Tone Analyzer service and get back document and sentence level tone for the input text. We then take the response and parse out the overall document and last sentence's tone and print it to the console.

3. Update [`public/index.html`](./public/index.html) to call this new script

	```
	<script type="text/javascript" src="js/tone.js"></script>
	```

4. To invoke all this code, we need to intercept the text outputs from the Watson Speech to Text service so that we can pass those to the Tone Analyzer service. We will have to make some edits to the files in the [`src/views/displaymetadata.js`](./src/views/displaymetadata.js) folder to do this.

	```
	// Call tone analysis in showResult()
	$('#resultsText').val(baseString);
	getToneAnalysis(baseString);
	showMetaData(alternatives[0]);
	```
	Around line 181, insert the `getToneAnalysis()` method with `baseString` as the input. By placing this call here, we only invoke tone analysis on a final result message from Watson. This means that we will only send Watson our StT results after every sentence.
   
5. Now that we've made changes to `src/`, we need to rebuild our `public/js/index.js` file. Rerun the browserify build

  ```
  $ npm run build
  ```

6. Update [`vcap-local.json`](./vcap-local.json) with the new tone analyzer service

	```
	"tone_analyzer": [
      {
        "name": "rtt-tone-analyzer",
        "label": "tone_analyzer",
        "plan": "beta",
        "credentials": {
          "url": "https://gateway.watsonplatform.net/tone-analyzer-beta/api",
          "isStreaming": false,
          "username": "USERNAME",
          "password": "PASSWORD"
        }
      }
    ]
	```

	To get the credentials without returning to the Bluemix UI, we can issue the following command using the CLI

	```
	$ cf env realtime-tone
	```

7. Test locally

Great! We're now analyzing the text coming back from the Speech to text service and we can see the results in our browser's dev console. We'll want to save the tone analysis results that along with the output text. Let's make some updates for that.

## Saving the Tone Analysis

1. Update [`public/index.html`](./public/index.html) to include fields for the tone analysis results in the save modal

	```
	<div class="form-group">
	    <label for="usr">Tone Level:</label>
	    <input type="text" class="form-control" readonly id="toneLevelToSave">
	</div>
	
	<div class="form-group">
	    <label for="usr">Tone Result:</label>
	    <textarea class="form-control" style = "height:100px" readonly id="toneValueToSave" dir="auto"></textarea>
	</div>
	```

2. Update the [`public/js/tone.js`](./public/js/tone.js) file so that we are continuously saving the tone results to a global variable called `lastToneResult`

	```
	var lastToneResult = {};
	...
  	// Save the last result from TA in toneCallback()
  	lastToneResult = tone;
	```

3. Update the [`public/js/save.js`](./public/js/save.js) file to grab the `lastToneResult` and save it along with the Speech to Text results.

	```
	if (lastToneResult) {
		$("#toneLevelToSave").val('document');
		$("#toneValueToSave").val(JSON.stringify(lastToneResult.doc, null, ' '));
	}
	...
	// Add the TA JSON to the API POST call data in saveData()
	var dataToSend = {
		name: $("#nameToSave").val(),
		transcription: $("#textToSave").val(),
		toneLevel: $("#toneLevelToSave").val(),
		toneValue: $("#toneValueToSave").val(),
	};
	```

4. Test locally

5. Make a GET (go to it in your browser) to `http://cloudantAPI-USERNAME.mybluemix.net/api/Items` to ensure everything is working. We should now be seeing the tone analysis results posted as well.

6. Push the updated `realtime-tone` app back to Bluemix

We are now successfully transcripting the user's speech, analayzing their tone, and saving it back to the database. This is really powerful and we have done it with very little code. By combining Watson services, we created an engagement _pattern_. Let's talk more about that next.

## Watson Patterns

We talk a lot about Watson over at IBM. Those of us in the developer community, even moreso. That is because Watson is trying to bridge the gap between machine learning technologies and web app development.

What makes this a possibility is the Watson Developer Cloud. Every API has a unique use case where it might be used in a real world situation. However, the true power of the APIs comes to fruition when you start to use them in conjunction. For example, Speech to Text is useful in isolation, but when you combine it with [Language Translation][lt_url] and [Text to Speech][tts_url], you have a ready-made real-time translation system. All without understanding natural language processing or complex translation models.

We have also seen companies using Watson services to create their own smart chat bots. By combining the [Natural Language Classifier][nlc_url] with the [Dialog][d_url] and [Retrieve and Rank][rar_url] services, we are able to better understand natural language questions posed by users and serve them the resources most relevant to their query. This method is shown to have a much higher accuracy rate than traditional search.

You can play with and check out the source code for some of these pattern examples in the [Watson Sample App Gallery][watson_gallery_url]. You might even see Real Time Tone Analysis there sometime soon...

Next, we enter the last phase of this workshop - using the tone analysis results in the UI...  

<!--Links-->
[ta_url]: https://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/tone-analyzer.html
[lt_url]: https://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/language-translation.html
[tts_url]: http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/text-to-speech.html
[nlc_url]: http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/nl-classifier.html
[d_url]: http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/dialog.html
[rar_url]: http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/retrieve-rank.html
[watson_gallery_url]: http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/gallery.html
