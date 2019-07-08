var express = require('express');
var router = express.Router();
let Distance = require('../models/distance')

/* GET distance */
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

module.exports = router;
