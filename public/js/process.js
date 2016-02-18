var toneChart;
window.onload = function () {
    toneChart = new Chart('toneline', 'timeline', false, 'emotion');
    toneChart.addTimeLines();
    //simulate();
}

function simulate() {

    var max = 100;
    var min = 0;

    setInterval(function () {

        var anger = Math.floor(Math.random() * (max - min + 1) + min);
        var joy = Math.floor(Math.random() * (max - anger - min + 1) + min);
        var disgust = Math.floor(Math.random() * (max - joy - anger - min + 1) + min);
        var fear = Math.floor(Math.random() * (max - joy - anger - disgust - min + 1) + min);
        var sadness = Math.floor(Math.random() * (max - joy - anger - fear - min + 1) + min);

        // Create dummy tone object
        var tone = {
            doc: {
                emotion: {
                    anger: anger,
                    disgust: disgust,
                    fear: fear,
                    joy: joy,
                    sadness: sadness
                },
                writing: {

                },
                social: {

                }
            },
            sentence: {
                emotion: {
                    anger: anger,
                    disgust: disgust,
                    fear: fear,
                    joy: joy,
                    sadness: sadness
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
