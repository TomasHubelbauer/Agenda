const puppeteer = require('puppeteer');
const fs = require('fs');

// TODO: See if this is needed
fs.mkdirSync('screenshots');

void async function() {
  try {
    const browser = await puppeteer.launch();
    const pages = await browser.pages();
    const page = pages[0];
    // TODO: Serve the files on localhost and use that, the `file:///` protocol will have different behavior
    // TODO: Figure out why index.html doesn't work here and hangs the agent
    await page.goto('https://agendum.today');
    await page.waitForSelector('#editorInput');
    await page.screenshot({ path: 'screenshots/test.png' });
    // TODO: Upload screenshots as build artifacts from UI tests
    await browser.close();
  } catch (error) {
    console.error(error.message);
  }
}()
