import Router from 'koa-router'
import post from './post.js'
import del from './del.js'
import patch from './patch.js'
const router = new Router()
export default router

router.use(post.routes(), del.routes(), patch.routes())
