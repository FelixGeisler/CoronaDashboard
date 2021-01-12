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
app.get('/api/:date?/:level1?/:level2?', require(path.join(__dirname, '/routes/api')))
app.get('/data/geo/level2/:level1/', require(path.join(__dirname, '/routes/data')))
app.get('/data/geo/level3/:level2?/', require(path.join(__dirname, '/routes/data')))
app.get('/data/corona/level3/:level3_id', require(path.join(__dirname, '/routes/data')))
app.get('/globe', require(path.join(__dirname, '/routes/globe')))
app.get('/table', require(path.join(__dirname, '/routes/table')))


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

database.runDB() //Just for DEBUG. TODO: Remove

cron.schedule('0 * * * *', function () {
  console.log('Running cron job...')
  database.runDB()
  // TODO: catch errors.
})

module.exports = app
