/** 注册用户 */
import bcrypt from 'bcrypt'
import verifyCode from './verifyCode.js'
import { findOneUser, createUser } from '../../models/user/index.js'

// 邮箱校验规则
const emailReg = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
const pwdReg = /^[\w]{6,32}$/

// 注册用户
export async function post({ email, pwd, code }) {
    if (!(emailReg.test(email) && pwdReg.test(pwd))) {
        return {
            code: -1,
            mes: '邮箱或密码类型错误',
            data: null
        }
    }

    const resultCode = await verifyCode(email, code)
    if (!resultCode) {
        return {
            code: -1,
            mes: '验证码错误',
            data: null
        }
    }

    // 若用户已存在, 应当排除
    try {
        const user = await findOneUser(email)
        if (user) {
            return {
                code: -1,
                mes: '用户已存在',
                data: null
            }
        }

        // 用户为空, 向数据库写入用户信息
        // 加密密码
        const saltRounds = 10 // 盐
        const hash = bcrypt.hashSync(pwd, saltRounds)
        await createUser(email, hash)

        // 清除验证码的有效性
        // ......
        return {
            code: 1,
            mes: '注册成功',
            data: null
        }

    } catch (err) {
        return {
            code: -1,
            mes: '数据异常',
            data: null
        }
    }
}