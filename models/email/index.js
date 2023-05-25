/** 用于邮件判定 */

import db from '../db/index.js'

const { Schema } = db

const schema = new Schema({
    email: String, // 邮箱号
    startTime: String, // 开始时间
    endTime: String, // 结束时间
    resettingTime: String, // 重新获取
    code: String, // 验证码
})

const model = db.model('emails', schema)

/** 查询 */
export async function findOne(email) {
    try {
        const result = await model.findOne({ email })
        return {
            code: 1,
            mes: 'ok',
            data: result
        }
    } catch (err) {
        return {
            code: -1,
            mes: '数据库出错',
            data: err
        }
    }
}

/** 创建 */
export async function create({ email, startTime, endTime, resettingTime, code }) {
    try {
        const result = await model.create({ email, startTime, endTime, resettingTime, code })
        return {
            code: 1,
            mes: 'ok',
            data: result
        }
    } catch (err) {
        return {
            code: -1,
            mes: '数据库出错',
            data: err
        }
    }
}

/** 更新 */
export async function updateOne({ email, startTime, endTime, resettingTime, code }) {
    try {
        const result = await model.updateOne({ email }, { startTime, endTime, resettingTime, code })
        return {
            code: 1,
            mes: 'ok',
            data: result
        }
    } catch (err) {
        return {
            code: -1,
            mes: '数据库出错',
            data: err
        }
    }
}