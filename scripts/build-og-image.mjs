import { readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const svgPath = join(root, "public", "og-image.svg");
const pngPath = join(root, "public", "og-image.png");

async function needsRebuild() {
    try {
        const [svgStat, pngStat] = await Promise.all([
            stat(svgPath),
            stat(pngPath),
        ]);
        return svgStat.mtimeMs > pngStat.mtimeMs;
    } catch {
        return true;
    }
}

if (!(await needsRebuild())) {
    console.log("[og] og-image.png is up to date");
    process.exit(0);
}

const svg = await readFile(svgPath);

await sharp(svg, { density: 200 })
    .resize(1200, 630, { fit: "cover" })
    .png({ compressionLevel: 9, quality: 90 })
    .toFile(pngPath);

console.log("[og] wrote", pngPath);
