const express = require('express')
const { data } = require('jquery')
const sqlite3 = require('sqlite3').verbose()
const router = express.Router()

var startDate
var endDate

router.get('/api/:date?/:level1?/:level2?', function (req, res, next) {

    const db = new sqlite3.Database('./database/db.sqlite')
    const sql = 'SELECT * FROM Data ORDER BY Date, Bundesland, Landkreis'
    
    let data = {}

    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err
        }
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

        let date_dict = {}
        let level1_dict = {}
        let level2_dict = {}
        if (req.params.date !== undefined) {
            getDate(req.params.date)
            for (const item in data) {
                if (new Date(item) >= startDate && new Date(item) <= endDate) {
                    date_dict[item] = data[item]
                }
            }
            if (req.params.level1 !== undefined) {
                for (const item in date_dict) {
                    level1_dict[item] = date_dict[item][req.params.level1]
                }
                if (req.params.level2 !== undefined) {
                    for (const item in date_dict) {
                        level2_dict[item] = date_dict[item][req.params.level1][req.params.level2]
                    }
                    data = level2_dict
                } else {
                    data = level1_dict
                }
            } else {
                data = date_dict
            }
        }
        res.json(data)
    })
})


function getDate(date) {
    if (date.includes('_')) {
        if (date == '_') {
            startDate = new Date(new Date().setHours(1, 0, 0, 0))
        } else {
            startDate = new Date(Date.parse(date.split('_')[0]))
        }
        endDateList = date.split('_')[1].split('-')
        if (endDateList[0] == '') {
            endDate = new Date(new Date().setHours(1, 0, 0, 0))
        } else {
            switch (endDateList.length) {
                case 1:
                    endDate = new Date(endDateList[0], 12, 0)
                    break
                case 2:
                    endDate = new Date(endDateList[0], endDateList[1], 0)
                    break
                case 3:
                    endDate = new Date(endDateList[0], (parseInt(endDateList[1]) - 1), endDateList[2])
                    break
                default:
                    break
            }
        }
        endDate = new Date(endDate.setHours(1, 0, 0, 0))
    } else {
        startDate = new Date(Date.parse(date))
        endDate = startDate
    }
}

module.exports = router
