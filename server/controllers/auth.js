const Auth = require('../services/auth');

const jwks = async (req, res) => {
  try {
    const { keys } = await Auth.jwks();

    if (keys) {
      return res.getRequest({ keys });
    }

    return res.status(503).json({ keys });
  } catch (error) {
    return res.serverError(error);
  }
};

const refresh = async (req, res) => {
  const { query, headers: { authorization } } = req;

  try {
    const accessToken = authorization || query.access_token;

    if (accessToken) {
      const is = await Auth.refresh(accessToken.replace(/Bearer/, '').trim());

      if (is) {
        const {
          token, refreshToken, expiresIn,
        } = is;

        res.setHeader('token', token);
        res.setHeader('refresh-token', refreshToken);
        res.setHeader('expires-in', expiresIn);
        res.setHeader('message', 'successfully refreshed!.');

        return res.postRequest();
      }

      return res.unAuthorized();
    }

    return res.unAuthorized();
  } catch (error) {
    return res.unAuthorized();
  }
};

module.exports = {
  jwks,
  refresh,
};
