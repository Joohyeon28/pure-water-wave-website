import { Gift, Droplets, Apple, Star, Heart } from "lucide-react";
import { motion } from "framer-motion";
import extLogoImg from "@/assets/Extension Water Logo.jpeg";

const benefits = [
  {
    icon: Apple,
    title: "Free Fruit Juice",
    desc: "For every 20L of water bought in a month, get free 2L of refill Fruit Juice.",
  },
  {
    icon: Gift,
    title: "Exclusive Rewards",
    desc: "Placeholder Benefit — unlock special member-only perks and discounts.",
  },
  {
    icon: Star,
    title: "VIP Treatment",
    desc: "Placeholder Benefit — enjoy priority service and early access to promotions.",
  },
];

const LoyaltyProgrammeSection = () => (
  <section id="loyalty" className="relative py-20 sm:py-28 bg-muted/40 overflow-hidden">
    <div
      className="absolute inset-0 pointer-events-none select-none"
      aria-hidden="true"
      style={{
        backgroundImage: `url(${extLogoImg})`,
        backgroundSize: "32%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        opacity: 0.04,
      }}
    />
    <div className="container mx-auto px-4 sm:px-6 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-amber-200">
          <Heart className="w-4 h-4" />
          Rewards Programme
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Rewards Programme</h2>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Enrol and participate in our loyalty rewards programme and enjoy the following benefits
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {benefits.map((b, i) => (
          <motion.div
            key={b.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.12 }}
            className="glass-card p-6 sm:p-7 text-center hover:shadow-xl hover:-translate-y-1 transition-all group"
          >
            <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-amber-200 group-hover:scale-110 transition-transform">
              <b.icon className="w-7 h-7 text-amber-600" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">{b.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{b.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default LoyaltyProgrammeSection;
