const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv')

dotenv.config()

const app = express();

app.use(cors());
app.use(express.json()); // WARNING: This needs to go before API endpoints to enable JSON parsing!
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
  );
  next();
});

// DB connection
const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGODB_CONNSTRING
const client = new MongoClient(url);
client.connect();

// Init API
var api = require('./api.js');
api.setApp(app, client);

app.listen(5000); // start Node + Express server on port 5000
