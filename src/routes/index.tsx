import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { siteBundleQuery } from "@/lib/queries";
import { SiteLayout } from "@/components/site/SiteLayout";
import { HeroSection } from "@/components/site/sections/HeroSection";
import { FeaturedFilms } from "@/components/site/sections/FeaturedFilms";
import { GalleryPreview } from "@/components/site/sections/GalleryPreview";
import { AboutPreview } from "@/components/site/sections/AboutPreview";
import { ServicesSection } from "@/components/site/sections/ServicesSection";
import { WhyChoose } from "@/components/site/sections/WhyChoose";
import { TestimonialsSlider } from "@/components/site/sections/TestimonialsSlider";
import { InstagramFeed } from "@/components/site/sections/InstagramFeed";
import { ContactCta } from "@/components/site/sections/ContactCta";

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(siteBundleQuery),
  component: Index,
  head: () => ({
    meta: [
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

function Index() {
  const { data } = useSuspenseQuery(siteBundleQuery);
  return (
    <SiteLayout>
      <HeroSection hero={data.hero} />
      <FeaturedFilms films={data.featured_portfolio} />
      <AboutPreview about={data.about} />
      <GalleryPreview items={data.featured_gallery} />
      <ServicesSection services={data.services} />
      <WhyChoose content={data.why_choose} />
      <TestimonialsSlider items={data.testimonials} />
      <InstagramFeed feed={data.instagram_feed} social={data.social} />
      <ContactCta />
    </SiteLayout>
  );
}
