(function (exports) {

    // Toggle button position constants
    var LEFT = 'left',
        MIDDLE = 'middle',
        RIGHT = 'right';

    // Tone types
    // Add type here if another one becomes available
    var TONE_TYPES = {
        emotion: {
            text: 'Emotion',
            position: LEFT,
            tones: ['anger', 'disgust', 'fear', 'joy', 'sadness']
            },
        writing: {
            text: 'Writing',
            position: MIDDLE,
            tones: ['analytical', 'confident', 'tentative']
            },
        social: {
            text: 'Social',
            position: RIGHT,
            tones: ['openness_big5', 'conscientiousness_big5', 'extraversion_big5', 'agreeableness_big5', 'neuroticism_big5']
            }
    }

    // Tone Level Constants
    var TONE_LEVELS = {
        document: {
            text: 'Document'
        },
        sentence: {
            text: 'Sentence'
        }
    };

    // Tone Timeline Style Constants
    var LINE_WIDTH = 3,
        TIMELINES_STYLES = [[221, 65, 49], [1, 79, 131], [123, 194, 83], [249, 223, 60], [144, 167, 207]];

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
        this.setToneType(type);
        this.setToneLevel(level);

        // Create and set up canvas
        var anchor = document.getElementById(anchorElement);
        var canvas = document.createElement('canvas');
        canvas.width = anchor.parentElement.offsetWidth;
        canvas.height = 200;
        canvas.id = id;
        anchor.appendChild(canvas);
        this.chart.streamTo(canvas);

        // Add an event listener to adjust the canvas width when needed
        addResizeListener(anchor, function() {
            canvas.width = anchor.parentElement.offsetWidth;
        });
    }


    /**
     * Returns the last tone object received from the API
     */
    Chart.prototype.getTone = function () {
        return this.tone;
    };


    /**
     * Returns the tone type being tracked
     */
    Chart.prototype.getToneType = function () {
        return this.type;
    };


    /**
     * Returns the tone level being tracked
     */
    Chart.prototype.getToneLevel = function () {
        return this.level;
    };


    /**
     * Sets the chart's tone type
     */
    Chart.prototype.setToneType = function (newType) {
        if (TONE_TYPES.hasOwnProperty(newType)) {
            this.type = newType;
            console.log("Now tracking", newType, "type tone");
        }
        else
            console.error("Cannot set chart type to ", newType);
    }


    /**
     * Sets the chart's tone level
     */
    Chart.prototype.setToneLevel = function (newLevel) {
        if (TONE_LEVELS.hasOwnProperty(newLevel)) {
            this.level = newLevel;
            console.log("Now tracking", newLevel, "level tone");
        }
        else
            console.error("Cannot set chart level to ", newLevel);
    }


    /**
     * Creates controllers for the tone type, level, and individual timeseries
     */
    Chart.prototype.createControllers = function (anchorId) {
        // Create controller for tone type toggling
        var typeController = document.createElement('div');
        typeController.className = "button-row col-sm-offset-3 col-sm-6 col-xs-12";
        var typeButtons = document.createElement('div');
        typeButtons.className = "type-buttons";
        for (var toneType in TONE_TYPES) {
            typeButtons.appendChild(createTypeController(this, toneType, TONE_TYPES[toneType].position, TONE_TYPES[toneType].text));
        }

        // Insert node before the canvas element
        var anchor = document.getElementById(anchorId);
        typeController.appendChild(typeButtons);
        anchor.insertBefore(typeController, anchor.firstChild);

        // Create the control key for the Smoothiechart
        var controller = document.createElement('div');
        controller.id = controller.className = "controller row";

        // Create the controller for level tone toggling
        var levelController = document.createElement('div');
        levelController.className = "level-toggles-box col-sm-2";
        for (var toneLevel in TONE_LEVELS) {
            levelController.appendChild(createLevelController(this, toneLevel, TONE_LEVELS[toneLevel].text));
        }

        // Create the controller for timeseries switches
        var controlBar = document.createElement('div');
        controlBar.className = "control-bar col-sm-10 col-xs-12";
        controlBar.id = "controlBar";
        var controlRow = document.createElement('div');
        controlRow.className = "row control-row";
        controlBar.appendChild(controlRow);

        controller.appendChild(levelController);
        controller.appendChild(controlBar);
        anchor.appendChild(controller);
    };


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
        // Create a timeline for each tone
        var sentiment;
        for (var i = 0; i < TONE_TYPES[this.type].tones.length; i++) {
            this.timelines[TONE_TYPES[this.type].tones[i]] = new TimeSeries();
            this.chart.addTimeSeries(this.timelines[TONE_TYPES[this.type].tones[i]],
                                     createTimeSeriesOptions(TONE_TYPES[this.type].tones[i], i));

            // Add a timeseries control element to the key
            this.addControl(i, TONE_TYPES[this.type].tones[i], TONE_TYPES[this.type].tones.length);
        }
    };


    /**
     * Toggles charting for a specific tone category
     */
    Chart.prototype.toggleTimeLine = function (swatch) {
        if (swatch.dataset.state === 'on') {
            swatch.dataset.state = 'off';
            swatch.style.background = 'white'

            this.chart.removeTimeSeries(this.timelines[swatch.dataset.trait]);
        } else {
            swatch.dataset.state = 'on';
            swatch.style.background = swatch.dataset.mycolor;
            this.chart.addTimeSeries(this.timelines[swatch.dataset.trait], createTimeSeriesOptions(swatch.dataset.trait, swatch.dataset.index));
        }
    }


    /**
     * Adds a timeseries control to the Smoothiechart control bar
     */
    Chart.prototype.addControl = function (index, trait, length) {

        var rgb = "rgb(" + TIMELINES_STYLES[index][0] + "," + TIMELINES_STYLES[index][1] + "," + TIMELINES_STYLES[index][2] + ")";

        var toggle = document.createElement('div');
        var colClass = "col-sm-" + (Math.floor(12/length));
        if (index==0 && 12 % length) colClass += " col-sm-offset-" + (Math.floor((12 % length)/2));
        toggle.className = "tone-control " + colClass + " col-xs-4";

        // Creat a control element for toggling the timeseries line
        var swatch = document.createElement('div');
        swatch.className = "tone-swatch";
        swatch.style.borderColor = rgb;
        swatch.style.background = rgb;
        swatch.dataset.state = "on";
        swatch.dataset.trait = trait;
        swatch.dataset.index = index;
        swatch.dataset.mycolor = rgb;
        swatch.onclick = function (e) {
            this.toggleTimeLine(e.target)
        }.bind(this);

        // Create a label for the timeseries control
        var label = document.createElement('label');
        label.className = "tone-label";
        label.innerHTML = trait.split("_")[0];
        label.color = rgb;

        // Add control elements to the DOM
        toggle.appendChild(swatch)
        toggle.appendChild(label);
        document.getElementById('controlBar').firstChild.appendChild(toggle);
    }


    /**
     * Appends new plot points for the timelines
     * @param {Object} holds the doc and sentence tone for all types
     */
    Chart.prototype.plotTone = function (tone) {
        // Save last tone
        this.tone = tone;

        // Get the object representing the level and type of tone we are charting
        var toneLevel = tone[this.level];
        if ($.isEmptyObject(tone[this.level])) return;
        var subTone = tone[this.level][this.type];
        var tones = TONE_TYPES[this.type].tones;

        // Append new values to the respective tone timeline
        var date = new Date().getTime()
        for (var tone in tones)
            this.timelines[tones[tone]].append(date, subTone[tones[tone]]);
    };


    /**
     * Toggles the plot level between tone levels
     * @param {string} the new tone level
     */
    Chart.prototype.toggleToneLevel = function (newLevel) {
        if (this.level !== newLevel) {
            this.setToneLevel(newLevel);
            this.clearTimeLines();
            for (var level in TONE_LEVELS) {
                var activeString = (newLevel === level) ? " level-toggle-active" : "";
                document.getElementById(level+"Toggle").className = "level-toggle row" + activeString;
            }
        }
    };


    /**
     * Toggles the tone type that we are charting
     * @param {string} 'emotion', 'writing', or 'social'
     */
    Chart.prototype.toggleToneType = function (newType) {
        // Only accept valid type
        if (this.type !== newType) {
            this.setToneType(newType);
            this.removeTimeLines();
            this.addTimeLines();
            for (var type in TONE_TYPES) {
                typeToggle = document.getElementById(type+"Toggle");
                var activeString = (newType === type) ? "switch-button-active" : "switch-button-disabled";
                typeToggle.className = typeToggle.dataset.position + "-type-switch type-btn " + 
                                       typeToggle.dataset.type + "-switch " +
                                       activeString;
            }
        }
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
     * Removes all timelines and their controls
     */
    Chart.prototype.removeTimeLines = function () {
        this.clearTimeLines();
        this.timelines = [];
        var controlBar = document.getElementById('controlBar');
        while (controlBar.firstChild.firstChild) {
            controlBar.firstChild.removeChild(controlBar.firstChild.firstChild);
        }
    };

    exports.Chart = Chart;


    /**
     * Adds a controller to the type toggle box
     * @param {Chart} chart object the key controller will manipulate
     * @param {string} type toggle being added
     * @param {int} 1 for first, 2 for middle, 3 for last
     * @param {string} label for the toggle
     */
    function createTypeController(chart, type, position, text) {
        // Create the toggle div
        var typeToggle = document.createElement('a');
        typeToggle.id = type + "Toggle";
        typeToggle.className = ((chart.type === type) ? "switch-button-active " : "switch-button-disabled ") +
                                position + "-type-switch " +
                                "type-btn " + type + "-switch";
        typeToggle.innerHTML = text;
        typeToggle.dataset.type = type;
        typeToggle.dataset.position = position;
        typeToggle.onclick = function (e) {
            chart.toggleToneType(e.target.dataset.type);
        }.bind(chart);

        // Add type controller to the DOM
        return typeToggle;
    }


    /**
     * Adds a controller to the level toggle box
     * @param {Chart} chart object the key controller will manipulate
     * @param {string} level toggle being added
     * @param {string} label for the toggle
     */
    function createLevelController(chart, level, text) {
        // Create the toggle div
        var levelToggle = document.createElement('div');
        levelToggle.id = level + "Toggle";
        levelToggle.className = ((chart.level === level) ? "level-toggle-active " : "") + "level-toggle row";
        levelToggle.dataset.level = level;
        levelToggle.onclick = function (e) {
            chart.toggleToneLevel(e.target.dataset.level);
        }.bind(chart);

        // Create text element for the toggle button
        var levelToggleText = document.createElement('p');
        levelToggleText.className = "level-toggle-text";
        levelToggleText.innerHTML = text;
        levelToggleText.dataset.level = level;
        levelToggleText.onclick = function (e) {
            chart.toggleToneLevel(e.target.dataset.level);
        }.bind(chart);

        // Add level controller to the DOM
        levelToggle.appendChild(levelToggleText);
        return levelToggle;
    }


    /**
     * Creates a options needed for adding a TimeSeries
     * @param {string}  timeseries sentiment
     * @param {int}     index of TIMELINES_STYLES[] for timeseries styling
     */
    function createTimeSeriesOptions(sentiment, i) {
        return {
            sentiment: sentiment,
            strokeStyle: ('rgb(' + TIMELINES_STYLES[i][0] + ',' + TIMELINES_STYLES[i][1] + ',' + TIMELINES_STYLES[i][2] + ')'),
            fillStyle: ('rgba(' + TIMELINES_STYLES[i][0] + ',' + TIMELINES_STYLES[i][1] + ',' + TIMELINES_STYLES[i][2] + ',0.0)'),
            lineWidth: LINE_WIDTH
        };
    }

})(typeof exports === 'undefined' ? this : exports);