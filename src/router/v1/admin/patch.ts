import { createCheck } from '#utils'
import { admin } from '#db'
import Router from 'koa-router'
import { isUndefined } from 'uxiu'
import { hash } from '#common'
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
	const [[info]] = await admin.getById(+id, true)
	if (!info) {
		ctx.body = {
			code: 1,
			msg: '管理员不存在'
		}
		return
	}

	const { name, password } = info
	const xssBody = ctx.request.xssBody

	const data = {
		name: xssBody.name || name,
		password: xssBody.password ? await hash.encode(xssBody.password) : password
	}
	await admin.updateById(+id, data)

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
			fail: '管理员名称必须为字符串'
		},
		length: {
			expect: {
				min: 1,
				max: 10
			},
			fail: '管理员名称长度为1-10位',
			verify(data, checkFn) {
				if (isUndefined(data)) return true
				return checkFn()
			}
		}
	},
	{
		field: 'password',
		type: {
			expect: 'string',
			fail: '管理员密码必须为字符串',
			verify(data, checkFn) {
				if (isUndefined(data)) return true
				return checkFn()
			}
		},
		length: {
			expect: {
				min: 5,
				max: 12
			},
			fail: '管理员密码长度为5-12位',
			verify(data, checkFn) {
				if (isUndefined(data)) return true
				return checkFn()
			}
		}
	}
])
