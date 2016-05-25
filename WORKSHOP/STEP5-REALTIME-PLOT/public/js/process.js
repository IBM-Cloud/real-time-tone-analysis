// Tone types
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
};