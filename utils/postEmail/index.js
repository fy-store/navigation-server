import config from '../../config/email.js'
import nodemailer from 'nodemailer'

export default async function (options) {
    try {
        const { from, to, subject, text, html } = options

        // 创建一个传输器
        const transporter = nodemailer.createTransport(config)

        // 信件信息
        await transporter.sendMail({
            from: `"${from}" ${config.auth.user}`, // 发件人邮箱
            to, // 收件人邮箱
            subject, // 邮件主题
            text, // 邮件正文
            html // html内容
        })

    } catch (err) {
        console.log('验证码发送失败');
        console.log(err);
    }
}