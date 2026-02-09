import { useState, useEffect, useRef, useCallback } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  Scale,
  Phone,
  Home,
  Briefcase,
  Users,
  Zap,
  Settings,
  Star,
  Mail,
  Megaphone,
} from "lucide-react";

const navItems = [
  { label: "Accueil", path: "/", icon: Home },
  { label: "Services", path: "/services", icon: Briefcase },
  { label: "Équipe", path: "/equipe", icon: Users },
  { label: "LegalTech", path: "/legaltech", icon: Zap },
  { label: "Processus", path: "/processus", icon: Settings },
  { label: "Témoignages", path: "/temoignages", icon: Star },
  { label: "Annonces", path: "/annonces", icon: Megaphone },
  { label: "Contact", path: "/contact", icon: Mail },
];

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logoAvailable, setLogoAvailable] = useState(true);
  const navRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const underlineRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // keep a CSS variable with the header height so page heroes can offset themselves
  useEffect(() => {
    const headerEl = headerRef.current;
    const setVar = () => {
      try {
        const h = headerEl ? Math.round(headerEl.getBoundingClientRect().height) : 56;
        document.documentElement.style.setProperty("--site-header-height", `${h}px`);
      } catch (e) {
        // ignore
      }
    };
    setVar();
    window.addEventListener("resize", setVar);
    return () => window.removeEventListener("resize", setVar);
  }, []);

  // update underline position to match active nav link
  const updateUnderline = useCallback(() => {
    const nav = navRef.current;
    const underline = underlineRef.current;
    if (!nav || !underline) return;
    // Prefer aria-current set by react-router
    let active = nav.querySelector<HTMLElement>("[aria-current='page']");

    // Fallback: if no aria-current (e.g. visiting /services.html or a static path),
    // try to match the nav link whose href pathname matches the current location.
    if (!active) {
      try {
        const locPath = location.pathname || window.location.pathname;
        const normalize = (p: string) => p.replace(/\/+$|\.html$/g, "");
        const links = Array.from(nav.querySelectorAll<HTMLAnchorElement>("a[href]"));
        active = links.find((a) => {
          try {
            const url = new URL(a.href, window.location.origin);
            return normalize(url.pathname) === normalize(locPath);
          } catch (e) {
            return false;
          }
        }) as HTMLElement | undefined;
      } catch (e) {
        // ignore
      }
    }

    if (active) {
      const navRect = nav.getBoundingClientRect();
      const aRect = active.getBoundingClientRect();
      const left = aRect.left - navRect.left;
      underline.style.width = `${aRect.width}px`;
      underline.style.transform = `translateX(${left}px)`;
      underline.style.opacity = "1";
    } else {
      underline.style.opacity = "0";
    }
  }, [location.pathname]);

  useEffect(() => {
    updateUnderline();
    // reposition underline on resize
    window.addEventListener("resize", updateUnderline);
    return () => window.removeEventListener("resize", updateUnderline);
  }, [updateUnderline]);

  // reposition underline whenever the route changes so the active link gets highlighted
  useEffect(() => {
    updateUnderline();
    // also run a microtask after navigation to ensure DOM updated
    const t = setTimeout(updateUnderline, 50);
    return () => clearTimeout(t);
  }, [location.pathname, updateUnderline]);

  return (
  <header ref={headerRef} className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 site-header bg-white border-b shadow-sm`}>
      <div className="container mx-auto px-4">
  <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0" aria-label="Axe Legal - Accueil">
            {logoAvailable ? (
              <div className="w-[120px] sm:w-[150px] lg:w-[180px] h-10 sm:h-11 lg:h-12 flex items-center">
                <img
                  src="/assets/images/logo.png"
                  alt="Axe Legal"
                  className="h-full w-full object-contain object-left transition-transform group-hover:scale-105"
                  onError={() => setLogoAvailable(false)}
                />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-lg bg-gradient-to-br from-primary to-primary/80 shadow-md">
                  <Scale className="h-5 w-5 sm:h-5.5 sm:w-5.5 lg:h-6 lg:w-6 text-white" />
                </div>
                <div className="leading-tight">
                  <div className="text-base sm:text-lg lg:text-xl font-display font-extrabold text-foreground">
                    Axe <span className="text-primary">Legal</span>
                  </div>
                  <div className="text-xs text-muted-foreground -mt-0.5 hidden sm:block">Conseil & Défense</div>
                </div>
              </div>
            )}
          </Link>

          {/* Desktop Nav */}
          <nav ref={navRef} className="hidden xl:flex items-center gap-4 relative flex-1 justify-center mx-4" aria-label="Navigation principale">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  className={({ isActive }) =>
                    `nav-link flex items-center gap-2 px-2.5 py-2 rounded-md text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? "text-primary font-bold bg-primary/10 shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`
                  }
                >
                  <Icon className={`h-4 w-4`} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
            <div ref={underlineRef} className="nav-underline" aria-hidden />
          </nav>

          {/* CTA Button */}
          <div className="hidden xl:flex items-center flex-shrink-0">
            <Button size="sm" className="bg-primary hover:bg-primary/90 shadow-sm whitespace-nowrap" asChild>
              <Link to="/consultation">Consultation Gratuite</Link>
            </Button>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen((s) => !s)}
            className="xl:hidden p-2 rounded-md hover:bg-secondary/40 flex-shrink-0 ml-auto"
            aria-label="Open menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-40 xl:hidden transition-all duration-300 ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
        <div className={`absolute top-0 right-0 h-full w-full sm:max-w-md bg-card shadow-2xl p-6 transform ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"} transition-transform duration-300`}> 
          <div className="flex items-center justify-between mb-6 pb-4 border-b">
            <Link to="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
              {logoAvailable ? (
                <div className="w-[130px] h-9 flex items-center">
                  <img
                    src="/assets/images/logo.png"
                    alt="Axe Legal"
                    className="h-9 w-full object-contain object-left"
                    onError={() => setLogoAvailable(false)}
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 shadow-md">
                    <Scale className="h-4 w-4 text-white" />
                  </div>
                  <div className="leading-tight">
                    <div className="text-base font-bold">Axe <span className="text-primary">Legal</span></div>
                    <div className="text-xs text-muted-foreground">Conseil & Défense</div>
                  </div>
                </div>
              )}
            </Link>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-md hover:bg-secondary/20">
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-secondary/40"
                >
                  <Icon className="h-6 w-6 text-primary" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}

            <div className="pt-4 border-t border-border mt-4">
              <a href="tel:+2290197747593" className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-secondary/40">
                <Phone className="h-5 w-5 text-primary" />
                <span>Appelez-nous</span>
              </a>
              <Button className="w-full mt-3" asChild>
                <Link to="/consultation" onClick={() => setIsMobileMenuOpen(false)}>
                  Consultation Gratuite
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};
