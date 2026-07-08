import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect } from "react";
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

export default function Home() {
  useEffect(() => {
    document.title = "Lara Cinematography — Cinematic Wedding Films & Visual Storytelling";
  }, []);
  const { data } = useSuspenseQuery(siteBundleQuery);
  return (
    <SiteLayout>
      <HeroSection hero={data.hero} />
      <AboutPreview about={data.about} />
      <ServicesSection services={data.services} />
      <PackagesSection packages={data.packages} />
      <AddOnsSection addons={data.addons} />
      <FeaturedFilms films={data.featured_portfolio} />
      <GalleryPreview items={data.featured_gallery} />
      <WhyChoose content={data.why_choose} />
      <TestimonialsSlider items={data.testimonials} />
      <InstagramFeed feed={data.instagram_feed} social={data.social} />
      <ContactCta />
    </SiteLayout>
  );
}