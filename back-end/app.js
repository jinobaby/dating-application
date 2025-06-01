var createError = require('http-errors');
const express = require('express');
var bodyParser = require('body-parser')
const path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose =require('mongoose')
const hbs = require('hbs'); // or require('express-handlebars') if you use that
var session = require('express-session')
var mongoStore = require('connect-mongo')

var app = express();

hbs.registerHelper('eq', function(a, b) {
  return a === b;
});

const fs = require('fs');
const uploadDir = path.join(__dirname, 'public/uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

//database connection
mongoose.connect('mongodb://127.0.0.1:27017/back-end-DatingSite').then(() => {
  console.log("Database Connected");
}).catch((error) => {
  console.log("Error from database", error);
  
})

//  session setup
app.use(
  session({
    secret: 'hbdfhfhbhf',
    resave: false,
    saveUninitialized: false,
    store: mongoStore.create({
      mongoUrl: 'mongodb://127.0.0.1:27017/back-end-DatingSite',
      collectionName: 'sessions',
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      httpOnly: true, // Prevent client-side access
      secure: false, // Set to true in production with HTTPS
      sameSite: 'strict', // Protect against CSRF
    }
  })
  )

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const userRouter = require('./routes/users');
const { error } = require('console');

app.use('/', userRouter)

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
