const express = require('express')
const sqlite3 = require('sqlite3').verbose()
const router = express.Router()

const db = new sqlite3.Database('./database/db.sqlite')
const sql = 'SELECT * FROM Landkreis ORDER BY Date, Bundesland, Landkreis'

db.all(sql, [], (err, rows) => {
    if (err) {
        throw err
    }
    const data = {}
})

router.get('/data/:date?/:place?', function (req, res, next) {
    const dateParam = req.params.date
    if (dateParam === undefined) {
        res.json(data)
    } else {
        const blParam = req.params.bl
        if (dateParam.includes('_')) {
            startDate = new Date(dateParam.split('_')[0])
            endDate = dateParam.split('_')[1]
            if (endDate) {
                switch (endDate.split('-').length) {
                    case 1:
                        endDate = new Date(endDate, 12, 0)
                        break
                    case 2:
                        endDate = new Date(endDate.split('-')[0], endDate.split('-')[1] + 1, 0)
                        break
                    default:
                        endDate = new Date(endDate)
                        break
                }
            } else {
                endDate = new Date()
            }
            newData = {}
            for (const item in data) {
                if (new Date(item) >= startDate && new Date(item) <= endDate) {
                    newData[item] = data[item]
                }
            }
            if (blParam === undefined) {
                res.json(newData)
            } else {
                const lkParam = req.params.lk
                if (lkParam === undefined) {
                    const newDataBl = {}
                    for (const item in newData) {
                        newDataBl[item] = newData[item][blParam]
                    }
                    res.json(newDataBl)
                } else {
                    const newDataLk = {}
                    for (const item in newData) {
                        newDataLk[item] = newData[item][blParam][lkParam]
                    }
                    res.json(newDataLk)
                }
            }
        } else {
            if (blParam === undefined) {
                res.json(data[dateParam])
            } else {
                const lkParam = req.params.lk
                if (lkParam === undefined) {
                    res.json(data[dateParam][blParam])
                } else {
                    res.json(data[dateParam][blParam][lkParam])
                }
            }
        }
    }
})

module.exports = router
