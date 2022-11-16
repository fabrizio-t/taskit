'use strict';
const dotenv = require("dotenv");
dotenv.config();

const mongoose = require('mongoose');

try {
  mongoose.connect(process.env.DB_URL);
  console.log('connected to Mongo DB...')
} catch (e) {
  console.log('DB Error', e)
}

module.exports = mongoose;

