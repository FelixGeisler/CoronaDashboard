const express = require('express')
const sqlite3 = require('sqlite3').verbose()
const router = express.Router()

const db = new sqlite3.Database('./database/db.sqlite')
const geoSql = 'SELECT * FROM Geo ORDER BY Landkreis'
const casesSql = 'SELECT Date, Landkreis, Cases FROM Landkreis ORDER BY Date, Landkreis'

db.all(geoSql, [], (err, geoRows) => {
    if (err) {
        throw err
    } else {
        const data = []
        let landkreis = {}
        db.all(casesSql, [], (err, casesRows) => {
            if (err) {
                console.log('Error: ' + err)
                throw err
            } else {
                for (let index = 0; index < casesRows.length; index++) {
                    landkreis[casesRows[index].Landkreis] = [casesRows[index].Cases, casesRows[index].Date]
                }
            }
            for (let index = 0; index < geoRows.length; index++) {   
                /*data.push([landkreis[geoRows[index]][1], []])
                data[0][1].push(geoRows[index].Latitude)
                data[0][1].push(geoRows[index].Longitude)
                data[0][1].push(landkreis[rows[index].Landkreis])*/
            }
        })
    
        router.get('/geo', function (req, res, next) {
            res.json(data)
        })
    }
})

module.exports = router
