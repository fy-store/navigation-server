import db from '../db/index.js'

const { Schema } = db
const schema = new Schema({
    email: String,
    pwd: String
})

const model = db.model('users', schema)

/**
 * 查询一个用户
 * @param {string} email 用户邮箱
 * @return {object} 如果用户存在则返回查询到的对象, 不存在则返回 null
 */
export const findOneUser = async (email) => {
    const result = await model.findOne({ email })
    return result
}

/**
 * 创建一个用户
 * @param {string} email 用户邮箱
 * @param {string} pwd 用户密码
 * @return {undefined} undefined
 */
export const createUser = async (email, pwd) => {
    await model.create({ email, pwd })
}