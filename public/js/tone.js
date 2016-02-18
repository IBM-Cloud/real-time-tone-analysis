var lastToneResult = {};
/**
 * AJAX Post request for tone analyzer api
 * @param {String} request body text
 */
function getToneAnalysis(text)  {
  $.post('/api/tone', {'text': text }, toneCallback)
    .fail(err);
}

/**
 * Converts a tone category into a flat object with tone values
 * @param {Object} tone category returned from API
 */
function getToneValues(tone_category) {
  var tone = {
    id: tone_category.category_id
  };
  for (var i=0; i < tone_category.tones.length; i++)
    tone[tone_category.tones[i].tone_id] = +((tone_category.tones[i].score * 100).toFixed(2));

  return tone;
}

/**
 * Success callback for tone alaysis POST request
 * @param {Object} response data from api
 */
function toneCallback(data) {
  var tone = {
    doc: {},
    sentence: {}
  };

  // Results for the updated full transcript's tone
  tone.doc.emotion = getToneValues(data.document_tone.tone_categories[0]),
  tone.doc.writing = getToneValues(data.document_tone.tone_categories[1]),
  tone.doc.social = getToneValues(data.document_tone.tone_categories[2]);

  // Results for the latest sentence's tone
  if (data.sentences_tone) {
    var numSentences = data.sentences_tone.length - 1;
    if (data.sentences_tone[numSentences].tone_categories.length) {
      tone.sentence.emotion = getToneValues(data.sentences_tone[numSentences].tone_categories[0]);
      tone.sentence.writing = getToneValues(data.sentences_tone[numSentences].tone_categories[1]);
      tone.sentence.social = getToneValues(data.sentences_tone[numSentences].tone_categories[2]);
    }
  }

  //Save the last result from TA
  lastToneResult = tone;

  // Update Smoothie.js chart
  toneChart.plotTone(tone);
}

/**
 * Error callback for tone alaysis POST request
 * @param {Object} error
 */
function err(error) {
  console.error(error);
  var message = typeof error.responseJSON.error === 'string' ?
    error.responseJSON.error :
    'Error code ' + error.responseJSON.error.code + ': ' + error.responseJSON.error.message;
  console.error(message);
}
