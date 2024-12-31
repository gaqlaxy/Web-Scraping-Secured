


const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');


const downloadPdf = async (url, outputPath) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  const buffer = await response.arrayBuffer();
  fs.writeFileSync(outputPath, Buffer.from(buffer));
  console.log(`Downloaded: ${outputPath}`);
};

const scrapeAndDownload = async (page) => {
  // Extract PDF links from the current page
  const pdfLinks = await page.evaluate(() =>
    Array.from(document.querySelectorAll('a[href$=".pdf"]')).map(link => link.href)
  );

  console.log(`Found ${pdfLinks.length} PDFs on this page.`);

  // Download each PDF on the current page
  for (const [index, link] of pdfLinks.entries()) {
    const fileName = `document_${index + 1}.pdf`;
    const outputPath = path.join(__dirname, fileName);
    await downloadPdf(link, outputPath);
  }
};

const goToNextPage = async (page) => {
  // Try clicking the 'Next' button and wait for the page to load
  const nextButtonSelector = '.page_link a';
  const nextButton = await page.$(nextButtonSelector);

  if (nextButton) {
    console.log('Clicking "Next" to go to the next page...');
    await nextButton.click();

    // Wait for the page to load by checking for the PDF links or pagination elements
    await page.waitForSelector('a[href$=".pdf"], .page_link', { timeout: 15000 });

    // Wait for a few seconds to ensure the page is fully loaded before extracting PDFs
    await page.waitFor(3000); // Puppeteer has waitFor() which can be used as an alternative to waitForTimeout()
  } else {
    console.log('No "Next" button found. Reached the last page.');
  }
};

(async () => {
  try {
    // Launch Puppeteer browser instance
    const browser = await puppeteer.launch({
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    // Navigate to the website
    const url = 'https://dhcbkp.nic.in/FreeText/'; // Replace with the actual URL
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Perform search (if needed)
    const searchText = 'Apellant'; // Replace with your search term
    await page.type('#search1', searchText);
    await page.click('#search_button');

    // Wait for the results to load
    await page.waitForSelector('a[href$=".pdf"], .page_link', { timeout: 15000 });

    let isNextPageAvailable = true;

    // Start downloading PDFs and handle pagination
    while (isNextPageAvailable) {
      await scrapeAndDownload(page);
      await goToNextPage(page);

      // Check if "Next" button exists to determine if there are more pages
      const nextButton = await page.$('.page_link a');
      isNextPageAvailable = nextButton !== null;
    }

    console.log('All PDFs have been downloaded.');

    // Keep the browser open after the script finishes running
    console.log('Browser will remain open.');

    // Wait indefinitely to keep the browser open
    await new Promise(resolve => {});

  } catch (error) {
    console.error('An error occurred:', error);
  }
})();
