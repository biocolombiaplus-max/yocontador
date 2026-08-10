import { chromium } from "playwright-core";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await browser.newPage();
await page.setViewportSize({ width: 512, height: 512 });
await page.goto(`file://${path.join(__dirname, "logo-biosalud.html")}`);
const el = await page.$("#icon");
await el.screenshot({ path: path.join(root, "public", "logos", "biosalud.png") });
await browser.close();
console.log("done");
