import { Link } from 'react-router-dom';
import { LINKS } from '../site';
import Logo from './Logo';

const link = 'text-[14px] text-muted transition-colors hover:text-ink';

export default function Nav() {
  return (
    <header className="w-full">
      <nav aria-label="Main" className="mx-auto flex h-14 w-full max-w-site items-center gap-5 px-4 sm:gap-7 sm:px-8">
        <Link to="/" aria-label="LogicPacks home" className="mr-auto flex items-center">
          <Logo />
        </Link>
        <Link to={LINKS.whatsNew} className={link}>
          What&rsquo;s new
        </Link>
        <a href={LINKS.docs} className={`${link} hidden sm:inline`}>
          Docs
        </a>
        <Link to={LINKS.download} className={`${link} hidden sm:inline`}>
          Download
        </Link>
        <a
          href={LINKS.signIn}
          className="inline-flex h-7 items-center rounded-full border border-line px-3 text-[14px] leading-none text-muted transition-colors hover:text-ink"
        >
          Sign in
        </a>
      </nav>
    </header>
  );
}
