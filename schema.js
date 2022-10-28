const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  order_id: { type: Number },
  mobile: Number,
  order_items: [
    {
      item_id: Number,
      order_item_name: String,
      quantity: Number,
      price: Number,
    },
  ],
  online_service_charge: Number,
  total_quantity: Number,
  total_price: Number,
  status: String,
  time: String,
});
const Order = mongoose.model('order', userSchema);

module.exports = Order;
