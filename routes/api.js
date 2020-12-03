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
    for (let index = 0; index < rows.length; index++) {   
      const landkreis = rows[index].Landkreis.toString().replace(/\s+/g, '')
      if (!(rows[index].Date in data)) {
        data[rows[index].Date] = {'All': { cases: 0, casesPer100k: 0, casesPerPopulation: 0, cases7Per100k: 0, cases7BlPer100k: 0, deaths: 0, deathRate: 0, inhabitants: 0 }}
        data[rows[index].Date][rows[index].Bundesland] = {'All': { cases: 0, casesPer100k: 0, casesPerPopulation: 0, cases7Per100k: 0, cases7BlPer100k: 0, deaths: 0, deathRate: 0, inhabitants: 0 }}
      } else {
        if (!(rows[index].Bundesland in data[rows[index].Date])) {
            data[rows[index].Date][rows[index].Bundesland] = {'All': { cases: 0, casesPer100k: 0, casesPerPopulation: 0, cases7Per100k: 0, cases7BlPer100k: 0, deaths: 0, deathRate: 0, inhabitants: 0 }}
        } else {
            if (!(rows[index].Landkreis in data[rows[index].Date][rows[index].Bundesland])) {
            }
        }
      }
      const date = data[rows[index].Date]
      const bundesland = date[rows[index].Bundesland]
      bundesland[landkreis] = {}
      bundesland[landkreis]['cases'] = rows[index].Cases
      bundesland[landkreis]['casesPer100k'] = rows[index].CasesPer100k
      bundesland[landkreis]['casesPerPopulation'] = rows[index].CasesPerPopulation
      bundesland[landkreis]['cases7Per100k'] = rows[index].Cases7Per100k
      bundesland[landkreis]['cases7BlPer100k'] = rows[index].Cases7BlPer100k
      bundesland[landkreis]['deaths'] = rows[index].Deaths
      bundesland[landkreis]['deathRate'] = rows[index].DeathRate
      bundesland[landkreis]['inhabitants'] = rows[index].Inhabitants
      date.All.cases += rows[index].Cases
      date.All.deaths += rows[index].Deaths
      date.All.inhabitants += rows[index].Inhabitants
      date.All.casesPerPopulation = date.All.cases / date.All.inhabitants * 100
      date.All.casesPer100k = date.All.casesPerPopulation * 1000
      bundesland.All.cases += rows[index].Cases
      bundesland.All.deaths += rows[index].Deaths
      bundesland.All.inhabitants += rows[index].Inhabitants
      bundesland.All.casesPerPopulation = bundesland.All.cases / bundesland.All.inhabitants * 100
      bundesland.All.casesPer100k = bundesland.All.casesPerPopulation * 1000 
    }

    router.get('/api/:date?/:bl?/:lk?', function (req, res, next) {
        const dateParam = req.params.date
        if (dateParam === undefined) {
            res.json(data)
        } else {
            const blParam = req.params.bl
            if (dateParam.includes('_')) {
                startDate = dateParam.split('_')[0]
                if (startDate) {
                    startDate = new Date(startDate)
                } else {
                    startDate = new Date()
                    startDate.setHours(1, 0, 0, 0)
                }
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
                    endDate.setHours(1, 0, 0, 0)                                                                        // Range, but no endDate given -> endDate = today()
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
})

module.exports = router
