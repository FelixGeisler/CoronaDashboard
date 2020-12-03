const router = require('express').Router()

/* GET home page. */
router.get('/table', function (req, res, next) {
  res.render('table')
})

module.exports = router