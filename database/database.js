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
  }
}