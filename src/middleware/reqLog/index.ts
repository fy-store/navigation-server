import { isArray, isObject, isReferenceValue } from 'uxiu'
import { logger } from '#common'
import type { Context, Next } from 'koa'

export default () => {
	return async (ctx: Context, next: Next) => {
		await next()
		const query = ctx.query,
			params = ctx.params,
			body = ctx.request.body,
			authorization = ctx.headers['authorization'],
			userSessionId = ctx.userSessionId,
			userSession = ctx.userSession
		if (ctx.method.toLocaleUpperCase() === 'GET') {
			logger.req.info(
				JSON.stringify(
					{
						authorization,
						userSessionId,
						userSession,
						query,
						params,
						body,
						return: isObject(ctx.body) ? hideData(ctx.body) : ctx.body
					},
					null,
					2
				)
			)
		} else {
			logger.req.info(
				JSON.stringify(
					{
						authorization,
						userSessionId,
						userSession,
						query,
						params,
						body,
						return: ctx.body
					},
					null,
					2
				)
			)
		}
	}
}

const hideData = (data: object) => {
	const newData = {}
	Object.entries(data).forEach(([k, v]) => {
		if (isReferenceValue(v)) {
			newData[k] = isArray(v) ? `tip: 日志隐藏数据, data -> length = ${v.length}` : String(v)
		} else {
			newData[k] = v
		}
	})
	return newData
}
