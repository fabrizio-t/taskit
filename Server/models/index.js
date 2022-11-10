'use strict';

const mongoose = require('mongoose');

try {
    mongoose.connect('mongodb://localhost:27017/taskit');
    console.log('connected to Mongo DB...')
} catch (e) {
    console.log('DB Error', e)
}

module.exports = mongoose;
