import type { InitTable } from '@/db/types/index.js'
import admin from './admin.js'
import userSession from './userSession.js'
import group from './group.js'
import link from './link.js'

const initTable: InitTable = async (ctx) => {
	await ctx.query.notLog(admin)
	await ctx.query.notLog(userSession)
	await ctx.query.notLog(group)
	await ctx.query.notLog(link)
}
export default initTable
