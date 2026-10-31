import { Link } from 'react-router-dom';
import { LINKS } from '../site';
import Logo from './Logo';

const pill = 'inline-flex h-7 items-center rounded-full px-3 text-[14px] leading-none transition-colors';

export default function Nav() {
  return (
    <header className="w-full">
      <nav aria-label="Main" className="mx-auto flex h-14 w-full max-w-site items-center px-4 sm:px-8">
        <Link to="/" aria-label="LogicPacks home" className="flex items-center">
          <Logo />
        </Link>
        <div className="ml-10 hidden items-center gap-8 sm:flex">
          <Link to={LINKS.download} className="text-[14px] text-muted transition-colors hover:text-ink">
            Download
          </Link>
          <a href={LINKS.docs} className="text-[14px] text-muted transition-colors hover:text-ink">
            Docs
          </a>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <a href={LINKS.signIn} className={`${pill} border border-line text-muted hover:text-ink`}>
            Sign in
          </a>
          <Link to={LINKS.download} className={`${pill} bg-ink font-medium text-page hover:bg-white`}>
            Download
          </Link>
        </div>
      </nav>
    </header>
  );
}
