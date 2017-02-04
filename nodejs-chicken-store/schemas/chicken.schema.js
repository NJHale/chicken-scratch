// chicken.schema.js

var mongoose = require('mongoose');

var ChickenSchema = mongoose.Schema({
  chickenName: {
    type: String,
    index: true
  },
  email: String,
  chickonym: String,
  date: {
    type: Date,
    default: Date.now
  }
});

exports.ChickenSchema = ChickenSchema;
