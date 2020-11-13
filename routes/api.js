const express = require('express')
const sqlite3 = require('sqlite3').verbose()
const router = express.Router()

const db = new sqlite3.Database('./database/db.sqlite')
const sqlBl = 'SELECT DISTINCT * FROM Bundesland ORDER BY Date'

db.all(sqlBl, [], (err, rows) => {
  if (err) {
    throw err
  }
  const cases = {}
  const deaths = {}
  for (let index = 0; index < rows.length; index++) {
    if (rows[index].Date in cases) {
      cases[rows[index].Date] += rows[index].Cases
      deaths[rows[index].Date] += rows[index].Deaths
    } else {
      cases[rows[index].Date] = rows[index].Cases
      deaths[rows[index].Date] = rows[index].Deaths
    }
  }
  router.get('/api', function (req, res, next) {
    res.json({ cases: cases, deaths: deaths })
  })
})

module.exports = router
