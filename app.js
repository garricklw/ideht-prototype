var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
let locationRouter = require('./routes/locations');
let alertsRouter = require('./routes/alerts');

let app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/common')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/locations', locationRouter);
app.use('/alerts', alertsRouter);

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

module.exports = app;
