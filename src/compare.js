// /compare.md: LogicPacks next to other tools. Competitor facts were checked on each
// product's own site on 2026-11-01 (source per row). Where a page did not say, the cell
// reads "not documented", never "no". Re-check before changing a row.
import { PRICING } from './site';

const AS_OF = '2026-11-01';
const ND = 'not documented';

const COLUMNS = [
  'Several people and their agents in one project',
  'Bring your own subscription',
  'Agent to agent messaging across people',
  'Guardrails and drift',
  'Share apps on a host machine',
  'Vetted human help',
  'Local or self-host',
  'Price (entry)',
];

const LP = {
  name: 'LogicPacks',
  cells: [
    'yes: shared projects, each person with their own agent',
    'yes: Claude Code, Codex, OpenCode, Gemini CLI, Cursor and more',
    'yes: `lp ask`, `lp reply`, `lp send`',
    'next release (Beta): goals, milestones, drift alerts, review',
    'Beta: Mac host, benchmarks pending',
    'Beta: vetted freelancers on request',
    'local machine yes; your own cloud host coming soon',
    `${PRICING.individual.price} for individuals; ${PRICING.enterprise.price} ${PRICING.enterprise.per}`,
  ],
};

// [name, cells (8), great at, pick them instead when, sources]
const ROWS = [
  {
    group: 'AI coding',
    rows: [
      ['Claude Code (Anthropic)', ['partial: Team plan project sharing; agent teams are one user, experimental', 'yes: subscription, API key, Bedrock, Vertex', ND, 'partial: plan mode, permissions, blocking hooks', 'partial: Remote Control shares a session, not apps', ND, 'yes: local CLI, cloud models', 'Pro $20/mo; Team $25/seat/mo'],
        'The deepest Claude-native agent: subagents, hooks, skills, MCP, agent teams.',
        'You work alone or inside one org, want the strongest single agent, and do not need agents from different people talking to each other. LogicPacks runs on top of it.',
        ['https://claude.com/pricing', 'https://code.claude.com/docs/en/agent-teams']],
      ['OpenAI Codex', ['partial: Business workspace for coworkers', 'yes: API key for CLI and IDE; cloud needs a ChatGPT plan', ND, 'partial: /review, GitHub code review, sandbox', ND, ND, 'yes: open-source local CLI', 'Plus $20/mo; Business $25/user/mo'],
        'Open-source local CLI plus cloud tasks, GitHub review and Slack, included in ChatGPT plans.',
        'You already pay for ChatGPT and want cloud tasks with GitHub review. LogicPacks runs on top of it.',
        ['https://learn.chatgpt.com/docs/pricing', 'https://github.com/openai/codex']],
      ['Cursor (incl. cloud agents)', ['partial: teammates can view cloud agents', 'partial: own keys for chat, not Tab', ND, 'partial: Bugbot code review', ND, ND, 'partial: self-hosted machines run tools; inference at Cursor', 'Free; Teams $30/user/mo'],
        'Editor depth: the most polished AI editor, plus cloud agents and Bugbot review.',
        'The editor is your main surface. Cursor is far deeper as an editor than anything in LogicPacks, and LogicPacks works alongside it.',
        ['https://cursor.com/pricing', 'https://cursor.com/docs/settings/api-keys', 'https://cursor.com/docs/cloud-agent/self-hosted']],
      ['GitHub Copilot (incl. coding agent)', ['partial: agent sessions and PRs visible to repo collaborators', 'partial: BYOK in some surfaces, not completions', ND, 'yes: PR review, rulesets, branch protection', ND, ND, 'partial: self-hosted Actions runners', 'Free; Pro $10/mo; Business by quote'],
        'Native GitHub: issues to reviewed PRs, Actions and org policy at scale. (Copilot Workspace ended in 2025; the coding agent replaced it.)',
        'Your team lives in GitHub and wants agent work to land as reviewed pull requests.',
        ['https://github.com/features/copilot/plans', 'https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-coding-agent']],
      ['Devin (Cognition), incl. Windsurf, now Devin Desktop', ['partial: Teams plan to share and collaborate', ND, ND, 'partial: draft PRs wait for review; playbooks', 'not documented for your machine; you can take over Devin\'s own workspace', ND, 'partial: VPC on Enterprise; Desktop runs locally', 'Pro $20/mo; Teams $80/mo + $40/seat'],
        'A mature autonomous cloud agent with its own shell, editor and browser, tagged from Slack or Teams.',
        'You want to hand whole tickets to one autonomous agent. Devin is more autonomous than a LogicPacks thread.',
        ['https://devin.ai/pricing', 'https://docs.devin.ai']],
      ['Factory (Droids)', [ND, 'yes: custom models (BYOK)', ND, 'partial: autonomy controls', ND, ND, 'partial: on-premise on Enterprise', 'Pro $20/mo; Teams $60/mo + $40/seat'],
        'Enterprise agent rollout, Workstreams orchestration and managed Droid computers.',
        'An enterprise wants managed agents with compliance and on-prem options today.',
        ['https://factory.com/pricing', 'https://docs.factory.com']],
      ['Replit Agent', ['yes: multiplayer projects, each person with their own Agent threads', ND, ND, 'yes: plan mode approval, checkpoints, rollback', ND, ND, 'not documented (single-tenant on Enterprise)', 'Core $20/mo'],
        'Prompt to a running, hosted app in one browser tab, with database and auth built in.',
        'You want build and hosting together with no local setup, and Replit\'s models are fine.',
        ['https://replit.com/pricing', 'https://docs.replit.com/replit-workspace/workspace-features/multiplayer']],
      ['Conductor', ['yes, in its cloud: shared workspaces with chat and presence', 'yes: your own subscriptions and keys', ND, 'partial: review and merge each agent\'s changes', ND, ND, 'partial: local workspaces on Mac', 'Free; Pro $50/mo; Teams $60/user/mo'],
        'The most mature Mac app for running many Claude Code, Codex and Cursor agents in parallel.',
        'You mainly run many agents in parallel yourself on a Mac.',
        ['https://conductor.build', 'https://conductor.build/pricing']],
      ['Vibe Kanban (sunsetting, community maintained)', ['partial: collaborative issue tracking', ND, ND, 'partial: plan and review flow', ND, ND, 'yes: open source, runs locally', ND],
        'A free kanban board over many agents with git worktrees.',
        'You want a free local board for your agents and accept community maintenance.',
        ['https://vibekanban.com']],
      ['T3 Code', [ND, 'yes: uses each provider\'s CLI and your subscription', ND, ND, 'partial: remote access to your sessions, not apps', ND, 'yes: local, MIT licence', 'free'],
        'A free, open-source local control surface for many agent CLIs. LogicPacks is a fork of T3 Code and adds the team, guardrail, app sharing and help layers.',
        'You work alone and want a free local surface for your agents.',
        ['https://github.com/pingdotgg/t3code']],
    ],
  },
  {
    group: 'Pairing and screen or app sharing',
    rows: [
      ['VS Code Live Share (maintenance mode)', ['partial: people only', ND, ND, ND, 'partial: shared terminals and forwarded local web apps', ND, ND, ND],
        'Real-time co-editing and debugging inside VS Code, joinable from a browser.',
        'You want plain human pair editing in VS Code.',
        ['https://learn.microsoft.com/en-us/visualstudio/liveshare/']],
      ['Tuple', ['partial: people only', ND, ND, ND, 'yes: screen share with remote control', ND, ND, '$30/user/mo'],
        'Low-friction, high-quality pairing with remote control and drawing. Its call and video quality are more mature than LogicPacks app sharing.',
        'You mainly need two people pairing with great audio, video and control.',
        ['https://tuple.app/pricing']],
      ['Parsec (Teams)', [ND, ND, ND, ND, 'yes: full low-latency remote desktop, 60 fps, pen and gamepad input', ND, 'partial: peer to peer; relay on Enterprise', '$30/user/mo (annual)'],
        'The most mature low-latency remote desktop. Far ahead of LogicPacks on streaming performance today.',
        'You need to stream a whole workstation at low latency, for example for creative work.',
        ['https://parsec.app/teams']],
      ['Zed (collaboration and agent panel)', ['partial: channels and shared projects; sharing agent threads not documented', 'yes: own keys or external agents', ND, ND, 'partial: a shared project exposes the host\'s files', ND, 'partial: local editor', 'Personal free; Pro $10/mo'],
        'A very fast native editor with multiplayer channels and external agents through ACP.',
        'You want editor-level multiplayer and speed.',
        ['https://zed.dev/pricing', 'https://zed.dev/docs/collaboration/overview']],
    ],
  },
  {
    group: 'Hiring help',
    rows: [
      ['Upwork', [ND, ND, ND, ND, ND, 'yes: open marketplace (vetted tier not verified here)', ND, 'marketplace and contract fees (see source; not verified here)'],
        'Marketplace scale: the widest choice of talent at any budget.',
        'You need a broad choice of freelancers or a long engagement outside your project tools.',
        ['https://www.upwork.com/pricing']],
      ['Toptal', [ND, ND, ND, ND, ND, 'yes: screened experts, trial period', ND, '$79/mo platform fee; rates not listed'],
        'Heavily screened senior experts, usually matched within a day.',
        'You need a vetted senior hire for a longer engagement.',
        ['https://www.toptal.com/faq']],
    ],
  },
];

const esc = (v) => String(v).replace(/\|/g, '\\|');
const row = (name, cells) => `| ${esc(name)} | ${cells.map(esc).join(' | ')} |`;

export function compareMarkdown() {
  const table = [
    `| Product | ${COLUMNS.join(' | ')} |`,
    `|---|${COLUMNS.map(() => '---').join('|')}|`,
    row(`**${LP.name}**`, LP.cells),
    ...ROWS.flatMap((g) => g.rows.map(([name, cells]) => row(name, cells))),
  ].join('\n');

  const sections = ROWS.map(
    (g) =>
      `### ${g.group}\n\n${g.rows
        .map(
          ([name, , great, instead, sources]) =>
            `- **${name}.** Great at: ${great} Pick them instead when: ${instead} Source: ${sources.join(', ')} (as of ${AS_OF}).`,
        )
        .join('\n')}`,
  ).join('\n\n');

  return `# LogicPacks compared

As of ${AS_OF}. Competitor facts come from each product's own site on that date (source per row). "not documented" means their pages did not say, not that the product lacks it. If something here is out of date, tell us (contact below) and we will fix it.

LogicPacks is in public beta. What it adds is one layer: several people, each with their own agent on their own subscription, working in one project, with agents that message each other, guardrails on delegated work, shared host apps and human help on request. Most tools below are stronger at their own core, and LogicPacks works alongside several of them (Claude Code, Codex, Cursor and others run inside it).

## Table

${table}

## What each is great at, and when to pick them instead

${sections}

## Context and memory: packs, fine-tuning and memory layers

- **Fine-tuning** trains a model on your examples. It is tied to one model and one provider, and OpenAI's fine-tuning platform is closed to new users as of ${AS_OF} (https://developers.openai.com/api/docs/guides/model-optimization).
- **Memory layers** such as Mem0 store and retrieve facts for an agent through an API or MCP; Mem0 is open source (Apache-2.0) with a hosted free tier (https://mem0.ai/pricing).
- **LogicPacks packs** save how a team works (a session, its decisions, references and steps) and hand it to any agent or thread, whichever agent each person uses. No training, and no separate memory service to run. They are narrower than a memory layer: a pack is a curated handoff, not automatic recall.

## Where LogicPacks is weaker today

- Beta. The Mac app needs macOS 13 or later on Apple silicon; there is no Windows or iOS app yet. The web app is for code projects.
- App sharing is Beta and its latency and frame rate benchmarks are still pending ([/research.md](/research.md)); Parsec and Tuple are far more mature at streaming and pairing.
- No independent security certification is documented. What is in place and what is pending: [/research.md](/research.md) and [/safety.md](/safety.md).
- The freelancer network is new and small next to Upwork or Toptal.
- Single sign-on, admin controls and audit log, and your own cloud host are coming soon, not available ([/pricing.md](/pricing.md)).

Why teams pick LogicPacks: [/why.md](/why.md).`;
}
