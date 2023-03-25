const Boom = require('@hapi/boom')

const boomifyError = ({ message, statusCode, error }) => {
	return Boom.boomify(error, {
		message,
		statusCode: statusCode || 400
	})
}

module.exports = boomifyError
