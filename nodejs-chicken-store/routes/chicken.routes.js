// chicken.routes.js

// Require routesropriate modules
var express = require('express');
var mongoose = require('mongoose');

var ChickenSchema = require('../schemas/chicken').ChickenSchema;

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
    Chicken.find((err, pkgs) => {
      // Check for an error case
      if (err != null) {
        console.log(`An error was detected when getting the chickens: ${err}`);
        // Return an error
        res.status(400).json(err);
      } else {
        // Change status to 200 "OK" and chicken the json response
        res.status(200).json(pkgs);
      }
    }).limit(Number(num));
  } catch (ex) {
    // Set and send status 500 "Internal Server Error"
    res.status(500).json(JSON.stringify(ex));
  }
});

/**
 * Chicken endpoint for getting the latest pkges
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
        res.status(200).json(chicken);
      }
    })

    // Instantiate the map reduce function in an object
    var mapReduce = {};
    // Create the map function (pkgId -> pkg)
    mapReduce.map = function() {
      emit(this.name, this);
    }
    // Create the reduce function (Only return the latest pkg objects)
    mapReduce.reduce = function(name, chickens) {
      // Iterate through the pkges, searching for the latest pkg
      var latest = chickens[chickens.length - 1];
      // We can skip the first box
      // for (var i = 1; i < pkgs.length; i++) {
      //   if (pkgs[i].time > latest.time) {
      //     latest = pkgs[i];
      //   }
      // }

      // Return the latest pkg
      return latest;
    }

    // Perform a find all with mongoose
    Chicken.mapReduce(mapReduce, (err, reduction) => {
      try {
        console.log(`Well, we made it past the map reduce: ${JSON.stringify(reduction)}`);
        // Check for an error case
        if (err) {
          console.log(`An error was detected when getting the latest pkges:
            ${err}`);
          // Return an error
          res.status(400).json(err);
        } else {
          // Check for query parameter idLike
          var idLike = req.query.idLike;
          var regex = new RegExp(`^${idLike}`, 'g');
          // Collect each value from the id-value tuples in the reduction array
          var pkgs = [];
          for (r of reduction) {
            if (r.value.name != null) {
              if (idLike) {
                // Check for pattern matching before pushing in pkg
                var strId = (r.value.pkgId).toString();
                if (strId.match(regex)) {
                  pkgs.push(r.value);
                }
              } else {
                pkgs.push(r.value);
              }
            }
          }
          // Change status to 200 "OK" and chicken the json response
          res.status(200).json(pkgs);
        }
      } catch (err) {
          // Set and send status 500 "Internal Server Error"
          res.status(400).json(JSON.stringify(err));
      }

    });

  } catch (err) {
      // Set and send status 500 "Internal Server Error"
      res.status(500).json(JSON.stringify(err));
  }
});

/**
 * Chickens endpoint for getting all Chickens of a particular id
 * @type {Boolean}
 */
routes.get('/chickens/:pkgId', (req, res) => {
  try {
    var pkgId = req.params.pkgId;
    console.log(`This is the id we got! pkgId: ${pkgId}`);
    // Get the number of elements to retrieve - null should be 0 to get all
    var num = req.query.num == null ? 0 : req.query.num;
    console.log(`This is the number of results to retrieve: ${num}`);
    // Make sure we were given a pkgId to query
    if (pkgId) {
      // Perform a find on the pkgId
      Chicken.find({ pkgId: pkgId }, (err, pkgs) => {
        // Check for an error case
        if (err != null) {
          console.log(`An error was detected when getting the chickens: ${err}`);
          // Return an error
          res.status(400).json(err);
        } else {
          // Change status to 200 "OK" and chicken the json response
          res.status(200).json(pkgs);
        }
      }).sort({ time: 'descending' }).limit(Number(num));
    } else {
      // Set and send status 400 "Bad Request"
      res.status(400).send('A pkgId parameter must be provided.');
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
    var pkg = new Chicken(req.body);
    console.log('Finalized chicken: ' + JSON.stringify(pkg));
    // Insert the Chicken into the store
    //TODO: Add type checking to ensure we are putting in our base Chicken prototype (at least)
    pkg.save((err, pkg) => {
      if (err != null) {
        console.log(`An error was detected when saving the chicken: ${err}`)
        // Return an error
        res.status(400).json(JSON.stringify(err));
      } else {
        // Change status to 201 "Created"
        res.status(201).send();
      }
    });

  } catch (e) {
    console.log('Houston - We have a problemo...');
    // The user's request was bad - send 400 "Bad Request"
    res.status(400).json(JSON.stringify(e));
  }
})

/**
 * Performs a map-reduce on the chicken collection and stores the result
 * in the latestchicken collection
 */
function reduceChickens() {
  // Instantiate the map reduce function in an object
  var mapReduce = {};
  // Create the map function (pkgId -> pkg)
  mapReduce.map = function() {
    emit(this.name, this);
  }
  // Create the reduce function (Only return the latest pkg objects)
  mapReduce.reduce = function(name, chickens) {
    // Iterate through the chickens, searching for the latest chicken
    // We're assuming it was a min heap (implemented as array it would be at the last index)
    var latest = chickens[chickens.length - 1];
    // We can skip the first box
    // for (var i = 1; i < pkgs.length; i++) {
    //   if (pkgs[i].time > latest.time) {
    //     latest = pkgs[i];
    //   }
    // }

    // Return the latest pkg
    return latest;
  }

  // Perform a find all with mongoose
  Chicken.mapReduce(mapReduce, (err, reduction) => {
    try {
      console.log(`Map reduce reduction: ${JSON.stringify(reduction)}`);
      // Check for an error case
      if (err) {
        console.log(`An error was detected when performing a map-reduce
          ${err}`);
      } else {
        // Collect each value from the id-value tuples in the reduction array
        var latest = [];
        for (r of reduction) {
          latest.push(r.value);
        }
        // Delete everything in the latestchicken collection
        LatestChicken.remove({}, (err) {
          if (err) {
            console.log(`An error occured while attempting to remove all elements
              from the latestchicken collection\n${err}`);
          }
          // Attempt to add the new latest to the collection
          for (l of latest) {
            var chicken = new LatestChicken(l);
            LatestChicken.save();
          }

          console.log('Map-reduce completed!');
        });

      }
    } catch (err) {
      console.log(`An error was detected when updating the latestchicken collection
        ${err}`);
    }

  });
}
