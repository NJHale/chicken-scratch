// chicken.schema.js

var mongoose = require('mongoose');

var ChickenSchema = mongoose.Schema({
  name: {
    type: String,
    index: true
  }
  email: String,
  nickName: String,
  date: {
    type: Date,
    default: Date.now
  },
});

exports.ChickenSchema = ChickenSchema;
