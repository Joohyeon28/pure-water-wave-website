import { MapPin, Navigation, Clock } from "lucide-react";
import { motion } from "framer-motion";

const address = "22 Nutmeg Street, Protea Glen Ext 28";
const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
const embedUrl = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

const LocationSection = () => (
  <section id="location" className="py-20 sm:py-28 gradient-water">
    <div className="container mx-auto px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Find Us</h2>
        <p className="text-muted-foreground">Visit our refill station today.</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-card p-8 flex flex-col justify-center"
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-lg mb-1">Our Address</h3>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                {address}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-lg mb-1">Now Open!</h3>
              <p className="text-muted-foreground">Opening Date: 01 April 2026</p>
            </div>
          </div>

          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="gradient-primary text-primary-foreground px-6 py-3 rounded-full font-semibold text-center flex items-center justify-center gap-2 hover:opacity-90 transition-opacity mt-2"
          >
            <Navigation className="w-4 h-4" />
            Get Directions
          </a>
        </motion.div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-card overflow-hidden aspect-square md:aspect-auto"
        >
          <iframe
            src={embedUrl}
            className="w-full h-full min-h-[320px]"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Store location"
          />
        </motion.div>
      </div>
    </div>
  </section>
);

export default LocationSection;
