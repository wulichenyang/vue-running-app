let jwt = require('jsonwebtoken')
let {
  privateKey
} = require('../config')
// 自定义 验证用户token 中间件
module.exports = (req, res, next) => {
  // 定义 不用检查 token 的api
  if (req.originalUrl.indexOf('/login') >= 0 
      || req.originalUrl.indexOf('/signup') >= 0
      // || req.originalUrl.indexOf('/captcha') >= 0
     ) {
    return next();
  }
  //定义 用token的api对其验证
  let token = req.get('Authorization') && req.get('Authorization').split('Bearer ')[1] // ||
              // req.body.token ||
              // req.query.token || 
              // req.get('x-access-token')
  if (!token) {
    res.status(401).send({
      code: 1,
      message: '未登录'
    });
    return;
  } else {
    jwt.verify(token, privateKey, (err, decoded) => {
      if (err) {
        // token超时或验证失败
        res.status(403).send({
          code: 1,
          message: '登录超时'
        });
        return;
      } else {
        /* 关键关键关键 */
        // 取出token里username信息
        req.phone = decoded.phone
        req.userId = decoded.userId

        // token验证成功 刷新token并返回给前端
        // let newToken = jwt.sign({ username: decoded.username }, "secretOrPrivateKey", {
        //   expiresIn: 60 * 60 * 0.5  // 0.0.2小时过期
        // })
        
        // 跳出中间件
        return next();
      }
    });
  }
};