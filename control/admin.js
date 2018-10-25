const fs = require('fs')
const { join } = require('path')

exports.index = async ctx=>{

  if(ctx.session.isNew)
  {
    ctx.status = 404
    return await render('404',{title:404})
  }

  const id = ctx.params.id

  const arr = fs.readdirSync(join(__dirname,'../views/admin'))

  let falg = false

  arr.forEach(v=>{
    const name = v.replace(/^(admin\-)|(\.pug)$/g,"")
    if( name === id )
    {
      falg = true
    }

  })

  if(falg)
  {
    await ctx.render('./admin/admin-'+id,{
      role : ctx.session.role
    })
  }
  else
  {
    ctx.status = 404
    await ctx.render("404", {title: '404'})
  }


}