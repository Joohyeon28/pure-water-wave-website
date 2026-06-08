import { Sparkles, Droplets, Sparkle, Apple } from "lucide-react";
import { motion } from "framer-motion";
import heroImg from "@/assets/hero-water.jpg";
import extLogoImg from "@/assets/Extension Water Logo.jpeg";

const services = [
  { icon: Droplets, label: "Purified Water" },
  { icon: Sparkle, label: "Alkaline Water" },
  { icon: Apple, label: "Fruit Juice" },
];

const HeroSection = () => (
  <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
    <img
      src={heroImg}
      alt=""
      className="absolute inset-0 w-full h-full object-cover"
      width={1920}
      height={1080}
    />

    <div className="absolute inset-0 bg-gradient-to-b from-[hsl(215,70%,8%)]/90 via-[hsl(215,60%,14%)]/70 to-background" />

    <div
      className="absolute inset-0 pointer-events-none select-none"
      aria-hidden="true"
      style={{
        backgroundImage: `url(${extLogoImg})`,
        backgroundSize: "min(90vw, 560px)",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        opacity: 0.04,
      }}
    />

    <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-accent/10 via-primary/5 to-transparent pointer-events-none hidden sm:block" />

    <div className="absolute top-20 left-2 sm:left-10 w-36 h-36 sm:w-48 sm:h-48 rounded-full bg-primary/10 blur-3xl animate-float" />
    <div className="absolute bottom-32 left-2 sm:left-10 w-36 h-36 sm:w-48 sm:h-48 rounded-full bg-accent/10 blur-3xl animate-float" style={{ animationDelay: "2s" }} />

    <div className="container mx-auto px-4 sm:px-6 relative z-10 pt-24 pb-12 sm:pb-16">
      <div className="grid lg:grid-cols-2 gap-10 sm:gap-14 lg:gap-16 items-center min-h-[calc(100vh-6rem)]">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 text-accent px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Now Open
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight text-white">
            Inspired by
            <br />source of life
            <br />
            <span className="text-accent text-xl sm:text-3xl md:text-4xl font-semibold">
              EXTENSION WATER
            </span>
          </h1>

          <p className="mt-4 text-lg sm:text-xl text-white/80 font-medium">
            Mineralised &amp; Alkaline Water Refill Station
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {services.map((s) => (
              <div
                key={s.label}
                className="inline-flex items-center gap-1.5 bg-white/5 backdrop-blur border border-white/10 text-white/80 px-3 py-1.5 rounded-full text-xs sm:text-sm"
              >
                <s.icon className="w-3.5 h-3.5 text-accent" />
                {s.label}
              </div>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-2 sm:flex sm:flex-wrap gap-3 sm:gap-4">
            <a
              href="#calculator"
              className="gradient-primary text-primary-foreground px-5 sm:px-7 py-3 sm:py-3.5 rounded-full font-bold text-xs sm:text-sm hover:shadow-xl hover:shadow-primary/25 transition-all hover:-translate-y-0.5 text-center"
            >
              Calculate Your Price
            </a>
            <a
              href="#pricing"
              className="bg-white/10 backdrop-blur border border-white/20 text-white px-5 sm:px-7 py-3 sm:py-3.5 rounded-full font-semibold text-xs sm:text-sm hover:bg-white/20 transition-all text-center"
            >
              View Pricing
            </a>
            <a
              href="#cooler-contract"
              className="bg-white/10 backdrop-blur border border-white/20 text-white px-5 sm:px-7 py-3 sm:py-3.5 rounded-full font-semibold text-xs sm:text-sm hover:bg-white/20 transition-all text-center"
            >
              Cooler Contract
            </a>
            <a
              href="#loyalty"
              className="bg-white/10 backdrop-blur border border-white/20 text-white px-5 sm:px-7 py-3 sm:py-3.5 rounded-full font-semibold text-xs sm:text-sm hover:bg-white/20 transition-all text-center"
            >
              Loyalty Programme
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.82 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.35, ease: "easeOut" }}
          className="hidden lg:flex items-center justify-center relative"
        >
          <div className="absolute w-[460px] h-[460px] rounded-full border border-accent/20 animate-ripple" />
          <div
            className="absolute w-[400px] h-[400px] rounded-full border border-accent/15 animate-ripple"
            style={{ animationDelay: "1s" }}
          />

          <div className="absolute w-[320px] h-[320px] rounded-full bg-accent/20 blur-[70px] animate-float" />

          <div className="absolute w-[300px] h-[300px] rounded-full bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_0_80px_rgba(0,200,255,0.12)]" />

          <motion.img
            src={extLogoImg}
            alt="Extension Water logo"
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10 w-64 h-64 rounded-3xl object-cover"
            style={{
              filter:
                "drop-shadow(0 0 36px rgba(0, 210, 255, 0.50)) drop-shadow(0 12px 28px rgba(0,0,0,0.45))",
            }}
          />
        </motion.div>

      </div>
    </div>
  </section>
);

export default HeroSection;
