// server/Models/AdminDAO.js
const mongoose = require('mongoose');
const Models = require('./model');    // cùng thư mục với file model.js

const AdminDAO = {
  // tìm admin theo username + password
  selectByUsernameAndPassword: async (username, password) => {
    const query = { username: username, password: password };
    const admin = await Models.Admin.findOne(query).exec();
    return admin;
  },
};

module.exports = AdminDAO;
