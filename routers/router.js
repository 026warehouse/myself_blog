const Router = require('koa-router')
const user = require("../control/user")
const article = require("../control/article")
const comment = require("../control/comment")
const admin = require("../control/admin")
const upload = require('../util/upload')
const router = new Router

router.get('/', user.keepLog,article.getList)

router.get(/^\/user\/(?=reg|login)/,async (ctx)=>{
    const show = /reg$/.test(ctx.path)

    await ctx.render('register',{show})
})


//post 请求模块
//注册模块
router.post('/user/reg',user.reg)
//登录模块
router.post('/user/login',user.login)

//退出
router.get('/user/logout',user.logout)

// 文章的发表页面
router.get('/article',user.keepLog,article.addPage)

// 文章添加
router.post('/article',user.keepLog,article.add)

//文章列表分页 路由
router.get('/page/:id',article.getList)

//文章详情
router.get('/article/:id',user.keepLog,article.details)

//文章评论保存
router.post('/comment',user.keepLog,comment.save)

//后台
router.get("/admin/:id",user.keepLog,admin.index)

//用户头像上传
router.post('/upload',user.keepLog,upload.single("file"),user.upload)

// 获取用户的所有评论
router.get("/user/comments", user.keepLog, comment.comlist)

// 后台：删除用户评论
router.del("/comment/:id", user.keepLog, comment.del)

// 获取用户的所有文章
router.get('/user/articles',user.keepLog,article.artList)

// 后台：删除用户评论
router.del('/article/:id',user.keepLog,article.del)

// 404
router.get("/*",async ctx =>{
    await ctx.render('404',{
        title:"404"
    })
})

module.exports = router