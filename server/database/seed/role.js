const { v1: uuidV1 } = require('uuid');
const mongoose = require('mongoose');
const { role: RoleModel } = require('../index');

const {
  DATABASE: {
    name,
    username,
    password,
    host,
    options,
  },
} = require('../../config');
const { ROLE_TYPE } = require('../../utils/constant');

const url = `mongodb+srv://${username}:${password}@${host}/${name}`;

mongoose.connect(url, options);

mongoose.connection.on('open', () => {
  // eslint-disable-next-line no-console
  console.log('Successful connection to Database');
});

let roles = [ {
  role: ROLE_TYPE.SYSTEM_OWNER,
  slug: ROLE_TYPE.SYSTEM_OWNER,
  description: 'One one can be the system owner',
  created_at: new Date(),
  updated_at: new Date(),
},
{
  role: 'system-admin',
  slug: 'system-admin',
  description: 'One one can be the system admin',
  created_at: new Date(),
  updated_at: new Date(),
}, {
  role: 'admin',
  slug: 'admin',
  description: 'Who have the right to add the user.',
  created_at: new Date(),
  updated_at: new Date(),
}, {
  role: 'user',
  slug: 'user',
  description: 'Default permission, like he update his data only.',
  created_at: new Date(),
  updated_at: new Date(),
} ];

roles = roles.map((element) => ({
  ...element, public_id: uuidV1(),
}));

// Seed data function
const seedData = async () => {
  try {
    await RoleModel.create(roles);

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
