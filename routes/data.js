const express = require('express')
const sqlite3 = require('sqlite3').verbose()
const router = express.Router()

const db = new sqlite3.Database('./database/db.sqlite')
const sqlData = 'SELECT * FROM Data ORDER BY Date, Bundesland, Landkreis'
const sqlGeo = 'SELECT * FROM GEO'

let data = {'geo': {}}

db.all(sqlData, [], (err, rows) => {
    if (err) {
        throw err
    }
    const data = {}
})

db.all(sqlGeo, [], (err, rows) => {
    if (err) {
        throw err
    }
    for (let index = 0; index < rows.length; index++) {
        if (data.geo[rows[index].Bundesland] === undefined) {
            data.geo[rows[index].Bundesland] = [rows[index].Landkreis]
        } else {
            data.geo[rows[index].Bundesland].push(rows[index].Landkreis)
        }
    }
})

router.get('/data/:date/:place', function (req, res, next) {
    res.json(data)
})

module.exports = router
