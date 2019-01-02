var mongoose = require('mongoose');

var note = new mongoose.Schema({
	subject:String,
  content: String,
  tag:String
});

module.exports = note;