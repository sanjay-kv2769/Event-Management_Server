const mongoose = require('mongoose');
const bookingSchema = new mongoose.Schema({
  event_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'event_tb',
    required: true,
  },
  login_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'login_tb',
    required: true,
  },

 
  date: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: 'pending',
  },
});

var bookingsDB = mongoose.model('bookings_tb', bookingSchema);
module.exports = bookingsDB;
