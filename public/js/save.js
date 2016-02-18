//Fill out the fields in the Save form
function prepareDataForSave(){
	//Get last tone data.
  console.log(lastToneResult);
	$("#jsonToSave").val(JSON.stringify(lastToneResult.doc, null, ' '));

	//Get text
	$("#textToSave").val($("#resultsText").val());
}

//Send the data to the API.
function saveData(){
	var dataToSend = {};

	//Get data from Save form
	dataToSend.name = $("#nameToSave").val();
	dataToSend.text = $("#textToSave").val();
	dataToSend.json = JSON.parse($("#jsonToSave").val());

	//POST request to API
	$.post( "http://nodejsloopbackapi.mybluemix.net/api/items", dataToSend,function( data ) {
	  console.log("Save result:", data );
	}).fail(function() {
    alert( "Error saving data" );
  	});

    //Close the Save window
    $('#myModal').modal('hide');
}
