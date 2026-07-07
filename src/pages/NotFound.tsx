import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  useEffect(() => {
    document.title = "Page not found — Lara Cinematography";
  }, []);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-7xl text-ink">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center bg-ink px-6 py-3 text-[0.72rem] uppercase tracking-[0.28em] text-background hover:bg-gold"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}