// chicken.routes.js

// Require appropriate modules
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var ChickenSchema = require('../schemas/chicken.schema').ChickenSchema;

// Get the configuration object
var config = require('../config');

// Create the mongodb connection
var db = mongoose.connect(config.mongoUri, config.mongoOptions).connection;

// Create a connection error callback
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log(`Mongoose connected to mongodb @ ${config.mongoUri}`);
});

// Create the mongoose model and instance of the model
var Chicken = mongoose.model('chicken', ChickenSchema);
// Also create a mongoose model for latest chickens
var LatestChicken = mongoose.model('latestchicken', ChickenSchema);

// Get an instance of an express router
var routes = express.Router();

// Configure the express router to use body-parser as middleware to handle post requests
routes.use(bodyParser.urlencoded({ extended: true }));
routes.use(bodyParser.json());

routes.get('/chickens', (req, res) => {
  try {
    // Get the number of elements to retrieve - null should be 0 to get all
    var num = req.query.num == null ? 0 : req.query.num;

    console.log(`This is the number of results to retrieve: ${num}`);
    // Perform a find all with mongoose
    Chicken.find((err, ckns) => {
      // Check for an error case
      if (err != null) {
        console.log(`An error was detected when getting the chickens: ${err}`);
        // Return an error
        res.status(400).json(err);
      } else {
        // Change status to 200 "OK" and chicken the json response
        res.status(200).json(ckns);
      }
    }).limit(Number(num));
  } catch (ex) {
    // Set and send status 500 "Internal Server Error"
    res.status(500).json(JSON.stringify(ex));
  }
});

/**
 * Chicken endpoint for getting the latest cknes
 * @type {Boolean}
 */
routes.get('/chickens/latest', (req, res) => {
  try {
    // Get the number of elements to retrieve - null should be 0 to get all
    var num = req.query.num == null ? 0 : req.query.num;

    LatestChicken.find((err, chickens) => {
      // Check for an error case
      if (err != null) {
        console.log(`An error was detected when getting the latest chickens: ${err}`);
        // Return an error
        res.status(400).json(err);
      } else {
        // Change status to 200 "OK" and chicken the json response
        res.status(200).json(chickens);
      }
    })
  } catch (err) {
      // Set and send status 500 "Internal Server Error"
      res.status(500).json(JSON.stringify(err));
  }
});

/**
 * Chickens endpoint for getting all Chickens of a particular id
 * @type {Boolean}
 */
routes.get('/chickens/:name', (req, res) => {
  try {
    var name = req.params.name;
    console.log(`This is the id we got! name: ${name}`);
    // Get the number of elements to retrieve - null should be 0 to get all
    var num = req.query.num == null ? 0 : req.query.num;
    console.log(`This is the number of results to retrieve: ${num}`);
    // Make sure we were given a name to query
    if (name) {
      // Perform a find on the name
      Chicken.find({ name: name }, (err, ckns) => {
        // Check for an error case
        if (err != null) {
          console.log(`An error was detected when getting the chickens: ${err}`);
          // Return an error
          res.status(400).json(err);
        } else {
          // Change status to 200 "OK" and chicken the json response
          res.status(200).json(ckns);
        }
      }).sort({ time: 'descending' }).limit(Number(num));
    } else {
      // Set and send status 400 "Bad Request"
      res.status(400).send('A name parameter must be provided.');
    }
  } catch (ex) {
    console.log(ex);
    // Set and send status 400 "Bad Request"
    res.status(400).json(JSON.stringify(ex));
  }
});


// Register post request
routes.post('/chickens', (req, res) => {
  // The request should be able to be cast to type Chicken
  try {
    // Instantiate a new Chicken with given json
    var ckn = new Chicken(req.body);
    console.log('Finalized chicken: ' + JSON.stringify(ckn));
    // Insert the Chicken into the store
    ckn.save((err, ckn) => {
      if (err != null) {
        console.log(`An error was detected when saving the chicken: ${err}`)
        // Return an error
        res.status(400).json(JSON.stringify(err));
      } else {
        // Flip the requested flag
        reduceChickens.requested = true;
        // Change status to 201 "Created"
        res.status(201).send();
      }
    });

  } catch (e) {
    console.log('Houston - We have a problemo...');
    // The user's request was bad - send 400 "Bad Request"
    res.status(400).json(JSON.stringify(e));
  }
});

/**
 * Performs a map-reduce on the chicken collection and stores the result
 * in the latestchicken collection
 */
function reduceChickens() {
  // Set reducing to true
  this.reducing = true;
  // Instantiate the map reduce function in an object
  var mapReduce = {};
  // Create the map function (name -> ckn)
  mapReduce.map = function() {
    emit(this.chickenName, this);
  }
  // Create the reduce function (Only return the latest chicken objects)
  mapReduce.reduce = function(chickenName, chickens) {
    // Iterate through the chickens, searching for the latest chicken
    // We're assuming it was a min heap (implemented as array it would be at the last index)
    var latest = chickens[chickens.length - 1];
    // We can skip the first box
    // for (var i = 1; i < ckns.length; i++) {
    //   if (ckns[i].time > latest.time) {
    //     latest = ckns[i];
    //   }
    // }

    // Return the latest ckn
    return latest;
  }

  // Perform a find all with mongoose
  Chicken.mapReduce(mapReduce, (err, reduction) => {
    try {
      console.log(`Map reduce reduction: ${JSON.stringify(reduction)}`);
      // Check for an error case
      if (err) {
        // Set reducing to false
        this.reducing = false;
        console.log(`An error was detected when performing a map-reduce
          ${err}`);
      } else {
        // Collect each value from the id-value tuples in the reduction array
        var latest = [];
        for (r of reduction) {
          latest.push(new LatestChicken(r.value));
        }
        // Delete everything in the latestchicken collection
        LatestChicken.remove({}, (err) => {
          if(err) {
            console.log(`An error occured while attempting to remove all elements
              from the latestchicken collection\n${err}`);
          }
          // Attempt to add the new latest to the collection
          for (chicken of latest) {
            chicken.save();
          }
          // Set reducing to false
          this.reducing = false;
          console.log('Map-reduce completed!');
        });
      }
    } catch (err) {
      // Set reducing to false
      this.reducing = false;
      console.log(`An error was detected when updating the latestchicken collection
        ${err}`);
    }

  });
}

// Define the requested and reducing flags on the reduceChickens function
reduceChickens.requested = false;
reduceChickens.reducing = false

// Create an interval for the chickens to be reduced on
var reductionInterval = setInterval(() => {
  //console.log('Checking for reduction requests...')
  // Check if a reduce has been requested and one is not currently running
  if (reduceChickens.requested && !reduceChickens.reducing) {
    console.log(`Reduction request detected!
      \nKicking off new reduction at ${Date.now()}`);
    // Set requested to false
    reduceChickens.requested = false;
    // Reduce the chickens
    reduceChickens();
  } else {
    //console.log('Reduction request not detected.');
  }
  //console.log('Continuing to next interval...');
}, config.reductionDT);

// Export the routes as an unnamed object
module.exports = routes;
