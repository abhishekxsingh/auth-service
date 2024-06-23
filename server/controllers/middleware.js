const compose = require('composable-middleware');

const hasRole = (roleType) => compose()
  .use(async (req, res, next) => {
    try {
      const { auth } = req;

      if (auth) {
        const { role } = auth;
        const type = Object.prototype.toString.call(roleType);

        if (type === '[object Array]') {
          const is = roleType.some((element) => element === role);

          if (is) {
            return next();
          }

          return res.forbidden();
        }
        if (type === '[object String]' && role === roleType) {
          return next();
        }

        return res.forbidden();
      }

      return res.unAuthorized();
    } catch (error) {
      return res.serverError(error);
    }
  });

module.exports = {
  hasRole,
};
