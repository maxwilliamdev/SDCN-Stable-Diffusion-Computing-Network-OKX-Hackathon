const logger = require('../logger')
const config = require('../config')
const axios = require('axios');


const txt2img = async (ctx, next) => {
    const body = ctx.request.body;
    const txhash = body.txhash;
    if ( !txhash) {
        ctx.status = 400;
        ctx.body = {code: 0, message: 'Transaction Hash is needed.'}
    } else {
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