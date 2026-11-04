import {
  BRANDS as BRANDS_CONFIRMED,
  SHOW_BRANDS as SHOW_BRANDS_CONFIRMED,
  COMPANY_ADDRESS,
  COMPANY_CITY,
  COMPANY_FORM,
  COMPANY_LICENCE,
  COMPANY_NAME,
  COMPANY_SINCE,
  COMPANY_WEBSITE,
  DEVELOPER,
  ENTERPRISE_PER,
} from './confirm';
// Every outbound link, download and the paste-in agent prompt live here, so
// changing where "Sign in" or "Download" points is a one-line edit.

export const SITE_URL = 'https://logicpacks.io';

// Open source: the collaborative workspace is MIT; the hosted services are not part of the repository.
export const OPEN_SOURCE = {
  repo: 'https://github.com/Tech-Realm/logicpacks',
  license: 'MIT',
  licenseUrl: 'https://opensource.org/licenses/MIT',
  label: 'Open source',
  message: 'The collaborative workspace is open source under MIT; Cloud, Talent, Apps and Enterprise are hosted services.',
  hosted: ['LogicPacks Cloud (coming soon)', 'Talent', 'Apps', 'Enterprise'],
};

// The version the copy describes. DOWNLOADS.mac.version (below) is the shipped DMG and is set at release.
export const CURRENT_VERSION = '0.1.12';

// public/setup.md is the agent setup guide. Until it ships, Docs points at the repo
// docs so nothing links a 404. The build sets __HAS_SETUP__ (vite.config.js).
// eslint-disable-next-line no-undef
export const HAS_SETUP = typeof __HAS_SETUP__ !== 'undefined' && __HAS_SETUP__;

export const LINKS = {
  docs: HAS_SETUP ? '/setup.md' : 'https://github.com/Tech-Realm/logicpacks/tree/main/docs',
  download: '/download',
  whatsNew: '/new',
  privacy: '/privacy',
  story: '/story',
  research: '/research',
  pricing: '/pricing',
  terms: '/terms',
};

// Release files. The ship step fills these in; while a field is null the
// download page shows the platform as "on the way" instead of a dead link.
export const DOWNLOADS = {
  mac: {
    // Versioned file names: Cloudflare caches release binaries, so a new
    // release gets a new name (and the ?v= tag) instead of reusing this one.
    url: 'https://downloads.logicpacks.io/mac/LogicPacks-0.1.12-arm64.dmg?v=40f2c39e',
    // Hex SHA-256 of the DMG, published next to the button.
    sha256: '40f2c39e0ba0fc731c2b8d3ba07fdec03123a61b99cde81272813c13dabfe216',
    version: '0.1.12',
    size: '177 MB',
    requires: 'macOS 13 or later, Apple silicon',
  },
  // The Windows installer: per user (no admin), x64, not code-signed yet (SmartScreen may ask).
  windows: {
    url: 'https://downloads.logicpacks.io/win/LogicPacks-0.1.12-x64.exe?v=5c75f0f4',
    sha256: '5c75f0f496f78302639b63a2e6e0987f79c3e7e3798d4dba8a471886a3f3b92a',
    version: '0.1.12',
    size: '248 MB',
    requires: 'Windows 10 or 11, x64',
  },
  // iOS is not built yet.
  ios: { url: null },
};

// One line in Terminal (macOS): downloads the signed, notarized app, checks its SHA-256,
// installs it to /Applications with the lp helper and opens it (public/install.sh).
// On Linux the same line installs the lp helper only.
export const INSTALL_COMMAND = `curl -fsSL ${SITE_URL}/install.sh | bash`;
// One line in PowerShell (Windows): the app, installed per user with no admin, plus lp.exe on the
// PATH, both checked against their SHA-256 (public/install.ps1).
export const INSTALL_COMMAND_WINDOWS = `irm ${SITE_URL}/install.ps1 | iex`;
// Said next to the Windows command: the app is not code-signed yet.
export const SMARTSCREEN_NOTE =
  'The app is not code-signed yet: if Windows SmartScreen asks, choose More info, then Run anyway.';

// The agent helper alone (lp, one standalone executable, no Node needed), from research/connect.json.
export const HELPER_INSTALL = `curl -fsSL ${SITE_URL}/helper.sh | bash`;
export const HELPER_INSTALL_WINDOWS = `irm ${SITE_URL}/helper.ps1 | iex`;

// Copied by "Install with your agent". Written for Claude Code, Codex or any
// agent with a shell: plain steps, no assumptions about which agent runs it.
export const AGENT_PROMPT = `Install LogicPacks on this computer and set this project up in it.

1. If LogicPacks is not installed, install it with one line. It checks the SHA-256, installs the app and the lp helper, and opens the app. Stop if it reports a checksum mismatch.
   macOS (Apple silicon), in Terminal: ${INSTALL_COMMAND}
   Windows (x64), in PowerShell: ${INSTALL_COMMAND_WINDOWS}
2. If LogicPacks is already installed, just open it.
3. LogicPacks uses the Claude Code or Codex CLI already installed and logged in on this machine. If the app says the CLI is missing, help me install it and log in in the terminal.
4. Add this folder as a project. It stays on this machine until I share it.
5. Tell me when it is ready, and remind me that I can add teammates and share the project from the app. Teammates connect to my laptop while it is on.`;

// The hero visual: the launch film (public/launch.mp4) over its poster frame.
export const LAUNCH_MEDIA = {
  image: '/launch.jpg',
  imageWebp: '/launch.webp',
  video: '/launch.mp4',
  alt: 'The LogicPacks launch film: two people and their agents working side by side in one synced project.',
};

// Demo footage for the Beta "every app" section: a recording of the app's demo
// (72 s timeline, recorded and sped up 2x).
export const EVERY_APP_MEDIA = {
  video: '/every-app.mp4',
  webm: '/every-app.webm',
  poster: '/every-app.jpg',
  alt: 'The Beta any-app preview: a live Blender view with named cursors for each person and agent, their turns and an action log.',
};

// Row 1 on the landing page: ten seconds of the launch film, two people working
// in one shared project.
export const TOGETHER_MEDIA = {
  video: '/together.mp4',
  poster: '/together.jpg',
  alt: 'Two people in one shared project, each with their own agent thread, messaging each other.',
};

// Every harness and editor shown in the "works with" strip, in order: agents, editors,
// then the rest. `mark` is a simple-icons slug (CC0); without one the name is the mark.
export const TOOLS = [
  { name: 'Claude Code', mark: 'claudecode' },
  { name: 'Codex' },
  { name: 'OpenCode', mark: 'opencode' },
  { name: 'Gemini CLI', mark: 'googlegemini' },
  { name: 'Command Code' },
  { name: 'Z.ai GLM', mark: 'zdotai' },
  { name: 'Cursor', mark: 'cursor' },
  { name: 'VS Code Copilot', mark: 'githubcopilot' },
  { name: 'Windsurf', mark: 'windsurf' },
  { name: 'Cline', mark: 'cline' },
  { name: 'Zed', mark: 'zedindustries' },
  { name: 'JetBrains', mark: 'jetbrains' },
  { name: 'Aider' },
  { name: 'Amp' },
  { name: 'Kiro' },
  { name: 'Goose' },
  { name: 'Qwen Code', mark: 'qwen' },
  { name: 'Warp', mark: 'warp' },
  { name: 'Hermes' },
];

// The paste-in prompt that connects an agent already in use to LogicPacks.
export const SETUP_URL = 'https://logicpacks.io/setup.md';
// Not the helper's `lp setup-prompt`: this one installs the app first (no cloud sign-in; the cloud is coming soon).
export const CONNECT_PROMPT = `Set up LogicPacks for me: read ${SETUP_URL} and follow it.
1. If the LogicPacks app is missing, install it with one line, which also installs the lp helper: on macOS run ${INSTALL_COMMAND} in Terminal, on Windows run ${INSTALL_COMMAND_WINDOWS} in PowerShell.
2. Make sure Claude Code or Codex is installed and logged in in my terminal. If not, help me install it and log in.
3. Open this project in LogicPacks, then help me add my teammates.
Once the app is open, run lp login to connect the helper to it on this computer; there is no account. Do not send me to app.logicpacks.io: our cloud is coming soon.
Show me anything you would change on this machine and wait for my OK first.`;

// Sample experts for the Request assistance release on /new. Not real people: the
// portraits are generated and the page says so. The app seeds the same eight.
export const EXPERTS = [
  { id: 'ingrid-solberg', name: 'Ingrid Solberg', role: 'Blender artist', line: 'Scenes, lighting and clean topology.' },
  { id: 'tomas-reyes', name: 'Tomás Reyes', role: 'DaVinci colourist', line: 'Grades and conforms edits ready to deliver.' },
  { id: 'anika-rao', name: 'Anika Rao', role: 'Frontend engineer', line: 'React, accessibility and fast pages.' },
  { id: 'jonas-weber', name: 'Jonas Weber', role: 'Backend engineer', line: 'Postgres, APIs and the slow query.' },
  { id: 'kofi-mensah', name: 'Kofi Mensah', role: 'DevOps engineer', line: 'Builds, deploys and cloud hosts.' },
  { id: 'lea-moreau', name: 'Léa Moreau', role: 'Motion designer', line: 'Titles and product shots you can edit.' },
  { id: 'yuna-park', name: 'Yuna Park', role: 'AI/ML engineer', line: 'Evals and retrieval for your agents.' },
  { id: 'karim-haddad', name: 'Karim Haddad', role: 'QA engineer', line: 'Tests and release checks before it ships.' },
];

export const expertPortrait = (id) => `/experts/${id}.webp`;

// The expert cards show once their portraits are in public/experts.
export const EXPERT_PORTRAITS_READY = true;

// The operator, named in the footer and on /privacy and /terms.
// Details come from src/confirm.js (from the trade licence).
export const COMPANY = {
  name: COMPANY_NAME,
  form: COMPANY_FORM,
  city: COMPANY_CITY,
  country: 'UAE',
  since: COMPANY_SINCE,
  website: COMPANY_WEBSITE,
  address: COMPANY_ADDRESS,
  licence: COMPANY_LICENCE,
  whatsapp: '+1 713 632 2262',
  whatsappUrl: 'https://wa.me/17136322262',
};

export { DEVELOPER };

export const LEGAL_EFFECTIVE = '1 November 2026';

// Brands we've built for, from src/confirm.js.
export const BRANDS = BRANDS_CONFIRMED;
export const SHOW_BRANDS = SHOW_BRANDS_CONFIRMED;
export const brandLogo = (file) => `/brands/${file}.png`;

// Our story, as the team tells it. Months are approximate.
export const STORY = [
  { when: 'Nov 2025', title: 'Started building', body: 'A shared workspace where people and their agents work on the same project.' },
  { when: 'Jan 2026', title: 'Internal testing', body: 'Opened to our own team after two months, used on our client work every day.' },
  { when: 'Feb to Oct 2026', title: 'Eight months of testing', body: 'Used in labs and by tech agencies on real projects.' },
  { when: 'Nov 2026', title: 'Public beta', body: 'Version 0.1.12: the app for Mac and Windows with a code editor and agent workspace, projects, adding people and sharing, running on your own Claude Code or Codex. Our cloud is coming soon. App sharing and Request assistance are Beta.' },
];

// Launches built with LogicPacks. Facts only from the project notes.
export const SHIPPED = [
  {
    id: 'virtual-sizing',
    title: 'Virtual sizing',
    kind: 'E-commerce',
    client: 'Digital Software Market',
    body: 'A shopper’s photo becomes body measurements and a size recommendation, for an online clothing store.',
  },
  {
    id: 'virtual-try-on',
    title: 'Virtual try-on',
    kind: 'E-commerce',
    client: 'Digital Software Market',
    body: 'Try a garment on your own photo from any product page, with an admin for try-ons, sizing and customers.',
  },
  {
    id: 'reform',
    title: 'Reform',
    kind: 'iPhone and Mac app',
    client: 'Darian Woehr and Hailey Sadler',
    body: 'Consent and release forms for people on camera, with Shot Guard blurring anyone who said no. In TestFlight.',
  },
  {
    id: 'taas',
    title: 'TAAS',
    kind: 'AI fashion app',
    client: 'Our own product',
    body: 'An AI fashion app we build and run ourselves.',
    // TODO(taas-video): the TAAS film was not found in the landing repo or notes. Add
    // `video: '/shipped/taas.mp4'` and `poster` here once it is located.
    video: null,
  },
];

// Pricing. TODO(confirm): the list of coming-soon features; the period is in src/confirm.js.
export const PRICING = {
  individual: {
    name: 'Individuals',
    price: 'Free',
    note: 'For you and the people you work with.',
    features: [
      'Shared projects with your team, hosted on your laptop while it is on',
      'Your own agent and subscription: Claude Code or Codex',
      'The app for Mac and Windows, with a code editor and agent workspace',
      'Beta features as they land',
    ],
  },
  enterprise: {
    name: 'Enterprise',
    price: '$99',
    per: ENTERPRISE_PER,
    note: 'For companies that want more control.',
    features: ['Everything in Individuals'],
    soon: ['Single sign-on', 'Admin controls and audit log', 'Our cloud, and your own cloud host', 'Vetted freelancers on request'],
  },
};

// Where it runs: the main page and /about.md read the same two lines.
export const WHERE = [
  {
    title: 'Your machine',
    body: 'Use the Claude Code or Codex you already have installed and logged in on your computer. We do not run anything for you, and your login stays on your machine.',
    soon: false,
  },
  {
    title: 'Our cloud',
    body: 'A sandboxed cloud where each member gets an isolated user, and work keeps going when your laptop is off.',
    soon: true,
  },
];

// Vetted freelancers (Request assistance, Beta): /new and /about.md.
export const FREELANCERS =
  'Sometimes it is cheaper to save tokens and bring in a freelancer vetted by LogicPacks. They bring their own Claude and tools and use none of your tokens: you pay for their hours, with their AI included. Every freelancer works under NDA and your keys are never shared with them. Secret files such as .env are hidden from them, and milestones and drift alerts keep their work on plan.';

// The shortest path for two people (the 0.1.12 app, Mac or Windows).
export const FRIEND_PATH = [
  'Each of you installs the app (Mac or Windows) from https://logicpacks.io/download and has Claude Code or Codex installed and logged in. If the CLI is missing, the app shows the install command and tells you to log in in your terminal.',
  'The host adds a project in the app: an empty folder, or an existing folder or Git repository.',
  'The host adds the other person and shares the project. Teammates connect and sync to the host\'s laptop while it is on.',
  'Each of you works in your own thread with your own agent on your own login, and you both see who is working on what.',
];

// How it compares: the main page and the top of /index.md read the same lines.
export const COMPARE = [
  { vs: 'Zed Delta, claude-duet', line: 'They share one Claude Code session. LogicPacks gives each person their own agent, with many agents in parallel that coordinate.' },
  { vs: 'Cursor, Devin', line: 'Strong single-user agents. LogicPacks puts several people and their agents in one project, with goals and drift alerts (Beta).' },
  { vs: 'Tuple, Parsec', line: 'Screen sharing without agents. LogicPacks shares the project, the threads and the agents.' },
  { vs: 'Upwork', line: 'Hiring without the workspace. In LogicPacks a vetted freelancer joins the project with their own AI (Beta).' },
];
