/** 邮箱验证码 */
import express from 'express'
import { get } from '../../controllers/verifyCode/index.js'

const router = express.Router()

// 获取验证码
router.get('/verifyCode', async (req, res) => {
    const { email } = req.query
    const result = await get(email)
    res.json(result)
})

export default router