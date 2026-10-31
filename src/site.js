// Every outbound link, download and the paste-in agent prompt live here, so
// changing where "Sign in" or "Download" points is a one-line edit.

export const SITE_URL = 'https://logicpacks.io';
export const APP_URL = 'https://app.logicpacks.io';

// public/setup.md is the agent setup guide. Until it ships, Docs points at the repo
// docs so nothing links a 404. The build sets __HAS_SETUP__ (vite.config.js).
// eslint-disable-next-line no-undef
export const HAS_SETUP = typeof __HAS_SETUP__ !== 'undefined' && __HAS_SETUP__;

export const LINKS = {
  docs: HAS_SETUP ? '/setup.md' : 'https://github.com/Majboor/t3code/tree/main/docs',
  signIn: APP_URL,
  webApp: APP_URL,
  download: '/download',
  whatsNew: '/new',
};

// Release files. The ship step fills these in; while a field is null the
// download page shows the platform as "on the way" instead of a dead link.
export const DOWNLOADS = {
  mac: {
    // Versioned file names: Cloudflare caches release binaries, so a new
    // release gets a new name (and the ?v= tag) instead of reusing this one.
    url: 'https://downloads.logicpacks.io/mac/LogicPacks-0.1.8-arm64.dmg?v=0a0bc425',
    // Hex SHA-256 of the DMG, published next to the button.
    sha256: '0a0bc42532c913c288c74aabd3cea0796ff010f3936f126cf1abc1f960786dd6',
    version: '0.1.8',
    size: '176 MB',
    requires: 'macOS 13 or later, Apple silicon',
  },
  // A Windows build does not exist yet. Set a url here once it does.
  windows: { url: null },
  // iOS is not built yet.
  ios: { url: null },
};

// One line in Terminal: downloads the signed, notarized app, checks its
// SHA-256, installs it to /Applications and opens it (public/install.sh).
export const INSTALL_COMMAND = `curl -fsSL ${SITE_URL}/install.sh | bash`;

// Copied by "Install with your agent". Written for Claude Code, Codex or any
// agent with a shell: plain steps, no assumptions about which agent runs it.
export const AGENT_PROMPT = `Install LogicPacks on this Mac and set this project up in it.

1. If /Applications/LogicPacks.app is missing, run: ${INSTALL_COMMAND}
   It downloads the signed app, checks its SHA-256, copies it to /Applications and opens it. Stop if it reports a checksum mismatch.
2. If LogicPacks is already installed, just open it.
3. LogicPacks uses my Claude Code login on this machine. If it asks, help me sign in.
4. Add this folder as a project. It will show "Not synced" until I choose to share it.
5. Tell me when it is ready, and remind me that saying "sync this to the cloud" in the project's chat shares it with my team.`;

// The hero visual: the launch film (public/launch.mp4) over its poster frame.
export const LAUNCH_MEDIA = {
  image: '/launch.jpg',
  imageWebp: '/launch.webp',
  video: '/launch.mp4',
  alt: 'The LogicPacks launch film: two people and their agents working side by side in one synced project.',
};

// Demo footage for the Beta "every app" section: the app's own demo route
// (/demo/machine), recorded and sped up 2x.
export const EVERY_APP_MEDIA = {
  video: '/every-app.mp4',
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
  { name: 'T3 Code' },
];

// The paste-in prompt that connects an agent already in use to LogicPacks.
export const SETUP_URL = 'https://logicpacks.io/setup.md';
// The same three lines as `lp setup-prompt` and the app's "Use your own agent" (helper connectText.ts).
export const CONNECT_PROMPT = `Set up LogicPacks for me: read ${SETUP_URL} and follow it.
Install the helper, log me in, and add the LogicPacks block to your global instructions.
Then share this project and give me an invite link.`;

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
export const EXPERT_PORTRAITS_READY = false;
