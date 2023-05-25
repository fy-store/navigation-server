const random = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
}

const getCode = () => {
    return random(2, 36).toString(36)
}

/**
 * 获取随机数
 *
 * @param   {number}  num  指定字符长度
 *
 * @return  {string} 返回一个指定长度的随机字符串  
 */
export default function (num = 1) {
    let result = ''
    while (result.length < +num) {
        result += getCode()
    }
    return result
}
