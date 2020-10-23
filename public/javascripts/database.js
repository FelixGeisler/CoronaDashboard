var sqlite3 = require('sqlite3').verbose()
const DBSOURCE = 'db.sqlite'

const db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    // Cannot open database
    console.error(err.message)
    throw err
  } else {
    console.log('Connected to the SQLite database.')
    db.run('CREATE TABLE corona (Bundesland text PRIMARY KEY)', (err) => {
      if (err) {
        console.log('Table corona already existing.')
      } else {
        console.log('Table corona created.')
      }
    })
  }
})

module.exports = db
