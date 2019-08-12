require('dotenv').config();
const fs = require('fs');
const Mercury = require('@postlight/mercury-parser');
const puppeteer = require('puppeteer');

// test url
const url = 'https://www.f' + 't.com/content/4e37808e-a4bd-11e9-a282-2df48f366f7d';

(async () => {
    try {
        const browser = await puppeteer.launch({
            headless: false,
            slowMo: 150,
            devtools: true
        })
        const page = await browser.newPage()
        
        const navigationPromise = page.waitForNavigation()
        
        await page.goto(url)
        
        await page.waitForSelector('#site-navigation > div.o-header__row.o-header__anon > ul > li:nth-child(1) > a')
        await page.click('#site-navigation > div.o-header__row.o-header__anon > ul > li:nth-child(1) > a')
        
        await navigationPromise
        
        await page.waitForSelector('input#enter-email')
        await page.type('input#enter-email', process.env.FT.LOGIN)
        
        await page.waitForSelector('#enter-email-next')
        await page.click('#enter-email-next')
        
        await navigationPromise
        
        await page.waitForSelector('input#enter-password')
        await page.type('input#enter-password', process.env.FT.PASSWORD)
        await page.click('#login-form > div:nth-child(6) > button')
        
        await navigationPromise

        Mercury.parse(url, { contentType: 'text'})
        .then((result) => {
            const filename = `${(new URL(url)).hostname}.json`
            fs.writeFile(`${filename}`, JSON.stringify(result, {}, 2), 'utf8', (err) => {
                if (err) throw err
            })
        })
        .catch((err) => {
            console.log(`ERR: ${err}`)
        })

//        await browser.close()
    } catch (error) {
        console.log(error)
    }
})()