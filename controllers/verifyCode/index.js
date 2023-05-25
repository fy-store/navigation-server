/** 邮箱验证码 */
import createCode from './createCode.js'
import { findOne, create, updateOne } from '../../models/email/index.js'
import postEmailModel from './postEmailModel.js'
import { verifyCodeConfig } from '../../config/email.js'

const { effectiveTime, resetTime } = verifyCodeConfig
const emailReg = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/

// 异常结果模板
const resultErr = (mes = '数据异常') => {
    return {
        code: -1,
        mes,
        data: null
    }
}

// 成功结果模板
const resultOK = (mes = 'OK') => {
    return {
        code: 1,
        mes,
        data: null
    }
}

export async function get(email) {
    // 校验验证码格式
    if (!emailReg.test(email)) {
        return resultErr('邮件类型错误')
    }
    const dbData = await findOne(email)
    const { code, data } = dbData

    // 数据库出错
    if (code < 0) {
        return resultErr()
    }

    // 如果数据为空, 当前用户不存在文档, 应当创建且返回
    if (!data) {
        const startTime = Date.now()
        const endTime = startTime + effectiveTime // 有效时间
        const resettingTime = startTime + resetTime //可重置间隔时间
        const code = createCode(4)

        const createData = await create({ email, startTime, endTime, resettingTime, code })
        // 数据库出错
        if (createData.code < 0) {
            return resultErr()
        }

        // 发送验证码
        try {
            await postEmailModel({
                email,
                code
            })
        } catch (err) {
            return resultErr('验证码请求失败')
        }

        // 成功
        return resultOK()
    }

    // 数据存在, 判断验证码是否到期, 若到期则更新验证码
    const { endTime: end, resettingTime } = data
    // 到期 或者 已达xx时间可重新获取
    if ((+end < Date.now()) || +resettingTime < Date.now()) {
        const startTime = Date.now()
        const endTime = startTime + effectiveTime // 有效时间
        const resettingTime = startTime + resetTime // 可重置间隔时间
        const code = createCode(4)

        // 更新文档
        const updateData = await updateOne({ email, startTime, endTime, resettingTime, code })
        if (updateData.code < 0) {
            return resultErr()
        }

        // 发送验证码
        try {
            await postEmailModel({
                email,
                code
            })
        } catch (err) {
            return resultErr('验证码请求失败')
        }

        // 成功
        return resultOK()
    }

    // 未到期, 异常请求, 拒绝处理
    return resultErr('异常请求')
}