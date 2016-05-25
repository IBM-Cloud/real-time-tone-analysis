# Step 5: Real-Time Tone Charting

We are almost there! So far we have created our first Node.js app, embedded Speech to Text and Tone Analysis functionality into it, and connected to a database service on the back end. Getting the tone analysis in the last step was neat, but the user currently has no way of seeing these results. What would be nice is to show them the results in real-time. Well, let's do just that by building them a chart.

## Setting up the chart

We could build a chart ourselves, but I don't think we quite have the time for that today. Instead, we will use [Smoothie Charts][smoothie_url] and [randomColor.js][random_color_url] to automatically generate a beautiful streaming chart. We'll of course want to make this extensible so we can chart all tone types, so we'll use a little syntactic sugar.

1. To use the `smoothie.js` library, we will add two dependencies to our project and update the [`bower.json`](./bower.json) and [`gulpfile.js`](./gulpfile.js) files accordingly

	```json
	"dependencies": {
	    "bootstrap": "3.3.x",
	    "jquery": "1.11.3", // <-- Add a , here
	    "javascript-detect-element-resize": "0.5.x", // <-- Add this
	    "smoothie": "1.27.x", // <-- Add this
	    "randomcolor": "0.4.x" // <-- Add this
	  }
	```

	```js
	// ***Add the following tasks***
	gulp.task('element-resize', function() {
	    return gulp.src('bower_components/javascript-detect-element-resize/detect-element-resize.js')
	    .pipe(gulp.dest('public/vendor/javascript-detect-element-resize'));
	});
	gulp.task('smoothie', function() {
	    return gulp.src('bower_components/smoothie/smoothie.js')
	    .pipe(gulp.dest('public/vendor/smoothie'));
	});
	gulp.task('random-color', function() {
	    return gulp.src('bower_components/randomcolor/randomColor.js')
	      .pipe(gulp.dest('public/vendor/random-color'));
	});
	
	// Default Task
	gulp.task('default', ['bootstrap','jquery','element-resize', 'smoothie', 'random-color']);
	```

2. To utilize these prototypes, we will create a file called [`public/js/chart.js`](./public/js/chart.js)

	This file is quite large and abstracts the `smoothie.js` prototypes for us in terms of tone types and objects. Due to it's size, let's just copy the entire file over and go over it.

3. Next, we'll create a file called [`public/js/process.js`](./public/js/process.js) to create and manipulate one of these `Chart` prototypes

	```js
	var TONE_TYPES = {
	    emotion: {
	        text: 'Emotion',
	        position: 'left',
	        traits: ['anger', 'disgust', 'fear', 'joy', 'sadness']
	    },
	    language: {
	        text: 'Language',
	        position: 'middle',
	        traits: ['analytical', 'confident', 'tentative']
	    },
	    social: {
	        text: 'Social',
	        position: 'right',
	        traits: ['openness_big5', 'conscientiousness_big5', 'extraversion_big5', 'agreeableness_big5', 'emotional_range_big5']
	    }
	};
	// Tone Level Constants
	var TONE_LEVELS = {
	    document: {
	        text: 'Document'
	    },
	    sentence: {
	        text: 'Sentence'
	    }
	};

	var toneChart;
	window.onload = function () {
	    toneChart = new Chart('toneLine', 'timeLine', TONE_TYPES, TONE_LEVELS);
	    toneChart.startCharting('emotion', 'sentence');
	};
	```

4. We need to add one small div below the Speech to Text results box to display the chart within [`public/index.html`](./public/index.html)

	```html
	<div class="row">
        <div id="timeline" class="col-md-12">
            <!-- smoothie chart -->
        </div>
    </div>
    <!-- row -->
	```	
	
	Let's also add these new scripts to the bottom of the file
	
	```html
    <script type="text/javascript" src="vendor/javascript-detect-element-resize/detect-element-resize.js"></script>
    <script type="text/javascript" src="vendor/smoothie/smoothie.js"></script>
    <script type="text/javascript" src="vendor/random-color/randomColor.js"></script>
    <script type="text/javascript" src="js/chart.js"></script>
    <script type="text/javascript" src="js/process.js"></script>
	```

5. To pass our tone results to this global Chart object and update the timelines, we'll remove the global `lastToneResult` object and instead replace the corresponding code in the `toneCallback()` function inside [`public/js/tone.js`](./public/js/tone.js) with

	```js
	// Update Smoothie.js chart
	console.log(tone);
  	toneChart.plotTone(tone);
	```

6. Now let's update [`public/index.html`](./public/index.html) and [`public/js/save.js`](./public/js/save.js) so we can properly grab our tone result values

	```html
	<!--This goes in between the Text and Tone Level fields-->
	<div class="form-group">
		<label for="usr">Tone Type:</label>
		<input type="text" class="form-control" readonly id="toneTypeToSave">
	</div>
	```

	```js
	//Get last tone data result
	var tone = toneChart.getValues();
	if (tone) {
		$("#toneTypeToSave").val(toneChart.getType());
		$("#toneLevelToSave").val(toneChart.getLevel());
		$("#toneValueToSave").val(JSON.stringify(toneChart.getValues()[toneChart.getLevel()][toneChart.getType()], null, ' '));
	}
	...
	...
	...
	//Get data from Save form
	var dataToSend = {
		name: $("#nameToSave").val(),
		transcription: $("#textToSave").val(),
		toneType: $("#toneTypeToSave").val(),
		toneLevel: $("#toneLevelToSave").val(),
		toneValue: $("#toneValueToSave").val(),
	};
	```

6. Finally, we'll want to clean the chart lines each time we start a new session. Let's make a small addition to [`src/index.js`](./src/index.js) to do this

	```js
	$.subscribe('clearscreen', function() {
	  $('#resultsText').text('');
	  $('#resultsJSON').text('');
	  $('.error-row').hide();
	  $('.notification-row').hide();
	  $('.hypotheses > ul').empty();
	  $('#metadataTableBody').empty();
	  toneChart.clearTimeLines(); // <-- Add this line
	});
	```

7. Just as before, we need to rebuild our `public/js/index.js` file after the change to the `src/` folder

	```bash
	$ npm run build
	```

8. Test locally

9. Push the updated `realtime-tone` app back to Bluemix

Voila! We have finished creating our `realtime-tone` app and you now have your very own version running on Bluemix.

## Workshop Summary

We covered quite a few aspects of Bluemix over the course of this workshop. Here are just a few of the high-level concepts we covered:

* Cloud Foundry Runtimes
* Node.js on Bluemix
* Cloud Foundry CLI
* Logging on Bluemix
* Watson Developer Cloud Services
* Watson Speech to Text
* Developing locally with VCAP_SERVICES
* Using Managed DBaaS on Bluemix
* Cloudant
* Loopback APIs
* Microservices
* Watson Tone Analysis
* Watson Patterns

Feel free to ask about any of these or other Bluemix topics now that the workshop is over. Happy developing!

<!--Links--> 
[smoothie_url]: http://smoothiecharts.org/
[smoothie_file_url]: https://github.com/joewalnes/smoothie/blob/master/smoothie.js
[random_color_url]: https://randomcolor.llllll.li/