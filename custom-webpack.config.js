const Dotenv = require('dotenv-webpack');

module.exports = {
  plugins: [
    new Dotenv({
      path: process.env.ENV_FILE || '.env',
      systemvars: true
    })
  ]
};