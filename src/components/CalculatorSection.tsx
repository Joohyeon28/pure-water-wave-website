import { useState } from "react";
import { Calculator, Droplets, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const CalculatorSection = () => {
  const [litres, setLitres] = useState("");
  const [type, setType] = useState<"purified" | "alkaline">("purified");

  const rate = type === "purified" ? 0.8 : 1.5;
  const total = litres ? (parseFloat(litres) * rate).toFixed(2) : "0.00";
  const isValid = litres && parseFloat(litres) > 0;

  return (
    <section id="calculator" className="py-20 sm:py-28">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-lg mx-auto"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Price Calculator</h2>
            <p className="text-muted-foreground">Find out your refill cost instantly.</p>
          </div>

          <div className="glass-card p-8">
            {/* Water type toggle */}
            <div className="flex rounded-xl bg-secondary p-1 mb-6">
              <button
                onClick={() => setType("purified")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all ${
                  type === "purified"
                    ? "gradient-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Droplets className="w-4 h-4" />
                Purified (R0.80/L)
              </button>
              <button
                onClick={() => setType("alkaline")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all ${
                  type === "alkaline"
                    ? "gradient-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Sparkles className="w-4 h-4" />
                Alkaline (R1.50/L)
              </button>
            </div>

            {/* Litres input */}
            <label className="block text-sm font-medium text-foreground mb-2">
              Enter litres
            </label>
            <div className="relative mb-6">
              <input
                type="number"
                min="0"
                placeholder="e.g. 25"
                value={litres}
                onChange={(e) => setLitres(e.target.value)}
                className="w-full px-5 py-4 rounded-xl bg-secondary border border-border text-foreground text-lg font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                litres
              </span>
            </div>

            {/* Result */}
            <div className="gradient-primary rounded-xl p-6 text-center">
              <div className="flex items-center justify-center gap-2 text-primary-foreground/80 text-sm mb-1">
                <Calculator className="w-4 h-4" />
                Total Price
              </div>
              <div className="text-4xl sm:text-5xl font-extrabold text-primary-foreground">
                R{isValid ? total : "0.00"}
              </div>
              {isValid && parseFloat(litres) >= 100 && (
                <p className="text-primary-foreground/80 text-sm mt-2">
                  🚚 Free delivery included!
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CalculatorSection;
