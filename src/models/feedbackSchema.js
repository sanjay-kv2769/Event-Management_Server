const mongoose = require('mongoose');
const feedbackSchema = new mongoose.Schema({
  login_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'login_tb',
    required: true,
  },

  feedback: {
    type: String,
    required: true,
  },
});

var feedbacksDB = mongoose.model('feedbacks_tb', feedbackSchema);
module.exports = feedbacksDB;
