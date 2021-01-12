const express = require('express')
const { data } = require('jquery')
const sqlite3 = require('sqlite3').verbose()
const router = express.Router()

const db = new sqlite3.Database('./database/db.sqlite')

router.get('/data/geo/level2/:level1/', function (req, res, next) {
    var data = {}
    sqlString = 'SELECT Level2_ID, Level2_Name FROM Level2 WHERE Level1_ID = ' + req.params.level1 + ' ORDER BY Level2_Name;'
    db.all(sqlString, [], (err, rows) => {
        for (let index = 0; index < rows.length; index++) {
            data[rows[index].Level2_ID] = rows[index].Level2_Name
        }
        res.json(data)
    })
})

router.get('/data/corona/level3/:level3_id', function (req, res, next) {
    var data = []
    sql = 'SELECT Date, Cases FROM CoronaData WHERE Level3_ID = ' + req.params.level3_id + ';'
    db.all(sql, [], (err, rows) => {
        for (let index = 0; index < rows.length; index++) {
            data.push(rows[index])
        }
        res.json(data)
    })
})

router.get('/data/geo/level3/:level2?/', function (req, res, next) {
    var data = {}
    if (req.params.level2 != undefined) {
        level2_sql = 'SELECT Level2_Name FROM Level2 WHERE Level2_ID = ' + req.params.level2 + ' ORDER BY Level2_Name;'
        db.all(level2_sql, [], (err, level2_rows) => {
            data[level2_rows[0].Level2_Name] = {}
            level3_sql = 'SELECT Level3_ID, Level3_Name, Level3_Prefix FROM Level3 WHERE Level2_ID = ' + req.params.level2 + ' ORDER BY Level3_Name;'
            db.all(level3_sql, [], (err, level3_rows) => {
                for (let index = 0; index < level3_rows.length; index++) {
                    if (level3_rows[index].Level3_Prefix != 'LK' && level3_rows[index].Level3_Prefix != 'Bezirk') {
                        data[level2_rows[0].Level2_Name][level3_rows[index].Level3_ID] = level3_rows[index].Level3_Prefix + ' ' + level3_rows[index].Level3_Name
                    } else {
                        data[level2_rows[0].Level2_Name][level3_rows[index].Level3_ID] = level3_rows[index].Level3_Name
                    }
                }
                res.json(data)
            })
        })   
    } else {
        level3_sql = 'SELECT Level3_ID, Level3_Name, Level3_Prefix FROM Level3;'
        db.all(level3_sql, [], (err, level3_rows) => {
            for (let index = 0; index < level3_rows.length; index++) {
                if (level3_rows[index].Level3_Prefix != 'LK' && level3_rows[index].Level3_Prefix != 'Bezirk') {
                    data[level3_rows[index].Level3_ID] = level3_rows[index].Level3_Prefix + ' ' + level3_rows[index].Level3_Name
                } else {
                    data[level3_rows[index].Level3_ID] = level3_rows[index].Level3_Name
                }
            }
            res.json(data)
        })
    }
})

module.exports = router
