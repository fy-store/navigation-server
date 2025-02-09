import { project } from '#conf'
import { encipher } from '#common'
import { createCheckPower } from '#utils'
import type { Methods } from '@/utils/checkPower/index.js'
import type { Next, Context } from 'koa'

type UserSession = {
	/** 用户 ID */
	id: number
	/** 最近操作时间(时间戳) */
	latelyOperationTimer: number
	[k: string]: any
}

declare module 'koa' {
	interface Context {
		/** 用户会话 */
		userSession: Readonly<UserSession>
		/** 用户会话 ID */
		userSessionId: string
	}
}

declare module 'koa-router' {
	interface IRouterParamContext {
		/** 用户会话 */
		userSession: Readonly<UserSession>
		/** 用户会话 ID */
		userSessionId: string
	}
}

export default () => {
	const checkPower = createCheckPower({
		admin: {
			base: '/api/v1',
			router: [
				{
					methods: ['GET', 'POST', 'PATCH', 'DELETE'],
					path: 'admin{/:id}'
				},
				{
					methods: ['GET', 'POST', 'PATCH', 'DELETE'],
					path: 'group{/:id}'
				},
				{
					methods: ['GET', 'POST', 'PATCH', 'DELETE'],
					path: 'link{/:id}'
				}
			],
			whiteRouter: [
				{
					methods: 'POST',
					path: 'login'
				}
			]
		}
	})

	return async (ctx: Context, next: Next) => {
		const authorization = ctx.get('authorization') ? ctx.get('authorization').split(' ')[1] : ''
		const sessionId = (() => {
			try {
				return encipher.decrypted(authorization)
			} catch (error) {
				return ''
			}
		})()

		if (ctx.path === '/api/v1/login') {
			await next()
			return
		}

		if (!authorization) {
			ctx.body = {
				code: -1,
				msg: '请先登录'
			}
			return
		}

		if (!(await ctx.userSessionStore.has(sessionId))) {
			ctx.body = {
				code: -1,
				msg: '登录过期'
			}
			return
		}

		const isAdopt = checkPower.verify('admin', ctx.method as Methods, ctx.path)
		if (!isAdopt) {
			ctx.body = {
				code: 403,
				msg: '权限不足'
			}
			return
		}

		const userSession = await ctx.userSessionStore.get<UserSession>(sessionId)
		const now = Date.now()
		if (now - userSession.latelyOperationTimer > project.loginVerify.expireInterval) {
			ctx.body = {
				code: -1,
				msg: '长时间未操作, 请重新登录'
			}
			return
		}
		
		await ctx.userSessionStore.patch(sessionId, {
			latelyOperationTimer: Date.now()
		})

		ctx.userSession = userSession
		ctx.userSessionId = sessionId
		await next()
	}
}
