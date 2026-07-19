import { useState } from 'react';
import { Icon } from '@iconify/react';
import Terminal from './Terminal';

/* ──────────────────────────────────────────────────────────
   COMMAND OUTPUT MODES  (CLI/TUI variant)

   Interactive demo for the CLI page showing that `lpc list`
   renders in three selectable output modes — the same data,
   different shapes for humans vs. scripts:

     • verbose  — rich, styled, human-readable (default)
     • plain    — --plain: compact, greppable, no decoration
     • json     — --json: machine-readable for pipelines / CI

   Plus a dark / light terminal theme toggle (second palette).
   Fully self-contained: new file, no edits to shared data.
   ────────────────────────────────────────────────────────── */

const PACKS = [
  { name: '@lp/auth', version: '2.1.0', status: 'ok', tests: '14/14', size: '182 KB' },
  { name: '@lp/payments', version: '1.8.3', status: 'ok', tests: '9/9', size: '210 KB' },
  { name: '@lp/dashboard', version: '3.0.1', status: 'update', tests: '22/22', size: '345 KB' },
  { name: '@lp/openai', version: '0.9.4', status: 'ok', tests: '11/11', size: '96 KB' },
];

const MODES = [
  { id: 'verbose', label: 'verbose', flag: '' },
  { id: 'plain', label: 'plain', flag: '--plain' },
  { id: 'json', label: 'json', flag: '--json' },
];

function VerboseOutput() {
  return (
    <>
      <span className="t-prompt">$</span> <span className="t-cmd">lpc list</span>{'\n'}
      <span className="t-output">{'\n'}  4 packs installed · 1 update available{'\n'}</span>
      {PACKS.map((p) => (
        <span key={p.name}>
          {'  '}
          <span className={p.status === 'update' ? 't-arg' : 't-success'}>
            {p.status === 'update' ? '↑' : '✓'}
          </span>{' '}
          <span className="t-cmd">{p.name.padEnd(16)}</span>
          <span className="t-flag">{p.version.padEnd(9)}</span>
          <span className="t-dim">tests </span>
          <span className="t-success">{p.tests.padEnd(7)}</span>
          <span className="t-output">{p.size}</span>
          {'\n'}
        </span>
      ))}
      <span className="t-dim">{'\n'}  run `lpc update` to upgrade @lp/dashboard → 3.1.0</span>
    </>
  );
}

function PlainOutput() {
  return (
    <>
      <span className="t-prompt">$</span> <span className="t-cmd">lpc list</span> <span className="t-flag">--plain</span>{'\n'}
      <span className="t-output">
        {PACKS.map((p) => `${p.name}\t${p.version}\t${p.status}`).join('\n')}
      </span>
    </>
  );
}

function JsonOutput() {
  const payload = {
    installed: PACKS.length,
    updatable: PACKS.filter((p) => p.status === 'update').length,
    packs: PACKS.map((p) => ({ name: p.name, version: p.version, status: p.status, tests: p.tests })),
  };
  return (
    <>
      <span className="t-prompt">$</span> <span className="t-cmd">lpc list</span> <span className="t-flag">--json</span>{'\n'}
      <span className="t-output">{JSON.stringify(payload, null, 2)}</span>
    </>
  );
}

export default function CommandOutputModes() {
  const [mode, setMode] = useState('verbose');
  const [theme, setTheme] = useState('dark');

  const active = MODES.find((m) => m.id === mode);

  return (
    <section id="output-modes" className="border-b border-white/[0.06]">
      <div className="max-w-[1440px] mx-auto px-6 md:px-8 py-16 md:py-20">
        <span className="font-mono text-neutral-600 text-[11px] block mb-3">/// Output Modes</span>
        <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight mb-3">
          Built for humans <span className="text-neutral-500 italic font-light">and</span> pipelines
        </h2>
        <p className="text-neutral-500 text-sm max-w-xl mb-10">
          Every command speaks three dialects. Read it yourself, grep it in a script, or pipe
          structured JSON straight into CI — same data, your shape.
        </p>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          {/* Mode switch */}
          <div className="inline-flex items-center bg-[#141414] border border-white/[0.08] rounded-full p-1">
            {MODES.map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`px-4 py-1.5 rounded-full text-[11px] font-mono transition-all ${
                  mode === m.id ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Theme toggle */}
          <button
            onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
            className="inline-flex items-center gap-2 text-xs text-neutral-400 border border-white/[0.08] rounded-full px-3.5 py-1.5 hover:text-white hover:border-white/20 transition-colors"
          >
            <Icon icon={theme === 'dark' ? 'solar:sun-linear' : 'solar:moon-linear'} width={14} />
            {theme === 'dark' ? 'Light theme' : 'Dark theme'}
          </button>
        </div>

        {/* Live command hint */}
        <div className="mb-3 font-mono text-[11px] text-neutral-600">
          <span className="text-green-500/70">$</span> lpc list {active.flag}
        </div>

        <Terminal className="term-pre" title={`~/my-app — lpc list ${active.flag}`.trim()} theme={theme}>
          {mode === 'verbose' && <VerboseOutput />}
          {mode === 'plain' && <PlainOutput />}
          {mode === 'json' && <JsonOutput />}
        </Terminal>

        <p className="text-neutral-600 text-xs mt-4 font-mono">
          Tip: set a default with <span className="text-neutral-400">lpc config set output {mode}</span> — or
          export <span className="text-neutral-400">LPC_OUTPUT={mode}</span>.
        </p>
      </div>
    </section>
  );
}
