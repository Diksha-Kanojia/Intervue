const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  options: [{
    type: String,
    required: true
  }],
  correctOptions: [{
    type: Number,
    required: true
  }],
  timer: {
    type: Number,
    default: 60
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Question', QuestionSchema);
