const { createClient: RedisClient } = require('redis');
const { REDIS_SERVER } = require('../config');

const client = RedisClient({ url: `redis://${REDIS_SERVER}` });

module.exports = client;
