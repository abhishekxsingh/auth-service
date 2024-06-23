const express = require('express');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const correlationId = require('correlationid-middleware');
const Authentication = require('smart-auth-middleware');
const SmartHttp = require('smart-http');
const process = require('node:process');

const { mongoose } = require('./database');
const redisClient = require('./utils/redis');
const defaultRoutes = require('./routes');
const customerRoutes = require('./routes/customer');
const adminRoutes = require('./routes/admin');
const { PORT, IDENTITY_SERVICE_URL } = require('./config');
const {
  CUSTOMER_IGNORE_PATH, AUDIENCE_TYPE, ISSUER, ADMIN_IGNORE_PATH,
} = require('./utils/constant');

const app = express();

const server = app.listen(PORT);

try {
  // Connection with Radish
  redisClient.on('error', (err) => {
    // eslint-disable-next-line no-console
    console.log('Redis Client Error', err);
    server.close();
    // eslint-disable-next-line no-process-exit
    process.exit(-1);
  });

  (async () => { await redisClient.connect(); })();

  redisClient.on('ready', () => {
    // eslint-disable-next-line no-console
    console.log('Successful connection to Redis!');
  });

  // Connection with Database
  mongoose.connection.on('error', (err) => {
    // eslint-disable-next-line no-console
    console.error('Error connecting to the database:', err);
    server.close();
    // eslint-disable-next-line no-process-exit
    process.exit(-1);
  });

  mongoose.connection.on('open', () => {
    // eslint-disable-next-line no-console
    console.log('Successful connection to Database!');
  });

  app.set('trust proxy', 1);
  app.use(correlationId, SmartHttp());
  app.use(cors({
    exposedHeaders: [ 'token', 'slug', 'message', 'set-password', 'password', 'is-password-already-set', 'public-id', 'distinct-id',
      'x-coreplatform-paging-limit', 'x-coreplatform-total-records', 'x-coreplatform-concurrencystamp', 'refresh-token', 'expires-in',
      'location' ],
  }));
  app.use(compression());
  app.use(helmet());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use('/v1/admin', Authentication({
    IDENTITY_SERVICE_URL,
    AUDIENCE: AUDIENCE_TYPE.PLATFORM,
    ignorePaths: ADMIN_IGNORE_PATH,
    ISSUER,
    JWKSURL: `${IDENTITY_SERVICE_URL}/v1/.well-known/jwks`,
  }), adminRoutes);

  app.use('/v1/customer', Authentication({
    IDENTITY_SERVICE_URL,
    AUDIENCE: AUDIENCE_TYPE.CUSTOMER,
    ignorePaths: CUSTOMER_IGNORE_PATH,
    ISSUER,
    JWKSURL: `${IDENTITY_SERVICE_URL}/v1/.well-known/jwks`,
  }), customerRoutes);

  app.use('/v1', defaultRoutes);

  // Event 'uncaughtException'
  process.on('uncaughtException', (error, source) => {
    // eslint-disable-next-line no-console
    console.log(Date.now, process.stderr.fd, error, source);
  });
} catch (e) {
  server.close();
}

module.exports = server;
