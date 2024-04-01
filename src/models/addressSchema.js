const mongoose = require('mongoose');
const addressSchema = new mongoose.Schema({
  login_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'login_tb',
    require: true,
  },
  name: { type: String, required: true },
  phone: { type: String, require: true },
  address: { type: String, require: true },
  pincode: { type: String, require: true, default: '' },
  state: { type: String, require: true, default: '' },
  city: { type: String, require: true, default: '' },
  landmark: { type: String, require: true, default: '' },
  addressType: { type: String, require: true },
});

var addressDB = mongoose.model('address_tb', addressSchema);
module.exports = addressDB;
