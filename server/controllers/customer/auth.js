const AuthService = require('../../services/customer/auth');
const { firebase: firebaseSchema } = require('../../dto-schemas/customer/auth');

const Validator = require('../../utils/validator');

const googleLogin = async (req, res) => {
  try {
    const { headers: { 'x-firebase-token': firebaseToken, 'x-platform-deviceid': deviceId }, body } = req;

    const data = {
      ...body, token: firebaseToken, deviceId,
    };

    const { errors } = Validator.isSchemaValid({ data, schema: firebaseSchema });

    if (errors) {
      return res.badRequest('field-validation', errors);
    }

    const { errors: err, doc } = await AuthService.googleLogin(data);

    if (doc) {
      const {
        token, distinctId, expiresIn, refreshToken, merchantId,
      } = doc;

      if (merchantId) {
        res.setHeader('merchant-id', merchantId);
      }
      res.setHeader('token', token);
      res.setHeader('distinct-id', distinctId);
      res.setHeader('expires-in', expiresIn);
      res.setHeader('refresh-token', refreshToken);
      res.setHeader('message', 'You mobile has been successfully verified.');

      return res.postRequest();
    }

    return res.badRequest('field-validation', err);
  } catch (error) {
    return res.serverError(error);
  }
};

const appleLogin = async (req, res) => {
  try {
    const { headers: { 'x-firebase-token': firebaseToken, 'x-platform-deviceid': deviceId }, body } = req;

    const data = {
      ...body, token: firebaseToken, deviceId,
    };

    const { errors } = Validator.isSchemaValid({ data, schema: firebaseSchema });

    if (errors) {
      return res.badRequest('field-validation', errors);
    }

    const { errors: err, doc } = await AuthService.appleLogin(data);

    if (doc) {
      const {
        token, distinctId, expiresIn, refreshToken, merchantId,
      } = doc;

      if (merchantId) {
        res.setHeader('merchant-id', merchantId);
      }
      res.setHeader('token', token);
      res.setHeader('distinct-id', distinctId);
      res.setHeader('expires-in', expiresIn);
      res.setHeader('refresh-token', refreshToken);
      res.setHeader('message', 'You mobile has been successfully verified.');

      return res.postRequest();
    }

    return res.badRequest('field-validation', err);
  } catch (error) {
    return res.serverError(error);
  }
};

const logout = async (req, res) => {
  try {
    const { auth: { userId: updatedBy }, headers: { authorization } } = req;

    const data = { authorization, updatedBy };

    const { doc, errors } = await AuthService.logout(data);

    if (doc) {
      res.setHeader('message', 'successfully logout.');

      return res.postRequest();
    }

    return res.badRequest('field-validation', errors);
  } catch (error) {
    return res.serverError(error);
  }
};

const me = async (req, res) => {
  try {
    const { auth: { userId: publicId }, headers: { authorization } } = req;

    const data = { authorization, publicId };

    const { doc } = await AuthService.me(data);

    if (doc) {
      return res.getRequest(doc);
    }

    return res.notFound();
  } catch (error) {
    return res.serverError(error);
  }
};

module.exports = {
  googleLogin,
  appleLogin,
  logout,
  me,
};
