import express from 'express'
import { get, post } from '../../controllers/tag/index.js'

const router = express.Router()

router.get('/tag', async (req, res) => {
    const { email } = req.query
    const result = await get({ req, res, email })
    res.json(result)
})

/**
 * 创建一个 tag
 * @param {string} email 为哪个用户新建一个 tag
 * @param {string} which 为具体哪个表创建 tag , 默认为 'default'
 * @param {string} title tag 的名字, 默认值为 'default'
 * @param {string} url tag 的url, 默认值为 '
 * @param {string} des tag 的的描述, 默认为 ''
 */
router.post('/tag', async (req, res) => {
    const { email, which = 'default', title = 'default', url = '', des = '' } = req.body
    const result = await post({ req, res, email, which, title, url, des })
    res.json(result)
})

export default router