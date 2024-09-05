const puppeteer = require("puppeteer");

const url = "https://www.golf.dk/";

const username = "6-3871";
const password = "Mnbk1103";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function bookTeeTime() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(url);

  // Check if the cookie consent popup exists and click it
  const agreeButton = await page.$("#didomi-notice-agree-button");
  if (agreeButton) {
    await page.click("#didomi-notice-agree-button");
    // Click again if it's still visible
    await page.click("#didomi-notice-agree-button");
    // Wait for the popup to disappear
    await page.waitForSelector("#didomi-notice-agree-button", { hidden: true });
  } else {
    console.log("Cookie consent popup not found.");
  }

  // Check if the login tab is visible and click it
  const loginTab = await page.$(".mobileLogin");
  if (loginTab) {
    await page.click(".mobileLogin");
  } else {
    console.error("Login tab not found.");
    await browser.close();
    return;
  }

  // Delay to allow the login tab to be visible
  await delay(1000);

  // Type username and password
  const usernameField = await page.$(".username");
  if (usernameField) {
    await page.type(".username", username);
  } else {
    console.error("Username field not found.");
    await browser.close();
    return;
  }

  const passwordField = await page.$(".password");
  if (passwordField) {
    await page.type(".password", password);
  } else {
    console.error("Password field not found.");
    await browser.close();
    return;
  }

  // Wait for the login button to be visible and click it
  const loginButton = await page.$(".loginBtn");
  if (loginButton) {
    await page.click(".loginBtn");
    // Wait for login to complete
    await page.waitForNavigation({ waitUntil: "networkidle0" });
    console.log("Logged in");
  } else {
    console.error("Login button not found.");
    await browser.close();
    return;
  }

  const bookingUrl =
    "https://www.golfbox.dk/site/my_golfbox/ressources/booking/window.asp?Ressource_GUID={1C6D53A2-5E66-4FD6-89DB-424ADBF31A70}&Booking_Start=20240913T173000&club_GUID={6D58C6D7-DC20-4F54-A1B2-9A79EBD5ABDD}";

  await page.goto(bookingUrl);

  // Wait for the iframe to be available
  const iframeElement = await page.waitForSelector(
    "iframe#sp_message_iframe_1163825"
  );
  if (iframeElement) {
    // Get the iframe's content frame
    const iframe = await iframeElement.contentFrame();

    // Wait for the "Tillad Alle" button inside the iframe
    const allowAllButton = await iframe.waitForSelector(
      "button[title='Tillad Alle']",
      { visible: true }
    );
    if (allowAllButton) {
      await iframe.click("button[title='Tillad Alle']");
    } else {
      console.error("Tillad Alle button not found.");
      await browser.close();
      return;
    }
  } else {
    console.error("Consent iframe not found.");
    await browser.close();
    return;
  }

  await delay(1000);

  // Check if the modal's primary button exists and click it
  const modalPrimaryButton = await page.$(".modal .btn-primary");
  if (modalPrimaryButton) {
    await page.click(".modal .btn-primary");
  } else {
    console.error("Modal primary button not found.");
    await browser.close();
    return;
  }

  await delay(1000);

  // Wait for the cookie banner and check if it exists
  const cookieBanner = await page.$(".cookie-pref-row");
  if (cookieBanner) {
    // Get all the elements with the class "cookie-pref-row"
    const cookiePrefRows = await page.$$(".cookie-pref-row");

    if (cookiePrefRows.length > 0) {
      // Click the last element in the array
      await cookiePrefRows[cookiePrefRows.length - 1].click();
      console.log("Successfully clicked the last cookie preference row.");
    } else {
      console.error("No elements with class 'cookie-pref-row' found.");
    }
  } else {
    console.error("Cookie banner not found.");
  }

  await delay(1000);

  // Wait for GMS cookie button and click it
  const gmsCookieButton = await page.$(".gms-cookie-button");
  if (gmsCookieButton) {
    await page.click(".gms-cookie-button");
    console.log("Successfully clicked the GMS cookie button.");
  } else {
    console.error("GMS cookie button not found.");
  }

  await delay(5000);

  console.log("Starting button clickability check...");

  const isClickable = await page.evaluate(() => {
    console.log("Inside page.evaluate()"); // This log is visible in the browser context, not the Node.js console.

    const button = document.querySelector("#cmdSubmit");

    console.log("Button exists:", !!button);

    if (!button) {
      return false;
    }

    const isDisabled = button.disabled;
    const hasWidth = button.offsetWidth > 0;
    const hasHeight = button.offsetHeight > 0;

    console.log("Button is disabled:", isDisabled);
    console.log("Button width:", button.offsetWidth);
    console.log("Button height:", button.offsetHeight);

    return !isDisabled && hasWidth && hasHeight;
  });

  console.log("Button clickability check completed.");

  if (isClickable) {
    // Click the button
    await page.click("#cmdSubmit");

    // Wait for navigation or other action to complete
    await page.waitForNavigation({ waitUntil: "networkidle0" });
    console.log("Button clicked and navigation complete!");
  } else {
    console.error("Submit button is not clickable.");
  }

  await browser.close();
}

bookTeeTime();
