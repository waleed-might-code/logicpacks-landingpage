import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';

const NAV_LINKS = [
  { to: '/#modes', label: 'Platform' },
  { to: '/store', label: 'Marketplace' },
  { to: '/shop', label: 'Shop' },
  { to: '/ventures', label: 'Ventures' },
  { to: '/courses', label: 'Learn' },
  { to: '/ambassadors', label: 'Ambassadors' },
  { to: '/payments', label: 'Payments' },
  { to: '/cli', label: 'CLI' },
  { to: '/#pricing', label: 'Pricing' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isActive = (to) => {
    if (to.startsWith('/#')) return location.pathname === '/' && location.hash === to.slice(1);
    return location.pathname === to;
  };

  const renderLink = (link, mobile = false) => {
    const active = isActive(link.to);
    const isHash = link.to.startsWith('/#');
    const className = mobile
      ? `px-4 py-2 text-sm rounded-md ${active ? 'text-white bg-white/5' : 'text-neutral-400 hover:text-white hover:bg-white/5'}`
      : `text-[11px] uppercase font-medium tracking-[0.15em] transition-colors ${active ? 'text-white' : 'text-neutral-400 hover:text-white'}`;

    if (isHash) {
      const hashPart = link.to.slice(1); // e.g. '#pricing'
      return (
        <Link key={link.to} to={{ pathname: '/', hash: hashPart }} className={className} onClick={() => setMobileOpen(false)}>
          {link.label}
        </Link>
      );
    }
    return (
      <Link key={link.to} to={link.to} className={className} onClick={() => setMobileOpen(false)}>
        {link.label}
      </Link>
    );
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/[0.06] h-14 transition-all duration-300">
      <div className="flex w-full h-full max-w-[1440px] mx-auto px-6 md:px-8 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-md border border-white/10 flex items-center justify-center bg-white/[0.03] group-hover:border-green-500/40 transition-colors">
            <Icon icon="solar:widget-5-linear" className="text-green-500 text-sm" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-white">Logic Packs</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((l) => renderLink(l))}
        </nav>

        {/* CTA */}
        <Link to="/" className="hidden md:flex bg-white text-black text-xs font-semibold tracking-wide uppercase rounded-md px-5 py-2 hover:bg-neutral-200 transition-colors">
          Get Started
        </Link>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setMobileOpen(!mobileOpen)}>
          <Icon icon="solar:hamburger-menu-linear" width={22} />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/[0.06] p-4 flex flex-col gap-2">
          {NAV_LINKS.map((l) => renderLink(l, true))}
        </div>
      )}
    </header>
  );
}

