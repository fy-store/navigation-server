import { createCheck } from '#utils'
import { hash } from '#common'
import { admin } from '#db'
import Router from 'koa-router'
const router = new Router()
export default router

type CreateParams = {
	name: string
	account: string
	password: string
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

	let { name, account, password } = ctx.request.xssBody as CreateParams
	const [[info]] = await admin.getByAccount(account)
	if (info) {
		ctx.body = {
			code: 1,
			msg: '账号已存在'
		}
		return
	}

	await admin.create({
		name,
		account,
		password: await hash.encode(password)
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
			fail: '管理员名称必须为字符串'
		},
		length: {
			expect: {
				min: 1,
				max: 10
			},
			fail: '管理员名称长度为1-10位'
		}
	},
	{
		field: 'account',
		type: {
			expect: 'string',
			fail: '管理员账号必须为字符串'
		},
		length: {
			expect: {
				min: 5,
				max: 12
			},
			fail: '管理员账号长度为5-12位'
		}
	},
	{
		field: 'password',
		type: {
			expect: 'string',
			fail: '管理员密码必须为字符串'
		},
		length: {
			expect: {
				min: 5,
				max: 12
			},
			fail: '管理员密码长度为5-12位'
		}
	}
])
