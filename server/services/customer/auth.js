/* eslint-disable no-useless-catch */
/* eslint-disable max-lines */
const { v1: uuidV1 } = require('uuid');

const {
  user: UserModel, user_device: UserDeviceModel, device: DeviceModel, role: RoleModel, mongoose,
} = require('../../database');

const Auth = require('../auth');
const Helper = require('../../utils/helper');
const Firbase = require('../../utils/firebase');

const {
  LOGIN_TYPE, USER_STATUS, ROLE_TYPE, USER_TYPE, AUDIENCE_TYPE, PLATFORM,
} = require('../../utils/constant');

const googleLogin = async (payload) => {
  const { token: firebaseToken, deviceId } = payload;
  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    const decodedToken = await Firbase.auth().verifyIdToken(firebaseToken);

    const {
      name, picture, email, sub: googleId,
    } = decodedToken;

    const response = await UserModel.findOne({ google_id: googleId, user_type: USER_TYPE.CUSTOMER }).session(session);

    let userId = response ? response.public_id : uuidV1();
    const mobileNumber = response ? response.mobile_number : undefined;
    const distinctId = response ? response.distinct_id : uuidV1();

    if (response) {
      const { public_id: publicId } = response;

      userId = publicId;
      await UserModel.updateOne({ public_id: publicId }, {
        last_login_at: new Date(),
        user_type: USER_TYPE.CUSTOMER,
      }).session(session);
    } else {
      const role = await RoleModel.findOne({ slug: ROLE_TYPE.CUSTOMER }).session(session);

      if (!role) {
        await session.abortTransaction();
        session.endSession();

        return { errors: [ { name: 'user', message: 'No role found!.' } ] };
      }

      await UserModel.create([ {
        name,
        profile_pic_url: picture,
        last_login_at: new Date(),
        created_by: userId,
        updated_by: userId,
        user_type: USER_TYPE.CUSTOMER,
        public_id: userId,
        role_id: role.public_id,
        distinct_id: distinctId,
        concurrency_stamp: uuidV1(),
        google_id: googleId,
        google: decodedToken,
        email,
        is_email_verified: true,
        status: USER_STATUS.ACTIVE,
      } ], { session });
    }

    let platform = PLATFORM.WEB;

    if (deviceId) {
      const isDeviceExist = await DeviceModel.findOne({ public_id: deviceId });

      if (!isDeviceExist) {
        await session.abortTransaction();
        session.endSession();

        return { errors: [ { name: 'deviceId', message: 'Invalid deviceId!' } ] };
      }

      const { _doc: { _id: deviceIdPk, platform: platformD } } = isDeviceExist;

      platform = platformD;
      const resUD = await UserDeviceModel.findOne({ user_id: userId }).session(session);

      if (resUD) {
        await UserDeviceModel.updateOne({ user_id: userId }, { device_id: deviceIdPk }).session(session);
      }

      if (!resUD) {
        await UserDeviceModel.create([ { public_id: uuidV1(), user_id: userId, device_id: deviceIdPk } ], { session });
      }
    }

    const { token, refreshToken, expiresIn } = await Auth.signToken(AUDIENCE_TYPE.CUSTOMER, {
      userId,
      email,
      distinctId,
      userType: USER_TYPE.CUSTOMER,
      loginType: LOGIN_TYPE.GOOGLE,
      role: ROLE_TYPE.CUSTOMER,
      deviceId,
      mobileNumber,
      name,
      platform,
    });

    await session.commitTransaction();
    session.endSession();

    return {
      doc: {
        token, distinctId, expiresIn, refreshToken,
      },
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const appleLogin = async (payload) => {
  const { token: firebaseToken, deviceId } = payload;
  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    const decodedToken = await Firbase.auth().verifyIdToken(firebaseToken);

    const {
      name, picture, email, sub: appleId,
    } = decodedToken;

    const response = await UserModel.findOne({ apple_id: appleId, user_type: USER_TYPE.CUSTOMER }).session(session);

    let userId = response ? response.public_id : uuidV1();
    const mobileNumber = response ? response.mobile_number : undefined;
    const distinctId = response ? response.distinct_id : uuidV1();

    if (response) {
      const { public_id: publicId } = response;

      userId = publicId;
      await UserModel.updateOne({ public_id: publicId }, {
        last_login_at: new Date(),
        user_type: USER_TYPE.CUSTOMER,
      }).session(session);
    } else {
      const role = await RoleModel.findOne({ slug: ROLE_TYPE.CUSTOMER }).session(session);

      if (!role) {
        await session.abortTransaction();
        session.endSession();

        return { errors: [ { name: 'user', message: 'No role found!.' } ] };
      }

      await UserModel.create([ {
        name,
        profile_pic_url: picture,
        last_login_at: new Date(),
        created_by: userId,
        updated_by: userId,
        user_type: USER_TYPE.CUSTOMER,
        public_id: userId,
        role_id: role.public_id,
        distinct_id: distinctId,
        concurrency_stamp: uuidV1(),
        apple_id: appleId,
        apple: decodedToken,
        email,
        is_email_verified: true,
        status: USER_STATUS.ACTIVE,
      } ], { session });
    }

    let platform = PLATFORM.WEB;

    if (deviceId) {
      const isDeviceExist = await DeviceModel.findOne({ public_id: deviceId });

      if (!isDeviceExist) {
        await session.abortTransaction();
        session.endSession();

        return { errors: [ { name: 'deviceId', message: 'Invalid deviceId!' } ] };
      }

      const { _doc: { _id: deviceIdPk, platform: platformD } } = isDeviceExist;

      platform = platformD;
      const resUD = await UserDeviceModel.findOne({ user_id: userId }).session(session);

      if (resUD) {
        await UserDeviceModel.updateOne({ user_id: userId }, { device_id: deviceIdPk }).session(session);
      }

      if (!resUD) {
        await UserDeviceModel.create([ { public_id: uuidV1(), user_id: userId, device_id: deviceIdPk } ], { session });
      }
    }

    const { token, refreshToken, expiresIn } = await Auth.signToken(AUDIENCE_TYPE.CUSTOMER, {
      userId,
      email,
      distinctId,
      userType: USER_TYPE.CUSTOMER,
      loginType: LOGIN_TYPE.APPLE,
      role: ROLE_TYPE.CUSTOMER,
      deviceId,
      mobileNumber,
      name,
      platform,
    });

    await session.commitTransaction();
    session.endSession();

    return {
      doc: {
        token, distinctId, expiresIn, refreshToken,
      },
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const logout = async (payload) => {
  const { authorization } = payload;

  const token = authorization.replace('Bearer ', '');

  await Auth.destroy(token);

  return { doc: { message: 'successfully logout.' } };
};

const me = async (payload) => {
  const { publicId } = payload;

  const response = await UserModel.findOne({ public_id: publicId });

  if (response) {
    const { _doc } = response;

    const doc = Helper.convertSnakeToCamel(_doc);

    return { doc };
  }

  return {};
};

module.exports = {
  googleLogin,
  appleLogin,
  logout,
  me,
};
