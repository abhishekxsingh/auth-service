const { middleware: cache } = require('apicache');

const onlyStatusSuccess = (req, res) => (res.statusCode === 200 || res.statusCode === 201);

const Authentication = require('smart-auth-middleware');

const { jwks, refresh } = require('../controllers/auth');

const { AUDIENCE_TYPE, ISSUER } = require('../utils/constant');
const { IDENTITY_SERVICE_URL } = require('../config');

module.exports = (router) => {
  router.get('/.well-known/jwks', cache('5 minutes', onlyStatusSuccess), jwks);
  router.get('/refresh-token', Authentication({
    IDENTITY_SERVICE_URL,
    AUDIENCE: AUDIENCE_TYPE.REFRESH_TOKEN,
    ISSUER,
    JWKSURL: `${IDENTITY_SERVICE_URL}/v1/.well-known/jwks`,
  }), refresh);
};
