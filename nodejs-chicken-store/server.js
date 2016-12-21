// server.js

// Require appropriate modules
var express = require('express');

// Get the config object
var config = require('./config');

// Instantiate the app object and wire the app routes
var app = express();
// ./routes/index.js is the default code to be hit
var appRoutes = require('./routes');

// Begin listening on the configured port
app.listen(config.port, () => {
  console.log('nodejs-chicken-store running on ' + process.env.APP_POD_NAME);
});
