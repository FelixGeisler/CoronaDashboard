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
                  new Date().toLocaleDateString('en-CA'),
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

  addData: function addData(level3ID, start, stop, oldcases, olddeaths) {
    var rki = [
      '01001', '01002', '01003', '01004', '01051', '01053', '01054', '01055', '01056', '01057', '01058', '01059', '01060', '01061', '01062',
      '02000',
      '03101', '03102', '03103', '03151', '03153', '03154', '03155', '03157', '03158', '03159', '03241', '03251', '03252', '03254', '03255', '03256', '03257', '03351', '03352', '03353', '03354', '03355', '03356', '03357', '03358', '03359', '03360', '03361', '03401', '03402', '03403', '03404', '03405', '03451', '03452', '03453', '03454', '03455', '03456', '03457', '03458', '03459', '03460', '03461', '03462',
      '04011', '04012',
      '05111', '05112', '05113', '05114', '05116', '05117', '05119', '05120', '05122', '05124', '05154', '05158', '05162', '05166', '05170', '05314', '05315', '05316', '05334', '05358', '05362', '05366', '05370', '05374', '05378', '05382', '05512', '05513', '05515', '05554', '05558', '05562', '05566', '05570', '05711', '05754', '05758', '05762', '05766', '05770', '05774', '05911', '05913', '05914', '05915', '05916', '05954', '05958', '05962', '05966', '05970', '05974', '05978',
      '06411', '06412', '06413', '06414', '06431', '06432', '06433', '06434', '06435', '06436', '06437', '06438', '06439', '06440', '06531', '06532', '06533', '06534', '06535', '06611', '06631', '06632', '06633', '06634', '06635', '06636',
      '07111', '07131', '07132', '07133', '07134', '07135', '07137', '07138', '07140', '07141', '07143', '07211', '07231', '07232', '07233', '07235', '07311', '07312', '07313', '07314', '07315', '07316', '07317', '07318', '07319', '07320', '07331', '07332', '07333', '07334', '07335', '07336', '07337', '07338', '07339', '07340',
      '08111', '08115', '08116', '08117', '08118', '08119', '08121', '08125', '08126', '08127', '08128', '08135', '08136', '08211', '08212', '08215', '08216', '08221', '08222', '08225', '08226', '08231', '08235', '08236', '08237', '08311', '08315', '08316', '08317', '08325', '08326', '08327', '08335', '08336', '08337', '08415', '08416', '08417', '08421', '08425', '08426', '08435', '08436', '08437',
      '09161', '09162', '09163', '09171', '09172', '09173', '09174', '09175', '09176', '09177', '09178', '09179', '09180', '09181', '09182', '09183', '09184', '09185', '09186', '09187', '09188', '09189', '09190', '09261', '09262', '09263', '09271', '09272', '09273', '09274', '09275', '09276', '09277', '09278', '09279', '09361', '09362', '09363', '09371', '09372', '09373', '09374', '09375', '09376', '09377', '09461', '09462', '09463', '09464', '09471', '09472', '09473', '09474', '09475', '09476', '09477', '09478', '09479', '09561', '09562', '09563', '09564', '09565', '09571', '09572', '09573', '09574', '09575', '09576', '09577', '09661', '09662', '09663', '09671', '09672', '09673', '09674', '09675', '09676', '09677', '09678', '09679', '09761', '09762', '09763', '09764', '09771', '09772', '09773', '09774', '09775', '09776', '09777', '09778', '09779', '09780',
      '10041', '10042', '10043', '10044', '10045', '10046',
      '',
      '12051', '12052', '12053', '12054', '12060', '12061', '12062', '12063', '12064', '12065', '12066', '12067', '12068', '12069', '12070', '12071', '12072', '12073',
      '13003', '13004', '13071', '13072', '13073', '13074', '13075', '13076',
      '14511', '14521', '14522', '14523', '14524', '14612', '14625', '14626', '14627', '14628', '14713', '14729', '14730',
      '15001', '15002', '15003', '15081', '15082', '15083', '15084', '15085', '15086', '15087', '15088', '15089', '15090', '15091',
      '16051', '16052', '16053', '16054', '16055', '16056', '16061', '16062', '16063', '16064', '16065', '16066', '16067', '16068', '16069', '16070', '16071', '16072', '16073', '16074', '16075', '16076', '16077',
      '', '', '11012', '11004', '11009', '11003', '11008', '11011', '11010', '11005', '11006', '11001', '11002', '11007'
    ]

    let db = new sqlite3.Database('database/db.sqlite', (err) => {
      if (err) {
        // Cannot open database
        console.error(err.message)
        throw err
      } else {
        // Opened successfully
        console.log('Connected to the SQLite database.')

        // Update db Data
        https.get(`https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?where=IdLandkreis%20%3D%20%27${rki[level3ID - 1]}%27%20AND%20Meldedatum%20%3E%3D%20TIMESTAMP%20%27${start}%2000%3A00%3A00%27%20AND%20Meldedatum%20%3C%3D%20TIMESTAMP%20%27${stop}%2000%3A00%3A00%27&outFields=Altersgruppe,AnzahlFall,AnzahlTodesfall,Meldedatum,IdLandkreis,IstErkrankungsbeginn&returnGeometry=false&orderByFields=Meldedatum%20ASC&outSR=4326&f=json`, (resp) => {
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
            console.log(dataLk.length, rki[level3ID - 1], level3ID)
            dataLk.sort(function (a, b) { return a.attributes.Meldedatum > b.attributes.Meldedatum ? 1 : -1 })
            var cases = oldcases
            var deaths = olddeaths
            var startDate = new Date(start)
            var stopDate = new Date(stop)

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
            var currentCases = oldcases
            var currentDeaths = olddeaths

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
        })
      }
    })
  }
}