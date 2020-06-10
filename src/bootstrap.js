const dotenv = require('dotenv');

// const NODE_ENV = process.env.NODE_ENV.replace(/\s/g, '');

dotenv.config({
  path: process.env.NODE_ENV === 'test ' ? '.env.test' : '.env',
});
