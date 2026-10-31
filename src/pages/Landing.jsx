import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BrandMark } from '../components/BrandIcons';
import { AgentButton, CopyLine, DownloadButton, InstallCommand } from '../components/Buttons';
import LaunchMedia from '../components/LaunchMedia';
import { MotionBg, Reveal } from '../components/Motion';
import MediaSlot from '../components/MediaSlot';
import { BetaPill, container, display, Facts } from '../components/Section';
import { CONNECT_PROMPT, EVERY_APP_MEDIA, LINKS, RUNNING_AT, TOGETHER_MEDIA, TOOLS } from '../site';

// A short page in the shape of a product sheet: a hero, three rows (words and a
// button on the left, one visual on the right), a closing line and the footer.

const button =
  'inline-flex h-9 shrink-0 items-center rounded-full px-4 text-[14px] font-medium leading-none whitespace-nowrap transition-colors';
const primary = `${button} bg-ink text-page hover:bg-white`;
const rowTitle = 'text-[22px] font-normal leading-[1.2] tracking-[-0.02em] text-ink sm:text-[26px]';
const rowBody = 'mt-3 max-w-[460px] text-[14px] leading-[1.55] text-muted';

function Hero() {
  const [hint, setHint] = useState(null);
  return (
    <section className={`${container} pt-14 sm:pt-20`}>
      <h1 className={`${display} lp-rise`}>
        The best place for agents and humans to work together.
        <span className="block text-muted">Your code, your team and your agents in one shared project.</span>
      </h1>
      <div className="lp-rise mt-8 flex flex-wrap items-center gap-2" style={{ '--d': '120ms' }}>
        <DownloadButton />
        <AgentButton onCopied={(ok) => setHint(ok ? 'copied' : 'failed')} />
      </div>
      <div className="lp-rise mt-3 max-w-[460px]" style={{ '--d': '220ms' }}>
        <InstallCommand />
      </div>
      <p aria-live="polite" className="mt-3 min-h-[18px] text-[13px] text-faint">
        {hint === 'copied' && 'Copied. Paste it into Claude Code, Codex, Cursor or any agent.'}
        {hint === 'failed' && `Could not copy here. Paste this into your agent: ${CONNECT_PROMPT}`}
      </p>
    </section>
  );
}

const EVERY_APP = [
  { title: 'The same machine', body: 'Open the host’s apps with the same profiles. No VM.' },
  { title: 'A cursor for everyone', body: 'Live app views with a named cursor for each person and agent.' },
  { title: 'Snapshots that merge back', body: 'Work on a copy, then replay it as steps and settle conflicts.' },
];

// The scripted any-app demo, kept compact: one clip and three short cards.
function EveryApp() {
  return (
    <section id="every-app" aria-labelledby="every-app-title" className={`${container} pb-16 pt-20 sm:pt-24`}>
      <Reveal>
        <BetaPill />
        <h2 id="every-app-title" className={`${rowTitle} mt-4`}>
          Every app, every agent, one machine.{' '}
          <span className="text-muted">People and agents share the host&rsquo;s apps, from Blender to DaVinci Resolve.</span>
        </h2>
      </Reveal>
      <Reveal delay={120} className="mt-6 overflow-hidden rounded-xl border border-line bg-panel">
        <MediaSlot
          video={EVERY_APP_MEDIA.video}
          webm={EVERY_APP_MEDIA.webm}
          poster={EVERY_APP_MEDIA.poster}
          alt={EVERY_APP_MEDIA.alt}
          width={1600}
          height={900}
          label="Demo footage of shared apps"
          placeholder="Beta demo"
        />
        <Facts items={EVERY_APP} />
      </Reveal>
    </section>
  );
}

function Row({ id, title, beta = false, children, action, visual }) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={`${container} grid items-center gap-8 border-t border-line py-12 sm:py-14 lg:grid-cols-[5fr_7fr] lg:gap-14`}
    >
      <Reveal className="min-w-0">
        {beta && <BetaPill />}
        <h2 id={`${id}-title`} className={`${rowTitle} ${beta ? 'mt-4' : ''}`}>
          {title}
        </h2>
        {children}
        <div className="mt-6">{action}</div>
      </Reveal>
      <Reveal delay={140} className="min-w-0">
        {visual}
      </Reveal>
    </section>
  );
}

// Delegation: a plain diagram of a goal's milestones, who has each one and where
// it stands. A placeholder until the feature is filmed in the app.
const GOAL_ROWS = [
  { milestone: 'Sign-up flow', person: 'Omar', agent: 'Claude Code', status: 'Done', state: 'done' },
  { milestone: 'Welcome email', person: 'Mira', agent: 'Codex', status: 'On plan', state: 'on' },
  { milestone: 'Pricing page', person: 'Sam', agent: 'Cursor', status: 'Drifting', state: 'off', note: 'Also rewriting the nav' },
];

function StatusDot({ state }) {
  const cls = state === 'done' ? 'bg-ink' : state === 'on' ? 'border border-ink' : 'border border-dashed border-ink';
  return <span aria-hidden="true" className={`inline-block h-2 w-2 shrink-0 rounded-full ${cls}`} />;
}

function GoalDiagram() {
  return (
    <figure
      data-testid="goal-diagram"
      aria-label="Diagram: a goal split into milestones, each with a person, their agent and its status. One is drifting."
      className="rounded-xl border border-line bg-panel p-[18px] sm:p-[22px]"
    >
      <p className="text-[12px] text-faint">Goal</p>
      <p className="mt-1 text-[15px] text-ink">Ship the new onboarding by Friday</p>
      <ol className="mt-4 space-y-2">
        {GOAL_ROWS.map((row, i) => (
          <li
            key={row.milestone}
            className={`grid gap-1.5 rounded-lg border px-[14px] py-3 sm:grid-cols-[1.1fr_1.1fr_1.5fr] sm:items-center sm:gap-4 ${row.state === 'off' ? 'border-[#4a4a48] bg-raised' : 'border-line'}`}
          >
            <span className="flex items-center gap-3 text-[13px] text-ink">
              <span className="font-mono text-[11px] text-faint">{String(i + 1).padStart(2, '0')}</span>
              {row.milestone}
            </span>
            <span className="text-[13px] text-muted">
              {row.person} <span className="text-faint">· {row.agent}</span>
            </span>
            <span className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[13px]">
              <span className="inline-flex items-center gap-2 text-ink">
                <StatusDot state={row.state} />
                {row.status}
              </span>
              {row.note && <span className="text-[12px] text-faint">{row.note}</span>}
              {row.state === 'off' && (
                <span aria-hidden="true" className="flex gap-1.5 sm:ml-auto">
                  <span className="rounded-full border border-line px-2.5 py-[3px] text-[11px] text-ink">Message</span>
                  <span className="rounded-full border border-line px-2.5 py-[3px] text-[11px] text-ink">Watch</span>
                </span>
              )}
            </span>
          </li>
        ))}
      </ol>
    </figure>
  );
}

// Every harness and editor people bring, as a compact hairline grid of marks.
function ToolTile({ tool }) {
  return (
    <li
      data-testid="agent-tile"
      className="flex h-[76px] flex-col items-center justify-center gap-2 bg-panel px-1.5 text-center"
    >
      {tool.mark ? (
        <>
          <BrandMark slug={tool.mark} title={tool.name} className="h-[18px] w-[18px] text-ink" />
          <span className="text-[11px] leading-tight text-muted">{tool.name}</span>
        </>
      ) : (
        <span data-wordmark className="font-mono text-[12px] font-medium leading-tight tracking-[-0.02em] text-ink">
          {tool.name}
        </span>
      )}
    </li>
  );
}

function ToolStrip() {
  return (
    <div>
      <ul
        aria-label="Agents and editors that work with LogicPacks"
        className="grid grid-cols-4 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-5"
      >
        {TOOLS.map((tool) => (
          <ToolTile key={tool.name} tool={tool} />
        ))}
      </ul>
      <CopyLine text={CONNECT_PROMPT} prefix=">" label="the connect prompt" className="mt-3" />
    </div>
  );
}

// Where the work runs: two plain options, side by side.
const WHERE = [
  {
    title: 'Your machine',
    body: 'Use the Claude Code, Codex, OpenCode or Gemini CLI you already run. We do not run anything for you, and your login stays on your machine.',
  },
  {
    title: 'Our sandbox cloud',
    body: 'Each member gets an isolated sandbox user, with no access to the host or to other members. Work keeps going when your laptop is off.',
  },
];

function WhereItRuns() {
  return (
    <section
      id="where"
      aria-labelledby="where-title"
      className={`${container} grid gap-8 border-t border-line py-12 sm:py-14 lg:grid-cols-[5fr_7fr] lg:gap-14`}
    >
      <Reveal className="min-w-0">
        <h2 id="where-title" className={rowTitle}>
          Where it runs.
        </h2>
        <p className={rowBody}>Pick per project. You can start on your machine and sync to the cloud later.</p>
        <p className="mt-4 text-[13px] text-faint">
          What we store, and what we never touch, is in the{' '}
          <Link to={LINKS.privacy} className="text-muted underline decoration-line underline-offset-4 hover:text-ink">
            privacy policy
          </Link>
          .
        </p>
      </Reveal>
      <Reveal delay={140} className="grid min-w-0 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2">
        {WHERE.map((item) => (
          <div key={item.title} className="bg-panel p-[22px]">
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-faint">{item.title}</p>
            <p className="mt-3 text-[14px] leading-[1.55] text-ink">{item.body}</p>
          </div>
        ))}
      </Reveal>
    </section>
  );
}

// "Running at": confirmed company names only. Renders nothing while the list is empty.
export function RunningAt({ names = RUNNING_AT }) {
  if (!names.length) return null;
  return (
    <section aria-label="Running at" className={`${container} border-t border-line py-10`}>
      <div className="flex flex-wrap items-center gap-x-10 gap-y-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-faint">Running at</p>
        {names.map((name) => (
          <span key={name} data-testid="running-at" className="text-[15px] font-medium tracking-[-0.01em] text-muted">
            {name}
          </span>
        ))}
      </div>
    </section>
  );
}

function Closing() {
  return (
    <section aria-labelledby="closing-title" className="relative isolate mt-6 overflow-hidden border-t border-line">
      <MotionBg name="wave" shade="bg-gradient-to-b from-page/85 via-page/70 to-page/90" />
      <Reveal className={`${container} grid gap-6 py-20 sm:py-28 lg:grid-cols-[5fr_7fr] lg:gap-14`}>
        <h2 id="closing-title" className={rowTitle}>
          We are a small team.
          <span className="block text-muted">Try it on your next project.</span>
        </h2>
        <div>
          <p className="max-w-[520px] text-[14px] leading-[1.55] text-muted">
            Use it for the work you already have, and tell us what breaks. New things land on the releases page first.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <DownloadButton />
            <Link to={LINKS.whatsNew} className="inline-flex items-center gap-2 text-[13px] text-ink hover:underline">
              See what&rsquo;s new <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export default function Landing() {
  return (
    <>
      <Hero />
      <LaunchMedia />
      <EveryApp />
      <Row
        id="together"
        title="Work together."
        action={
          <a href={LINKS.webApp} className={primary}>
            Start a shared project
          </a>
        }
        visual={
          <MediaSlot
            className="rounded-[10px] border border-[#3a3a3a]"
            video={TOGETHER_MEDIA.video}
            poster={TOGETHER_MEDIA.poster}
            alt={TOGETHER_MEDIA.alt}
            label="Two people working in one shared project"
            width={1280}
            height={720}
          />
        }
      >
        <p className={rowBody}>
          One shared project for the whole team. Everyone works with their own agent in their own thread, you see who is
          working on what, and agents can message each other.
        </p>
      </Row>
      <Row
        id="delegate"
        title="Delegate with guardrails."
        beta
        action={
          <a href={LINKS.webApp} className={primary}>
            Plan a goal
          </a>
        }
        visual={<GoalDiagram />}
      >
        <p className={rowBody}>
          Hand work to a teammate, or an outside team, as clear milestones with limits. Their agent stays on plan, and you
          see the moment anything drifts. Message them or watch, right there.
        </p>
      </Row>
      <Row
        id="agents"
        title="Works with your agent."
        action={<AgentButton />}
        visual={<ToolStrip />}
      >
        <p className={rowBody}>
          Use Claude Code, Codex, Cursor, VS Code and more, on your own subscription. Add a pack of your team&rsquo;s
          know-how and any agent works your way, with no fine-tuning.
        </p>
      </Row>
      <WhereItRuns />
      <RunningAt />
      <Closing />
    </>
  );
}
