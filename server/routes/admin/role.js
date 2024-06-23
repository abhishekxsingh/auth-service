const { save, getAll } = require('../../controllers/admin/role');

module.exports = (router) => {
  router.get('/role', getAll);
  router.post('/role', save);
};
