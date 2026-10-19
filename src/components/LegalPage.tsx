import { Link } from "react-router-dom";
import { LEGAL_DRAFT_NOTICE } from "@/lib/legal-content";
import type { LegalSection } from "@/lib/legal-content";

interface LegalPageProps {
  title: string;
  lastUpdated: string | null;
  sections: LegalSection[];
}

const LegalPage = ({ title, lastUpdated, sections }: LegalPageProps) => (
  <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
    <h1 className="text-3xl sm:text-4xl font-bold text-foreground">{title}</h1>

    <div className="mt-6 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3">
      <p className="text-sm font-semibold text-amber-800">DRAFT — not legal advice</p>
      <p className="mt-1 text-sm text-amber-800">{LEGAL_DRAFT_NOTICE}</p>
    </div>

    {lastUpdated ? (
      <p className="mt-4 text-sm text-muted-foreground">Last updated: {lastUpdated}</p>
    ) : null}

    <div className="mt-10 space-y-8">
      {sections.map((section) => (
        <section key={section.heading}>
          <h2 className="text-xl font-bold text-foreground mb-3">{section.heading}</h2>
          <div className="space-y-3">
            {section.body.map((paragraph, index) => (
              <p key={index} className="text-muted-foreground leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      ))}
    </div>

    <Link to="/" className="mt-12 inline-block text-primary hover:underline">
      Back to home
    </Link>
  </div>
);

export default LegalPage;
