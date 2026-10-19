import LegalPage from "@/components/LegalPage";
import { LEGAL_LAST_UPDATED, privacyPolicy } from "@/lib/legal-content";

const Privacy = () => (
  <LegalPage title="Privacy Policy" lastUpdated={LEGAL_LAST_UPDATED} sections={privacyPolicy} />
);

export default Privacy;
