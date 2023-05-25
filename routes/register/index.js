/** 注册用户路由 */
import express from 'express'
import { post } from '../../controllers/register/index.js'
const router = express.Router()

// 注册用户
router.post('/register', async (req, res) => {
    const { email, pwd, code } = req.body
    const result = await post({ email, pwd, code })
    res.json(result)
})

export default router