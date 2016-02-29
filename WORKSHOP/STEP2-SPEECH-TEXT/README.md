# Step 2: Using Watson Speech to Text

Now that we have our base Node.js application, let's make it do something cool! If we are going to make our app capable of transcribing our conversations, we will need to integrate with a Watson service.

## Adding the Speech to Text Service

The first thing we need to do is provision a Watson service. Each [Cloud Foundry service][cf_service_url] acts as a pooled resource, with users able to provision a service instance for use in a specific space. Each service instance can have 'n' number of service credentials with which apps can use to call the service. By binding the service instance to your app, these credentials automatically become accessible as environment variables. Let's walk through creating a Watson service now.

1. Go to the IBM Bluemix catalog and find the [Watson Speech to Text service][stt_service_url]

2. Set the configurations as follows:
	* Space: Select the same space that your `realtime-tone` app is in
	* App: Select your `realtime-tone` app
	* Service name: Name it `rtt-speech-to-text`
	* Plan: Select the `Standard` plan

3. Create the service

4. Click 'Restage' to enable your app's connection to the service

5. Go to your app dashboard to verify that the service was bound to your app

## Watson Overview

Watson is many things, but for most developers, it is simply MLaaS: Machine Learning as a Service. The [Watson Developer Cloud][wdc_url] contains a number of APIs that give developers the ability to leverage cognitive computing in their apps without implementing (or understanding) the necessary underlying systems.

If you're like me, you understand the use case services better when you see them in action. Let's check our some examples:

* [Concept Insights][watson_ci_demo] allows you to discover content which may or may not be found using a traditional keyword search.
* The [Natural Language Classifier][watson_nlc_demo] service applies deep learning techniques to make predictions about the best predefined classes for short sentences or phrases. The classes can trigger a corresponding action in an application, such as directing a request to a location or person, or answering a question. After training, the service returns information for texts that it hasn't seen before.
* A person's written work speaks a lot to the type of person they are and what is important to them. [Personality Insights][watson_pi_demo] simplifies the process of analyzing someone's writings and understanding their personality, needs, and values.
* AlchemyAPI looks to make sense of the dark world of unstructured data. The [Alchemy Vision][watson_alchemy_demo] demo can parse images and discover the people and things within photos.

Each API that Watson exposes has a particular use case within the machine learning space. Capabilities range from natural language processing, to sentiment analysis, all the way to visual recognition. However, the real power of Watson is seen when services are used in conjunction to creat cognitive patterns in their application. More on this later...

## Implementing Speech to Text

Now that we understand what Watson does and have seen several use cases, let's see what it can do for us. This section will walk you through how to call and leverage Watson from within our app.

1. First, we are going to install a dependency that will help us utilize the Speech to Text service. Download the module with the following command

	```
	$ npm install watson-developer-cloud --save
	```

2. Next, we will update our [`app.js`](./app.js) file to leverage this module

	```
	var express   = require('express'),
		app         = express(),
		bodyParser  = require('body-parser'),
		cfenv       = require('cfenv'), //*****<-- Replace ; with a ,
		watson      = require('watson-developer-cloud'); //*****<-- Add this
	...
	...
	...
	...
	//*****Add the following functions
	
	// Configure Watson Speech to Text service
	var speechCreds = {
	  url: 'https://stream.watsonplatform.net/speech-to-text/api',
	  username: 'USERNAME',
	  password: 'PASSWORD',
	  version: 'v1'
	}
	var authService = watson.authorization(speechCreds);
	
	// Get token using your credentials
	app.post('/api/token', function(req, res, next) {
	  authService.getToken({url: speechCreds.url}, function(err, token) {
	    if (err)
	      next(err);
	    else
	      res.send(token);
	  });
	});
	```
	The `/api/token` route will create an access token for all requesting clients and will subsequently handle the socket-based communication between the app and client

3. Add an additional stylesheet called [`public/stylesheets/watson-bootstrap-style.css`](./public/stylesheets/watson-bootstrap-style.css) to style elements we are about to add to our markup.

4. Next, grab the code from [`public/index.html`](./public/index.html) This will introduce a few new elements to invoke the Speech to Text service and display the results. It will also use the new stylesheet we just brought in.

5. Add the following images to the `/public/image` folder:
	* [`microphone.svg`](./public/images/microphone.svg) - begin recording speech
	* [`play.svg`](./public/images/play.svg) - play the sample audio file
	* [`play-red.svg`](./public/images/play-red.svg) - clicked the play button
	* [`stop-red.svg`](./public/images/stop-red.svg) - stop the audio recording
	* [`stop.svg`](./public/images/stop.svg) - clicked to stop the audio recording
	* [`drop-down-arrow.svg`](./public/images/drop-down-arrow.svg) - expand the metadata table
	* [`drop-up-arrow.svg`](./public/images/drop-up-arrow.svg) - collapse the metadata table

6. Create a new `/public/audio` folder and add the sample audio files:
	* [`Us_English_Broadband_Sample_1.wav`](./public/audio/Us_English_Broadband_Sample_1.wav)
	* [`Us_English_Broadband_Sample_2.wav`](./public/audio/Us_English_Broadband_Sample_2.wav)

7. Let's quickly stop here and check out what we have now. Remember to start the app with the following command

	```
	$ npm start
	```
	Everything looks in order. Let's proceed and import the code that is going to run the speech to text transcription logic behind the scenes.
	
8. Import the `src/` folder into the root directory. This contains the client-side code that will handle microphone interaction, sample file streaming, and client-server communication via sockets.

9. We are going to compile these files with [browserify][browserify_url] to create the `public/js/index.js` file. To do this, we first need to add several parameters to [`package.json`](./package.json) so that this same process occurs when we push our app to Bluemix
	
	```
	"scripts": {
		"start": "node app.js",
		"build": "browserify src/index.js | uglifyjs -nc > public/js/index.js",
		"watch": "watchify -v -d -o public/js/index.js src/index.js"
	},
	"devDependencies": {
		"browserify": "^12.0.1",
		"browserify-shim": "^3.8.12",
		"watchify": "^3.6.1",
		"uglifyjs": "^2.4.10"
	},
	"browserify-shim": {
		"jquery": "global:jQuery"
	},
	"browserify": {
		"transform": [
			"browserify-shim"
		]
	},
	```
	After that is done, execute the following commands
	
	```
	$ npm install
	$ mkdir public/js
	$ npm run build
	```

10. Update your [`public/index.html`](./public/index.html) file again to call this and several other dependent scripts

	```
	<!-- Place js files at the end of the document, with fallbacks for CDNs -->
    <script src="https://code.jquery.com/jquery-1.11.3.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
    <script src="js/index.js"></script>
	```

11. Test locally

12. Push the app to Bluemix and verify everything works there as well

	```
	$ cf push
	```

## Developing Locally with VCAP_SERVICES
Now, you're probably wondering if we are going to insert credentials into the app.js, but we don't want to hard-code the credentials for the Speech to Text API directly into our `app.js` file. This is obviously not a good practice when developing our apps, particularly when it comes to source code management.

When running in Bluemix, the credentials of any services that are bound to the application are passed in via the VCAP_SERVICES environement variable. Since these credentials will be accessible as environment variables when the app is running on Bluemix, we want to emulate this behavior when running locally. To create this environment parity between Bluemix and our local machines, we will use the `cfenv` Node.js package.

1. Create an empty vcap-local.json file.

2. Go to your Bluemix application dashbaord, click on Environment Variables, and then VCAP_SERVICES. Copy this json to your vcap-local.json file. It should look something like this:

	```
	{
	  "services": {
	    "speech_to_text": [
	      {
	        "name": "rtt-speech-to-text",
	        "label": "speech_to_text",
	        "plan": "standard",
	        "credentials": {
	          "url": "https://stream.watsonplatform.net/speech-to-text/api",
	          "username": "USERNAME",
	          "password": "PASSWORD"
	        }
	      }
	    ]
	  }
	}
	```

3. Update [`app.js`](./app.js) to read from the `vcap-local.json` file for the `cfenv` module configuration

	```
	// cfenv provides access to your Cloud Foundry environment
	var vcapLocal = null
	try {
	  vcapLocal = require("./vcap-local.json")
	}
	catch (e) {}
	
	var appEnvOpts = vcapLocal ? {vcap:vcapLocal} : {}
	var appEnv = cfenv.getAppEnv(appEnvOpts);
	...
	...
	...
	// Configure Watson Speech to Text service
	var speechCreds = getServiceCreds(appEnv, 'rtt-speech-to-text');
	speechCreds.version = 'v1';
	var authService = watson.authorization(speechCreds);
	...
	...
	...
	// Retrieves service credentials for the input service
	function getServiceCreds(appEnv, serviceName) {
	  var serviceCreds = appEnv.getServiceCreds(serviceName)
	  if (!serviceCreds) {
	    console.log("service " + serviceName + " not bound to this application");
	    return null;
	  }
	  return serviceCreds;
	}
	```

3. Update your [`.cfignore`](./.cfignore) file to include `vcap-local.json` and the `src/` folder

Now that we have our first service connected, we will next walk through hooking up our app to a database...

<!--Links--> 
[stt_service_url]: https://console.ng.bluemix.net/catalog/services/speech-to-text
[cf_service_url]: https://docs.cloudfoundry.org/devguide/services/
[wdc_url]: https://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/
[watson_ci_demo]: https://concept-insights-demo.mybluemix.net/
[watson_nlc_demo]: https://natural-language-classifier-demo.mybluemix.net/
[watson_pi_demo]: https://runkeeper-hashmatch.mybluemix.net/
[watson_alchemy_demo]: http://vision.alchemy.ai/#demo
[browserify_url]: http://browserify.org/

