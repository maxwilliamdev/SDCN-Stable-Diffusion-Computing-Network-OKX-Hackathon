const logger = require('../logger')
const config = require('../config')
const axios = require('axios');
const chain = require('../chain')
const redis = require('../util/redis')

const txt2img = async (ctx, next) => {
    const body = ctx.request.body;
    ctx.set('Access-Control-Allow-Origin', ctx.get('Origin'));
    ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    ctx.set('Content-Type', 'application/json');
    ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length');
    const txhash = body.txhash;
    if ( !txhash) {
        ctx.status = 400;
        ctx.body = {code: 0, message: 'Transaction Hash is needed.'}
    } else {
        const redisKey = 'txhashSet';
        const result = await redis.sismember(redisKey, txhash)
        if(result === 1){
            ctx.status = 400
            ctx.body = {code: 0, message: 'The txhash is already used.'};
            return;
        }
        
        const isValid = await chain.isValidTransaction(txhash);
        if (!isValid){
            ctx.status = 400
            ctx.body = {code: 0, message: 'Invalid txhash'};
            return;
        }
        await redis.sadd(redisKey, txhash);
        const apiUrl = config.apiUrl;
        try {
            delete body.txhash;
            const response = await axios.post(apiUrl, body);
            logger.info(body);
            ctx.status = response.status;
            ctx.body = response.data;
          } catch (error) {
            ctx.status = error.response.status || 500;
            ctx.body = { error: error.response.data };
          }
    }
}

module.exports = { txt2img }