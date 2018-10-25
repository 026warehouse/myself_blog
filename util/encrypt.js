const crypto = require('crypto')

// 加密对象 --》 返回加密成功的数据
module.exports = function(password, key = "guoguo"){
  const hmac = crypto.createHmac("sha256", key)
  hmac.update(password)
  const passwordHmac = hmac.digest("hex")
  // console.log(passwordHmac)
  return passwordHmac
}