import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { BrandMark } from '../components/BrandIcons';
import { CopyLine } from '../components/Buttons';
import { AppleIcon } from '../components/Icons';
import Logo from '../components/Logo';
import MediaSlot from '../components/MediaSlot';
import { COMPANY, CONNECT_PROMPT, DEVELOPER, DOWNLOADS, HELPER_INSTALL, HELPER_INSTALL_WINDOWS, INSTALL_COMMAND, LAUNCH_MEDIA, TOOLS } from '../site';

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
  return <Note>Our cloud is coming soon.</Note>;
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
        <p className="text-[12px] text-muted">
          Install the helper in PowerShell, to use LogicPacks from your agent (tested on Windows 11 with Claude Code):
        </p>
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

const clamp = (x) => Math.min(1, Math.max(0, x));
const ease = (x) => (x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2);

// Desktop: the film starts full screen and settles into its box under the pitch as
// you scroll (sticky stage, transforms only, one rAF per scroll frame). Mobile and
// reduced motion get the boxed layout, which is also what the prerendered HTML is.
function useFilmScroll({ track, box, pitch, sound, shade, cue }) {
  const [fx, setFx] = useState(false);
  useEffect(() => {
    const wide = window.matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)');
    const sync = () => setFx(wide.matches);
    sync();
    wide.addEventListener('change', sync);
    return () => wide.removeEventListener('change', sync);
  }, []);
  useEffect(() => {
    const el = box.current;
    const tr = track.current;
    if (!el || !tr) return undefined;
    if (!fx) {
      for (const node of [el, pitch.current, sound.current]) if (node) node.style.transform = '';
      el.style.borderRadius = '';
      el.style.borderWidth = '';
      if (pitch.current) pitch.current.style.opacity = '';
      tr.dataset.fx = 'off';
      return undefined;
    }
    let rect = null;
    let frame = 0;
    const paint = () => {
      frame = 0;
      if (!rect) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const p = clamp(-tr.getBoundingClientRect().top / (vh * 0.9));
      const e = ease(p);
      // Full screen starts 96px lower so the film's top content clears the nav, which sits on the dark band.
      const off = 96;
      const s0 = Math.max(vw / rect.w, vh / rect.h);
      const tx = (vw / 2 - (rect.x + rect.w / 2)) * (1 - e);
      const ty = (vh / 2 + off - (rect.y + rect.h / 2)) * (1 - e);
      const s = s0 + (1 - s0) * e;
      el.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${s})`;
      el.style.borderRadius = `${(12 * e) / s}px`;
      el.style.borderWidth = `${e / s}px`;
      const f = clamp((p - 0.45) / 0.5);
      pitch.current.style.opacity = String(f);
      pitch.current.style.transform = `translate3d(0, ${(1 - f) * 12}px, 0)`;
      shade.current.style.opacity = String(1 - e);
      cue.current.style.opacity = String(1 - clamp(p / 0.1));
      // The sound button sits at the bottom right of the visible film, inside the viewport.
      const right = Math.min(vw, rect.x + rect.w / 2 + tx + (rect.w * s) / 2);
      const bottom = Math.min(vh, rect.y + rect.h / 2 + ty + (rect.h * s) / 2);
      sound.current.style.transform = `translate3d(${right - 16}px, ${bottom - 16}px, 0) translate(-100%, -100%)`;
      tr.dataset.fx = 'on';
    };
    const measure = () => {
      el.style.transform = 'none';
      const r = el.getBoundingClientRect();
      const t = tr.getBoundingClientRect();
      rect = { x: r.left - t.left, y: r.top - t.top, w: r.width, h: r.height };
      paint();
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', measure);
    };
  }, [fx, track, box, pitch, sound, shade, cue]);
  return fx;
}

function SoundButton({ box, innerRef, className = '' }) {
  const [on, setOn] = useState(false);
  const toggle = () => {
    const el = box.current?.querySelector('video');
    if (!el) return;
    const next = !on;
    el.muted = !next;
    if (next) {
      el.currentTime = 0;
      el.play().catch(() => {});
    }
    setOn(next);
  };
  return (
    <button
      ref={innerRef}
      type="button"
      data-testid="media-sound"
      onClick={toggle}
      aria-pressed={on}
      className={`rounded-full border border-[#3a3a3a] bg-page/85 px-3 py-1.5 text-[12px] text-ink backdrop-blur hover:bg-raised ${className}`}
    >
      {on ? 'Mute' : 'Play with sound'}
    </button>
  );
}

export default function V2() {
  const refs = { track: useRef(null), box: useRef(null), pitch: useRef(null), sound: useRef(null), shade: useRef(null), cue: useRef(null) };
  const fx = useFilmScroll(refs);
  return (
    <div className="min-h-screen overflow-x-clip bg-page text-ink">
      <main id="main">
        <div ref={refs.track} data-fx="pending" className="v2-track" style={fx ? { height: '190svh' } : undefined}>
          <div className={fx ? 'sticky top-0 h-[100svh] overflow-hidden' : 'relative'}>
            <div
              ref={refs.shade}
              aria-hidden="true"
              className={`pointer-events-none absolute inset-x-0 top-0 z-20 h-[120px] bg-gradient-to-b from-black/95 via-black/70 to-transparent ${fx ? '' : 'hidden'}`}
            />
            <header className={`${wrap} relative z-30 flex h-16 items-center justify-between`}>
              <Link to="/v2" aria-label="LogicPacks">
                <Logo className="text-[15px]" />
              </Link>
              <Link to="/overview" className="text-[13px] text-muted hover:text-ink">
                View more
              </Link>
            </header>
            <section className={`${wrap} pt-10 sm:pt-12`}>
              <div ref={refs.pitch}>
                <h1 className="text-[22px] font-medium leading-[1.3] tracking-[-0.02em] sm:text-[26px]">
                  The best way for teams and AI agents to work together.
                  <span className="block text-muted">One workspace. Everyone brings their own agent.</span>
                </h1>
                <p className="mt-4 max-w-[560px] text-[14px] leading-[1.6] text-faint">
                  Use your own Claude Code or Codex, add your team, and see what every person and agent is doing.
                </p>
              </div>
              <div
                ref={refs.box}
                className="v2-box relative z-10 mt-8 origin-center overflow-hidden rounded-[12px] border border-line will-change-transform"
                style={fx ? { width: 'min(100%, calc((100svh - 330px) * 16 / 9))' } : undefined}
              >
                <MediaSlot
                  image={LAUNCH_MEDIA.image}
                  imageWebp={LAUNCH_MEDIA.imageWebp}
                  video={LAUNCH_MEDIA.video}
                  alt={LAUNCH_MEDIA.alt}
                  label="LogicPacks launch video"
                  width={1920}
                  height={1080}
                  priority
                />
                {!fx && <SoundButton box={refs.box} className="absolute bottom-3 right-3" />}
              </div>
            </section>
            {fx && <SoundButton box={refs.box} innerRef={refs.sound} className="absolute left-0 top-0 z-30" />}
            {fx && (
              <div ref={refs.cue} aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex h-44 items-end justify-center bg-gradient-to-t from-black via-black/85 to-transparent pb-6">
                <div className="v2-bob flex flex-col items-center gap-1.5 text-muted">
                  <span className="flex h-7 w-[18px] justify-center rounded-full border border-white/40 pt-1.5">
                    <span className="h-1.5 w-[2px] rounded-full bg-white/60" />
                  </span>
                  <span className="text-[11px] tracking-[0.08em]">Scroll</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <GetIt />
        <section className={`${wrap} pb-20`}>
          <Link to="/overview" className="inline-flex items-center gap-2 text-[13px] text-ink hover:underline">
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
