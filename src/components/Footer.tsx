import { Droplets } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-[hsl(215,70%,6%)] text-background py-12 border-t border-white/10">
    <div className="container mx-auto px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 font-bold text-lg">
            <Droplets className="w-5 h-5" />
            Extension Water
          </div>
          <p className="text-white/30 text-xs mt-1">Mineralised &amp; Alkaline Water — Protea Glen</p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <nav className="flex items-center gap-4 text-sm">
            <Link to="/privacy" className="text-background/60 hover:text-background transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="text-background/60 hover:text-background transition-colors">
              Terms
            </Link>
            <Link to="/contact" className="text-background/60 hover:text-background transition-colors">
              Contact
            </Link>
          </nav>
          <div className="text-background/60 text-sm text-center">
            © Extension Water. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
