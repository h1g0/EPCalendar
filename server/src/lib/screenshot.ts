import { StartOfWeek } from "@/app/type/calendarType";
import { SupportedLanguages } from "@/const/i18n";
import { screenSize } from "@/const/screen";
import puppeteer from "puppeteer";
import process from "node:process";

export async function takeScreenshot(
  startOfWeek: StartOfWeek,
  lang: SupportedLanguages,
) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const targetUrl = `${baseUrl}/calendar?start=${startOfWeek}&lang=${lang}`;

  const args = [
    "--disable-gpu",
    "--disable-dev-shm-usage",
    "--disable-setuid-sandbox",
    "--no-first-run",
    "--no-sandbox",
    "--no-zygote",
    "--single-process",
    "--disable-audio-output",
    "--disable-background-timer-throttling",
    "--disable-backgrounding-occluded-windows",
    "--disable-breakpad",
    "--disable-extensions",
    "--disable-sync",
    "--disable-translate",
  ];

  const browser = await puppeteer.launch({
    headless: true,
    args,
  });
  const page = await browser.newPage();
  await page.setViewport({
    width: screenSize.width,
    height: screenSize.height,
    deviceScaleFactor: 2,
  });
  await page.goto(targetUrl, { waitUntil: "networkidle0" });

  const screenshotBuffer = await page.screenshot({ type: "png" });
  await browser.close();

  return screenshotBuffer;
}
