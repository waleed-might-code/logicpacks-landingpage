// Every outbound link, download and the paste-in agent prompt live here, so
// changing where "Sign in" or "Download" points is a one-line edit.

export const SITE_URL = 'https://logicpacks.io';
export const APP_URL = 'https://app.logicpacks.io';

export const LINKS = {
  docs: 'https://github.com/Majboor/t3code/tree/main/docs',
  signIn: APP_URL,
  webApp: APP_URL,
  download: '/download',
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

// Footage for the Beta sections, recorded from the app's own routes. A section
// shows its poster until the video loads.
export const PACKS_MEDIA = {
  video: '/packs.mp4',
  poster: '/packs.jpg',
  alt: 'The packs preview: one pack built from real work, plugged into Claude, Codex, OpenCode and Gemini, with its versions and a before and after answer.',
};

export const ASSIST_MEDIA = {
  image: '/assist.jpg',
  alt: 'Request assistance in LogicPacks: a panel of experts with their portraits, skills and a Request button each.',
};

export const CONTEXT_MEDIA = {
  image: '/context.jpg',
  alt: 'A thread saved as the pack "Menu layout", with Use in handing its context to another thread or project.',
};

// The agents people log in with. Plain wordmarks, no vendor logos.
export const AGENTS = ['Claude Code', 'Codex', 'OpenCode', 'Gemini CLI'];
