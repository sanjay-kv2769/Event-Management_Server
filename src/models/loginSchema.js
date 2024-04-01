const mongoose = require('mongoose');
const loginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  rawpassword: { type: String,default:'' },

  role: { type: Number, required: true },
});

var loginDB = mongoose.model('login_tb', loginSchema);
module.exports = loginDB;
