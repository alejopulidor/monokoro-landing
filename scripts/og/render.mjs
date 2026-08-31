// Renders every social card in scripts/og/cards.json to public/og/<id>.jpg.
//
//   node scripts/og/render.mjs            # all cards
//   node scripts/og/render.mjs home       # just one, by id
//
// Pipeline, and why each step is what it is:
//
//   1. headless Chrome screenshots scripts/og/card.html at 2x. Chrome only
//      writes PNG, and only at the device scale factor — so this produces a
//      2400x1260 PNG.
//   2. PowerShell + System.Drawing downscales it to 1200x630 with
//      HighQualityBicubic and encodes JPEG q90 (~90 KB). Downsampling from 2x
//      is what keeps the type crisp; rendering straight at 1x looks soft.
//
// Both tools ship with Windows, which is the point — no image dependency in
// package.json for something that runs a handful of times a year.
//
// The cards are NOT rebuilt by `pnpm build`. They change when the copy
// changes, not when the code does, and a social card that silently re-renders
// on every deploy is a card nobody ever looks at. Run this by hand and commit
// the result.

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..", "..");
const TEMPLATE = join(HERE, "card.html");
const OUT_DIR = join(ROOT, "public", "og");

const CHROME_CANDIDATES = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
];

function findChrome() {
  const found = CHROME_CANDIDATES.find((p) => existsSync(p));
  if (found) return found;
  throw new Error(
    `No Chrome or Edge found. Looked in:\n  ${CHROME_CANDIDATES.join("\n  ")}`,
  );
}

/** PowerShell resize + JPEG encode. Kept as a heredoc-style string because the
 *  alternative is a dependency on sharp for four images a year. */
function toJpeg(srcPng, dstJpg) {
  const ps = `
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile('${srcPng}')
$bmp = New-Object System.Drawing.Bitmap 1200, 630
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.PixelOffsetMode   = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.DrawImage($img, 0, 0, 1200, 630)
$g.Dispose()
$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$ep = New-Object System.Drawing.Imaging.EncoderParameters 1
$ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), 90
$bmp.Save('${dstJpg}', $codec, $ep)
$bmp.Dispose(); $img.Dispose()
`;
  execFileSync("powershell", ["-NoProfile", "-NonInteractive", "-Command", ps], {
    stdio: "inherit",
  });
}

const chrome = findChrome();
const cards = JSON.parse(readFileSync(join(HERE, "cards.json"), "utf8"));
const only = process.argv[2];
const wanted = only ? cards.filter((c) => c.id === only) : cards;

if (!wanted.length) {
  console.error(
    `No card with id "${only}". Known ids: ${cards.map((c) => c.id).join(", ")}`,
  );
  process.exit(1);
}

mkdirSync(OUT_DIR, { recursive: true });
const scratch = join(tmpdir(), `mk-og-${process.pid}`);
mkdirSync(scratch, { recursive: true });

try {
  for (const card of wanted) {
    const hash = Buffer.from(JSON.stringify(card), "utf8").toString("base64");
    const png = join(scratch, `${card.id}.png`);
    const jpg = join(OUT_DIR, `${card.id}.jpg`);

    execFileSync(
      chrome,
      [
        "--headless=new",
        "--disable-gpu",
        "--hide-scrollbars",
        "--force-device-scale-factor=2",
        "--window-size=1200,630",
        // Lets the Google Fonts request finish before the capture. Without it
        // the card renders in the fallback face and nobody notices until it is
        // already unfurling in a chat.
        "--virtual-time-budget=8000",
        `--screenshot=${png}`,
        `file:///${TEMPLATE.replace(/\\/g, "/")}#${hash}`,
      ],
      { stdio: ["ignore", "ignore", "inherit"] },
    );

    toJpeg(png.replace(/\\/g, "\\\\"), jpg.replace(/\\/g, "\\\\"));
    console.log(`✓ public/og/${card.id}.jpg`);
  }
} finally {
  rmSync(scratch, { recursive: true, force: true });
}

console.log(
  "\nLook at every card you just rendered before shipping it. A card that lost\n" +
    "its webfonts or clipped a line still 'renders successfully'.",
);
