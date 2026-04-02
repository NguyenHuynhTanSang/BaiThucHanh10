const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/admin', require('./api/admin'));
app.use('/api/customer', require('./api/customer'));

// =========================
// DEPLOYMENT
// =========================

// Admin build
app.use(
  '/admin',
  express.static(path.resolve(__dirname, '../client-admin/build'))
);

app.get('/admin/{*splat}', (req, res) => {
  res.sendFile(
    path.resolve(__dirname, '../client-admin/build', 'index.html')
  );
});

// Customer build
app.use(
  '/',
  express.static(path.resolve(__dirname, '../client-customer/build'))
);

app.get('/{*splat}', (req, res) => {
  res.sendFile(
    path.resolve(__dirname, '../client-customer/build', 'index.html')
  );
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});