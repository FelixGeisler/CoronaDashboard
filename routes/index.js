var express = require('express')
var router = express.Router()
var db = require('../public/javascripts/database.js')
var https = require('https')
var dataBl

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' })
})

/* Get data from api */
router.get('/api/bundesland', (req, res, next) => {
  https.get('https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/Coronafälle_in_den_Bundesländern/FeatureServer/0/query?where=1%3D1&outFields=LAN_ew_GEN&returnGeometry=false&outSR=4326&f=json', (resp) => {
    let data = ''

    // A chunk of data has been received.
    resp.on('data', (chunk) => {
      data += chunk
    })

    // The whole response has been received.
    resp.on('end', () => {
      dataBl = JSON.parse(data).features
      for (let i = 0; i < dataBl.length; i++) {
        var sql = ('INSERT INTO corona (Bundesland) VALUES (?)')
        var params = [dataBl[i].attributes.LAN_ew_GEN]
        db.run(sql, params, function (err, result) { 
          if (err) {
            return console.log(err.message)
          }
        })
      }
    })
  }).on('error', (err) => {
    console.log('Error: ' + err.message)
  })
  res.end(JSON.stringify(dataBl))
})

module.exports = router
