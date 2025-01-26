import { link } from '#db'
import { createCheck } from '#utils'
import Router from 'koa-router'
const router = new Router()
export default router

router.post('/', async (ctx) => {
	const checkInfo = check(ctx.request.body)
	if (!checkInfo.result) {
		ctx.body = {
			code: 1,
			msg: checkInfo.failMessageList[0]
		}
		return
	}

	const { icon, groupId } = ctx.request.xssBody
	await link.create({
		...ctx.request.xssBody,
		icon: icon ? icon : 'https://fanyi.baidu.com/favicon.ico',
		group_id: groupId
	})

	ctx.body = {
		code: 0,
		msg: '创建成功'
	}
})

const check = createCheck([
	{
		field: 'groupId',
		type: {
			expect: 'number',
			fail: '分组 ID 是必填的, 且必须是数字'
		}
	},
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
		type: {
			expect: 'string',
			fail: 'icon 类型必须是字符串',
			verify(data, checkFn) {
				if (data === void 0) return true
				return checkFn()
			}
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
		type: {
			expect: 'string',
			fail: 'remark 类型必须是字符串',
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
			fail: '链接地址长度只能为 0 - 500 个字符'
		}
	}
])
