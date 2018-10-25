const Koa = require('koa')
const static = require('koa-static')
const views = require('koa-views')
const router = require('./routers/router')
const logger = require('koa-logger')
const body = require('koa-body')
const session = require('koa-session')
const { join } = require('path')
const compress = require('koa-compress')
const app = new Koa

app.keys = ["这是keys"]


const CONFIG = {
    key :　"Sid",
    maxAge : 36e5,
    overwrite : true,
    httpOnl : true,
    // signed : true,
    rolling : true
}

//日志
app.use(logger())

// 注册资源压缩模块 compress
app.use(compress({
    threshold: 2048,
    flush: require('zlib').Z_SYNC_FLUSH
}))


//session注册
app.use(session(CONFIG,app))


// post 请求模块 koa-body
app.use(body())


// 配置静态资源目录
app.use(static(join(__dirname,"public")))

// 配置视图模板
app.use(views(join(__dirname,"views"),{
    extension : 'pug'
}))



// 注册路由信息
app.use(router.routes()).use(router.allowedMethods())



app.listen(8080,()=>{
    console.log("监听端口8080成功");
})

// 创建管理员用户 如果管理员用户已经存在 则返回
{
    const { db } = require('./Schema/config')
    const UserSchema = require('./Schema/user')
    const encrypt = require('./util/encrypt')
    const User = db.model('users',UserSchema)

    User
        .find({username:'admin'})
        .then(data=>{
            if(data.length === 0)
            {
                new User({
                    username : 'admin',
                    password : encrypt('admin'),
                    role : 666,
                    commentNum: 0,
                    articleNum: 0
                })
                .save()
                .then(data=>{
                    console.log("管理员用户名 -> admin,  密码 -> admin")
                })
                .catch(err=>{
                    console.log("管理员账号检查失败")
                })
            }
            else{
                // 在控制台输出
                console.log(`管理员用户名 -> admin,  密码 -> admin`)
            }
        })
        .catch(err=>{
            console.log(err);
        })


}