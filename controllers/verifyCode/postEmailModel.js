import postEmail from '../../utils/postEmail/index.js'

export default async function ({ email, code }) {
    await postEmail({
        from: 'navigation', 
        to: email,
        subject: 'navigation 验证码',
        text: `您的验证码是 ${code} , 5分钟内有效 .`,
        html: `
            <html>
                <head>
                    <meta charset="utf-8" />
                    <style>
                        .container[data-email=navigation] {
                            font-size: 22px;
                            color: #424242;
                        }

                        .container[data-email=navigation] span {
                            font-weight: bold;
                            color: #369390;
                        }
                    </style>
                </head>
                <body>
                    <div class="container" data-email="navigation">
                        您的验证码是 <span>${code}</span> , 5分钟内有效 .
                    </div>
                </body>
            </html>
        `
    })
}