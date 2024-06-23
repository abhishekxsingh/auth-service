const { v1: uuidV1, v4: uuidV4 } = require('uuid');
const crypto = require('crypto');

const { generateKeyPairSync } = crypto;
const mongoose = require('mongoose');
const Auth = require('../../services/auth');

const { client: ClientModel } = require('../index');

const {
  DATABASE: {
    name,
    username,
    password: dbPassword,
    host,
    options,
  },
} = require('../../config');
const { ISSUER, AUDIENCE_TYPE } = require('../../utils/constant');

const url = `mongodb+srv://${username}:${dbPassword}@${host}/${name}`;

mongoose.connect(url, options);

mongoose.connection.on('open', () => {
  // eslint-disable-next-line no-console
  console.log('Successful connection to Database');
});

const { publicKey, privateKey } = generateKeyPairSync('rsa', {
  modulusLength: 1024,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
  },
});
// generate private-key & public-key
// http://travistidwell.com/jsencrypt/demo/
// https://www.csfieldguide.org.nz/en/interactives/rsa-key-generator
// https://www.sslshopper.com/certificate-decoder.html

const password = crypto.randomBytes(48).toString('hex');
const salt = Auth.makeSalt();
const hashedPassword = Auth.encryptPassword(password, salt);
const userId = uuidV1();

const client = [ {
  key_id: uuidV4(),
  public_id: uuidV1(),
  private_key: Buffer.from(privateKey, 'utf8'),
  public_key: Buffer.from(publicKey, 'utf8'),
  issuer: ISSUER,
  subject: 'developer@devcartel.com',
  audience: AUDIENCE_TYPE.CUSTOMER,
  expires_in: '24h',
  refresh_expires_in: '8640h',
  algorithm: 'RS256',
  created_by: userId,
  updated_by: userId,
  user_id: userId,
  secret: hashedPassword,
  salt,
  created_at: new Date(),
  updated_at: new Date(),
} ];

// Seed data function
const seedData = async () => {
  try {
    await ClientModel.create(client);
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
