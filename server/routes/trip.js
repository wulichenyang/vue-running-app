var express = require('express');
var router = express.Router();
let Distance = require('../models/distance')
let Trip = require('../models/trip')

// GET all distance
router.get('/distance', function (req, res, next) {
  Distance.find({ userId: req.userId }, { userId: 0, _id: 0, __v: 0 }, (err, doc) => {
    if (err) {
      res.status(500).send({
        code: 1,
        message: '获取里程信息失败'
      })
      return
    }
    if (doc.length > 0) {
      res.json({
        code: 0,
        data: {
          distance: doc[0]
        }
      })
      return
    } else {
      res.json({
        code: 1,
        message: '里程信息错误'
      })
    }
  })
});

const tripWayMap = {
  '步行': 'walking',
  '跑步': 'running',
  '骑行': 'riding',
  '驾车': 'driving',
  '公交': 'bus',
  '打车': 'taxi',
  '出租车': 'taxi',
  '单车/电车': 'riding',
  '公交/地铁': 'bus'
}

const addTripData = (req, res) => {
  const newTrip = req.body.tripData
  Trip.insertMany(
    {
      userId: req.userId,
      ...newTrip
    },
    (err, doc) => {
      if (err) { // Failed
        res.status(500).json({
          code: 1,
          message: err.message
        })
        return;
      } else {
        // Successful
        updateDistance(req, res)
      }
    }
  )
}

const updateDistance = (req, res) => {
  const { tripWay, distance } = req.body.tripData
  Distance.findOne(
    {
      userId: req.userId
    },
    (err, result) => {
      if (err) {
        res.status(500).json({
          code: 1,
          message: err.message
        })
        return;
      } else {
        // Update all distance data
        let tripWayCode = tripWayMap[tripWay]
        result[tripWayCode] = result[tripWayCode] + distance
        result.save((err, doc) => {
          if (err) { // Failed
            res.status(500).json({
              code: 1,
              message: err.message
            })
            return;
          } else {
            // Successful
            res.json({
              code: 0,
              message: "成功保存本次行程",
              // data: {
              //   newTrip: doc,
              //   oldDistance: raw
              // }
            })
          }
        })
      }
    }
  )
}

const updateAllDistance = (tripType, distance, req, res) => {
  Distance.findOne(
    {
      userId: req.userId
    },
    (err, result) => {
      if (err) {
        res.status(500).json({
          code: 1,
          message: err.message
        })
        return;
      } else {
        // Update all distance data
        let tripWayCode = tripWayMap[tripType]
        result[tripWayCode] = result[tripWayCode] + distance
        result.save((err, doc) => {
          if (err) { // Failed
            res.status(500).json({
              code: 1,
              message: err.message
            })
            return;
          } else {
            // Successful
          }
        })
      }
    }
  )
}

const addTrafficData = (req, res) => {
  const newTraffic = req.body.trafficData
  const { tripType, distance } = newTraffic
  updateAllDistance(tripType, distance, req, res)
  Trip.insertMany(
    {
      userId: req.userId,
      ...newTraffic
    },
    (err, doc) => {
      if (err) { // Failed
        res.status(500).json({
          code: 1,
          message: err.message
        })
        return;
      } else {
        // Successful
        res.send({
          code: 0,
          message: '保存成功',
        })
      }
    }
  )
}
// Add one tripData
router.post('/addTrip', (req, res, next) => {
  // Insert new trip data
  addTripData(req, res)
  // Update all distance data
})


// Add one trafficData
router.post('/addTraffic', (req, res, next) => {
  addTrafficData(req, res)
})

module.exports = router;
