// TypeScript types for Pholio content

export interface SiteConfig {
  site: {
    name: string;
    url: string;
    language: string;
    description: string;
  };
  creator: {
    name: string;
    disciplines: string[];
    tagline: string;
    bio: string;
    location: string;
    portrait: ImageRef;
  };
  hero: {
    image: ImageRef;
  };
  contact: {
    email: string;
    availability: string;
  };
  social: SocialLink[];
  features: {
    shopEnabled: boolean;
  };
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface ImageRef {
  src: string; // base key, resolved via image manifest
  alt: string;
}

export interface GalleryConfig {
  categories: Category[];
  works: Work[];
}

export interface Category {
  id: string;
  label: string;
}

export type WorkType = 'photo' | 'design' | 'artwork' | 'video';

export interface Work {
  id: string;
  slug: string;
  title: string;
  type: WorkType;
  category: string;
  year: number;
  featured: boolean;
  order: number;
  cover: ImageRef;
  images?: ImageRef[]; // for photo, design, artwork
  video?: VideoEmbed; // for video type
  description: string;
  details: Detail[];
  productId?: string; // optional, Mode B only
}

export interface Detail {
  label: string;
  value: string;
}

export interface VideoEmbed {
  provider: 'youtube' | 'vimeo' | 'file';
  id: string; // video ID for youtube/vimeo, URL for file
}

export interface ProductConfig {
  products: Product[];
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
  preview: ImageRef;
  price: {
    amount: number;
    currency: string;
  };
  license: {
    label: string;
    summary: string;
  };
  file: {
    format: string;
    resolution: string;
  };
  checkoutUrl: string;
  status: 'available' | 'unavailable';
}

export interface ImageManifest {
  [key: string]: ImageManifestEntry;
}

export interface ImageManifestEntry {
  width: number;
  height: number;
  variants: ImageVariant[];
}

export interface ImageVariant {
  w: number;
  src: string;
}

// Feature flag type
export interface Features {
  shopEnabled: boolean;
}