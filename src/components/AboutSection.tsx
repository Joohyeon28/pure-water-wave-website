import { Droplets, Shield, Heart } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { icon: Droplets, title: "Pure & Clean", desc: "Multi-stage purification for crystal-clear water." },
  { icon: Shield, title: "Quality Tested", desc: "Rigorous quality checks at every step." },
  { icon: Heart, title: "Mineral Rich", desc: "Essential minerals for optimal hydration." },
];

const AboutSection = () => (
  <section id="about" className="py-20 sm:py-28">
    <div className="container mx-auto px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto text-center mb-16"
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">About Us</h2>
        <p className="text-muted-foreground text-lg leading-relaxed">
          We provide high-quality purified and alkaline water at affordable prices. Our water is
          carefully sourced, purified, and mineralised to ensure the best hydration experience.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            className="glass-card p-8 text-center hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-5">
              <f.icon className="w-7 h-7 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">{f.title}</h3>
            <p className="text-muted-foreground">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default AboutSection;
