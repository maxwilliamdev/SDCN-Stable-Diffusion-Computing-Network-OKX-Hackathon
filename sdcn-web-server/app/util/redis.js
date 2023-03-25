
const Redis = require('ioredis');
const config = require('../config')

const redis = new Redis({
    host: config.redisHost,
    port: config.redisPort,
});
module.exports = redis