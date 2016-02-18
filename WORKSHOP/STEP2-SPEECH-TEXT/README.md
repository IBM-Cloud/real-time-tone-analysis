# Step 2: Using Watson Speech to Text

Now that we have our base Node.js application, let's make it do something cool! If we are going to make our app capable of transcribing our conversations, we will need to integrate with a Watson service.

## Adding the Speech to Text Service

The first thing we need to do is provision a Watson service. Each [Cloud Foundry service][cf_service_url] acts as a pooled resource, with users able to provision a service instance for their organization's use. Each service instance can have 'n' number of service credentials with which apps can use to call the service. By binding the service instance to your app, these crednetials automatically become accessible as environment variables. Let's walk through creating a Watson service now.

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

1. Update `app.js` (hard-code creds)

2. Build our basic `index.html` file.

3. Add our first style files. Both css files.

4. Add all images.

5. Add sample audio files.

6. Pull in Watson `src` folder for StT.

7. Install `npm` modules

8. Run build with `browserify` to create `index.js` file

9. Test the app to see the transcription.

10. Push the app to Bluemix and test there.

## Developing Locally with VCAP_SERVICES

I'm guessing you noticed this development misstep, but we hard-coded the credentials for the Speech to Text API directly into our `app.js` file. This is obviously not a good practice when developing our apps locally.

Since these credentials will be accessible as environment variables when the app is running on Bluemix, we want to emulate this behavior locally. To create this environment parity between Bluemix and our local machines, we will use a Node.js package called `cfenv` to handle.

1. Update app.js to use `cfenv`

2. Create the vcap-local file

3. Create .cfignore and .gitignore files

<!--Links--> 
[stt_service_url]: https://console.ng.bluemix.net/catalog/services/speech-to-text
[cf_service_url]: https://docs.cloudfoundry.org/devguide/services/
[wdc_url]: https://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/
[watson_ci_demo]: https://concept-insights-demo.mybluemix.net/
[watson_nlc_demo]: https://natural-language-classifier-demo.mybluemix.net/
[watson_pi_demo]: https://runkeeper-hashmatch.mybluemix.net/
[watson_alchemy_demo]: http://vision.alchemy.ai/#demo

