const mongoose = require('mongoose');
const productsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  color: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
});

var productsDB = mongoose.model('products_tb', productsSchema);
module.exports = productsDB;
