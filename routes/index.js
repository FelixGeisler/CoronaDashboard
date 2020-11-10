let express = require('express')
let router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Corona Dashboard' })
})

module.exports = router
