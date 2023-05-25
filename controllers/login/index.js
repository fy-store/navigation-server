/** 校验邮箱和密码, 正常则返回token */
import bcrypt from 'bcrypt'
import { findOneUser } from "../../models/user/index.js"
import { createToken } from '../jwt/index.js'

const emailReg = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
const pwdReg = /^[\w]{6,32}$/
export default async ({ email, pwd }) => {
    // 未通过正则校验, 返回错误信息
    if (!(emailReg.test(email) && pwdReg.test(pwd))) {
        return {
            code: -1,
            mes: '账号或密码错误',
            data: null
        }
    }

    try {
        const user = await findOneUser(email)
        if (!user) {
            // 查询不到用户
            return {
                code: -1,
                mes: '账号或密码错误',
                data: null
            }
        }

        // 验证账号密码是否正确
        if (email === user.email) {
            // 校验密码
            const result = bcrypt.compareSync(pwd, user.pwd)
            if (!result) {
                return {
                    code: -1,
                    mes: '账号或密码错误',
                    data: null
                }
            }

            // 账号和密码都正确, 返回token
            const token = await createToken({
                email
            })

            return {
                code: 1,
                mes: '登录成功',
                data: {
                    token
                }
            }

        } else {
            return {
                code: -1,
                mes: '账号或密码错误',
                data: null
            }
        }

    } catch (err) {
        console.log(err);
        return {
            code: -1,
            mes: '数据异常',
            data: null
        }
    }

}