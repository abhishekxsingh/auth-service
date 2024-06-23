const DeviceService = require('../../services/customer/device');
const { save: saveSchema } = require('../../dto-schemas/customer/device');

const { DEVICE_REGISTRATION_SECRET } = require('../../config');
const Validator = require('../../utils/validator');

const save = async (req, res) => {
  try {
    const { body, headers: { 'x-device-secret': secret } } = req;

    if (secret !== DEVICE_REGISTRATION_SECRET) {
      return res.forbidden();
    }

    const { errors, data } = Validator.isSchemaValid({ data: { ...body }, schema: saveSchema });

    if (errors) {
      return res.badRequest('field-validation', errors);
    }

    const { error: err, doc } = await DeviceService.save(data);

    if (doc) {
      const { publicId } = doc;

      res.setHeader('message', 'Registration successfully done.');
      res.setHeader('public-id', publicId);
      res.setHeader('location', `${req.protocol}://${req.hostname}/v1/customer/device/${publicId}`);

      return res.postRequest();
    }

    return res.badRequest('field-validation', err);
  } catch (error) {
    return res.serverError(error);
  }
};

module.exports = {
  save,
};
