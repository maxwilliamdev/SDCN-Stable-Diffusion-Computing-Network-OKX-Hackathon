const pino = require('pino')
const serializers = require('@kasa/koa-logging/lib/serializers')
const config = require('./config')

const serializeReponseBody = ({ status, code, message } = {}) => {
	const body = { status, message }
	if (code) {
		body.code = code
	}
	return body
}

const serializeReponse = (ctx = {}) => {
	return {
		statusCode: ctx.status,
		duration: ctx.duration,
		type: ctx.type,
		headers: (ctx.response || {}).headers,
		body: serializeReponseBody(ctx.body || {})
	}
}

const options = {
	...config.logging,
	serializers: {
		...serializers,
		res: serializeReponse
	}
}

const logger = pino(options)

module.exports = logger
