let mongoose = require('mongoose');
let tripSchema = require('../schemas/trip');

module.exports = mongoose.model('Trip', tripSchema);