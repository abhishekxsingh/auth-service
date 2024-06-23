const { getList, getDetailById } = require('../../controllers/admin/customer');

module.exports = (router) => {
  router.get('/customers', getList);
  router.get('/customer/:publicId', getDetailById);
};
