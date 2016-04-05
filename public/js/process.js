var toneChart;
window.onload = function () {
    toneChart = new Chart('toneline', 'timeline', 'sentence', 'emotion');
    toneChart.createControllers('controller');
    toneChart.addTimeLines();
    //simulate();
}

function simulate() {

    var max = 100;
    var min = 0;

    setInterval(function () {

        var docAnger = Math.floor(Math.random() * (max - min + 1) + min);
        var docJoy = Math.floor(Math.random() * (max - docAnger - min + 1) + min);
        var docDisgust = Math.floor(Math.random() * (max - docJoy - docAnger - min + 1) + min);
        var docFear = Math.floor(Math.random() * (max - docJoy - docAnger - docDisgust - min + 1) + min);
        var docSadness = Math.floor(Math.random() * (max - docJoy - docAnger - docFear - min + 1) + min);

        var senAnger = Math.floor(Math.random() * (max - min + 1) + min);
        var senJoy = Math.floor(Math.random() * (max - senAnger - min + 1) + min);
        var senDisgust = Math.floor(Math.random() * (max - senJoy - senAnger - min + 1) + min);
        var senFear = Math.floor(Math.random() * (max - senJoy - senAnger - senDisgust - min + 1) + min);
        var senSadness = Math.floor(Math.random() * (max - senJoy - senAnger - senFear - min + 1) + min);

        // Create dummy tone object
        var tone = {
            doc: {
                emotion: {
                    anger: docAnger,
                    disgust: docDisgust,
                    fear: docFear,
                    joy: docJoy,
                    sadness: docSadness
                },
                writing: {

                },
                social: {

                }
            },
            sentence: {
                emotion: {
                    anger: senAnger,
                    disgust: senDisgust,
                    fear: senFear,
                    joy: senJoy,
                    sadness: senSadness
                },
                writing: {

                },
                social: {

                }
            }
        };

        // Plot new tone lines
        toneChart.plotTone(tone);

    }, 2000);
}
