(function (exports) {

    // Converts hex color values into rgb
    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    // Return a string value of the rgb/rgba object
    function rgbToString(color, a){
        if (a)
            return "rgba(" + color.r + "," + color.g + "," + color.b + "," + a + ")";
        else
            return "rgb(" + color.r + "," + color.g + "," + color.b + ")";
    }

    /**
     * Initializes a chart object with a canvas and timeseries
     * @param {string} chart id
     * @param {string} canvas object's DOM parent id
     * @param {Object} trait types being charted
     * @param {Object} trait levels being charted
     * @param {Object} optional configuration settings for new SmoothChart
     */
    function Chart(id, anchorId, types, levels, configs) {
        // Itialize chart
        this.configs = $.extend({}, Chart.defaultConfigs, configs);
        this.chart = new SmoothieChart(configs);

        // Add random colors to type traits
        for (var type in types) {
            // Get array of random colors
            var colors = randomColor({
               count: types[type].traits.length,
               luminosity: 'bright',
               hue: 'random'
            });
            // Convert hex values to rgb
            for (var i=0; i < colors.length; i++) {
                colors[i] = hexToRgb(colors[i]);
            }
            // Add colors array to each type
            types[type].colors = colors;
        }
        this.types = types;

        this.levels = levels;
        this.timelines = [];

        // Create and set up canvas
        var anchor = document.getElementById(anchorId);
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

        // Create chart controllers and add timelines
        this.createControllers(anchorId);
        this.addTimeLines();
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
    };


    /**
     * Returns the last plotted values object
     */
    Chart.prototype.getValues = function () {
        return this.values;
    };


    /**
     * Returns the type being tracked
     */
    Chart.prototype.getType = function () {
        return this.type;
    };


    /**
     * Returns the level being tracked
     */
    Chart.prototype.getLevel = function () {
        return this.level;
    };


    /**
     * Sets the chart's type
     */
    Chart.prototype.setType = function (newType) {
        if (this.types.hasOwnProperty(newType)) {
            this.type = newType;
            console.log("Now tracking", newType, "type");
        }
        else
            console.error("Cannot set chart type to ", newType);
    };


    /**
     * Sets the chart's level
     */
    Chart.prototype.setLevel = function (newLevel) {
        if (this.levels.hasOwnProperty(newLevel)) {
            this.level = newLevel;
            console.log("Now tracking", newLevel, "level");
        }
        else
            console.error("Cannot set chart level to ", newLevel);
    };


    /**
     * Creates controllers for the type, level, and individual timeseries
     */
    Chart.prototype.createControllers = function (anchorId) {
        // Create controller for type toggling
        var typeController = document.createElement('div');
        typeController.className = "button-row col-sm-offset-3 col-sm-6 col-xs-12";
        var typeButtons = document.createElement('div');
        typeButtons.className = "type-buttons";
        for (var type in this.types) {
            typeButtons.appendChild(createTypeController(this, type,
                                                         this.types[type].position,
                                                         this.types[type].text));
        }

        // Insert node before the canvas element
        var anchor = document.getElementById(anchorId);
        typeController.appendChild(typeButtons);
        anchor.insertBefore(typeController, anchor.firstChild);

        // Create the control key for the Smoothiechart
        var controller = document.createElement('div');
        controller.id = controller.className = "controller row";

        // Create the controller for level toggling
        var levelController = document.createElement('div');
        levelController.className = "level-toggles-box col-sm-2";
        for (var level in this.levels) {
            levelController.appendChild(createLevelController(this, level,
                                                              this.levels[level].text));
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


    /**
     * Adds timelines for the type traits to the chart
     */
    Chart.prototype.addTimeLines = function () {
        // Create a timeline for each trait in all of the categories
        for (var type in this.types) {
            for (var i = 0; i < this.types[type].traits.length; i++) {
                // Add a timeline for the current trait for each level
                for (var level in this.levels) {
                    this.timelines[this.types[type].traits[i]+"-"+level] = new TimeSeries();
                }
            }
        }
    };


    /**
     * Toggles charting for a specific trait
     */
    Chart.prototype.toggleTimeLine = function (swatch) {
        if (swatch.dataset.state === 'on') {
            swatch.dataset.state = 'off';
            swatch.style.background = 'white';

            this.chart.removeTimeSeries(this.timelines[swatch.dataset.trait+"-"+swatch.dataset.level]);
        } else {
            swatch.dataset.state = 'on';
            var swatchColor = {r:swatch.dataset.red,g:swatch.dataset.green,b:swatch.dataset.blue};
            swatch.style.background = rgbToString(swatchColor);
            this.chart.addTimeSeries(this.timelines[swatch.dataset.trait+"-"+swatch.dataset.level],
                                     createTimeSeriesOptions(swatch.dataset.trait, swatchColor));
        }
    };


    /**
     * Adds a timeseries control to the Smoothiechart control bar
     */
    Chart.prototype.addControl = function (index, trait, color, level, length) {
        var rgb = rgbToString(color);

        var toggle = document.createElement('div');
        var colClass = "col-sm-" + (Math.floor(12/length));
        if (index===0 && 12 % length) colClass += " col-sm-offset-" + (Math.floor((12 % length)/2));
        toggle.className = "trait-control " + colClass + " col-xs-4";

        // Creat a control element for toggling the timeseries line
        var swatch = document.createElement('div');
        swatch.className = "trait-swatch";
        swatch.style.borderColor = rgb;
        swatch.style.background = rgb;
        swatch.dataset.state = "on";
        swatch.dataset.trait = trait;
        swatch.dataset.level = level;
        swatch.dataset.index = index;
        swatch.dataset.red = color.r;
        swatch.dataset.green = color.g;
        swatch.dataset.blue = color.b;
        swatch.onclick = function (e) {
            this.toggleTimeLine(e.target);
        }.bind(this);

        // Create a label for the timeseries control
        var label = document.createElement('label');
        label.className = "trait-label";
        var traitStringArray = trait.split("_");
        // Concatenate traits with underscores and remove 'big5' string
        if (traitStringArray.length > 1) {
            for (var i=0; i < traitStringArray.length; i++) {
                if (traitStringArray[i] !== "big5") {
                    label.innerHTML += traitStringArray[i] + " ";
                }
            }
            label.innerHTML.trim();
        }
        else
            label.innerHTML = trait;
        label.color = rgb;

        // Add control elements to the DOM
        toggle.appendChild(swatch);
        toggle.appendChild(label);
        document.getElementById('controlBar').firstChild.appendChild(toggle);
    };


    /**
     * Appends new plot points for the timelines
     * @param {Object} holds values to be plotted
     */
    Chart.prototype.plotValues = function (values) {
        // Save last plotted values
        this.values = values;

        // Loop thru levels in new values
        var date = new Date().getTime();
        for (var level in this.levels) {
            if ($.isEmptyObject(values[level])) continue;

            // Loop through types in the current level of new values
            for (var type in this.types) {
                if ($.isEmptyObject(values[level][type])) continue;

                // Chart each new trait value for the current type/level
                for (var trait in values[level][type]) {
                    this.timelines[trait+"-"+level].append(date, values[level][type][trait]);
                }
            }
        }
    };


    /**
     * Start charting for the input type and level
     * @param {string} the new type
     * @param {string} the new level
     * @param {string} the old type that was being charted
     * @param {string} the old level that was being charted
     */
    Chart.prototype.startCharting = function (newType, newLevel, oldType, oldLevel) {
        // Set new values
        if (newType !== oldType) {
            this.setType(newType);
            for (var type in this.types) {
                typeToggle = document.getElementById(type+"Toggle");
                typeToggle.className = ((newType === type) ? "switch-button-active " : "switch-button-disabled ") +
                                       typeToggle.dataset.position + "-type-switch type-btn " + 
                                       typeToggle.dataset.type + "-switch";
            }
        }
        if (newLevel !== oldLevel) {
            this.setLevel(newLevel);
            for (var level in this.levels) {
                var levelToggle = document.getElementById(level+"Toggle");
                levelToggle.className = ((newLevel === level) ? "level-toggle-active " : "") +
                                        "level-toggle row";
            }
        }

        // Remove old controls and timelines
        if (oldType) {
            for (var i = 0; i < this.types[oldType].traits.length; i++) {
                this.chart.removeTimeSeries(this.timelines[this.types[oldType].traits[i]+"-"+oldLevel]);
            }
            this.removeControls();
        }

        // Add new timelines and controls
        for (var i = 0; i < this.types[newType].traits.length; i++) {
            this.chart.addTimeSeries(this.timelines[this.types[newType].traits[i]+"-"+newLevel],
                                     createTimeSeriesOptions(this.types[newType].traits[i], this.types[newType].colors[i]));
            this.addControl(i, this.types[newType].traits[i], this.types[newType].colors[i], newLevel, this.types[newType].traits.length);
        }
    };


    /**
     * Toggles the plot level that we are charting
     * @param {string} the new level
     */
    Chart.prototype.toggleLevel = function (newLevel) {
        if (this.level !== newLevel) {
            this.startCharting(this.type, newLevel, this.type, this.level);
        }
    };


    /**
     * Toggles the type that we are charting
     * @param {string} the new type
     */
    Chart.prototype.toggleType = function (newType) {
        // Only accept valid type
        if (this.type !== newType) {
            this.startCharting(newType, this.level, this.type, this.level);
        }
    };


    /**
     * Clears all timelines in the chart
     */
    Chart.prototype.clearTimeLines = function () {
        for (var trait in this.timelines) {
            // Skip loop if the property is from prototype
            if (!this.timelines.hasOwnProperty(trait)) continue;
            this.timelines[trait].clear();
        }
    };


    /**
     * Removes all timelines and their controls
     */
    Chart.prototype.removeTimeLines = function () {
        this.clearTimeLines();
        this.timelines = [];
        this.removeControls();
    };


    /**
     * Removes all controls
     */
    Chart.prototype.removeControls = function () {
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
            chart.toggleType(e.target.dataset.type);
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
            chart.toggleLevel(e.target.dataset.level);
        }.bind(chart);

        // Create text element for the toggle button
        var levelToggleText = document.createElement('p');
        levelToggleText.className = "level-toggle-text";
        levelToggleText.innerHTML = text;
        levelToggleText.dataset.level = level;
        levelToggleText.onclick = function (e) {
            chart.toggleLevel(e.target.dataset.level);
        }.bind(chart);

        // Add level controller to the DOM
        levelToggle.appendChild(levelToggleText);
        return levelToggle;
    }


    /**
     * Creates a options needed for adding a TimeSeries
     * @param {string}  timeseries sentiment
     * @param {Object}  rgb color of the sentiment line
     */
    function createTimeSeriesOptions(sentiment, color) {
        return {
            sentiment: sentiment,
            strokeStyle: (rgbToString(color)),
            fillStyle: (rgbToString(color, "0.0")),
            lineWidth: 3
        };
    }

})(typeof exports === 'undefined' ? this : exports);