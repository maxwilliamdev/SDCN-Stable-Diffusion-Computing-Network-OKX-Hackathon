const logger = require('../logger')
const config = require('../config')


const txt2img = async (ctx, next) => {
    logger.info(ctx.body)
    ctx.status = 200
    ctx.body = "This is txt2img interface"
}

module.exports = { txt2img }