const Router = require('koa-router')
const FaucetController = require('./controllers/faucet')
const Txt2imgController = require('./controllers/txt2img')


module.exports = function () {
	let router = new Router()
	router.post('/faucet', FaucetController.faucet);
	router.post('/txt2img',Txt2imgController.txt2img);
	return router
}