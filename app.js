/** 程序入口 */
import express from 'express'
import path from 'path'
import cors from 'cors'
import './models/db/index.js'
import routes from './api/router/index.js'
import { createToken, verifyToken } from './controllers/jwt/index.js'
import projectPath from './utils/projectPath/index.cjs'
import projectConfig from './config/project.js'

const app = express()
app.use(cors({
    exposedHeaders: ["Authorization", 'authorization', "Content-Type"]
}))
app.use(express.json())
const publicUrl = path.join(projectPath.publicPath, '/dist') // public/dist 暴露静态文件(可自行修改)
app.use(express.static(publicUrl))

// 校验token
app.use(async (req, res, next) => {
    const { path } = req
    // 允许通过的路由
    const allow = ['/', '/api/login', '/api/register', '/api/verifyCode']
    const isAllow = allow.includes(path)
    if (isAllow) {
        next()
        return
    }

    // 校验token
    const { authorization } = req.headers
    const result = await verifyToken(authorization)
    if (result) {
        // 解析后的token信息挂载至 req 上
        req.tokenInfo = result

        // 如果需要, 应在此重置token时长
        const token = await createToken({
            email: result.email
        })

        res.set({
            Authorization: token
        })

        next()
    }
    else {
        res.status(205) // 设置状态码, 交由前端进行判断
        res.json({
            code: -1,
            mes: 'token错误或已到期',
            data: null
        })
    }
})

app.use(routes) // 路由

app.listen(projectConfig.port, (err) => {
    if (err) {
        console.log('服务器启动失败!!!')
        console.log(err)
        return
    }

    console.log(`服务器启动成功! ${projectConfig.port} 端口监听中`)
})