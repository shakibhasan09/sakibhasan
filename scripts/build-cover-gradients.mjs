import { readFile, readdir, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(fileURLToPath(import.meta.url), "../..");
const projectsDir = path.join(root, "src/content/projects");
const outFile = path.join(root, "src/generated/cover-gradients.json");

const result = {};
const files = (await readdir(projectsDir)).filter((f) => f.endsWith(".mdx"));

for (const file of files) {
    const slug = file.replace(/\.mdx$/, "");
    if (slug in result) continue;
    const text = await readFile(path.join(projectsDir, file), "utf8");
    const coverRel = (
        text.match(/^cover:\s*(\S+)\s*$/m)?.[1] ??
        text.match(/^coverDark:\s*(\S+)\s*$/m)?.[1]
    )?.replace(/^["']|["']$/g, "");
    if (!coverRel) continue;

    const coverPath = path.resolve(projectsDir, coverRel);
    try {
        result[slug] = await extractGradients(coverPath);
    } catch (err) {
        console.warn(`[cover-gradients] failed for ${slug}:`, err.message);
    }
}

await mkdir(path.dirname(outFile), { recursive: true });
await writeFile(outFile, JSON.stringify(result, null, 2) + "\n");
console.log(`[cover-gradients] wrote ${Object.keys(result).length} entries → ${path.relative(root, outFile)}`);

async function extractGradients(filePath) {
    const buf = await readFile(filePath);
    const { data } = await sharp(buf)
        .resize(200, 200, { fit: "inside" })
        .removeAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });

    const BUCKETS = 24;
    const buckets = Array.from({ length: BUCKETS }, () => ({ r: 0, g: 0, b: 0, w: 0 }));

    for (let i = 0; i < data.length; i += 3) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const [h, s, l] = rgbToHsl(r, g, b);
        if (s < 0.25 || l < 0.15 || l > 0.92) continue;
        const w = s * s * (1 - Math.abs(l - 0.55));
        if (w <= 0) continue;
        const idx = Math.floor(h * BUCKETS) % BUCKETS;
        buckets[idx].r += r * w;
        buckets[idx].g += g * w;
        buckets[idx].b += b * w;
        buckets[idx].w += w;
    }

    let best = buckets[0];
    for (const b of buckets) if (b.w > best.w) best = b;
    if (best.w === 0) return null;

    const r = best.r / best.w;
    const g = best.g / best.w;
    const b = best.b / best.w;
    return {
        light: buildLightGradient(r, g, b),
        dark: buildDarkGradient(r, g, b),
    };
}

function buildDarkGradient(r, g, b) {
    const [h, s, l] = rgbToHsl(r, g, b);
    const sat = Math.min(1, Math.max(0.55, s));
    const c1 = hslToCss(h, sat, clamp(l + 0.1, 0.4, 0.6));
    const c2 = hslToCss(h, sat, clamp(l, 0.3, 0.5));
    const c3 = hslToCss((h + 0.04) % 1, sat * 0.85, clamp(l - 0.25, 0.08, 0.22));
    return `linear-gradient(135deg, ${c1} 0%, ${c2} 50%, ${c3} 100%)`;
}

function buildLightGradient(r, g, b) {
    const [h, s] = rgbToHsl(r, g, b);
    // Soft pastel tint of the accent hue — keeps cards readable against the
    // cream gruvbox light background without overpowering it.
    const sat = clamp(s * 0.65 + 0.15, 0.4, 0.7);
    const c1 = hslToCss(h, sat, 0.9);
    const c2 = hslToCss(h, sat, 0.78);
    const c3 = hslToCss((h + 0.04) % 1, sat * 0.95, 0.62);
    return `linear-gradient(135deg, ${c1} 0%, ${c2} 50%, ${c3} 100%)`;
}

function rgbToHsl(r, g, b) {
    const rn = r / 255;
    const gn = g / 255;
    const bn = b / 255;
    const max = Math.max(rn, gn, bn);
    const min = Math.min(rn, gn, bn);
    const l = (max + min) / 2;
    let h = 0;
    let s = 0;
    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case rn:
                h = (gn - bn) / d + (gn < bn ? 6 : 0);
                break;
            case gn:
                h = (bn - rn) / d + 2;
                break;
            default:
                h = (rn - gn) / d + 4;
        }
        h /= 6;
    }
    return [h, s, l];
}

function hslToCss(h, s, l) {
    return `hsl(${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%)`;
}

function clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
}
