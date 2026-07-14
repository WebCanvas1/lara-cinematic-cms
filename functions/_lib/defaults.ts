// Default fallback content used when KV is empty. Kept in sync with the
// original seed migration so a fresh Cloudflare Pages deployment ships with
// polished copy immediately.

import type {
  Service,
  PortfolioItem,
  GalleryItem,
  Testimonial,
  Enquiry,
  PackageItem,
  AddOnItem,
  TeamMember,
  PortfolioSubcategory,
} from "../../src/lib/site-types";
import { DEFAULT_HOMEPAGE_SECTIONS, DEFAULT_NAV, type HomepageSection } from "../../src/lib/site-types";

type ContentMap = Record<string, unknown>;
type SettingsMap = Record<string, unknown>;

export const DEFAULT_CONTENT: ContentMap = {
  hero: {
    heading: "Cinematic Wedding Films & Timeless Visual Storytelling",
    subheading: "Creating emotional films that preserve your most unforgettable moments.",
    background_url: "",
    background_type: "image",
    cta_primary_label: "View Portfolio",
    cta_primary_href: "/portfolio",
    cta_secondary_label: "Enquire Now",
    cta_secondary_href: "/contact",
  },
  about: {
    name: "Lara",
    tagline: "Cinematographer & Storyteller",
    portrait_url: "",
    story:
      "I'm Lara — a wedding and lifestyle cinematographer devoted to capturing the quiet, in-between moments that make a story feel real. Every film is crafted with intention, restraint, and a deep love for the couples and places I'm lucky enough to document.",
    mission: "To create timeless films that feel as alive in twenty years as they did on the day.",
    approach: "Unobtrusive, editorial, and emotionally led — with a deliberate cinematic eye.",
    experience:
      "8+ years documenting weddings, elopements, and editorial commissions across the UK and Europe.",
  },
  about_main: {
    eyebrow: "About",
    title: "About Lara Cinematography",
    description:
      "A boutique studio devoted to cinematic wedding films and editorial photography. Every frame is crafted with intention — soft, warm, and unmistakably you.",
    image: "",
  },
  navigation: DEFAULT_NAV,
  why_choose: {
    items: [
      { icon: "Film", title: "Cinematic Storytelling", description: "Every film is edited as a story — not a highlight reel." },
      { icon: "Video", title: "4K Professional Quality", description: "Shot and finished in high-resolution, colour-graded to a filmic standard." },
      { icon: "Plane", title: "Drone Coverage", description: "Licensed aerial cinematography for a sense of place and scale." },
      { icon: "Mic", title: "Crystal Clear Audio", description: "Multi-mic sound design so every vow, toast, and laugh is preserved." },
      { icon: "Clock", title: "Timely Delivery", description: "Sneak-peek within weeks, full film delivered on a clear schedule." },
      { icon: "Heart", title: "Personal Experience", description: "A calm, considered presence on your day — never intrusive." },
      { icon: "Camera", title: "Multi-Camera Coverage", description: "Two or more cameras for depth, coverage, and cinematic angles." },
    ],
  },
  footer: {
    tagline: "Timeless films for the moments that matter.",
    copyright: "© Lara Cinematography",
  },
};

export const DEFAULT_SETTINGS: SettingsMap = {
  contact: {
    email: "hello@laracinematography.com",
    phone: "+44 7000 000000",
    whatsapp: "+447000000000",
    address: "London, United Kingdom",
    hours: "Mon–Fri, 9am–6pm",
  },
  social: {
    instagram: "https://instagram.com/",
    facebook: "",
    youtube: "",
    tiktok: "",
    vimeo: "",
  },
  instagram_feed: { images: [] },
};

export const DEFAULT_SERVICES: Service[] = [
  { id: "svc-1", title: "Wedding Cinematography", description: "Full-day coverage crafted into a heirloom wedding film.", icon: "Heart", sort_order: 1, active: true },
  { id: "svc-2", title: "Engagement Films", description: "Intimate, editorial pre-wedding films in a location you love.", icon: "Sparkles", sort_order: 2, active: true },
  { id: "svc-3", title: "Destination Weddings", description: "Passport-ready coverage worldwide, told with a sense of place.", icon: "Plane", sort_order: 3, active: true },
  { id: "svc-4", title: "Elopements", description: "Small, meaningful ceremonies documented with intimacy and grace.", icon: "Feather", sort_order: 4, active: true },
  { id: "svc-5", title: "Commercial Films", description: "Story-led brand and lifestyle films for considered brands.", icon: "Clapperboard", sort_order: 5, active: true },
  { id: "svc-6", title: "Corporate Videos", description: "Polished corporate storytelling — interviews, events, launches.", icon: "Briefcase", sort_order: 6, active: true },
  { id: "svc-7", title: "Event Videography", description: "Editorial coverage for private, cultural, and family events.", icon: "CalendarDays", sort_order: 7, active: true },
  { id: "svc-8", title: "Social Media Reels", description: "Vertical, short-form films crafted for Instagram and TikTok.", icon: "Smartphone", sort_order: 8, active: true },
];

// Default dynamic portfolio categories used when KV has no saved categories.
export const DEFAULT_PORTFOLIO_CATEGORIES: PortfolioSubcategory[] = [
  {
    id: "photo-uncategorised",
    name: "Uncategorised",
    slug: "uncategorised",
    media_type: "Photography",
    description: "",
    cover_image: "",
    active: true,
    sort_order: 1,
  },
  {
    id: "video-uncategorised",
    name: "Uncategorised",
    slug: "uncategorised",
    media_type: "Videography",
    description: "",
    cover_image: "",
    active: true,
    sort_order: 1,
  },
];

export const DEFAULT_PORTFOLIO: PortfolioItem[] = [];
export const DEFAULT_TEAM: TeamMember[] = [];
export const DEFAULT_GALLERY: GalleryItem[] = [];

export const DEFAULT_TESTIMONIALS: Testimonial[] = [
  { id: "t-1", name: "Sophia & James", role: "Married in Tuscany", quote: "Watching our film for the first time felt like living the day again. Lara captured moments we never even saw — it is the greatest gift.", avatar_url: null, sort_order: 1 },
  { id: "t-2", name: "Amelia & Ravi", role: "London Wedding", quote: "Beyond cinematic. Every frame feels intentional, every cut emotional. We cannot recommend Lara enough.", avatar_url: null, sort_order: 2 },
  { id: "t-3", name: "Isabella & Marcus", role: "Cotswolds Elopement", quote: "Lara has an eye for the quiet moments most people miss. Our film is soft, honest, and completely us.", avatar_url: null, sort_order: 3 },
];

export const DEFAULT_ENQUIRIES: Enquiry[] = [];

export const DEFAULT_PACKAGES: PackageItem[] = [
  {
    id: "pkg-1",
    name: "Essential Photography",
    subtitle: "Half-day coverage",
    price: "£1,450",
    image: "",
    badge: "",
    description: "A refined photography-only package for intimate ceremonies and elopements.",
    long_description: "A refined, photography-only collection designed for intimate ceremonies and elopements. Includes a single lead photographer, editorial coverage, and a heirloom online gallery.",
    category: "Wedding",
    addons: [],
    features: [
      "Up to 6 hours coverage",
      "One lead photographer",
      "300+ edited images",
      "Private online gallery",
      "Print release included",
    ],
    buttonText: "Enquire Now",
    buttonLink: "/contact",
    active: true,
    featured: false,
    sort_order: 1,
  },
  {
    id: "pkg-2",
    name: "Classic Coverage",
    subtitle: "Full-day photography",
    price: "£2,250",
    image: "",
    badge: "",
    description: "Full-day editorial photography, from morning preparations to first dances.",
    features: [
      "Up to 10 hours coverage",
      "Lead photographer + assistant",
      "500+ edited images",
      "Engagement session",
      "Heirloom online gallery",
    ],
    buttonText: "Enquire Now",
    buttonLink: "/contact",
    active: true,
    featured: false,
    sort_order: 2,
  },
  {
    id: "pkg-3",
    name: "Cinematic Duo",
    subtitle: "Photography + Film",
    price: "£3,850",
    image: "",
    badge: "Most Popular",
    description: "Our signature pairing — a cinematic film alongside heirloom photography.",
    features: [
      "Full-day photo + video coverage",
      "Two-person creative team",
      "500+ edited images",
      "5–7 minute highlight film",
      "Cinematic teaser trailer",
      "Private online gallery",
    ],
    buttonText: "Enquire Now",
    buttonLink: "/contact",
    active: true,
    featured: true,
    sort_order: 3,
  },
  {
    id: "pkg-4",
    name: "Ultimate Collection",
    subtitle: "The complete experience",
    price: "£5,650",
    image: "",
    badge: "",
    description: "Every detail, every angle — the fullest, most cinematic wedding experience.",
    features: [
      "Two photographers + two filmmakers",
      "Extended full-day coverage",
      "700+ edited images",
      "Feature-length film (15–20 min)",
      "Highlight film + teaser",
      "Drone coverage included",
      "Engagement session",
    ],
    buttonText: "Enquire Now",
    buttonLink: "/contact",
    active: true,
    featured: false,
    sort_order: 4,
  },
];

export const DEFAULT_ADDONS: AddOnItem[] = [
  { id: "add-1", title: "Extended Hours", description: "Additional hours of coverage beyond your package.", price: "£250 / hr", icon: "Clock", active: true, sort_order: 1 },
  { id: "add-2", title: "Full-Length Edited Video", description: "A longer, documentary-style edit of your full day.", price: "£850", icon: "Film", active: true, sort_order: 2 },
  { id: "add-3", title: "Drone Coverage", description: "Licensed aerial cinematography for a cinematic sense of scale.", price: "£450", icon: "Plane", active: true, sort_order: 3 },
  { id: "add-4", title: "Extra Photographer", description: "A second photographer for wider coverage and angles.", price: "£550", icon: "Camera", active: true, sort_order: 4 },
  { id: "add-5", title: "Same-Day Teaser", description: "A short teaser edit delivered on the evening of your wedding.", price: "£400", icon: "Sparkles", active: true, sort_order: 5 },
  { id: "add-6", title: "Raw Footage", description: "All original unedited photo and video files, hand-delivered.", price: "£350", icon: "HardDrive", active: true, sort_order: 6 },
];

export const DEFAULTS = {
  "site-content": DEFAULT_CONTENT,
  settings: DEFAULT_SETTINGS,
  services: DEFAULT_SERVICES,
  portfolio: DEFAULT_PORTFOLIO,
  "portfolio-categories": DEFAULT_PORTFOLIO_CATEGORIES,
  gallery: DEFAULT_GALLERY,
  testimonials: DEFAULT_TESTIMONIALS,
  enquiries: DEFAULT_ENQUIRIES,
  packages: DEFAULT_PACKAGES,
  addons: DEFAULT_ADDONS,
  team: DEFAULT_TEAM,
  "homepage-layout": DEFAULT_HOMEPAGE_SECTIONS as HomepageSection[],
} as const;
