const mongoose = require('mongoose');
const ordersSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product_tb',
    required: true,
  },
  login_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'login_tb',
    required: true,
  },
  address: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    pincode: { type: String, default: '' },
    state: { type: String, default: '' },
    city: { type: String, default: '' },
    landmark: { type: String, default: '' },
    addressType: { type: String, required: true },
  },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 1, required: true },
  subtotal: {
    type: Number,
    default: function () {
      return this.price;
    },
  },
  order_date: { type: Date, require: true },
  order_status: { type: String, default: 'pending', require: true },
});

var ordersDB = mongoose.model('orders_tb', ordersSchema);
module.exports = ordersDB;
