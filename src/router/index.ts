import Router from 'koa-router'
import v1 from './v1/index.js'
const router = new Router()
export default router

router.use('/api/v1', v1.routes())
