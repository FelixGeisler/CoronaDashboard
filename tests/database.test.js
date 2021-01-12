const { ExpectationFailed } = require('http-errors')
const https = require('https')

test('RKI-API Connection', () => {
    https.get('https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=1%3D1&outFields=OBJECTID,SN_V1,EWZ,cases,deaths&returnGeometry=false&orderByFields=OBJECTID&outSR=&f=json', (resp) => {
        expect(resp.statusCode).toBe(200)
    })
})