var express = require('express');
var router = express.Router();
let Distance = require('../models/distance')
let Trip = require('../models/trip')

// GET all distance
router.get('/distance', function (req, res, next) {
  Distance.find({ userId: req.userId }, { userId: 0 }, (err, doc) => {
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
  '打车': 'taxi'
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
  console.log(distance)
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
        console.log(result)
        // Update all distance data
        let tripWayCode = tripWayMap[tripWay]
        console.log('code', tripWayCode)
        console.log('distance: ', result[tripWayCode] + distance)
        result[tripWayCode] = result[tripWayCode] + distance
        result.save((err, doc) => {
          if (err) { // Failed
            console.log('err')
            res.status(500).json({
              code: 1,
              message: err.message
            })
            return;
          } else {
            console.log('else2')
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

// Post one tripData
router.post('/addTripData', (req, res, next) => {
  // Insert new trip data
  addTripData(req, res)
  // Update all distance data
})

module.exports = router;
