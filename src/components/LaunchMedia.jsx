import { useState } from 'react';
import { AGENT_PROMPT, LAUNCH_MEDIA } from '../site';
import MediaSlot from './MediaSlot';
import { MotionBg } from './Motion';

const TABS = [
  { id: 'app', label: 'In LogicPacks' },
  { id: 'agent', label: 'In your agent' },
];

// The big launch visual: the real app screenshot now, public/launch.mp4 over
// it once that file is added.
function AppShot() {
  return (
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
  );
}

function AgentShot() {
  return (
    <div className="flex aspect-video w-full flex-col overflow-hidden rounded-[10px] border border-[#3a3a3a] bg-page">
      <div className="flex h-9 items-center gap-1.5 border-b border-line px-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#3a3a3a]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#3a3a3a]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#3a3a3a]" />
        <span className="ml-3 text-[12px] text-faint">Paste into Claude Code, Codex or any agent</span>
      </div>
      <pre className="flex-1 overflow-auto whitespace-pre-wrap p-5 font-mono text-[12px] leading-[1.7] text-muted sm:p-8 sm:text-[14px]">
        <span className="text-faint">&gt; </span>
        <span className="text-ink">{AGENT_PROMPT}</span>
      </pre>
    </div>
  );
}

export default function LaunchMedia() {
  const [tab, setTab] = useState('app');
  return (
    <section aria-label="LogicPacks app" className="lp-rise mt-12 sm:mt-16" style={{ '--d': '360ms' }}>
      <div className="mx-auto w-full max-w-site px-4 sm:px-8">
        <div className="relative isolate overflow-hidden rounded-2xl border border-line bg-[#141414] p-3 sm:p-8 lg:p-10">
          <MotionBg name="fluted" shade="bg-black/45" />
          <div role="tabpanel" id={`launch-${tab}`} aria-labelledby={`launch-tab-${tab}`}>
            {tab === 'app' ? <AppShot /> : <AgentShot />}
          </div>
          <div role="tablist" aria-label="Where you work" className="mt-4 flex justify-center gap-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                id={`launch-tab-${t.id}`}
                role="tab"
                type="button"
                aria-selected={tab === t.id}
                aria-controls={`launch-${t.id}`}
                onClick={() => setTab(t.id)}
                className={`h-8 rounded-full px-4 text-[13px] transition-colors ${tab === t.id ? 'bg-white/10 text-ink' : 'text-faint hover:text-muted'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
