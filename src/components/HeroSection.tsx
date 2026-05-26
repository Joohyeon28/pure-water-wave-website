import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import heroImg from "@/assets/hero-water.jpg";

const HeroSection = () => (
  <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
    {/* Background */}
    <img
      src={heroImg}
      alt=""
      className="absolute inset-0 w-full h-full object-cover"
      width={1920}
      height={1080}
    />
    <div className="absolute inset-0 bg-gradient-to-b from-[hsl(215,70%,8%)]/90 via-[hsl(215,60%,14%)]/70 to-background" />

    {/* Decorative blobs */}
    <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-primary/10 blur-3xl animate-float" />
    <div className="absolute bottom-32 left-10 w-48 h-48 rounded-full bg-accent/10 blur-3xl animate-float" style={{ animationDelay: "2s" }} />
    <div className="absolute bottom-20 right-16 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />

    <div className="container mx-auto px-4 sm:px-6 relative z-10 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl"
      >
        <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4" />
          Now Open – 01 April 2026
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight text-white">
          Water that comes from the earth itself
          <br />
          <span className="text-accent text-2xl sm:text-3xl md:text-4xl font-semibold">
            Extension Water
          </span>
        </h1>

        <p className="mt-4 text-lg sm:text-xl text-white/80 font-medium">
          Mineralised & Alkaline Water Refill Station
        </p>
        <p className="mt-2 text-white/40 text-base sm:text-lg max-w-xl italic">
          "Sourced and purified from the belly of the earth"
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href="#calculator"
            className="gradient-primary text-primary-foreground px-8 py-4 rounded-full font-bold text-base hover:shadow-xl hover:shadow-primary/25 transition-all hover:-translate-y-0.5"
          >
            Calculate Your Refill Price
          </a>
          <a
            href="#pricing"
            className="bg-white/10 backdrop-blur border border-white/20 text-white px-8 py-4 rounded-full font-semibold text-base hover:bg-white/20 transition-all"
          >
            View Pricing
          </a>
        </div>
      </motion.div>
    </div>
  </section>
);

export default HeroSection;
