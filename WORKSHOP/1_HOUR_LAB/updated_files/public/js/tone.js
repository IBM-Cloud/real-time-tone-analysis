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
function getToneValues(toneCategory) {
  var tone = {};
  toneCategory.tones.forEach(function(toneValue) {
    tone[toneValue.tone_id] = +((toneValue.score * 100).toFixed(2));
  });

  return tone;
}

/**
 * Converts a set of tones into flat objects
 * Assumes tone ids will be structured like 'category_id'
 * @param {Object} tone level returned from API
 */
function getTones(tone) {
  var tones = {};
  tone.tone_categories.forEach(function(category) {
    tones[category.category_id.split("_")[0]] = getToneValues(category);
  });
  return tones;
}

/**
 * Success callback for tone alaysis POST request
 * @param {Object} response data from api
 */
function toneCallback(data) {
  var tone = {
    document: {},
    sentence: {}
  };

  // Results for the updated full transcript's tone
  tone.document = getTones(data.document_tone);

  // Results for the latest sentence's tone
  if (data.sentences_tone && data.sentences_tone[data.sentences_tone.length - 1].tone_categories.length)
      tone.sentence = getTones(data.sentences_tone[data.sentences_tone.length - 1]);

  // Update Smoothie.js chart
  toneChart.plotValues(tone);
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
