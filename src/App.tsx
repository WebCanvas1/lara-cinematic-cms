import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

const Home = lazy(() => import("./pages/Home"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const Gallery = lazy(() => import("./pages/Gallery"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminUnlock = lazy(() => import("./pages/AdminUnlock"));
const NotFound = lazy(() => import("./pages/NotFound"));

function LoadingSplash() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-[0.7rem] uppercase tracking-[0.28em] text-muted-foreground">
        Loading…
      </div>
    </div>
  );
}

export function App() {
  return (
    <Suspense fallback={<LoadingSplash />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/unlock" element={<AdminUnlock />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}