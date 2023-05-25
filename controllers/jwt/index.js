/** 提供token的创建和校验 */
import jwt from 'jsonwebtoken'
import jwtConfig from '../../config/jwt.js'

const KEY = jwtConfig.key

/**
 * 创建Token
 * @param {object} data 加密成Token的数据对象
 * @return {string} 返回一个Token
 */
export const createToken = async (data) => {
    const result = jwt.sign(data, KEY, { expiresIn: '7 days' })
    return result
}

/**
 * 校验Token
 * @param {string} token 对传入的token进行校验
 * @return {Boolean} 返回 true / false
 */
export const verifyToken = async (token) => {
    try {
        const decoded = jwt.verify(token, KEY);
        return decoded
    } catch (err) {
        return false
    }
}