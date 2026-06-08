import React from "react";

const PromoBar = () => {
  return (
    <section className="relative py-14 sm:py-16 border-y border-primary/15 bg-gradient-to-b from-water-deep/90 via-water-navy/90 to-[hsl(214,58%,12%)] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,rgba(0,198,255,0.16),transparent_55%)]" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_18px_60px_rgba(0,0,0,0.35)] px-5 sm:px-10 py-9 sm:py-12">
          <p className="text-base sm:text-2xl font-semibold tracking-tight text-white leading-relaxed">
            Want a website like this? Send enquiries to joohyeonstemmer28@gmail.com
          </p>

          <a
            href="mailto:joohyeonstemmer28@gmail.com"
            className="mt-7 inline-flex items-center justify-center rounded-full gradient-primary text-primary-foreground font-semibold text-xs sm:text-base px-5 sm:px-8 py-3.5 shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/35 max-w-full break-all"
            aria-label="Send enquiry email"
          >
            Email: joohyeonstemmer28@gmail.com
          </a>
        </div>
      </div>
    </section>
  );
};

export default PromoBar;
