import { Link } from 'react-router-dom';
import { container } from '../components/Section';
import { COMPANY, DEVELOPER, LEGAL_EFFECTIVE, LINKS } from '../site';

// Plain, short privacy policy and terms. Both name the operator and are also
// prerendered to static HTML at build time (scripts/prerender.mjs), so they read
// the same without JavaScript.

const operator = `${COMPANY.name} (${COMPANY.form}), ${COMPANY.city}, ${COMPANY.country}`;

function Contact() {
  return (
    <>
      WhatsApp{' '}
      <a href={COMPANY.whatsappUrl} className="text-ink underline decoration-line underline-offset-4">
        {COMPANY.whatsapp}
      </a>
    </>
  );
}

function Operator() {
  return (
    <p>
      LogicPacks by {COMPANY.name} is operated by {operator}, {COMPANY.licence}. Address: {COMPANY.address}. Software developed by{' '}
      <a href={DEVELOPER.url} className="text-ink underline decoration-line underline-offset-4">
        {DEVELOPER.name}
      </a>
      . Contact:{' '}
      <Contact />.
    </p>
  );
}

function Page({ title, children, other }) {
  return (
    <article className={`${container} max-w-[760px] pb-24 pt-14 sm:pt-20`}>
      <h1 className="text-[28px] font-normal leading-[1.15] tracking-[-0.02em] sm:text-[34px]">{title}</h1>
      <p className="mt-2 font-mono text-[12px] text-faint">Effective {LEGAL_EFFECTIVE}</p>
      <div className="legal mt-10 space-y-8 text-[14px] leading-[1.65] text-muted">{children}</div>
      <p className="mt-12 text-[13px] text-faint">
        See also <Link to={other.to} className="text-ink underline decoration-line underline-offset-4">{other.label}</Link>.
      </p>
    </article>
  );
}

function Part({ title, children }) {
  return (
    <section>
      <h2 className="text-[15px] font-medium text-ink">{title}</h2>
      <div className="mt-2 space-y-2">{children}</div>
    </section>
  );
}

export function Privacy() {
  return (
    <Page title="Privacy" other={{ to: LINKS.terms, label: 'the terms' }}>
      <Part title="Who we are">
        <Operator />
      </Part>
      <Part title="What we store">
        <ul className="list-disc space-y-1 pl-5">
          <li>Your account: name, email address and a hashed password, or the sign-in you used.</li>
          <li>Workspace and project details: names, members, invites, threads and their status.</li>
          <li>Projects stay on your machine, or on the host&rsquo;s laptop when shared. Syncing projects to our cloud is coming soon and is not available yet.</li>
          <li>Basic logs needed to run the service and fix problems, kept for a short time.</li>
        </ul>
      </Part>
      <Part title="What we do not store">
        <p>
          We never store or proxy model API keys. Your agent runs on your own Claude Code or Codex
          login on your machine, and your login stays there.
        </p>
      </Part>
      <Part title="Our cloud (coming soon)">
        <p>
          Our cloud is coming soon and is not available yet. As designed, each member of a cloud workspace gets an isolated sandbox user with no access to the
          host or to other members&rsquo; sandboxes.
        </p>
      </Part>
      <Part title="Your choices">
        <p>
          You can ask us to export or delete your account and everything stored with it. Send the request from the email
          on your account, or contact us on <Contact />. We confirm when it is done.
        </p>
      </Part>
      <Part title="Changes">
        <p>If this policy changes in a way that matters, we say so in the app and on the releases page first.</p>
      </Part>
    </Page>
  );
}

export function Terms() {
  return (
    <Page title="Terms" other={{ to: LINKS.privacy, label: 'the privacy policy' }}>
      <Part title="Who we are">
        <Operator />
      </Part>
      <Part title="Using LogicPacks">
        <p>
          You can use LogicPacks for your own work and your team&rsquo;s. You are responsible for your account, for the
          people you invite and for what you and your agents do with it. Use your own agent subscriptions within their
          providers&rsquo; terms.
        </p>
        <p>Do not use LogicPacks to break the law, to attack or overload the service, or to reach other members&rsquo; data.</p>
      </Part>
      <Part title="Your work">
        <p>Your code and projects are yours. We only handle them to run the service for you.</p>
      </Part>
      <Part title="Beta features">
        <p>
          LogicPacks is under active development. Features labelled Beta (app sharing) may change or stop, and the service is provided as it is, without
          guarantees of availability or fitness for a purpose. Keep your own backups; synced projects also live in your
          GitHub repository.
        </p>
      </Part>
      <Part title="Liability">
        <p>
          To the extent the law allows, we are not liable for indirect or lost-profit damages, and our total liability is
          limited to what you paid us in the last twelve months.
        </p>
      </Part>
      <Part title="Ending">
        <p>You can stop at any time and ask us to delete your data. We may suspend accounts that break these terms.</p>
      </Part>
      <Part title="Law">
        <p>
          These terms are governed by the laws of the Emirate of Abu Dhabi and the federal laws of the United Arab Emirates.
          The courts of Abu Dhabi have jurisdiction over any dispute.
        </p>
      </Part>
    </Page>
  );
}
