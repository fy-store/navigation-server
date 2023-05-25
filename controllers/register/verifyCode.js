/** 判定验证码是否正确 */
import { findOne } from '../../models/email/index.js'

const codeReg = /^[A-Za-z0-9]{4}$/
export default async function (email, verifyCode) {
    if (!(codeReg.test(verifyCode))) {
        return false
    }

    const dbData = await findOne(email)
    const { code, data } = dbData
    
    // 如果数据库查找出错, 或者查找内容为空时
    if (code < 0 || !data) {
        code < 0 && console.log(dbData) // 这里准备上报错误日志
        return false
    }

    // 验证码过期
    if (+data.endTime < Date.now()) {
        return false
    }

    // 验证码不匹配
    if (verifyCode !== data.code) {
        return false
    }

    return true
}