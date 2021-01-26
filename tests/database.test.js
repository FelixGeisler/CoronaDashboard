test('RKI-API Connection', () => {
    https.get(sqlString, (resp) => {
        expect(resp.statusCode).toBe(200)
    })
})

test('Database Connection', () => {
    new sqlite3.Database('database/db.sqlite', (err) => {
        expect(err).toBeFalsy()
    })
})

test('SQL Query for Geo-Data', () => {
    sqlString = `SELECT Level1_ID AS ID, Level1_Name AS Name FROM Level1 ORDER BY Level1_Name;`
    db.all(sqlString, [], (err, rows) => {
        data = []
        expect(err).toBeFalsy()
        for (let index = 0; index < rows.length; index++) {
            data.push(rows[index])
        }
        expect(data.length).toBe(1)
    })
    sqlString = `SELECT Level2_ID AS ID, Level2_Name AS Name FROM Level2 ORDER BY Level2_Name;`
    db.all(sqlString, [], (err, rows) => {
        data = []
        expect(err).toBeFalsy()
        for (let index = 0; index < rows.length; index++) {
            data.push(rows[index])
        }
        expect(data.length).toBe(16)
    })
    sqlString = `SELECT Level3_ID AS ID, Level3_Name AS Name FROM Level3 ORDER BY Level3_Name;`
    db.all(sqlString, [], (err, rows) => {
        data = []
        expect(err).toBeFalsy()
        for (let index = 0; index < rows.length; index++) {
            data.push(rows[index])
        }
        expect(data.length).toBe(412)
    })
})

test('SQL Query for LineChart-Data', () => {
    sqlString = `SELECT Date, Sum(Cases) AS Cases, Sum(Deaths) AS Deaths FROM CoronaData WHERE Date >= "2020-12-01" AND Date <= "2020-12-31" GROUP BY Date ORDER BY Date;`
    db.all(sqlString, [], (err, rows) => {
        data = []
        expect(err).toBeFalsy()
        for (let index = 0; index < rows.length; index++) {
            data.push(rows[index])
        }
        expect(data.length).toBe(31)
    })
    sqlString = `SELECT Date, SUM(Cases) AS Cases, SUM(Deaths) AS Deaths FROM CoronaData INNER JOIN Level3 ON CoronaData.Level3_ID = Level3.Level3_ID INNER JOIN Level2 ON Level3.Level2_ID = Level2.Level2_ID WHERE Date >= "2020-12-01" AND Date <= "2020-12-31" AND Level2.Level1_ID = 49 GROUP BY Date, Level2.Level1_ID ORDER BY Date;`
    db.all(sqlString, [], (err, rows) => {
        data = []
        expect(err).toBeFalsy()
        for (let index = 0; index < rows.length; index++) {
            data.push(rows[index])
        }
        expect(data.length).toBe(31)
    })
    sqlString = `SELECT Date, SUM(Cases) AS Cases, SUM(Deaths) AS Deaths FROM CoronaData INNER JOIN Level3 ON CoronaData.Level3_ID = Level3.Level3_ID WHERE Date >= "2020-12-01" AND Date <= "2020-12-31" AND Level3.Level2_ID = 1 GROUP BY Date, Level3.Level2_ID ORDER BY Date;`
    db.all(sqlString, [], (err, rows) => {
        data = []
        expect(err).toBeFalsy()
        for (let index = 0; index < rows.length; index++) {
            data.push(rows[index])
        }
        expect(data.length).toBe(31)
    })
    sqlString = `SELECT Date, SUM(Cases) AS Cases, SUM(Deaths) AS Deaths FROM CoronaData WHERE Date >= "2020-12-01" AND Date <= "2020-12-31" AND CoronaData.Level3_ID = 1 GROUP BY Date, CoronaData.Level3_ID ORDER BY Date;`
    db.all(sqlString, [], (err, rows) => {
        data = []
        expect(err).toBeFalsy()
        for (let index = 0; index < rows.length; index++) {
            data.push(rows[index])
        }
        expect(data.length).toBe(31)
    })
})

test('SQL Query for BarChart-Data', () => {
    sqlString = `SELECT * FROM (SELECT SUM(Cases) AS Cases, SUM(Deaths) AS Deaths, Level1_Abbr AS Name FROM CoronaData INNER JOIN Level3 ON CoronaData.Level3_ID = Level3.Level3_ID INNER JOIN Level2 ON Level3.Level2_ID = Level2.Level2_ID INNER JOIN Level1 ON Level2.Level1_ID = Level1.Level1_ID WHERE Date >= "2020-12-01" GROUP BY Level1.Level1_ID, Date ORDER BY Date ASC LIMIT 1) UNION SELECT * FROM (SELECT SUM(Cases) AS Cases, SUM(Deaths) AS Deaths, Level1_Abbr AS Name FROM CoronaData INNER JOIN Level3 ON CoronaData.Level3_ID = Level3.Level3_ID INNER JOIN Level2 ON Level3.Level2_ID = Level2.Level2_ID INNER JOIN Level1 ON Level2.Level1_ID = Level1.Level1_ID WHERE Date <= "2020-12-31" GROUP BY Level1.Level1_ID, Date ORDER BY Date DESC LIMIT 1)`
    db.all(sqlString, [], (err, rows) => {
        data = []
        expect(err).toBeFalsy()
        for (let index = 0; index < rows.length; index++) {
            data.push(rows[index])
        }
        expect(data.length).toBe(2)
    })
    sqlString = `SELECT * FROM (SELECT Date, SUM(Cases) AS Cases, SUM(Deaths) AS Deaths, SUM(Population) AS Population, Level2_Abbr AS Name FROM CoronaData INNER JOIN Level3 ON CoronaData.Level3_ID = Level3.Level3_ID INNER JOIN Level2 ON Level3.Level2_ID = Level2.Level2_ID WHERE Date >= "2020-12-01" AND Level2.Level1_ID = 49 GROUP BY Level2.Level2_ID, Date ORDER BY Date ASC LIMIT 16) UNION SELECT * FROM (SELECT Date, SUM(Cases) AS Cases, SUM(Deaths) AS Deaths, SUM(Population) AS Population, Level2_Abbr AS Name FROM CoronaData INNER JOIN Level3 ON CoronaData.Level3_ID = Level3.Level3_ID INNER JOIN Level2 ON Level3.Level2_ID = Level2.Level2_ID WHERE Date <= "2020-12-31" AND Level2.Level1_ID = 49 GROUP BY Level2.Level2_ID, Date ORDER BY Date DESC LIMIT 16);`
    db.all(sqlString, [], (err, rows) => {
        data = []
        expect(err).toBeFalsy()
        for (let index = 0; index < rows.length; index++) {
            data.push(rows[index])
        }
        expect(data.length).toBe(32)
    })
    sqlString = `SELECT * FROM (SELECT Date, Cases, Deaths, Population, Level3_Name AS Name FROM CoronaData INNER JOIN Level3 ON CoronaData.Level3_ID = Level3.Level3_ID WHERE Date >= "2020-12-01" AND Level3.Level2_ID = 1 ORDER BY Date ASC LIMIT 15) UNION SELECT * FROM (SELECT Date, Cases, Deaths, Population, Level3_Name AS Name FROM CoronaData INNER JOIN Level3 ON CoronaData.Level3_ID = Level3.Level3_ID WHERE Date <= "2020-12-31" AND Level3.Level2_ID = 1 ORDER BY Date DESC LIMIT 15);`
    db.all(sqlString, [], (err, rows) => {
        data = []
        expect(err).toBeFalsy()
        for (let index = 0; index < rows.length; index++) {
            data.push(rows[index])
        }
        expect(data.length).toBe(30)
    })
})

test('SQL Query for Summary-Data', () => {
    sqlString = `SELECT * FROM (SELECT Date, SUM(Cases) AS Cases, SUM(Deaths) AS Deaths, SUM(Population) AS Population, Level1_Name AS Name FROM CoronaData INNER JOIN Level3 ON CoronaData.Level3_ID = Level3.Level3_ID INNER JOIN Level2 ON Level3.Level2_ID = Level2.Level2_ID INNER JOIN Level1 ON Level2.Level1_ID = Level1.Level1_ID WHERE Date >= "2020-12-01" AND Level1.Level1_ID = 49 GROUP BY Level1.Level1_ID, Date ORDER BY Date ASC LIMIT 1) UNION SELECT * FROM (SELECT Date, SUM(Cases) AS Cases, SUM(Deaths) AS Deaths, SUM(Population) AS Population, Level1_Name AS Name FROM CoronaData INNER JOIN Level3 ON CoronaData.Level3_ID = Level3.Level3_ID INNER JOIN Level2 ON Level3.Level2_ID = Level2.Level2_ID INNER JOIN Level1 ON Level2.Level1_ID = Level1.Level1_ID WHERE Date <= "2020-12-31" AND Level1.Level1_ID = 49 GROUP BY Level1.Level1_ID, Date ORDER BY Date DESC LIMIT 1);`
    db.all(sqlString, [], (err, rows) => {
        data = []
        expect(err).toBeFalsy()
        for (let index = 0; index < rows.length; index++) {
            data.push(rows[index])
        }
        expect(data.length).toBe(2)
    })
    sqlString = `SELECT * FROM (SELECT Date, SUM(Cases) AS Cases, SUM(Deaths) AS Deaths, SUM(Population) AS Population, Level2_Name AS Name FROM CoronaData INNER JOIN Level3 ON CoronaData.Level3_ID = Level3.Level3_ID INNER JOIN Level2 ON Level3.Level2_ID = Level2.Level2_ID WHERE Date >= "2020-12-01" AND Level2.Level2_ID = 1 GROUP BY Level2.Level2_ID, Date ORDER BY Date ASC LIMIT 1) UNION SELECT * FROM (SELECT Date, SUM(Cases) AS Cases, SUM(Deaths) AS Deaths, SUM(Population) AS Population, Level2_Name AS Name FROM CoronaData INNER JOIN Level3 ON CoronaData.Level3_ID = Level3.Level3_ID INNER JOIN Level2 ON Level3.Level2_ID = Level2.Level2_ID WHERE Date <= "2020-12-31" AND Level2.Level2_ID = 1 GROUP BY Level2.Level2_ID, Date ORDER BY Date DESC LIMIT 1);`
    db.all(sqlString, [], (err, rows) => {
        data = []
        expect(err).toBeFalsy()
        for (let index = 0; index < rows.length; index++) {
            data.push(rows[index])
        }
        expect(data.length).toBe(2)
    })
    sqlString = `SELECT * FROM (SELECT Date, Cases, Deaths, Population, Level3_Name AS Name FROM CoronaData INNER JOIN Level3 ON CoronaData.Level3_ID = Level3.Level3_ID WHERE Date >= "2020-12-01" AND Level3.Level3_ID = 1 ORDER BY Date ASC LIMIT 1) UNION SELECT * FROM (SELECT Date, Cases, Deaths, Population, Level3_Name AS Name FROM CoronaData INNER JOIN Level3 ON CoronaData.Level3_ID = Level3.Level3_ID WHERE Date <= "2020-12-31" AND Level3.Level3_ID = 1 ORDER BY Date DESC LIMIT 1);`
    db.all(sqlString, [], (err, rows) => {
        data = []
        expect(err).toBeFalsy()
        for (let index = 0; index < rows.length; index++) {
            data.push(rows[index])
        }
        expect(data.length).toBe(2)
    })
})