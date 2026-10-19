export const BUSINESS_INFO = {
  name: "Extension Water",
  addressLines: ["22 Nutmeg Street", "Protea Glen Ext 28", "South Africa"],
  coordinates: { lat: -26.2838867, lng: 27.768125 },
  phone: "+27 00 000 0000", // TODO: replace before launch
  email: "info@example.com", // TODO: replace before launch
  whatsapp: "27000000000", // TODO: replace before launch (no +, no spaces)
  hours: "Mon–Sat 08:00–17:00", // TODO: confirm before launch
  vatNumber: null as string | null, // TODO: populate if VAT registered
  registrationNumber: null as string | null, // TODO: populate if applicable
} as const;

export const PLACEHOLDERS = {
  phone: true, // TODO: set to false once the real number is in place
  email: true, // TODO: set to false once the real address is in place
  whatsapp: true, // TODO: set to false once the real number is in place
  hours: true, // TODO: set to false once the real hours are confirmed
} as const;
