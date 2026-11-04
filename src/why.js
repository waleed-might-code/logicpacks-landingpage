// /why.md: why a team would use LogicPacks, each point with the concrete how and a
// link to the page that backs it. Only claims the product makes good on today; Beta
// and pending items say so.
import benchmarks from '../research/benchmarks.json';
import { FRIEND_PATH, OPEN_SOURCE, PRICING, SHIPPED, TOOLS, WHERE } from './site';

const pendingStreaming = benchmarks.streaming.every((s) => s.metrics.every((m) => m.value == null));

export function whyMarkdown() {
  return `# Why LogicPacks

LogicPacks aims to be the easiest way for agents and several people to work together on one project. What that means in practice, point by point. For a side by side with other tools, see [/compare.md](/compare.md).

## Open source

${OPEN_SOURCE.message} Read, run or fork it: ${OPEN_SOURCE.repo} (${OPEN_SOURCE.license}).

## Code with a friend

${FRIEND_PATH.map((step, i) => `${i + 1}. ${step}`).join('\n')}

For a team, add more people the same way; each brings their own agent and subscription. How long this takes has not been measured yet.

## Bring your own agent

The app (Mac or Windows) uses the Claude Code or Codex CLI you already have installed and logged in, on your own subscription. Other agents (${TOOLS.slice(0, 4).map((t) => t.name).join(', ')}, Cursor and ${TOOLS.length - 5} more) connect through the helper. LogicPacks never stores or proxies model API keys ([/privacy.md](/privacy.md)), and it does not resell model usage, so there is no per-token markup: individuals are ${PRICING.individual.price.toLowerCase()}, teams that want more control pay ${PRICING.enterprise.price} ${PRICING.enterprise.per} ([/pricing.md](/pricing.md)). Setup is one prompt to your agent ([/setup.md](/setup.md)).

## One shared project for the whole team

Teammates join one project. Each person works with their own agent in their own thread, and everyone sees who is working on what (\`lp who\`, \`lp agents\`). Agents can message each other across people (\`lp ask\`, \`lp reply\`), and before an agent edits shared files it checks who is already on them (\`lp who <file>\`, \`lp editing\`), so overlap shows up before the work, not after. Conflicts come back as a negotiation the people decide.

## Guardrails for delegated work (Beta)

Hand work to a teammate, an outside team or an expert as a goal with milestones (\`lp goals plan\`, confirmed by you before anything is sent). Their agent reports progress on each milestone, drift is raised to the person who set the goal, and work waits for review and your decision (\`lp goals review\`, \`lp goals decide\`). You can message the thread or watch it live at any point.

## Your own apps, shared (Beta preview)

The plan: people and agents share the host machine's apps, from Blender to DaVinci Resolve, with a named cursor for each person and agent and snapshots that merge back. Today this is a preview, not a released feature: the demo on the site is scripted, and sharing apps between people is not generally available yet. Nothing in the core product needs access to your machine. What works today is app recipes in the desktop app, which let your own agent drive an app on your own computer (Blender in preview). Latency and frame rate benchmarks are ${pendingStreaming ? 'still pending' : 'published'} in [/research.md](/research.md).

## Request help from a person (Beta)

When an agent is not enough, request a freelancer vetted by LogicPacks. They bring their own Claude and tools, so they use none of your tokens; you pay for their hours with their AI included. They join only the project you request help in, work under NDA, and you end their access with one action (\`lp assist end\`). In that project, secret files such as \`.env\` and keys are hidden from them and secrets pasted into threads are redacted, and milestones keep their work on plan ([/safety.md](/safety.md) section 6). Details: [/new.md](/new.md).

## Delivered with it

Real projects built with LogicPacks: ${SHIPPED.map((s) => `${s.title} (${s.kind}${s.client && s.client !== 'Our own product' ? `, ${s.client}` : ''})`).join('; ')}. They are not public links yet; descriptions are in [/story.md](/story.md).

## Runs where you want

${WHERE.map((w) => `- **${w.title}${w.soon ? ' (coming soon)' : ''}.** ${w.body}`).join('\n')}

Today everything runs on your machine; our cloud is coming soon and is not available. What the setup changes on your computer and how to undo it: [/safety.md](/safety.md).`;
}
