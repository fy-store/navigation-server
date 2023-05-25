/**
 * jsonWebToken(jwt)配置文件
 */
import crypto from 'crypto'

// 创建随机字符
function generateRandomString(length) {
    return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}

/**
 * 此处key用作jwt加密秘钥, 由于随机性, 每一次重启服务器都是新的key
 * 若有需要可写一个固定的key(但不推荐)
 */
export default {
    key: generateRandomString(32) // 创建一个32位随机字符串
}