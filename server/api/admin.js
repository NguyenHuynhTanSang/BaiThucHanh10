const express = require('express');
const router = express.Router();

const JwtUtil = require('../Utils/JwtUtil');
const EmailUtil = require('../Utils/EmailUtil');
const CategoryDAO = require('../Models/CategoryDAO');
const ProductDAO = require('../Models/ProductDAO');
const OrderDAO = require('../Models/OrderDAO');
const CustomerDAO = require('../Models/CustomerDAO');

// LOGIN: auto pass, đăng nhập luôn
router.post('/login', (req, res) => {
  const payload = { username: 'admin', role: 'admin' };
  const token = JwtUtil.genToken(payload);

  return res.json({
    token,
    message: 'Login success!',
    admin: { username: 'admin', email: 'admin@gmail.com', name: 'Admin' },
  });
});

// CATEGORY
router.get('/categories', JwtUtil.checkToken, async (req, res) => {
  try {
    const categories = await CategoryDAO.selectAll();
    res.json(categories);
  } catch (err) {
    console.error('Get categories error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/categories', JwtUtil.checkToken, async function (req, res) {
  const name = req.body.name;
  const category = { name: name };
  const result = await CategoryDAO.insert(category);
  res.json(result);
});

router.put('/categories/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const name = req.body.name;
  const category = { _id: _id, name: name };
  const result = await CategoryDAO.update(category);
  res.json(result);
});

router.delete('/categories/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const result = await CategoryDAO.delete(_id);
  res.json(result);
});

// PRODUCT
router.get('/products', JwtUtil.checkToken, async function (req, res) {
  let products = await ProductDAO.selectAll();

  const sizePage = 4;
  const noPages = Math.ceil(products.length / sizePage);
  let curPage = 1;

  if (req.query.page) curPage = parseInt(req.query.page);

  const offset = (curPage - 1) * sizePage;
  products = products.slice(offset, offset + sizePage);

  const result = { products: products, noPages: noPages, curPage: curPage };
  res.json(result);
});

router.post('/products', JwtUtil.checkToken, async function (req, res) {
  try {
    const name = req.body.name;
    const price = req.body.price;
    const cid = req.body.category;
    const image = req.body.image;
    const now = new Date().getTime();

    const category = await CategoryDAO.selectByID(cid);

    if (!category) {
      return res.status(400).json({ success: false, message: 'Category not found: ' + cid });
    }

    const product = { name, price, image, cdate: now, category };
    const result = await ProductDAO.insert(product);

    res.json({ success: true, product: result });
  } catch (err) {
    console.error('POST /products error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/products', JwtUtil.checkToken, async function (req, res) {
  const _id = req.body.id;
  const name = req.body.name;
  const price = req.body.price;
  const cid = req.body.category;
  const image = req.body.image;
  const now = new Date().getTime();

  const category = await CategoryDAO.selectByID(cid);

  const product = {
    _id: _id,
    name: name,
    price: price,
    image: image,
    cdate: now,
    category: category,
  };

  const result = await ProductDAO.update(product);
  res.json(result);
});

// CUSTOMER
router.get('/customers', JwtUtil.checkToken, async function (req, res) {
  try {
    const customers = await CustomerDAO.selectAll();
    res.json(customers);
  } catch (err) {
    console.error('Get customers error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/customers/deactive/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const token = req.body.token;
  const result = await CustomerDAO.active(_id, token, 0);
  res.json(result);
});

router.get('/customers/sendmail/:id', JwtUtil.checkToken, async function (req, res) {
  try {
    const _id = req.params.id;
    const cust = await CustomerDAO.selectByID(_id);
    if (cust) {
      const send = await EmailUtil.send(cust.email, cust._id, cust.token);
      if (send) {
        res.json({ success: true, message: 'Please check email' });
      } else {
        res.json({ success: false, message: 'Email failure' });
      }
    } else {
      res.json({ success: false, message: 'Not exists customer' });
    }
  } catch (err) {
    console.error('Send mail error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ORDER
router.get('/orders', JwtUtil.checkToken, async function (req, res) {
  try {
    const orders = await OrderDAO.selectAll();
    res.json(orders);
  } catch (err) {
    console.error('Get orders error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/orders/customer/:cid', JwtUtil.checkToken, async function (req, res) {
  try {
    const _cid = req.params.cid;
    const orders = await OrderDAO.selectByCustID(_cid);
    res.json(orders);
  } catch (err) {
    console.error('Get customer orders error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/orders/status/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const newStatus = req.body.status;
  const result = await OrderDAO.update(_id, newStatus);
  res.json(result);
});

module.exports = router;