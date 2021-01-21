const express = require('express')
const sqlite3 = require('sqlite3').verbose()
const router = express.Router()

const db = new sqlite3.Database('./database/db.sqlite')

router.get('/data/geo/:level/:id?/', function (req, res, next) {
    // Returns all children of given Region.
    // e.g. level = 2 (State), id = 1. Returns all districts of State with ID=1.

    var data = []
    var sqlString
    switch (req.params.level) {
        case '0':
            // level = 0 -> Return all Countries. (ID does not matter)
            sqlString = `SELECT Level1_ID AS ID, Level1_Name AS Name FROM Level1 ORDER BY Level1_Name;`
            break
        case '1':
            if (req.params.id === undefined) {
                // level = 1, no ID -> Return all States 
                sqlString = `SELECT Level2_ID AS ID, Level2_Name AS Name FROM Level2 ORDER BY Level2_Name;`
            } else {
                // level = 1, with ID -> Return all States where Country.ID = ID.
                sqlString = `SELECT Level2_ID AS ID, Level2_Name AS Name FROM Level2 WHERE Level1_ID = ${req.params.id} ORDER BY Level2_Name;`
            }
            break
        case '2':
            if (req.params.id === undefined) {
                // level = 2, no ID -> Return all Districts 
                sqlString = `SELECT Level3_ID AS ID, Level3_Name AS Name, Level3_Prefix AS Prefix FROM Level3 ORDER BY Level3_Name;`
            } else {
                // level = 2, with ID -> Return all Districts where District.ID = ID.
                sqlString = `SELECT Level3_ID AS ID, Level3_Name AS Name, Level3_Prefix AS Prefix FROM Level3 WHERE Level2_ID = ${req.params.id} ORDER BY Level3_Name;`
            }
            break
        default:
            res.render('error', { message: 'Invalid level:', error: { status: `${req.params.level} is not a valid level. The level variable describes the administrative level of a region. It should be 0 (World), 1 (Countries) or 2 (States).` } })
            return
    }
    db.all(sqlString, [], (err, rows) => {
        if (err) {
            res.render('error', { error: err })
            return
        }
        for (let index = 0; index < rows.length; index++) {
            data.push(rows[index])
        }
        res.json(data)
        return
    })
})

router.get('/data/line/:level/:id/:start/:stop', function (req, res, next) {
    // Returns the data for the line chart

    var data = []
    var sqlString

    switch (req.params.level) {
        case '0':
            sqlString = `SELECT Date, Sum(Cases) AS Cases, Sum(Deaths) AS Deaths FROM CoronaData WHERE Date >= "${req.params.start}" AND Date <= "${req.params.stop}" GROUP BY Date ORDER BY Date;`
            break
        case '1':
            sqlString = `SELECT Date, SUM(Cases) AS Cases, SUM(Deaths) AS Deaths FROM CoronaData INNER JOIN Level3 ON CoronaData.Level3_ID = Level3.Level3_ID INNER JOIN Level2 ON Level3.Level2_ID = Level2.Level2_ID WHERE Date >= "${req.params.start}" AND Date <= "${req.params.stop}" AND Level2.Level1_ID = ${req.params.id} GROUP BY Date, Level2.Level1_ID ORDER BY Date;`
            break
        case '2':
            sqlString = `SELECT Date, SUM(Cases) AS Cases, SUM(Deaths) AS Deaths FROM CoronaData INNER JOIN Level3 ON CoronaData.Level3_ID = Level3.Level3_ID WHERE Date >= "${req.params.start}" AND Date <= "${req.params.stop}" AND Level3.Level2_ID = "${req.params.id}" GROUP BY Date, Level3.Level2_ID ORDER BY Date;`
            break
        case '3':
            sqlString = `SELECT Date, SUM(Cases) AS Cases, SUM(Deaths) AS Deaths FROM CoronaData WHERE Date >= "${req.params.start}" AND Date <= "${req.params.stop}" AND CoronaData.Level3_ID = "${req.params.id}" GROUP BY Date, CoronaData.Level3_ID ORDER BY Date;`
            break
        default:
            res.render('error', { message: 'Invalid level:', error: { status: `${req.params.level} is not a valid level. The level variable describes the administrative level of a region. It should be 0 (World), 1 (Countries) or 2 (States).` } })
            return
    }
    db.all(sqlString, [], (err, rows) => {
        if (err) {
            res.render('error', { error: err })
            return
        }
        for (let index = 0; index < rows.length; index++) {
            data.push(rows[index])
        }
        res.json(data)
        return
    })
})

router.get('/data/bar/:level/:id/:start/:stop/', function (req, res, next) {

    // Returns the BarChart data for 'date' (if there is no data available -> return latest available date before 'date').
    // HINT: id ist id of the level above the give leven. level=2 (State) -> id is the countryID. Shows level2 data of level1 with given id.
    var today = new Date()
    var start
    var stop
    var data = []
    var sqlString

    if (req.params.start < '2020-01-01') {
        start = '2020-01-01'
    } else {
        start = req.params.start
    }
    if (req.params.stop > today.toLocaleDateString('en-CA')) {
        stop = today.toLocaleDateString('en-CA')
    } else {
        stop = req.params.stop
    }

    switch (req.params.level) {
        case '1':
            sqlString = `SELECT Date, SUM(Cases) AS Cases, SUM(Deaths) AS Deaths, SUM(Population) AS Population, Level1.Level1_Abbr AS Name, Level1.Level1_ID AS ID FROM CoronaData INNER JOIN Level3 ON CoronaData.Level3_ID = Level3.Level3_ID INNER JOIN Level2 ON Level3.Level2_ID = Level2.Level2_ID INNER JOIN Level1 ON Level2.Level1_ID = Level1.Level1_ID WHERE Date = "${start}" OR Date = "${stop}" GROUP BY Date, Level1.Level1_ID;`
            break
        case '2':
            sqlString = `SELECT Date, SUM(Cases) AS Cases, SUM(Deaths) AS Deaths, SUM(Population) AS Population, Level2.Level2_Abbr AS Name, Level2.Level2_ID AS ID FROM CoronaData INNER JOIN Level3 ON CoronaData.Level3_ID = Level3.Level3_ID INNER JOIN Level2 ON Level3.Level2_ID = Level2.Level2_ID WHERE Date = "${start}" OR Date = "${stop}" GROUP BY Date, Level2.Level2_ID;`
            break
        case '3':
            sqlString = `SELECT * FROM (SELECT Date, Cases, Deaths, Population, Level3_Name AS Name FROM CoronaData INNER JOIN Level3 ON CoronaData.Level3_ID = Level3.Level3_ID WHERE Date >= "${req.params.start}" AND Level3.Level2_ID = ${req.params.id} ORDER BY Date ASC LIMIT ${count[0].Regions}) UNION SELECT * FROM (SELECT Date, Cases, Deaths, Population, Level3_Name AS Name FROM CoronaData INNER JOIN Level3 ON CoronaData.Level3_ID = Level3.Level3_ID WHERE Date <= "${req.params.stop}" AND Level3.Level2_ID = ${req.params.id} ORDER BY Date DESC LIMIT ${count[0].Regions});`
            break
        default:
            res.render('error', { message: 'Invalid level:', error: { status: `${req.params.level} is not a valid level. The level variable describes the administrative level of a region. It should be 0 (World), 1 (Countries) or 2 (States).` } })
            return
    }
    db.all(sqlString, [], (err, rows) => {
        if (err) {
            res.render('error', { error: err })
            return
        }
        if (rows.length === 1) { rows[1] = rows[0]}
        for (let index = 0; index < (rows.length / 2); index++) {
            data.push({ Name: rows[index].Name, Cases: rows[rows.length / 2 + index].Cases - rows[index].Cases, Deaths: rows[rows.length / 2 + index].Deaths - rows[index].Deaths })
        }
        res.json(data)
        return
    })
})

router.get('/data/summary/:level/:id/:start/:stop/', function (req, res, next) {

    // Returns the summary data for 'date' (if there is no data available -> return latest available data before 'date').

    var data = []
    var sqlString

    switch (req.params.level) {
        case '1':
            sqlString = `SELECT Date, SUM(Cases) AS Cases, SUM(Deaths) AS Deaths, SUM(Population) AS Population, Level1.Level1_ID, Level1.Level1_Name AS Name FROM CoronaData INNER JOIN Level3 ON CoronaData.Level3_ID = Level3.Level3_ID INNER JOIN Level2 ON Level3.Level2_ID = Level2.Level2_ID INNER JOIN Level1 ON Level2.Level1_ID = Level1.Level1_ID WHERE Level1.Level1_ID = ${req.params.id} AND (Date = "${req.params.start}" OR Date = "${req.params.stop}") GROUP BY Date, Level1.Level1_ID;`
            break
        case '2':
            sqlString = `SELECT Date, SUM(Cases) AS Cases, SUM(Deaths) AS Deaths, SUM(Population) AS Population, Level2.Level2_ID, Level2.Level2_Name AS Name FROM CoronaData INNER JOIN Level3 ON CoronaData.Level3_ID = Level3.Level3_ID INNER JOIN Level2 ON Level3.Level2_ID = Level2.Level2_ID WHERE Level2.Level2_ID = ${req.params.id} AND (Date = "${req.params.start}" OR Date = "${req.params.stop}") GROUP BY Date, Level2.Level2_ID;`
            break
        case '3':
            sqlString = `SELECT Date, Cases, Deaths, Population, Level3_Name AS Name FROM CoronaData INNER JOIN Level3 ON CoronaData.Level3_ID = Level3.Level3_ID WHERE Level3.Level3_ID = ${req.params.id} AND (Date = "${req.params.start}" OR Date = "${req.params.stop}");`
            break
        default:
            res.render('error', { message: 'Invalid level:', error: { status: `${req.params.level} is not a valid level. The level variable describes the administrative level of a region. It should be 0 (World), 1 (Countries) or 2 (States).` } })
            break
    }
    db.all(sqlString, [], (err, rows) => {
        if (err) {
            res.render('error', { error: err })
        }
        for (let index = 0; index < rows.length; index++) {
            data.push(rows[index])
        }
        res.json(data)
    })
})


module.exports = router
