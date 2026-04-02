const jwt = require('jsonwebtoken');
const MyConstants = require('./MyConstants');

const JwtUtil = {
  // Tạo token
  genToken(username, password) {
    const payload = { username, password };

    const token = jwt.sign(
      payload,
      MyConstants.JWT_SECRET,
      {
        expiresIn: MyConstants.JWT_EXPIRES,
      }
    );

    return token;
  },

  // Middleware kiểm tra token
  checkToken(req, res, next) {
    let token =
      req.headers['x-access-token'] ||
      req.headers['authorization'];

    // Nếu header dạng: "Bearer xxxxx"
    if (token && token.startsWith('Bearer ')) {
      token = token.slice(7);
    }

    if (!token) {
      return res.json({
        success: false,
        message: 'Auth token is not supplied',
      });
    }

    jwt.verify(token, MyConstants.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.json({
          success: false,
          message: 'Token is not valid',
        });
      }

      req.decoded = decoded;
      next();
    });
  },
};

module.exports = JwtUtil;