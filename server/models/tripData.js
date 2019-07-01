let mongoose = require('mongoose');
let tripDataSchema = require('../schemas/tripData');

module.exports = mongoose.model('TripData', tripDataSchema);