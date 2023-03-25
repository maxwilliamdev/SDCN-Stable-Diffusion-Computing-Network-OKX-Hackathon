const dotenv = require('dotenv')
// Load environment variables from .env file
dotenv.config()

const env = process.env.NODE_ENV || 'development'
const configs = {
  base: {
    env,
    name: process.env.APP_NAME || 'sdcn-api-server',
    host: process.env.APP_HOST || '0.0.0.0',
    port: process.env.APP_PORT || 8080,
    redisHost: process.env.REDIS_HOST || '127.0.0.1',
    redisPort: process.env.REDIS_PORT || 6379,
    sendAddress: process.env.SEND_ADDRESS,
    privateKey: process.env.PRIVATE_KEY,
    web3_provider_host: 'https://exchaintestrpc.okex.org/',
  },
  logging: {
    enable: process.env.LOG_ENABLED || true,
    level: process.env.LOG_LEVEL || 'debug',
    prettyPrint: env !== 'production',
    // Supply paths to keys to redact sensitive information
    redact: []
  },

  
  test: {}
}

const config = Object.assign(configs.base, { logging: configs.logging }, configs[env])

module.exports = config
