// server.js

// Require appropriate modules
var fs = require('fs');
var app = require('express')();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var ChickenSchema = require('chicken');

// Get the config object
var config = require('./config');

// Create a new express middleware router
var router = express.Router();

/**
 * Health route for OpenShift
 */
router.get('/', (req, res) => {

});

// Register all routes with d
