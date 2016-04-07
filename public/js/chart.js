(function (exports) {

    // Tone Type Constants
    var EMOTION = 'emotion',
        WRITING = 'writing',
        SOCIAL = 'social';

    // Tone Level Constants
    var DOC = 'document',
        SENTENCE = 'sentence';

    var LEFT = 'left',
        MIDDLE = 'middle',
        RIGHT = 'right';

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
    }

    /**
     * Adds a controller to the type toggle box
     * @param {Chart} chart object the key controller will manipulate
     * @param {Element} div element containing the controllers
     * @param {string} type toggle being added
     * @param {int} 1 for first, 2 for middle, 3 for last
     */
    function addTypeController(chart, typeButtons, type, position, text) {
        // Create the toggle div
        var typeToggle = document.createElement('a');
        var typeActiveClass;
        if (chart.type === EMOTION)
            typeActiveClass = (type === EMOTION) ? "switch-button-active " : "switch-button-disabled ";
        else if (chart.type === WRITING)
            typeActiveClass = (type === WRITING) ? "switch-button-active " : "switch-button-disabled ";
        else
            typeActiveClass = (type === SOCIAL) ? "switch-button-active " : "switch-button-disabled ";
        typeActiveClass += position + "-type-switch ";
        typeToggle.id = type + "Toggle";
        typeToggle.className = typeActiveClass + "type-btn " + type + "-switch";
        typeToggle.innerHTML = text;
        typeToggle.dataset.type = type;
        typeToggle.dataset.position = position;
        typeToggle.onclick = function (e) {
            chart.toggleToneType(e.target.dataset.type, e.target.dataset.position);
        }.bind(chart);
        typeToggle.id = type + "Toggle";

        typeButtons.appendChild(typeToggle);
    }

    /**
     * Adds a controller to the level toggle box
     * @param {Chart} chart object the key controller will manipulate
     * @param {Element} div element containing the controllers
     * @param {string} level toggle being added
     */
    function addLevelController(chart, levelController, level) {
        // Create the toggle div
        var levelToggle = document.createElement('div');
        var levelToggleClass;
        if (chart.level === DOC)
            levelToggleClass = (level === DOC) ? "levelToggle levelToggleActive" : "levelToggle";
        else
            levelToggleClass = (level === DOC) ? "levelToggle" : "levelToggle levelToggleActive";
        levelToggle.className = "row " + levelToggleClass;
        levelToggle.dataset.level = level;
        levelToggle.onclick = function (e) {
            chart.toggleToneLevel(e.target.dataset.level);
        }.bind(chart);
        levelToggle.id = level + "Toggle";

        // Create text element for the toggle button
        var levelToggleText = document.createElement('p');
        levelToggleText.className = "levelToggleText";
        levelToggleText.innerHTML = (level === DOC) ? "Document" : "Sentence";
        levelToggleText.dataset.level = level;
        levelToggleText.onclick = function (e) {
            chart.toggleToneLevel(e.target.dataset.level);
        }.bind(chart);
        levelToggle.appendChild(levelToggleText);

        levelController.appendChild(levelToggle);
    }

    /**
     * Creates controllers for the tone type, level, and individual timeseries
     */
    Chart.prototype.createControllers = function (anchorId) {

        // Create controller for the tone type
        var typeController = document.createElement('div');
        typeController.className = "col-sm-offset-3 col-xs-offset-1 col-sm-6 col-xs-10";
        var typeButtons = document.createElement('div');
        typeButtons.className = "type-buttons";
        addTypeController(this, typeButtons, EMOTION, LEFT, "Emotion");
        addTypeController(this, typeButtons, SOCIAL, MIDDLE, "Social");
        addTypeController(this, typeButtons, WRITING, RIGHT, "Writing");

        // Insert node before the canvas element
        var anchor = document.getElementById(anchorId);
        typeController.appendChild(typeButtons);
        anchor.insertBefore(typeController, anchor.firstChild);

        // Create the control key for the Smoothiechart
        var controller = document.createElement('div');
        controller.id = controller.className = "controller";

        // Create the controller for doc/sentence level tone switching
        var levelController = document.createElement('div');
        levelController.className = "levelTogglesBox col-sm-2";
        addLevelController(this, levelController, DOC);
        addLevelController(this, levelController, SENTENCE);

        // Create the controller for timeseries switches
        var controlBar = document.createElement('div');
        controlBar.className = "controlBar col-sm-10";
        controlBar.id = "controlBar";
        var controlRow = document.createElement('div');
        controlRow.className = "row controlRow";
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
            this.chart.addTimeSeries(this.timelines[tones[i]], createTimeSeriesOptions(tones[i], i));

            // Add a timeseries control element to the key
            this.addControl(i, tones[i], tones.length);
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
        toggle.className = "toneControl " + colClass;

        // Creat a control element for toggling the timeseries line
        var swatch = document.createElement('div');
        swatch.className = "toneSwatch";
        swatch.style.borderColor = rgb;
        swatch.style.background = rgb;
        swatch.dataset.state = "on";
        swatch.dataset.trait = trait;
        swatch.dataset.index = index;
        swatch.dataset.mycolor = rgb;
        swatch.onclick = function (e) {
            console.log(this)
            this.toggleTimeLine(e.target)
        }.bind(this);

        // Create a label for the timeseries control
        var label = document.createElement('label');
        label.className = "toneLabel";
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
        console.log(tone)
        // Get the object representing the level of tone we are charting
        // If tracking sentence level and not present, return
        var levelTone;
        if (this.level === DOC)
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
     * @param {string} the new tone level
     */
    Chart.prototype.toggleToneLevel = function (newLevel) {
        if (this.level !== newLevel) {
            this.level = newLevel;
            this.clearTimeLines();
            var swapLevelString = (newLevel === DOC) ? SENTENCE : DOC;
            document.getElementById(newLevel+"Toggle").className = "levelToggle levelToggleActive"
            document.getElementById(swapLevelString+"Toggle").className = "levelToggle"
            console.log("Now tracking", newLevel, "level tone");
        }
    };

    /**
     * Toggles the tone type that we are charting
     * @param {string} 'emotion', 'writing', or 'social'
     */
    Chart.prototype.toggleToneType = function (newType, position) {
        // Only accept valid type
        if (this.type !== newType) {
            if (newType === EMOTION || newType === WRITING || newType === SOCIAL) {
                this.type = newType;

                this.removeTimeLines();
                this.addTimeLines();

                // Change classes
                var eSwitch = document.getElementById(EMOTION+"Toggle"),
                    sSwitch = document.getElementById(SOCIAL+"Toggle"),
                    wSwitch = document.getElementById(WRITING+"Toggle");
                if (newType === EMOTION) {
                    eSwitch.className = "switch-button-active " + 
                                        eSwitch.dataset.position + "-type-switch type-btn " + 
                                        eSwitch.dataset.type + "-switch";
                    sSwitch.className = "switch-button-disabled " + 
                                        sSwitch.dataset.position + "-type-switch type-btn " + 
                                        sSwitch.dataset.type + "-switch";
                    wSwitch.className = "switch-button-disabled " + 
                                        wSwitch.dataset.position + "-type-switch type-btn " + 
                                        wSwitch.dataset.type + "-switch";
                }
                else if (newType === SOCIAL) {
                    eSwitch.className = "switch-button-disabled " + 
                                        eSwitch.dataset.position + "-type-switch type-btn " + 
                                        eSwitch.dataset.type + "-switch";
                    sSwitch.className = "switch-button-active " + 
                                        sSwitch.dataset.position + "-type-switch type-btn " + 
                                        sSwitch.dataset.type + "-switch";
                    wSwitch.className = "switch-button-disabled " + 
                                        wSwitch.dataset.position + "-type-switch type-btn " + 
                                        wSwitch.dataset.type + "-switch";
                }

                else if (newType === WRITING) {
                    eSwitch.className = "switch-button-disabled " + 
                                        eSwitch.dataset.position + "-type-switch type-btn " + 
                                        eSwitch.dataset.type + "-switch";
                    sSwitch.className = "switch-button-disabled " + 
                                        sSwitch.dataset.position + "-type-switch type-btn " + 
                                        sSwitch.dataset.type + "-switch";
                    wSwitch.className = "switch-button-active " + 
                                        wSwitch.dataset.position + "-type-switch type-btn " + 
                                        wSwitch.dataset.type + "-switch";
                }
                console.log("Now tracking", newType, "tone");
            } else
                console.error("Attempted to change to invalid tone type");
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

})(typeof exports === 'undefined' ? this : exports);