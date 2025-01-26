import { group } from '#db'
import dayjs from 'dayjs'
import Router from 'koa-router'
const router = new Router()
export default router

router.get('/', async (ctx) => {
	const [list] = await group.getList()
	ctx.body = {
		code: 0,
		msg: '获取列表成功',
		// data: list
		data: list.map((it) => {
			return {
				...it,
				createTime: dayjs(it.createTime).valueOf(),
				updateTime: dayjs(it.updateTime).valueOf(),
				links: it.links.map((l: any) => {
					return {
						...l,
						createTime: dayjs(l.createTime).valueOf(),
						updateTime: dayjs(l.updateTime).valueOf()
					}
				})
			}
		})
	}
})
