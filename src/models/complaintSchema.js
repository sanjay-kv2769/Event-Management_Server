const mongoose = require('mongoose');
const complaintsSchema = new mongoose.Schema({
  login_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'login_tb',
    required: true,
  },

  complaint: {
    type: String,
    required: true,
  },
});

var complaintsDB = mongoose.model('complaints_tb', complaintsSchema);
module.exports = complaintsDB;
