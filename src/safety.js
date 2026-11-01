// /safety.md: what the setup installs and changes, backups, the production URLs, what
// teammates see, secrets, and how to remove access. Built at build time; the block and
// the harness table come from the helper source via research/connect.json
// (scripts/sync-connect.mjs), so the quoted block is the one the helper writes.
import connect from '../research/connect.json';
import { LINKS, SITE_URL } from './site';

const fence = (lang, text) => `\`\`\`${lang}\n${text}\n\`\`\``;

const harnessTable = () =>
  [
    '| Harness | `lp setup --agent` id | What setup writes (macOS, Linux) | Windows, if different |',
    '|---|---|---|---|',
    ...connect.harnesses.map((h) => {
      const what =
        h.kind === 'block'
          ? `appends the marked block to \`${h.global}\``
          : h.kind === 'file'
            ? `creates its own file \`${h.global}\``
            : h.kind === 'yaml-read'
              ? `adds a marked \`read:\` entry: \`${h.global}\``
              : 'nothing global (no global file; prints the steps for its settings screen)';
      return `| ${h.name} | \`${h.id}\` | ${what} | ${h.globalWindows ? `\`${h.globalWindows}\`` : ''} |`;
    }),
  ].join('\n');

export function safetyMarkdown(server) {
  const f = connect.features;
  const m = connect.markers;
  return `# LogicPacks safety: what setup changes and how to undo it

Facts for people, and for AI assistants helping someone decide whether to run the LogicPacks setup. Each section links to its source. The helper facts below are generated from the helper source (\`${connect.source.file}\`, ${connect.source.repo} at ${connect.source.commit}).

## 1. Production URLs

- Site: ${SITE_URL}. App: ${LINKS.webApp}. Agent setup guide: ${SITE_URL}/setup.md.
- Every page declares \`<link rel="canonical">\` to ${SITE_URL}, and every markdown file names its canonical URL at the bottom (and in a \`Link: rel="canonical"\` header).
- Preview builds (for example \`*.logicpacks-landingpage.pages.dev\`) are test builds: they carry \`noindex\` and say so at the top of /llms.txt and /about.md. Use the production URLs above.

## 2. What the helper installs

Install line, macOS and Linux: \`${connect.helperInstall}\`. Windows (PowerShell): \`${connect.helperInstallWindows}\`. The helper needs Node.js 18 or newer and runs as your user (no admin rights).

Files it puts on your computer:

- macOS and Linux: \`~/.logicpacks/helper/lp.mjs\` (the helper), \`~/.logicpacks/helper/bin/lp\` (a small wrapper) and a symlink \`~/.local/bin/lp\`. It does not edit your shell profile; if \`~/.local/bin\` is not on your PATH it prints how to add it.
- Windows: \`%USERPROFILE%\\.logicpacks\\helper\\\` with \`lp.cmd\` and \`lp\` in its \`bin\` folder, and that \`bin\` folder added to your user PATH.
- Your sign-in token, after \`lp login\`: \`~/.logicpacks/\`. \`lp logout\` forgets it.

The installer and \`lp login\` change no agent settings. Streaming your sessions is optional: \`lp install\` shows what it would change and writes only with \`--yes\` (\`lp install --dry-run\` never writes; the installer runs \`lp install --yes\` only if you set \`LP_HELPER_INSTALL=1\`). It sets up:

- **Claude Code hooks** in \`~/.claude/settings.json\`: one hook each for SessionStart, UserPromptSubmit, PostToolUse and Stop, running \`lp hook <event>\` and tagged \`# logicpacks-helper\`. Your other settings and hooks are kept. Skip with \`--no-hooks\` (installer: \`LP_HELPER_NO_HOOKS=1\`).
- **A background watcher** (\`lp watch\`) that starts at login: macOS \`~/Library/LaunchAgents/io.logicpacks.helper.plist\`, Linux \`~/.config/systemd/user/logicpacks-helper.service\`, Windows \`logicpacks-helper.vbs\` in your Startup folder. Skip with \`--no-watcher\` (installer: \`LP_HELPER_NO_WATCHER=1\`).
- **The optional \`logicpacks\` MCP server** (command \`lp\`, args \`["mcp"]\`), registered in \`~/.claude.json\` (Claude Code) and \`~/.codex/config.toml\` (Codex).${f.loginRegistersMcp ? ' `lp login` also registers it once you are signed in; `lp login --no-mcp` skips that.' : ''}

Each file it changes is first copied to \`<file>.lp-backup-<YYYYMMDD-HHMMSS>\`, and the path is printed. Helpers installed before 2026-11-01 behaved differently (the installer ran \`lp install\` itself); run the install line again to get these defaults.

The hooks and the watcher send Claude Code and Codex sessions from **linked project folders** to that project on the host (see section 5). \`lp pause\` stops streaming; \`lp unlink\` keeps a folder's sessions private.

## 3. The exact edit to your global instructions

\`lp setup --agent <id>\` shows the exact change to your harness's global instructions file as a diff and writes it only with \`--yes\` (\`--dry-run\` never writes). It only appends the block between \`${m.start}\` and \`${m.end}\`. It never edits or deletes your existing lines; running it again only replaces the text between the markers. Harnesses without a shared file (Cline, Roo, Kiro) get a separate file of their own, marked on its first line.

The block, verbatim, as the helper writes it:

${fence('markdown', `${m.start}\n${connect.block}\n${m.end}`)}

Where it goes:

${harnessTable()}

\`lp setup-block\` prints the block so you can paste it yourself instead.${
    f.dryRun
      ? ' A file whose LogicPacks markers are unbalanced is refused, not rewritten.'
      : ' There is no dry-run option yet; to see the change first, run `lp setup-block` and read it, or diff the file after setup against your backup.'
  }

**Undo:** \`lp uninstall\` (\`lp uninstall --dry-run\` shows what it would remove) removes every LogicPacks block and LogicPacks-owned rules file, the Claude Code hooks, the watcher and the MCP registrations. A file it appended to comes back byte for byte as it was before; a file it created and that now holds only the block is deleted. \`lp uninstall --agent <id>\` removes just that harness's block. \`lp uninstall\` leaves the helper itself in place; to remove it too, run \`lp logout\`, then delete \`~/.logicpacks\` and \`~/.local/bin/lp\` (Windows: \`%USERPROFILE%\\.logicpacks\` and its \`bin\` entry in your user PATH). \`lp uninstall\` does not delete projects you shared: they stay on the host and on GitHub.

## 4. Back up first

${
  f.blockBackup
    ? 'Setup copies each file it touches to `<file>.lp-backup-<YYYYMMDD-HHMMSS>` before writing and prints that path. To keep a copy of your own as well:'
    : 'Today setup does not make its own copy of your instructions file (only Claude Code\'s `settings.json` is copied once, to `settings.json.before-logicpacks`). Make a backup yourself first:'
}

${fence(
  'sh',
  [
    'd=$(date +%Y-%m-%d)',
    'for f in ~/.claude/CLAUDE.md ~/.claude/settings.json ~/.claude.json ~/.codex/AGENTS.md ~/.codex/config.toml; do',
    '  [ -f "$f" ] && cp -p "$f" "$f.lp-backup-$d"',
    'done',
  ].join('\n'),
)}

Windows (PowerShell): \`Copy-Item $HOME\\.claude\\CLAUDE.md "$HOME\\.claude\\CLAUDE.md.lp-backup-$(Get-Date -Format yyyy-MM-dd)"\`. Add the file for your harness from the table above.

${server}`;
}
