const express = require('express')
const sqlite3 = require('sqlite3').verbose()
const router = express.Router()

const db = new sqlite3.Database('./database/db.sqlite')
const sqlData = 'SELECT * FROM Data ORDER BY Date, Bundesland, Landkreis'
const sqlGeo = 'SELECT * FROM GEO ORDER BY KRs'

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
        if (data.geo[rows[index].KrS.slice(0, 2)] === undefined) {
            data.geo[rows[index].KrS.slice(0, 2)] = {Level2: {}, Name: rows[index].Bundesland}
        }
        let name = rows[index].Landkreis
        if (rows[index].Prefix != 'LK') {
            name = rows[index].Landkreis + ' (' + rows[index].Prefix + ')'
        }
        data.geo[rows[index].KrS.slice(0, 2)].Level2[rows[index].KrS] = { Name:  name }
    }
})

router.get('/data/:date/:location', function (req, res, next) {
    let date_dict
    let level1_dict
    let level2_dict
    for (const item in data) {
        if (new Date(item) >= startDate && new Date(item) <= endDate) {
            date_dict[item] = data[item]
        }
    }
    for (const item in date_dict) {
        level1_dict[item] = date_dict[item][req.params.level1]
    }
    for (const item in date_dict) {
        level2_dict[item] = date_dict[item][req.params.level1][req.params.level2]
    }
    res.json(level2_dict)
})


module.exports = router
