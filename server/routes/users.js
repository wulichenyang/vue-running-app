var express = require('express');
var router = express.Router();
let User = require('../models/user')
let Distance = require('../models/distance')
let jwt = require('jsonwebtoken')

const {
  privateKey
} = require('../config')


/* GET userinfo. */
router.get('/user', function (req, res, next) {
  User.find({ phone: req.phone }, { password: 0, role: 0, __v: 0, _id: 0 }, (err, doc) => {
    if (err) {
      res.status(500).send({
        code: 1,
        message: '获取用户信息失败'
      })
      return
    }
    if (doc.length > 0) {
      res.json({
        code: 0,
        data: {
          user: doc[0]
        }
      })
      return
    } else {
      res.json({
        code: 1,
        message: '用户信息错误'
      })
    }
  })
});

router.post('/signup', function (req, res, next) {
  const { logName, password } = req.body
  // 手机号是否被注册
  User.find({ phone: logName }, (err, doc) => {
    if (err) {
      res.status(500).send({
        code: 1,
        message: err.message,
      })
      return
    } else if (doc.length > 0) { // 有注册信息
      res.json({
        code: 1,
        message: '该手机号已注册'
      })
      return
    } else { // 未注册 New User
      let role
      if (logName === '13888888888') {
        role = 'admin'
      } else {
        role = 'user'
      }
      // 新建用户
      User.create({ phone: logName, password, role }, (err, userDoc) => {
        if (err) {
          res.status(500).send({
            code: 1,
            message: err.message
          })
        } else {
          // 添加distance初始化数据
          Distance.create({ userId: userDoc._id }, (err, doc) => {
            if (err) {
              res.status(500).send({
                code: 1,
                message: err.message
              })
              // TODO: remove user

            } else {
              res.json({
                code: 0,
                message: '注册成功，请登录'
              })
            }
          })
        }
        return
      })
    }
  })
});

// 登录
router.post('/login', (req, res, next) => {
  const { logName, password } = req.body

  // Check user
  User.findOne({ phone: logName, password }, (err, doc) => {
    if (err) {
      res.status(500).json({
        code: 1,
        message: err.message,
      })
      return
    } else if (doc) { // 找到账号
      let content = { phone: logName, userId: doc._id }// 要生成token的主题信息
      // 这是加密的 key（密钥）
      let token = jwt.sign(content, privateKey, {
        expiresIn: 60 * 60 * 24 * 30 // 24 小时 * 30 天 过期 
      })
      res.json({
        code: 0,
        message: "登录成功",
        data: {
          token
        }
      })
      return
    } else { // 密码不正确
      res.send({
        code: 1,
        message: '手机号或密码错误',
      });
    }
  })

})

module.exports = router;
