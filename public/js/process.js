// Tone types
// Add type here if another one becomes available
var TONE_TYPES = {
    emotion: {
        text: 'Emotion',
        position: 'left',
        traits: ['anger', 'disgust', 'fear', 'joy', 'sadness']
    },
    language: {
        text: 'Language',
        position: 'middle',
        traits: ['analytical', 'confident', 'tentative']
    },
    social: {
        text: 'Social',
        position: 'right',
        traits: ['openness_big5', 'conscientiousness_big5', 'extraversion_big5', 'agreeableness_big5', 'emotional_range_big5']
    }
};

// Tone Level Constants
var TONE_LEVELS = {
    document: {
        text: 'Document'
    },
    sentence: {
        text: 'Sentence'
    }
};

var toneChart;
window.onload = function () {
    toneChart = new Chart('toneLine', 'timeLine', TONE_TYPES, TONE_LEVELS);
    toneChart.startCharting('emotion', 'sentence');
    //simulate();
};

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
            document: {
                emotion: {
                    anger: docTrait1,
                    disgust: docTrait2,
                    fear: docTrait3,
                    joy: docTrait4,
                    sadness: docTrait5
                },
                language: {
                    analytical: docTrait3,
                    confident: docTrait1,
                    tentative: docTrait2
                },
                social: {
                    openness_big5: docTrait5,
                    conscientiousness_big5: docTrait4,
                    extraversion_big5: docTrait1,
                    agreeableness_big5: docTrait2,
                    emotional_range_big5: docTrait3
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
                language: {
                    analytical: senTrait3,
                    confident: senTrait1,
                    tentative: senTrait2
                },
                social: {
                    openness_big5: senTrait5,
                    conscientiousness_big5: senTrait4,
                    extraversion_big5: senTrait1,
                    agreeableness_big5: senTrait2,
                    emotional_range_big5: senTrait3
                }
            }
        };

        // Plot new tone lines
        toneChart.plotValues(tone);

    }, 2000);
}
