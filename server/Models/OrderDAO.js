require('../Utils/MongooseUtil');
const Models = require('./model');

const OrderDAO = {
  async insert(order) {
    const mongoose = require('mongoose');
    order._id = new mongoose.Types.ObjectId();
    const result = await Models.Order.create(order);
    return result;
  },

  async selectByCustID(cid) {
    const mongoose = require('mongoose');
    const query = { 'customer._id': new mongoose.Types.ObjectId(cid) };
    const orders = await Models.Order.find(query);
    return orders;
  },

  async selectAll() {
    const query = {};
    const mysort = { cdate: -1 }; // descending
    const orders = await Models.Order.find(query).sort(mysort).exec();
    return orders;
  },

  async update(_id, newStatus) {
    const newvalues = { status: newStatus };
    const result = await Models.Order.findByIdAndUpdate(_id, newvalues, { new: true });
    return result;
  }
};

module.exports = OrderDAO;