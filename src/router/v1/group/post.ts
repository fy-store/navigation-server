import { createCheck } from '#utils'
import { group } from '#db'
import Router from 'koa-router'
const router = new Router()
export default router

type CreateParams = {
	name: string
	remark?: string
}

router.post('/', async (ctx) => {
	const checkInfo = check(ctx.request.body)
	if (!checkInfo.result) {
		ctx.body = {
			code: 1,
			msg: checkInfo.failMessageList[0]
		}
		return
	}

	let { name, remark } = ctx.request.xssBody as CreateParams

	const [[info]] = await group.getByName(name)
	if (info) {
		ctx.body = {
			code: 1,
			msg: '分组名称已存在'
		}
		return
	}

	await group.create({
		name,
		remark
	})

	ctx.body = {
		code: 0,
		msg: '创建成功'
	}
})

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
