import { Link } from 'react-router-dom';
import { DownloadButton } from '../components/Buttons';
import { container, display } from '../components/Section';
import { COMPANY, LINKS, PRICING } from '../site';

function Plan({ plan, action, children }) {
  return (
    <article data-testid="plan" className="flex flex-col rounded-xl border border-line bg-panel p-[22px]">
      <h2 className="text-[15px] text-ink">{plan.name}</h2>
      <p className="mt-4 flex items-baseline gap-2">
        <span className="text-[34px] font-normal tracking-[-0.03em] text-ink">{plan.price}</span>
        {plan.per && <span className="text-[13px] text-faint">{plan.per}</span>}
      </p>
      <p className="mt-1 text-[13px] text-muted">{plan.note}</p>
      <ul className="mt-6 space-y-2 text-[13px] text-ink">
        {plan.features.map((f) => (
          <li key={f} className="flex gap-2">
            <span aria-hidden="true" className="text-faint">+</span>
            {f}
          </li>
        ))}
      </ul>
      {children}
      <div className="mt-auto pt-8">{action}</div>
    </article>
  );
}

export default function Pricing() {
  const { individual, enterprise } = PRICING;
  return (
    <>
      <section className={`${container} pt-14 sm:pt-20`}>
        <h1 className={display}>
          Pricing. <span className="text-muted">Free for individuals. One plan for companies.</span>
        </h1>
      </section>
      <section className={`${container} grid gap-3 pt-10 sm:grid-cols-2`}>
        <Plan plan={individual} action={<DownloadButton />} />
        <Plan
          plan={enterprise}
          action={
            <a
              href={COMPANY.whatsappUrl}
              className="inline-flex h-9 items-center rounded-full border border-line bg-raised px-4 text-[14px] font-medium text-ink hover:bg-[#232323]"
            >
              Talk to us on WhatsApp
            </a>
          }
        >
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.08em] text-faint">Enterprise features, coming soon</p>
          <ul className="mt-3 space-y-2 text-[13px] text-muted">
            {enterprise.soon.map((f) => (
              <li key={f} data-testid="coming-soon" className="flex items-center gap-2">
                <span aria-hidden="true" className="text-faint">·</span>
                {f}
                <span className="rounded-full border border-line px-2 py-[2px] text-[10px] text-faint">Coming soon</span>
              </li>
            ))}
          </ul>
        </Plan>
      </section>
      <section className={`${container} pb-24 pt-8`}>
        <p className="max-w-[640px] text-[13px] leading-[1.55] text-faint">
          Your agent runs on your own Claude, Codex, OpenCode or Gemini subscription, so model usage is billed by them,
          not by us. A freelancer vetted by LogicPacks brings their own Claude and tools and uses none of your tokens:
          you pay for their hours, with their AI included. More on{' '}
          <Link to={LINKS.whatsNew} className="text-muted underline decoration-line underline-offset-4 hover:text-ink">
            what&rsquo;s new
          </Link>
          .
        </p>
      </section>
    </>
  );
}
