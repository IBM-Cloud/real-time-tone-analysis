var http = require('http');
var request = require('request');

//Local Development
//Enter your Cloudant URL here. Get this from your Bluemix Cloudant service by clicking on "Show Credentials" or "Service Credentials".
var url = "PUT_URL_HERE";
var databaseName = "mydb"; //You need to log into Cloudant Dashbaord and create this database

//Running on Bluemix. Gets the Cloudant credentials from VCAP_SERVICES env variable
if(process.env.VCAP_SERVICES){
    var vcap_services = JSON.parse(process.env.VCAP_SERVICES);
    url = vcap_services.cloudantNoSQLDB[0].credentials.url;
}

//Create the database (mydb) if it doesn't exist.
request.put(url + "/" + databaseName).on('error', function(err) {
    console.log("ERROR CREATING DATABSE: " + err);
  })

module.exports = {
  "db": {
      "connector": "cloudant",
      "url": url,
      "database": databaseName
    }
};
