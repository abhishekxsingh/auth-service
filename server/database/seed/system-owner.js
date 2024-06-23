const { v1: uuidV1 } = require('uuid');

const mongoose = require('mongoose');
const Auth = require('../../services/auth');

const { user: UserModel, role: RoleModel } = require('../index');

const {
  DATABASE: {
    name,
    username,
    password: dbPassword,
    host,
    options,
  },
  SYTEM_OWNER_USER_NAME,
  SYTEM_OWNER_PASSWORD,
} = require('../../config');
const { USER_TYPE, ROLE_TYPE } = require('../../utils/constant');

const url = `mongodb+srv://${username}:${dbPassword}@${host}/${name}`;

mongoose.connect(url, options);

mongoose.connection.on('open', () => {
  // eslint-disable-next-line no-console
  console.log('Successful connection to Database');
});

const salt = Auth.makeSalt();
const hashedPassword = Auth.encryptPassword(SYTEM_OWNER_PASSWORD, salt);

const user = {
  public_id: uuidV1(),
  distinct_id: uuidV1(),
  user_name: SYTEM_OWNER_USER_NAME,
  salt,
  hashed_password: hashedPassword,
  system_generated_password: true,
  user_type: USER_TYPE.PLATFORM,
  concurrency_stamp: uuidV1(),
  created_at: new Date(),
  updated_at: new Date(),
};

// Seed data function
const seedData = async () => {
  try {
    const role = await RoleModel.findOne({ slug: ROLE_TYPE.SYSTEM_OWNER });

    await UserModel.create({ ...user, role_id: role.public_id });
    // eslint-disable-next-line no-console
    console.log('Data seeding completed.');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error seeding data:', error);
  } finally {
    // Close the MongoDB connection
    mongoose.disconnect();
  }
};

// Call the seed data function
seedData();
