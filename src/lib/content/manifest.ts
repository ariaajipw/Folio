import fs from 'fs';
import path from 'path';
import { ImageManifest, ImageManifestEntry } from '@/lib/types';

const CONTENT_DIR = path.join(process.cwd(), 'content');

export function loadImageManifest(): ImageManifest {
  const filePath = path.join(CONTENT_DIR, 'generated', 'image-manifest.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as ImageManifest;
}

export function getImageManifestEntry(key: string): ImageManifestEntry | undefined {
  const manifest = loadImageManifest();
  return manifest[key];
}

export function hasImageManifestKey(key: string): boolean {
  const manifest = loadImageManifest();
  return key in manifest;
}