/* eslint-disable line-comment-position */
const rateLimit = require('express-rate-limit');

const {
  logout, me, appleLogin, googleLogin,
} = require('../../controllers/customer/auth');

const limiterSocial = rateLimit({
  windowMs: 5 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // store: ... , // Use an external store for more precise rate limiting
  message: 'Too many accounts created from this IP, please try again after an hour',
  skipFailedRequests: true,
});

module.exports = (router) => {
  router.post('/google/login', limiterSocial, googleLogin);
  router.post('/apple/login', limiterSocial, appleLogin);
  router.post('/logout', logout);
  router.get('/me', me);
};
