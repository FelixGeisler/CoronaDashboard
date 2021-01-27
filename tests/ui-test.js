const puppeteer = require('puppeteer')

async function selectDistrict (stateID, districtID) {
    browser = await puppeteer.launch({headless: false, defaultViewport: null})
    page = await browser.newPage()
    await page.goto('http://localhost:3000/')
    const state = await page.$x(`//*[@id="level2_map_${stateID}"]`)                 // Select State
    await page.waitFor(3000);
    await state[0].click()
    const district = await page.$x(`//*[@id="level3_map_${districtID}"]`)           // Select District
    await page.waitFor(3000);
    await district[0].click() 
    await page.screenshot({path: './tests/screenshots/zollernalbkreis.png'})
}
selectDistrict(8, 216);
