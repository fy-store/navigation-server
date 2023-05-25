import verifyUser from './verifyUser.js'
import { findTag, createTag } from '../../models/tag/index.js'
import verify from '../../utils/verify/index.js'
const { replaceSensitive } = verify

/**
 * 获取用户的tag表
 */
export const get = async ({ req, email }) => {
    // 验证用户信息
    const { email: userEmail } = req.tokenInfo
    const user = await verifyUser(email, userEmail)
    if (user.code < 0) {
        return user
    }

    try {
        const result = await findTag(email)
        return {
            code: 1,
            mes: 'OK',
            data: result
        }
    } catch (err) {
        return {
            code: -1,
            mes: '数据异常',
            data: null
        }
    }
}

/**
 * 为用户创建一个tag
 */
export const post = async ({ req, email, which, title, url, des }) => {
    // 验证用户信息
    const { email: userEmail } = req.tokenInfo
    const user = await verifyUser(email, userEmail)
    if (user.code < 0) {
        return user
    }

    // 转义敏感字符
    which = replaceSensitive(which)
    title = replaceSensitive(title)
    url = replaceSensitive(url)
    des = replaceSensitive(des)

    // 为用户创建tag
    try {
        await createTag({
            email,
            which,
            title,
            url,
            icon: '', // 此处icon数据将由后端请求url地址中的页签图标使用base64存储
            des
        })

        return {
            code: 1,
            mes: '创建成功',
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