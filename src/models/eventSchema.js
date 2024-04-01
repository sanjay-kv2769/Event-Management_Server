const mongoose = require('mongoose');
const eventSchema = new mongoose.Schema({
  event_type: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
});

var eventDB = mongoose.model('events_tb', eventSchema);
module.exports = eventDB;
