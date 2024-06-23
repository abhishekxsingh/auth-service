const UserService = require('../../services/admin/user');
const { create: createSchema, resetPassword: resetPasswordSchema, getList: getListSchema } = require('../../dto-schemas/admin/user');

const Validator = require('../../utils/validator');

const create = async (req, res) => {
  try {
    const { body, auth: { userId } } = req;

    const data = { ...body, createdBy: userId };

    const { errors } = Validator.isSchemaValid({ data, schema: createSchema });

    if (errors) {
      return res.badRequest('field-validation', errors);
    }

    const { errors: err, doc } = await UserService.create(data);

    if (doc) {
      const { publicId, password } = doc;

      res.setHeader('message', 'created!');
      res.setHeader('public-id', publicId);
      res.setHeader('password', password);

      return res.postRequest();
    }

    return res.badRequest('field-validation', err);
  } catch (error) {
    return res.serverError(error);
  }
};

const resetPassword = async (req, res) => {
  try {
    const { body, auth: { userId } } = req;

    const data = { ...body, updatedBy: userId };

    const { errors } = Validator.isSchemaValid({ data, schema: resetPasswordSchema });

    if (errors) {
      return res.badRequest('field-validation', errors);
    }

    const { errors: err, doc } = await UserService.resetPassword(data);

    if (doc) {
      const { password } = doc;

      res.setHeader('message', 'Password has been reset successfully!');
      res.setHeader('password', password);

      return res.updated();
    }

    return res.badRequest('field-validation', err);
  } catch (error) {
    return res.serverError(error);
  }
};

const getList = async (req, res) => {
  try {
    const { query } = req;

    const data = query;

    const { errors } = Validator.isSchemaValid({ data, schema: getListSchema });

    if (errors) {
      return res.badRequest('field-validation', errors);
    }

    const { pageSize, pageNumber } = query;

    const limit = pageSize || 50;
    const offset = limit * ((parseInt(pageNumber) || 1) - 1);

    const { errors: getListErrors, count, doc } = await UserService.getList({ ...data, limit, offset });

    if (doc) {
      res.setHeader('x-coreplatform-paging-limit', limit);
      res.setHeader('x-coreplatform-total-records', count);

      return res.getRequest(doc);
    }

    return res.badRequest('field-validation', getListErrors);
  } catch (error) {
    return res.serverError(error);
  }
};

const getDetailById = async (req, res) => {
  try {
    const { params: { publicId } } = req;

    const data = { publicId };

    const is = Validator.isValidUuid(publicId);

    if (!is) {
      return res.badRequest('field-validation', [ { name: 'user-id', message: 'invalid userId!' } ]);
    }

    const { doc } = await UserService.getDetailById(data);

    if (doc) {
      return res.getRequest(doc);
    }

    return res.notFound();
  } catch (error) {
    return res.serverError(error);
  }
};

const me = async (req, res) => {
  try {
    const { auth: { userId } } = req;

    const { doc } = await UserService.getDetailById({ userId });

    if (doc) {
      return res.getRequest(doc);
    }

    return res.notFound();
  } catch (error) {
    return res.serverError(error);
  }
};

module.exports = {
  create,
  getList,
  getDetailById,
  me,
  resetPassword,
};
