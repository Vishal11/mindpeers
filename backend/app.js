var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var mongodb = require('./db/mongodb');
require('dotenv').config();
var app = express();
var multer = require("multer");


// var storage = multer.diskStorage({
//   destination: function (request, file, callback) {
//       callback(null, './uploads/');
//   },
//   filename: function (request, file, callback) {
//       console.log(file);
//       callback(null, file.originalname)
//   }
// });

//var upload = multer({ storage: storage });

app.set('view engine', 'jade');
app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
 

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

 

app.use('/api/user', usersRouter);


// app.post('/api/uploadImage', upload.single('file'), function(req, res) {
//   console.log("ere")
//   console.log(req.file);
// });


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
