import { Refrigerator, Droplets, Wrench, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import extLogoImg from "@/assets/Extension Water Logo.jpeg";

const features = [
  {
    icon: Refrigerator,
    title: "Hot & Cold Dispensing Cooler",
    desc: "Use of a Hot & Cold Water Dispensing Cooler for your convenience.",
  },
  {
    icon: Droplets,
    title: "Regular Water Supply",
    desc: "Water Bottle Supplies Every Fortnight for 12 Months.",
  },
  {
    icon: Wrench,
    title: "Ongoing Maintenance",
    desc: "Ongoing Cooler Maintenance included at no extra cost.",
  },
  {
    icon: ShieldCheck,
    title: "12-Month Contract",
    desc: "Fixed-term agreement with full support throughout.",
  },
];

const CoolerContractSection = () => (
  <section id="cooler-contract" className="relative py-20 sm:py-28 bg-background overflow-hidden">
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
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">12-Month Cooler Contract</h2>
        <div className="text-5xl sm:text-6xl font-extrabold text-gradient mt-6 mb-3">R3000.00</div>
        <p className="text-muted-foreground text-lg">For Only R3000.00 You Get</p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.12 }}
            className="glass-card p-6 sm:p-7 text-center hover:shadow-xl hover:-translate-y-1 transition-all group"
          >
            <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-5 border border-primary/20 group-hover:scale-110 transition-transform">
              <f.icon className="w-7 h-7 text-primary-foreground" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">{f.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default CoolerContractSection;
