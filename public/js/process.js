/* We want to start the timeline when the dictation starts. 
   
   Just starting it onload to show it running for now. */


var angerStyle = {
    strokeStyle: 'rgb(221, 65, 49)',
    fillStyle: 'rgba(221, 65, 49, 0.0)',
    lineWidth: 3
}

var disgustStyle = {
    strokeStyle: 'rgb(1, 79, 131)',
    fillStyle: 'rgba(1, 79, 131, 0.0)',
    lineWidth: 3
}

var fearStyle = {
    strokeStyle: 'rgb(123, 194, 83)',
    fillStyle: 'rgba(123, 194, 83, 0.0)',
    lineWidth: 3
}

var joyStyle = {
    strokeStyle: 'rgb(249, 223, 60)',
    fillStyle: 'rgba(249, 223, 60, 0.0)',
    lineWidth: 3
}


var sadnessStyle = {
    strokeStyle: 'rgb(144, 167, 207)',
    fillStyle: 'rgba(144, 167, 207, 0.0)',
    lineWidth: 3
}



var angerLine = new TimeSeries();

var disgustLine = new TimeSeries({
    strokeStyle: 'rgb(0, 255, 0)',
    fillStyle: 'rgba(0, 255, 0, 0.4)',
    lineWidth: 3
});

var fearLine = new TimeSeries()
var joyLine = new TimeSeries()

var sadnessLine = new TimeSeries()

var tonePoint = {
    anger: 0.54,
    disgust: 0.4,
    fear: 0.03,
    joy: 0.01,
    sadness: 0.03
}


function plotTone(tone) {
    var date = new Date().getTime()

    angerLine.append(date, tone.anger * 100);
    disgustLine.append(date, tone.disgust * 100);
    fearLine.append(date, tone.fear * 100);
    joyLine.append(date, tone.joy * 100);
    sadnessLine.append(date, tone.sadness * 100);
}


function simulate() {

    var max = 100;
    var min = 0;

    var anger = Math.floor(Math.random() * (max - min + 1) + min) / 100;
    var joy = Math.floor(Math.random() * (max - anger - min + 1) + min) / 100;
    var disgust = Math.floor(Math.random() * (max - joy - anger - min + 1) + min) / 100;
    var fear = Math.floor(Math.random() * (max - joy - anger - disgust - min + 1) + min) / 100;
    var sadness = Math.floor(Math.random() * (max - joy - anger - fear - min + 1) + min) / 100;

    var tone = {
        anger: anger,
        disgust: disgust,
        fear: fear,
        joy: joy,
        sadness: sadness
    }

    plotTone(tone)
}

function startTimeLine() {

    // <canvas id="mycanvas" width="400" height="100"></canvas>

    var container = document.getElementById('container');

    var anchor = document.getElementById('timeline');

    var canvas = document.createElement('canvas')
    canvas.width = anchor.parentElement.offsetWidth;
    canvas.height = 200;
    canvas.id = "toneline"

    anchor.appendChild(canvas);

    var smoothie = new SmoothieChart({
        grid: {
            strokeStyle: 'rgb(120, 119, 130)',
            fillStyle: 'rgb(151, 149, 163)',
            lineWidth: 1,
            millisPerLine: 250,
            verticalSections: 6,
        },
        labels: {
            fillStyle: 'rgb(60, 0, 0)'
        }
    });

    smoothie.streamTo(document.getElementById("toneline"));



    // Add a random value to each line every second
    setInterval(function () {
        //        angerLine.append(new Date().getTime(), Math.random());
        //        disgustLine.append(new Date().getTime(), Math.random());
        //        fearLine.append(new Date().getTime(), Math.random());
        //        joyLine.append(new Date().getTime(), Math.random());
        //        sadnessLine.append(new Date().getTime(), Math.random());

        simulate()

    }, 2000);

    // Add to SmoothieChart
    smoothie.addTimeSeries(angerLine, angerStyle);
    smoothie.addTimeSeries(disgustLine, disgustStyle);
    smoothie.addTimeSeries(fearLine, fearStyle);
    smoothie.addTimeSeries(joyLine, joyStyle);
    smoothie.addTimeSeries(sadnessLine, sadnessStyle);


}

window.onload = function () {
    startTimeLine()
}