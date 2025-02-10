import { createCheck } from 'uxiu'
import { link } from '#db'
import Router from 'koa-router'
const router = new Router()
export default router

router.del('/:id', async (ctx) => {
    const checkInfo = check(ctx.params)
    if (!checkInfo.result) {
        ctx.body = {
            code: 1,
            msg: checkInfo.fail.msgList[0]
        }
        return
    }

    const { id } = ctx.xssParams
    const [list] = await link.getById(+id)
    if (!list.length) {
        ctx.body = {
            code: 1,
            msg: '链接不存在'
        }
        return
    }

    await link.deleteById(+id)
    ctx.body = {
        code: 0,
        msg: '删除成功'
    }
})

const check = createCheck([
    {
        field: 'id',
        type: {
            expect: 'effectiveStrPositiveInt',
            fail: 'id 必须为有效正整数'
        }
    }
])
