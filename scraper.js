// const puppeteer = require('puppeteer');

// (async () => {
//   // Step 1: Launch the browser
//   const browser = await puppeteer.launch({ headless: false }); // Set to false for debugging
//   const page = await browser.newPage();

//   // Step 2: Navigate to the target website
//   const url = 'https://dhcbkp.nic.in/FreeText/'; // Replace with the actual URL
//   await page.goto(url, { waitUntil: 'networkidle2' });

//   // Step 3: Enter text in the search box
//   const searchText = 'Apellant'; // Replace with your desired search term
//   await page.type('#search1', searchText);

//   // Step 4: Click the search button
//   await page.click('#search_button');

//   // Step 5: Wait for the results to load
//   await page.waitForSelector('.page_link'); // Adjust selector if needed
  
  
//   console.log('Search initiated successfully!');

//   // Close the browser after debugging
//   // await browser.close();
// })();

// second try reading pdf 

// const puppeteer = require('puppeteer');

// // Timeout function to wait for a specific duration
// const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

// (async () => {
//   try {
//     // Step 1: Launch the browser
//     const browser = await puppeteer.launch({ headless: false }); // Set to false for debugging
//     const page = await browser.newPage();

//     // Step 2: Navigate to the target website
//     const url = 'https://dhcbkp.nic.in/FreeText/'; // Replace with the actual URL
//     await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 }); // Set a long timeout for page load

//     // Step 3: Enter text in the search box
//     const searchText = 'Apellant'; // Replace with your desired search term
//     await page.type('#search1', searchText);

//     // Step 4: Click the search button
//     await page.click('#search_button');

//     // Step 5: Wait for the results to load or timeout
//     try {
//       await page.waitForSelector('a[href$=".pdf"], .page_link', { timeout: 15000 }); // Adjust selector and timeout
//     } catch (err) {
//       console.warn('Results did not load within the expected time.');
//     }

//     // Add an extra wait time (custom timeout) if needed
//     console.log('Waiting for additional content...');
//     await wait(5000); // 5-second delay

//     // Step 6: Extract PDF links from the current page
//     const pdfLinks = await page.evaluate(() => {
//       try {
//         const links = Array.from(document.querySelectorAll('a[href$=".pdf"]'));
//         return links.map(link => link.href); // Extract the href attributes
//       } catch (err) {
//         console.error('Error extracting PDF links:', err);
//         return [];
//       }
//     });

//     // Step 7: Log the extracted links
//     if (pdfLinks.length > 0) {
//       console.log('PDF Links found on the current page:', pdfLinks);
//     } else {
//       console.log('No PDF Links found on the current page.');
//     }

//     // Step 8: Close the browser after debugging
//     await browser.close();

//   } catch (error) {
//     console.error('An error occurred:', error);
//   }
// })();


// 3rd try 

// const puppeteer = require('puppeteer');
// const fs = require('fs');
// const path = require('path');


// const downloadPdf = async (url, outputPath) => {
//   const response = await fetch(url);
//   if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
//   const buffer = await response.arrayBuffer();
//   fs.writeFileSync(outputPath, Buffer.from(buffer));
//   console.log(`Downloaded: ${outputPath}`);
// };

// (async () => {
//   try {
//     const browser = await puppeteer.launch({ headless: false });
//     const page = await browser.newPage();

//     const url = 'https://dhcbkp.nic.in/FreeText/'; // Replace with the actual URL
//     await page.goto(url, { waitUntil: 'networkidle2' });

//     // Step 1: Perform search (if not already done)
//     const searchText = 'Apellant'; // Replace with your search term
//     await page.type('#search1', searchText);
//     await page.click('#search_button');
    
//     // Wait for the results to appear (PDF links or pagination)
//     await page.waitForSelector('a[href$=".pdf"], .page_link', { timeout: 15000 });

//     // Step 2: Extract PDF links on the current page
//     const pdfLinks = await page.evaluate(() =>
//       Array.from(document.querySelectorAll('a[href$=".pdf"]')).map(link => link.href)
//     );

//     console.log(`Found ${pdfLinks.length} PDFs on this page.`);

//     // Step 3: Download all PDFs on the current page
//     for (const [index, link] of pdfLinks.entries()) {
//       const fileName = `document_${index + 1}.pdf`;
//       const outputPath = path.join(__dirname, fileName);
//       await downloadPdf(link, outputPath);
//     }

//     console.log('All PDFs from the current page have been downloaded.');

//     // Manually click "Next" and re-run this script for the next page.

//   } catch (error) {
//     console.error('An error occurred:', error);
//   }
// })();


// 4th try for downloading next pages - Downloads one page stops at 2nd

// const puppeteer = require('puppeteer');
// const fs = require('fs');
// const path = require('path');


// const downloadPdf = async (url, outputPath) => {
//   const response = await fetch(url);
//   if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
//   const buffer = await response.arrayBuffer();
//   fs.writeFileSync(outputPath, Buffer.from(buffer));
//   console.log(`Downloaded: ${outputPath}`);
// };

// const scrapeAndDownload = async (page) => {
//   // Extract PDF links from the current page
//   const pdfLinks = await page.evaluate(() =>
//     Array.from(document.querySelectorAll('a[href$=".pdf"]')).map(link => link.href)
//   );

//   console.log(`Found ${pdfLinks.length} PDFs on this page.`);

//   // Download each PDF on the current page
//   for (const [index, link] of pdfLinks.entries()) {
//     const fileName = `document_${index + 1}.pdf`;
//     const outputPath = path.join(__dirname, fileName);
//     await downloadPdf(link, outputPath);
//   }
// };

// const goToNextPage = async (page) => {
//   // Try clicking the 'Next' button and wait for the page to load
//   const nextButtonSelector = '.page_link a';
//   const nextButton = await page.$(nextButtonSelector);

//   if (nextButton) {
//     console.log('Clicking "Next" to go to the next page...');
//     await nextButton.click();

//     // Wait for the new content to load
//     await page.waitForSelector('a[href$=".pdf"], .page_link', { timeout: 15000 });

//     // Wait for a few seconds to ensure the page is fully loaded before extracting PDFs
//     await page.waitForTimeout(3000);
//   } else {
//     console.log('No "Next" button found. Reached the last page.');
//   }
// };

// (async () => {
//   try {
//     // Launch Puppeteer browser instance
//     const browser = await puppeteer.launch({
//       headless: false,
//       args: ['--no-sandbox', '--disable-setuid-sandbox']
//     });
//     const page = await browser.newPage();

//     // Navigate to the website
//     const url = 'https://dhcbkp.nic.in/FreeText/'; // Replace with the actual URL
//     await page.goto(url, { waitUntil: 'networkidle2' });

//     // Perform search (if needed)
//     const searchText = 'Apellant'; // Replace with your search term
//     await page.type('#search1', searchText);
//     await page.click('#search_button');

//     // Wait for the results to load
//     await page.waitForSelector('a[href$=".pdf"], .page_link', { timeout: 15000 });

//     let isNextPageAvailable = true;

//     // Start downloading PDFs and handle pagination
//     while (isNextPageAvailable) {
//       await scrapeAndDownload(page);
//       await goToNextPage(page);

//       // Check if "Next" button exists to determine if there are more pages
//       const nextButton = await page.$('.page_link a');
//       isNextPageAvailable = nextButton !== null;
//     }

//     console.log('All PDFs have been downloaded.');

//     // Keep the browser open after the script finishes running
//     console.log('Browser will remain open.');

//     // Wait indefinitely to keep the browser open
//     await new Promise(resolve => {});

//   } catch (error) {
//     console.error('An error occurred:', error);
//   }
// })();


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
