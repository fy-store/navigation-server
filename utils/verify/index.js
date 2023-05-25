/**
 * 各种类型的正则表达式
 */
export const reg = {
    email: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
    pwd: /^[\w]{6,32}$/
}

/**
 * 用于验证或处理各种类型
 */
const handle = {
    isEmail(email) {
        return reg.email.test(email)
    },
    isPwd(pwd) {
        return reg.pwd.test(pwd)
    },
    /** 用于字符串脱敏 < > ' " ` */
    replaceSensitive(str) {
        if (typeof str !== 'string') return 'str is not a string'
        // 替换 < 和 >
        str = str.replace(/</g, '&lt;').replace(/>/g, '&gt;');

        // 替换单引号和双引号
        str = str.replace(/'/g, '&#39;').replace(/"/g, '&quot;');

        // 替换反引号
        str = str.replace(/`/g, '&#96;');

        return str
    }
}

export default handle
