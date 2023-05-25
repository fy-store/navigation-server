/** 连接数据库 */
import mongoose from 'mongoose'
import config from '../../config/mongodb.js'

const { url, port, name, params = '' } = config

let db
try {
    db = await mongoose.connect(`${url}:${port}/${name}${params}`)
    console.log('数据库连接成功!')
} catch (err) {
    console.log('数据库连接失败!!!')
    throw err
}


export default db