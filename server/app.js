const express   = require('express');
const mongoose  = require('mongoose');
const Category  = require('./Models/category.model');
const Product   = require('./Models/product.model');
const MyConstants = require('./Utils/');

const app = express();
app.use(express.json());

// Route test
app.get('/', (req, res) => {
  res.send('API server is running. Try GET /categories or /products');
});

// KẾT NỐI MONGODB
mongoose
  .connect(MyConstants.DB_CONNECTION, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err.message));

/* ==========================
   CATEGORY
   ==========================*/

// 1. Thêm 1 category mới
app.post('/categories', async (req, res) => {
  try {
    const { name, parent_category_id } = req.body;

    const cat = new Category({
      name,
      parent_category_id: parent_category_id || null
    });

    const saved = await cat.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. Sửa 1 category theo id
app.put('/categories/:id', async (req, res) => {
  try {
    const { name, parent_category_id } = req.body;

    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name,
        parent_category_id: parent_category_id || null
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Category không tồn tại' });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 6. Xóa 1 category theo id (chỉ xóa khi không có product & category con)
app.delete('/categories/:id', async (req, res) => {
  try {
    const id = req.params.id;

    // có product nào thuộc category này không?
    const productCount = await Product.countDocuments({ categories_id: id });
    // có category con nào không?
    const childCount   = await Category.countDocuments({ parent_category_id: id });

    if (productCount > 0 || childCount > 0) {
      return res.status(400).json({
        message: 'Không thể xóa: category vẫn còn sản phẩm hoặc có category con.'
      });
    }

    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Category không tồn tại' });
    }

    res.json({ message: 'Đã xóa category thành công' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 7. Lấy danh sách các category (dạng cây, có children)
app.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find().lean();

    // build tree
    const map = {};
    categories.forEach(c => {
      c.children = [];
      map[c._id] = c;
    });

    const roots = [];
    categories.forEach(c => {
      if (c.parent_category_id) {
        const parent = map[c.parent_category_id];
        if (parent) {
          parent.children.push(c);
        }
      } else {
        roots.push(c);
      }
    });

    res.json(roots);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ==========================
   PRODUCT
   ==========================*/

// 2. Thêm 1 product mới
app.post('/products', async (req, res) => {
  try {
    const { name, description, price, categories_id, images, show } = req.body;

    const p = new Product({
      name,
      description,
      price,
      categories_id,
      images,
      show
    });

    const saved = await p.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 4. Sửa 1 product theo id
app.put('/products/:id', async (req, res) => {
  try {
    const { name, description, price, categories_id, images, show } = req.body;

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, categories_id, images, show },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Product không tồn tại' });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 5. Xóa 1 product theo id
app.delete('/products/:id', async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Product không tồn tại' });
    }

    res.json({ message: 'Đã xóa product thành công' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 8. Lấy danh sách các product
app.get('/products', async (req, res) => {
  try {
    const list = await Product.find().populate('categories_id');
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 9. Tìm kiếm product theo tên (?name=abc)
app.get('/products/search', async (req, res) => {
  try {
    const name  = req.query.name || '';
    const regex = new RegExp(name, 'i'); // không phân biệt hoa thường

    const list = await Product.find({ name: regex });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 10. Tìm danh sách product theo category
app.get('/products/category/:categoryId', async (req, res) => {
  try {
    const categoryId = req.params.categoryId;

    const list = await Product.find({ categories_id: categoryId });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ==========================
   START SERVER
   ==========================*/

const PORT = 3000;
app.listen(PORT, () => {
  console.log('Server is running at http://localhost:' + PORT);
});
