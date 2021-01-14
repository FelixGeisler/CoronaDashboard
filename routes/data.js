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

router.get('/data/line/level1/:level1_id', function (req, res, next) {
    var data = []
    union_sql = 'SELECT Date, sum(Cases) as Cases, sum(Deaths) as Deaths, sum(Population) AS Population FROM CoronaData INNER JOIN Level3 ON Level3.Level3_ID = CoronaData.Level3_ID INNER JOIN Level2 ON Level2.Level2_ID = Level3.Level2_ID WHERE Level2.Level1_ID = ' + req.params.level1_id + ' GROUP BY Level2.Level1_ID, Date ORDER BY Date;'
    db.all(union_sql, [], (err, union_rows) => {
        for (let index = 0; index < union_rows.length; index++) {
            data.push(union_rows[index])
        }
        res.json(data)
    })
})

router.get('/data/line/level2/:level2_id', function (req, res, next) {
    var data = []
    union_sql = 'SELECT Date, sum(Cases) as Cases, sum(Deaths) as Deaths, sum(Population) AS Population FROM CoronaData INNER JOIN Level3 ON Level3.Level3_ID = CoronaData.Level3_ID WHERE Level2_ID = ' + req.params.level2_id + ' GROUP BY Level2_ID, Date ORDER BY Date;'
    db.all(union_sql, [], (err, union_rows) => {
        for (let index = 0; index < union_rows.length; index++) {
            data.push(union_rows[index])
        }
        res.json(data)
    })
})

router.get('/data/line/level3/:level3_id', function (req, res, next) {
    var data = []
    sql = 'SELECT Date, Cases, Deaths, Population FROM CoronaData WHERE Level3_ID = ' + req.params.level3_id + ';'
    db.all(sql, [], (err, rows) => {
        for (let index = 0; index < rows.length; index++) {
            data.push(rows[index])
        }
        res.json(data)
    })
})

router.get('/data/bar/level1/:level1_id?', function (req, res, next) {
    var data = []
    var today = new Date().toLocaleString('en-CA').split(',')[0]
    union_sql = `SELECT Level1.Level1_ID AS ID, Level1_Abbr as Name, sum(Cases) as Cases, sum(Deaths) as Deaths, sum(Population) as Population FROM CoronaData INNER JOIN Level3 ON Level3.Level3_ID = CoronaData.Level3_ID INNER JOIN Level2 ON Level2.Level2_ID = Level3.Level2_ID INNER JOIN Level1 ON Level1.Level1_ID = Level2.Level1_ID WHERE Date = "${today}" GROUP BY Level1.Level1_ID ORDER BY SUM(Cases);`
    db.all(union_sql, [], (err, union_rows) => {
        for (let index = 0; index < union_rows.length; index++) {
            data.push(union_rows[index])
        }
        res.json(data)
    })
})

router.get('/data/bar/level2/:level2_id', function (req, res, next) {
    var data = []
    var today = new Date().toLocaleString('en-CA').split(',')[0]
    union_sql = `SELECT Level2.Level2_ID AS ID, Level2.Level2_Abbr AS Name, SUM(Cases) AS Cases, SUM(Deaths) AS Deaths, SUM(Population) AS Population FROM Level2 INNER JOIN Level3 ON Level2.Level2_ID = Level3.Level2_ID INNER JOIN CoronaData ON Level3.Level3_ID = CoronaData.Level3_ID WHERE Level1_ID = (SELECT Level1_ID FROM Level2 WHERE Level2_ID = "${req.params.level2_id}") AND Date = "${today}" GROUP BY Level2.Level2_ID ORDER BY SUM(Cases);`
    db.all(union_sql, [], (err, union_rows) => {
        for (let index = 0; index < union_rows.length; index++) {
            data.push(union_rows[index])
        }
        res.json(data)
    })
})

router.get('/data/bar/level3/:level3_id', function (req, res, next) {
    var data = []
    var today = new Date().toLocaleString('en-CA').split(',')[0]
    sql = `SELECT Level3.Level3_ID AS Name, Level3.Level3_ID AS ID, Cases, Deaths, Population FROM Level3 INNER JOIN CoronaData ON Level3.Level3_ID = CoronaData.Level3_ID  WHERE Level2_ID = (SELECT Level2_ID FROM Level3 WHERE Level3_ID = "${req.params.level3_id}") AND Date = "${today}" ORDER BY Cases;`
    db.all(sql, [], (err, rows) => {
        for (let index = 0; index < rows.length; index++) {
            data.push(rows[index])
        }
        res.json(data)
    })
})

router.get('/data/summary/level1/:level1_id', function (req, res, next) {
    var data = []
    var today = new Date().toLocaleString('en-CA').split(',')[0]
    var yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toLocaleString('en-CA').split(',')[0]
    sql = `SELECT Level1.Level1_Name AS Name, sum(Cases) as Cases, sum(Deaths) as Deaths, sum(Population) as Population, Date FROM CoronaData INNER JOIN Level3 ON Level3.Level3_ID = CoronaData.Level3_ID INNER JOIN Level2 ON Level2.Level2_ID = Level3.Level2_ID INNER JOIN Level1 ON Level1.Level1_ID = Level2.Level1_ID WHERE Level1.Level1_ID = ${req.params.level1_id} AND (Date = "${today}" OR Date = "${yesterday}") GROUP BY CoronaData.Date;`
    db.all(sql, [], (err, rows) => {
        for (let index = 0; index < rows.length; index++) {
            data.push(rows[index])
        }
        res.json(data)
    })
})

router.get('/data/summary/level2/:level2_id', function (req, res, next) {
    var data = []
    var today = new Date().toLocaleString('en-CA').split(',')[0]
    var yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toLocaleString('en-CA').split(',')[0]
    sql = `SELECT Level2.Level2_Name AS Name, sum(Cases) as Cases, sum(Deaths) as Deaths, sum(Population) as Population, Date FROM CoronaData INNER JOIN Level3 ON Level3.Level3_ID = CoronaData.Level3_ID INNER JOIN Level2 ON Level2.Level2_ID = Level3.Level2_ID WHERE Level2.Level2_ID = ${req.params.level2_id} AND (Date = "${today}" OR Date = "${yesterday}") GROUP BY CoronaData.Date;`
    db.all(sql, [], (err, rows) => {
        for (let index = 0; index < rows.length; index++) {
            data.push(rows[index])
        }
        res.json(data)
    })
})

router.get('/data/summary/level3/:level3_id', function (req, res, next) {
    var data = []
    var today = new Date().toLocaleString('en-CA').split(',')[0]
    var yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toLocaleString('en-CA').split(',')[0]
    sql = `SELECT Level3.Level3_Name AS Name, Cases, Deaths, Population, Date FROM CoronaData INNER JOIN Level3 ON Level3.Level3_ID = CoronaData.Level3_ID WHERE Level3.Level3_ID = ${req.params.level3_id} AND (Date = "${today}" OR Date = "${yesterday}") GROUP BY CoronaData.Date;`
    db.all(sql, [], (err, rows) => {
        for (let index = 0; index < rows.length; index++) {
            data.push(rows[index])
        }
        res.json(data)
    })
})

module.exports = router
