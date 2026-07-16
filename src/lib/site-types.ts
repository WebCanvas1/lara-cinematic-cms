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
  experience?: string;
};

export type WhyChooseItem = {
  icon: string;
  title: string;
  description: string;
};

export type WhyChooseContent = {
  items: WhyChooseItem[];
};

export type FooterContent = {
  tagline: string;
  copyright: string;
};

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

export type InstagramFeed = {
  images: string[];
};

export type Service = {
  id: string;
  title: string;
  description: string;
  icon: string;
  sort_order: number;
  active: boolean;
};

export type PortfolioCategory = "Photography" | "Videography";

export type PortfolioSubcategory = {
  id: string;
  name: string;
  slug: string;
  media_type: PortfolioCategory;
  description?: string;
  cover_image?: string;
  active: boolean;
  sort_order: number;
};

export type PortfolioItem = {
  id: string;
  title: string;

  // Broad portfolio type.
  category: PortfolioCategory;

  // Custom category created from the admin panel.
  category_id?: string;

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

  // Custom Photography category created from the admin panel.
  category_id?: string;

  // Retained temporarily for backwards compatibility.
  category?: string;

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

export type PackageAddon = {
  title: string;
  price?: string;
};

/**
 * Legacy package categories retained temporarily for existing package data.
 */
export type PackageCategory = "Wedding" | "Events";

/**
 * Dynamic package category created from the admin panel.
 *
 * Examples:
 * - Wedding Packages
 * - Corporate Events
 * - Birthday Packages
 * - Baby Shower Packages
 */
export type PackageSubcategory = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  cover_image?: string;
  active: boolean;
  sort_order: number;
};

export type PackageItem = {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  image: string;
  badge?: string;
  description?: string;
  long_description?: string;
  features: string[];
  addons?: PackageAddon[];

  /**
   * Dynamic package category selected in the admin panel.
   */
  category_id?: string;

  /**
   * Legacy Wedding / Events value retained temporarily so existing packages
   * continue working while they are assigned to dynamic categories.
   */
  category?: PackageCategory | string;

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

export type TeamMember = {
  id: string;
  image: string;
  name: string;
  role: string;
  description: string;
  active: boolean;
  sort_order: number;
};

export type AboutMainContent = {
  eyebrow?: string;
  title: string;
  description: string;
  image: string;
};

export type NavChild = {
  label: string;
  href: string;
  enabled?: boolean;
};

export type NavItem = {
  id: string;
  label: string;
  href?: string;
  enabled?: boolean;
  children?: NavChild[];
};

export type NavConfig = {
  items: NavItem[];
};

export const DEFAULT_NAV: NavConfig = {
  items: [
    {
      id: "home",
      label: "Home",
      href: "/",
      enabled: true,
    },
    {
      id: "portfolio",
      label: "Portfolio",
      enabled: true,
      children: [
        {
          label: "Photography",
          href: "/portfolio/photography",
          enabled: true,
        },
        {
          label: "Videography",
          href: "/portfolio/videography",
          enabled: true,
        },
      ],
    },
    {
      id: "packages",
      label: "Packages",
      enabled: true,
      children: [
        {
          label: "Wedding Packages",
          href: "/packages/weddings",
          enabled: true,
        },
        {
          label: "Events",
          href: "/packages/events",
          enabled: true,
        },
      ],
    },
    {
      id: "about",
      label: "About",
      href: "/about",
      enabled: true,
    },
    {
      id: "contact",
      label: "Contact",
      href: "/contact",
      enabled: true,
    },
  ],
};

export type SiteBundle = {
  hero: HeroContent;
  about: AboutContent;
  about_main?: AboutMainContent;
  team: TeamMember[];
  nav?: NavConfig;
  why_choose: WhyChooseContent;
  footer: FooterContent;
  contact: ContactSettings;
  social: SocialSettings;
  instagram_feed: InstagramFeed;
  services: Service[];

  featured_portfolio: PortfolioItem[];
  featured_gallery: GalleryItem[];

  // Dynamic portfolio categories created from the admin panel.
  portfolio_categories: PortfolioSubcategory[];

  testimonials: Testimonial[];

  packages: PackageItem[];

  // Dynamic package categories created from the admin panel.
  package_categories: PackageSubcategory[];

  addons: AddOnItem[];
  layout?: HomepageSection[];
};

export const PORTFOLIO_CATEGORIES = [
  "Photography",
  "Videography",
] as const;

/**
 * Legacy package categories retained temporarily so existing package forms,
 * routes and saved packages do not break during migration.
 *
 * New package categories should come from package_categories.
 */
export const PACKAGE_CATEGORIES = [
  "Wedding",
  "Events",
] as const;

/**
 * Legacy gallery categories retained temporarily so existing code does not
 * break. New Photography categories should come from portfolio_categories.
 */
export const GALLERY_CATEGORIES = [
  "Weddings",
  "Engagements",
  "Portraits",
  "Behind the Scenes",
] as const;

export type HeadingConfig = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  showHeading?: boolean;
  showSubtitle?: boolean;
  titleFontSize?: number;
  subtitleFontSize?: number;
  eyebrowFontSize?: number;
  titleColor?: string;
  subtitleColor?: string;
  eyebrowColor?: string;
  fontWeight?: string;
  textAlign?: "left" | "center" | "right";
  maxWidth?: string;
};

export type HomepageSectionId =
  | "hero"
  | "about"
  | "services"
  | "packages"
  | "addons"
  | "portfolio"
  | "gallery"
  | "whychoose"
  | "testimonials"
  | "instagram"
  | "contact";

export type HomepageSection = {
  id: HomepageSectionId;
  label: string;
  enabled: boolean;
  sort_order: number;
  heading: HeadingConfig;
};

export const DEFAULT_HOMEPAGE_SECTIONS: HomepageSection[] = [
  {
    id: "hero",
    label: "Hero",
    enabled: true,
    sort_order: 1,
    heading: {},
  },
  {
    id: "about",
    label: "About",
    enabled: true,
    sort_order: 2,
    heading: {},
  },
  {
    id: "services",
    label: "Services",
    enabled: true,
    sort_order: 3,
    heading: {},
  },
  {
    id: "packages",
    label: "Packages",
    enabled: true,
    sort_order: 4,
    heading: {},
  },
  {
    id: "addons",
    label: "Add-ons",
    enabled: true,
    sort_order: 5,
    heading: {},
  },
  {
    id: "portfolio",
    label: "Portfolio",
    enabled: true,
    sort_order: 6,
    heading: {},
  },
  {
    id: "gallery",
    label: "Gallery",
    enabled: true,
    sort_order: 7,
    heading: {},
  },
  {
    id: "whychoose",
    label: "Why Choose",
    enabled: true,
    sort_order: 8,
    heading: {},
  },
  {
    id: "testimonials",
    label: "Testimonials",
    enabled: true,
    sort_order: 9,
    heading: {},
  },
  {
    id: "instagram",
    label: "Instagram / Social Feed",
    enabled: true,
    sort_order: 10,
    heading: {},
  },
  {
    id: "contact",
    label: "Contact / Enquiry",
    enabled: true,
    sort_order: 11,
    heading: {},
  },
];
