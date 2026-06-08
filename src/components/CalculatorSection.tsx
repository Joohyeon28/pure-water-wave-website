import { useState } from "react";
import { Calculator, Droplets, Sparkle, Apple } from "lucide-react";
import { motion } from "framer-motion";
import { pricing, productKeys, containerSizes, type ProductKey, type ContainerSize } from "@/lib/pricing";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const productIcons: Record<ProductKey, React.ElementType> = {
  purified: Droplets,
  alkaline: Sparkle,
  fruitJuice: Apple,
};

const ProductSelector = ({
  value,
  onChange,
}: {
  value: ProductKey;
  onChange: (v: ProductKey) => void;
}) => (
  <Select value={value} onValueChange={(v) => onChange(v as ProductKey)}>
    <SelectTrigger className="w-full bg-secondary border-border rounded-xl py-6">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      {productKeys.map((key) => {
        const Icon = productIcons[key];
        return (
          <SelectItem key={key} value={key}>
            <span className="flex items-center gap-2">
              <Icon className="w-4 h-4 text-primary" />
              {pricing[key].label}
            </span>
          </SelectItem>
        );
      })}
    </SelectContent>
  </Select>
);

const RefillTab = () => {
  const [product, setProduct] = useState<ProductKey>("purified");
  const [litres, setLitres] = useState("");

  const rate = pricing[product].refillRate;
  const total = litres ? (parseFloat(litres) * rate).toFixed(2) : "0.00";
  const Icon = productIcons[product];

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Product</label>
        <ProductSelector value={product} onChange={setProduct} />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Litres</label>
        <div className="relative">
          <input
            type="number"
            min="0"
            placeholder="e.g. 25"
            value={litres}
            onChange={(e) => setLitres(e.target.value)}
            className="w-full px-5 py-4 rounded-xl bg-secondary border border-border text-foreground text-lg font-medium focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">litres</span>
        </div>
      </div>

      <div className="bg-[hsl(215,70%,8%)] rounded-2xl p-6 text-center">
        <div className="flex items-center justify-center gap-2 text-white/80 text-sm mb-1">
          <Calculator className="w-4 h-4" />
          Rate: R{rate.toFixed(2)}/L
        </div>
        <div className="flex items-center justify-center gap-2 text-white/60 text-xs mb-2">
          <Icon className="w-3.5 h-3.5 text-accent" />
          {pricing[product].label}
        </div>
        <div className="text-4xl sm:text-5xl font-extrabold text-white">
          R{total}
        </div>
        {litres && parseFloat(litres) >= 100 && (
          <p className="text-accent text-sm mt-2">Free delivery included!</p>
        )}
      </div>
    </div>
  );
};

const InStoreTab = () => {
  const [product, setProduct] = useState<ProductKey>("purified");
  const [size, setSize] = useState<ContainerSize>("1L");
  const [quantity, setQuantity] = useState("");

  const unitPrice = pricing[product].bottles[size];
  const total = quantity ? (parseInt(quantity, 10) * unitPrice).toFixed(2) : "0.00";
  const Icon = productIcons[product];

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Product</label>
        <ProductSelector value={product} onChange={setProduct} />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Container Size</label>
        <div className="grid grid-cols-5 gap-2">
          {containerSizes.map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={`py-2.5 rounded-xl text-sm font-semibold transition-all border ${
                size === s
                  ? "bg-accent text-[hsl(215,70%,8%)] border-accent shadow-md"
                  : "bg-secondary border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Quantity</label>
        <div className="relative">
          <input
            type="number"
            min="0"
            placeholder="e.g. 3"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full px-5 py-4 rounded-xl bg-secondary border border-border text-foreground text-lg font-medium focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">units</span>
        </div>
      </div>

      <div className="bg-[hsl(215,70%,8%)] rounded-2xl p-6 text-center">
        <div className="flex items-center justify-center gap-2 text-white/80 text-sm mb-1">
          <Calculator className="w-4 h-4" />
          R{unitPrice.toFixed(2)} per {size}
        </div>
        <div className="flex items-center justify-center gap-2 text-white/60 text-xs mb-2">
          <Icon className="w-3.5 h-3.5 text-accent" />
          {pricing[product].label}
        </div>
        <div className="text-4xl sm:text-5xl font-extrabold text-white">
          R{total}
        </div>
      </div>
    </div>
  );
};

const CalculatorSection = () => (
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
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Calculate Your Price</h2>
          <p className="text-muted-foreground">Find out your refill or in-store cost instantly.</p>
        </div>

        <div className="glass-card p-5 sm:p-8">
          <Tabs defaultValue="refill" className="w-full">
            <TabsList className="w-full grid grid-cols-2 mb-6">
              <TabsTrigger value="refill">Refill Prices</TabsTrigger>
              <TabsTrigger value="instore">In-Store Prices</TabsTrigger>
            </TabsList>
            <TabsContent value="refill">
              <RefillTab />
            </TabsContent>
            <TabsContent value="instore">
              <InStoreTab />
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </div>
  </section>
);

export default CalculatorSection;
