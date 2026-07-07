// Default fallback content used when KV is empty. Kept in sync with the
// original seed migration so a fresh Cloudflare Pages deployment ships with
// polished copy immediately.

import type {
  Service,
  PortfolioItem,
  GalleryItem,
  Testimonial,
  Enquiry,
} from "../../src/lib/site-types";

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

export const DEFAULT_PORTFOLIO: PortfolioItem[] = [];
export const DEFAULT_GALLERY: GalleryItem[] = [];

export const DEFAULT_TESTIMONIALS: Testimonial[] = [
  { id: "t-1", name: "Sophia & James", role: "Married in Tuscany", quote: "Watching our film for the first time felt like living the day again. Lara captured moments we never even saw — it is the greatest gift.", avatar_url: null, sort_order: 1 },
  { id: "t-2", name: "Amelia & Ravi", role: "London Wedding", quote: "Beyond cinematic. Every frame feels intentional, every cut emotional. We cannot recommend Lara enough.", avatar_url: null, sort_order: 2 },
  { id: "t-3", name: "Isabella & Marcus", role: "Cotswolds Elopement", quote: "Lara has an eye for the quiet moments most people miss. Our film is soft, honest, and completely us.", avatar_url: null, sort_order: 3 },
];

export const DEFAULT_ENQUIRIES: Enquiry[] = [];

export const DEFAULTS = {
  "site-content": DEFAULT_CONTENT,
  settings: DEFAULT_SETTINGS,
  services: DEFAULT_SERVICES,
  portfolio: DEFAULT_PORTFOLIO,
  gallery: DEFAULT_GALLERY,
  testimonials: DEFAULT_TESTIMONIALS,
  enquiries: DEFAULT_ENQUIRIES,
} as const;