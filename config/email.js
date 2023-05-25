/**
 * 验证码配置文件
 */
export default {
    host: "smtp.qq.com", // 发送邮件的主机
    port: 465, // 端口
    secure: true, // https 协议
    auth: {
        user: '946686638@qq.com', //  发件人邮箱
        pass: '****************', //  邮箱授权码(密码)
    },
}

/** 
 * 验证码配置
 * @param {number} effectiveTime 验证码有效时间, 单位毫秒
 * @param {number} resetTime 多长时间后可重置验证码, 单位毫秒
 */
export const verifyCodeConfig = {
    effectiveTime: 1000 * 60 * 5, // 5分钟有效
    resetTime: 1000 * 30, // 30秒后可重新获取验证码
}