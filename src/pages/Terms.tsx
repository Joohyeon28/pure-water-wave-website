import LegalPage from "@/components/LegalPage";
import { LEGAL_LAST_UPDATED, termsAndConditions } from "@/lib/legal-content";

const Terms = () => (
  <LegalPage
    title="Terms and Conditions"
    lastUpdated={LEGAL_LAST_UPDATED}
    sections={termsAndConditions}
  />
);

export default Terms;
