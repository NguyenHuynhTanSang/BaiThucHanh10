const MyConstants = {
  EMAIL_USER: process.env.EMAIL_USER || 'tansangin123@gmail.com',
  EMAIL_PASS: process.env.EMAIL_PASS || '',
  JWT_SECRET: process.env.JWT_SECRET || 'my_secret_key_123',
  JWT_EXPIRES: process.env.JWT_EXPIRES || '7d'
};

module.exports = MyConstants;