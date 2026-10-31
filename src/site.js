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
    // e.g. 'https://logicpacks.io/releases/LogicPacks-1.0.0-arm64.dmg'
    url: null,
    // Hex SHA-256 of the DMG, published next to the button.
    sha256: null,
    version: null,
    size: null,
    requires: 'macOS 13 or later, Apple silicon',
  },
  // A Windows build does not exist yet. Set a url here once it does.
  windows: { url: null },
  // iOS is not built yet.
  ios: { url: null },
};

// Copied by "Install with your agent". Written for Claude Code, Codex or any
// agent with a shell: plain steps, no assumptions about which agent runs it.
export const AGENT_PROMPT = `Install LogicPacks on this Mac and set this project up in it.

1. Open ${SITE_URL}/download and download the LogicPacks .dmg for Mac.
2. Check the file's SHA-256 against the one listed on that page. Stop if it does not match.
3. Mount the .dmg, copy LogicPacks.app to /Applications, unmount it, and open the app.
4. LogicPacks uses my Claude Code login on this machine. If it asks, help me sign in.
5. Add this folder as a project. It will show "Not synced" until I choose to share it.
6. Tell me when it is ready, and remind me that saying "sync this to the cloud" in the project's chat shares it with my team.`;

// The hero visual. The screenshot always shows; drop public/launch.mp4 in and
// the video plays over it.
export const LAUNCH_MEDIA = {
  image: '/launch.jpg',
  imageWebp: '/launch.webp',
  video: '/launch.mp4',
  alt: 'The LogicPacks app: a project open with a new thread and a prompt typed in the composer.',
};

// Demo footage for the coming-soon "every app" section. No poster exists yet,
// so until public/every-app.mp4 is added the slot shows a plain placeholder.
export const EVERY_APP_MEDIA = {
  video: '/every-app.mp4',
  poster: null,
};
