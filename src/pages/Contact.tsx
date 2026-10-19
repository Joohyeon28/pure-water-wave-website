import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BUSINESS_INFO, PLACEHOLDERS } from "@/lib/business-info";

const fullAddress = BUSINESS_INFO.addressLines.join(", ");
const mapsUrl = `https://www.google.com/maps?q=${BUSINESS_INFO.coordinates.lat},${BUSINESS_INFO.coordinates.lng}`;
const embedUrl = `https://maps.google.com/maps?q=${BUSINESS_INFO.coordinates.lat},${BUSINESS_INFO.coordinates.lng}&z=17&output=embed`;
const whatsappUrl = `https://wa.me/${BUSINESS_INFO.whatsapp}`;

const TodoBadge = () => (
  <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800">
    TODO
  </span>
);

const Contact = () => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
    <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Contact us</h1>
    <p className="mt-2 text-muted-foreground">
      Questions about an order, a delivery, or a cooler contract? Get in touch.
    </p>

    <div className="mt-10 grid gap-8 md:grid-cols-2">
      <div className="glass-card p-6 sm:p-8 space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center shrink-0">
            <MapPin className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-bold text-foreground text-lg mb-1">Address</h2>
            <p className="text-muted-foreground">{fullAddress}</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center shrink-0">
            <Phone className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="font-bold text-foreground text-lg mb-1">
              Phone
              {PLACEHOLDERS.phone ? <TodoBadge /> : null}
            </h2>
            <p className="text-muted-foreground">{BUSINESS_INFO.phone}</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center shrink-0">
            <Mail className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="font-bold text-foreground text-lg mb-1">
              Email
              {PLACEHOLDERS.email ? <TodoBadge /> : null}
            </h2>
            <p className="break-all text-muted-foreground">{BUSINESS_INFO.email}</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="font-bold text-foreground text-lg mb-1">
              Operating hours
              {PLACEHOLDERS.hours ? <TodoBadge /> : null}
            </h2>
            <p className="text-muted-foreground">{BUSINESS_INFO.hours}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col gap-3">
          <Button asChild>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-4 h-4" />
              Chat on WhatsApp
              {PLACEHOLDERS.whatsapp ? <TodoBadge /> : null}
            </a>
          </Button>

          <Button asChild variant="outline">
            <a href={`tel:${BUSINESS_INFO.phone.replace(/\s+/g, "")}`}>
              <Phone className="w-4 h-4" />
              Call us
            </a>
          </Button>

          <Button asChild variant="outline">
            <a href={`mailto:${BUSINESS_INFO.email}`}>
              <Mail className="w-4 h-4" />
              Email us
            </a>
          </Button>
        </div>

        <div className="glass-card overflow-hidden">
          <iframe
            src={embedUrl}
            className="w-full h-full min-h-[260px] sm:min-h-[320px]"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Store location"
          />
        </div>
      </div>
    </div>

    <p className="mt-8 text-sm text-muted-foreground">
      Prefer WhatsApp? Tap the button above.
    </p>
  </div>
);

export default Contact;
