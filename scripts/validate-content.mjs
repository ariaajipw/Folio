import fs from 'fs';
import path from 'path';
import { readShopEnabled } from './lib/read-mode.mjs';

const CONTENT_DIR = path.join(process.cwd(), 'content');
const GENERATED_DIR = path.join(CONTENT_DIR, 'generated');

const FILES = {
  site: path.join(CONTENT_DIR, 'site.json'),
  gallery: path.join(CONTENT_DIR, 'gallery.json'),
  products: path.join(CONTENT_DIR, 'products.json'),
  manifest: path.join(GENERATED_DIR, 'image-manifest.json'),
};

let errors = [];

function error(msg) {
  errors.push(msg);
}

function readJSON(file, label) {
  try {
    const raw = fs.readFileSync(file, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    error(`${label}: ${err.message}`);
    return null;
  }
}

function checkUniqueIds(items, idField, label) {
  const seen = new Map();
  items.forEach((item, idx) => {
    const id = item[idField];
    if (!id) {
      error(`${label}[${idx}]: missing ${idField}`);
      return;
    }
    if (seen.has(id)) {
      error(`${label}: duplicate ${idField} "${id}" (first at index ${seen.get(id)}, duplicate at ${idx})`);
    } else {
      seen.set(id, idx);
    }
  });
}

function validateSite(data) {
  if (!data) return;

  // Check required structure
  if (!data.site || !data.creator || !data.hero || !data.contact || !data.features) {
    error('site.json: missing required top-level keys (site, creator, hero, contact, features)');
    return;
  }

  // Check features.shopEnabled is boolean (already done by read-mode, but double-check)
  if (typeof data.features.shopEnabled !== 'boolean') {
    error('site.json: features.shopEnabled must be boolean');
  }

  // Check alt text for hero image
  if (data.hero.image && !data.hero.image.alt) {
    error('site.json: hero.image.alt is required');
  }

  // Check alt text for portrait
  if (data.creator.portrait && !data.creator.portrait.alt) {
    error('site.json: creator.portrait.alt is required');
  }

  // Heuristic scan for secret-looking strings
  const jsonStr = JSON.stringify(data);
  const secretPatterns = [
    /api[_-]?key/i,
    /secret/i,
    /token/i,
    /password/i,
    /private[_-]?key/i,
    /access[_-]?token/i,
  ];
  for (const pattern of secretPatterns) {
    if (pattern.test(jsonStr)) {
      error('site.json: possible secret-looking string detected in content');
      break;
    }
  }
}

function validateGallery(data) {
  if (!data) return;

  if (!data.categories || !data.works) {
    error('gallery.json: missing required keys (categories, works)');
    return;
  }

  // Unique category IDs
  checkUniqueIds(data.categories, 'id', 'gallery.categories');

  // Unique work IDs and slugs
  checkUniqueIds(data.works, 'id', 'gallery.works');
  checkUniqueIds(data.works, 'slug', 'gallery.works');

  // Build category ID set for reference checking
  const categoryIds = new Set(data.categories.map(c => c.id));

  // Validate each work
  data.works.forEach((work, idx) => {
    const prefix = `gallery.works[${idx}] (id: ${work.id || 'unknown'})`;

    // Category reference
    if (!work.category || !categoryIds.has(work.category)) {
      error(`${prefix}: references unknown category "${work.category}"`);
    }

    // Type validation
    const validTypes = ['photo', 'design', 'artwork', 'video'];
    if (!validTypes.includes(work.type)) {
      error(`${prefix}: invalid type "${work.type}" (must be one of ${validTypes.join(', ')})`);
    }

    // Alt text for cover
    if (!work.cover?.alt) {
      error(`${prefix}: cover.alt is required`);
    }

    // Type-specific validation
    if (work.type === 'video') {
      if (!work.video) {
        error(`${prefix}: video type requires video object`);
      } else {
        const validProviders = ['youtube', 'vimeo', 'file'];
        if (!validProviders.includes(work.video.provider)) {
          error(`${prefix}: invalid video provider "${work.video.provider}"`);
        }
        if (!work.video.id) {
          error(`${prefix}: video.id is required`);
        }
        if (work.video.provider === 'file' && !work.video.id.startsWith('https://')) {
          error(`${prefix}: file video must use HTTPS URL`);
        }
        if (!work.cover?.alt) {
          error(`${prefix}: video cover.alt is required (poster alt text)`);
        }
      }
    } else {
      // photo, design, artwork need images array
      if (!work.images || work.images.length === 0) {
        error(`${prefix}: non-video types require at least one image in images[]`);
      } else {
        work.images.forEach((img, imgIdx) => {
          if (!img.alt) {
            error(`${prefix}.images[${imgIdx}]: alt is required`);
          }
        });
      }
    }

    // Details validation
    if (work.details) {
      work.details.forEach((detail, dIdx) => {
        if (!detail.label || !detail.value) {
          error(`${prefix}.details[${dIdx}]: label and value are required`);
        }
      });
    }

    // productId is optional, no validation needed in Mode A
  });
}

function validateManifest(data) {
  if (!data) return;

  // Check that all image keys referenced in gallery exist in manifest
  // This is done in cross-reference validation below
}

function validateImageRefs(manifest, gallery) {
  if (!manifest || !gallery) return;

  const manifestKeys = new Set(Object.keys(manifest));
  const missingKeys = [];

  gallery.works.forEach(work => {
    // Check cover
    if (work.cover?.src && !manifestKeys.has(work.cover.src)) {
      missingKeys.push(`${work.id}.cover -> "${work.cover.src}"`);
    }

    // Check images array
    if (work.images) {
      work.images.forEach((img, idx) => {
        if (img.src && !manifestKeys.has(img.src)) {
          missingKeys.push(`${work.id}.images[${idx}] -> "${img.src}"`);
        }
      });
    }

    // Check video poster (cover)
    if (work.type === 'video' && work.cover?.src && !manifestKeys.has(work.cover.src)) {
      missingKeys.push(`${work.id}.cover (poster) -> "${work.cover.src}"`);
    }
  });

  // Check site hero and portrait
  // Note: we need site data for this, but we can check if manifest has the keys
  // This will be validated when we have site data

  if (missingKeys.length > 0) {
    error(`Image manifest: missing keys referenced by gallery: ${missingKeys.join(', ')}`);
  }

  // Validate manifest entries have required structure
  for (const [key, entry] of Object.entries(manifest)) {
    if (typeof entry.width !== 'number' || typeof entry.height !== 'number') {
      error(`Manifest entry "${key}": width and height must be numbers`);
    }
    if (!entry.variants || !Array.isArray(entry.variants) || entry.variants.length === 0) {
      error(`Manifest entry "${key}": must have at least one variant`);
    } else {
      entry.variants.forEach((v, idx) => {
        if (typeof v.w !== 'number' || typeof v.src !== 'string') {
          error(`Manifest entry "${key}".variants[${idx}]: w must be number, src must be string`);
        }
        if (v.src && !v.src.startsWith('/images/')) {
          error(`Manifest entry "${key}".variants[${idx}]: src should start with /images/`);
        }
      });
    }
  }
}

function validateSiteImageRefs(manifest, site) {
  if (!manifest || !site) return;

  const manifestKeys = new Set(Object.keys(manifest));

  if (site.hero?.image?.src && !manifestKeys.has(site.hero.image.src)) {
    error(`site.json: hero.image.src "${site.hero.image.src}" not found in image manifest`);
  }

  if (site.creator?.portrait?.src && !manifestKeys.has(site.creator.portrait.src)) {
    error(`site.json: creator.portrait.src "${site.creator.portrait.src}" not found in image manifest`);
  }
}

// Main validation
function main() {
  console.log('[validate-content] Starting build-time content validation...');

  // Read shop mode
  let shopEnabled;
  try {
    shopEnabled = readShopEnabled();
    console.log(`[validate-content] Shop mode: ${shopEnabled ? 'Mode B (enabled)' : 'Mode A (disabled)'}`);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }

  // Read all content files
  const site = readJSON(FILES.site, 'site.json');
  const gallery = readJSON(FILES.gallery, 'gallery.json');
  const manifest = readJSON(FILES.manifest, 'image-manifest.json');

  // products.json is NOT read in Mode A
  let products = null;
  if (shopEnabled) {
    products = readJSON(FILES.products, 'products.json');
    if (!products) {
      error('products.json: required in Mode B but missing or invalid');
    }
  } else {
    // In Mode A, products.json may be absent, empty, or malformed - do not read it
    console.log('[validate-content] Mode A: skipping products.json validation');
  }

  // Run validations
  validateSite(site);
  validateGallery(gallery);
  validateManifest(manifest);

  // Cross-reference validations
  validateImageRefs(manifest, gallery);
  validateSiteImageRefs(manifest, site);

  // Mode B validations
  if (shopEnabled && products) {
    validateProducts(products, manifest);
  }

  // Report results
  if (errors.length > 0) {
    console.error('\n[validate-content] VALIDATION FAILED:');
    errors.forEach(err => console.error(`  - ${err}`));
    process.exit(1);
  } else {
    console.log('[validate-content] All validations passed.');
    process.exit(0);
  }
}

function validateProducts(products, manifest) {
  if (!products?.products) {
    error('products.json: missing products array');
    return;
  }

  checkUniqueIds(products.products, 'id', 'products.products');
  checkUniqueIds(products.products, 'slug', 'products.products');

  const manifestKeys = manifest ? new Set(Object.keys(manifest)) : new Set();

  products.products.forEach((product, idx) => {
    const prefix = `products.products[${idx}] (id: ${product.id || 'unknown'})`;

    // Required fields
    if (!product.title) error(`${prefix}: title is required`);
    if (!product.description) error(`${prefix}: description is required`);
    if (!product.preview?.alt) error(`${prefix}: preview.alt is required`);
    if (!product.price?.amount || !product.price?.currency) error(`${prefix}: price.amount and price.currency are required`);
    if (!product.license?.label || !product.license?.summary) error(`${prefix}: license.label and license.summary are required`);
    if (!product.file?.format || !product.file?.resolution) error(`${prefix}: file.format and file.resolution are required`);
    if (!product.checkoutUrl) error(`${prefix}: checkoutUrl is required`);
    if (!product.status || !['available', 'unavailable'].includes(product.status)) {
      error(`${prefix}: status must be "available" or "unavailable"`);
    }

    // checkoutUrl must be HTTPS and allowlisted (Payhip for now)
    if (product.checkoutUrl) {
      try {
        const url = new URL(product.checkoutUrl);
        if (url.protocol !== 'https:') {
          error(`${prefix}: checkoutUrl must use HTTPS`);
        }
        // Allowlist check - Payhip domains
        const allowlist = ['payhip.com', 'www.payhip.com'];
        if (!allowlist.some(host => url.hostname === host || url.hostname.endsWith('.' + host))) {
          error(`${prefix}: checkoutUrl host "${url.hostname}" not in allowlist (payhip.com)`);
        }
      } catch {
        error(`${prefix}: checkoutUrl is not a valid URL`);
      }
    }

    // Preview image in manifest
    if (product.preview?.src && manifestKeys.size > 0 && !manifestKeys.has(product.preview.src)) {
      error(`${prefix}: preview.src "${product.preview.src}" not found in image manifest`);
    }
  });
}

main();