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
var server = require('http').Server(app);
var io = require('socket.io')(server);

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
  res.io = io;
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// io.on('connection', (socket) => {
//   console.log('Socket connection established');
//   socket.on('disconnect', () => {
//     console.log('Disconnected')
//   });
// });

module.exports = app;
