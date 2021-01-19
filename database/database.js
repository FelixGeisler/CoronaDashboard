const sqlite3 = require('sqlite3').verbose()
const https = require('https')


module.exports = {
  runDB: function runDB() {
    let db = new sqlite3.Database('database/db.sqlite', (err) => {
      if (err) {
        // Cannot open database
        console.error(err.message)
        throw err
      } else {
        // Opened successfully
        console.log('Connected to the SQLite database.')

        // Update db Data
        https.get('https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=1%3D1&outFields=OBJECTID,SN_V1,EWZ,cases,deaths&returnGeometry=false&orderByFields=OBJECTID&outSR=&f=json', (resp) => {
          let data = ''
          console.log('Status Code: ' + resp.statusCode)

          // A chunk of data has been received.
          resp.on('data', (chunk) => {
            data += chunk
          })

          // The whole response has been received.
          resp.on('end', () => {
            const dataLk = JSON.parse(data).features
            for (let i = 0; i < dataLk.length; i++) {
              db.run('REPLACE INTO CoronaData (Date, Level3_ID, Cases, Deaths, Population) VALUES(?, ?, ?, ?, ?)',
                [
                  new Date().toISOString().slice(0, 10),
                  dataLk[i].attributes.OBJECTID,
                  dataLk[i].attributes.cases,
                  dataLk[i].attributes.deaths,
                  dataLk[i].attributes.EWZ
                ], function (err) {
                  if (err) {
                    return console.log(err.message)
                  }
                  console.log(dataLk[i].attributes.OBJECTID + ' has been inserted')
                })
            }
          })
        }).on('error', (err) => {
          console.log('Error: ' + err.message)
        })
      }
    })
  },

  addData: function addData(db, rkiID, level3ID) {

    // Opened successfully
    console.log('Connected to the SQLite database.')

    // Update db Data
    https.get(`https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?where=IdLandkreis%20%3D%20%27${rkiID}%27&outFields=AnzahlFall,AnzahlTodesfall,Meldedatum,IdLandkreis&returnGeometry=false&orderByFields=Meldedatum%20ASC&outSR=&f=json`, (resp) => {
      var data = ''
      console.log('Status Code: ' + resp.statusCode)

      // A chunk of data has been received.
      resp.on('data', (chunk) => {
        data += chunk
      })

      coronaData = {}

      // The whole response has been received.
      resp.on('end', () => {
        var dataLk = JSON.parse(data).features
        dataLk.sort(function (a, b) { return a.attributes.Meldedatum > b.attributes.Meldedatum ? 1 : -1 })
        var cases = 0
        var deaths = 0
        var startDate = new Date("2020-01-01")
        var stopDate = new Date("2021-01-18")

        for (let i = 0; i < dataLk.length; i++) {
          cases += dataLk[i].attributes.AnzahlFall
          deaths += dataLk[i].attributes.AnzahlTodesfall
          coronaData[new Date(dataLk[i].attributes.Meldedatum).toLocaleDateString('en-CA')] = {
            Date: new Date(dataLk[i].attributes.Meldedatum).toLocaleDateString('en-CA'),
            Level3_ID: level3ID,
            Cases: cases,
            Deaths: deaths,
            Population: 0
          }
        }
        var currentCases = 0
        var currentDeaths = 0

        while (startDate <= stopDate) {
          if (startDate.toLocaleDateString('en-CA') in coronaData) {
            db.run('REPLACE INTO CoronaData (Date, Level3_ID, Cases, Deaths, Population) VALUES(?, ?, ?, ?, ?)',
              [
                coronaData[startDate.toLocaleDateString('en-CA')].Date,
                coronaData[startDate.toLocaleDateString('en-CA')].Level3_ID,
                coronaData[startDate.toLocaleDateString('en-CA')].Cases,
                coronaData[startDate.toLocaleDateString('en-CA')].Deaths,
                0
              ], function (err) {
                if (err) {
                  return console.log(err.message)
                }
              })
            currentCases = coronaData[startDate.toLocaleDateString('en-CA')].Cases
            currentDeaths = coronaData[startDate.toLocaleDateString('en-CA')].Deaths
          } else {
            db.run('REPLACE INTO CoronaData (Date, Level3_ID, Cases, Deaths, Population) VALUES(?, ?, ?, ?, ?)',
              [
                startDate.toLocaleDateString('en-CA'),
                level3ID,
                currentCases,
                currentDeaths,
                0
              ], function (err) {
                if (err) {
                  return console.log(err.message)
                }
              })
          }
          startDate.setDate(startDate.getDate() + 1)
        }
      })
    }).on('error', (err) => {
      console.log('Error: ' + err.message)
    })
  }
}