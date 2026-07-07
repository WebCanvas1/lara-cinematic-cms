import "./styles.css";
import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { App } from "./App";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, refetchOnWindowFocus: false } },
});

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <ScrollToTop />
        <App />
      </HashRouter>
      <Toaster position="top-center" richColors closeButton />
    </QueryClientProvider>
  </StrictMode>,
);
