var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/user', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', function(req, res, next) {
  const { logName, password } = req.body
  console.log('yes')
  res.json({
    code: 0,
    messege: '登录成功'
  });
});

module.exports = router;
