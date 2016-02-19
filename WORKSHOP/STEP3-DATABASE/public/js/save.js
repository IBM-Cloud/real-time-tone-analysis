//Fill out the fields in the Save form
function prepareDataForSave(){
	//Get text
	$("#textToSave").val($("#resultsText").val());
}

//Send the data to the API.
function saveData(){
	var dataToSend = {};

	//Get data from Save form
	dataToSend.name = $("#nameToSave").val();
	dataToSend.text = $("#textToSave").val();

	//POST request to API
	$.post( "http://cloudantAPI-USERNAME.mybluemix.net/api/items", dataToSend,function( data ) {
	  console.log("Save result:", data );
	}).fail(function() {
    alert( "Error saving data" );
  	});

    //Close the Save window
    $('#myModal').modal('hide');
}
