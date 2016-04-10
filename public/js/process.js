var toneChart;
window.onload = function () {
    toneChart = new Chart('toneLine', 'timeLine', 'sentence', 'emotion');
    toneChart.createControllers('timeLine');
    toneChart.addTimeLines();
    //simulate();
}

function simulate() {

    var max = 100;
    var min = 0;

    setInterval(function () {

        var docTrait1 = Math.floor(Math.random() * (max - min + 1) + min);
        var docTrait2 = Math.floor(Math.random() * (max - docTrait1 - min + 1) + min);
        var docTrait3 = Math.floor(Math.random() * (max - docTrait2 - docTrait1 - min + 1) + min);
        var docTrait4 = Math.floor(Math.random() * (max - docTrait2 - docTrait1 - docTrait3 - min + 1) + min);
        var docTrait5 = Math.floor(Math.random() * (max - docTrait2 - docTrait1 - docTrait4 - min + 1) + min);

        var senTrait1 = Math.floor(Math.random() * (max - min + 1) + min);
        var senTrait2 = Math.floor(Math.random() * (max - senTrait1 - min + 1) + min);
        var senTrait3 = Math.floor(Math.random() * (max - senTrait2 - senTrait1 - min + 1) + min);
        var senTrait4 = Math.floor(Math.random() * (max - senTrait2 - senTrait1 - senTrait3 - min + 1) + min);
        var senTrait5 = Math.floor(Math.random() * (max - senTrait2 - senTrait1 - senTrait4 - min + 1) + min);

        // Create dummy tone object
        var tone = {
            doc: {
                emotion: {
                    anger: docTrait1,
                    disgust: docTrait2,
                    fear: docTrait3,
                    joy: docTrait4,
                    sadness: docTrait5
                },
                writing: {
                    analytical: docTrait1,
                    confident: docTrait2,
                    tentative: docTrait3
                },
                social: {
                    openness_big5: docTrait1,
                    conscientiousness_big5: docTrait2,
                    extraversion_big5: docTrait3,
                    agreeableness_big5: docTrait4,
                    neuroticism_big5: docTrait5
                }
            },
            sentence: {
                emotion: {
                    anger: senTrait1,
                    disgust: senTrait2,
                    fear: senTrait3,
                    joy: senTrait4,
                    sadness: senTrait5
                },
                writing: {
                    analytical: senTrait1,
                    confident: senTrait2,
                    tentative: senTrait3
                },
                social: {
                    openness_big5: senTrait1,
                    conscientiousness_big5: senTrait2,
                    extraversion_big5: senTrait3,
                    agreeableness_big5: senTrait4,
                    neuroticism_big5: senTrait5
                }
            }
        };

        // Plot new tone lines
        toneChart.plotTone(tone);
        console.log(toneChart.getTone());

    }, 2000);
}
