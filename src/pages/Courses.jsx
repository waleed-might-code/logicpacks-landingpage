import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import ScrollReveal from '../components/ScrollReveal';
import { useBeta } from '../components/BetaModal';

const STATS = [
  { value: '12', label: 'Courses', green: false },
  { value: '180+', label: 'Lessons', green: false },
  { value: 'Free', label: 'For All Users', green: true },
  { value: '4', label: 'Learning Paths', green: false },
];

const PATHS = [
  { id: 'fullstack', icon: 'solar:layers-linear', color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20', badge: 'Recommended', badgeCls: 'bg-green-500/15 text-green-400 border-green-500/20', title: 'Full Stack Development', desc: 'Learn the complete stack — Python backend + React frontend + deployment. Build and ship a production app from scratch.', meta: '12 weeks · 48 lessons · 3 projects' },
  { id: 'python', icon: 'simple-icons:python', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', badge: 'Backend', badgeCls: 'bg-blue-500/15 text-blue-400 border-blue-500/20', title: 'Python Backend', desc: 'Flask & FastAPI from fundamentals to production APIs. Authentication, databases, ORM, middleware, and deployment.', meta: '8 weeks · 36 lessons · 2 projects' },
  { id: 'react', icon: 'simple-icons:react', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', badge: 'Frontend', badgeCls: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20', title: 'React Frontend', desc: 'Modern React — components, hooks, state management, routing, and building beautiful UIs with Tailwind CSS.', meta: '8 weeks · 40 lessons · 2 projects' },
  { id: 'automation', icon: 'solar:robot-linear', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', badge: 'Automation', badgeCls: 'bg-purple-500/15 text-purple-400 border-purple-500/20', title: 'Browser Automation', desc: 'Selenium & Puppeteer — web scraping, testing, bot building, headless browsers, and deploying on managed infra.', meta: '6 weeks · 28 lessons · 3 projects' },
];

/* ── Module helper ── */
function ModuleCard({ code, codeColor, title, lessonCount, lessons, moreCount }) {
  return (
    <ScrollReveal>
      <div className="border border-white/[0.06] rounded-xl mb-4 overflow-hidden">
        <div className="p-5 bg-white/[0.01] flex items-center gap-3 border-b border-white/[0.04]">
          <span className={`${codeColor} font-mono text-xs font-semibold w-8`}>{code}</span>
          <h4 className="text-white text-sm font-medium flex-1">{title}</h4>
          <span className="text-neutral-600 text-[10px] font-mono">{lessonCount} lessons</span>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {lessons.map((l, i) => (
            <div key={i} className="module-item px-5 py-3 flex items-center gap-3">
              <Icon icon="solar:play-circle-linear" className="text-neutral-700" width={14} />
              <span className="text-neutral-400 text-xs">{l}</span>
            </div>
          ))}
          {moreCount > 0 && (
            <div className="module-item px-5 py-3 flex items-center gap-3 text-neutral-700 text-[11px]">
              <Icon icon="solar:alt-arrow-down-linear" width={12} />+ {moreCount} more lessons
            </div>
          )}
        </div>
      </div>
    </ScrollReveal>
  );
}

export default function Courses() {
  const { openBetaModal } = useBeta();
  return (
    <>
      {/* ═══ HERO ═══ */}
      <section className="pt-14 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[50vw] h-[50vw] bg-green-500/[0.04] blur-[150px] rounded-full translate-y-[-10%]" />
        </div>
        <div className="relative z-10 border-b border-white/[0.06]">
          <div className="max-w-[1440px] mx-auto px-6 md:px-8 py-24 md:py-36 text-center">
            <ScrollReveal>
              <div className="flex items-center justify-center gap-2 mb-6">
                <Icon icon="solar:square-academic-cap-linear" className="text-green-500 text-lg" />
                <span className="text-xs uppercase tracking-[0.2em] text-green-500/80 font-mono">Logic Packs Academy</span>
              </div>
            </ScrollReveal>
            <ScrollReveal>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold text-white tracking-tight leading-[0.95] mb-6">
                Learn to Build<br /><span className="text-neutral-500 italic">Real Software</span>
              </h1>
            </ScrollReveal>
            <ScrollReveal>
              <p className="text-neutral-500 text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-10">
                From Python backends to React frontends to browser automation — hands-on courses that teach you to build production apps on the Logic Packs platform.
              </p>
            </ScrollReveal>
            <ScrollReveal>
              <div className="flex flex-wrap gap-3 justify-center">
                <a href="#courses" className="inline-flex items-center gap-2 bg-white text-black font-semibold rounded-md px-8 py-3 text-sm hover:bg-neutral-200 transition-colors">
                  Browse Courses <Icon icon="solar:arrow-right-linear" width={16} />
                </a>
                <a href="#paths" className="inline-flex items-center gap-2 border border-white/10 text-neutral-300 font-medium rounded-md px-8 py-3 text-sm hover:bg-white/5 transition-colors">
                  Learning Paths
                </a>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section className="border-b border-white/[0.06]">
        <div className="max-w-[1440px] mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-white/[0.06]">
          {STATS.map((s) => (
            <div key={s.label} className="p-6 md:p-8 text-center hover:bg-white/[0.015] transition-colors">
              <div className={`text-3xl md:text-4xl font-semibold ${s.green ? 'text-green-500' : 'text-white'} tracking-tight mb-1`}>{s.value}</div>
              <p className="text-neutral-600 text-xs font-mono uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ LEARNING PATHS ═══ */}
      <section id="paths" className="border-b border-white/[0.06]">
        <div className="grid grid-cols-1 md:grid-cols-4 md:divide-x divide-white/[0.06]">
          <div className="md:col-span-1 p-8 md:p-10 flex flex-col justify-between min-h-[280px]">
            <div>
              <span className="font-mono text-neutral-600 text-[11px] block mb-3">/// Paths</span>
              <ScrollReveal><h2 className="text-3xl font-semibold text-white tracking-tight mb-4">Learning<br />Paths</h2></ScrollReveal>
              <ScrollReveal><p className="text-neutral-500 text-sm leading-relaxed">Structured curricula that take you from zero to production. Each path leads to a certificate and a real deployed app.</p></ScrollReveal>
            </div>
          </div>
          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y md:divide-x divide-white/[0.06]">
            {PATHS.map((p) => (
              <ScrollReveal key={p.id}>
                <a href={`#${p.id}`} className="p-8 hover:bg-white/[0.015] transition-colors group block">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-lg ${p.bg} border ${p.border} flex items-center justify-center`}>
                      <Icon icon={p.icon} className={`${p.color} text-lg`} />
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-semibold ${p.badgeCls} border uppercase tracking-wider`}>{p.badge}</span>
                  </div>
                  <h3 className="text-white text-lg font-medium tracking-tight mb-2 group-hover:text-green-50 transition-colors">{p.title}</h3>
                  <p className="text-neutral-500 text-sm leading-relaxed mb-3">{p.desc}</p>
                  <div className="flex gap-3 text-[10px] font-mono text-neutral-600">
                    {p.meta.split(' · ').map((m, i) => (
                      <span key={i}>{i > 0 && <span className="mr-3">·</span>}{m}</span>
                    ))}
                  </div>
                </a>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ COURSE 1: FULL STACK ═══ */}
      <section id="fullstack" className="border-b border-white/[0.06]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8 py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="sticky top-20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                    <Icon icon="solar:layers-linear" className="text-green-500 text-xl" />
                  </div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-semibold bg-green-500/15 text-green-400 border border-green-500/20 uppercase">Recommended</span>
                </div>
                <ScrollReveal><h2 className="text-3xl font-semibold text-white tracking-tight mb-3">Full Stack Development</h2></ScrollReveal>
                <ScrollReveal><p className="text-neutral-500 text-sm leading-relaxed mb-6">The complete guide to building production applications — from database to deployed frontend. Learn Python (FastAPI), React, and how they connect.</p></ScrollReveal>
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-xs text-neutral-500"><Icon icon="solar:clock-circle-linear" className="text-green-500/60" width={14} /> 12 weeks · Self-paced</div>
                  <div className="flex items-center gap-3 text-xs text-neutral-500"><Icon icon="solar:document-text-linear" className="text-green-500/60" width={14} /> 48 lessons · 3 projects</div>
                  <div className="flex items-center gap-3 text-xs text-neutral-500"><Icon icon="solar:user-linear" className="text-green-500/60" width={14} /> Beginner to Intermediate</div>
                  <div className="flex items-center gap-3 text-xs text-neutral-500"><Icon icon="solar:diploma-verified-linear" className="text-green-500/60" width={14} /> Certificate on completion</div>
                </div>
                <h4 className="text-xs text-neutral-400 uppercase tracking-widest font-semibold mb-3">What is Full Stack?</h4>
                <p className="text-neutral-500 text-xs leading-relaxed mb-6">"Full stack" means you build <span className="text-white">both</span> sides of an application — the <span className="text-blue-400">backend</span> (server, APIs, database) and the <span className="text-cyan-400">frontend</span> (what users see and interact with). A full-stack developer can take an idea from concept to a complete, deployed app.</p>
                <button onClick={openBetaModal} className="block w-full text-center bg-white text-black font-semibold rounded-md px-6 py-3 text-sm hover:bg-neutral-200 transition-colors">Start Course — Free</button>
              </div>
            </div>
            <div className="lg:col-span-2">
              <span className="font-mono text-neutral-600 text-[11px] block mb-6">/// Curriculum</span>
              <ModuleCard code="M1" codeColor="text-green-500" title="Foundations — How the Web Works" lessonCount={6} lessons={['HTTP, APIs, and Client-Server Architecture', 'What is a Backend? What is a Frontend?', 'Databases: SQL vs NoSQL', 'REST vs GraphQL', 'Setting Up Your Logic Packs Workspace', 'Your First API Call']} moreCount={0} />
              <ModuleCard code="M2" codeColor="text-green-500" title="Python Backend with FastAPI" lessonCount={12} lessons={['Python Essentials: Types, Functions, Classes', 'FastAPI Setup & Your First Endpoint', 'Request Validation with Pydantic', 'Database Integration (SQLAlchemy + PostgreSQL)', 'Authentication: JWT Tokens & OAuth']} moreCount={7} />
              <ModuleCard code="M3" codeColor="text-green-500" title="React Frontend" lessonCount={14} lessons={['React Fundamentals: JSX, Components, Props', 'State & Hooks: useState, useEffect, useContext', 'Routing with React Router', 'Connecting to Your FastAPI Backend', 'Styling with Tailwind CSS']} moreCount={9} />
              <ModuleCard code="M4" codeColor="text-green-500" title="Connecting It All — Full Stack App" lessonCount={10} lessons={['Project Architecture: Frontend ↔ Backend', 'Installing Logic Packs: Auth, Payments, Dashboard', 'Testing, Self-Healing, and Telemetry', 'Deployment to Production']} moreCount={6} />
              <ScrollReveal>
                <div className="border border-green-500/20 rounded-xl p-6 bg-green-500/[0.02]">
                  <div className="flex items-center gap-2 mb-3">
                    <Icon icon="solar:star-bold" className="text-green-500" />
                    <span className="text-green-400 text-xs font-semibold uppercase tracking-wider">Final Project</span>
                  </div>
                  <h4 className="text-white text-sm font-medium mb-2">Build & Deploy a SaaS App</h4>
                  <p className="text-neutral-500 text-xs leading-relaxed">Build a complete SaaS application using Logic Packs — Python backend, React frontend, Auth + Payments packs. Deploy, enable telemetry, and optionally apply to Ventures for funding.</p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ COURSE 2: PYTHON BACKEND ═══ */}
      <section id="python" className="border-b border-white/[0.06]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8 py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="sticky top-20">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
                  <Icon icon="simple-icons:python" className="text-blue-400 text-xl" />
                </div>
                <ScrollReveal><h2 className="text-3xl font-semibold text-white tracking-tight mb-3">Python Backend</h2></ScrollReveal>
                <ScrollReveal><p className="text-neutral-500 text-sm leading-relaxed mb-6">Master Python for web development. Learn Flask & FastAPI, build REST APIs, connect databases, handle authentication, and deploy to production.</p></ScrollReveal>
                <h4 className="text-xs text-neutral-400 uppercase tracking-widest font-semibold mb-3">What is a Backend?</h4>
                <p className="text-neutral-500 text-xs leading-relaxed mb-6">The <span className="text-blue-400">backend</span> is the server-side of an application. It handles data storage, business logic, authentication, and API endpoints. Python (with Flask or FastAPI) is one of the most popular choices because of its readability and powerful ecosystem.</p>
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-xs text-neutral-500"><Icon icon="solar:clock-circle-linear" className="text-blue-400/60" width={14} /> 8 weeks · Self-paced</div>
                  <div className="flex items-center gap-3 text-xs text-neutral-500"><Icon icon="solar:document-text-linear" className="text-blue-400/60" width={14} /> 36 lessons · 2 projects</div>
                  <div className="flex items-center gap-3 text-xs text-neutral-500"><Icon icon="solar:diploma-verified-linear" className="text-blue-400/60" width={14} /> Certificate on completion</div>
                </div>
                <div className="mb-6">
                  <h4 className="text-xs text-neutral-400 uppercase tracking-widest font-semibold mb-3">Tech Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Python 3.12', 'FastAPI', 'Flask', 'SQLAlchemy', 'PostgreSQL', 'JWT / OAuth', 'Pydantic'].map((t) => (
                      <span key={t} className="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.06] text-neutral-400 text-[10px] font-mono">{t}</span>
                    ))}
                  </div>
                </div>
                <button onClick={openBetaModal} className="block w-full text-center bg-blue-500 text-white font-semibold rounded-md px-6 py-3 text-sm hover:bg-blue-400 transition-colors">Start Course — Free</button>
              </div>
            </div>
            <div className="lg:col-span-2">
              <span className="font-mono text-neutral-600 text-[11px] block mb-6">/// Curriculum</span>
              <ModuleCard code="M1" codeColor="text-blue-400" title="Python Fundamentals" lessonCount={8} lessons={['Variables, Types, Strings & Numbers', 'Control Flow: if/else, loops, comprehensions', 'Functions, Decorators & Generators', 'OOP: Classes, Inheritance, Data Classes']} moreCount={4} />
              <ModuleCard code="M2" codeColor="text-blue-400" title="Flask — Your First Web Framework" lessonCount={8} lessons={['Flask Setup, Routes & Templates', 'Request/Response Cycle', 'Database with SQLAlchemy']} moreCount={5} />
              <ModuleCard code="M3" codeColor="text-blue-400" title="FastAPI — Production-Grade APIs" lessonCount={12} lessons={['FastAPI vs Flask — When to Use What', 'Async/Await & Concurrency', 'Pydantic Models & Validation', 'JWT Auth & Middleware']} moreCount={8} />
              <ModuleCard code="M4" codeColor="text-blue-400" title="Deployment & Logic Packs Integration" lessonCount={8} lessons={['Docker & Containerization', 'Installing Logic Packs for Backend', 'Production Deployment & Monitoring']} moreCount={5} />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ COURSE 3: REACT FRONTEND ═══ */}
      <section id="react" className="border-b border-white/[0.06]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8 py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="sticky top-20">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4">
                  <Icon icon="simple-icons:react" className="text-cyan-400 text-xl" />
                </div>
                <ScrollReveal><h2 className="text-3xl font-semibold text-white tracking-tight mb-3">React Frontend</h2></ScrollReveal>
                <ScrollReveal><p className="text-neutral-500 text-sm leading-relaxed mb-6">Build modern, interactive user interfaces with React. Components, hooks, state management, routing, and styling — everything you need for production frontends.</p></ScrollReveal>
                <h4 className="text-xs text-neutral-400 uppercase tracking-widest font-semibold mb-3">What is a Frontend?</h4>
                <p className="text-neutral-500 text-xs leading-relaxed mb-6">The <span className="text-cyan-400">frontend</span> is everything the user sees and interacts with — buttons, forms, layouts, animations. React is a JavaScript library that makes building complex UIs simple through reusable components and a reactive data flow.</p>
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-xs text-neutral-500"><Icon icon="solar:clock-circle-linear" className="text-cyan-400/60" width={14} /> 8 weeks · Self-paced</div>
                  <div className="flex items-center gap-3 text-xs text-neutral-500"><Icon icon="solar:document-text-linear" className="text-cyan-400/60" width={14} /> 40 lessons · 2 projects</div>
                  <div className="flex items-center gap-3 text-xs text-neutral-500"><Icon icon="solar:diploma-verified-linear" className="text-cyan-400/60" width={14} /> Certificate on completion</div>
                </div>
                <div className="mb-6">
                  <h4 className="text-xs text-neutral-400 uppercase tracking-widest font-semibold mb-3">Tech Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    {['React 19', 'TypeScript', 'Tailwind CSS', 'React Router', 'Zustand', 'Vite'].map((t) => (
                      <span key={t} className="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.06] text-neutral-400 text-[10px] font-mono">{t}</span>
                    ))}
                  </div>
                </div>
                <button onClick={openBetaModal} className="block w-full text-center bg-cyan-500 text-white font-semibold rounded-md px-6 py-3 text-sm hover:bg-cyan-400 transition-colors">Start Course — Free</button>
              </div>
            </div>
            <div className="lg:col-span-2">
              <span className="font-mono text-neutral-600 text-[11px] block mb-6">/// Curriculum</span>
              <ModuleCard code="M1" codeColor="text-cyan-400" title="JavaScript & TypeScript Essentials" lessonCount={10} lessons={['ES6+ Syntax: Arrow functions, destructuring, spread', 'Async JavaScript: Promises, async/await, fetch', 'TypeScript Basics: Types, interfaces, generics']} moreCount={7} />
              <ModuleCard code="M2" codeColor="text-cyan-400" title="React Core — Components & Hooks" lessonCount={12} lessons={['Your First React App with Vite', 'JSX, Components & Props', 'useState, useEffect, useRef', 'Lists, Keys & Conditional Rendering']} moreCount={8} />
              <ModuleCard code="M3" codeColor="text-cyan-400" title="Routing, State & Styling" lessonCount={10} lessons={['React Router: Pages, Params, Guards', 'Global State with Zustand', 'Tailwind CSS: Utility-First Styling']} moreCount={7} />
              <ModuleCard code="M4" codeColor="text-cyan-400" title="Production React & Logic Packs" lessonCount={8} lessons={['Forms, Validation & Error Handling', 'Connecting to APIs (Fetch, SWR, React Query)', 'Installing UI Packs from the Marketplace']} moreCount={5} />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ COURSE 4: AUTOMATION ═══ */}
      <section id="automation" className="border-b border-white/[0.06]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8 py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="sticky top-20">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4">
                  <Icon icon="solar:robot-linear" className="text-purple-400 text-xl" />
                </div>
                <ScrollReveal><h2 className="text-3xl font-semibold text-white tracking-tight mb-3">Browser Automation</h2></ScrollReveal>
                <ScrollReveal><p className="text-neutral-500 text-sm leading-relaxed mb-6">Automate the web with Selenium & Puppeteer. Build scrapers, bots, test suites, and automated workflows — and deploy them on managed infrastructure.</p></ScrollReveal>
                <h4 className="text-xs text-neutral-400 uppercase tracking-widest font-semibold mb-3">What is Browser Automation?</h4>
                <p className="text-neutral-500 text-xs leading-relaxed mb-6"><span className="text-purple-400">Browser automation</span> means programmatically controlling a web browser — clicking buttons, filling forms, extracting data, taking screenshots. <span className="text-white">Selenium</span> (Python) and <span className="text-white">Puppeteer</span> (Node.js) are the two most popular tools. Use them for web scraping, testing, monitoring, and building bots.</p>
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-xs text-neutral-500"><Icon icon="solar:clock-circle-linear" className="text-purple-400/60" width={14} /> 6 weeks · Self-paced</div>
                  <div className="flex items-center gap-3 text-xs text-neutral-500"><Icon icon="solar:document-text-linear" className="text-purple-400/60" width={14} /> 28 lessons · 3 projects</div>
                  <div className="flex items-center gap-3 text-xs text-neutral-500"><Icon icon="solar:diploma-verified-linear" className="text-purple-400/60" width={14} /> Certificate on completion</div>
                </div>
                <div className="mb-6">
                  <h4 className="text-xs text-neutral-400 uppercase tracking-widest font-semibold mb-3">Tech Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Selenium', 'Puppeteer', 'Playwright', 'Python', 'Node.js', 'Headless Chrome'].map((t) => (
                      <span key={t} className="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.06] text-neutral-400 text-[10px] font-mono">{t}</span>
                    ))}
                  </div>
                </div>
                <button onClick={openBetaModal} className="block w-full text-center bg-purple-500 text-white font-semibold rounded-md px-6 py-3 text-sm hover:bg-purple-400 transition-colors">Start Course — Free</button>
              </div>
            </div>
            <div className="lg:col-span-2">
              <span className="font-mono text-neutral-600 text-[11px] block mb-6">/// Curriculum</span>
              <ModuleCard code="M1" codeColor="text-purple-400" title="Automation Fundamentals" lessonCount={6} lessons={['What is Browser Automation? Use Cases', 'The DOM: Selectors, XPath & CSS', 'Headless vs Headed Browsers', 'Ethics & Legal: Responsible Automation']} moreCount={2} />
              <ModuleCard code="M2" codeColor="text-purple-400" title="Selenium with Python" lessonCount={8} lessons={['Selenium Setup & WebDriver', 'Finding Elements & Interactions', 'Waits, Screenshots & File Downloads', 'Building a Web Scraper']} moreCount={4} />
              <ModuleCard code="M3" codeColor="text-purple-400" title="Puppeteer & Playwright" lessonCount={8} lessons={['Puppeteer Setup & Page Navigation', 'JavaScript Execution & Network Interception', 'Playwright: Cross-Browser Automation', 'PDF Generation & Visual Testing']} moreCount={4} />
              <ModuleCard code="M4" codeColor="text-purple-400" title="Deploying Automations on Logic Packs" lessonCount={6} lessons={['Automation Pack: Managed Browser Infrastructure', 'Scheduling, Retries & Error Handling', 'Building an Automation Pack for the Marketplace']} moreCount={3} />
              <ScrollReveal>
                <div className="border border-purple-500/20 rounded-xl p-6 bg-purple-500/[0.02]">
                  <div className="flex items-center gap-2 mb-3">
                    <Icon icon="solar:star-bold" className="text-purple-400" />
                    <span className="text-purple-400 text-xs font-semibold uppercase tracking-wider">Final Projects</span>
                  </div>
                  <h4 className="text-white text-sm font-medium mb-2">Build 3 Real Automation Tools</h4>
                  <p className="text-neutral-500 text-xs leading-relaxed">1) A price-tracking scraper with alerts · 2) An automated testing suite for a web app · 3) A data collection bot deployed as an Automation Pack on the marketplace.</p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="border-b border-white/[0.06]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8 py-20 md:py-28 text-center relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[40vw] h-[40vw] bg-green-500/[0.04] blur-[150px] rounded-full" />
          </div>
          <div className="relative z-10">
            <ScrollReveal><h2 className="text-4xl md:text-5xl font-semibold text-white tracking-tight mb-4">Start Learning Today</h2></ScrollReveal>
            <ScrollReveal><p className="text-neutral-500 text-base mb-3">All courses are free. Learn at your own pace. Build real projects. Earn certificates.</p></ScrollReveal>
            <ScrollReveal><p className="text-neutral-600 text-sm mb-8">Ambassadors get priority access and mentorship. <Link to="/ambassadors" className="text-green-500 hover:underline">Join the program →</Link></p></ScrollReveal>
            <ScrollReveal>
              <div className="flex flex-wrap gap-3 justify-center">
                <a href="#fullstack" className="inline-flex items-center gap-2 bg-white text-black font-semibold rounded-md px-8 py-3 text-sm hover:bg-neutral-200 transition-colors">
                  Start Full Stack <Icon icon="solar:arrow-right-linear" width={16} />
                </a>
                <a href="#python" className="inline-flex items-center gap-2 border border-blue-500/20 text-blue-400 font-medium rounded-md px-6 py-3 text-sm hover:bg-blue-500/5 transition-colors">Python</a>
                <a href="#react" className="inline-flex items-center gap-2 border border-cyan-500/20 text-cyan-400 font-medium rounded-md px-6 py-3 text-sm hover:bg-cyan-500/5 transition-colors">React</a>
                <a href="#automation" className="inline-flex items-center gap-2 border border-purple-500/20 text-purple-400 font-medium rounded-md px-6 py-3 text-sm hover:bg-purple-500/5 transition-colors">Automation</a>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
}
