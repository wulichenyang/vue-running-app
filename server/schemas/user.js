let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let userSchema = new Schema({
  // 手机号，唯一，用作登录
  phone: {type: String, unique: true},
  // 密码
  password: String,
  // 用户的昵称
  nickname: {type: String, default: '昵称跑啦'},
  // 角色 ['admin', 'user']
  role: { type: String, default: 'user' }, 
  // 真实姓名 仅作为资料
  realname: {type: String, default: '用户名'},
  // 性别 0女 \ 1男 \ 2保密
  gender: { type: Number, default: 2},
  // 生日
  birth: { type: Date, default: Date.now()},
  // 头像
  avatar: { type: String, default: '' },
  // 地址
  address: {type: String, default: '未填写'},
  // 个性签名，70个字符限制
  brief: { type: String, default: '编辑签名，展示我的独特态度' },
  // // 邮箱号
  // email: { type: String, default: '' },
});

module.exports = userSchema