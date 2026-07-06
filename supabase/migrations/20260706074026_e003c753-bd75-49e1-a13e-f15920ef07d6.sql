
CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TABLE public.site_content (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_content TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_content TO authenticated;
GRANT ALL ON public.site_content TO service_role;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read site_content" ON public.site_content FOR SELECT TO anon, authenticated USING (true);
CREATE TRIGGER trg_site_content_updated BEFORE UPDATE ON public.site_content FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.settings TO authenticated;
GRANT ALL ON public.settings TO service_role;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read settings" ON public.settings FOR SELECT TO anon, authenticated USING (true);
CREATE TRIGGER trg_settings_updated BEFORE UPDATE ON public.settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT 'Film',
  sort_order INT NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.services TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read services" ON public.services FOR SELECT TO anon, authenticated USING (active = true);
CREATE TRIGGER trg_services_updated BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.portfolio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Weddings',
  description TEXT NOT NULL DEFAULT '',
  youtube_url TEXT,
  vimeo_url TEXT,
  thumbnail_url TEXT,
  cover_url TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.portfolio TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.portfolio TO authenticated;
GRANT ALL ON public.portfolio TO service_role;
ALTER TABLE public.portfolio ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read portfolio" ON public.portfolio FOR SELECT TO anon, authenticated USING (true);
CREATE TRIGGER trg_portfolio_updated BEFORE UPDATE ON public.portfolio FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  alt TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'Weddings',
  featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.gallery TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery TO authenticated;
GRANT ALL ON public.gallery TO service_role;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read gallery" ON public.gallery FOR SELECT TO anon, authenticated USING (true);
CREATE TRIGGER trg_gallery_updated BEFORE UPDATE ON public.gallery FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT '',
  quote TEXT NOT NULL,
  avatar_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.testimonials TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.testimonials TO authenticated;
GRANT ALL ON public.testimonials TO service_role;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read testimonials" ON public.testimonials FOR SELECT TO anon, authenticated USING (true);
CREATE TRIGGER trg_testimonials_updated BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  event_date DATE,
  venue TEXT,
  service TEXT,
  budget TEXT,
  message TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.enquiries TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.enquiries TO authenticated;
GRANT ALL ON public.enquiries TO service_role;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can submit enquiries" ON public.enquiries FOR INSERT TO anon, authenticated WITH CHECK (true);

INSERT INTO public.site_content (key, value) VALUES
('hero', jsonb_build_object(
  'heading', 'Cinematic Wedding Films & Timeless Visual Storytelling',
  'subheading', 'Creating emotional films that preserve your most unforgettable moments.',
  'background_url', '',
  'background_type', 'image',
  'cta_primary_label', 'View Portfolio',
  'cta_primary_href', '/portfolio',
  'cta_secondary_label', 'Enquire Now',
  'cta_secondary_href', '/contact'
)),
('about', jsonb_build_object(
  'name', 'Lara',
  'tagline', 'Cinematographer & Storyteller',
  'portrait_url', '',
  'story', 'I''m Lara — a wedding and lifestyle cinematographer devoted to capturing the quiet, in-between moments that make a story feel real. Every film is crafted with intention, restraint, and a deep love for the couples and places I''m lucky enough to document.',
  'mission', 'To create timeless films that feel as alive in twenty years as they did on the day.',
  'approach', 'Unobtrusive, editorial, and emotionally led — with a deliberate cinematic eye.',
  'experience', '8+ years documenting weddings, elopements, and editorial commissions across the UK and Europe.'
)),
('why_choose', jsonb_build_object(
  'items', jsonb_build_array(
    jsonb_build_object('icon', 'Film', 'title', 'Cinematic Storytelling', 'description', 'Every film is edited as a story — not a highlight reel.'),
    jsonb_build_object('icon', 'Video', 'title', '4K Professional Quality', 'description', 'Shot and finished in high-resolution, colour-graded to a filmic standard.'),
    jsonb_build_object('icon', 'Plane', 'title', 'Drone Coverage', 'description', 'Licensed aerial cinematography for a sense of place and scale.'),
    jsonb_build_object('icon', 'Mic', 'title', 'Crystal Clear Audio', 'description', 'Multi-mic sound design so every vow, toast, and laugh is preserved.'),
    jsonb_build_object('icon', 'Clock', 'title', 'Timely Delivery', 'description', 'Sneak-peek within weeks, full film delivered on a clear schedule.'),
    jsonb_build_object('icon', 'Heart', 'title', 'Personal Experience', 'description', 'A calm, considered presence on your day — never intrusive.'),
    jsonb_build_object('icon', 'Camera', 'title', 'Multi-Camera Coverage', 'description', 'Two or more cameras for depth, coverage, and cinematic angles.')
  )
)),
('footer', jsonb_build_object(
  'tagline', 'Timeless films for the moments that matter.',
  'copyright', '© Lara Cinematography'
));

INSERT INTO public.settings (key, value) VALUES
('contact', jsonb_build_object(
  'email', 'hello@laracinematography.com',
  'phone', '+44 7000 000000',
  'whatsapp', '+447000000000',
  'address', 'London, United Kingdom',
  'hours', 'Mon–Fri, 9am–6pm'
)),
('social', jsonb_build_object(
  'instagram', 'https://instagram.com/',
  'facebook', '',
  'youtube', '',
  'tiktok', '',
  'vimeo', ''
)),
('instagram_feed', jsonb_build_object(
  'images', jsonb_build_array()
));

INSERT INTO public.services (title, description, icon, sort_order) VALUES
('Wedding Cinematography', 'Full-day coverage crafted into a heirloom wedding film.', 'Heart', 1),
('Engagement Films', 'Intimate, editorial pre-wedding films in a location you love.', 'Sparkles', 2),
('Destination Weddings', 'Passport-ready coverage worldwide, told with a sense of place.', 'Plane', 3),
('Elopements', 'Small, meaningful ceremonies documented with intimacy and grace.', 'Feather', 4),
('Commercial Films', 'Story-led brand and lifestyle films for considered brands.', 'Clapperboard', 5),
('Corporate Videos', 'Polished corporate storytelling — interviews, events, launches.', 'Briefcase', 6),
('Event Videography', 'Editorial coverage for private, cultural, and family events.', 'CalendarDays', 7),
('Social Media Reels', 'Vertical, short-form films crafted for Instagram and TikTok.', 'Smartphone', 8);

INSERT INTO public.testimonials (name, role, quote, sort_order) VALUES
('Sophia & James', 'Married in Tuscany', 'Watching our film for the first time felt like living the day again. Lara captured moments we never even saw — it is the greatest gift.', 1),
('Amelia & Ravi', 'London Wedding', 'Beyond cinematic. Every frame feels intentional, every cut emotional. We cannot recommend Lara enough.', 2),
('Isabella & Marcus', 'Cotswolds Elopement', 'Lara has an eye for the quiet moments most people miss. Our film is soft, honest, and completely us.', 3);
