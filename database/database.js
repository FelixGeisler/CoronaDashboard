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
    
        // Create Table Data
        db.run('CREATE TABLE IF NOT EXISTS Data (Date TEXT, Landkreis TEXT, Bundesland TEXT, Inhabitants INTEGER, Cases INTEGER, CasesPer100k REAL, CasesPerPopulation REAL, Cases7Per100k REAL, Cases7BlPer100k REAL, Deaths INTEGER, DeathRate REAL, PRIMARY KEY (Date, Landkreis));')
    
        // Update db Data
        https.get('https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=1%3D1&outFields=BEZ,NBD,SN_L,SN_R,SN_K,EWZ,KFL,death_rate,cases,deaths,cases_per_100k,cases_per_population,BL,county,cases7_per_100k,recovered,EWZ_BL,cases7_bl_per_100k,IBZ,GEN&returnGeometry=false&outSR=4326&f=json', (resp) => {
    
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
              db.run('REPLACE INTO Data (Date, Landkreis, Bundesland, Inhabitants, Cases, CasesPer100k, CasesPerPopulation, Cases7Per100k, Cases7BlPer100k, Deaths, DeathRate) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [
                  new Date().toISOString().slice(0, 10),
                  dataLk[i].attributes.county,
                  dataLk[i].attributes.BL,
                  dataLk[i].attributes.EWZ,
                  dataLk[i].attributes.cases,
                  dataLk[i].attributes.cases_per_100k,
                  dataLk[i].attributes.cases_per_population,
                  dataLk[i].attributes.cases7_per_100k,
                  dataLk[i].attributes.cases7_bl_per_100k,
                  dataLk[i].attributes.deaths,
                  dataLk[i].attributes.death_rate
                ], function (err) {
                  if (err) {
                    return console.log(err.message)
                  }
                  console.log(`A row has been inserted with PRIMARY KEY: ${new Date().toISOString().slice(0, 10)} ${dataLk[i].attributes.county}`)
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