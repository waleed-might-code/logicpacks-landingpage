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
    url: 'https://downloads.logicpacks.io/mac/LogicPacks-0.1.7-arm64.dmg?v=f4c47b37',
    // Hex SHA-256 of the DMG, published next to the button.
    sha256: 'f4c47b37670d84afc3036913f330f68b2712f8f2d1daf651565f2145d641618a',
    version: '0.1.7',
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

// Demo footage for the coming-soon "every app" section: the app's own
// coming-soon demo route (/demo/machine), recorded and sped up 2x.
export const EVERY_APP_MEDIA = {
  video: '/every-app.mp4',
  poster: '/every-app.jpg',
  alt: 'The coming-soon any-app preview: a live Blender view with named cursors for each person and agent, their turns and an action log.',
};
