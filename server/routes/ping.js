const { status } = require('../controllers/ping');

module.exports = (router) => {
  router.get('/ping', status);
};
