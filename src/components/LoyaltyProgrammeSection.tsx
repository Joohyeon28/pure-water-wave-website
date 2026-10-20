import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Droplets,
  Heart,
  Loader2,
  Refrigerator,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import extLogoImg from "@/assets/Extension Water Logo.jpeg";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useProductsQuery } from "@/hooks/useProducts";
import { useSupabase } from "@/lib/supabase-context";
import { formatCents } from "@/lib/format";
import { getCoolerProduct } from "@/lib/pricing-selectors";

type EnquiryType = "cooler" | "refill_20l";

const enquiryLabels: Record<EnquiryType, string> = {
  cooler: "12-month cooler contract",
  refill_20l: "20L refill rewards",
};

const coolerFeatures = [
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

const enrolSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  surname: z.string().trim().min(1, "Surname is required"),
  address: z.string().trim().min(1, "Address is required"),
  contactNumber: z.string().trim().min(1, "Contact number is required"),
  referenceNumber: z.string().trim().min(1, "Reference number is required"),
});

type EnrolValues = z.infer<typeof enrolSchema>;

const BottleVisual = ({ label, free = false }: { label: string; free?: boolean }) => (
  <div className="flex flex-col items-center gap-2">
    <div
      className={`relative flex h-24 w-14 flex-col items-center justify-end gap-1 rounded-b-2xl rounded-t-lg border-2 pb-2 ${
        free ? "border-accent bg-accent/10" : "border-primary/30 bg-secondary"
      }`}
    >
      <div
        className={`absolute -top-2 h-3 w-8 rounded-t-md border-2 ${
          free ? "border-accent bg-accent/30" : "border-primary/30 bg-secondary"
        }`}
      />
      <Droplets className={`h-5 w-5 ${free ? "text-accent" : "text-primary"}`} />
      <span className="text-[10px] font-bold leading-none text-foreground">20L</span>
    </div>
    <span className={`text-xs font-semibold ${free ? "text-accent" : "text-foreground"}`}>
      {label}
    </span>
  </div>
);

interface EnrolDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  enquiryType: EnquiryType;
}

const EnrolDialog = ({ open, onOpenChange, enquiryType }: EnrolDialogProps) => {
  const supabase = useSupabase();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EnrolValues>({
    resolver: zodResolver(enrolSchema),
    defaultValues: {
      name: "",
      surname: "",
      address: "",
      contactNumber: "",
      referenceNumber: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset();
    }
  }, [open, reset]);

  const onSubmit = handleSubmit(async (values) => {
    const { error } = await supabase.from("loyalty_enquiries").insert({
      enquiry_type: enquiryType,
      name: values.name.trim(),
      surname: values.surname.trim(),
      address: values.address.trim(),
      contact_number: values.contactNumber.trim(),
      reference_number: values.referenceNumber.trim(),
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success(`Enrolment received for the ${enquiryLabels[enquiryType]}. We'll be in touch.`);
    reset();
    onOpenChange(false);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Enrol — {enquiryLabels[enquiryType]}</DialogTitle>
          <DialogDescription>
            Send us your details and we will confirm your enrolment.
          </DialogDescription>
        </DialogHeader>

        <form id="enrol-form" onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="enrol-name">Name</Label>
              <Input id="enrol-name" autoComplete="given-name" {...register("name")} />
              {errors.name ? (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="enrol-surname">Surname</Label>
              <Input id="enrol-surname" autoComplete="family-name" {...register("surname")} />
              {errors.surname ? (
                <p className="text-sm text-destructive">{errors.surname.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="enrol-contact">Contact number</Label>
              <Input
                id="enrol-contact"
                type="tel"
                autoComplete="tel"
                {...register("contactNumber")}
              />
              {errors.contactNumber ? (
                <p className="text-sm text-destructive">{errors.contactNumber.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="enrol-reference">Reference number</Label>
              <Input id="enrol-reference" {...register("referenceNumber")} />
              {errors.referenceNumber ? (
                <p className="text-sm text-destructive">{errors.referenceNumber.message}</p>
              ) : null}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="enrol-address">Address</Label>
              <Textarea
                id="enrol-address"
                rows={3}
                autoComplete="street-address"
                {...register("address")}
              />
              {errors.address ? (
                <p className="text-sm text-destructive">{errors.address.message}</p>
              ) : null}
            </div>
          </div>
        </form>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form="enrol-form" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const LoyaltyProgrammeSection = () => {
  const { data, isLoading } = useProductsQuery();
  const products = data ?? [];
  const cooler = getCoolerProduct(products);
  const [mode, setMode] = useState<EnquiryType>("cooler");
  const [enrolOpen, setEnrolOpen] = useState(false);

  return (
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
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-amber-200">
            <Heart className="w-4 h-4" />
            Rewards Programme
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Loyalty Programme</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Choose how you want to save: a 12-month cooler contract or the 20L refill rewards.
          </p>
        </motion.div>

        <div className="mx-auto max-w-3xl">
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setMode("cooler")}
              aria-pressed={mode === "cooler"}
              className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                mode === "cooler"
                  ? "border-accent bg-accent/10 ring-2 ring-accent/30"
                  : "border-border bg-secondary hover:border-primary/30"
              }`}
            >
              <Refrigerator
                className={`mt-0.5 h-5 w-5 shrink-0 ${
                  mode === "cooler" ? "text-accent" : "text-primary"
                }`}
              />
              <span>
                <span className="block font-bold text-foreground">12-Month Cooler Contract</span>
                <span className="block text-sm text-muted-foreground">
                  Cooler, fortnightly water supply and maintenance
                </span>
              </span>
            </button>

            <button
              type="button"
              onClick={() => setMode("refill_20l")}
              aria-pressed={mode === "refill_20l"}
              className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                mode === "refill_20l"
                  ? "border-accent bg-accent/10 ring-2 ring-accent/30"
                  : "border-border bg-secondary hover:border-primary/30"
              }`}
            >
              <Droplets
                className={`mt-0.5 h-5 w-5 shrink-0 ${
                  mode === "refill_20l" ? "text-accent" : "text-primary"
                }`}
              />
              <span>
                <span className="block font-bold text-foreground">20L Refill Rewards</span>
                <span className="block text-sm text-muted-foreground">Buy 3, get 1 free</span>
              </span>
            </button>
          </div>

          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="glass-card mt-6 p-6 sm:p-8"
          >
            {mode === "cooler" ? (
              <div>
                <div className="text-center">
                  {isLoading ? (
                    <Skeleton className="mx-auto h-12 w-40" />
                  ) : cooler ? (
                    <>
                      <div className="text-4xl sm:text-5xl font-extrabold text-gradient">
                        {formatCents(cooler.price_cents)}
                      </div>
                      <p className="mt-2 text-muted-foreground">
                        For Only {formatCents(cooler.price_cents)} You Get
                      </p>
                    </>
                  ) : (
                    <p className="text-muted-foreground">
                      Cooler contract pricing is unavailable at the moment. Please contact us for
                      a quote.
                    </p>
                  )}
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {coolerFeatures.map((feature) => (
                    <div
                      key={feature.title}
                      className="rounded-lg border border-border p-4"
                    >
                      <feature.icon className="h-5 w-5 text-primary" />
                      <h3 className="mt-2 font-bold text-foreground">{feature.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{feature.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <div className="flex flex-wrap items-end justify-center gap-4 sm:gap-6">
                  <BottleVisual label="Buy" />
                  <BottleVisual label="Buy" />
                  <BottleVisual label="Buy" />
                  <span className="pb-14 text-2xl font-bold text-muted-foreground">+</span>
                  <BottleVisual label="Free" free />
                </div>

                <p className="mt-6 text-center text-lg font-semibold text-foreground">
                  Buy 3 × 20L refills within a month and get 1 × 20L free refill.
                </p>
                <p className="mt-2 text-center text-sm text-muted-foreground">
                  Three paid 20L refills in the same month unlock one free 20L refill.
                </p>
              </div>
            )}

            <Button type="button" className="mt-6 w-full" onClick={() => setEnrolOpen(true)}>
              Enrol
            </Button>
          </motion.div>
        </div>
      </div>

      <EnrolDialog open={enrolOpen} onOpenChange={setEnrolOpen} enquiryType={mode} />
    </section>
  );
};

export default LoyaltyProgrammeSection;
