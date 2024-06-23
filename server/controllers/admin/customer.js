const CustomerService = require('../../services/admin/customer');
const { getList: getListSchema } = require('../../dto-schemas/admin/customer');

const Validator = require('../../utils/validator');

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

    const { errors: getListErrors, count, doc } = await CustomerService.getList({ ...data, limit, offset });

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

    const { doc } = await CustomerService.getDetailById(data);

    if (doc) {
      return res.getRequest(doc);
    }

    return res.notFound();
  } catch (error) {
    return res.serverError(error);
  }
};

module.exports = {
  getList,
  getDetailById,
};
