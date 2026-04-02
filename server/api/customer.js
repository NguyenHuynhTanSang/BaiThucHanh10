const express = require('express');
const router = express.Router();

// utils
const CryptoUtil = require('../Utils/CryptoUtil');
const EmailUtil = require('../Utils/EmailUtil');
const JwtUtil = require('../Utils/JwtUtil');

// daos
const CategoryDAO = require('../Models/CategoryDAO');
const ProductDAO = require('../Models/ProductDAO');
const CustomerDAO = require('../Models/CustomerDAO');
const OrderDAO = require('../Models/OrderDAO');

// myorders
router.get('/orders/customer/:cid', JwtUtil.checkToken, async function (req, res) {
  const cid = req.params.cid;
  const orders = await OrderDAO.selectByCustID(cid);
  res.json(orders);
});

// category
router.get('/categories', async function (req, res) {
  const categories = await CategoryDAO.selectAll();
  res.json(categories);
});

// product
router.get('/products/new', async function (req, res) {
  const products = await ProductDAO.selectTopNew(3);
  res.json(products);
});

router.get('/products/hot', async function (req, res) {
  const products = await ProductDAO.selectTopHot(3);
  res.json(products);
});

router.get('/products/category/:cid', async function (req, res) {
  const cid = req.params.cid;
  const products = await ProductDAO.selectByCatID(cid);
  res.json(products);
});

router.get('/products/search/:keyword', async function (req, res) {
  const keyword = req.params.keyword;
  const products = await ProductDAO.selectByKeyword(keyword);
  res.json(products);
});

router.get('/products/:id', async function (req, res) {
  const _id = req.params.id;
  const product = await ProductDAO.selectByID(_id);
  res.json(product);
});

// customer
router.post('/signup', async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  const name = req.body.name;
  const phone = req.body.phone;
  const email = req.body.email;

  const dbCust = await CustomerDAO.selectByUsernameOrEmail(username, email);

  if (dbCust) {
    res.json({ success: false, message: 'Exists username or email' });
  } else {
    const now = new Date().getTime();
    const token = CryptoUtil.md5(now.toString());

    const newCust = {
      username: username,
      password: password,
      name: name,
      phone: phone,
      email: email,
      active: 0,
      token: token
    };

    const result = await CustomerDAO.insert(newCust);

    if (result) {
      const send = await EmailUtil.send(email, result._id, token);
      if (send) {
        res.json({ success: true, message: 'Please check email' });
      } else {
        res.json({ success: false, message: 'Email failure' });
      }
    } else {
      res.json({ success: false, message: 'Insert failure' });
    }
  }
});

router.post('/active', async function (req, res) {
  const _id = req.body.id;
  const token = req.body.token;
  const result = await CustomerDAO.active(_id, token, 1);
  res.json(result);
});

router.post('/login', async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  const customer = await CustomerDAO.selectByUsernameAndPassword(username, password);

  if (customer) {
    if (customer.active === 1) {
      const token = JwtUtil.genToken(customer.username, customer.password);
      res.json({
        success: true,
        message: 'Login successfully',
        token: token,
        customer: customer
      });
    } else {
      res.json({
        success: false,
        message: 'Your account is not active'
      });
    }
  } else {
    res.json({
      success: false,
      message: 'Incorrect username or password'
    });
  }
});

router.get('/token', async function (req, res) {
  const token = req.headers['x-access-token'];
  const customer = await CustomerDAO.selectByToken(token);
  res.json(customer);
});

// myprofile
router.put('/customers/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const username = req.body.username;
  const password = req.body.password;
  const name = req.body.name;
  const phone = req.body.phone;
  const email = req.body.email;

  const customer = {
    _id: _id,
    username: username,
    password: password,
    name: name,
    phone: phone,
    email: email
  };

  const result = await CustomerDAO.update(customer);
  res.json(result);
});

// mycart
router.post('/checkout', JwtUtil.checkToken, async function (req, res) {
  const now = new Date().getTime(); // milliseconds
  const total = req.body.total;
  const items = req.body.items;
  const customer = req.body.customer;

  const order = {
    cdate: now,
    total: total,
    status: 'PENDING',
    customer: customer,
    items: items
  };

  const result = await OrderDAO.insert(order);
  res.json(result);
});

module.exports = router;