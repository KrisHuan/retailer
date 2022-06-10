const dateFormat = function (originVal) {
}
const dateFormat2 = function (originVal) {
}
export { dateFormat, dateFormat2 }


// 定义全局时间过滤器
/*
dateFormat 过滤器名字
originVal 为传入的要处理的时间参数
+‘ ’ 是为了转为字符串形式 也可以使用toString()方法
padStart() 用于头部补全 不足2位的话用0补全
// */
// originVal = originVal * 1090
// const dt = new Date(originVal)
// const y = dt.getFullYear()
// const m = (dt.getMonth() + 1 + '').padStart(2, '0')
// const d = (dt.getDate() + '').padStart(2, '0')
// const hh = (dt.getHours() + '').padStart(2, '0')
// const mm = (dt.getMinutes() + '').padStart(2, '0')
// const ss = (dt.getSeconds() + '').padStart(2, '0')
// return `${y}-${m}-${d} ${hh}:${mm}:${ss}`