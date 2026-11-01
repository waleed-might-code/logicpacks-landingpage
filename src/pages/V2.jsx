import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BrandMark } from '../components/BrandIcons';
import { CopyLine } from '../components/Buttons';
import { AppleIcon } from '../components/Icons';
import Logo from '../components/Logo';
import MediaSlot from '../components/MediaSlot';
import { COMPANY, CONNECT_PROMPT, DEVELOPER, DOWNLOADS, HELPER_INSTALL, HELPER_INSTALL_WINDOWS, INSTALL_COMMAND, LAUNCH_MEDIA, LINKS, TOOLS } from '../site';

// A quieter landing to compare with /: the film, three lines, and how to get it.
// Everything else stays one click away ("View more") and in the markdown pages.
const wrap = 'mx-auto w-full max-w-[880px] px-5 sm:px-8';

const TABS = [
  { id: 'mac', label: 'macOS' },
  { id: 'windows', label: 'Windows' },
  { id: 'linux', label: 'Linux' },
  { id: 'agent', label: 'With your agent' },
];

function Note({ children }) {
  return <p className="mt-3 text-[12px] leading-[1.6] text-faint">{children}</p>;
}

function WebAppLine() {
  return (
    <Note>
      Or use the web app, no install:{' '}
      <a href={LINKS.webApp} className="text-muted underline-offset-2 hover:underline">
        app.logicpacks.io
      </a>
    </Note>
  );
}

function Panel({ tab }) {
  const mac = DOWNLOADS.mac;
  if (tab === 'mac')
    return (
      <>
        <a
          href={mac.url}
          className="inline-flex h-9 items-center gap-2 rounded-full bg-ink px-4 text-[14px] font-medium text-page hover:bg-white"
        >
          <AppleIcon className="h-[14px] w-[14px] -translate-y-px" />
          Download for Mac
        </a>
        <Note>
          Version {mac.version} · {mac.requires} · {mac.size}
        </Note>
        <p className="mt-6 text-[12px] text-muted">Or install from Terminal (checks the SHA-256 and opens the app):</p>
        <CopyLine text={INSTALL_COMMAND} label="the install command" className="mt-2" />
        <p className="mt-5 text-[12px] text-muted">Only the helper, to use LogicPacks from your agent:</p>
        <CopyLine text={HELPER_INSTALL} label="the helper install command" className="mt-2" />
      </>
    );
  if (tab === 'windows')
    return (
      <>
        <p className="text-[12px] text-muted">Install the helper in PowerShell, to use LogicPacks from your agent (tested on Windows 11 with Claude Code):</p>
        <CopyLine text={HELPER_INSTALL_WINDOWS} prefix=">" label="the PowerShell install command" className="mt-2" />
        <Note>Windows app coming soon.</Note>
        <WebAppLine />
      </>
    );
  if (tab === 'linux')
    return (
      <>
        <p className="text-[12px] text-muted">Install the helper, to use LogicPacks from your agent:</p>
        <CopyLine text={HELPER_INSTALL} label="the helper install command" className="mt-2" />
        <Note>Linux app coming soon.</Note>
        <WebAppLine />
      </>
    );
  return (
    <>
      <ul aria-label="Agents and editors that work with LogicPacks" className="flex flex-wrap items-center gap-x-5 gap-y-3">
        {TOOLS.map((tool) => (
          <li key={tool.name} className="flex items-center gap-1.5 text-[12px] text-muted">
            {tool.mark && <BrandMark slug={tool.mark} title="" className="h-[14px] w-[14px] text-ink" />}
            {tool.name}
          </li>
        ))}
      </ul>
      <p className="mt-6 text-[12px] text-muted">Paste this into your agent:</p>
      <CopyLine text={CONNECT_PROMPT} prefix=">" label="the connect prompt" className="mt-2" agentPrompt />
    </>
  );
}

function GetIt() {
  const [tab, setTab] = useState('mac');
  return (
    <section id="get" aria-labelledby="get-title" className={`${wrap} py-24 sm:py-32`}>
      <h2 id="get-title" className="text-[15px] font-medium text-ink">
        Get LogicPacks
      </h2>
      <div role="tablist" aria-label="Platform" className="mt-6 flex flex-wrap gap-1 border-b border-line">
        {TABS.map((t) => (
          <button
            key={t.id}
            id={`get-tab-${t.id}`}
            role="tab"
            type="button"
            aria-selected={tab === t.id}
            aria-controls="get-panel"
            onClick={() => setTab(t.id)}
            className={`-mb-px border-b px-3 pb-2.5 text-[13px] transition-colors ${tab === t.id ? 'border-ink text-ink' : 'border-transparent text-faint hover:text-muted'}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" id="get-panel" aria-labelledby={`get-tab-${tab}`} className="mt-8 max-w-[560px]">
        <Panel tab={tab} />
      </div>
    </section>
  );
}

const QUIET = [
  ['Story', '/story'],
  ['Research', '/research'],
  ['Pricing', '/pricing'],
  ['Compare', '/compare.md'],
  ['Safety', '/safety.md'],
  ['Privacy', '/privacy'],
  ['Terms', '/terms'],
];

export default function V2() {
  return (
    <div className="min-h-screen bg-page text-ink">
      <header className={`${wrap} flex h-16 items-center justify-between`}>
        <Link to="/v2" aria-label="LogicPacks">
          <Logo className="text-[15px]" />
        </Link>
        <Link to="/" className="text-[13px] text-muted hover:text-ink">
          View more
        </Link>
      </header>
      <main id="main">
        <section className={`${wrap} pt-12 sm:pt-20`}>
          <h1 className="text-[22px] font-medium leading-[1.3] tracking-[-0.02em] sm:text-[26px]">
            Your team and your agents, one workspace.
            <span className="block text-muted">A shared workspace for people and AI agents.</span>
          </h1>
          <p className="mt-4 max-w-[520px] text-[14px] leading-[1.6] text-faint">
            Bring your own Claude Code or Codex, add your team, and see what everyone is doing.
          </p>
          <div className="mt-10">
            <MediaSlot
              className="rounded-[10px] border border-line"
              image={LAUNCH_MEDIA.image}
              imageWebp={LAUNCH_MEDIA.imageWebp}
              video={LAUNCH_MEDIA.video}
              alt={LAUNCH_MEDIA.alt}
              label="LogicPacks launch video"
              width={1920}
              height={1080}
              soundToggle
              priority
            />
          </div>
        </section>
        <GetIt />
        <section className={`${wrap} pb-20`}>
          <Link to="/" className="inline-flex items-center gap-2 text-[13px] text-ink hover:underline">
            View more: how it works, how it compares, safety and pricing <span aria-hidden="true">→</span>
          </Link>
        </section>
      </main>
      <footer className={`${wrap} border-t border-line py-10`}>
        <nav aria-label="More" className="flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-faint">
          {QUIET.map(([label, href]) =>
            href.endsWith('.md') ? (
              <a key={href} href={href} className="hover:text-muted">
                {label}
              </a>
            ) : (
              <Link key={href} to={href} className="hover:text-muted">
                {label}
              </Link>
            ),
          )}
        </nav>
        <div className="mt-10 flex flex-wrap items-end justify-between gap-4">
          <Logo className="text-[28px] tracking-[-0.05em] text-muted" />
          <p className="text-[12px] text-faint">
            Developed by{' '}
            <a href={DEVELOPER.url} className="hover:text-muted">
              {DEVELOPER.name}
            </a>{' '}
            · Operated by {COMPANY.name} · © 2026
          </p>
        </div>
      </footer>
    </div>
  );
}
