const { v1: uuidV1 } = require('uuid');

const {
  user: UserModel, role: RoleModel, mongoose,
} = require('../../database');

const Auth = require('../auth');
const Helper = require('../../utils/helper');

const { USER_TYPE, USER_STATUS, ROLE_TYPE } = require('../../utils/constant');

const create = async (payload) => {
  const {
    email, mobileNumber, roleId, createdBy,
  } = payload;

  const response = await UserModel.findOne({ email, user_type: USER_TYPE.PLATFORM });

  if (response) {
    return { errors: [ { name: 'user', message: 'Duplicate email, try some thing else!.' } ] };
  }

  const res = await UserModel.findOne({ mobile_number: mobileNumber, user_type: USER_TYPE.PLATFORM });

  if (res) {
    return { errors: [ { name: 'mobileNumber', message: 'Duplicate mobileNumber, try some thing else!.' } ] };
  }

  const roleRes = await RoleModel.findOne({ public_id: roleId });

  if (!roleRes) {
    return { errors: [ { name: 'role', message: 'No role found!.' } ] };
  }

  if (roleRes) {
    const { slug } = roleRes;

    if (slug === ROLE_TYPE.CUSTOMER) {
      return { errors: [ { name: 'role', message: 'Role can not be customer type!.' } ] };
    }
  }

  const publicId = uuidV1();
  const salt = Auth.makeSalt();
  const password = Helper.generateRandomPassword();

  const hashedPassword = Auth.encryptPassword(password, salt);

  const doc = Helper.convertCamelToSnake({
    ...payload,
    publicId,
    distinctId: uuidV1(),
    concurrency_stamp: uuidV1(),
    salt,
    hashed_password: hashedPassword,
    system_generated_password: true,
    user_type: USER_TYPE.PLATFORM,
    createdBy,
    updatedBy: createdBy,
    status: USER_STATUS.ACTIVE,
  });

  await UserModel.create(doc);

  return { doc: { password, publicId } };
};

const getList = async (payload) => {
  const {
    limit, offset, status,
  } = payload;

  let where = { user_type: USER_TYPE.PLATFORM };

  if (status) {
    where = { ...where, status };
  }

  const response = await UserModel.find(where, {
    _id: 0, google_id: 0, google: 0, system_generated_password: 0, password: 0, hashed_password: 0, salt: 0,
  })
    .sort({ updatedAt: -1 }).skip(offset)
    .limit(limit);

  if (response) {
    const doc = await Promise.all(response.map(async ({ _doc }) => {
      const { role_id: roleId, ...data } = _doc;
      const { _doc: roleResponse } = await RoleModel.findOne({ public_id: roleId }, { role: 1, _id: 0, slug: 1 });

      return Helper.convertSnakeToCamel({ ...data, role: roleResponse });
    }));

    return { doc, count: doc.length };
  }

  return { count: 0, doc: [] };
};

const getDetailById = async (payload) => {
  const { publicId } = payload;

  const where = { public_id: publicId, user_type: USER_TYPE.PLATFORM };

  const response = await UserModel.findOne(where, {
    _id: 0, google_id: 0, google: 0, system_generated_password: 0, password: 0, hashed_password: 0, salt: 0,
  }).populate({
    path: 'role_id',
    select: '-_id role slug',
  });

  if (response) {
    const { _doc: { role_id: roleId, ...data } } = response;
    const { _doc: roleResponse } = await RoleModel.findOne({ public_id: roleId }, { role: 1, _id: 0, slug: 1 });

    return { doc: Helper.convertSnakeToCamel({ ...data, role: roleResponse }) };
  }

  return { };
};

const me = async (payload) => {
  const { userId } = payload;

  const where = { public_id: userId };

  const response = await UserModel.findOne(where, {
    _id: 0, google_id: 0, google: 0, system_generated_password: 0, password: 0, hashed_password: 0, salt: 0,
  }).populate({
    path: 'role_id',
    select: '-_id role slug',
  });

  if (response) {
    const { _doc: { role_id: roleId, ...data } } = response;
    const { _doc: roleResponse } = await RoleModel.findOne({ public_id: roleId }, { role: 1, _id: 0, slug: 1 });

    return { doc: Helper.convertSnakeToCamel({ ...data, role: roleResponse }) };
  }

  return { };
};

const resetPassword = async (payload) => {
  const { userId, updatedBy } = payload;

  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    const response = await UserModel.findOne({ public_id: userId, user_type: USER_TYPE.PLATFORM });

    if (response) {
      const { dataValues: { status } } = response;

      if (status === USER_STATUS.ACTIVE) {
        const salt = Auth.makeSalt();
        const password = Helper.generateRandomPassword();

        const hashedPassword = Auth.encryptPassword(password, salt);

        await UserModel.updateOne({ public_id: userId }, {
          salt,
          hashed_password: hashedPassword,
          system_generated_password: true,
          updated_by: updatedBy,
        }).session(session);

        await session.commitTransaction();
        session.endSession();

        return { doc: { password } };
      }
      await session.abortTransaction();
      session.endSession();

      return { errors: [ { name: 'user', message: 'User is not active' } ] };
    }
    await session.abortTransaction();
    session.endSession();

    return { errors: [ { name: 'user', message: 'User not found!' } ] };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    throw error;
  }
};

module.exports = {
  create,
  getList,
  getDetailById,
  me,
  resetPassword,
};
