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
    'yes: Claude Code and Codex in the Mac and Windows app; more through the helper',
    'yes: `lp ask`, `lp reply`, `lp send`',
    'Beta: goals, milestones, drift alerts, review',
    'Beta preview (scripted demo), not released',
    'Beta: vetted freelancers on request',
    'yes: open source (MIT), runs on your own machine; hosted Cloud coming soon',
    `${PRICING.individual.price} for individuals; ${PRICING.enterprise.price} ${PRICING.enterprise.per}`,
  ],
};

// [name, cells (8), great at, pick them instead when, sources]
const ROWS = [
  {
    group: 'Sharing one Claude Code session',
    rows: [
      ['Zed Delta (Claude Code multiplayer)', ['partial: a teammate joins a shared thread with `/delta share`; each uses their own Claude session with the shared conversation as context', 'partial: Delta Personal works with your own keys or external agents; which Claude account a joiner uses is not documented', ND, ND, ND, ND, 'not documented (Zed-hosted sync)', 'Personal free; Pro $10/mo'],
        'Handing a live Claude Code conversation and its uncommitted changes to a teammate, from Zed, an editor company. CLI in beta; multiplayer post dated 2026-10-27.',
        'You want to pass one Claude Code conversation to a teammate or pick it up together. LogicPacks is built for teams where each person runs their own agent, many agents work in parallel, and agents coordinate with each other.',
        ['https://delta.dev/blog/claude-code-multiplayer', 'https://zed.dev/blog/introducing-delta', 'https://github.com/zed-industries/delta-claude', 'https://delta.dev/pricing']],
      ['claude-duet', ['partial: two people in one Claude session', 'host only: runs on the host\'s machine and key', ND, 'partial: host approves the partner\'s prompts', ND, ND, 'yes: peer to peer, end-to-end encrypted', 'free (MIT)'],
        'Private two-person pairing on one Claude Code session with end-to-end encryption and no relay server.',
        'Two people want to share one session today, privately, at no cost.',
        ['https://github.com/EliranG/claude-duet']],
      ['claude-share (Paradigm-Study)', ['partial: up to 20 people in one host session', 'host only: a guest\'s own model is never called', ND, ND, ND, ND, 'partial: hosted relay or self-host on your Cloudflare account', 'free (MIT)'],
        'Bigger rooms (up to 20) around one Claude Code or Claude Desktop session, with shared previews and files.',
        'A group wants to watch and steer one session live. Encrypted in transit, not end to end.',
        ['https://github.com/Paradigm-Study/claude-share']],
      ['ccshare (now manycode)', ['partial: up to 5 people on one mirrored terminal', 'host only (agent runs on the host)', ND, ND, ND, ND, 'partial: self-hostable relay', 'free (MIT)'],
        'Join a live terminal session with a 6 character code, from a terminal or browser; works with any terminal agent.',
        'You want a quick no-install join to one terminal. The code is the only authentication.',
        ['https://github.com/unworld11/manycode', 'https://www.producthunt.com/products/ccshare']],
      ['Pair-Claude', ['partial: several people on one mirrored session', ND, ND, ND, ND, ND, 'yes: over your Tailscale network', 'free (MIT)'],
        'Terminal sharing for teams already on Tailscale, with read-only links.',
        'Your team is on Tailscale and wants to watch one session. Little activity since May 2026.',
        ['https://github.com/dxfrontier/Pair-Claude']],
    ],
  },
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

LogicPacks is open source like Zed: the collaborative workspace is MIT licensed (https://github.com/Tech-Realm/logicpacks). Cloud, Talent, Apps and Enterprise are hosted services.

LogicPacks is a company whose whole product is people and AI agents working together. Most tools below treat collaboration as one feature of something else: Zed builds an editor, Cursor an AI editor, Devin an autonomous agent, Tuple and Parsec screen sharing, Upwork a hiring marketplace. LogicPacks builds the shared workspace around whatever editor and agent each person already uses: each person brings their own agent and subscription, many agents work in parallel in one project, agents message each other and check for overlap before they start, goals and drift alerts keep delegated work on plan, an own-cloud option that keeps working when laptops close is coming soon, and sharing runs from the host's laptop today. It is at version 0.1.11; app sharing and the freelancer marketplace are Beta. Most tools below are stronger at their own core, and LogicPacks works alongside several of them (Claude Code, Codex, Cursor and others run inside it).

## Which to pick

- **Two people, one Claude Code session, today:** Zed Delta or claude-duet are fine and quick. They share one conversation; LogicPacks is more than you need.
- **A team with several people and several agents working in parallel over days:** LogicPacks. Each person keeps their own agent and subscription, agents coordinate (\`lp ask\`, \`lp who\`). Our cloud, which would keep going when a laptop closes, is coming soon; today the host's laptop must be on.
- **One person who wants the best AI editor:** Cursor (or Zed). Add LogicPacks when others join.
- **Hand a whole ticket to an autonomous agent:** Devin.
- **Live pairing with great video and remote control:** Tuple or Parsec.
- **Hiring at marketplace scale:** Upwork or Toptal.

## Table

${table}

## What each is great at, and when to pick them instead

${sections}

## Context and memory: fine-tuning and memory layers

- **Fine-tuning** trains a model on your examples. It is tied to one model and one provider, and OpenAI's fine-tuning platform is closed to new users as of ${AS_OF} (https://developers.openai.com/api/docs/guides/model-optimization).
- **Memory layers** such as Mem0 store and retrieve facts for an agent through an API or MCP; Mem0 is open source (Apache-2.0) with a hosted free tier (https://mem0.ai/pricing).
- **LogicPacks** does not train models or keep a separate memory service. Teammates and their agents see who is working on what, and share decisions and goals, whichever agent each person uses.

## Where LogicPacks is weaker today

- Young: version 0.1.12, with app sharing and the freelancer marketplace in Beta. The Mac app needs macOS 13 or later on Apple silicon; the Windows app (x64) is new in 0.1.12, is not code-signed yet and cannot host app sharing (that is macOS only); there is no Linux desktop or iOS app yet, and our cloud is coming soon. Sharing is host-based: teammates sync to the host's laptop while it is on.
- App sharing between people is a Beta preview, not generally released; its first latency and frame rate benchmarks were measured with the viewer on the same Mac, not over a network ([/research.md](/research.md)); Parsec and Tuple are far more mature at streaming and pairing.
- No independent security certification is documented. What is in place and what is pending: [/research.md](/research.md) and [/safety.md](/safety.md).
- The freelancer network is new and small next to Upwork or Toptal.
- Single sign-on, admin controls and audit log, and our cloud and your own cloud host are coming soon, not available ([/pricing.md](/pricing.md)).

Why teams pick LogicPacks: [/why.md](/why.md).`;
}
