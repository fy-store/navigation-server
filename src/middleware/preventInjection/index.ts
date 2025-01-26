import type { Context, Next } from 'koa'
import type { ParsedUrlQuery } from 'querystring'
import xss from 'xss'

declare module 'koa' {
	interface Context {
		/** 未消除 xss 风险的请求体(未转义), 多个相同参数将合并成数组 */
		query: ParsedUrlQuery
		/** 消除 xss 风险的请求体(已转义), 多个相同参数将合并成数组 */
		xssQuery: ParsedUrlQuery
		/** 未消除 xss 风险的请求体(未转义) */
		params?: Record<string, string>
		/** 消除 xss 风险后的请求体(已转义) */
		xssParams: Record<string, string>
	}

	interface Request {
		/** 未消除 xss 风险的请求体(未转义) */
		body?: any
		/** 消除 xss 风险后的请求体(已转义) */
		xssBody: any
	}
}

declare module 'koa-router' {
	interface IRouterParamContext {
		/** 未消除 xss 风险的请求体(未转义) */
		body: any
		/** 消除 xss 风险后的请求体(已转义) */
		xssBody: any
		/** 未消除 xss 风险的请求体(未转义), 多个相同参数将合并成数组 */
		query: ParsedUrlQuery
		/** 消除 xss 风险的请求体(已转义), 多个相同参数将合并成数组 */
		xssQuery: ParsedUrlQuery
		/** 未消除 xss 风险的请求体(未转义) */
		params: Record<string, string>
		/** 消除 xss 风险后的请求体(已转义) */
		xssParams: Record<string, string>
	}
}

export default () => {
	return async (ctx: Context, next: Next) => {
		let xssBody = null
		Object.defineProperty(ctx.request, 'xssBody', {
			get() {
				if (!xssBody) {
					const json = JSON.stringify(ctx.request.body || {})
					xssBody = JSON.parse(xss(json))
					return xssBody
				}
				return xssBody
			}
		})

		let xssQuery = null,
			xssParams = null

		Object.defineProperties(ctx, {
			xssQuery: {
				get() {
					if (!xssQuery) {
						const json = JSON.stringify(ctx.query || {})
						xssQuery = JSON.parse(xss(json))
						return xssQuery
					}
					return xssQuery
				}
			},

			xssParams: {
				get() {
					if (!xssParams) {
						const json = JSON.stringify(ctx.params || {})
						xssParams = JSON.parse(xss(json))
						return xssParams
					}
					return xssParams
				}
			}
		})

		await next()
	}
}
