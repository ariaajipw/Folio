import { loadSiteConfig } from '@/lib/content/site';

let _cachedFeatures: { shopEnabled: boolean } | null = null;

export function isShopEnabled(): boolean {
  if (_cachedFeatures !== null) {
    return _cachedFeatures.shopEnabled;
  }
  const siteConfig = loadSiteConfig();
  const enabled = siteConfig.features?.shopEnabled ?? false;
  _cachedFeatures = { shopEnabled: enabled };
  return enabled;
}

// For testing or forced reset
export function resetFeaturesCache(): void {
  _cachedFeatures = null;
}