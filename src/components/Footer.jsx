import { Link } from 'react-router-dom';
import { COMPANY, DEVELOPER, LINKS } from '../site';
import Logo from './Logo';

const COLUMNS = [
  {
    title: 'Product',
    links: [
      { label: 'Download', to: LINKS.download },
      { label: 'What’s new', to: LINKS.whatsNew },
      { label: 'Pricing', to: LINKS.pricing },
      { label: 'Web app', href: LINKS.webApp },
    ],
  },
  {
    title: 'Developers',
    links: [
      { label: 'Getting started', href: LINKS.docs },
      { label: 'Sign in', href: LINKS.signIn },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Our story', to: LINKS.story },
      { label: 'Research', to: LINKS.research },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', to: LINKS.privacy },
      { label: 'Terms', to: LINKS.terms },
      { label: 'Safety', href: '/safety.md' },
      { label: 'Compare', href: '/compare.md' },
    ],
  },
  {
    title: 'Contact',
    links: [{ label: `WhatsApp ${COMPANY.whatsapp}`, href: COMPANY.whatsappUrl }],
  },
];

const linkClass = 'text-[13px] text-muted transition-colors hover:text-ink';
const WORD = 'LogicPacks';

// Link columns, then a big outline wordmark drifting sideways (the "letta" footer
// pattern from our library), then a thin bottom bar.
export default function Footer() {
  return (
    <footer className="mt-10 border-t border-line">
      <div className="mx-auto flex w-full max-w-site flex-col gap-10 px-4 pt-12 sm:flex-row sm:px-8">
        <div className="sm:w-[400px]">
          <Logo className="text-[17px]" />
          <p className="mt-3 max-w-[260px] text-[13px] leading-[1.5] text-faint">
            Agents and people in one shared project.
          </p>
          <p className="mt-4 max-w-[300px] text-[12px] leading-[1.5] text-faint">
            Developed by{' '}
            <a href={DEVELOPER.url} className="text-muted transition-colors hover:text-ink">
              {DEVELOPER.name}
            </a>
            . Operated by{' '}
            <a href={COMPANY.website} className="text-muted transition-colors hover:text-ink">
              {COMPANY.name}
            </a>
            , {COMPANY.city}. Since {COMPANY.since}.
            <span className="block">{COMPANY.address}</span>
            <span className="block">{COMPANY.licence}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-x-14 gap-y-8">
          {COLUMNS.map((col) => (
            <div key={col.title} className="min-w-[110px]">
              <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-faint">{col.title}</p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.to ? (
                      <Link to={link.to} className={linkClass}>
                        {link.label}
                      </Link>
                    ) : (
                      <a href={link.href} className={linkClass}>
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div aria-hidden="true" className="lp-fade-x mt-12 overflow-hidden select-none">
        <div className="lp-marquee flex w-max" style={{ '--dur': '70s' }}>
          {Array.from({ length: 6 }, (_, i) => (
            <span
              key={i}
              className="lp-outline pr-[0.35em] text-[96px] font-semibold leading-[0.95] tracking-[-0.05em] sm:text-[168px]"
            >
              {WORD}
            </span>
          ))}
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-site items-center border-t border-line px-4 py-5 font-mono text-[11px] text-faint sm:px-8">
        <span>
          &copy; {new Date().getFullYear()} LogicPacks by {COMPANY.name}, {COMPANY.city}, {COMPANY.country}
        </span>
      </div>
    </footer>
  );
}
