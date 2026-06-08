import { Droplets } from "lucide-react";

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
        <div className="text-background/60 text-sm text-center">
          © Extension Water. All rights reserved.
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
