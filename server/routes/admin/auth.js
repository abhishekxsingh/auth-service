const apiLimit = require('express-rate-limit');
const {
  logout, me, login,
} = require('../../controllers/admin/auth');

const { ALLOWED_IP_LIST } = require('../../utils/constant');

const rateLimit = apiLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Too many requests created from this IP, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => ALLOWED_IP_LIST.includes(req.ip),
});

module.exports = (router) => {
  router.post('/logout', logout);
  router.post('/login', rateLimit, login);
  router.get('/me', me);
};
