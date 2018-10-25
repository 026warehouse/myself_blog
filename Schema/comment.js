const { Schema } = require("./config")
const ObjectId = Schema.Types.ObjectId

const CommentSchema = new Schema({
  // 头像   用户名  
  // 文章
  // 内容
  content: String,
  // 关联用户表
  from: {
    type: ObjectId,
    ref: "users"
  },
  // 关联到 article 表 --》 集合 
  article: {
    type: ObjectId,
    ref: "articles"
  }
}, {versionKey: false, timestamps: {
  createdAt: "created"
}})

CommentSchema.post('remove',(doc)=>{

  const Article = require('../Models/article')
  const User = require('../Models/user')

  const { from ,article } = doc

  Article.updateOne({_id:article},{$inc:{commentNum:-1}}).exec()

  User.updateOne({_id:from},{$inc:{commentNum:-1}})


})


module.exports = CommentSchema