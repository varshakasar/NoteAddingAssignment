var mongoose = require('mongoose');

var user = new mongoose.Schema({
	email:String,
  name: String,
  age: Number,
  gender:String,
  password:String,
  isauthenticated:Boolean
});

module.exports = user;