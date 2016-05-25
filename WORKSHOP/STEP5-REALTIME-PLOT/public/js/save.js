//Fill out the fields in the Save form
function prepareDataForSave(){
	//Get last tone data result
	var tone = toneChart.getValues();
	if (tone) {
		$("#toneTypeToSave").val(toneChart.getType());
		$("#toneLevelToSave").val(toneChart.getLevel());
		$("#toneValueToSave").val(JSON.stringify(toneChart.getValues()[toneChart.getLevel()][toneChart.getType()], null, ' '));
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
		toneType: $("#toneTypeToSave").val(),
		toneLevel: $("#toneLevelToSave").val(),
		toneValue: $("#toneValueToSave").val(),
	};

	//POST request to API
	$.post( "http://nodejsloopbackapi.mybluemix.net/api/items", dataToSend,function( data ) {
	  console.log("Save result:", data );
	}).fail(function() {
    alert( "Error saving data" );
  	});

    //Close the Save window
    $('#myModal').modal('hide');
}
