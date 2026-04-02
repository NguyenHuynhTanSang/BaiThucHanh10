const mongoose = require('mongoose');
const MyConstants = require('./utils');

const uri = MyConstants.DB_CONNECTION;

console.log('Connecting to Mongo...');

mongoose
  .connect(uri)
  .then(() => {
    console.log(
      'Connected to ' +
        MyConstants.DB_SERVER +
        '/' +
        MyConstants.DB_DATABASE
    );
  })
  .catch((err) => {
    console.error('Mongo error:', err);
  });

module.exports = mongoose;