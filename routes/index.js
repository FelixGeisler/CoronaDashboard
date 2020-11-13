const express = require('express')
const { data } = require('jquery')
const router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Corona Dashboard'})
})

module.exports = router
