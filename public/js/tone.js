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
 * Converts a set of tones into flat objects
 * @param {Object} doc/sentence tones returned from API
 */
function getTones(tone) {
  var tones = {
    emotion: getToneValues(tone.tone_categories[0]),
    writing: getToneValues(tone.tone_categories[1]),
    social: getToneValues(tone.tone_categories[2])
  };

  return tones;
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
  tone.doc = getTones(data.document_tone);

  // Results for the latest sentence's tone
  if (data.sentences_tone && data.sentences_tone[data.sentences_tone.length - 1].tone_categories.length)
      tone.sentence = getTones(data.sentences_tone[data.sentences_tone.length - 1]);

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
