# Real Time Tone Analysis Lab

Welcome to our (abbreviated) 'Real Time Tone Analysis' lab. This workshop was designed to help immerse you in Bluemix, Watson, and Node.js ... to offer a taste of life developing in the cloud. Since we only have a limited amount of time, we are going to just cover the highlights.

## Goals

The following are our goals for you, the developer, to achieve by the end of this workshop:

1. Understand the workflow for Bluemix/Cloud Foundry
2. Experience Node.js development in the Cloud
3. Create and utilize cognitive, natural language services

## Provision a Watson Service

1. Go to the IBM Bluemix catalog and find the [Watson Speech to Text service][stt_service_url]

2. Set the configurations as follows:
	* Service name: Name it `rtt-speech-to-text`
	* Credentials name: Name them `rtt-speech-to-text-creds`
	* Space: Select the space where you want to host your app
	* App: Choose the "Leave unbound" option

3. Create the service

4. Once you are brought to the service console, navigate to the Service Credentials tab and copy the credentials you created. These will be needed in the next step.

## Creating the App Locally

We're going to begin with a basic app that utilizes speech-to-text. We'll make the app run locally on our machines first.

1. Start with the code in the [1 Hour Lab folder](https://github.com/IBM-Bluemix/real-time-tone-analysis/tree/master/WORKSHOP/1_HOUR_LAB) of the GitHub repo.

2. Open up the [`vcap-local.json`](./vcap-local.json) file and replace the credentials with the ones you just created.

3. Now go ahead and install the packages we need for the hello world app

	```bash
	$ npm install
	```

	This step starts off by downloading [npm packages](npm_url) for our server app, then proceeds to download [bower packages](bower_url) that [gulp.js](gulp_url) uses to extract necessary dependencies for our front end.

4. Now let's start the app up

	```bash
	$ npm start
	```
	Check out the running local instance in your browser

## Deploying to Bluemix

1. Open up your [`manifest.yml`](./manifest.yml) file and change the `host` paramater to something unique.

  The host you choose will determinate the subdomain of your application's URL:  `<host>.mybluemix.net`

2. Log in to Bluemix using the cf command line interface and then let's deploy our app

	```bash
	$ cf login -a https://api.ng.bluemix.net
	$ cf push
	```

3. While our app is deploying, let's check the logs to make sure everything is going smoothly. We can do this in several ways:
	* Navigate to the 'Logs' section in your app's dashboard in the Bluemix UI
	* Get the logs using the CF CLI

	```bash
	$ cf logs realtime-tone --recent
	```

Once your app has deployed, hit your app's URL and make sure it's up and running.

## Adding the Tone Analyzer

At the beginning of the lab, we added and bound a service through the Bluemix UI. However, we can do the same thing quicker using the CF CLI. Let's walk through how we do this with the [Tone Analyzer service][ta_url].

1. Create the Tone Analyzer service in Bluemix

  ```bash
  $ cf create-service tone_analyzer standard rtt-tone-analyzer
  ```
  
2. Bind the tone analyzer service instance to the `realtime-tone` app

  ```bash
  $ cf bind-service realtime-tone rtt-tone-analyzer
  ```

3. We need to add and update some files in order to be able to use this new service. Let's run a special gulp command to do this for us.

  ```bash
  $ gulp lightspeed
  ```
  
4. Let's grab our app's environment variables and plug them back into [`vcap-local.json`](./vcap-local.json)

  ```bash
  $ cf env realtime-tone
  ```
  
5. If we check [`bower.json`](./bower.json), it looks like some new front end requirements are needed, so we'll install them and proceed to test the app locally

  ```bash
  $ npm install
  $ npm start
  ```
  
6. Looks good to me! Push it back up to Bluemix now

  ```bash
  $ cf push
  ```
  
Voila! We have finished creating our realtime-tone app and you now have your very own version running on Bluemix.
  

<!--Links--> 
[stt_service_url]: https://console.ng.bluemix.net/catalog/services/speech-to-text
[npm_url]: https://www.npmjs.com/
[bower_url]: http://bower.io/
[gulp_url]: http://gulpjs.com/
[ta_url]: https://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/tone-analyzer.html

