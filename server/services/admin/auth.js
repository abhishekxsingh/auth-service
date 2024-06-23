const { v1: uuidV1 } = require('uuid');

const {
  user: UserModel, role: RoleModel, login_history: loginHistoryModel, mongoose,
} = require('../../database');

const Auth = require('../auth');
const Helper = require('../../utils/helper');

const {
  LOGIN_TYPE, USER_TYPE, AUDIENCE_TYPE, USER_STATUS,
} = require('../../utils/constant');

const logout = async (payload) => {
  const { authorization } = payload;

  const token = authorization.replace('Bearer ', '');

  await Auth.destroy(token);

  return { doc: { message: 'successfully logout.' } };
};

const me = async (payload) => {
  const { publicId } = payload;

  const where = { public_id: publicId };

  const response = await UserModel.findOne(where, {
    _id: 0, google_id: 0, google: 0, password: 0, hashed_password: 0, salt: 0,
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

const login = async (payload) => {
  const { userName, password } = payload;
  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    const response = await UserModel.findOne({
      $or: [ { user_name: userName, user_type: USER_TYPE.PLATFORM },
        { email: userName, user_type: USER_TYPE.PLATFORM } ],
    }, { _id: 0 });

    if (response) {
      const { _doc } = response;
      const doc = Helper.convertSnakeToCamel(_doc);

      const {
        status, hashedPassword, salt, systemGeneratedPassword, roleId, publicId: userId, ...newDoc
      } = doc;

      if (status === USER_STATUS.ACTIVE) {
        const isValidPassword = Auth.verifyPassword(hashedPassword, password, salt);

        if (isValidPassword) {
          if (systemGeneratedPassword) {
            await session.abortTransaction();
            session.endSession();

            return { doc: { isSystemGeneratedPassword: true } };
          }

          await UserModel.updateOne({ public_id: userId }, { last_login_at: new Date() }).session(session);

          const { slug: role } = await RoleModel.findOne({ public_id: roleId });

          await loginHistoryModel.create([ {
            public_id: uuidV1(),
            user_id: userId,
            login_type: LOGIN_TYPE.USER_NAME_PASSWORD,
          } ], { session });

          const { token, refreshToken, expiresIn } = await Auth.signToken(AUDIENCE_TYPE.PLATFORM, {
            ...newDoc, userId, loginType: LOGIN_TYPE.USER_NAME_PASSWORD, role,
          });

          await session.commitTransaction();
          session.endSession();

          return {
            doc: { token, expiresIn, refreshToken },
          };
        }
        await session.abortTransaction();
        session.endSession();

        return { errors: [ { name: 'password', message: 'invalid password.' } ] };
      }
      await session.abortTransaction();
      session.endSession();

      return { errors: [ { name: 'userName', message: 'user is not active' } ] };
    }
    await session.abortTransaction();
    session.endSession();

    return { errors: [ { name: 'userName', message: 'user is not registered' } ] };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    throw error;
  }
};

module.exports = {
  logout,
  me,
  login,
};
