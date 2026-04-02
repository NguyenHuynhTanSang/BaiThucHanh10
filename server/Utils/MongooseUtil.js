// Utils/MongooseUtil.js
const mongoose = require('mongoose');
const MyConstants = require('./Utils');  // nếu file tên MyConstants.js thì đổi thành './MyConstants'

const uri =
  'mongodb+srv://' +
  MyConstants.DB_USER + ':' +
  MyConstants.DB_PASS + '@' +
  MyConstants.DB_SERVER + '/' +
  MyConstants.DB_DATABASE;

console.log('Connecting to Mongo with URI:', uri);

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
