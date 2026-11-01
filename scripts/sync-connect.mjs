// Copies the helper's own words (the global block, its markers, the harness table and
// the command list) from the helper source into research/connect.json, so /safety.md
// quotes the block the helper really writes instead of a hand-made copy.
// Usage: node scripts/sync-connect.mjs [helper repo]   (default /Volumes/Shared/lp-v2/connect)
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const repo = process.argv[2] || '/Volumes/Shared/lp-v2/connect';
const src = join(repo, 'packages/helper/src');
const text = await import(join(src, 'connectText.ts'));
const { HARNESSES, describeGlobal } = await import(join(src, 'harnesses.ts'));
const { MARKDOWN_MARKERS, YAML_MARKERS, OWN_FILE_MARK } = await import(join(src, 'globalBlock.ts'));
import { readFileSync, readdirSync } from 'node:fs';
const allSource = readdirSync(src).filter((f) => f.endsWith('.ts') && !f.includes('.test.')).map((f) => readFileSync(join(src, f), 'utf8')).join('\n');
const git = (...a) => execFileSync('git', ['-C', repo, ...a], { encoding: 'utf8' }).trim();

const winPath = (h) => (h.global.kind === 'block' || h.global.kind === 'file' ? h.global.path.windows ?? null : null);
const out = {
  source: { repo: git('rev-parse', '--abbrev-ref', 'HEAD'), commit: git('rev-parse', '--short', 'HEAD'), file: 'packages/helper/src/connectText.ts' },
  helperInstall: text.HELPER_INSTALL,
  helperInstallWindows: text.HELPER_INSTALL_WINDOWS,
  defaultHost: text.DEFAULT_HOST,
  markers: MARKDOWN_MARKERS,
  yamlMarkers: YAML_MARKERS,
  ownFileMark: OWN_FILE_MARK,
  block: text.globalBlockBody(),
  setupPrompt: text.setupPrompt('new'),
  harnesses: HARNESSES.filter((h) => !h.via).map((h) => ({
    id: h.id,
    name: h.name,
    kind: h.global.kind,
    global: describeGlobal(h),
    globalWindows: winPath(h),
    project: h.project?.path ?? null,
  })),
  commands: text.AGENT_COMMANDS,
  // Detected from the helper source, so /safety.md only claims what the helper does.
  features: {
    dryRun: /--dry-run/.test(allSource),
    blockBackup: /lp-backup/.test(allSource),
    settingsBackup: /before-logicpacks/.test(allSource),
    loginRegistersMcp: /case "login"[\s\S]{0,800}registerMcp\(\)/.test(allSource),
  },
};
writeFileSync(new URL('../research/connect.json', import.meta.url), `${JSON.stringify(out, null, 2)}\n`);
console.log(`research/connect.json from ${out.source.commit}: ${out.harnesses.length} harnesses, block ${out.block.split('\n').length} lines`);
