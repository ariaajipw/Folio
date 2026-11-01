import fs from 'fs';
import path from 'path';
import { readShopEnabled } from './lib/read-mode.mjs';

const OUT_DIR = path.join(process.cwd(), 'out');
const PRIVATE_DIR = path.join(process.cwd(), 'private');

let errors = [];

function error(msg) {
  errors.push(msg);
}

function warn(msg) {
  console.warn(`[verify-build] WARNING: ${msg}`);
}

function getAllFiles(dir, base = '') {
  const files = [];
  if (!fs.existsSync(dir)) return files;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.join(base, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllFiles(fullPath, relPath));
    } else {
      files.push(relPath);
    }
  }
  return files;
}

function readFileSafe(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch {
    return null;
  }
}

function getFileHash(filePath) {
  try {
    const content = fs.readFileSync(filePath);
    // Simple hash for comparison - using a basic approach
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      hash = ((hash << 5) - hash) + content[i];
      hash |= 0;
    }
    return hash.toString(16);
  } catch {
    return null;
  }
}

function main() {
  console.log('[verify-build] Starting post-build audit...');

  // Read shop mode
  let shopEnabled;
  try {
    shopEnabled = readShopEnabled();
    console.log(`[verify-build] Shop mode: ${shopEnabled ? 'Mode B (enabled)' : 'Mode A (disabled)'}`);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }

  if (!fs.existsSync(OUT_DIR)) {
    error(`Output directory ${OUT_DIR} does not exist`);
    process.exit(1);
  }

  const outFiles = getAllFiles(OUT_DIR);
  console.log(`[verify-build] Scanning ${outFiles.length} files in ${OUT_DIR}`);

  // Mode A checks
  if (!shopEnabled) {
    // 1. out/shop absent
    const shopDir = path.join(OUT_DIR, 'shop');
    if (fs.existsSync(shopDir)) {
      error(`Mode A: out/shop directory exists (should be absent)`);
    } else {
      console.log('[verify-build] ✓ out/shop absent');
    }

    // 2. No HTML contains data-shop
    const htmlFiles = outFiles.filter(f => f.endsWith('.html'));
    let dataShopFound = false;
    for (const htmlFile of htmlFiles) {
      const fullPath = path.join(OUT_DIR, htmlFile);
      const content = readFileSafe(fullPath);
      if (content && content.includes('data-shop')) {
        error(`Mode A: ${htmlFile} contains data-shop attribute`);
        dataShopFound = true;
      }
    }
    if (!dataShopFound) {
      console.log('[verify-build] ✓ No data-shop attributes found in HTML');
    }

    // 3. No output file references the checkout host (payhip string check)
    // Note: Full allowlist check is TASK-7.1; here we check for "payhip" string as basic guard
    let payhipFound = false;
    for (const file of outFiles) {
      const fullPath = path.join(OUT_DIR, file);
      // Only check text files (HTML, JS, CSS, etc.)
      if (file.endsWith('.html') || file.endsWith('.js') || file.endsWith('.css') || file.endsWith('.txt') || file.endsWith('.json') || file.endsWith('.xml')) {
        const content = readFileSafe(fullPath);
        if (content && content.toLowerCase().includes('payhip')) {
          error(`Mode A: ${file} contains "payhip" reference`);
          payhipFound = true;
        }
      }
    }
    if (!payhipFound) {
      console.log('[verify-build] ✓ No "payhip" references found in output');
    }
  }

  // 4. Preview size cap check (applies to both modes)
  // Check image files in out/ don't exceed a reasonable size (e.g., 500KB for preview images)
  // Note: This is a basic check. The actual configured cap should come from image pipeline config.
  const PREVIEW_SIZE_CAP = 500 * 1024; // 500KB default cap
  const imageExtensions = ['.webp', '.jpg', '.jpeg', '.png', '.avif', '.gif', '.svg'];
  let oversizedImages = 0;
  for (const file of outFiles) {
    const ext = path.extname(file).toLowerCase();
    if (imageExtensions.includes(ext)) {
      const fullPath = path.join(OUT_DIR, file);
      const stats = fs.statSync(fullPath);
      if (stats.size > PREVIEW_SIZE_CAP) {
        error(`Image exceeds preview size cap (${PREVIEW_SIZE_CAP} bytes): ${file} (${stats.size} bytes)`);
        oversizedImages++;
      }
    }
  }
  if (oversizedImages === 0) {
    console.log(`[verify-build] ✓ No images exceed preview size cap (${PREVIEW_SIZE_CAP} bytes)`);
  }

  // 5. No private files in out/ (by name or hash)
  // Check if any file from private/ appears in out/
  let privateFilesLeaked = 0;
  if (fs.existsSync(PRIVATE_DIR)) {
    const privateFiles = getAllFiles(PRIVATE_DIR);
    // Build hash map of private files
    const privateHashes = new Map();
    for (const privateFile of privateFiles) {
      const fullPath = path.join(PRIVATE_DIR, privateFile);
      const hash = getFileHash(fullPath);
      if (hash) {
        privateHashes.set(hash, privateFile);
      }
    }

    // Check output files against private hashes
    for (const file of outFiles) {
      const fullPath = path.join(OUT_DIR, file);
      const hash = getFileHash(fullPath);
      if (hash && privateHashes.has(hash)) {
        error(`Private file detected in output: ${file} matches private/${privateHashes.get(hash)}`);
        privateFilesLeaked++;
      }
    }

    // Also check by filename (basename) as a secondary check
    const privateBasenames = new Set(privateFiles.map(f => path.basename(f)));
    for (const file of outFiles) {
      if (privateBasenames.has(path.basename(file))) {
        warn(`Output file ${file} has same basename as a private file (may be coincidental)`);
      }
    }
  }

  if (privateFilesLeaked === 0) {
    console.log('[verify-build] ✓ No private files detected in output (by hash)');
  }

  // 6. Sitemap contents match the mode
  // Check if sitemap.xml exists and validate its content
  const sitemapPath = path.join(OUT_DIR, 'sitemap.xml');
  if (fs.existsSync(sitemapPath)) {
    const sitemapContent = readFileSafe(sitemapPath);
    if (sitemapContent) {
      if (!shopEnabled) {
        // Mode A: sitemap should NOT contain /shop URLs
        if (sitemapContent.includes('/shop/') || sitemapContent.includes('<loc>') && sitemapContent.toLowerCase().includes('shop')) {
          error('Mode A: sitemap.xml contains shop URLs');
        } else {
          console.log('[verify-build] ✓ Sitemap does not contain shop URLs (Mode A)');
        }
      } else {
        // Mode B: sitemap should contain shop URLs
        if (!sitemapContent.includes('/shop/')) {
          warn('Mode B: sitemap.xml may be missing shop URLs');
        } else {
          console.log('[verify-build] ✓ Sitemap contains shop URLs (Mode B)');
        }
      }
    }
  } else {
    warn('sitemap.xml not found in output (will be implemented in Phase 9)');
  }

  // Report results
  if (errors.length > 0) {
    console.error('\n[verify-build] AUDIT FAILED:');
    errors.forEach(err => console.error(`  - ${err}`));
    process.exit(1);
  } else {
    console.log('\n[verify-build] All audit checks passed.');
    process.exit(0);
  }
}

main();