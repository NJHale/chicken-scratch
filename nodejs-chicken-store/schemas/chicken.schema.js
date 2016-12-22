// chicken.schema.js

var mongoose = require('mongoose');

function ChickenSchema = mongoose.Schema({
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
