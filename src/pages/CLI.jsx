import { Icon } from '@iconify/react';
import ScrollReveal from '../components/ScrollReveal';
import Terminal from '../components/Terminal';
import { useBeta } from '../components/BetaModal';

const INSTALL_METHODS = [
  { icon: 'simple-icons:npm', color: 'text-red-400', name: 'npm', cmd: 'npm install -g @logicpacks/cli' },
  { icon: 'simple-icons:homebrew', color: 'text-yellow-400', name: 'Homebrew', cmd: 'brew install logicpacks/tap/lpc' },
  { icon: 'solar:download-minimalistic-linear', color: 'text-green-500', name: 'Shell Script', cmd: 'curl -fsSL lp.dev/install | sh' },
];

const QUICKSTART = [
  { n: '1', title: 'Initialize your project', cmd: 'lpc init my-app', desc: 'Scaffolds a new project with config, git, and folder structure. Supports templates: --template saas, --template api, --template automation.' },
  { n: '2', title: 'Install packs', cmd: 'lpc install @lp/auth @lp/payments', desc: 'Pulls verified packs from the marketplace. Auto-resolves dependencies, checks contracts, and wires into your project.' },
  { n: '3', title: 'Start the dev server', cmd: 'lpc dev', desc: 'Launches backend + frontend with hot reload, self-healing loops, and telemetry dashboard at localhost:9000.' },
  { n: '4', title: 'Test everything', cmd: 'lpc test', desc: 'Runs contract tests across all installed packs, checks for breaking changes, and verifies integration health.' },
  { n: '5', title: 'Deploy to production', cmd: 'lpc deploy --prod', desc: 'Ships to LP Cloud or your own infra. Zero-downtime deploys with rollback, monitoring, and self-healing enabled.' },
];

const CMD_GROUPS = [
  { title: 'Project', icon: 'solar:folder-with-files-linear', cmds: [
    { cmd: 'lpc init', desc: 'Scaffold a new project with config and templates' },
    { cmd: 'lpc dev', desc: 'Start dev server with hot reload' },
    { cmd: 'lpc build', desc: 'Build production bundle' },
    { cmd: 'lpc config', desc: 'View/edit project configuration' },
  ]},
  { title: 'Pack Management', icon: 'solar:box-linear', cmds: [
    { cmd: 'lpc install', desc: 'Install packs from the marketplace' },
    { cmd: 'lpc uninstall', desc: 'Remove an installed pack' },
    { cmd: 'lpc update', desc: 'Update packs to latest compatible versions' },
    { cmd: 'lpc list', desc: 'List all installed packs and versions' },
    { cmd: 'lpc search', desc: 'Search the marketplace from your terminal' },
    { cmd: 'lpc info', desc: 'View details about a specific pack' },
  ]},
  { title: 'Create & Publish', icon: 'solar:upload-linear', cmds: [
    { cmd: 'lpc create', desc: 'Create a new pack (logic, ui, automation, creative)' },
    { cmd: 'lpc publish', desc: 'Publish your pack to the marketplace' },
    { cmd: 'lpc version', desc: 'Bump pack version (major, minor, patch)' },
    { cmd: 'lpc verify', desc: 'Run verification checks before publishing' },
  ]},
  { title: 'Testing & Quality', icon: 'solar:shield-check-linear', cmds: [
    { cmd: 'lpc test', desc: 'Run contract tests across all packs' },
    { cmd: 'lpc heal', desc: 'Trigger self-healing loop for failing tests' },
    { cmd: 'lpc audit', desc: 'Security & dependency audit' },
    { cmd: 'lpc doctor', desc: 'Diagnose environment and project issues' },
  ]},
  { title: 'Deploy & Infrastructure', icon: 'solar:server-linear', cmds: [
    { cmd: 'lpc deploy', desc: 'Deploy to LP Cloud or custom infra' },
    { cmd: 'lpc rollback', desc: 'Rollback to a previous deployment' },
    { cmd: 'lpc logs', desc: 'Stream production logs in real-time' },
    { cmd: 'lpc status', desc: 'View deployment status and health' },
    { cmd: 'lpc lpdn', desc: 'Manage LPDN nodes for offline distribution' },
    { cmd: 'lpc env', desc: 'Manage environment variables and secrets' },
  ]},
];

const FEATURES = [
  { icon: 'solar:bolt-linear', iconBg: 'bg-green-500/10', iconBorder: 'border-green-500/20', iconColor: 'text-green-500', title: 'Instant Installs', desc: 'Parallel resolution, local cache, and deduplication. Install 10 packs in under 2 seconds.' },
  { icon: 'solar:shield-check-linear', iconBg: 'bg-white/5', iconBorder: 'border-white/10', iconColor: 'text-neutral-400', title: 'Contract Verification', desc: 'Every pack has typed contracts. LPC verifies compatibility before install — no runtime surprises.' },
  { icon: 'solar:refresh-circle-linear', iconBg: 'bg-white/5', iconBorder: 'border-white/10', iconColor: 'text-neutral-400', title: 'Self-Healing', desc: 'lpc heal detects failing tests, analyzes the root cause, and auto-patches your code.' },
  { icon: 'solar:monitor-smartphone-linear', iconBg: 'bg-white/5', iconBorder: 'border-white/10', iconColor: 'text-neutral-400', title: 'Dev Server', desc: 'One command starts backend + frontend + telemetry dashboard. Hot reload across the full stack.' },
  { icon: 'solar:cloud-upload-linear', iconBg: 'bg-white/5', iconBorder: 'border-white/10', iconColor: 'text-neutral-400', title: 'One-Command Deploy', desc: 'Deploy to LP Cloud or self-host. Zero-downtime, auto-rollback, SSL, and monitoring — all built in.' },
  { icon: 'solar:wi-fi-router-linear', iconBg: 'bg-green-500/10', iconBorder: 'border-green-500/20', iconColor: 'text-green-500', title: 'LPDN Support', desc: 'Push apps to LPDN nodes for offline distribution. lpc lpdn push handles everything.' },
];

export default function CLI() {
  const { openBetaModal } = useBeta();
  const copyCmd = (cmd, e) => {
    navigator.clipboard.writeText(cmd);
    const btn = e.target;
    btn.textContent = '✓';
    setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
  };

  return (
    <>
      {/* Hero */}
      <section className="pt-14 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[50vw] h-[50vw] bg-green-500/[0.03] blur-[150px] rounded-full translate-y-[-10%]" />
        </div>
        <div className="relative z-10 border-b border-white/[0.06]">
          <div className="max-w-[1440px] mx-auto px-6 md:px-8 py-20 md:py-28">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                    <Icon icon="solar:command-linear" className="text-green-500 text-lg" />
                  </div>
                  <span className="text-xs uppercase tracking-[0.2em] text-green-500/80 font-mono font-medium">v2.4.0 — Latest</span>
                </div>
                <ScrollReveal>
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold text-white tracking-tight leading-[0.95] mb-5">
                    <span className="font-mono text-green-500">lpc</span><br />
                    <span className="text-neutral-500 italic font-light">Logic Packs CLI</span>
                  </h1>
                </ScrollReveal>
                <ScrollReveal><p className="text-neutral-500 text-base md:text-lg leading-relaxed max-w-lg mb-8">Install, create, publish, and deploy packs from your terminal. One tool to manage your entire Logic Packs workflow.</p></ScrollReveal>
                <ScrollReveal>
                  <Terminal title="Install">
                    <span className="t-prompt">$</span> <span className="t-cmd">npm install</span> <span className="t-flag">-g</span> <span className="t-arg">@logicpacks/cli</span>
                  </Terminal>
                </ScrollReveal>
                <ScrollReveal>
                  <div className="flex flex-wrap gap-3 mt-6">
                    <a href="#commands" className="inline-flex items-center gap-2 bg-white text-black font-semibold rounded-md px-7 py-3 text-sm hover:bg-neutral-200 transition-colors">View Commands <Icon icon="solar:arrow-right-linear" width={16} /></a>
                    <a href="#quickstart" className="inline-flex items-center gap-2 border border-white/10 text-neutral-300 font-medium rounded-md px-7 py-3 text-sm hover:bg-white/5 transition-colors">Quickstart Guide</a>
                  </div>
                </ScrollReveal>
              </div>
              <ScrollReveal>
                <Terminal title="~/my-app — lpc">
                  <span className="t-prompt">$</span> <span className="t-cmd">lpc init</span> <span className="t-arg">my-saas-app</span>{'\n'}
                  <span className="t-output">{'\n'}  ◆ Creating project...</span>{'\n'}
                  <span className="t-success">  ✓ Project scaffolded</span>{'\n'}
                  <span className="t-success">  ✓ Config written → lpc.config.json</span>{'\n'}
                  <span className="t-success">  ✓ Git initialized</span>{'\n\n'}
                  <span className="t-prompt">$</span> <span className="t-cmd">lpc install</span> <span className="t-arg">@lp/auth @lp/payments @lp/dashboard</span>{'\n'}
                  <span className="t-output">{'\n'}  ◆ Resolving 3 packs...</span>{'\n'}
                  <span className="t-success">  ✓ @lp/auth@2.1.0 installed</span>{'\n'}
                  <span className="t-success">  ✓ @lp/payments@1.8.3 installed</span>{'\n'}
                  <span className="t-success">  ✓ @lp/dashboard@3.0.1 installed</span>{'\n'}
                  <span className="t-output">  3 packs installed in 1.2s</span>{'\n\n'}
                  <span className="t-prompt">$</span> <span className="t-cmd">lpc dev</span>{'\n'}
                  <span className="t-output">{'\n'}  ◆ Starting dev server...</span>{'\n'}
                  <span className="t-success">  ✓ Backend  → http://localhost:8000</span>{'\n'}
                  <span className="t-success">  ✓ Frontend → http://localhost:3000</span>{'\n'}
                  <span className="t-success">  ✓ Hot reload enabled</span>{'\n'}
                  <span className="t-dim">  watching for changes...</span><span className="cursor-blink text-green-500">█</span>
                </Terminal>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Install Methods */}
      <section className="border-b border-white/[0.06]">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/[0.06]">
          {INSTALL_METHODS.map((m) => (
            <ScrollReveal key={m.name}>
              <div className="p-8 hover:bg-white/[0.015] transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <Icon icon={m.icon} className={`${m.color} text-xl`} />
                  <h3 className="text-white text-sm font-medium">{m.name}</h3>
                </div>
                <div className="bg-[#111] rounded-lg px-4 py-3 font-mono text-xs text-neutral-400 flex items-center justify-between">
                  <code>{m.cmd}</code>
                  <button className="text-neutral-600 hover:text-white text-[10px] ml-2 shrink-0" onClick={(e) => copyCmd(m.cmd, e)}>Copy</button>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Quickstart */}
      <section id="quickstart" className="border-b border-white/[0.06]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8 py-16 md:py-20">
          <span className="font-mono text-neutral-600 text-[11px] block mb-3">/// Quickstart</span>
          <ScrollReveal><h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight mb-3">From Zero to Deployed in 5 Commands</h2></ScrollReveal>
          <ScrollReveal><p className="text-neutral-500 text-sm max-w-xl mb-12">Everything you need to go from idea to production.</p></ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              {QUICKSTART.map((s) => (
                <ScrollReveal key={s.n}>
                  <div className="flex gap-4 items-start">
                    <div className={`w-8 h-8 rounded-full ${s.n === '5' ? 'bg-white/5 border-white/10' : 'bg-green-500/10 border-green-500/20'} border flex items-center justify-center shrink-0 mt-0.5`}>
                      <span className={`${s.n === '5' ? 'text-white' : 'text-green-500'} font-mono text-xs font-semibold`}>{s.n}</span>
                    </div>
                    <div>
                      <h4 className="text-white text-sm font-medium mb-1">{s.title}</h4>
                      <code className="text-xs font-mono text-green-500/80 bg-green-500/5 px-2 py-1 rounded">{s.cmd}</code>
                      <p className="text-neutral-500 text-xs mt-2 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
            <ScrollReveal>
              <div className="self-start sticky top-20">
                <Terminal title="~/my-app — deploy">
                  <span className="t-prompt">$</span> <span className="t-cmd">lpc deploy</span> <span className="t-flag">--prod</span>{'\n'}
                  <span className="t-output">{'\n'}  ◆ Building production bundle...</span>{'\n'}
                  <span className="t-success">  ✓ Backend compiled (FastAPI)</span>{'\n'}
                  <span className="t-success">  ✓ Frontend compiled (React)</span>{'\n'}
                  <span className="t-success">  ✓ Assets optimized — 2.4 MB</span>{'\n'}
                  <span className="t-output">{'\n'}  ◆ Running contract tests...</span>{'\n'}
                  <span className="t-success">  ✓ @lp/auth — 14/14 passed</span>{'\n'}
                  <span className="t-success">  ✓ @lp/payments — 9/9 passed</span>{'\n'}
                  <span className="t-success">  ✓ @lp/dashboard — 22/22 passed</span>{'\n'}
                  <span className="t-output">{'\n'}  ◆ Deploying to LP Cloud...</span>{'\n'}
                  <span className="t-success">  ✓ Containers pushed</span>{'\n'}
                  <span className="t-success">  ✓ DNS configured</span>{'\n'}
                  <span className="t-success">  ✓ SSL provisioned</span>{'\n'}
                  <span className="t-success">  ✓ Self-healing enabled</span>{'\n'}
                  <span className="t-output">{'\n'}  ◆ Deployment complete!</span>{'\n'}
                  <span className="t-success">  → https://my-app.lp.app</span>{'\n'}
                  <span className="t-dim">  deployed in 34s</span>
                </Terminal>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Commands Reference */}
      <section id="commands" className="border-b border-white/[0.06]">
        <div className="grid grid-cols-1 md:grid-cols-4 md:divide-x divide-white/[0.06]">
          <div className="md:col-span-1 p-8 md:p-10 flex flex-col justify-between min-h-[280px]">
            <div>
              <span className="font-mono text-neutral-600 text-[11px] block mb-3">/// Commands</span>
              <ScrollReveal><h2 className="text-3xl font-semibold text-white tracking-tight mb-4">Full<br />Reference</h2></ScrollReveal>
              <ScrollReveal><p className="text-neutral-500 text-sm leading-relaxed">Every command you need. Run <code className="text-green-500/80 text-xs">lpc --help</code> for the complete list.</p></ScrollReveal>
            </div>
          </div>
          <div className="md:col-span-3">
            {CMD_GROUPS.map((g, gi) => (
              <div key={g.title} className={gi < CMD_GROUPS.length - 1 ? 'border-b border-white/[0.06]' : ''}>
                <div className="p-6 md:p-8">
                  <h3 className="text-white text-xs font-semibold uppercase tracking-widest mb-5 flex items-center gap-2">
                    <Icon icon={g.icon} className="text-green-500" width={14} />
                    {g.title}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {g.cmds.map((c) => (
                      <ScrollReveal key={c.cmd}>
                        <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/[0.015] transition-colors">
                          <code className="text-green-500 font-mono text-xs shrink-0 w-32">{c.cmd}</code>
                          <p className="text-neutral-500 text-xs">{c.desc}</p>
                        </div>
                      </ScrollReveal>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features — Built for Speed */}
      <section className="border-b border-white/[0.06]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8 py-16 md:py-20">
          <span className="font-mono text-neutral-600 text-[11px] block mb-3">/// Why LPC</span>
          <ScrollReveal><h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight mb-12">Built for Speed</h2></ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <ScrollReveal key={f.title}>
                <div className="border border-white/[0.06] rounded-xl p-8 hover:bg-white/[0.015] transition-all">
                  <div className={`w-10 h-10 rounded-lg ${f.iconBg} border ${f.iconBorder} flex items-center justify-center mb-5`}>
                    <Icon icon={f.icon} className={`${f.iconColor} text-lg`} />
                  </div>
                  <h3 className="text-white text-sm font-medium tracking-tight mb-2">{f.title}</h3>
                  <p className="text-neutral-500 text-xs leading-relaxed">{f.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Terminal Demo — Create & Self-Healing */}
      <section className="border-b border-white/[0.06]">
        <div className="grid grid-cols-1 md:grid-cols-2 md:divide-x divide-white/[0.06]">
          <ScrollReveal>
            <div className="p-8 md:p-10">
              <span className="font-mono text-neutral-600 text-[11px] block mb-4">/// Create a Pack</span>
              <Terminal title="creating a pack">
                <span className="t-prompt">$</span> <span className="t-cmd">lpc create</span> <span className="t-arg">my-auth-pack</span> <span className="t-flag">--type logic</span>{'\n'}
                <span className="t-output">{'\n'}  ◆ Pack type: Logic (Python/FastAPI)</span>{'\n'}
                <span className="t-success">  ✓ Created pack scaffold</span>{'\n'}
                <span className="t-output">{'\n'}  my-auth-pack/</span>{'\n'}
                <span className="t-output">    ├── contracts/</span>{'\n'}
                <span className="t-output">    │   └── auth.contract.ts</span>{'\n'}
                <span className="t-output">    ├── src/</span>{'\n'}
                <span className="t-output">    │   ├── main.py</span>{'\n'}
                <span className="t-output">    │   ├── routes.py</span>{'\n'}
                <span className="t-output">    │   └── models.py</span>{'\n'}
                <span className="t-output">    ├── tests/</span>{'\n'}
                <span className="t-output">    │   └── test_auth.py</span>{'\n'}
                <span className="t-output">    ├── lpc.pack.json</span>{'\n'}
                <span className="t-output">    └── README.md</span>{'\n\n'}
                <span className="t-prompt">$</span> <span className="t-cmd">lpc verify</span>{'\n'}
                <span className="t-success">  ✓ Contracts valid</span>{'\n'}
                <span className="t-success">  ✓ Tests passing (8/8)</span>{'\n'}
                <span className="t-success">  ✓ Ready to publish</span>{'\n\n'}
                <span className="t-prompt">$</span> <span className="t-cmd">lpc publish</span>{'\n'}
                <span className="t-success">  ✓ Published @you/my-auth-pack@1.0.0</span>
              </Terminal>
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <div className="p-8 md:p-10">
              <span className="font-mono text-neutral-600 text-[11px] block mb-4">/// Self-Healing</span>
              <Terminal title="auto-patching">
                <span className="t-prompt">$</span> <span className="t-cmd">lpc test</span>{'\n'}
                <span className="t-output">{'\n'}  ◆ Running contract tests...</span>{'\n'}
                <span className="t-success">  ✓ @lp/auth — 14/14 passed</span>{'\n'}
                <span className="t-comment">  ✗ @lp/payments — 7/9 passed</span>{'\n'}
                <span className="t-output">    ↳ stripe_webhook: assertion failed</span>{'\n'}
                <span className="t-output">    ↳ refund_flow: timeout after 5s</span>{'\n\n'}
                <span className="t-prompt">$</span> <span className="t-cmd">lpc heal</span>{'\n'}
                <span className="t-output">{'\n'}  ◆ Analyzing 2 failures...</span>{'\n'}
                <span className="t-output">  ◆ Root cause: Stripe API v2024 change</span>{'\n'}
                <span className="t-output">  ◆ Generating patch...</span>{'\n'}
                <span className="t-success">  ✓ Patched stripe_webhook handler</span>{'\n'}
                <span className="t-success">  ✓ Fixed refund_flow timeout</span>{'\n'}
                <span className="t-output">{'\n'}  ◆ Re-running tests...</span>{'\n'}
                <span className="t-success">  ✓ @lp/payments — 9/9 passed</span>{'\n\n'}
                <span className="t-success">  All tests passing.</span>
              </Terminal>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="border-b border-white/[0.06]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8 py-20 md:py-28 text-center relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[40vw] h-[40vw] bg-green-500/[0.04] blur-[150px] rounded-full" />
          </div>
          <div className="relative z-10">
            <ScrollReveal><h2 className="text-4xl md:text-5xl font-semibold text-white tracking-tight mb-4">Install LPC Now</h2></ScrollReveal>
            <ScrollReveal><p className="text-neutral-500 text-base mb-8 max-w-lg mx-auto">One command to start building with Logic Packs.</p></ScrollReveal>
            <ScrollReveal>
              <Terminal title="" className="max-w-md mx-auto mb-8">
                <span className="t-prompt">$</span> <span className="t-cmd">npm install</span> <span className="t-flag">-g</span> <span className="t-arg">@logicpacks/cli</span>
              </Terminal>
            </ScrollReveal>
            <ScrollReveal>
              <div className="flex flex-wrap gap-3 justify-center">
                <button onClick={openBetaModal} className="inline-flex items-center gap-2 bg-white text-black font-semibold rounded-md px-8 py-3 text-sm hover:bg-neutral-200 transition-colors">
                  Documentation <Icon icon="solar:arrow-right-linear" width={16} />
                </button>
                <button onClick={openBetaModal} className="inline-flex items-center gap-2 border border-white/10 text-neutral-300 font-medium rounded-md px-8 py-3 text-sm hover:bg-white/5 transition-colors">
                  <Icon icon="simple-icons:github" width={14} /> GitHub
                </button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
}
