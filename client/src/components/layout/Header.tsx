import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/theme";
import ncLogo from "@/assets/NC - Logo.png";
import ncBlackLogo from "@/assets/NC - B Logo.png";

export function Header() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location]);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/events", label: "Events" },
    { href: "/join", label: "Join Us" },
  ];

  const handleNavClick = () => {
    // Close mobile menu if open
    setIsMenuOpen(false);
    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm shadow-lg"
          : "bg-white dark:bg-slate-800 shadow-lg"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3" onClick={handleNavClick}>
            <img 
              src={theme === "dark" ? ncLogo : ncBlackLogo}
              alt="Nexus Community Logo" 
              className="h-10 w-auto object-contain transition-opacity duration-200"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap",
                    location === item.href
                      ? "text-gsf-primary dark:text-gsf-secondary"
                      : "text-gray-700 dark:text-gray-300 hover:text-gsf-primary dark:hover:text-gsf-secondary"
                  )}
                  onClick={handleNavClick}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Apply Button & Theme Toggle */}
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <Button
              asChild
              className="hidden sm:flex bg-gsf-secondary hover:bg-gsf-primary text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Link href="/join">Apply NOW</Link>
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="absolute top-full left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-gray-200/50 dark:border-slate-700/50 shadow-2xl z-50">
              <div className="px-4 py-4 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "block px-4 py-3 text-base font-medium transition-all duration-200 rounded-xl",
                      location === item.href
                        ? "text-gsf-primary dark:text-gsf-secondary bg-gsf-primary/10 dark:bg-gsf-secondary/10"
                        : "text-gray-700 dark:text-gray-300 hover:text-gsf-primary dark:hover:text-gsf-secondary hover:bg-gray-50/80 dark:hover:bg-slate-800/80"
                    )}
                    onClick={handleNavClick}
                  >
                    {item.label}
                  </Link>
                ))}

                {/* Mobile Apply Button */}
                <div className="sm:hidden pt-4 border-t border-gray-200/50 dark:border-slate-700/50">
                  <Button
                    asChild
                    className="w-full bg-gsf-secondary hover:bg-gsf-primary text-white font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Link href="/join">Apply NOW</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
