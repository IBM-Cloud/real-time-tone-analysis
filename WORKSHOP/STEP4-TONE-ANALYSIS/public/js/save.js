//Fill out the fields in the Save form
function prepareDataForSave(){
	//Get last tone data result
	if (lastToneResult) {
		$("#toneLevelToSave").val('document');
		$("#toneValueToSave").val(JSON.stringify(lastToneResult.document, null, ' '));
	}

	//Get text
	$("#textToSave").val($("#resultsText").val());
}

//Send the data to the API.
function saveData(){
	//Get data from Save form
	var dataToSend = {
		name: $("#nameToSave").val(),
		transcription: $("#textToSave").val(),
		toneLevel: $("#toneLevelToSave").val(),
		toneValue: $("#toneValueToSave").val(),
	};

	//POST request to API
	$.post( "http://cloudantAPI-USERNAME.mybluemix.net/api/items", dataToSend,function( data ) {
	  console.log("Save result:", data );
	}).fail(function() {
    alert( "Error saving data" );
  	});

    //Close the Save window
    $('#myModal').modal('hide');
}
