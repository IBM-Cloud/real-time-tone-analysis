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
  cfenv       = require('cfenv');

// cfenv provides access to your Cloud Foundry environment
var appEnv = cfenv.getAppEnv();

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

// Root page handler
app.get('/', function(req, res) {
  res.render('index', { ct: req._csrfToken });
});
