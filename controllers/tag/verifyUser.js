import { findOneUser } from '../../models/user/index.js'
import verify from '../../utils/verify/index.js'
const { isEmail } = verify

export default async (email, userEmail) => {
    const err = {
        code: -1,
        mes: '参数有误',
        data: null
    }

    // 验证邮箱格式
    if (!isEmail(email)) {
        return err
    }

    // 验证用户是否与token的信息一致
    if (email !== userEmail) {
        err.mes = '非法请求'
        return err
    }

    // 验证用户是否存在
    try {
        const user = await findOneUser(email)
        if (!user) {
            err.mes = '非法请求'
            return err
        }
    } catch (err) {
        err.mes = '数据异常'
        return err
    }

    return {
        code: 1,
        mes: '验证通过',
        data: null
    }
}