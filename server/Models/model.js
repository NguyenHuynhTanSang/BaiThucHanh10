// CLI : npm install mongoose --save
const mongoose = require('mongoose');

// ====== SCHEMAS ======

// Admin
const AdminSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: String,
  password: String
}, { versionKey: false });

// Category  (thêm parent_category_id)
const CategorySchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  parent_category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  }
}, { versionKey: false });

// Customer
const CustomerSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: String,
  password: String,
  name: String,
  phone: String,
  email: String,
  active: Number,
  token: String
}, { versionKey: false });

// Product  (thêm description, categories_id, images[], show)
const ProductSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  description: String,                  // mới
  price: Number,
  image: String,
  cdate: Number,
  category: CategorySchema,             // embed cũ vẫn để đó, không dùng cũng được
  categories_id: [{                     // mới: 1 product thuộc nhiều category
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  images: [String],                     // mới: danh sách link hình
  show: {                               // mới: có hiển thị hay ẩn
    type: Boolean,
    default: true
  }
}, { versionKey: false });

// Item (một dòng trong Order)
const ItemSchema = new mongoose.Schema({
  product: ProductSchema,
  quantity: Number
}, { versionKey: false, _id: false });

// Order
const OrderSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  cdate: Number,
  total: Number,
  status: String,
  customer: CustomerSchema,
  items: [ItemSchema]
}, { versionKey: false });

// ====== MODELS ======
const Admin    = mongoose.model('Admin',    AdminSchema,    'admin');
const Category = mongoose.model('Category', CategorySchema, 'categories');
const Customer = mongoose.model('Customer', CustomerSchema, 'customers');
const Product  = mongoose.model('Product',  ProductSchema,  'products');
const Order    = mongoose.model('Order',    OrderSchema,    'orders');

module.exports = {
  Admin,
  Category,
  Customer,
  Product,
  Order
};
