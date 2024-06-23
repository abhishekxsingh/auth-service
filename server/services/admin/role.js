const { v1: uuidV1 } = require('uuid');
const { role: RoleModel } = require('../../database');
const Helper = require('../../utils/helper');

const { ROLE_TYPE } = require('../../utils/constant');

const getAll = async () => {
  const where = {
    role: { $nin: [ ROLE_TYPE.SYSTEM_OWNER, ROLE_TYPE.SYSTEM_ADMIN ] },
  };

  const response = await RoleModel.find(where, { _id: 0 });

  if (response) {
    const doc = response.map(({ _doc }) => Helper.convertSnakeToCamel(_doc));

    return { count: doc.length, doc };
  }

  return { count: 0, doc: [] };
};

const save = async (payload) => {
  const { role } = payload;
  const isDuplicateRole = await RoleModel.findOne({ role: Helper.convertToSlug(role) });

  if (isDuplicateRole) {
    return { errors: [ { name: 'role', message: 'duplicate role.' } ] };
  }

  const doc = Helper.convertCamelToSnake({ ...payload, slug: Helper.convertToSlug(role), public_id: uuidV1() });

  await RoleModel.create(doc);

  return { doc: { message: 'successfully saved.' } };
};

module.exports = { getAll, save };
