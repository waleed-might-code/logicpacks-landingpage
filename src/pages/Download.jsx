import { useEffect, useRef, useState } from 'react';
import { InstallCommand, copyText } from '../components/Buttons';
import { AppleIcon, CheckIcon } from '../components/Icons';
import { AGENT_PROMPT, DOWNLOADS, LINKS } from '../site';

const container = 'mx-auto w-full max-w-site px-4 sm:px-8';
const box = 'rounded-xl border border-line bg-panel p-[22px]';
const btn =
  'inline-flex h-9 shrink-0 items-center gap-2 rounded-full px-4 text-[14px] font-medium leading-none whitespace-nowrap transition-colors';

function CopyButton({ text, label = 'Copy', className = '' }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  return (
    <button
      type="button"
      onClick={async () => {
        if (!(await copyText(text))) return;
        setCopied(true);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopied(false), 2000);
      }}
      className={`inline-flex h-7 shrink-0 items-center gap-1.5 rounded-full border border-line bg-raised px-3 text-[12px] text-ink transition-colors hover:border-[#3a3a3a] hover:bg-[#232323] ${className}`}
    >
      {copied && <CheckIcon className="h-3 w-3" />}
      {copied ? 'Copied' : label}
    </button>
  );
}

function Tag({ children, strong = false }) {
  return (
    <span
      className={`inline-flex self-start rounded-full border px-2 py-[3px] text-[11px] leading-none ${strong ? 'border-[#3a3a3a] text-ink' : 'border-line text-faint'}`}
    >
      {children}
    </span>
  );
}

function MacBox() {
  const mac = DOWNLOADS.mac;
  const ready = Boolean(mac.url);
  const meta = [mac.version && `Version ${mac.version}`, mac.size, mac.requires].filter(Boolean).join(' · ');
  return (
    <article id="mac" className={`${box} flex flex-col`}>
      <Tag strong>Recommended</Tag>
      <h2 className="mt-4 text-[20px] font-normal tracking-[-0.015em] text-ink">LogicPacks for Mac</h2>
      <ol className="mt-4 space-y-2.5 text-[13px] leading-[1.45] text-muted">
        {[
          'Download the .dmg and open it.',
          'Drag LogicPacks to Applications, then open it.',
          'It uses your Claude Code login on this Mac. Add a folder and start a thread.',
        ].map((step, i) => (
          <li key={step} className="flex gap-3">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-line text-[11px] text-faint">
              {i + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
      <div className="mt-6 flex flex-wrap items-center gap-2">
        {ready ? (
          <a href={mac.url} download className={`${btn} bg-ink text-page hover:bg-white`}>
            <AppleIcon className="h-[14px] w-[14px] -translate-y-px" />
            Download .dmg
          </a>
        ) : (
          <span aria-disabled="true" className={`${btn} cursor-not-allowed border border-line text-faint`}>
            <AppleIcon className="h-[14px] w-[14px] -translate-y-px" />
            The .dmg is on the way
          </span>
        )}
        <a href={LINKS.webApp} className={`${btn} border border-line bg-raised text-ink hover:bg-[#232323]`}>
          Use the web app
        </a>
      </div>
      {meta && <p className="mt-4 text-[12px] text-faint">{meta}</p>}
      {ready && (
        <div className="mt-5">
          <p className="text-[12px] text-faint">Or in Terminal: installs to Applications and checks the file for you.</p>
          <InstallCommand className="mt-1.5" />
        </div>
      )}
      <div className="mt-auto pt-6">
        <p className="text-[12px] text-faint">SHA-256</p>
        {mac.sha256 ? (
          <div className="mt-1.5 flex items-center gap-2">
            <code className="min-w-0 flex-1 truncate rounded-md border border-line bg-page px-2.5 py-1.5 font-mono text-[12px] text-muted">
              {mac.sha256}
            </code>
            <CopyButton text={mac.sha256} />
          </div>
        ) : (
          <p className="mt-1.5 text-[12px] text-muted">Published here with the release.</p>
        )}
      </div>
    </article>
  );
}

function AgentBox() {
  return (
    <article id="agent" className={`${box} flex flex-col`}>
      <Tag>Any agent with a shell</Tag>
      <h2 className="mt-4 text-[20px] font-normal tracking-[-0.015em] text-ink">Install with your agent</h2>
      <p className="mt-2 text-[13px] leading-[1.45] text-muted">
        Paste this into Claude Code, Codex or any agent. It downloads the app, checks the file and sets your project up.
      </p>
      <pre className="mt-4 max-h-[260px] flex-1 overflow-auto whitespace-pre-wrap rounded-md border border-line bg-page p-4 font-mono text-[12px] leading-[1.65] text-muted">
        {AGENT_PROMPT}
      </pre>
      <div className="mt-3">
        <CopyButton text={AGENT_PROMPT} label="Copy prompt" />
      </div>
    </article>
  );
}

const OTHERS = [
  {
    id: 'windows',
    title: 'Windows',
    body: 'A Windows build is in the works.',
    url: DOWNLOADS.windows.url,
    cta: 'Download for Windows',
  },
  {
    id: 'ios',
    title: 'iPhone and iPad',
    body: 'Check on your agents and your team from your phone.',
    url: DOWNLOADS.ios.url,
    cta: 'Get it on the App Store',
  },
  {
    id: 'web',
    title: 'Web app',
    body: 'Code projects in any browser, with your agents running on the computer you connect. Other recipes need the Mac app.',
    url: LINKS.webApp,
    cta: 'Open the web app',
  },
];

export default function Download() {
  return (
    <section aria-labelledby="download-title" className={`${container} pb-24 pt-16 sm:pb-32 sm:pt-24`}>
      <p className="inline-flex h-7 items-center rounded-full border border-line bg-raised px-3 text-[12px] text-muted">
        Mac app and web app
      </p>
      <h1
        id="download-title"
        className="mt-6 text-[28px] font-normal leading-[1.12] tracking-[-0.025em] sm:text-[38px]"
      >
        Download LogicPacks.
        <span className="block text-muted">On your Mac, or in the browser for code.</span>
      </h1>

      <div className="mt-10 grid gap-3 lg:grid-cols-2">
        <MacBox />
        <AgentBox />
      </div>

      <div className="mt-3 grid overflow-hidden rounded-xl border border-line bg-panel sm:grid-cols-3">
        {OTHERS.map((item, i) => (
          <article
            key={item.id}
            id={item.id}
            className={`flex flex-col p-[22px] ${i > 0 ? 'border-t border-line sm:border-l sm:border-t-0' : ''}`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-[15px] font-normal text-ink">{item.title}</h3>
              <Tag strong={Boolean(item.url)}>{item.url ? 'Available' : 'Coming soon'}</Tag>
            </div>
            <p className="mt-2 text-[13px] leading-[1.4] text-muted">{item.body}</p>
            <div className="mt-auto pt-5">
              {item.url ? (
                <a href={item.url} className="text-[13px] text-ink underline-offset-4 hover:underline">
                  {item.cta}
                </a>
              ) : (
                <span className="text-[13px] text-faint">Not available yet</span>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
