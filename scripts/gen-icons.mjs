import { chromium } from "playwright-core";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const iconsDir = path.join(root, "public", "icons");

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await browser.newPage();

async function render(sourceFile, outFile, size) {
  await page.setViewportSize({ width: 512, height: 512 });
  await page.goto(`file://${path.join(__dirname, sourceFile)}`);
  const el = await page.$("#icon");
  await el.screenshot({ path: path.join(iconsDir, outFile) });
  if (size !== 512) {
    // Re-render at exact target size using CSS zoom for crisper output
    await page.setViewportSize({ width: size, height: size });
    await page.evaluate((s) => {
      document.querySelector("#icon").style.width = s + "px";
      document.querySelector("#icon").style.height = s + "px";
    }, size);
    const el2 = await page.$("#icon");
    await el2.screenshot({ path: path.join(iconsDir, outFile) });
  }
}

await render("icon-source.html", "icon-192.png", 192);
await render("icon-source.html", "icon-512.png", 512);
await render("icon-source.html", "apple-touch-icon.png", 180);
await render("icon-source-maskable.html", "icon-maskable-512.png", 512);

await browser.close();
console.log("icons generated");
