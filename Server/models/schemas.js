'use strict';

const mongoose = require('./index.js');

const Schema = mongoose.Schema;

const projectSchema = new Schema({
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
    },
    collabs: {
        type: [],
        required: true
    },
    sub: { // "sub" field from auth0 = user unique id
        type: String,
        required: true
    }
});

const projects = mongoose.model('Project', projectSchema);

const userSchema = new Schema({
    sub: { // "sub" field from auth0 = user unique id
        type: String,
        required: true
    },
    nickname: {
        type: String,
        required: true
    },
    picture: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
});

const users = mongoose.model('User', userSchema);

const taskSchema = new Schema({
    project_id: {
        type: String,
        required: true
    },
    sub: { // "sub" field from auth0 = user unique id
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    deadline: {
        type: Date,
        required: true
    },
    todos: {
        type: [],
        required: true
    },
    color: {
        type: String,
        required: false
    },
    tags: {
        type: [],
        required: true
    },
    priority: {
        type: Number,
        required: true
    },
});

const tasks = mongoose.model('Task', taskSchema);

module.exports = { projects, users, tasks };

