const mongoose = require('mongoose');

const {
  DATABASE: {
    name,
    username,
    password,
    host,
    options,
  },
} = require('../config');
const models = require('./models');

const url = `mongodb+srv://${username}:${password}@${host}/${name}`;

mongoose.connect(url, options);

let database = {};

database = models(mongoose);

module.exports = { ...database, mongoose };
