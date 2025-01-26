import Router from 'koa-router'
import admin from './admin/index.js'
import login from './login/index.js'
import group from './group/index.js'
import link from './link/index.js'
const router = new Router()
export default router

router.use('/admin', admin.routes())
router.use('/login', login.routes())
router.use('/group', group.routes())
router.use('/link', link.routes())
