// server/Utils/utils.js

const MyConstants = {
  DB_SERVER   : 'cluster0.0ouejm4.mongodb.net',
  DB_USER     : 'tansangdb_user',
  DB_PASS     : 'Sang123',
  DB_DATABASE : 'shoppingonline',

  // Tự sinh chuỗi kết nối MongoDB Atlas
  get DB_CONNECTION() {
    return `mongodb+srv://${this.DB_USER}:${this.DB_PASS}` +
           `@${this.DB_SERVER}/${this.DB_DATABASE}?retryWrites=true&w=majority`;
  },

  EMAIL_USER  : 'tansangin123@gmail.com', // Microsoft mail service
  EMAIL_PASS  : '<email_pass>',           // nhớ đổi thành mật khẩu/app password thật
  JWT_SECRET  : 'somesecret',
  JWT_EXPIRES : 3600000 // 1h
};

module.exports = MyConstants;
