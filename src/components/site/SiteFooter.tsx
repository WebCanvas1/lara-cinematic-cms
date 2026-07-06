import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Youtube, Music2, Video } from "lucide-react";
import type { ContactSettings, FooterContent, SocialSettings } from "@/lib/site-types";

export function SiteFooter({
  footer, contact, social,
}: { footer: FooterContent; contact: ContactSettings; social: SocialSettings }) {
  const socials: [string, React.ComponentType<{ className?: string }>][] = [
    [social.instagram, Instagram],
    [social.facebook, Facebook],
    [social.youtube, Youtube],
    [social.tiktok, Music2],
    [social.vimeo, Video],
  ];
  return (
    <footer className="border-t border-border bg-cream mt-24">
      <div className="container-editorial grid gap-12 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl text-ink">Lara</span>
            <span className="eyebrow">Cinematography</span>
          </div>
          <p className="mt-4 max-w-sm font-serif text-lg italic leading-relaxed text-foreground/80">
            {footer.tagline}
          </p>
        </div>

        <div>
          <div className="eyebrow mb-4">Explore</div>
          <ul className="space-y-2 text-sm text-foreground/80">
            <li><Link to="/portfolio" className="hover:text-gold">Portfolio</Link></li>
            <li><Link to="/gallery" className="hover:text-gold">Gallery</Link></li>
            <li><Link to="/about" className="hover:text-gold">About</Link></li>
            <li><Link to="/contact" className="hover:text-gold">Contact</Link></li>
          </ul>
        </div>

        <div>
          <div className="eyebrow mb-4">Studio</div>
          <ul className="space-y-2 text-sm text-foreground/80">
            {contact.email && <li><a href={`mailto:${contact.email}`} className="hover:text-gold">{contact.email}</a></li>}
            {contact.phone && <li><a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="hover:text-gold">{contact.phone}</a></li>}
            {contact.address && <li>{contact.address}</li>}
            {contact.hours && <li className="text-muted-foreground">{contact.hours}</li>}
          </ul>
          <div className="mt-5 flex gap-4">
            {socials.filter(([href]) => Boolean(href)).map(([href, Icon], i) => (
              <a key={i} href={href} target="_blank" rel="noreferrer" className="text-foreground/60 hover:text-gold">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-border py-6">
        <div className="container-editorial flex flex-col items-center justify-between gap-2 text-xs uppercase tracking-[0.24em] text-muted-foreground md:flex-row">
          <span>{footer.copyright} {new Date().getFullYear()}</span>
          <Link to="/admin" className="hover:text-gold">Admin</Link>
        </div>
      </div>
    </footer>
  );
}