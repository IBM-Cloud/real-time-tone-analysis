# Step 1: Starter Node.js App

Welcome to our 'Real Time Tone' analysis workshop. This workshop was designed to help immerse you in Bluemix, Watson, and Node.js ... to offer a taste of life developing in the cloud.

## Goals

The following are our goals for you, the developer, to achieve by the end of this workshop:

1. Understand the workflow for Bluemix/Cloud Foundry
2. Experience Node.js development in the Cloud
3. Create and bind cognitive/natural language services
4. Manage data in the Cloud
5. Think about short, meaningful experiments and updates that connect data, cloud and cognitive computing

## Let's get started

1. Create a folder called "real-time-tone"

2. Open up the Bluemix Catalog UI and navigate to the [SDK for Node.js Runtime Starter][node.js_runtime_url] to create a NodeJS hello world app
	* Name it `realtime-tone`
	* Give it a similar host name, something like `realtime-tone-USERNAME`. The host you choose will be the subdomain of your app's path.

3. Download the starter code from the `Download Starter Code` button Bluemix gives you and unzip it to the folder that you created in Step 2.

4. Give it a minute or so to start, and then navigate to your running app to see it working - for instance `realtime-tone-am.mybluemix.net`



## Running the app locally

Now we're going to begin with a basic workflow. We'll make the app run locally on our computers, change things a little, and then upload the app back to the cloud.

1. First let's spend some time learning about `npm`, the Node.js package manager. We'll explore a few packages for databases, social media, algorithms and managing dependencies via `package.json` ... then we'll see it in action.

2. Let's update our [`package.json`](./package.json) to run the right version of Node.js and add `body-parser` as a dependency

3. Go ahead and install the packages we need for the hello world app

	```
	$ npm install
	```

4. Now let's start the app up

	```
	$ npm start
	```
	Check out the running local instance in your browser

5. Update the [`index.html`](./public/index.html) code to the basic layout of the app we are going to build

	```
	<head>
	    <title>Real Time Tone</title>
	    <meta charset="utf-8">
	    <meta http-equiv="X-UA-Compatible" content="IE=edge">
	    <meta name="viewport" content="width=device-width, initial-scale=1">
	    <meta name="ct" content="<%= ct %>">
	    <link rel="shortcut icon" href="images/favicon.ico" />
	    <link rel="stylesheet" href="stylesheets/style.css">
	    <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet" type="text/css">
	</head>
	
	<body class="real-time-body">
	    <div class="top">
	        <div class="bar">
	            <a href="https://realtime-tone.mybluemix.net">
	                <div class="title">
	                    <div class="name">REAL TIME TONE ANALYSIS</div>
	                </div>
	            </a>
	        </div>
	    </div>
	    <div class="site">
	        <div class="about">REAL TIME TONE ANALYSIS LISTENS TO YOUR VOICE AND PLOTS THE EMOTIONAL LEVEL OF YOUR WORDS IN REAL TIME</div>
	    </div>
	    <div class="footer">
	        <div class="footer-container">
	            <div><img class="watson" src="images/watson-logo.png"></div>
	            <div class="baseline">BUILT ON IBM BLUEMIX</div>
	            <div><img class="bluemix" src="images/bluemix-logo.png"></div>
	        </div>
	    </div>
	    </div>
	</body>
	```

6. Copy over the expanded [`style.css`](./public/stylesheets/style.css) stylesheet and the [`images`] (./public/images/)folder so that everything looks beautiful

7. Finally, let's bring the [`app.js`](./app.js) file in line for future updates. Once you finish this, fire up the app again locally to see your changes

8. Before we push our updated app back to Bluemix, let's explore the [`.cfignore`](./.cfignore) and [`manifest.yml`](./manifest.yml) files, two of the files used in the Cloud Foundry deployment process

	* **cfignore** - Similar to a `.gitignore` file, we use this file to tell Cloud Foundry to ignore certain files and foldrs in our app's root and nested folders
	* **manifest** - This file allows us to explicitly list deployment options in order to ensure consistent and reproducible deployments. Read more details in the [Cloud Foundry documentation](https://docs.cloudfoundry.org/devguide/deploy-apps/manifest.html)

9. Login using the cf command line and then let's deploy our app

	```
	$ cf login -a https://api.ng.bluemix.net
	```
	```
	$ cf push
	```

10. Now that our app is deploying, let's check the logs to make sure everything is going smoothly. We can do this in several ways:
	* Navigate to the 'Logs' section in your app's dashboard in the Bluemix UI
	* Get the logs using the CF CLI

	```
	$ cf logs realtime-tone --recent
	```
11. Let's play with some `console.log()` and `console.error()` statements to see how these might help us debug

And those are the basics of Node.js development using Bluemix. Easy enough, but that was just the grounding we needed for the next step: adding our first service ...

<!--Links-->
[github_url]: https://github.com/
[node.js_runtime_url]: https://console.ng.bluemix.net/catalog/starters/sdk-for-nodejs/
