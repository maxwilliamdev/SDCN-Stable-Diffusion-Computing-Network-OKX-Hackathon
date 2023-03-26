const logging = require('@kasa/koa-logging')
const Koa = require('koa')
const cors = require('koa2-cors');
const bodyParser = require('koa-body')
const serve = require('koa-static')
const config = require('./config')
const logger = require('./logger')
const router = require('./routes')()

const app = new Koa()

const port = config.port
const host = config.host

// register logger
app.use(logging({ logger, overrideSerializers: false }))
app.use(cors());

app.use(bodyParser())
app.use(router.routes())
app.use(router.allowedMethods())

app.listen(port, host, () => {
	logger.info(`API server listening on ${config.host}:${config.port}, in ${config.env} mode`)
})
