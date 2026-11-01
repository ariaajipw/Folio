import fs from 'fs';
import path from 'path';

const CONTENT_DIR = path.join(process.cwd(), 'content');
const SITE_FILE = path.join(CONTENT_DIR, 'site.json');

/**
 * Reads the shopEnabled flag from site.json.
 * This is the ONLY way build tooling should read the flag.
 * Returns boolean. Throws on missing file, invalid JSON, or non-boolean value.
 */
export function readShopEnabled() {
  let raw;
  try {
    raw = fs.readFileSync(SITE_FILE, 'utf-8');
  } catch (err) {
    throw new Error(`[read-mode] Failed to read ${SITE_FILE}: ${err.message}`);
  }

  let siteConfig;
  try {
    siteConfig = JSON.parse(raw);
  } catch (err) {
    throw new Error(`[read-mode] Invalid JSON in ${SITE_FILE}: ${err.message}`);
  }

  const features = siteConfig?.features;
  if (!features || typeof features.shopEnabled !== 'boolean') {
    throw new Error(`[read-mode] features.shopEnabled must be a boolean in ${SITE_FILE}`);
  }

  return features.shopEnabled;
}

// CLI usage: node scripts/lib/read-mode.mjs
if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    const enabled = readShopEnabled();
    console.log(enabled ? 'shopEnabled: true (Mode B)' : 'shopEnabled: false (Mode A)');
    process.exit(0);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}