var express = require('express');
var router = express.Router();
let User = require('../models/user')
let Distance = require('../models/distance')
let jwt = require('jsonwebtoken')
const fs = require('fs')

const {
  privateKey
} = require('../config')

const {
  errInfo,
  resInfo
} = require('./utils')

// const avatarPath = process.env.NODE_ENV === 'dev' ?
//   '../public/img/avatar/' : process.env.NODE_ENV === 'production' ?
//   'public/images/avatar/' : '../public/img/avatar';

/* GET userinfo. */
router.get('/user', function (req, res, next) {
  User.find({
    phone: req.phone
  }, {
    password: 0,
    role: 0,
    __v: 0,
    _id: 0
  }, (err, doc) => {
    if (err) {
      errInfo(res, '获取用户信息失败')
      return
    }
    if (doc.length > 0) {
      resInfo(res, {
        user: doc[0]
      })
      return
    } else {
      errInfo(res, '用户信息错误')
    }
  })
});

router.post('/signup', function (req, res, next) {
  const {
    logName,
    password
  } = req.body
  // 手机号是否被注册
  User.find({
    phone: logName
  }, (err, doc) => {
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
      User.create({
        phone: logName,
        password,
        role
      }, (err, userDoc) => {
        if (err) {
          errInfo(res, err.message)
        } else {
          // 添加distance初始化数据
          Distance.create({
            userId: userDoc._id
          }, (err, doc) => {
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
  const {
    logName,
    password
  } = req.body

  // Check user
  User.findOne({
    phone: logName,
    password
  }, (err, doc) => {
    if (err) {
      errInfo(res, err.message)
      return
    } else if (doc) { // 找到账号
      let content = {
        phone: logName,
        userId: doc._id
      } // 要生成token的主题信息
      // 这是加密的 key（密钥）
      let token = jwt.sign(content, privateKey, {
        expiresIn: 60 * 60 * 24 * 30 // 24 小时 * 30 天 过期 
      })
      resInfo(res, {
        token
      }, '登录成功')
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
  const {
    key,
    value
  } = req.body
  console.log(key, value)
  // 检验表单合法性
  let checkInfo = checkForm(key, value);
  // 通过检测
  if (checkInfo === true) {
    User.findOneAndUpdate({
        _id: req.userId
      }, {
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

const removePrevAvatar = (avatarName) => {
  fs.unlinkSync(`public/images/avatar/${avatarName}`)
  // console.log('in removePreAvatar')
  // // Dev: fs.unlink(avatarPath + avatarName, (err) => {
  // // Product: avatar.mv('public/images/avatar/' + avatarName, function (err) {
  // let res = await new Promise((r, f) => {
  //   try {
  //     fs.unlink(`public/images/avatar/${avatarName}`, function (err) {
  //       if (err) {
  //         console.log('删除头像失败', err)
  //         r(false)
  //       }
  //       console.log('删除' + avatarName + '成功')
  //       r(true)
  //     })
  //   } catch (error) {
  //     console.log('删除头像失败', error)
  //     r(false);
  //   }
  // })

  // if (res === true) {
  //   return true
  // } else {
  //   return false
  // }

}

const updateUserAvatar = async (req, res, avatarUrl) => {
  console.log('in update, avatarUrl: ', avatarUrl)
  try {
    console.log('in update Promise')
    let doc = await User.findOneAndUpdate({
      _id: req.userId
    }, {
      avatar: avatarUrl
    })
    
    if (doc) {
      console.log('update success: doc.avatar: ', doc.avatar)
      // removePrevAvatar(doc.avatar)
      console.log('ok')
      return true
    }
  } catch (error) {
    console.error(error)
    return false
  }

}

router.put('/user/avatar', async (req, res, next) => {
  console.log(req.files);
  const avatar = req.files.avatar;
  const avatarUrl = avatar.name;
  // 移动图片
  // Product： 自动在server的根目录找
  // avatar.mv('public/images/avatar/' + avatarUrl, function (err) {
  // Dev：存储在前端public下 ../public/img/avatar/

  // Dev: avatar.mv(avatarPath + avatarUrl, function (err) {
  // 注意：这里是一个异步操作，未返回时可能导致服务器提前返回502，需要用Promise处理
  let ifSuccess = await new Promise((r, f) => {
    try {
      avatar.mv('public/images/avatar/' + avatarUrl, async function (err) {
        if (err) {
          f(err.message)
        } else {
          // 更改用户avatar路径信息
          try {
            let ifUpdated = await updateUserAvatar(req, res, avatarUrl)
            if (ifUpdated === true) {
              r(true)
            } else {
              f('更新头像失败')
            }
          } catch (error) {
            f(error)
          }
        }
      })
    } catch (error) {
      errInfo(res, error);
    }
  })

  if (ifSuccess === true) {
    resInfo(res, undefined, '头像修改成功')
  } else {
    errInfo(res, '头像修改失败')
  }
})

// 检查当前password是否正确
router.put('/user/checkPrevPassword', (req, res, next) => {
  const {
    password
  } = req.body
  console.log('check password', password)
  User.find({
    _id: req.userId,
    password
  }, (err, doc) => {
    if (err) {
      errInfo(res, err.message)
      return
    } else if (doc.length > 0) { // 密码正确
      resInfo(res, undefined, '密码正确')
      return
    } else {
      errInfo(res, '旧密码不正确')
    }
  })
})


module.exports = router;