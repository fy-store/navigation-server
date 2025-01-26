import type { Next, Context } from 'koa'
import { Session, everydayTask } from 'uxiu'
import { userSession } from '#db'
import { project } from '#conf'

const map = new Map()
const [sessionList] = await userSession.getList()
sessionList.forEach((it) => {
	map.set(it.sessionId, it.sessionValue)
})

const sessionStore = Session.createSessionStore({
	store: {
		async add(id, value) {
			await userSession.create({ sessionId: id, sessionValue: value })
			map.set(id, value)
			return map.get(id)
		},

		async get(id) {
			return map.get(id)
		},
		
		async set(id, value) {
			await userSession.updateBySessionId({ sessionId: id, sessionValue: value })
			map.set(id, value)
			return map.get(id)
		},

		async del(id) {
			await userSession.deleteBySessionId(id)
			const data = map.get(id)
			map.delete(id)
			return data
		},
		async each(fn) {
			map.forEach((value, id) => {
				fn(id, value)
			})
		},
		async length() {
			return map.size
		}
	}
})

everydayTask(
	async () => {
		const now = Date.now()
		sessionStore.each(async (id, value: any) => {
			if (now - value.latelyOperationTimer > project.loginVerify.expireInterval) {
				await sessionStore.del(id)
			}
		})
	},
	{
		hour: 2,
		exceedImmediatelyExecute: true
	}
)

declare module 'koa' {
	interface Context {
		/** 用户会话仓库 */
		userSessionStore: typeof sessionStore
	}
}

declare module 'koa-router' {
	interface IRouterParamContext {
		/** 用户会话仓库 */
		userSessionStore: typeof sessionStore
	}
}

export default () => {
	return async (ctx: Context, next: Next) => {
		ctx.userSessionStore = sessionStore
		await next()
	}
}
