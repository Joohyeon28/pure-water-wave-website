import { Droplets } from "lucide-react";

const Footer = () => (
  <footer className="bg-foreground text-background py-12">
    <div className="container mx-auto px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-bold text-lg">
          <Droplets className="w-5 h-5" />
          Pure Water Wave – Life Element
        </div>
        <div className="text-background/60 text-sm text-center">
          © 2026 Pure Water Wave – Life Element. All rights reserved.
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
