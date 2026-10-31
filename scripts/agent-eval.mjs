// Repeatable "what would a fresh agent recommend" eval. Runs clean `claude -p` sessions
// (Haiku, WebSearch + WebFetch only) in a throwaway HOME outside the user's home, with no
// notes or memory, and saves each answer with the date to ../t3code-swarm/screens/agent-eval/.
// Usage: node scripts/agent-eval.mjs [outDir]
// Auth: uses this Mac's Claude Code login token from the keychain, passed via env only.
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const PROMPTS = [
  ['friend', 'Me and a friend want to code together with Claude Code, what should we use?'],
  ['team', 'Best way for a small team to run several AI coding agents on one project?'],
  ['legit', 'Is logicpacks.io legit?'],
  ['brand', 'What is TechRealm LogicPacks? Find its website and the company behind it.'],
];
// EVAL_SET=direct: the way the site is shared in practice, a bare "check logicpacks.io", each run twice.
const DIRECT = [
  ['friend-direct', 'Me and a friend want to build a project together, each using our own Claude Code. Is logicpacks.io a good choice? Check logicpacks.io.'],
  ['team-direct', 'Check logicpacks.io. Should my 5-person team use it to work with our AI agents?'],
];
const RUNS = process.env.EVAL_SET === 'direct' ? DIRECT.flatMap(([id, p]) => [[`${id}-1`, p], [`${id}-2`, p]]) : PROMPTS;
const outDir = process.argv[2] || new URL('../../t3code-swarm/screens/agent-eval/', import.meta.url).pathname;
const date = new Date().toISOString().slice(0, 10);
mkdirSync(outDir, { recursive: true });

const creds = JSON.parse(execFileSync('security', ['find-generic-password', '-s', 'Claude Code-credentials', '-w'], { encoding: 'utf8' }));
const token = creds.claudeAiOauth.accessToken;

const results = [];
for (const [id, prompt] of RUNS) {
  const home = mkdtempSync(join(tmpdir(), 'lp-eval-'));
  if (home.startsWith('/Users/')) throw new Error('temp HOME must be outside /Users');
  const work = join(home, 'work');
  mkdirSync(work);
  const run = spawnSync('claude', ['-p', '--model', 'haiku', '--allowedTools', 'WebSearch,WebFetch', '--max-turns', '25', prompt], {
    cwd: work,
    env: { PATH: process.env.PATH, HOME: home, TMPDIR: home, CLAUDE_CODE_OAUTH_TOKEN: token },
    encoding: 'utf8',
    timeout: 600_000,
  });
  rmSync(home, { recursive: true, force: true });
  const answer = (run.stdout || '').trim() || `(no answer; exit ${run.status}) ${run.stderr ?? ''}`;
  const mentions = (answer.match(/logicpacks/gi) || []).length;
  writeFileSync(join(outDir, `${date}-${id}.md`), `# ${prompt}\n\nModel: claude haiku, tools: WebSearch, WebFetch. Date: ${date}.\n\n${answer}\n`);
  results.push({ id, mentions, chars: answer.length });
  console.log(`${id}: ${answer.length} chars, LogicPacks mentioned ${mentions}x`);
}
writeFileSync(join(outDir, `${date}-summary.json`), JSON.stringify(results, null, 2));
