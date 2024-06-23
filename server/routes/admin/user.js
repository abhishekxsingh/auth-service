const {
  create, getList, getDetailById, resetPassword, me,
} = require('../../controllers/admin/user');

const { hasRole } = require('../../controllers/middleware');
const { ROLE_TYPE } = require('../../utils/constant');

module.exports = (router) => {
  router.post('/user', hasRole([ ROLE_TYPE.SYSTEM_OWNER, ROLE_TYPE.SYSTEM_ADMIN, ROLE_TYPE.ADMIN ]), create);
  router.put('/user/reset-password', hasRole([ ROLE_TYPE.SYSTEM_OWNER, ROLE_TYPE.SYSTEM_ADMIN, ROLE_TYPE.ADMIN ]), resetPassword);
  router.get('/users', getList);
  router.get('/user/:publicId', getDetailById);
  router.get('/me', me);
};
