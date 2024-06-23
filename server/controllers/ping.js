const { VERSION, NAME } = require('../config');

const status = (req, res) => {
  res.getRequest({
    status: 'ok', version: VERSION, name: NAME,
  });
};

module.exports = { status };
