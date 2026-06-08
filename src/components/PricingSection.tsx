import { Droplets, Sparkle, Apple, Truck, TestTubes, CalendarDays } from "lucide-react";
import { motion } from "framer-motion";
import extLogoImg from "@/assets/Extension Water Logo.jpeg";
import { pricing, productKeys, containerSizes, type ProductKey } from "@/lib/pricing";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const productIcons: Record<ProductKey, React.ElementType> = {
  purified: Droplets,
  alkaline: Sparkle,
  fruitJuice: Apple,
};

const productDescriptions: Record<ProductKey, string> = {
  purified: "Clean, refreshing hydration",
  alkaline: "Mineral-enriched hydration",
  fruitJuice: "Fresh, natural fruit flavours",
};

const productAccents: Record<ProductKey, string> = {
  purified: "",
  alkaline: "ring-2 ring-accent/30",
  fruitJuice: "ring-2 ring-amber-400/30",
};

const LogoWatermark = () => (
  <div
    className="absolute inset-0 pointer-events-none select-none overflow-hidden"
    aria-hidden="true"
    style={{
      backgroundImage: `url(${extLogoImg})`,
      backgroundSize: "32%",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      opacity: 0.04,
    }}
  />
);

const PricingSection = () => (
  <section id="pricing" className="relative py-20 sm:py-28 bg-muted/40">
    <LogoWatermark />
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
          Opening Special
        </div>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto mb-12">
        {productKeys.map((key, i) => {
          const Icon = productIcons[key];
          const isAlkaline = key === "alkaline";
          const isFruit = key === "fruitJuice";

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: i === 1 ? 0 : i === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`glass-card p-6 sm:p-8 text-center hover:shadow-xl transition-all ${productAccents[key]} ${
                isAlkaline ? "relative overflow-hidden" : ""
              }`}
              style={isAlkaline ? { background: "linear-gradient(to bottom, hsl(200, 100%, 98%), white)" } : isFruit ? { background: "linear-gradient(to bottom, hsl(40, 100%, 97%), white)" } : undefined}
            >
              {isAlkaline && (
                <div className="absolute top-4 right-4 gradient-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                  Premium
                </div>
              )}
              <div className={`w-16 h-16 ${isAlkaline ? "gradient-primary" : "bg-secondary"} rounded-2xl flex items-center justify-center mx-auto mb-5 ${isFruit ? "bg-amber-100" : ""}`}>
                <Icon className={`w-8 h-8 ${isAlkaline ? "text-primary-foreground" : isFruit ? "text-amber-500" : "text-primary"}`} />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-1">{pricing[key].label}</h3>
              <p className="text-muted-foreground text-sm mb-4">{productDescriptions[key]}</p>
              <div className="text-4xl font-extrabold text-gradient mb-1">
                R{pricing[key].refillRate.toFixed(2)}
              </div>
              <p className="text-muted-foreground text-sm">per litre (refill)</p>
            </motion.div>
          );
        })}
      </div>

      {/* Perks */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto mb-16">
        <div className="glass-card flex items-center gap-3 px-4 sm:px-5 py-3 text-sm text-foreground">
          <Truck className="w-5 h-5 text-primary shrink-0" />
          Free delivery for 100L+ within 10km
        </div>
        <div className="glass-card flex items-center gap-3 px-4 sm:px-5 py-3 text-sm text-foreground">
          <TestTubes className="w-5 h-5 text-primary shrink-0" />
          Free water testing strips – first 100 customers
        </div>
      </div>

      {/* Pricing Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <h3 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-8">Bottle Prices</h3>
        <div className="glass-card overflow-hidden p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-foreground font-bold text-base">Size</TableHead>
                {productKeys.map((key) => (
                  <TableHead key={key} className="text-foreground font-bold text-base text-center">
                    {pricing[key].label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {containerSizes.map((size) => (
                <TableRow key={size} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-semibold text-foreground">{size}</TableCell>
                  {productKeys.map((key) => (
                    <TableCell key={key} className="text-center text-muted-foreground">
                      R{pricing[key].bottles[size].toFixed(2)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </motion.div>
    </div>
  </section>
);

export default PricingSection;
