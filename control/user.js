const { db } = require('../Schema/config.js')
const  UserSchema  = require('../Schema/user.js')
const encrypt = require('../util/encrypt.js')


const User = db.model("users", UserSchema)
//注册
exports.reg = async ctx=>{

  const user = ctx.request.body
  const username = user.username
  const password = user.password


  await new Promise((resolve,reject)=>{

    User.find({username},(err,data)=>{
      // console.log(err)
      

      if(err)return reject(err)

      if(data.length !== 0)
      {
        return resolve("")
      }
      
      const _user = new User({
        username,
        password : encrypt(password),
        commentNum: 0,
        articleNum: 0
      })
      console.log(_user)
      _user.save((err,data)=>{
          
          if(err){
            reject(err)
          }
          else{
            resolve(data)
            
          }

      })

    })

  })
  .then(async data=>{
    if(data)
    {
      //成功
      await ctx.render('isOk',{
        status : "注册成功"
      })
    }
    else{
      //失败
      await ctx.render('isOk',{
        status : "用户已经存在"
      })
    }
  })
  .catch(async err=>{
    await ctx.render('isOk',{
      status : "注册失败，请重试"
    })
  })


}
//登录

exports.login = async ctx=>{

  const user = ctx.request.body
  const username = user.username
  const password = user.password


  await new Promise((resolve,reject)=>{
    User.find({username},(err,data)=>{
      if(err)return reject(err)
      if(data.length === 0) return reject("用户名不存在")

      // console.log(data[0].password === encrypt(password))
      // console.log(data)
      if(data[0].password === encrypt(password)){
        return resolve(data)
      }

      resolve("")
    })
  })
  .then(async data=>{
    if(!data)
    {
      return ctx.render('isOk',{
        status : "登录密码不正确"
      })
    }
    // 让用户在他的 cookie 里设置 username password 加密后的密码 权限
    ctx.cookies.set("username",username,{
      domain : "127.0.0.1",
      path: "/",
      maxAge : 36e5,
      httpOnly : false,
      overwtite : false
    })
    // 用户在数据库的_id 值
    ctx.cookies.set("uid",data[0]._id,{
      domain : "127.0.0.1",
      path: "/",
      maxAge : 36e5,
      httpOnly : false,
      overwtite : false
    })

    ctx.session = {
      username,
      uid : data[0]._id,
      avatar: data[0].avatar,
      role : data[0].role
    }


    await ctx.render('isOk',{
      status : "登录成功"
    })
  })
  .catch(async err=>{
    await ctx.render('isOk',{
      status : '登录失败'
    })
  })



}

//中间件
exports.keepLog = async (ctx,next)=>{
  if(ctx.session.isNew)
  {
    if(ctx.cookies.get("username"))
    {
      let uid = ctx.cookies.get('uid')
      const avatar = await User.findById(uid).then(data=>data)
      ctx.session={
        username:ctx.cookies.get("username"),
        uid,
        avatar
      }
    }
  }

  await next()
}

//退出
exports.logout = async ctx=>{
  ctx.session = null
  ctx.cookies.set("username",null,{
    maxAge : 0
  })
  ctx.cookies.set("uid",null,{
    maxAge : 0
  })
  // 在后台做重定向到 根  
  ctx.redirect("/")


}


//头像上传
exports.upload = async ctx=>{
  const filename = ctx.req.file.filename

  let data = {}

  await User.update({_id:ctx.session.uid},{$set:{avatar:'/avatar/'+filename}},(err,res)=>{
    if(err)
    {
      data = {
        status : 0,
        message : "上传失败"
      }
    }
    else{
      data = {
        status : 1,
        message : '上传成功'  
      }
    }
  })

  ctx.body = data
}


