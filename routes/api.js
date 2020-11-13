const express = require('express')
const { data } = require('jquery')
const sqlite3 = require('sqlite3').verbose()
const router = express.Router()

let db = new sqlite3.Database('./database/db.sqlite')
let bl_sql = 'SELECT DISTINCT * FROM Bundesland ORDER BY Date'

db.all(bl_sql, [], (err, rows) => {
    if (err) {
        throw err;
    }
    let cases = {}
    let deaths = {}
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