(function (exports) {

    // Tone Type Constants
    var EMOTION = 'emotion',
       WRITING = 'writing',
       SOCIAL = 'social';

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
            for(var prop in object) {
                if(object.hasOwnProperty(prop))
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
     * Adds lines to the chart
     * @param {Object} optional sentiments configs for the new lines
     */
    Chart.prototype.addLines = function (sentiments) {
        var sentimentString;
        var newSentiments = Util.extend({}, Chart.defaultSentiments, sentiments);
        for (var sentiment in newSentiments) {
            // Skip loop if the property is from prototype
            if (!newSentiments.hasOwnProperty(sentiment)) continue;
            sentimentString = newSentiments[sentiment].sentiment;
            this.timelines[sentimentString] = new TimeSeries();
            this.chart.addTimeSeries(this.timelines[sentimentString], newSentiments[sentiment]);
        }
    };

    /**
     * Appends new plot points for the timelines
     * @param {Object} holds the doc and sentence tone for all types
     */
     // TODO: Make extensible for other writing and social tone types
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
        var subTone;
        if (this.type === EMOTION)
            subTone = levelTone.emotion;
        else if (this.type === WRITING)
            subTone = levelTone.writing;
        else if (this.type === SOCIAL)
            subTone = levelTone.social;

        // Append new values to the respective tone timeline
        var date = new Date().getTime()
        if (this.type === EMOTION) {
            this.timelines['anger'].append(date, subTone.anger);
            this.timelines['disgust'].append(date, subTone.disgust);
            this.timelines['fear'].append(date, subTone.fear);
            this.timelines['joy'].append(date, subTone.joy);
            this.timelines['sadness'].append(date, subTone.sadness);
        }
    };

    /**
     * Toggles the plot level between doc and sentence tone
     * @param {bool} true for doc, false for sentence
     */
    Chart.prototype.toggleToneLevel = function (newLevel) {
        this.level = newLevel;
        var levelString = (newLevel) ? "doc" : "sentence";
        console.log("Now tracking", levelString, "level tone");
    };

    /**
     * Toggles the tone type that we are charting
     * @param {string} 'emotion', 'writing', or 'social'
     */
    Chart.prototype.toggleToneType = function (newType) {
        // Only accept valid type
        if (type === EMOTION || type === WRITING || type === SOCIAL) {
            this.type = type;
            console.log("Now tracking", type, "tone");
        }
        else
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

    // Default configuration settings for chart's canvas
    // TODO: Make extensible for other writing and social tone types
    var LINE_WIDTH = 3;
    Chart.defaultSentiments = [{
            sentiment: 'anger',
            strokeStyle: 'rgb(221, 65, 49)',
            fillStyle: 'rgba(221, 65, 49, 0.0)',
            lineWidth: LINE_WIDTH
        },
        {
            sentiment: 'disgust',
            strokeStyle: 'rgb(1, 79, 131)',
            fillStyle: 'rgba(1, 79, 131, 0.0)',
            lineWidth: LINE_WIDTH
        },
        {
            sentiment: 'fear',
            strokeStyle: 'rgb(123, 194, 83)',
            fillStyle: 'rgba(123, 194, 83, 0.0)',
            lineWidth: LINE_WIDTH
        },
        {
            sentiment: 'joy',
            strokeStyle: 'rgb(249, 223, 60)',
            fillStyle: 'rgba(249, 223, 60, 0.0)',
            lineWidth: LINE_WIDTH
        },
        {
            sentiment: 'sadness',
            strokeStyle: 'rgb(144, 167, 207)',
            fillStyle: 'rgba(144, 167, 207, 0.0)',
            lineWidth: LINE_WIDTH
        }
    ]

    exports.Chart = Chart;

})(typeof exports === 'undefined' ? this : exports);
