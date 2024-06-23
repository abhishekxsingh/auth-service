const {
  user: UserModel, role: RoleModel,
} = require('../../database');
const { USER_TYPE } = require('../../utils/constant');
const Helper = require('../../utils/helper');

const getList = async (payload) => {
  const {
    limit, offset, status,
  } = payload;

  let where = { user_type: USER_TYPE.CUSTOMER };

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

  const where = { public_id: publicId, user_type: USER_TYPE.CUSTOMER };

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

module.exports = {
  getList,
  getDetailById,
};

