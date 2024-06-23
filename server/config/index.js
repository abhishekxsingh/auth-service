const { version, name } = require('../package.json');

module.exports = {
  VERSION: process.env.VERSION || version,
  NAME: process.env.NAME || name,
  DOMAIN: process.env.DOMAIN || 'http://localhost:3000',
  HOST: process.env.HOST || '0.0.0.0',
  PORT: process.env.PORT || 3000,
  DATABASE: {
    name: process.env.DB_NAME,
    username: process.env.DB_USER_NAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    options: {
      maxPoolSize: 5,
      minPoolSize: 0,
      maxIdleTimeMS: 10000,
      waitQueueTimeoutMS: 30 * 1000,
      retryWrites: true,
      w: 'majority',
    },
  },
  IDENTITY_SERVICE_URL: process.env.IDENTITY_SERVICE_URL || 'http://localhost:3000',
  REDIS_SERVER: process.env.REDIS_SERVER || 'localhost',
  DEVICE_REGISTRATION_SECRET: process.env.DEVICE_REGISTRATION_SECRET || 'api-service-secret',
  SYTEM_OWNER_USER_NAME: process.env.SYTEM_OWNER_USER_NAME || 'system-owner',
  SYTEM_OWNER_PASSWORD: process.env.SYTEM_OWNER_PASSWORD || 'devcartel#1234',

};
