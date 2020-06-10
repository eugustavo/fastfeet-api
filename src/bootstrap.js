const dotenv = require('dotenv');

// const NODE_ENV = process.env.NODE_ENV.trim();

dotenv.config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});
