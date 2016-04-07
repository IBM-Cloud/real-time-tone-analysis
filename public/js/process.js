var toneChart;
window.onload = function () {
    toneChart = new Chart('toneline', 'timeline', 'sentence', 'emotion');
    toneChart.createControllers('timeline');
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
        
        var docAnalytical = Math.floor(Math.random() * (max - min + 1) + min);
        var docConfident = Math.floor(Math.random() * (max - docAnalytical - min + 1) + min);
        var docTentative = Math.floor(Math.random() * (max - docConfident - docAnalytical - min + 1) + min);

        var senAnalytical = Math.floor(Math.random() * (max - min + 1) + min);
        var senConfident = Math.floor(Math.random() * (max - senAnalytical - min + 1) + min);
        var senTentative = Math.floor(Math.random() * (max - senConfident - senAnalytical - min + 1) + min);

        var docOpenness = Math.floor(Math.random() * (max - min + 1) + min);
        var docConscientiousness = Math.floor(Math.random() * (max - docOpenness - min + 1) + min);
        var docExtraversion = Math.floor(Math.random() * (max - docConscientiousness - docOpenness - min + 1) + min);
        var docAgreeableness = Math.floor(Math.random() * (max - docConscientiousness - docOpenness - docExtraversion - min + 1) + min);
        var docNeuroticism = Math.floor(Math.random() * (max - docConscientiousness - docOpenness - docAgreeableness - min + 1) + min);

        var senOpenness = Math.floor(Math.random() * (max - min + 1) + min);
        var senConscientiousness = Math.floor(Math.random() * (max - senOpenness - min + 1) + min);
        var senExtraversion = Math.floor(Math.random() * (max - senConscientiousness - senOpenness - min + 1) + min);
        var senAgreeableness = Math.floor(Math.random() * (max - senConscientiousness - senOpenness - senExtraversion - min + 1) + min);
        var senNeuroticism = Math.floor(Math.random() * (max - senConscientiousness - senOpenness - senAgreeableness - min + 1) + min);

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
                    analytical: docAnalytical,
                    confident: docConfident,
                    tentative: docTentative
                },
                social: {
                    openness_big5: docOpenness,
                    conscientiousness_big5: docConscientiousness,
                    extraversion_big5: docExtraversion,
                    agreeableness_big5: docAgreeableness,
                    neuroticism_big5: docNeuroticism
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
                    analytical: senAnalytical,
                    confident: senConfident,
                    tentative: senTentative
                },
                social: {
                    openness_big5: senOpenness,
                    conscientiousness_big5: senConscientiousness,
                    extraversion_big5: senExtraversion,
                    agreeableness_big5: senAgreeableness,
                    neuroticism_big5: senNeuroticism
                }
            }
        };

        // Plot new tone lines
        toneChart.plotTone(tone);

    }, 2000);
}
