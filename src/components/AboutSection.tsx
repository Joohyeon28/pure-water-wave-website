import { Droplets, Shield, Heart } from "lucide-react";
import { motion } from "framer-motion";
import storeFrontImg from "@/assets/Extension Water Store Front.jpeg";
import extLogoImg from "@/assets/Extension Water Logo.jpeg";

const features = [
  { icon: Droplets, title: "Pure & Clean", desc: "Multi-stage purification for crystal-clear water." },
  { icon: Shield, title: "Quality Tested", desc: "Rigorous quality checks at every step." },
  { icon: Heart, title: "Mineral Rich", desc: "Essential minerals for optimal hydration." },
];

const AboutSection = () => (
  <section id="about" className="py-20 sm:py-28 bg-background">
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

      {/* Store showcase */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="grid md:grid-cols-2 gap-10 items-center mb-20"
      >
        <div className="relative">
          <img
            src={storeFrontImg}
            alt="Extension Water store front"
            className="rounded-3xl w-full object-cover shadow-2xl shadow-primary/10"
          />
          <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-2xl overflow-hidden border-2 border-primary/30 shadow-xl hidden sm:block">
            <img src={extLogoImg} alt="Extension Water logo" className="w-full h-full object-cover" />
          </div>
        </div>
        <div>
          <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">Visit Our Store</h3>
          <p className="text-muted-foreground text-lg leading-relaxed mb-6">
            Located in Protea Glen Ext 28, our modern refill station is open and ready to serve your community with the purest, most mineral-rich water — sourced straight from the earth.
          </p>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 text-foreground">
              <span className="w-2 h-2 rounded-full bg-accent shrink-0" />
              Purified &amp; Alkaline water available
            </div>
            <div className="flex items-center gap-3 text-foreground">
              <span className="w-2 h-2 rounded-full bg-accent shrink-0" />
              Bring your own bottles or buy on-site
            </div>
            <div className="flex items-center gap-3 text-foreground">
              <span className="w-2 h-2 rounded-full bg-accent shrink-0" />
              Free delivery for 100L+ within 10km
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            className="glass-card p-8 text-center hover:shadow-xl hover:-translate-y-1 transition-all group hover:ring-2 hover:ring-primary/10 hover:ring-offset-2"
          >
            <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-5 border border-primary/20">
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
