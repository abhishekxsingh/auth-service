const RoleService = require('../../services/admin/role');
const { save: saveSchema } = require('../../dto-schemas/admin/role');

const Validator = require('../../utils/validator');

const getAll = async (req, res) => {
  try {
    const { count, doc } = await RoleService.getAll();

    res.setHeader('x-coreplatform-paging-limit', doc.length);
    res.setHeader('x-coreplatform-total-records', count);

    return res.getRequest(doc);
  } catch (error) {
    return res.serverError(error);
  }
};

const save = async (req, res) => {
  try {
    const { body, auth: { userId: createdBy } } = req;

    const data = {
      ...body, createdBy, updatedBy: createdBy,
    };

    const { errors } = Validator.isSchemaValid({ data, schema: saveSchema });

    if (errors) {
      return res.badRequest('field-validation', errors);
    }

    const { errors: err, doc } = await RoleService.save(data);

    if (doc) {
      res.setHeader('message', 'successfully saved.');

      return res.postRequest();
    }

    return res.badRequest('field-validation', err);
  } catch (error) {
    return res.serverError(error);
  }
};

module.exports = { getAll, save };
