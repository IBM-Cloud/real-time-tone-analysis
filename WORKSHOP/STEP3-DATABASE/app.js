/**
 * Copyright 2016 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express   = require('express'),
  app         = express(),
  bodyParser  = require('body-parser'),
  cfenv       = require('cfenv'),
  watson      = require('watson-developer-cloud');

// cfenv provides access to your Cloud Foundry environment
var vcapLocal = null
try {
  vcapLocal = require("./vcap-local.json")
}
catch (e) {}

var appEnvOpts = vcapLocal ? {vcap:vcapLocal} : {}
var appEnv = cfenv.getAppEnv(appEnvOpts);

// Configure Express
// serve the files out of ./public as our main files
app.enable('trust proxy');

app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));
app.use(bodyParser.json({ limit: '1mb' }));
app.use(express.static(__dirname + '/public'));

// Start listening for connections
app.listen(appEnv.port, function() {
  console.log("server started at", appEnv.url);
});

// Configure Watson Speech to Text service
var speechCreds = getServiceCreds(appEnv, 'rtt-speech-to-text');
speechCreds.version = 'v1';
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

// Root page handler
app.get('/', function(req, res) {
  res.render('index', { ct: req._csrfToken });
});

// Retrieves service credentials for the input service
function getServiceCreds(appEnv, serviceName) {
  var serviceCreds = appEnv.getServiceCreds(serviceName)
  if (!serviceCreds) {
    console.log("service " + serviceName + " not bound to this application");
    return null;
  }
  return serviceCreds;
}
