import { BUSINESS_INFO } from "@/lib/business-info";

export interface LegalSection {
  heading: string;
  body: string[];
}

// TODO: set to an ISO date string (e.g. "2026-09-14") before launch; the pages
// render no last-updated line while this is null.
export const LEGAL_LAST_UPDATED: string | null = null;

export const LEGAL_DRAFT_NOTICE =
  "This is a working draft and is not legal advice. It should be reviewed by a qualified professional before the site goes live.";

const vatParagraph = BUSINESS_INFO.vatNumber
  ? `Extension Water is registered for VAT (VAT number ${BUSINESS_INFO.vatNumber}). Prices are shown inclusive of VAT where VAT applies.`
  : "Extension Water's VAT registration status is not confirmed in this draft. Do not describe prices as VAT-inclusive or VAT-exclusive until that is confirmed."; // TODO: confirm VAT registration status and replace this sentence with the correct wording

export const privacyPolicy: LegalSection[] = [
  {
    heading: "Who we are",
    body: [
      `${BUSINESS_INFO.name} is a sole trader operating a water refill station at ${BUSINESS_INFO.addressLines.join(", ")}.`,
      "This policy explains how we handle personal information collected through this website and in store.",
    ],
  },
  {
    heading: "What we collect",
    body: [
      "When you place an order we collect your name, email address, phone number, and — if you choose delivery — your delivery address.",
      "We keep a record of the products you ordered, the amounts, and the date and time of the order.",
      "We set session-essential cookies only, as described below. We do not use advertising or analytics tracking cookies.",
    ],
  },
  {
    heading: "Why we collect it",
    body: [
      "To prepare and fulfil your order, whether for delivery or collection.",
      "To contact you about your order or to answer a support question.",
      "To keep accounting and tax records as required by law.",
    ],
  },
  {
    heading: "Our lawful basis",
    body: [
      "We process your information to perform our contract with you when you place an order.",
      "For recordkeeping and fraud prevention we rely on our legitimate interest in running the business, balanced against your rights.",
    ],
  },
  {
    heading: "How long we keep it",
    body: [
      "Order and payment records are kept for five years for tax and accounting purposes.",
      "Contact details are deleted on request unless we are legally required to keep them.",
    ],
  },
  {
    heading: "Who we share it with",
    body: [
      "We share information only with the payment provider that processes your payment and the delivery partner who delivers your order, and only what they need to do that work.",
      "We do not sell your information and we do not share it with marketing third parties.",
    ],
  },
  {
    heading: "Your rights under POPIA",
    body: [
      "You may ask for a copy of the personal information we hold about you.",
      "You may ask us to correct information that is wrong, or to delete information we no longer need.",
      "You may object to processing that we base on our legitimate interest.",
      "To exercise any of these rights, contact us using the details below.",
      "If you are not satisfied with our response, you may complain to the Information Regulator of South Africa.",
    ],
  },
  {
    heading: "Cookies",
    body: [
      "This site sets only session-essential cookies needed for the shopping cart and checkout.",
      "We do not set tracking or advertising cookies. If that changes, this section will be updated.",
    ],
  },
  {
    heading: "How to contact us",
    body: [
      `Email ${BUSINESS_INFO.email} for any privacy question or request.`, // TODO: confirm this address is monitored
      `Our address is ${BUSINESS_INFO.addressLines.join(", ")}.`,
    ],
  },
];

export const termsAndConditions: LegalSection[] = [
  {
    heading: "Acceptance of terms",
    body: [
      "By using this website or placing an order, you agree to these terms.",
      "If you do not agree with them, please do not place an order.",
    ],
  },
  {
    heading: "Ordering and order acceptance",
    body: [
      "An order placed on this website is an offer to buy. Our acceptance takes place when we confirm the order and give you an order reference.",
      "We may decline an order if a product is unavailable, if the delivery address is outside our delivery area, or if we cannot verify the order.",
    ],
  },
  {
    heading: "Pricing and payment",
    body: [
      "All prices are shown in South African rand (ZAR).",
      vatParagraph,
      "The payment methods available to you are shown during checkout. In-store sales may be paid by cash, card, or EFT.",
      "We may correct a pricing error before we accept an order.",
    ],
  },
  {
    heading: "Delivery and collection",
    body: [
      "Delivery is free for orders of 100 litres or more within 10 km of the store.",
      "Orders below that threshold, or outside the delivery area, can be collected from the store at 22 Nutmeg Street, Protea Glen Ext 28.",
      "Delivery times are estimates and may change.",
    ],
  },
  {
    heading: "Cancellations and refunds",
    body: [
      "You may cancel an order before it is fulfilled by contacting us.",
      "For online sales, the Electronic Communications and Transactions Act (ECTA) gives you a cooling-off right to cancel within 7 days of receiving the goods, subject to the exceptions in that Act. Some goods may be excluded where their nature makes them unsuitable for return.",
      "To use the cooling-off right, tell us in writing and return the goods to us unless we agree to collect them.",
      "Refunds are paid to the original payment method. We aim to process an approved refund within [TODO: confirm refund period] business days.",
    ],
  },
  {
    heading: "Products",
    body: [
      "We sell refilled purified water, alkaline water, and fruit juice. Refill volumes are measured at the store.",
      "Product descriptions and images are indicative. Actual bottles and labelling may differ.",
    ],
  },
  {
    heading: "Limitation of liability",
    body: [
      "We do not exclude any liability that cannot be excluded by law, including under the Consumer Protection Act.",
      "To the extent the law allows, we are not liable for indirect or consequential loss.",
      "You must store and consume water and juice as instructed and within a reasonable time.",
    ],
  },
  {
    heading: "Governing law",
    body: ["These terms are governed by the laws of South Africa."],
  },
  {
    heading: "Changes to these terms",
    body: [
      "We may update these terms from time to time. The version in force is the one published on this page.",
    ],
  },
];
