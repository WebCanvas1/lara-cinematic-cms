import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Youtube, Music2, Video } from "lucide-react";
import type {
  ContactSettings,
  FooterContent,
  SocialSettings,
} from "@/lib/site-types";
import laraLogo from "@/assets/lara-logo.png";

export function SiteFooter({
  footer,
  contact,
  social,
}: {
  footer: FooterContent;
  contact: ContactSettings;
  social: SocialSettings;
}) {
  const socials: [string, React.ComponentType<{ className?: string }>][] = [
    [social.instagram, Instagram],
    [social.facebook, Facebook],
    [social.youtube, Youtube],
    [social.tiktok, Music2],
    [social.vimeo, Video],
  ];

  return (
    <footer className="mt-24 border-t border-border bg-cream">
      <div className="container-editorial grid gap-12 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link
            to="/"
            aria-label="Lara Cinematography — Home"
            className="inline-block"
          >
            <img
              src={laraLogo}
              alt="Lara Cinematography"
              className="h-auto w-[220px] object-contain transition-transform duration-300 hover:scale-105 md:w-[280px]"
            />
          </Link>

          <p className="mt-6 max-w-sm font-serif text-lg italic leading-relaxed text-foreground/80">
            {footer.tagline}
          </p>
        </div>

        <div>
          <div className="eyebrow mb-4">Explore</div>

          <ul className="space-y-2 text-sm text-foreground/80">
            <li>
              <Link to="/" className="hover:text-gold">
                Home
              </Link>
            </li>

            <li>
              <Link
                to="/portfolio/photography"
                className="hover:text-gold"
              >
                Photography
              </Link>
            </li>

            <li>
              <Link
                to="/portfolio/videography"
                className="hover:text-gold"
              >
                Videography
              </Link>
            </li>

            <li>
              <Link
                to="/packages/weddings"
                className="hover:text-gold"
              >
                Wedding Packages
              </Link>
            </li>

            <li>
              <Link
                to="/packages/events"
                className="hover:text-gold"
              >
                Events
              </Link>
            </li>

            <li>
              <Link to="/about" className="hover:text-gold">
                About
              </Link>
            </li>

            <li>
              <Link to="/contact" className="hover:text-gold">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <div className="eyebrow mb-4">Studio</div>

          <ul className="space-y-2 text-sm text-foreground/80">
            {contact.email && (
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="hover:text-gold"
                >
                  {contact.email}
                </a>
              </li>
            )}

            {contact.phone && (
              <li>
                <a
                  href={`tel:${contact.phone.replace(/\s/g, "")}`}
                  className="hover:text-gold"
                >
                  {contact.phone}
                </a>
              </li>
            )}

            {contact.address && <li>{contact.address}</li>}

            {contact.hours && (
              <li className="text-muted-foreground">
                {contact.hours}
              </li>
            )}
          </ul>

          <div className="mt-5 flex gap-4">
            {socials
              .filter(([href]) => Boolean(href))
              .map(([href, Icon], i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-foreground/60 transition-colors hover:text-gold"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
          </div>
        </div>
      </div>

      <div className="border-t border-border py-6">
        <div className="container-editorial flex flex-col items-center justify-between gap-2 text-xs uppercase tracking-[0.24em] text-muted-foreground md:flex-row">
          <span>
            {footer.copyright} {new Date().getFullYear()}
          </span>

          <Link to="/admin" className="hover:text-gold">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
