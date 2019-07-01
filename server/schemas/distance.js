let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

let distanceSchema = new Schema({
  // 用户ID
  userId: { type: ObjectId, ref: 'User', unique: true },
  // 累积公里数
  walking: {type: Double, default: 0.0},
  running: {type: Double, default: 0.0},
  riding: {type: Double, default: 0.0},
  driving: {type: Double, default: 0.0},
  bus: {type: Double, default: 0.0},
  taxi: {type: Double, default: 0.0},
});

module.exports = distanceSchema