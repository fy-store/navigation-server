import { createCheck } from '#utils'
import { group } from '#db'
import Router from 'koa-router'
const router = new Router()
export default router

router.patch('/:id', async (ctx) => {
	const checkIdInfo = checkId(ctx.params)
	if (!checkIdInfo.result) {
		ctx.body = {
			code: 1,
			msg: checkIdInfo.failMessageList[0]
		}
		return
	}

	const checkInfo = check(ctx.request.body)
	if (!checkInfo.result) {
		ctx.body = {
			code: 1,
			msg: checkInfo.failMessageList[0]
		}
		return
	}

	const { id } = ctx.xssParams
	const [[info]] = await group.getById(+id)
	if (!info) {
		ctx.body = {
			code: 1,
			msg: '分组不存在'
		}
		return
	}

	const xssBody = ctx.request.xssBody
	const data = {
		...info,
		...xssBody
	}

	await group.updateById(+id, data)

	ctx.body = {
		code: 0,
		msg: '更新成功'
	}
})

const checkId = createCheck([
	{
		field: 'id',
		type: {
			expect: 'effectiveStrPositiveInt',
			fail: 'id 必须为有效正整数'
		}
	}
])

const check = createCheck([
	{
		field: 'name',
		type: {
			expect: 'string',
			fail: '分组名称是必填的'
		},
		length: {
			expect: {
				min: 1,
				max: 30
			},
			fail: '分组名称长度在1-30个字符之间'
		}
	},
	{
		field: 'remark',
		type: {
			expect: 'string',
			fail: '备注类型必须是字符串',
			verify(data, checkFn) {
				if (data === void 0) return true
				return checkFn()
			}
		},
		length: {
			expect: {
				min: 0,
				max: 500
			},
			verify(data, checkFn) {
				if (data === void 0) return true
				return checkFn()
			},
			fail: '备注长度在0-500个字符之间'
		}
	}
])
