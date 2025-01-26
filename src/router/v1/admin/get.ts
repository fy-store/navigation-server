import { admin } from '#db'
import Router from 'koa-router'
import { createCheck } from '#utils'
import { isUndefined } from 'uxiu'
const router = new Router()
export default router

router.get('/', async (ctx) => {
	const checkInfo = getListCheck(ctx.query)
	if (!checkInfo.result) {
		ctx.body = {
			code: 1,
			msg: checkInfo.failMessageList[0]
		}
		return
	}

	const { page, size, name } = ctx.xssQuery
	const params = {
		page: Number(page),
		size: Number(size),
		name: name as string
	}

	const [list] = await admin.getList(params)
	ctx.body = {
		code: 0,
		msg: '获取列表成功',
		data: list.map((it) => {
			return {
				...it,
				createTime: it.createTime.getTime(),
				updateTime: it.updateTime.getTime()
			}
		})
	}
})

const getListCheck = createCheck([
	{
		field: 'page',
		type: {
			expect: 'effectiveStrPositiveInt',
			fail: 'page 必须是正整数'
		}
	},
	{
		field: 'size',
		type: {
			expect: 'effectiveStrPositiveInt',
			fail: 'size 必须是正整数'
		}
	},
	{
		field: 'name',
		type: {
			expect: 'string',
			fail: 'name 必须是字符串',
			verify(data, checkFn) {
				if (isUndefined(data)) return true
				return checkFn()
			}
		}
	}
])
