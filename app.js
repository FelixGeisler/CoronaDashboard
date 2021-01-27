const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const favicon = require('serve-favicon')
const cron = require('node-cron')
const database = require(path.join(__dirname, '/database/database.js'))

const router = require(path.join(__dirname, '/routes/index'))

const app = express()

// view engine setup
app.set('view engine', 'pug')

// Middleware
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')))

app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', router)

app.get('/data/geo/:level/:id?/', require(path.join(__dirname, '/routes/data')))
app.get('/data/line/:level/:id/:start/:stop/', require(path.join(__dirname, '/routes/data')))
app.get('/data/bar/:level/:id/:start/:stop/', require(path.join(__dirname, '/routes/data')))
app.get('/data/summary/:level/:id/:start/:stop/', require(path.join(__dirname, '/routes/data')))
app.get('/data/table/:level/:id/:start/:stop/', require(path.join(__dirname, '/routes/data')))

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

cron.schedule('0 * * * *', function () {
  console.log('Running cron job...')
  database.runDB()
})

module.exports = app
