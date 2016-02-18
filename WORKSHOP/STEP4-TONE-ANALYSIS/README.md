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

Simple as that! We still need to a _a little_ work to get it going in our app, though.

## Implementing Tone Analysis

1. Create a file called `public/js/tone.js` and populate it with the following code

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
	function getToneValues(tone_category) {
	  var tone = {
	    id: tone_category.category_id
	  };
	  for (var i=0; i < tone_category.tones.length; i++)
	    tone[tone_category.tones[i].tone_id] = +((tone_category.tones[i].score * 100).toFixed(2));
	
	  return tone;
	}
	
	/**
	 * Success callback for tone alaysis POST request
	 * @param {Object} response data from api
	 */
	function toneCallback(data) {
	  var tone = {
	    doc: {},
	    sentence: {}
	  };
	
	  // Results for the updated full transcript's tone
	  tone.doc.emotion = getToneValues(data.document_tone.tone_categories[0]),
	  tone.doc.writing = getToneValues(data.document_tone.tone_categories[1]),
	  tone.doc.social = getToneValues(data.document_tone.tone_categories[2]);
	
	  // Results for the latest sentence's tone
	  if (data.sentences_tone) {
	    var numSentences = data.sentences_tone.length - 1;
	    if (data.sentences_tone[numSentences].tone_categories.length) {
	      tone.sentence.emotion = getToneValues(data.sentences_tone[numSentences].tone_categories[0]);
	      tone.sentence.writing = getToneValues(data.sentences_tone[numSentences].tone_categories[1]);
	      tone.sentence.social = getToneValues(data.sentences_tone[numSentences].tone_categories[2]);
	    }
	  }
	
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

2. To invoke all this code, we need to intercept the text outputs from the Watson Speech to Text service so that we can pass those to the Tone Analyzer service. We will have to make some edits to the files in the `src/views/displaymetadata.js` folder to do this.

	```
	// Call tone analysis in showResult()
	$('#resultsText').val(baseString);
   getToneAnalysis(baseString);
   showMetaData(alternatives[0]);
   ```
   Around line 181, insert the `getToneAnalysis()` method with `baseString` as the input. By placing this call here, we only invoke tone analysis on a final result message from Watson. This means that we will only send Watson our StT results after every sentence.
   
3. Now that we've made changes to `src/`, we need to rebuild our `public/js/index.js` file. Rerun the browserify build

  ```
  $ npm run build
  ```

4. Update `vcap-local.json` with the new tone analyzer service

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

5. Test locally

Great! We're now analyzing the text coming back from the Speech to text service. We'll want to save the tone analysis results that along with the output text. Let's make some updates for that.

## Saving the Tone Analysis

1. Update `public/index.html` to include a field for the tone analysis JSON

	```
	<div class="form-group">
      <label for="usr">Result:</label>
        <textarea class="form-control" style = "height:100px" readonly id="jsonToSave" dir="auto"></textarea>
    </div>
	```

2. Update the `public/js/tone.js` file so that we are continuously saving the tone results to a global variable called `lastToneResult`

	```
	var lastToneResult = {};
	...
  	// Save the last result from TA in toneCallback()
  	lastToneResult = tone;
	```

3. Update the `public/js/save.js` file to grab the `lastToneResult` and save it along with the StT results.

	```
	// Get last tone data in prepareDataForSave()
	$("#jsonToSave").val(JSON.stringify(lastToneResult.doc, null, ' '));
	...
	// Add the TA JSON to the API POST call data in saveData()
	dataToSend.json = JSON.parse($("#jsonToSave").val());
	```

4. Test locally

5. Make a GET (go to it in your browser) to `http://cloudantAPI-USERNAME.mybluemix.net/api/Items` to ensure everything is working. We should now be seeing the tone analysis results posted as well.

6. Push the updated `realtime-tone` app back to Bluemix

We are now successfully transcripting the user's speech, analayzing their tone, and saving it back to the database. This is really powerful and we have done it with very little code. By combining Watson services, we created an engagement _pattern_. Let's talk more about that next.

## Watson Patterns

Talk about Watson patterns, yada yada yada.

<!--Links--> 
[ta_url]: https://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/tone-analyzer.html

