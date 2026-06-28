import { useState, useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import AdminPanel from "@/components/AdminPanel";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [adminOpen, setAdminOpen] = useState(false);

  useEffect(() => {
    function getKey() {
      try {
        const s = JSON.parse(localStorage.getItem("admin_settings") || "{}");
        return (s.shortcutKey || "6").toLowerCase();
      } catch { return "6"; }
    }

    function handleKey(e: KeyboardEvent) {
      const target = getKey();
      const pressed = e.key.toLowerCase();
      const codeMatch = e.code === `Digit${target}` || e.code === `Key${target.toUpperCase()}`;
      if (e.ctrlKey && e.shiftKey && (pressed === target || codeMatch)) {
        e.preventDefault();
        setAdminOpen(v => !v);
      }
    }

    window.addEventListener("keydown", handleKey);
    window.addEventListener("admin-settings-changed", () => {});
    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("admin-settings-changed", () => {});
    };
  }, []);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="portfolio-theme">
      <LanguageProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
            <AdminPanel open={adminOpen} onClose={() => setAdminOpen(false)} />
          </TooltipProvider>
        </QueryClientProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
