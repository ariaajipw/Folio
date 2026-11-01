import fs from 'fs';
import path from 'path';
import { SiteConfig } from '@/lib/types';

const CONTENT_DIR = path.join(process.cwd(), 'content');

export function loadSiteConfig(): SiteConfig {
  const filePath = path.join(CONTENT_DIR, 'site.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as SiteConfig;
}