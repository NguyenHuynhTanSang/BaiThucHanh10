require('../Utils/MongooseUtil');
const Models = require('./model');

const ProductDAO = {
  async selectAll() {
    const query = {};
    const products = await Models.Product.find(query).exec();
    return products;
  },

  async insert(product) {
    const mongoose = require('mongoose');
    product._id = new mongoose.Types.ObjectId();
    const result = await Models.Product.create(product);
    return result;
  },

  async selectByID(_id) {
    const product = await Models.Product.findById(_id).exec();
    return product;
  },

  async selectTopNew(top) {
    const query = {};
    const mysort = { cdate: -1 };
    const products = await Models.Product.find(query).sort(mysort).limit(top).exec();
    return products;
  },

  async selectTopHot(top) {
    const query = {};
    const mysort = { cdate: -1 };
    const products = await Models.Product.find(query).sort(mysort).skip(3).limit(top).exec();
    return products;
  },

  async update(product) {
    const newvalues = {
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    };

    const result = await Models.Product.findByIdAndUpdate(
      product._id,
      newvalues,
      { new: true }
    );
    return result;
  },

  async selectByCatID(_cid) {
    const query = { 'category._id': _cid };
    const products = await Models.Product.find(query).exec();
    return products;
  },

  async selectByKeyword(keyword) {
    const query = { name: { $regex: new RegExp(keyword, 'i') } };
    const products = await Models.Product.find(query).exec();
    return products;
  }
};

module.exports = ProductDAO;