const puppeteer = require('puppeteer')

async function selectDistrict (stateID, districtID) {
    browser = await puppeteer.launch({defaultViewport: null})
    page = await browser.newPage()
    await page.goto('http://localhost:3000/')
    const state = await page.$x(`//*[@id="level2_map_${stateID}"]`)                 // Select State
    await state[0].click()
    const district = await page.$x(`//*[@id="level3_map_${districtID}"]`)           // Select District
    await district[0].click() 
    await page.screenshot({path: './tests/screenshots/zollernalbkreis.png'})
    browser.close()
}
selectDistrict(8, 216);
