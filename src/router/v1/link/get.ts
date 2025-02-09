import { link } from '#db'
import dayjs from 'dayjs'
import Router from 'koa-router'
import { createCheck } from '#utils'
const router = new Router()
export default router

router.get('/', async (ctx) => {
	const checkInfo = check(ctx.query)
	if (!checkInfo.result) {
		ctx.body = {
			code: 1,
			msg: checkInfo.failMessageList[0]
		}
		return
	}
	const [list] = await link.getList(+ctx.xssQuery.groupId)
	ctx.body = {
		code: 0,
		msg: '获取列表成功',
		data: list.map((it) => {
			return {
				...it,
				createTime: dayjs(it.createTime).valueOf(),
				updateTime: dayjs(it.updateTime).valueOf()
			}
		})
	}
})

const check = createCheck([
	{
		field: 'groupId',
		type: {
			expect: 'effectiveStrPositiveInt',
			fail: '分组 ID 是必填的, 且必须是数字'
		}
	}
])
