/**
 * mongodb数据库配置文件
 */
export default {
    // url: 'mongodb://xxx:yyy@127.0.0.1', // 账号密码, xxx为账号, yyy为密码
    url: 'mongodb://127.0.0.1', // 不使用账号和密码
    port: 27017, // 数据库端口
    name: 'navigation', // 连接数据库的名字
    params: '?authSource=navigation' // 传递的而外才是, 通常连接带密码的数据库时需要携带
}