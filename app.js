var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var cors=require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var mongo = require('./db');


var app = express();

// 解析请求体
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// 允许CORS
app.use(cors({
    // origin:['http://localhost'],  //指定接收的地址
    methods:['GET','POST'],  //指定接收的请求类型
    // alloweHeaders:['Content-Type','text/plain']  //指定header
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

  // connect mongoDB
  mongo.connectDb

module.exports = app;
