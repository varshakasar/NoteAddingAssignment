const mongoose = require('mongoose');

let note = new mongoose.Schema({
	subject:String,
  content: String,
  tag:String,
  user:{type: mongoose.Schema.Types.ObjectId,ref:'user'}
});

module.exports = note;