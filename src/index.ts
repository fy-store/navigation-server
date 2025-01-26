import { createApp } from 'uxiu'
import { bodyParser } from '@koa/bodyparser'
import { logger } from '#common'
import { preventInjection, userSession, verifyPower, reqLog } from '#middleware'

createApp({
	port: 3323,
	async mounted(ctx) {
		ctx.app.on('error', routerError)
		ctx.app.use(bodyParser())
		ctx.app.use(userSession())
		ctx.app.use(verifyPower())
		ctx.app.use(preventInjection())
		ctx.app.use(reqLog())
		const router = await import('./router/index.js')
		ctx.app.use(router.default.routes())
	}
})

const routerError = (err: Error) => {
	const text = `\n    错误类型: ${err.name}\n    错误信息: ${err.message}\n    错误堆栈: ${err.stack}`
	logger.send.error('路由错误', err, '\n')
	logger.reqError.error(text)
}
