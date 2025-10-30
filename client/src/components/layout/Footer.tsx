import { Link } from "wouter";
import { Facebook, Twitter, Linkedin, Instagram, MapPin, Phone, Mail } from "lucide-react";
import { useTheme } from "@/lib/theme";
import ncLogo from "@/assets/NC - Logo.png";
import ncBlackLogo from "@/assets/NC - B Logo.png";

export function Footer() {
  const { theme } = useTheme();
  return (
    <footer className="bg-gsf-primary dark:bg-slate-800 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img
                src={theme === "dark" ? ncLogo : ncBlackLogo}
                alt="Nexus Community"
                className="h-10 w-auto object-contain"
              />
              <span className="font-heading font-bold text-lg">Nexus Community</span>
            </div>
            <p className="text-blue-100 leading-relaxed">
              Real-estate mentorship and workshops in Cairo—connecting young professionals with leading developers and experts.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-heading text-lg font-bold">Quick Links</h4>
            <ul className="space-y-2 text-blue-100">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-white transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/join" className="hover:text-white transition-colors">
                  Join Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Partners */}
          <div className="space-y-4">
            <h4 className="font-heading text-lg font-bold">Partners</h4>
            <ul className="space-y-2 text-blue-100">
              <li>
                <a href="https://www.bue.edu.eg/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  The British University in Egypt (BUE)
                </a>
              </li>
              <li>
                <a href="https://www.blabla-studio.com/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  Bla Bla Studio
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-heading text-lg font-bold">Contact</h4>
            <div className="space-y-3 text-blue-100">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5" />
                <span>Cairo, Egypt</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5" />
                <span>+20 XX XXX XXXX</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5" />
                <span>hello@nexus.community</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-blue-100 text-sm">
            © {new Date().getFullYear()} Nexus Community. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-blue-100 hover:text-white text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-blue-100 hover:text-white text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-blue-100 hover:text-white text-sm transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}