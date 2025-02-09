import { createCheck } from '#utils'
import { group, link } from '#db'
import Router from 'koa-router'
const router = new Router()
export default router

router.del('/:id', async (ctx) => {
	const checkInfo = check(ctx.params)
	if (!checkInfo.result) {
		ctx.body = {
			code: 1,
			msg: checkInfo.failMessageList[0]
		}
		return
	}

	const { id } = ctx.xssParams
	const [list] = await group.getById(+id)
	if (!list.length) {
		ctx.body = {
			code: 1,
			msg: '分组不存在'
		}
		return
	}

	const [linkList] = await link.getListByGroupId(+id)
	if (linkList.length) {
		await link.deleteByIds(linkList.map((it) => it.id))
	}
	await group.deleteById(+id)
	ctx.body = {
		code: 0,
		msg: '删除成功'
	}
})

const check = createCheck([
	{
		field: 'id',
		type: {
			expect: 'effectiveStrPositiveInt',
			fail: 'id 必须为有效正整数'
		}
	}
])
