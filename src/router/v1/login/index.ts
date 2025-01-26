import Router from 'koa-router'
import post from './post.js'
const router = new Router()
export default router

router.use(post.routes())
