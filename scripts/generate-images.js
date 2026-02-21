#!/usr/bin/env node
/**
 * Devotional Image Generator
 * 
 * Generates a unique image for each devotional using Google Gemini image generation.
 * Skips devotionals that already have a local image file.
 * 
 * Usage:
 *   node scripts/generate-images.js              # Generate all missing images
 *   node scripts/generate-images.js --dry-run    # Preview what would be generated
 *   node scripts/generate-images.js --day presence  # Only generate for one theme
 *   node scripts/generate-images.js --limit 5    # Generate at most N images
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ── Load .env manually (no dotenv dependency needed) ────────────────────────
function loadEnv() {
    const envPath = join(ROOT, '.env');
    if (!existsSync(envPath)) {
        console.error('❌  .env file not found at', envPath);
        process.exit(1);
    }
    const lines = readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx === -1) continue;
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
        if (!process.env[key]) process.env[key] = val;
    }
}

loadEnv();

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
    console.error('❌  GEMINI_API_KEY not found in .env');
    process.exit(1);
}

// ── CLI args ────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const DAY_FILTER = (() => { const i = args.indexOf('--day'); return i !== -1 ? args[i + 1] : null; })();
const LIMIT = (() => { const i = args.indexOf('--limit'); return i !== -1 ? parseInt(args[i + 1], 10) : Infinity; })();
const DELAY_MS = 3000; // 3 s between API calls to respect rate limits

// ── Load devotionals ─────────────────────────────────────────────────────────
const devotionalsPath = join(ROOT, 'src', 'data', 'devotionals.json');
const { devotionals } = JSON.parse(readFileSync(devotionalsPath, 'utf8'));

// ── Gemini Image Generation (gemini-2.5-flash-image) ────────────────────────
// Uses generateContent with responseModalities: ['IMAGE'] 
// Returns a Buffer of image bytes (JPEG or PNG)
async function generateImage(prompt) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${API_KEY}`;

    const body = {
        contents: [
            {
                parts: [
                    {
                        text: `Generate this image exactly as described, in portrait orientation (3:4 aspect ratio), suitable for a spiritual devotional mobile app:\n\n${prompt}`
                    }
                ]
            }
        ],
        generationConfig: {
            responseModalities: ['TEXT', 'IMAGE']
        }
    };

    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    if (!res.ok) {
        const errText = await res.text();
        throw new Error(`API error ${res.status}: ${errText.slice(0, 400)}`);
    }

    const data = await res.json();

    // Find the image part in candidates[0].content.parts
    const parts = data?.candidates?.[0]?.content?.parts ?? [];
    const imagePart = parts.find(p => p.inlineData?.mimeType?.startsWith('image/'));

    if (!imagePart) {
        const textParts = parts.filter(p => p.text).map(p => p.text).join(' ');
        throw new Error(`No image in response. Text: "${textParts.slice(0, 200)}"`);
    }

    return Buffer.from(imagePart.inlineData.data, 'base64');
}

// ── Sleep helper ─────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
    console.log('');
    console.log('🙏  Devotional Image Generator');
    console.log('─'.repeat(50));
    if (DRY_RUN) console.log('   Mode: DRY RUN (no images will be generated)');
    if (DAY_FILTER) console.log(`   Filter: Only "${DAY_FILTER}" devotionals`);
    if (LIMIT !== Infinity) console.log(`   Limit: ${LIMIT} images`);
    console.log('─'.repeat(50));
    console.log('');

    // Filter devotionals
    const targets = devotionals.filter(d => {
        if (!d.localPath) return false; // no path defined, skip
        if (!d.imageDescription) return false; // no prompt defined, skip
        if (DAY_FILTER && d.day !== DAY_FILTER) return false;
        return true;
    });

    console.log(`   Total devotionals to consider: ${targets.length}`);
    console.log('');

    let skipped = 0;
    let generated = 0;
    let errors = 0;
    let limitHit = 0;

    for (const devotional of targets) {
        const { day, dayNumber, localPath, imageDescription } = devotional;
        const label = `${day}/${dayNumber}-${day}.png`;

        // Full path on disk: public/images/devotionals/...
        const fullPath = join(ROOT, 'public', localPath);

        // Skip if already exists
        if (existsSync(fullPath)) {
            console.log(`  ⏭   SKIP  ${label}`);
            skipped++;
            continue;
        }

        // Check limit
        if (limitHit >= LIMIT) {
            console.log(`  🛑  Limit of ${LIMIT} reached, stopping.`);
            break;
        }

        if (DRY_RUN) {
            console.log(`  🔍  WOULD GENERATE  ${label}`);
            console.log(`         Prompt: "${imageDescription.slice(0, 90)}..."`);
            limitHit++;
            continue;
        }

        // Generate image
        process.stdout.write(`  ⚙️   GEN   ${label} … `);
        try {
            // Ensure directory exists
            mkdirSync(dirname(fullPath), { recursive: true });

            const imageBuffer = await generateImage(imageDescription);
            writeFileSync(fullPath, imageBuffer);

            console.log(`✅  (${(imageBuffer.length / 1024).toFixed(0)} KB)`);
            generated++;
            limitHit++;

            // Delay between requests to avoid rate limiting
            const isLast = (limitHit >= LIMIT) || (targets.indexOf(devotional) === targets.length - 1);
            if (!isLast) {
                await sleep(DELAY_MS);
            }
        } catch (err) {
            console.log(`❌  ERROR`);
            console.log(`         ${err.message}`);
            errors++;
        }
    }

    console.log('');
    console.log('─'.repeat(50));
    console.log(`  ✅  Generated : ${generated}`);
    console.log(`  ⏭   Skipped   : ${skipped}`);
    if (errors > 0) {
        console.log(`  ❌  Errors    : ${errors}`);
    }
    console.log('─'.repeat(50));
    console.log('');

    if (errors > 0) {
        process.exit(1);
    }
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
