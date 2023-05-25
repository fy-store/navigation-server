import db from '../db/index.js'

const { Schema } = db
const schema = new Schema({
    email: String,
    createTime: String,
    tag: String, // json tag字段
})

const model = db.model('tags', schema)

/**
 * 查询指定用户的tag
 * @param {string} email 用户邮箱
 * @return {Promise} 当前用户的tag数据 , 用户存在返回数据对象, 不存在返回 null
 */
export const findTag = async (email) => {
    const result = await model.findOne({ email }).select({ '__v': 0 })
    return result
}

/**
 * 更新一个用户tag的tag数据
 * @param {string} email 用户邮箱
 * @param {object} tagData 可序列化的对象
 * @return {Promise} 替换成功后的信息, 若无报错, 即更新成功
 */
export const updateTag = async (email, tagData) => {
    const result = await model.updateOne({ email }, { tag: JSON.stringify(tagData) })
    return result
}

/**
 * 创建一个 tag
 * @param {string} email 为哪个用户新建一个 tag
 * @param {string} which 为具体哪个表创建 tag , 默认为 'default'
 * @param {string} title tag 的名字, 默认值为 'default'
 * @param {string} url tag 的url, 默认值为 '
 * @param {string} des tag 的的描述, 默认为 ''
 * @returns {object} 创建结果, 无抛出错误即为成功
 */
export const createTag = async ({ email, which, title, url, icon, des }) => {
    // 查询用户的tag是否存在, 不存在的初始化创建
    let userTag = await findTag(email)
    if (!userTag) {
        userTag = await initTag({ email })
    }

    const tag = JSON.parse(userTag.tag)
    const data = {
        title,
        url,
        icon,
        des,
        createTime: Date.now(), // 创建时间
    }

    // 指定的 which 如果不存在, 则进行创建
    if (!tag[which]) {
        tag[which] = []
    }
    tag[which].push(data)

    // 更新数据
    const result = await updateTag(email, tag)
    return result
}

/**
 * 初始化用户tag表
 */
async function initTag({ email }) {
    const result = await model.create({
        email, // 用户邮箱
        createTime: Date.now(), // 创建时间
        tag: JSON.stringify({ // tag字段
            default: []
        }),
    })

    return result
}
