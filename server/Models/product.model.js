const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  price: { type: Number, min: 0, default: 0 },
  categories_id: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  images: [String],
  show: { type: Boolean, default: true }
});

module.exports = mongoose.model('Product', productSchema);
