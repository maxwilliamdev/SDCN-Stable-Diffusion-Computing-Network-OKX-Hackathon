const logging = require('@kasa/koa-logging')
const Koa = require('koa')
const bodyParser = require('koa-body')
const serve = require('koa-static')
const config = require('./config')
const logger = require('./logger')
const router = require('./routes')()

const app = new Koa()

const port = config.port
const host = config.host

// register error handler
// app.use(errorHandler)

// register logger
app.use(logging({ logger, overrideSerializers: false }))

// serve static files in public directory
app.use(serve(__dirname + '/public/')) 

app.use(bodyParser())
app.use(router.routes())
app.use(router.allowedMethods())

app.listen(port, host, () => {
	logger.info(`API server listening on ${config.host}:${config.port}, in ${config.env} mode`)
})
