const mongoose = require('mongoose');
const physicianSchema = new mongoose.Schema({
  login_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'login_tb',
    required: true,
  },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  place: { type: String, required: true },
  // designation: { type: String, required: true },
});

var physicianDB = mongoose.model('physician_tb', physicianSchema);
module.exports = physicianDB;
