const Router = require('koa-router')
const FaucetController = require('./controllers/faucet')

module.exports = function () {
	let router = new Router()
	router.get('/faucet', FaucetController.faucet)
	return router
}
