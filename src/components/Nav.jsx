import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LINKS, OPEN_SOURCE } from '../site';
import Logo from './Logo';

const link = 'text-[14px] text-muted transition-colors hover:text-ink';

// A floating glass pill (the "fable" navbar pattern from our library). It slides
// away while you scroll down and comes back as soon as you scroll up.
export default function Nav() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 320 || y < last - 4) setHidden(false);
      else if (y > last + 4) setHidden(true);
      last = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <header
      data-hidden={hidden ? 'true' : 'false'}
      className="lp-header pointer-events-none fixed inset-x-0 top-0 z-40 pt-3"
    >
      <nav
        aria-label="Main"
        className="pointer-events-auto mx-auto flex h-12 w-[calc(100%-32px)] max-w-[calc(1280px-64px)] items-center gap-5 rounded-full pl-5 pr-1.5 transition-colors sm:w-[calc(100%-64px)] sm:gap-7 lp-glass"
      >
        <Link to="/" aria-label="LogicPacks home" className="mr-auto flex items-center">
          <Logo />
        </Link>
        <Link to={LINKS.whatsNew} className={link}>
          What&rsquo;s new
        </Link>
        <Link to={LINKS.pricing} className={`${link} hidden sm:inline`}>
          Pricing
        </Link>
        <a href={LINKS.docs} className={`${link} hidden sm:inline`}>
          Docs
        </a>
        <a href={OPEN_SOURCE.repo} className={`${link} hidden sm:inline`}>
          {OPEN_SOURCE.label}
        </a>
        <Link
          to={LINKS.download}
          className="inline-flex h-9 items-center rounded-full bg-ink px-4 text-[14px] font-medium leading-none text-page transition-colors hover:bg-white"
        >
          Download
        </Link>
      </nav>
    </header>
  );
}
