'use strict';

const mongoose = require('./index.js');

const Schema = mongoose.Schema;

const schema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    deadline: {
        type: Date,
        required: true
    }
});

const projects = mongoose.model('Project', schema);


module.exports = projects;

