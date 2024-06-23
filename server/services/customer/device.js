/* eslint-disable no-useless-catch */
const { v1: uuidV1 } = require('uuid');
const { device: DeviceModel } = require('../../database');
const Helper = require('../../utils/helper');

const { DEVICE_STATUS } = require('../../utils/constant');

const save = async (payload) => {
  const {
    deviceId, utmSource, mccMnc, operator, versionCode, platform, registrationToken, ...doc
  } = payload;

  try {
    const response = await DeviceModel.findOne({ device_id: deviceId });

    if (response) {
      const { _doc: { public_id: publicId } } = response;

      const data = Helper.convertCamelObjectToSnake({
        ...doc, utmSource, mccMnc, operator, versionCode, status: DEVICE_STATUS.ACTIVE, registrationToken,
      });

      await DeviceModel.updateOne({ public_id: publicId }, data);

      return { doc: { publicId } };
    }

    const data = Helper.convertCamelObjectToSnake(payload);
    const publicId = uuidV1();

    await DeviceModel.create({ ...data, public_id: publicId });

    return { doc: { publicId } };
  } catch (err) {
    throw err;
  }
};

module.exports = { save };
