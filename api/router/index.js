/** 路由入口 */
import express from 'express'
import register from '../../routes/register/index.js' // 注册用户
import verifyCode from '../../routes/verifyCode/index.js' // 邮箱验证码
import login from '../../routes/login/index.js' // 登录
import tag from '../../routes/tag/index.js' // 标签

const router = express.Router()
router.use('/api', [register, verifyCode, login, tag])

export default router