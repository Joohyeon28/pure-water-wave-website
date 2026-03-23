import { Droplets } from "lucide-react";
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
    <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/20 to-background" />

    {/* Decorative blobs */}
    <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-primary/10 blur-3xl animate-float" />
    <div className="absolute bottom-32 left-10 w-48 h-48 rounded-full bg-accent/10 blur-3xl animate-float" style={{ animationDelay: "2s" }} />

    <div className="container mx-auto px-4 sm:px-6 relative z-10 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl"
      >
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
          <Droplets className="w-4 h-4" />
          Now Open – 01 April 2026
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight">
          <span className="text-gradient">Pure Water Wave</span>
          <br />
          <span className="text-foreground/80 text-2xl sm:text-3xl md:text-4xl font-semibold">
            Life Element
          </span>
        </h1>

        <p className="mt-4 text-lg sm:text-xl text-primary font-medium">
          Mineralised & Alkaline Water Refill Station
        </p>
        <p className="mt-2 text-muted-foreground text-base sm:text-lg max-w-xl italic">
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
            className="bg-card/70 backdrop-blur border border-border text-foreground px-8 py-4 rounded-full font-semibold text-base hover:bg-card transition-all"
          >
            View Pricing
          </a>
        </div>
      </motion.div>
    </div>
  </section>
);

export default HeroSection;
