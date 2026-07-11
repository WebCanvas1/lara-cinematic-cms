import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, type ReactNode } from "react";
import { siteBundleQuery } from "@/lib/queries";
import { SiteLayout } from "@/components/site/SiteLayout";
import { HeroSection } from "@/components/site/sections/HeroSection";
import { FeaturedFilms } from "@/components/site/sections/FeaturedFilms";
import { GalleryPreview } from "@/components/site/sections/GalleryPreview";
import { AboutPreview } from "@/components/site/sections/AboutPreview";
import { ServicesSection } from "@/components/site/sections/ServicesSection";
import { PackagesSection } from "@/components/site/sections/PackagesSection";
import { AddOnsSection } from "@/components/site/sections/AddOnsSection";
import { WhyChoose } from "@/components/site/sections/WhyChoose";
import { TestimonialsSlider } from "@/components/site/sections/TestimonialsSlider";
import { InstagramFeed } from "@/components/site/sections/InstagramFeed";
import { ContactCta } from "@/components/site/sections/ContactCta";
import { DEFAULT_HOMEPAGE_SECTIONS, type HeadingConfig, type HomepageSectionId, type SiteBundle } from "@/lib/site-types";

type SectionRenderer = (data: SiteBundle, heading?: HeadingConfig) => ReactNode;

const RENDERERS: Record<HomepageSectionId, SectionRenderer> = {
  hero: (d) => <HeroSection hero={d.hero} />,
  about: (d, h) => <AboutPreview about={d.about} heading={h} />,
  services: (d, h) => <ServicesSection services={d.services} heading={h} />,
  packages: (d, h) => <PackagesSection packages={d.packages} heading={h} variant="preview" />,
  addons: (d, h) => <AddOnsSection addons={d.addons} heading={h} />,
  portfolio: (d, h) => <FeaturedFilms films={d.featured_portfolio} heading={h} />,
  gallery: (d, h) => <GalleryPreview items={d.featured_gallery} heading={h} />,
  whychoose: (d, h) => <WhyChoose content={d.why_choose} heading={h} />,
  testimonials: (d, h) => <TestimonialsSlider items={d.testimonials} heading={h} />,
  instagram: (d, h) => <InstagramFeed feed={d.instagram_feed} social={d.social} heading={h} />,
  contact: (_, h) => <ContactCta heading={h} />,
};

export default function Home() {
  useEffect(() => {
    document.title = "Lara Cinematography — Cinematic Wedding Films & Visual Storytelling";
  }, []);
  const { data } = useSuspenseQuery(siteBundleQuery);
  const layout =
    Array.isArray(data.layout) && data.layout.length > 0 ? data.layout : DEFAULT_HOMEPAGE_SECTIONS;
  const ordered = [...layout]
    .filter((s) => s.enabled !== false && RENDERERS[s.id as HomepageSectionId])
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  return (
    <SiteLayout>
      {ordered.map((section) => (
        <div key={section.id}>{RENDERERS[section.id as HomepageSectionId](data, section.heading)}</div>
      ))}
    </SiteLayout>
  );
}