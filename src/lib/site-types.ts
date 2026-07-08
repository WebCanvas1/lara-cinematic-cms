export type HeroContent = {
  heading: string;
  subheading: string;
  background_url: string;
  background_type: "image" | "video";
  cta_primary_label: string;
  cta_primary_href: string;
  cta_secondary_label: string;
  cta_secondary_href: string;
};

export type AboutContent = {
  name: string;
  tagline: string;
  portrait_url: string;
  story: string;
  mission: string;
  approach: string;
  experience: string;
};

export type WhyChooseItem = { icon: string; title: string; description: string };
export type WhyChooseContent = { items: WhyChooseItem[] };

export type FooterContent = { tagline: string; copyright: string };

export type ContactSettings = {
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  hours: string;
};

export type SocialSettings = {
  instagram: string;
  facebook: string;
  youtube: string;
  tiktok: string;
  vimeo: string;
};

export type InstagramFeed = { images: string[] };

export type Service = {
  id: string;
  title: string;
  description: string;
  icon: string;
  sort_order: number;
  active: boolean;
};

export type PortfolioItem = {
  id: string;
  title: string;
  category: string;
  description: string;
  youtube_url: string | null;
  vimeo_url: string | null;
  thumbnail_url: string | null;
  cover_url: string | null;
  featured: boolean;
  sort_order: number;
};

export type GalleryItem = {
  id: string;
  image_url: string;
  alt: string;
  category: string;
  featured: boolean;
  sort_order: number;
};

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatar_url: string | null;
  sort_order: number;
};

export type Enquiry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  event_date: string | null;
  venue: string | null;
  service: string | null;
  budget: string | null;
  message: string;
  created_at: string;
};

export type PackageItem = {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  image: string;
  badge?: string;
  description?: string;
  features: string[];
  buttonText: string;
  buttonLink?: string;
  active: boolean;
  featured: boolean;
  sort_order: number;
};

export type AddOnItem = {
  id: string;
  title: string;
  description: string;
  price: string;
  icon: string;
  active: boolean;
  sort_order: number;
};

export type SiteBundle = {
  hero: HeroContent;
  about: AboutContent;
  why_choose: WhyChooseContent;
  footer: FooterContent;
  contact: ContactSettings;
  social: SocialSettings;
  instagram_feed: InstagramFeed;
  services: Service[];
  featured_portfolio: PortfolioItem[];
  featured_gallery: GalleryItem[];
  testimonials: Testimonial[];
  packages: PackageItem[];
  addons: AddOnItem[];
};

export const PORTFOLIO_CATEGORIES = ["Weddings", "Engagements", "Events", "Commercial", "Reels"] as const;
export const GALLERY_CATEGORIES = ["Weddings", "Engagements", "Portraits", "Behind the Scenes"] as const;