import { Droplets, Sparkles, Truck, TestTubes, CalendarDays } from "lucide-react";
import { motion } from "framer-motion";

const PricingSection = () => (
  <section id="pricing" className="py-20 sm:py-28 gradient-water">
    <div className="container mx-auto px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Our Pricing</h2>
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold">
          <CalendarDays className="w-4 h-4" />
          Opening Special: 01 April – 30 June 2026
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto mb-12">
        {/* Purified */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-card p-8 text-center hover:shadow-xl transition-all"
        >
          <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Droplets className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-1">Purified Water</h3>
          <p className="text-muted-foreground text-sm mb-4">Clean, refreshing hydration</p>
          <div className="text-4xl font-extrabold text-gradient mb-1">R0.80</div>
          <p className="text-muted-foreground text-sm">per litre</p>
        </motion.div>

        {/* Alkaline */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-card p-8 text-center border-primary/30 hover:shadow-xl transition-all relative overflow-hidden"
        >
          <div className="absolute top-4 right-4 gradient-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
            Premium
          </div>
          <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Sparkles className="w-8 h-8 text-primary-foreground" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-1">Alkaline Water</h3>
          <p className="text-muted-foreground text-sm mb-4">Mineral-enriched hydration</p>
          <div className="text-4xl font-extrabold text-gradient mb-1">R1.50</div>
          <p className="text-muted-foreground text-sm">per litre</p>
        </motion.div>
      </div>

      {/* Perks */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
        <div className="glass-card flex items-center gap-3 px-5 py-3 text-sm text-foreground">
          <Truck className="w-5 h-5 text-primary shrink-0" />
          Free delivery for 100L+ within 10km
        </div>
        <div className="glass-card flex items-center gap-3 px-5 py-3 text-sm text-foreground">
          <TestTubes className="w-5 h-5 text-primary shrink-0" />
          Free water testing strips – first 100 customers
        </div>
      </div>
    </div>
  </section>
);

export default PricingSection;
