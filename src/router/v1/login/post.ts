import { sleep, createCheck } from 'uxiu'
import { hash, encipher } from '#common'
import { admin } from '#db'
import Router from 'koa-router'
const router = new Router()
export default router

router.post('/', async (ctx) => {
	const checkInfo = check(ctx.request.body)
	if (!checkInfo.result) {
		ctx.body = {
			code: 1,
			msg: checkInfo.fail.msgList[0]
		}
		return
	}

	const { account, password } = ctx.request.xssBody
	const startTimer = Date.now()
	const [[info]] = await admin.getByAccount(account, true)
	if (!info) {
		ctx.body = {
			code: 1,
			msg: '账号或密码有误'
		}
		return
	}

	if (!(await hash.compare(password, info.password))) {
		ctx.body = {
			code: 1,
			msg: '账号或密码有误'
		}
	}

	const difTimer = Date.now() - startTimer
	if (difTimer < 200) {
		await sleep(200 - difTimer)
	}

	const sessionId = await ctx.userSessionStore.create({
		id: info.id,
		latelyOperationTimer: Date.now()
	})
	ctx.body = {
		code: 0,
		msg: '登录成功',
		data: {
			name: info.name,
			token: encipher.encryption(sessionId)
		}
	}
})

const check = createCheck([
	{
		field: 'account',
		type: {
			expect: 'string',
			fail: '账号类型必须是字符串'
		},
		length: {
			expect: {
				min: 3,
				max: 12
			},
			fail: '管理员账号长度为5-12位'
		}
	},
	{
		field: 'password',
		type: {
			expect: 'string',
			fail: '密码类型必须为字符串'
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
