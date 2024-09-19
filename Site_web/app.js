var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
//var geolib = require('geolib');

var indexRouter = require('./routes/index');
var signRouter = require('./routes/sign');
var loginRouter = require('./routes/login');
var mapRouter = require('./routes/map');
var settingRouter = require('./routes/setting');
var disconnectRouter = require('./routes/disconnect');
let removeRouter = require("./routes/remove");
var testRouter = require('./routes/test');
var recupRouter = require('./routes/recup');
var commandesRouter = require('./routes/commandes');
var qrGeneratorRouter = require("./routes/qrGenerator");
var qrViewerRouter = require("./routes/qrViewer");
var calculDistanceRouter = require('./routes/calculDistance'); //Test




var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'cle-secrette-?',
  resave: false,
  saveUninitialized: false,
}));

app.use('/', indexRouter);
app.use('/sign', signRouter);
app.use('/login', loginRouter);
app.use('/map', mapRouter);
app.use('/setting', settingRouter);
app.use('/disconnect',disconnectRouter);
app.use('/remove',removeRouter);
app.use('/recup',recupRouter);
app.use('/commandes',commandesRouter);
app.use('/calculDistance',calculDistanceRouter);
app.use('/qrGenerator',qrGeneratorRouter);
app.use('/qrViewer',qrViewerRouter);



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


module.exports = app;
