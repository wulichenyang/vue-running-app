var express = require('express');
var router = express.Router();
let User = require('../models/user')
let Distance = require('../models/distance')
let jwt = require('jsonwebtoken')

const {
  privateKey
} = require('../config')

const {
  errInfo,
  resInfo
} = require('./utils')

/* GET userinfo. */
router.get('/user', function (req, res, next) {
  User.find({ phone: req.phone }, { password: 0, role: 0, __v: 0, _id: 0 }, (err, doc) => {
    if (err) {
      errInfo(res, '获取用户信息失败')
      return
    }
    if (doc.length > 0) {
      resInfo(res, { user: doc[0] })
      return
    } else {
      errInfo(res, '用户信息错误')
    }
  })
});

router.post('/signup', function (req, res, next) {
  const { logName, password } = req.body
  // 手机号是否被注册
  User.find({ phone: logName }, (err, doc) => {
    if (err) {
      errInfo(res, err.message)
      return
    } else if (doc.length > 0) { // 有注册信息
      errInfo(res, '该手机号已注册')
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
          errInfo(res, err.message)
        } else {
          // 添加distance初始化数据
          Distance.create({ userId: userDoc._id }, (err, doc) => {
            if (err) {
              errInfo(res, err.message)
              // TODO: Remove user Rollback?
            } else {
              resInfo(res, undefined, '注册成功，请登录')
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
      errInfo(res, err.message)
      return
    } else if (doc) { // 找到账号
      let content = { phone: logName, userId: doc._id }// 要生成token的主题信息
      // 这是加密的 key（密钥）
      let token = jwt.sign(content, privateKey, {
        expiresIn: 60 * 60 * 24 * 30 // 24 小时 * 30 天 过期 
      })
      resInfo(res, { token }, '登录成功')
      return
    } else { // 密码不正确
      errInfo(res, '手机号或密码错误')
    }
  })
})

const checkForm = (key, value) => {
  switch (key) {
    case 'realname':
      if (value.length > 6) {
        return '姓名不能多于6个字'
      }
      break;
    case 'nickname':
      if (value.length > 7) {
        return '昵称不能多于7个字'
      }
      break;
    case 'brief':
      if (value.length > 20) {
        return '个性签名不能多于20个字'
      }
      break;
    default:
      break;
  }
  return true
}

// 修改用户信息
router.put('/user/update', (req, res, next) => {
  const { key, value } = req.body
  console.log(key, value)
  // 检验表单合法性
  let checkInfo = checkForm(key, value);
  // 通过检测
  if (checkInfo === true) {
    User.findOneAndUpdate(
      {
        _id: req.userId
      },
      {
        $set: {
          [key]: value
        }
      },
      (err, doc) => {
        if (err) {
          errInfo(res, err.message)
          return
        } else { // 更新成功
          resInfo(res, undefined, "修改成功")
        }
      })
  } else { // 未通过检测
    errInfo(res, checkInfo);
  }
})

const updataUserAvatar = (req, res, avatarUrl) => {
  User.findOneAndUpdate(
    {
      _id: req.userId
    },
    {
      $set: {
        avatar: avatarUrl
      }
    },
    (err, doc) => {
      if (err) {
        errInfo(res, err.message)
        return
      } else { // 更新成功
        resInfo(res, undefined, '头像修改成功')
      }
    })
}

router.put('/user/avatar', (req, res, next) => {
  console.log(req.files);
  const avatar = req.files.avatar;
  const  avatarUrl = avatar.name;
  // 移动图片
  avatar.mv('../public/images/avatar/' + avatarUrl, function (err) {
    if (err) {
      errInfo(res, err);
    } else {
      // 更改用户avatar路径信息
      updataUserAvatar(req, res, avatarUrl)
    }
  })
})

module.exports = router;
