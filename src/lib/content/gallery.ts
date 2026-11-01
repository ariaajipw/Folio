import fs from 'fs';
import path from 'path';
import { GalleryConfig, Work } from '@/lib/types';

const CONTENT_DIR = path.join(process.cwd(), 'content');

export function loadGalleryConfig(): GalleryConfig {
  const filePath = path.join(CONTENT_DIR, 'gallery.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as GalleryConfig;
}

export function getAllWorks(): Work[] {
  const gallery = loadGalleryConfig();
  return gallery.works;
}

export function getWorkBySlug(slug: string): Work | undefined {
  const works = getAllWorks();
  return works.find((w) => w.slug === slug);
}

export function getFeaturedWorks(): Work[] {
  const works = getAllWorks();
  return works.filter((w) => w.featured).sort((a, b) => a.order - b.order);
}

export function getWorksByCategory(categoryId: string): Work[] {
  const works = getAllWorks();
  return works.filter((w) => w.category === categoryId);
}

export function getCategories(): { id: string; label: string }[] {
  const gallery = loadGalleryConfig();
  return gallery.categories;
}