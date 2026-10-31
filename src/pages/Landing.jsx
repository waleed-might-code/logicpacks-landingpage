import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BrandMark } from '../components/BrandIcons';
import { AgentButton, CopyLine, DownloadButton } from '../components/Buttons';
import MediaSlot from '../components/MediaSlot';
import { BetaPill, container } from '../components/Section';
import { CONNECT_PROMPT, LAUNCH_MEDIA, LINKS, TOGETHER_MEDIA, TOOLS } from '../site';

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
    <section className={`${container} grid items-center gap-10 pb-16 pt-14 sm:pt-20 lg:grid-cols-[5fr_7fr] lg:gap-14 lg:pb-24`}>
      <div>
        <p className="text-[40px] font-semibold leading-none tracking-[-0.045em] text-ink sm:text-[52px]">LogicPacks</p>
        <h1 className="mt-6 text-[22px] font-normal leading-[1.2] tracking-[-0.02em] text-ink sm:text-[26px]">
          Agents and people, one workspace.
        </h1>
        <p className="mt-3 text-[14px] leading-[1.55] text-muted">
          Share a project with your team. Everyone brings their own agent.
          <br className="hidden sm:block" /> Work side by side and see what everyone is doing.
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-2">
          <DownloadButton />
          <AgentButton onCopied={(ok) => setHint(ok ? 'copied' : 'failed')} />
        </div>
        <p aria-live="polite" className="mt-3 min-h-[18px] text-[12px] text-faint">
          {hint === 'copied' && 'Copied. Paste it into Claude Code, Codex, Cursor or any agent.'}
          {hint === 'failed' && `Could not copy here. Paste this into your agent: ${CONNECT_PROMPT}`}
        </p>
      </div>
      <MediaSlot
        className="rounded-[10px] border border-[#3a3a3a]"
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
    </section>
  );
}

function Row({ id, title, beta = false, children, action, visual }) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={`${container} grid items-center gap-8 border-t border-line py-14 sm:py-16 lg:grid-cols-[5fr_7fr] lg:gap-14`}
    >
      <div className="min-w-0">
        {beta && <BetaPill />}
        <h2 id={`${id}-title`} className={`${rowTitle} ${beta ? 'mt-4' : ''}`}>
          {title}
        </h2>
        {children}
        <div className="mt-6">{action}</div>
      </div>
      <div className="min-w-0">{visual}</div>
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

function Closing() {
  return (
    <section
      aria-labelledby="closing-title"
      className={`${container} grid gap-6 border-t border-line py-14 sm:py-16 lg:grid-cols-[5fr_7fr] lg:gap-14`}
    >
      <h2 id="closing-title" className={rowTitle}>
        We are a small team.
        <span className="block text-muted">Try it on your next project.</span>
      </h2>
      <div>
        <p className="max-w-[520px] text-[14px] leading-[1.55] text-muted">
          Use it for the work you already have, and tell us what breaks. New things land on the releases page first.
        </p>
        <Link to={LINKS.whatsNew} className="mt-4 inline-flex items-center gap-2 text-[13px] text-ink hover:underline">
          See what&rsquo;s new <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}

export default function Landing() {
  return (
    <>
      <Hero />
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
      <Closing />
    </>
  );
}
