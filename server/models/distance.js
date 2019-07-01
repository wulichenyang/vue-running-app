let mongoose = require('mongoose');
let distanceSchema = require('../schemas/distance');

module.exports = mongoose.model('Distance', distanceSchema);