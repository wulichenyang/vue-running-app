var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var jwtauth = require('./middleware/jwtauth');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var tripRouter = require('./routes/trip');
// const cors = require('cors')
var app = express();
var mongoose = require('mongoose');

const {
  user,
  pwd,
  database,
  apiPrefix,
  sessionConf,
  // corsConf,
} = require('./config')

// Connect to mongodb: database: runningTrip
mongoose.connect("mongodb://localhost:27017/runningTrip", { useNewUrlParser: true }, function (err) {
  if (err) {
    console.log('Connection Error:' + err)
  } else {
    console.log('Connection success!')
  }
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use(cors(corsConf))

// 身份验证
app.use(jwtauth)

app.use(indexRouter);
app.use(usersRouter);
app.use(tripRouter);
// Add api prefix
app.use(apiPrefix, indexRouter)
app.use(apiPrefix, usersRouter)
app.use(apiPrefix, tripRouter)
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
