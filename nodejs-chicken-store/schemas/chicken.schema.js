// chicken.schema.js

var Schema = require('mongoose').Schema;

function ChickenSchema = Schema({
  name: { type: String, index: true }
  email: String,
  nickName: String,
  date: { type: Date, default: Date.now },
});

exports.ChickenSchema = ChickenSchema;
