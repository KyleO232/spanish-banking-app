import { Link } from 'react-router-dom';
import TopBar from '../components/TopBar.jsx';
import { privacyPolicy, termsOfUse } from '../data/legal.js';

// One page for both documents: /privacy and /terms.
function LegalPage({ doc, otherPath, otherLabel }) {
  return (
    <>
      <TopBar title={doc.title} subtitle={`Last updated ${doc.updated}`} />
      <div className="main legal">
        <p className="legal-intro">{doc.intro}</p>
        {doc.sections.map((section, i) => (
          <section key={section.heading} className="legal-section">
            <h2>
              {i + 1}. {section.heading}
            </h2>
            {section.body.map((block, j) =>
              typeof block === 'string' ? (
                <p key={j}>{block}</p>
              ) : (
                <ul key={j}>
                  {block.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )
            )}
          </section>
        ))}
        <p className="legal-other">
          <Link to={otherPath}>{otherLabel}</Link>
        </p>
      </div>
    </>
  );
}

export function PrivacyPolicy() {
  return <LegalPage doc={privacyPolicy()} otherPath="/terms" otherLabel="Read the Terms of Use" />;
}

export function TermsOfUse() {
  return <LegalPage doc={termsOfUse()} otherPath="/privacy" otherLabel="Read the Privacy Policy" />;
}
