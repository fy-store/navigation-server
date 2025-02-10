import { createCheck } from 'uxiu'
import { link } from '#db'
import Router from 'koa-router'
const router = new Router()
export default router

router.patch('/:id', async (ctx) => {
	const checkIdInfo = checkId(ctx.params)
	if (!checkIdInfo.result) {
		ctx.body = {
			code: 1,
			msg: checkIdInfo.fail.msgList[0]
		}
		return
	}

	const checkInfo = check(ctx.request.body)
	if (!checkInfo.result) {
		ctx.body = {
			code: 1,
			msg: checkInfo.fail.msgList[0]
		}
		return
	}

	const { id } = ctx.xssParams
	const [[info]] = await link.getById(+id)
	if (!info) {
		ctx.body = {
			code: 1,
			msg: '链接不存在'
		}
		return
	}

	const xssBody = ctx.request.xssBody
	const data = {
		...info,
		...xssBody
	}

	await link.updateById(+id, data)

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
			fail: '链接名称是必填的'
		},
		length: {
			expect: {
				min: 1,
				max: 20
			},
			fail: '链接名称长度只能为 1 - 20 个字符'
		}
	},
	{
		field: 'url',
		type: {
			expect: 'string',
			fail: '链接地址是必填的'
		},
		length: {
			expect: {
				min: 1,
				max: 500
			},
			fail: '链接地址长度只能为 1 - 500 个字符'
		}
	},
	{
		field: 'icon',
		required: false,
		type: {
			expect: 'string',
			fail: 'icon 类型必须是字符串'
		},
		length: {
			expect: {
				min: 1,
				max: 500
			},
			fail: '链接地址长度只能为 1 - 500 个字符'
		}
	},
	{
		field: 'remark',
		required: false,
		type: {
			expect: 'string',
			fail: 'remark 类型必须是字符串'
		},
		length: {
			expect: {
				min: 0,
				max: 500
			},
			fail: '链接地址长度只能为 0 - 500 个字符'
		}
	}
])
