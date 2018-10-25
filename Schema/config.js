// 连接数据库 导出 db Schema
const mongoose = require('mongoose')


const db = mongoose.createConnection("mongodb://localhost:27017/blogproject", {useNewUrlParser: true})

// 用原生 ES6的 promise 代替 mongoose 自实现的 promise
mongoose.Promise = global.Promise

const Schema = mongoose.Schema


db.on("error",()=>{
  console.log('连接数据库成功')
})

db.on('open',()=>{
  console.log("连接数据库成功")
})


module.exports = {
  db,
  Schema
}