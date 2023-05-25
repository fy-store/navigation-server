import express from 'express'
import login from '../../controllers/login/index.js'
const router = express.Router()

router.post('/login', async (req, res) => {
    const { email, pwd } = req.body
    const result = await login({ email, pwd })
    res.json(result)
})


export default router