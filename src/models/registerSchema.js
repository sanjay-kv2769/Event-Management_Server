const mongoose = require('mongoose');
const registerSchema = new mongoose.Schema({
  login_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'login_tb',
    required: true,
  },
  name: { type: String, required: true },
  phone: { type: String, required: true },
});

var RegisterDB = mongoose.model('register_tb', registerSchema);
module.exports = RegisterDB;
