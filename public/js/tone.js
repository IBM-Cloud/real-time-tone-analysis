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
 * AJAX Post request for tone analyzer api
 * @param {String} request body text
 */
function getToneAnalysis(text)  {
  $.post('/api/tone', {'text': text }, toneCallback)
    .fail(err);
}

/**
 * Success callback for tone alaysis POST request
 * @param {Object} response data from api
 */
function toneCallback(data) {
  // Results for the updated full transcript's tone
  var docEmotionTone = data.document_tone.tone_categories[0],
    docWritingTone = data.document_tone.tone_categories[1],
    docSocialTone = data.document_tone.tone_categories[2];

  // Results for the latest sentence's tone
  var newEmotionTone, newWritingTone, newSocialTone;
  if (data.sentences_tone) {
    var numSentences = data.sentences_tone.length - 1;
    newEmotionTone = data.sentences_tone[numSentences].tone_categories[0];
    newWritingTone = data.sentences_tone[numSentences].tone_categories[1];
    newSocialTone = data.sentences_tone[numSentences].tone_categories[2];
  }
  else
    newEmotionTone = docEmotionTone;

  // Update Smoothie.js chart
  if (newEmotionTone)
    plotTone(getToneValues(newEmotionTone));
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
