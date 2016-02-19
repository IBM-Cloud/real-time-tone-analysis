# Step 5: Real-Time Tone Charting

We are almost there! So far we have created our first Node.js app, embedded Speech to Text and Tone Analysis functionality into it, and connected to a database service on the back end. Getting the tone analysis in the last step was neat, but the user currently has no way of seeing these results. What would be nice is to show them the results in real time. Well, let's do just that by building them a chart.

## Setting up the chart

We could build a chart ourselves, but I don't think we quite have the time for that today. Instead, we will use [Smoothie Charts][smoothie_url] to automatically generate us a beautiful streaming chart. We'll of course want to make this extensible so we can chart all tone types, so we'll use a little syntactic sugar.

1. Download the [smoothie.js file][smoothie_file_url] from GitHub and add it to your app as a file called [`public/js/smoothie.js`](./public/js/smoothie.js)

2. To utilize these prototypes, we will create a file called [`public/js/chart.js`](./public/js/chart.js)

	```
	(function (exports) {

	    // Tone Type Constants
	    var EMOTION = 'emotion',
	        WRITING = 'writing',
	        SOCIAL = 'social';
	
	    // Tone Timeline Style Constants
	    var LINE_WIDTH = 3,
	        EMOTION_TONES = ['anger', 'disgust', 'fear', 'joy', 'sadness'],
	        WRITING_TONES = ['analytical', 'confident', 'tentative'],
	        SOCIAL_TONES = ['openness_big5', 'conscientiousness_big5', 'extraversion_big5', 'agreeableness_big5', 'neuroticism_big5'],
	        TIMELINES_STYLES = [[221, 65, 49], [1, 79, 131], [123, 194, 83], [249, 223, 60], [144, 167, 207]];
	
	    // TODO: Replace with jquery version
	    var Util = {
	        extend: function () {
	            arguments[0] = arguments[0] || {};
	            for (var i = 1; i < arguments.length; i++) {
	                for (var key in arguments[i]) {
	                    if (arguments[i].hasOwnProperty(key)) {
	                        if (typeof (arguments[i][key]) === 'object') {
	                            if (arguments[i][key] instanceof Array) {
	                                arguments[0][key] = arguments[i][key];
	                            } else {
	                                arguments[0][key] = Util.extend(arguments[0][key], arguments[i][key]);
	                            }
	                        } else {
	                            arguments[0][key] = arguments[i][key];
	                        }
	                    }
	                }
	            }
	            return arguments[0];
	        },
	        isEmpty: function (object) {
	            for (var prop in object) {
	                if (object.hasOwnProperty(prop))
	                    return false;
	            }
	
	            return true;
	        }
	    };
	
	    /**
	     * Initializes a chart object with a canvas and timeseries
	     * @param {string} chart id
	     * @param {string} canvas object's DOM parent id
	     * @param {bool} true for doc, false for sentence
	     * @param {string} 'emotion', 'writing', or 'social'
	     * @param {Object} optional configuration settings for new SmoothChart
	     */
	    function Chart(id, anchorElement, level, type, configs) {
	        // Itialize chart
	        this.configs = $.extend({}, Chart.defaultConfigs, configs);
	        this.chart = new SmoothieChart(configs);
	        this.timelines = [];
	
	        // Start tracking input level and type
	        this.level = level;
	        if (type === EMOTION || type === WRITING || type === SOCIAL)
	            this.type = type;
	        else
	            this.type = EMOTION;
	
	        // Create and set up canvas
	        var anchor = document.getElementById(anchorElement);
	        this.canvas = document.createElement('canvas');
	        this.canvas.width = anchor.parentElement.offsetWidth;
	        this.canvas.height = 200;
	        this.canvas.id = id;
	        anchor.appendChild(this.canvas);
	        this.chart.streamTo(this.canvas);
	
	        this.controlBar = document.createElement('div');
	        this.controlBar.className = "controlBar";
	
	        anchor.appendChild(this.controlBar);
	    }
	
	    // Default configuration settings for the SmoothieChart
	    Chart.defaultConfigs = {
	        grid: {
	            strokeStyle: 'rgb(120, 119, 130)',
	            fillStyle: 'rgb(151, 149, 163)',
	            lineWidth: 1,
	            millisPerLine: 500,
	            verticalSections: 6
	        },
	        labels: {
	            fillStyle: 'rgb(60, 0, 0)'
	        }
	    }
	
	    /**
	     * Adds tone timelines to the chart
	     */
	    Chart.prototype.addTimeLines = function () {
	        // Get tones corresponding to current type
	        var tones;
	        if (this.type === EMOTION) tones = EMOTION_TONES;
	        else if (this.type === WRITING) tones = WRITING_TONES;
	        else if (this.type === SOCIAL) tones = SOCIAL_TONES;
	
	
	
	
	        // Create a timeline for each tone
	        var sentiment;
	        for (var i = 0; i < tones.length; i++) {
	            this.timelines[tones[i]] = new TimeSeries();
	            sentiment = {
	                sentiment: tones[i],
	                strokeStyle: ('rgb(' + TIMELINES_STYLES[i][0] + ',' + TIMELINES_STYLES[i][1] + ',' + TIMELINES_STYLES[i][2] + ')'),
	                fillStyle: ('rgba(' + TIMELINES_STYLES[i][0] + ',' + TIMELINES_STYLES[i][1] + ',' + TIMELINES_STYLES[i][2] + ',0.0)'),
	                lineWidth: LINE_WIDTH
	            };
	            this.chart.addTimeSeries(this.timelines[tones[i]], sentiment);
	
	            this.addControl(i, TIMELINES_STYLES[i], tones[i]);
	        }
	    };
	
	    Chart.prototype.toggleTimeLine = function (swatch) {
	        if (swatch.dataset.state === 'on') {
	            swatch.dataset.state = 'off';
	            swatch.style.background = 'white'
	            this.chart.removeTimeSeries(this.timelines[swatch.dataset.trait]);
	        } else {
	            swatch.dataset.state = 'on';
	            swatch.style.background = swatch.dataset.mycolor;
	            this.chart.addTimeSeries(this.timelines[swatch.dataset.trait], swatch.dataset.trait);
	        }
	    }
	
	    Chart.prototype.addControl = function (index, color, trait) {
	
	        var rgb = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
	
	        var toggle = document.createElement('div');
	        toggle.className = "toneControl";
	
	        var swatch = document.createElement('div');
	        swatch.className = "toneSwatch";
	        swatch.style.borderColor = rgb;
	        swatch.dataset.state = "on";
	        swatch.dataset.trait = trait;
	        swatch.dataset.index = index;
	        swatch.dataset.mycolor = rgb;
	        swatch.onclick = function (e) {
	            this.toggleTimeLine(e.target)
	        }.bind(this);
	
	        var swatchInner = document.createElement('div');
	        swatchInner.className = "toneSwatchInner";
	
	        //        swatch.appendChild(swatchInner);
	
	        var label = document.createElement('label');
	        label.className = "toneLabel";
	        label.innerHTML = trait;
	        label.color = rgb;
	
	        toggle.appendChild(swatch)
	        toggle.appendChild(label);
	
	        swatch.style.background = rgb;
	
	
	        this.controlBar.appendChild(toggle);
	    }
	
	    /**
	     * Appends new plot points for the timelines
	     * @param {Object} holds the doc and sentence tone for all types
	     */
	    Chart.prototype.plotTone = function (tone) {
	        // Get the object representing the level of tone we are charting
	        // If tracking sentence level and not present, return
	        var levelTone;
	        if (this.level)
	            levelTone = tone.doc;
	        else if (Util.isEmpty(tone.sentence))
	            return;
	        else
	            levelTone = tone.sentence;
	
	        // Get the object representing the type of tone we are charting
	        var subTone, tones;
	        if (this.type === EMOTION) {
	            subTone = levelTone.emotion;
	            tones = EMOTION_TONES;
	        } else if (this.type === WRITING) {
	            subTone = levelTone.writing;
	            tones = WRITING_TONES;
	        } else if (this.type === SOCIAL) {
	            subTone = levelTone.social;
	            tones = SOCIAL_TONES;
	        }
	
	        // Append new values to the respective tone timeline
	        var date = new Date().getTime()
	        for (var tone in tones)
	            this.timelines[tones[tone]].append(date, subTone[tones[tone]]);
	    };
	
	    /**
	     * Toggles the plot level between doc and sentence tone
	     * @param {bool} true for doc, false for sentence
	     */
	    Chart.prototype.toggleToneLevel = function (newLevel) {
	        this.level = newLevel;
	        this.clearTimeLines();
	        var levelString = (newLevel) ? "doc" : "sentence";
	        console.log("Now tracking", levelString, "level tone");
	    };
	
	    /**
	     * Toggles the tone type that we are charting
	     * @param {string} 'emotion', 'writing', or 'social'
	     */
	    Chart.prototype.toggleToneType = function (newType) {
	        // Only accept valid type
	        if (newType === EMOTION || newType === WRITING || newType === SOCIAL) {
	            this.type = newType;
	            console.log("Now tracking", newType, "tone");
	
	            this.removeTimeLines();
	            this.addTimeLines();
	        } else
	            console.error("Attempted to change to invalid tone type");
	    };
	
	    /**
	     * Clears all timelines in the chart
	     */
	    Chart.prototype.clearTimeLines = function () {
	        for (var tone in this.timelines) {
	            // Skip loop if the property is from prototype
	            if (!this.timelines.hasOwnProperty(tone)) continue;
	            this.timelines[tone].clear();
	        }
	    };
	
	    /**
	     * Removes all timelines currently in the chart
	     */
	    Chart.prototype.removeTimeLines = function () {
	        this.clearTimeLines();
	        this.timelines = [];
	    };

    	exports.Chart = Chart;

	})(typeof exports === 'undefined' ? this : exports);
	```
	This file abstracts the `smoothie.js` prototypes for us in terms of tone types and objects.

3. Next, we'll create a file called [`public/js/process.js`](./public/js/process.js) to create and manipulate one of these `Chart` prototypes

	```
	var toneChart;
	window.onload = function () {
	    toneChart = new Chart('toneline', 'timeline', false, 'emotion');
	    toneChart.addTimeLines();
	}
	```

4. We need to add one small div below the Speech to Text results box to display the chart within [`public/index.html`](./public/index.html)

	```
	<div class="row">
        <div id="timeline" class="col-md-12">
            <!-- smoothie chart -->
        </div>
    </div>
    <!-- row -->
	```	
	
	Let's also add these new scripts to the bottom of the file
	
	```
	<script type="text/javascript" src="js/smoothie.js"></script>
   <script type="text/javascript" src="js/chart.js"></script>
   <script type="text/javascript" src="js/process.js"></script>
	```

5. To pass our tone results to this global Chart object and update the lines, we'll add a single line of code to the `toneCallback()` function in [`public/js/tone/js`](./public/js/tone.js)

	```
	// Update Smoothie.js chart
  	toneChart.plotTone(tone);
	```

6. Finally, we'll want to clean the chart lines each time we start a new session. Let's make a small addition to [`src/index.js`](./src/index.js) to do this

	```
	$.subscribe('clearscreen', function() {
	  $('#resultsText').text('');
	  $('#resultsJSON').text('');
	  $('.error-row').hide();
	  $('.notification-row').hide();
	  $('.hypotheses > ul').empty();
	  $('#metadataTableBody').empty();
	  toneChart.clearTimeLines(); <-- Add this line
	});
	```

7. Just as before, we need to rebuild our `public/js/index.js` file after the change to the `src/` folder

	```
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