const AuthService = require('../../services/admin/auth');
const { login: loginSchema } = require('../../dto-schemas/admin/auth');

const Validator = require('../../utils/validator');

const logout = async (req, res) => {
  try {
    const { auth: { userId: updatedBy }, headers: { authorization } } = req;

    const data = { authorization, updatedBy };

    const { doc, error } = await AuthService.logout(data);

    if (doc) {
      res.setHeader('message', 'successfully logout.');

      return res.postRequest();
    }

    return res.badRequest('field-validation', error);
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

const login = async (req, res) => {
  try {
    const { body } = req;

    const data = { ...body };

    const { errors } = Validator.isSchemaValid({ data, schema: loginSchema });

    if (errors) {
      return res.badRequest('field-validation', errors);
    }

    const { errors: err, doc } = await AuthService.login(data);

    if (doc) {
      const {
        token, expiresIn, refreshToken, isSystemGeneratedPassword,
      } = doc;

      if (isSystemGeneratedPassword) {
        res.setHeader('is-system-generated-password', isSystemGeneratedPassword);

        return res.postRequest();
      }

      res.setHeader('token', token);
      res.setHeader('expires-in', expiresIn);
      res.setHeader('refresh-token', refreshToken);
      res.setHeader('message', 'You have been successfully logged-in.');

      return res.postRequest();
    }

    return res.badRequest('field-validation', err);
  } catch (error) {
    return res.serverError(error);
  }
};

module.exports = {
  logout,
  me,
  login,
};
