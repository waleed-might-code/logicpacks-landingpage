import { Link } from 'react-router-dom';
import { LINKS } from '../site';
import Logo from './Logo';

const COLUMNS = [
  {
    title: 'Product',
    links: [
      { label: 'Download', to: LINKS.download },
      { label: 'Web app', href: LINKS.webApp },
      { label: 'Sign in', href: LINKS.signIn },
    ],
  },
  {
    title: 'Docs',
    links: [{ label: 'Getting started', href: LINKS.docs }],
  },
];

const linkClass = 'text-[12px] text-muted transition-colors hover:text-ink';

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex w-full max-w-site flex-col gap-10 px-4 pb-16 pt-8 sm:flex-row sm:px-8">
        <div className="sm:w-[400px]">
          <Logo className="text-[17px]" />
          <p className="mt-3 text-[12px] text-faint">&copy; {new Date().getFullYear()} LogicPacks</p>
        </div>
        <div className="flex gap-16">
          {COLUMNS.map((col) => (
            <div key={col.title} className="min-w-[110px]">
              <p className="text-[12px] text-faint">{col.title}</p>
              <ul className="mt-3 space-y-2.5">
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
    </footer>
  );
}
