'use strict';

const mongoose = require('mongoose');

try {
    mongoose.connect('mongodb://localhost:27017/taskit');
    console.log('connected to Mongo DB...')
} catch (e) {
    console.log('DB Error', e)
}

module.exports = mongoose;

/* const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://taskit:<password>@cluster0.4zrmrcr.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
}); */