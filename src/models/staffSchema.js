const mongoose = require('mongoose');
const staffSchema = new mongoose.Schema({
  login_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'login_tb',
    required: true,
  },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  place: { type: String, required: true },
  attendance: [
    {
      date: { type: String, required: true },
      // date: { type: Date, required: true },
      isPresent: { type: Boolean, required: true },
    },
  ],
  // designation: { type: String, required: true },
});

var staffDB = mongoose.model('staff_tb', staffSchema);
module.exports = staffDB;
