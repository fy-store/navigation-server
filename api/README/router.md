# API 接口文档

当前已实现 *注册* , *登录* , *获取邮箱验证码* 接口

本API文档 GET 请求使用 urlencoded , 除此之外其他请求都采用 JSON . 

本API文档中的所有接口返回数据都采用 JSON . 

通过返回的数据中的 code 字段判断是否成功 , 1 表示成功 , -1 表示失败 . 

通过返回的数据中的 mes 字段判断来获取成功或失败具体内容 , 通常情况下失败原因将放在 mes 字段中

请求以下api必须通过 token 验证 , 使用时请求头请携带 Authorization 字段 . 



## 注册

```api
/api/register
```



**请求方式:** 

- POST

​	

| 字段  | 类型   | 是否必填 |                          补充                           |
| :---: | ------ | :------: | :-----------------------------------------------------: |
| email | String |    是    |                      符合邮箱格式                       |
|  pwd  | String |    是    | 最小6位, 最大32位 , 字符为 字母、数字或者下划线 即 (\w) |
| code  | String |    是    |                    请求拿到的验证码                     |



*示例:*

```json
{
    "email": "123456@qq.com",
    "pwd": "abc123",
    "code": "????"
}
```





## 获取验证码

```api
/api/verifyCode
```



**请求方式:**

- GET



| 字段  |  类型  | 是否必填 |     补充     |
| :---: | :----: | :------: | :----------: |
| email | String |    是    | 符合邮箱格式 |



*示例:*

```urlenconded
/api/verifyCode?email=123456@qq.com
```





## 登录

```api
/api/login
```



**请求方式:**

- POST



| 字段  |  类型  | 是否必填 | 补充 |
| :---: | :----: | :------: | :--: |
| email | String |    是    |  无  |
|  pwd  | String |    是    |  无  |



*示例:*

```json
{
    "email": "123456@qq.com",
    "pwd": "abc123"
}
```





## 获取用户的标签(tag)

```api
/api/tag
```



**请求方式:**

- GET



| 字段  |  类型  | 是否必填 | 补充 |
| :---: | :----: | :------: | :--: |
| email | String |    是    |  无  |



*示例:*

```urlencoded
/api/tag?email=123456@qq.com
```



*返回数据中的其他字段:*

- icon \<String> 储存的内容为当前url的标签图标 , 数据以 base64 存储, 不存在或失败将为 '' 空串
- createTime \<String> 创建该对象时的日期, 数据以时间戳存储



## 为用户添加一个标签(tag)

```api
/api/tag
```



**请求方式:**

- POST



| 字段  |  类型  | 是否必填 | 默认值  |      补充      |
| :---: | :----: | :------: | :-----: | :------------: |
| email | String |    是    |   无    |       无       |
| which | String |    否    | default | 为哪一个表添加 |
| title | String |    否    | default |   tag的标题    |
|  url  | String |    否    |   ''    | tag的链接地址  |
|  des  | String |    否    |   ''    |   tag的描述    |



*示例:*

```json
{
    "email": "123456@qq.com",
    "which": "前端框架",
    "title": "vue",
    "url": "https://cn.vuejs.org/"
}
```

