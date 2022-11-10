var express = require('express');
var cors = require('cors');
const dotenv = require("dotenv");
const { errorHandler } = require("./middleware/error.middleware");

var app = express();
dotenv.config();

const router = require('./router.js');
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json(), router);
app.use(errorHandler);

const port = process.env.PORT;

app.listen(port);

console.log('Server listening on port ' + port);

