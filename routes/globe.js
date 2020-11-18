const router = require('express').Router()

/* GET home page. */
router.get('/globe', function (req, res, next) {
  res.render('globe')
})

module.exports = router