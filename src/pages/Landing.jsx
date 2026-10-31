import { useState } from 'react';
import { AgentButton, DownloadButton } from '../components/Buttons';
import { AppsIcon, CodeIcon, LinkIcon } from '../components/Icons';
import LaunchMedia from '../components/LaunchMedia';
import MediaSlot from '../components/MediaSlot';
import { EVERY_APP_MEDIA } from '../site';

const container = 'mx-auto w-full max-w-site px-4 sm:px-8';
const display = 'text-[28px] font-normal leading-[1.12] tracking-[-0.025em] sm:text-[38px]';
// Hairlines between grid cells: stacked on phones, side by side from sm up.
const divided = (i) => (i > 0 ? 'border-t border-line sm:border-l sm:border-t-0' : '');

const CARDS = [
  {
    icon: CodeIcon,
    title: 'Code together',
    status: 'Now',
    body: 'Your repo, your branches, your agents. Everyone works in the same threads, every change lands as a diff, and it all pushes through GitHub.',
    meta: 'Mac app and web',
  },
  {
    icon: AppsIcon,
    title: 'Any app, with recipes',
    status: 'Coming soon',
    body: 'Recipes teach agents an app. Code is the first one. Blender, DaVinci Resolve, the browser and your IDE come next.',
    meta: 'Mac app',
  },
  {
    icon: LinkIcon,
    title: 'Invite with one link',
    status: 'Now',
    body: 'Share a project from your own folder in one step. The people you add, and their agents, open the same project and push to the same repo.',
    meta: 'Anyone on LogicPacks',
  },
];

const SYNC_PANELS = [
  {
    title: 'A new project says Not synced.',
    sub: 'It stays on your laptop until you press Sync, or say "sync this to the cloud" in its chat.',
    img: '/shots/sync.jpg',
    alt: 'The LogicPacks Cloud menu on a local project: only on this machine, with the choice to move it to the cloud or keep both in sync.',
  },
  {
    title: 'A synced project keeps going.',
    sub: 'It lives on the cloud host, backed by GitHub. Everyone you add sees it, laptop open or not.',
    img: '/shots/together.jpg',
    alt: 'The LogicPacks Collaboration panel: activity, people, approvals, branches and provider accounts for a shared project.',
  },
];

const SYNC_FACTS = [
  { title: 'Pushes and pulls on its own', body: 'Local work goes up and upstream comes down continuously, the same for everyone.' },
  { title: 'Agents watch upstream', body: 'Every agent in a synced project fetches, rebases or merges, and flags conflicts it cannot settle.' },
  { title: 'Your own Claude login', body: 'Each person connects their account once. The cloud host runs their turns with it.' },
];

const EVERY_APP = [
  { title: 'The same machine', body: 'Open the host’s apps with the same profiles. No VM.' },
  { title: 'Who is doing what', body: 'Swipe up to see the shared machine and every human and agent on it.' },
  { title: 'A cursor for everyone', body: 'Live app views with a named cursor for each person and agent.' },
  { title: 'Snapshots that merge back', body: 'Work on a copy, then replay it as steps and settle conflicts.' },
];

function Hero() {
  const [hint, setHint] = useState(null);
  return (
    <section className={`${container} pt-16 sm:pt-24`}>
      <h1 className={display}>
        The best place for agents and humans to work together.
        <span className="block text-muted">Your code, your team and your agents in one shared project.</span>
      </h1>
      <div className="mt-8 flex flex-wrap items-center gap-2">
        <DownloadButton />
        <AgentButton onCopied={(ok) => setHint(ok ? 'copied' : 'failed')} />
      </div>
      <p aria-live="polite" className="mt-3 min-h-[18px] text-[13px] text-faint">
        {hint === 'copied' && 'Copied. Paste it into Claude Code, Codex or any agent and it installs LogicPacks for you.'}
        {hint === 'failed' && 'Could not copy here. Open the "In your agent" tab below and copy the prompt from there.'}
      </p>
    </section>
  );
}

function Pillars() {
  return (
    <section aria-labelledby="pillars-title" className={`${container} pt-24 sm:pt-28`}>
      <h2 id="pillars-title" className={`${display} leading-[1.25] text-muted`}>
        <span className="text-ink">Code</span> with your <span className="text-ink">team</span>, hand work to your{' '}
        <span className="text-ink">agents</span>,
        <span className="block">
          and keep it all in <span className="text-ink">one place</span>.
        </span>
      </h2>
      <div className="mt-10 grid overflow-hidden rounded-xl border border-line bg-panel sm:grid-cols-3">
        {CARDS.map(({ icon: Icon, title, status, body, meta }, i) => (
          <article key={title} className={`flex flex-col p-[22px] ${divided(i)}`}>
            <div className="flex items-center justify-between">
              <Icon className="h-4 w-4 text-faint" />
              <span
                className={`rounded-full border px-2 py-[3px] text-[11px] leading-none ${status === 'Now' ? 'border-[#3a3a3a] text-ink' : 'border-line text-faint'}`}
              >
                {status}
              </span>
            </div>
            <h3 className="mt-4 text-[15px] font-normal text-ink">{title}</h3>
            <p className="mt-2 text-[13px] leading-[1.4] text-muted">{body}</p>
            <p className="mt-auto pt-5 text-[13px] text-faint">{meta}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Sync() {
  return (
    <section id="sync" aria-labelledby="sync-title" className={`${container} pt-28 sm:pt-36`}>
      <h2 id="sync-title" className={display}>
        Sync to the cloud. <span className="text-muted">Your agents keep working when your laptop is off.</span>
      </h2>
      <div className="mt-8 grid overflow-hidden rounded-xl border border-line bg-panel sm:grid-cols-2">
        {SYNC_PANELS.map((panel, i) => (
          <figure key={panel.title} className={`flex flex-col ${divided(i)}`}>
            <figcaption className="px-[18px] pt-[18px]">
              <p className="text-[13px] text-ink">{panel.title}</p>
              <p className="mt-0.5 text-[12px] text-faint">{panel.sub}</p>
            </figcaption>
            <div className="mt-5 px-[14px] pb-[22px]">
              <img
                src={panel.img}
                alt={panel.alt}
                loading="lazy"
                width="1040"
                height="1080"
                className="block aspect-[4/3] h-auto w-full rounded-md border border-line object-cover object-top grayscale"
              />
            </div>
          </figure>
        ))}
      </div>
      <div className="mt-3 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3">
        {SYNC_FACTS.map((fact) => (
          <div key={fact.title} className="bg-panel p-[18px]">
            <p className="text-[13px] text-ink">{fact.title}</p>
            <p className="mt-1 text-[12px] leading-[1.45] text-faint">{fact.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function EveryApp() {
  return (
    <section id="every-app" aria-labelledby="every-app-title" className={`${container} pt-28 sm:pt-36`}>
      <p className="inline-flex h-7 items-center rounded-full border border-line bg-raised px-3 text-[12px] text-muted">
        Coming soon
      </p>
      <h2 id="every-app-title" className={`${display} mt-6`}>
        Every app, every agent, one machine.{' '}
        <span className="text-muted">
          People and agents share the host&rsquo;s apps, from Blender to DaVinci Resolve, and see each other work.
        </span>
      </h2>
      <div className="mt-8 overflow-hidden rounded-xl border border-line bg-panel">
        <MediaSlot
          video={EVERY_APP_MEDIA.video}
          poster={EVERY_APP_MEDIA.poster}
          label="Demo footage of shared apps"
          placeholder="Demo coming soon"
        />
        <div className="grid border-t border-line sm:grid-cols-4">
          {EVERY_APP.map((item, i) => (
            <div key={item.title} className={`p-[18px] ${divided(i)}`}>
              <p className="text-[13px] text-ink">{item.title}</p>
              <p className="mt-1 text-[12px] leading-[1.45] text-faint">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-3 text-[12px] text-faint">The web app is for code. Other recipes need the Mac app.</p>
    </section>
  );
}

function FinalCta() {
  return (
    <section aria-labelledby="cta-title" className={`${container} pb-24 pt-40 text-center sm:pb-28 sm:pt-56`}>
      <h2 id="cta-title" className="text-[26px] font-normal leading-[1.15] tracking-[-0.02em] sm:text-[30px]">
        Start your next project in LogicPacks.
      </h2>
      <p className="mt-3 text-[13px] text-muted">Your code, your team and your agents, working together.</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
        <DownloadButton />
        <AgentButton />
      </div>
    </section>
  );
}

export default function Landing() {
  return (
    <>
      <Hero />
      <LaunchMedia />
      <Pillars />
      <Sync />
      <EveryApp />
      <FinalCta />
    </>
  );
}
