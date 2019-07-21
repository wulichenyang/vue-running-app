let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
require('mongoose-double')(mongoose);
const Double = mongoose.Schema.Types.Double;

let tripSchema = new Schema({
  // 用户id
  userId: { type: ObjectId, ref: 'User' },
  // 出行类型 trip / traffic
  type: { type: String },
  // 具体出行方式 步行/跑步/骑行/驾车/公交/打车
  tripWay: { type: String, enum:['步行', '跑步', '骑行', '驾车', '公交', '打车', '公交/地铁', '出租车', '单车/电车']},
  // 此次出行公里数
  distance: { type: Double },
  // 出行时间
  date: { type: Date },
  // 出行耗时
  time: { type: String },
  // 轨迹 [[10, 20], [20, 340], ...]
  trajectory: { type: Array, default: []},
  // 消耗的卡路里
  calorie: { type: Double , default: 0.0},
  // 速度
  speed: { type: Double, default: 0.0 },
  // 出行耗费
  price: { type: Double, default: 0.0},
  // 起始地点 西二旗智学苑'
  startPlace: { type: String, default: ''},
  // 结束地点 '五道口(地铁站)'
  endPlace: { type: String, default: ''},
  // 起始经纬坐标 '116.306295,40.053034'
  startCode: { type: String, default: ''},
  // 结束经纬坐标 '116.231204,40.22066'
  endCode: { type: String, default: ''},
  // 备注
  mark: { type: String, default: '无备注' },

});

module.exports = tripSchema