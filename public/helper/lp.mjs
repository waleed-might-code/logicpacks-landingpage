#!/usr/bin/env node

import * as NodeFS from "node:fs";
import * as NodePath from "node:path";
import * as NodeOS from "node:os";
import * as NodeCrypto from "node:crypto";
import * as NodeChildProcess from "node:child_process";
import * as NodeReadline from "node:readline";
// src/events.ts
const emptyParserState = () => ({
	meta: {
		sessionId: null,
		cwd: null,
		model: null,
		branch: null
	},
	pendingTools: {},
	modernCodex: false
});
const MAX_PENDING_TOOLS = 200;
const rememberTool = (state, id, tool) => {
	state.pendingTools[id] = tool;
	const ids = Object.keys(state.pendingTools);
	for (const stale of ids.slice(0, Math.max(0, ids.length - MAX_PENDING_TOOLS))) delete state.pendingTools[stale];
};
/** Keeps the start and end of long output, which is where commands report what happened. */
const summarize = (text, max = 1500) => {
	const trimmed = text.replace(/\r\n/g, "\n").trim();
	if (trimmed.length <= max) return trimmed;
	const lines = trimmed.split("\n").length;
	return `${trimmed.slice(0, Math.floor(max * .65))}\n… (${lines} lines, trimmed) …\n${trimmed.slice(-Math.floor(max * .3))}`;
};
const oneLine = (text, max = 300) => {
	const line = text.replace(/\s+/g, " ").trim();
	return line.length <= max ? line : `${line.slice(0, max - 1)}…`;
};
const asRecord = (value) => value !== null && typeof value === "object" && !Array.isArray(value) ? value : null;
const asString = (value) => typeof value === "string" ? value : null;
const parseJsonLine = (text) => {
	try {
		return asRecord(JSON.parse(text));
	} catch {
		return null;
	}
};
// src/harnesses.ts
const AGENTS_MD = {
	kind: "block",
	path: "AGENTS.md"
};
const LOGICPACKS_RULE_FILE = "logicpacks.md";
const HARNESSES = [
	{
		id: "claude",
		name: "Claude Code",
		global: {
			kind: "block",
			path: {
				unix: "$CLAUDE_CONFIG_DIR|~/.claude/CLAUDE.md",
				windows: "~\\.claude\\CLAUDE.md"
			}
		},
		project: {
			kind: "block",
			path: "CLAUDE.md"
		},
		format: "markdown",
		shell: true,
		mcp: true,
		mcpConfig: "~/.claude.json (user scope) or .mcp.json (project)",
		docs: ["https://code.claude.com/docs/en/memory", "https://code.claude.com/docs/en/mcp"]
	},
	{
		id: "codex",
		name: "Codex CLI",
		global: {
			kind: "block",
			path: { unix: "$CODEX_HOME|~/.codex/AGENTS.md" }
		},
		project: AGENTS_MD,
		format: "markdown",
		shell: true,
		mcp: true,
		mcpConfig: "~/.codex/config.toml [mcp_servers.<name>]",
		docs: ["https://learn.chatgpt.com/docs/agent-configuration/agents-md", "https://learn.chatgpt.com/docs/extend/mcp?surface=cli"],
		notes: "An AGENTS.override.md next to it wins over AGENTS.md; LogicPacks writes AGENTS.md."
	},
	{
		id: "opencode",
		name: "OpenCode",
		global: {
			kind: "block",
			path: { unix: "~/.config/opencode/AGENTS.md" }
		},
		project: AGENTS_MD,
		format: "markdown",
		shell: true,
		mcp: true,
		mcpConfig: "the `mcp` key in opencode.json",
		docs: ["https://opencode.ai/docs/rules/"]
	},
	{
		id: "gemini",
		name: "Gemini CLI",
		global: {
			kind: "block",
			path: { unix: "~/.gemini/GEMINI.md" }
		},
		project: {
			kind: "block",
			path: "GEMINI.md"
		},
		format: "markdown",
		shell: true,
		mcp: true,
		mcpConfig: "mcpServers in ~/.gemini/settings.json",
		docs: ["https://geminicli.com/docs/cli/gemini-md/", "https://geminicli.com/docs/tools/mcp-server/"]
	},
	{
		id: "command-code",
		name: "Command Code",
		global: {
			kind: "block",
			path: { unix: "~/.commandcode/AGENTS.md" }
		},
		project: AGENTS_MD,
		format: "markdown",
		shell: true,
		mcp: true,
		mcpConfig: "~/.commandcode/mcp.json",
		docs: ["https://commandcode.ai/docs/memory", "https://commandcode.ai/docs/mcp"],
		notes: "commandcode.ai, CLI `cmd` (npm i -g command-code)."
	},
	{
		id: "zai",
		name: "Z.ai GLM Coding Plan",
		via: "claude",
		global: {
			kind: "block",
			path: {
				unix: "$CLAUDE_CONFIG_DIR|~/.claude/CLAUDE.md",
				windows: "~\\.claude\\CLAUDE.md"
			}
		},
		project: {
			kind: "block",
			path: "CLAUDE.md"
		},
		format: "markdown",
		shell: true,
		mcp: true,
		docs: ["https://docs.z.ai/devpack/overview"],
		notes: "A model plan, not a harness: it runs inside Claude Code (or OpenCode, Cline, Codex...). Set up the harness you run GLM in; this target is Claude Code's."
	},
	{
		id: "cursor",
		name: "Cursor",
		global: {
			kind: "ui",
			steps: ["Open Cursor Settings, then Rules (Customize > Rules).", "Under User Rules, add a rule and paste the LogicPacks block (lp setup-block prints it)."]
		},
		project: {
			kind: "file",
			path: ".cursor/rules/logicpacks.mdc",
			frontmatter: "---\ndescription: LogicPacks team collaboration through the lp CLI\nalwaysApply: true\n---\n"
		},
		format: "mdc",
		shell: true,
		mcp: true,
		mcpConfig: "~/.cursor/mcp.json",
		docs: ["https://cursor.com/docs/context/rules", "https://cursor.com/docs/context/mcp"],
		notes: "User Rules live in the app only. Cursor also reads a root AGENTS.md."
	},
	{
		id: "copilot",
		name: "VS Code + GitHub Copilot",
		global: {
			kind: "block",
			path: { unix: "~/.copilot/copilot-instructions.md" }
		},
		project: {
			kind: "block",
			path: ".github/copilot-instructions.md"
		},
		format: "markdown",
		shell: true,
		mcp: true,
		mcpConfig: ".vscode/mcp.json (unverified)",
		docs: ["https://code.visualstudio.com/docs/copilot/customization/custom-instructions"],
		notes: "Personal *.instructions.md files go in ~/.copilot/instructions; AGENTS.md is read too (chat.useAgentsMdFile)."
	},
	{
		id: "windsurf",
		name: "Windsurf",
		global: {
			kind: "block",
			path: { unix: "~/.devin/global_rules.md" }
		},
		project: AGENTS_MD,
		format: "markdown",
		shell: true,
		mcp: true,
		docs: ["https://docs.devin.ai/desktop/cascade/memories"],
		notes: "Older installs read ~/.codeium/windsurf/memories/global_rules.md; pass --file for that one."
	},
	{
		id: "cline",
		name: "Cline",
		global: {
			kind: "file",
			path: {
				unix: `~/Documents/Cline/Rules/${LOGICPACKS_RULE_FILE}`,
				windows: `~\\Documents\\Cline\\Rules\\${LOGICPACKS_RULE_FILE}`
			}
		},
		project: {
			kind: "file",
			path: `.clinerules/${LOGICPACKS_RULE_FILE}`
		},
		format: "markdown",
		shell: true,
		mcp: true,
		docs: ["https://docs.cline.bot/customization/cline-rules"]
	},
	{
		id: "roo",
		name: "Roo Code",
		global: {
			kind: "file",
			path: {
				unix: `~/.roo/rules/${LOGICPACKS_RULE_FILE}`,
				windows: `~\\.roo\\rules\\${LOGICPACKS_RULE_FILE}`
			}
		},
		project: {
			kind: "file",
			path: `.roo/rules/${LOGICPACKS_RULE_FILE}`
		},
		format: "markdown",
		shell: true,
		mcp: true,
		docs: ["https://roocodeinc.github.io/Roo-Code/features/custom-instructions"]
	},
	{
		id: "kilo",
		name: "Kilo Code",
		global: {
			kind: "ui",
			steps: ["Open ~/.config/kilo/kilo.jsonc (Kilo Code settings).", `Add the rules file to "instructions", e.g. "instructions": ["~/.logicpacks/rules/${LOGICPACKS_RULE_FILE}"] (lp setup --agent kilo writes that file).`]
		},
		project: {
			kind: "file",
			path: `.kilo/rules/${LOGICPACKS_RULE_FILE}`
		},
		format: "markdown",
		shell: true,
		mcp: true,
		docs: ["https://kilo.ai/docs/customize/custom-rules"],
		notes: "Global rules are listed in kilo.jsonc `instructions`; LogicPacks does not edit JSONC."
	},
	{
		id: "zed",
		name: "Zed",
		global: {
			kind: "block",
			path: {
				unix: "~/.config/zed/AGENTS.md",
				windows: "~\\AppData\\Roaming\\Zed\\AGENTS.md"
			}
		},
		project: {
			kind: "block",
			path: ".rules"
		},
		format: "markdown",
		shell: true,
		mcp: true,
		docs: ["https://github.com/zed-industries/zed/blob/main/docs/src/ai/rules.md"]
	},
	{
		id: "continue",
		name: "Continue",
		global: {
			kind: "ui",
			steps: ["Continue's docs name no global rules file; LogicPacks writes .continue/rules/logicpacks.md in this project.", "For every project, add the block as a rule in your Continue config (Hub or config.yaml `rules:`)."]
		},
		project: {
			kind: "file",
			path: `.continue/rules/${LOGICPACKS_RULE_FILE}`,
			frontmatter: "---\nname: LogicPacks\nalwaysApply: true\n---\n"
		},
		format: "markdown",
		shell: true,
		mcp: true,
		docs: ["https://docs.continue.dev/customize/deep-dives/rules"]
	},
	{
		id: "aider",
		name: "Aider",
		global: {
			kind: "yaml-read",
			config: { unix: "~/.aider.conf.yml" },
			rules: { unix: `~/.logicpacks/rules/${LOGICPACKS_RULE_FILE}` }
		},
		project: {
			kind: "block",
			path: "CONVENTIONS.md"
		},
		format: "yaml",
		shell: false,
		mcp: false,
		docs: ["https://aider.chat/docs/usage/conventions.html", "https://aider.chat/docs/config/aider_conf.html"],
		notes: "Aider is not an agent loop: it asks you before running a command. Run the lp commands it suggests yourself."
	},
	{
		id: "amp",
		name: "Amp",
		global: {
			kind: "block",
			path: { unix: "~/.config/amp/AGENTS.md" }
		},
		project: AGENTS_MD,
		format: "markdown",
		shell: true,
		mcp: true,
		mcpConfig: "amp.mcpServers in settings.json",
		docs: ["https://ampcode.com/manual"]
	},
	{
		id: "warp",
		name: "Warp",
		global: {
			kind: "ui",
			steps: ["In Warp, open Warp Drive > Personal > Rules (or Settings > AI > Knowledge > Manage Rules).", "Add a Global rule and paste the LogicPacks block (lp setup-block prints it)."]
		},
		project: AGENTS_MD,
		format: "markdown",
		shell: true,
		mcp: true,
		docs: ["https://docs.warp.dev/knowledge-and-collaboration/rules"]
	},
	{
		id: "kiro",
		name: "Kiro",
		global: {
			kind: "file",
			path: { unix: `~/.kiro/steering/${LOGICPACKS_RULE_FILE}` },
			frontmatter: "---\ninclusion: always\n---\n"
		},
		project: {
			kind: "file",
			path: `.kiro/steering/${LOGICPACKS_RULE_FILE}`,
			frontmatter: "---\ninclusion: always\n---\n"
		},
		format: "markdown",
		shell: true,
		mcp: true,
		mcpConfig: "~/.kiro/settings/mcp.json",
		docs: ["https://kiro.dev/docs/steering/", "https://kiro.dev/docs/mcp/configuration/"]
	},
	{
		id: "goose",
		name: "Goose",
		global: {
			kind: "block",
			path: { unix: "~/.config/goose/.goosehints" }
		},
		project: {
			kind: "block",
			path: ".goosehints"
		},
		format: "markdown",
		shell: true,
		mcp: true,
		docs: ["https://goose-docs.ai/docs/guides/context-engineering/using-goosehints/"],
		notes: "Hints need the Developer extension, which is also what runs shell commands."
	},
	{
		id: "qwen",
		name: "Qwen Code",
		global: {
			kind: "block",
			path: { unix: "~/.qwen/QWEN.md" }
		},
		project: {
			kind: "block",
			path: "QWEN.md"
		},
		format: "markdown",
		shell: true,
		mcp: true,
		mcpConfig: "mcpServers in ~/.qwen/settings.json",
		docs: ["https://github.com/QwenLM/qwen-code/blob/main/docs/users/features/memory.md"]
	},
	{
		id: "crush",
		name: "Crush",
		global: {
			kind: "block",
			path: { unix: "~/.config/crush/CRUSH.md" }
		},
		project: AGENTS_MD,
		format: "markdown",
		shell: true,
		mcp: true,
		mcpConfig: "the `mcp` key in crush.json",
		docs: ["https://github.com/charmbracelet/crush"]
	},
	{
		id: "droid",
		name: "Factory Droid",
		global: {
			kind: "block",
			path: { unix: "~/.factory/AGENTS.md" }
		},
		project: AGENTS_MD,
		format: "markdown",
		shell: true,
		mcp: true,
		docs: ["https://docs.factory.com/cli/configuration/agents-md"],
		notes: "The docs say Droid looks in ~/.factory/; the exact global file name is unverified."
	},
	{
		id: "junie",
		name: "JetBrains Junie",
		global: {
			kind: "block",
			path: {
				unix: "~/.junie/AGENTS.md",
				windows: "~\\.junie\\AGENTS.md"
			}
		},
		project: {
			kind: "block",
			path: ".junie/AGENTS.md"
		},
		format: "markdown",
		shell: true,
		mcp: true,
		mcpConfig: "~/.junie/mcp/mcp.json",
		docs: ["https://junie.jetbrains.com/docs/guidelines-and-memory.html", "https://junie.jetbrains.com/docs/junie-cli-mcp-configuration.html"],
		notes: "Older projects use .junie/guidelines.md, which Junie still reads."
	},
	{
		id: "hermes",
		name: "Hermes Agent",
		global: {
			kind: "ui",
			steps: ["Hermes has no global instructions file (~/.hermes/SOUL.md is persona only).", "LogicPacks writes the block into this project's AGENTS.md, which Hermes reads."]
		},
		project: AGENTS_MD,
		format: "markdown",
		shell: true,
		mcp: true,
		docs: ["https://hermes-agent.nousresearch.com/docs/user-guide/features/context-files"]
	},
	{
		id: "t3code",
		name: "T3 Code",
		global: {
			kind: "ui",
			steps: ["T3 Code runs the agents you have installed (Codex, Claude Code, OpenCode...) and has no file of its own.", "Set up each of those (lp setup --agent codex, --agent claude...); LogicPacks also writes this project's AGENTS.md."]
		},
		project: AGENTS_MD,
		format: "markdown",
		shell: true,
		mcp: true,
		docs: ["https://github.com/pingdotgg/t3code"]
	},
	{
		id: "generic",
		name: "Any other agent",
		global: {
			kind: "ui",
			steps: ["Pass the file your agent reads its instructions from: lp setup --agent generic --file <path>.", "Without --file, LogicPacks writes this project's AGENTS.md, which most agents read."]
		},
		project: AGENTS_MD,
		format: "markdown",
		shell: true,
		mcp: true,
		docs: ["https://agents.md"]
	}
];
const ALIASES = {
	"claude-code": "claude",
	"codex-cli": "codex",
	"gemini-cli": "gemini",
	commandcode: "command-code",
	commandai: "command-code",
	"z.ai": "zai",
	glm: "zai",
	"vscode-copilot": "copilot",
	vscode: "copilot",
	"github-copilot": "copilot",
	"roo-code": "roo",
	"kilo-code": "kilo",
	"factory-droid": "droid",
	factory: "droid",
	"qwen-code": "qwen",
	"hermes-agent": "hermes",
	"t3-code": "t3code",
	t3: "t3code",
	other: "generic",
	custom: "generic"
};
const findHarness = (id) => {
	const key = id.trim().toLowerCase();
	const resolved = ALIASES[key] ?? key;
	return HARNESSES.find((harness) => harness.id === resolved) ?? null;
};
/** `~`, `$VAR|fallback` and the OS separator, for `platform`. */
const resolveOsPath = (paths, options) => {
	const windows = options.platform === "win32";
	const raw = windows && paths.windows !== void 0 ? paths.windows : paths.unix;
	const sep = windows ? "\\" : "/";
	const variable = /^\$([A-Z_]+)\|(.*)$/.exec(raw);
	if (variable !== null) {
		const value = options.env[variable[1]];
		const rest = variable[2];
		if (value) {
			const fileName = rest.split(/[\\/]/).at(-1);
			return `${value.replace(/[\\/]+$/, "")}${sep}${fileName}`;
		}
		return resolveOsPath({
			unix: rest,
			...paths.windows ? { windows: rest } : {}
		}, options);
	}
	const expanded = raw === "~" || raw.startsWith("~/") || raw.startsWith("~\\") ? `${options.home}${raw.slice(1)}` : raw;
	return windows ? expanded.replaceAll("/", "\\") : expanded;
};
// src/connectText.ts
/**
* The words an outside agent gets: the short block for its global instructions, the
* prompt a person pastes into any agent, and setup.md. One source for the CLI, the
* server's /setup.md and the landing page.
*/
const SETUP_URL = "https://logicpacks.io/setup.md";
/** The global block: intents to `lp` commands. Kept short on purpose (about 20 lines). */
const globalBlockBody = (projectTitle = null) => [
	`## LogicPacks${projectTitle ? `: ${projectTitle}` : ""}`,
	`Team work runs through the \`lp\` command (add \`--json\` to parse its output). If \`lp\` is missing, follow ${SETUP_URL}.`,
	"- At the start of a session and after long tasks, run `lp inbox` and tell the user what is new (messages, questions from other agents, conflicts, drift, review requests).",
	"- \"share this project\" / \"create a shared session\" -> `lp share`, then give the user the invite link.",
	"- \"add my friend X\" / \"invite X\" -> `lp invite <email or name>`.",
	"- \"what is X working on\" -> `lp who X`; \"who is working right now\" -> `lp agents` (`--workspace` for every project).",
	"- \"tell X ...\" -> `lp send X \"<message>\"`.",
	"- To coordinate with a teammate's agent, use `lp ask <person> \"<question>\"` and `lp reply <id> \"<answer>\"`; check `lp inbox` for questions from other agents and answer them.",
	"- \"request assistance\" / \"get an expert\" -> `lp assist request \"<brief>\"`.",
	"- \"set goals\" / \"ask X to do Y by Friday\" -> `lp goals plan \"<goal>\" \"<person>: <task> by <day>\" ...`; your user confirms with `lp goals confirm <id>`. Milestones for you arrive in `lp inbox`: `lp goals start|done <id>`.",
	"- \"save this as a pack\" -> `lp packs save \"<name>\"`; `lp packs list`, `lp packs use <id>`.",
	"- Before you edit shared files, run `lp who <file or topic>`; if a teammate is on it, tell the user first.",
	"- On a conflict or negotiation in `lp inbox`, answer with `lp reply <id>`; when it needs a person, ask the user, then `lp decide <id> mine|theirs|both`.",
	"- If you cannot run shell commands, ask the user to run the `lp` command, or use the `logicpacks` MCP tools if they are set up.",
	`- Everything else: \`lp help agents\` or ${SETUP_URL}. \`lp uninstall\` removes this block.`
].join("\n");
/** What a person pastes into any agent. */
const setupPrompt = (variant = "new") => variant === "new" ? [
	`Set up LogicPacks for me: read ${SETUP_URL} and follow it.`,
	"Install the helper, log me in, and add the LogicPacks block to your global instructions.",
	"Then share this project and give me an invite link."
].join("\n") : [
	"LogicPacks is already set up here (the lp command is installed).",
	"Add this project to LogicPacks with lp share and give me the invite link.",
	`If anything is missing, read ${SETUP_URL} and follow it.`
].join("\n");
/** Every command an agent may run, in the order setup.md and `lp help agents` list them. */
const AGENT_COMMANDS = [
	{
		usage: "lp login [--host <url>] [--start | --finish]",
		does: "sign in with a device code (default host app.logicpacks.io)"
	},
	{
		usage: "lp whoami",
		does: "who you are signed in as, and on which host"
	},
	{
		usage: "lp projects",
		does: "the projects you can open"
	},
	{
		usage: "lp share [--title <name>]",
		does: "share this folder: push it to its git remote (GitHub) and register it on the host; prints an invite link"
	},
	{
		usage: "lp invite <email|name>",
		does: "add someone to this project, or print the invite link to send them"
	},
	{
		usage: "lp join <invite link>",
		does: "accept an invite link from a teammate"
	},
	{
		usage: "lp members",
		does: "who is in this project"
	},
	{
		usage: "lp who [person|file|topic]",
		does: "who is working on what in this project"
	},
	{
		usage: "lp agents [--workspace]",
		does: "active agents and sessions: person, harness, thread, current task"
	},
	{
		usage: "lp send <person> \"<message>\"",
		does: "message a teammate's thread; no reply expected"
	},
	{
		usage: "lp ask <person> \"<question>\" [--project <id|name>]",
		does: "ask a teammate's agent; the reply comes back to your lp inbox"
	},
	{
		usage: "lp reply <id> \"<text>\"",
		does: "answer a message, question or negotiation from lp inbox"
	},
	{
		usage: "lp decide <negotiation id> accept|mine|theirs|both",
		does: "record your user's decision on a merge negotiation"
	},
	{
		usage: "lp inbox [--follow] [--all]",
		does: "messages, questions, conflicts, negotiations, drift and review requests for you"
	},
	{
		usage: "lp editing <file...>",
		does: "tell teammates which files you are changing (lp who shows it; overlaps raise a notice)"
	},
	{
		usage: "lp done <id>",
		does: "dismiss an inbox item you handled"
	},
	{
		usage: "lp assist request \"<brief>\" [--expert <id>]",
		does: "Request assistance: bring in an expert (beta)"
	},
	{
		usage: "lp assist experts | list | end <request id>",
		does: "the expert catalog, this project's requests, end a request"
	},
	{
		usage: "lp packs save \"<name>\" | list | use <id> [--to <person>]",
		does: "save this session as a pack, list packs, hand one to a thread"
	},
	{
		usage: "lp goals plan \"<goal>\" \"<person>: <task> [by <day>]\"...",
		does: "draft a goal with milestones for people or experts (beta); nothing is sent yet"
	},
	{
		usage: "lp goals list | show <id> | confirm <goal> | cancel <goal>",
		does: "see goals; confirm a draft (sends the milestones) once your user agrees"
	},
	{
		usage: "lp goals start|blocked|done <milestone> [--note \"<text>\"]",
		does: "report on a milestone assigned to you"
	},
	{
		usage: "lp goals review | decide <id> <action> [--note]",
		does: "drift and review requests waiting for your user, and their decision"
	},
	{
		usage: "lp setup --agent <id> [--file <path>] [--project]",
		does: "write the LogicPacks block into an agent's instructions"
	},
	{
		usage: "lp setup-prompt [--installed]",
		does: "print the prompt to paste into any agent"
	},
	{
		usage: "lp status | lp watch | lp link | lp unlink",
		does: "stream Claude Code and Codex sessions into the project"
	},
	{
		usage: "lp mcp",
		does: "the optional MCP server (stdio)"
	},
	{
		usage: "lp uninstall",
		does: "remove every LogicPacks block, rules file, hook and MCP registration"
	}
];
const pad = (text, width) => text.padEnd(width);
const agentsHelp = () => {
	const width = Math.max(...AGENT_COMMANDS.map((command) => command.usage.length)) + 2;
	return [
		"LogicPacks for agents. Every command prints readable text; add --json for machine output.",
		"",
		...AGENT_COMMANDS.map((command) => `  ${pad(command.usage, width)}${command.does}`),
		"",
		`Setup guide: ${SETUP_URL}`
	].join("\n");
};
// src/store.ts
/** Everything the helper keeps lives here; LP_HELPER_HOME moves it (tests, several accounts). */
const helperHome = () => process.env.LP_HELPER_HOME || NodePath.join(NodeOS.homedir(), ".logicpacks", "helper");
const claudeHome = () => process.env.CLAUDE_CONFIG_DIR || NodePath.join(NodeOS.homedir(), ".claude");
const codexHome = () => process.env.CODEX_HOME || NodePath.join(NodeOS.homedir(), ".codex");
const defaultDevice = () => NodeOS.hostname().replace(/\.local$/, "") || null;
const readJson = (file) => {
	try {
		return JSON.parse(NodeFS.readFileSync(file, "utf8"));
	} catch {
		return null;
	}
};
/** Write-then-rename, so a hook killed mid-write never leaves half a file behind. */
const writeJson = (file, value, mode = 384) => {
	NodeFS.mkdirSync(NodePath.dirname(file), { recursive: true });
	const temp = `${file}.${process.pid}.${NodeCrypto.randomBytes(4).toString("hex")}.tmp`;
	NodeFS.writeFileSync(temp, `${JSON.stringify(value, null, 2)}\n`, { mode });
	NodeFS.renameSync(temp, file);
};
const configFile = () => NodePath.join(helperHome(), "config.json");
const loadConfig = () => {
	const stored = readJson(configFile()) ?? {};
	return {
		server: stored.server ?? null,
		token: stored.token ?? null,
		who: stored.who ?? null,
		paused: stored.paused ?? false,
		unlinked: stored.unlinked ?? [],
		since: stored.since ?? (/* @__PURE__ */ new Date()).toISOString(),
		device: stored.device ?? defaultDevice(),
		pending: stored.pending ?? null,
		harness: stored.harness ?? null
	};
};
const saveConfig = (config) => writeJson(configFile(), config);
const isUnlinked = (config, folder) => folder !== null && config.unlinked.some((root) => folder === root || folder.startsWith(`${root.replace(/\/+$/, "")}/`));
const fileKey = (file) => NodeCrypto.createHash("sha1").update(file).digest("hex").slice(0, 20);
const stateFile$1 = (file) => NodePath.join(helperHome(), "state", `${fileKey(file)}.json`);
const loadTranscriptState = (file, source) => readJson(stateFile$1(file)) ?? {
	source,
	file,
	offset: 0,
	parser: emptyParserState(),
	link: null
};
const saveTranscriptState = (state) => writeJson(stateFile$1(state.file), state);
const LOCK_STALE_MS = 6e4;
/**
* One sync per transcript at a time. A caller that finds the lock taken leaves a
* rerun mark instead, and the holder makes one more pass before it lets go.
*/
const withTranscriptLock = async (file, run) => {
	const dir = NodePath.join(helperHome(), "locks");
	NodeFS.mkdirSync(dir, { recursive: true });
	const lock = NodePath.join(dir, `${fileKey(file)}.lock`);
	const rerun = `${lock}.rerun`;
	try {
		NodeFS.writeFileSync(lock, String(process.pid), { flag: "wx" });
	} catch {
		if (Date.now() - (NodeFS.statSync(lock, { throwIfNoEntry: false })?.mtimeMs ?? 0) < LOCK_STALE_MS) {
			NodeFS.writeFileSync(rerun, "");
			return;
		}
		NodeFS.writeFileSync(lock, String(process.pid));
	}
	try {
		for (let pass = 0; pass < 5; pass += 1) {
			NodeFS.rmSync(rerun, { force: true });
			await run();
			if (!NodeFS.existsSync(rerun)) break;
		}
	} finally {
		NodeFS.rmSync(lock, { force: true });
	}
};
const queueDir = () => NodePath.join(helperHome(), "queue");
const MAX_QUEUE_FILES = 5e3;
/** Batches the host could not take yet, sent in order once it answers again. */
const enqueue = (batch) => {
	NodeFS.mkdirSync(queueDir(), { recursive: true });
	const name = `${String(Date.now()).padStart(15, "0")}-${process.pid}-${NodeCrypto.randomBytes(3).toString("hex")}.json`;
	writeJson(NodePath.join(queueDir(), name), batch);
	const files = queuedFiles();
	for (const stale of files.slice(0, Math.max(0, files.length - MAX_QUEUE_FILES))) NodeFS.rmSync(stale, { force: true });
};
const queuedFiles = () => {
	try {
		return NodeFS.readdirSync(queueDir()).filter((name) => name.endsWith(".json")).sort().map((name) => NodePath.join(queueDir(), name));
	} catch {
		return [];
	}
};
const readQueued = (file) => readJson(file);
// src/agents.ts
/**
* Registers `lp mcp` with Codex and Claude Code, and keeps the LogicPacks
* rules in a project's AGENTS.md. Every edit touches only what the helper
* owns: one TOML table, one JSON key, one marked block.
*/
const MCP_NAME = "logicpacks";
const tomlString = (value) => JSON.stringify(value);
const HEADER = /^\s*\[\s*mcp_servers\s*\.\s*(?:logicpacks|"logicpacks"|'logicpacks')(\s*\.[^\]]*)?\s*\]\s*(#.*)?$/;
const ANY_HEADER = /^\s*\[/;
const OTHER_FORM = /^\s*(?:logicpacks|"logicpacks"|'logicpacks')\s*=|^\s*mcp_servers\s*\.\s*logicpacks\s*[.=]/;
const codexTable = (launch) => [
	`[mcp_servers.${MCP_NAME}]`,
	"# Added by the LogicPacks helper (lp install); lp uninstall removes this table.",
	`command = ${tomlString(launch.command)}`,
	`args = [${launch.args.map(tomlString).join(", ")}]`
];
/** The [start, end) line ranges of our table and its subtables. */
const ownRanges = (lines) => {
	const ranges = [];
	for (let index = 0; index < lines.length; index += 1) {
		if (!HEADER.test(lines[index])) continue;
		let end = index + 1;
		while (end < lines.length && !ANY_HEADER.test(lines[end])) end += 1;
		while (end > index + 1 && lines[end - 1].trim() === "") end -= 1;
		ranges.push([index, end]);
		index = end - 1;
	}
	return ranges;
};
/**
* Adds, updates (`launch`) or removes (`null`) the [mcp_servers.logicpacks]
* table in Codex's config.toml text. Every other byte stays as it was; adding
* then removing gives back the original text.
*/
const withCodexMcp = (text, launch) => {
	const lines = text.split("\n");
	const ranges = ownRanges(lines);
	if (ranges.length === 0) {
		if (lines.some((line) => OTHER_FORM.test(line))) throw new Error("config.toml defines the logicpacks MCP server in another form; left it unchanged.");
		if (launch === null) return text;
		return `${text}${text.length === 0 ? "" : text.endsWith("\n") ? "\n" : "\n\n"}${codexTable(launch).join("\n")}\n`;
	}
	const next = [];
	let cursor = 0;
	ranges.forEach(([start, end], position) => {
		let keepUntil = start;
		if (launch === null && keepUntil > cursor && lines[keepUntil - 1].trim() === "") keepUntil -= 1;
		next.push(...lines.slice(cursor, keepUntil));
		if (launch !== null && position === 0) next.push(...codexTable(launch));
		cursor = end;
	});
	next.push(...lines.slice(cursor));
	return next.join("\n");
};
const codexConfigFile = () => NodePath.join(codexHome(), "config.toml");
/** Edits Codex's config.toml in place (write-then-rename). Returns the file, or null when nothing changed. */
const writeCodexMcp = (launch) => {
	const file = codexConfigFile();
	const exists = NodeFS.existsSync(file);
	if (!exists && launch === null) return null;
	const before = exists ? NodeFS.readFileSync(file, "utf8") : "";
	const after = withCodexMcp(before, launch);
	if (after === before) return null;
	NodeFS.mkdirSync(NodePath.dirname(file), { recursive: true });
	const temp = `${file}.lp-${process.pid}.tmp`;
	const mode = exists ? NodeFS.statSync(file).mode & 511 : 384;
	NodeFS.writeFileSync(temp, after, { mode });
	NodeFS.renameSync(temp, file);
	return file;
};
const codexMcpInstalled = () => {
	try {
		return ownRanges(NodeFS.readFileSync(codexConfigFile(), "utf8").split("\n")).length > 0;
	} catch {
		return false;
	}
};
/** Claude Code keeps user-scope MCP servers in ~/.claude.json (or $CLAUDE_CONFIG_DIR/.claude.json). */
const claudeUserConfigFile = () => process.env.CLAUDE_CONFIG_DIR ? NodePath.join(claudeHome(), ".claude.json") : NodePath.join(NodeOS.homedir(), ".claude.json");
const withClaudeMcp = (settings, launch) => {
	const servers = { ...asRecord(settings.mcpServers) };
	if (launch === null) delete servers[MCP_NAME];
	else servers[MCP_NAME] = {
		type: "stdio",
		command: launch.command,
		args: [...launch.args],
		env: {}
	};
	const next = { ...settings };
	if (Object.keys(servers).length > 0) next.mcpServers = servers;
	else delete next.mcpServers;
	return next;
};
/** Adds or removes the user-scope `logicpacks` MCP server. Refuses a file it cannot parse. */
const writeClaudeMcp = (launch) => {
	const file = claudeUserConfigFile();
	if (!NodeFS.existsSync(file)) {
		if (launch === null) return null;
		writeJson(file, withClaudeMcp({}, launch), 384);
		return file;
	}
	const parsed = asRecord(JSON.parse(NodeFS.readFileSync(file, "utf8")));
	if (parsed === null) throw new Error(`${file} is not a JSON object; left it unchanged.`);
	const had = asRecord(parsed.mcpServers)?.[MCP_NAME] !== void 0;
	if (launch === null && !had) return null;
	writeJson(file, withClaudeMcp(parsed, launch), NodeFS.statSync(file).mode & 511);
	return file;
};
const AGENTS_START = "<!-- logicpacks:start -->";
const AGENTS_END = "<!-- logicpacks:end -->";
/**
* The project AGENTS.md block `lp link` keeps: the same intents-to-commands block as an
* agent's global instructions (connectText.ts), named for the project, plus the MCP tools.
*/
const agentsBlockBody = (projectTitle) => [
	globalBlockBody(projectTitle),
	"- With the `logicpacks` MCP tools: `who_is_working_on` before you start, `send_to_thread` / `ask` / `reply` to talk to other threads, `conflicts` and `propose_merge` on a conflict, `note` for your goal and decisions.",
	"- When your user asks teammates to do work (\"ask Omar to do X by Friday\"), draft it with `goal_plan`; your user confirms it in LogicPacks. If a milestone is assigned to you, stay inside its scope and report with `goal_update`.",
	"",
	"LogicPacks keeps only the text between these markers up to date; edit anything outside them freely."
].join("\n");
/** Writes (`body`) or removes (`null`) the marked block, leaving the rest of the file untouched. */
const withAgentsBlock = (text, body) => {
	const start = text.indexOf(AGENTS_START);
	const end = start < 0 ? -1 : text.indexOf(AGENTS_END, start);
	if (start >= 0 && end >= 0) {
		const tail = end + 23;
		if (body !== null) return `${text.slice(0, start)}${AGENTS_START}\n${body}\n${text.slice(end)}`;
		let from = start;
		let to = tail;
		if (text[to] === "\n") to += 1;
		if (from >= 2 && text.slice(from - 2, from) === "\n\n") from -= 1;
		const result = `${text.slice(0, from)}${text.slice(to)}`;
		return result.trim() === "" ? "" : result;
	}
	if (body === null) return text;
	const block = `${AGENTS_START}\n${body}\n${AGENTS_END}\n`;
	if (text.length === 0) return block;
	return `${text}${text.endsWith("\n") ? "\n" : "\n\n"}${block}`;
};
/** Keeps `<folder>/AGENTS.md` in step. Returns the file when it changed. */
const writeAgentsBlock = (folder, body) => {
	const file = NodePath.join(folder, "AGENTS.md");
	const exists = NodeFS.existsSync(file);
	if (!exists && body === null) return null;
	const before = exists ? NodeFS.readFileSync(file, "utf8") : "";
	const after = withAgentsBlock(before, body);
	if (after === before) return null;
	if (after === "" && body === null) {
		NodeFS.rmSync(file);
		return file;
	}
	NodeFS.writeFileSync(file, after);
	return file;
};
// src/client.ts
var OfflineError = class extends Error {};
var RejectedError = class extends Error {
	status;
	constructor(status, message) {
		super(message);
		this.status = status;
	}
};
/** POST or GET a host route with the helper's token. Network trouble is OfflineError; a refusal is RejectedError. */
const callHost = async (config, path, options = {}) => {
	if (!config.server) throw new RejectedError(0, "Not signed in. Run lp login --server <url>.");
	const headers = { accept: "application/json" };
	if (options.body !== void 0) headers["content-type"] = "application/json";
	if (options.auth !== false && config.token) headers.authorization = `Bearer ${config.token}`;
	let response;
	try {
		response = await fetch(new URL(path, config.server), {
			method: options.body === void 0 ? "GET" : "POST",
			headers,
			...options.body === void 0 ? {} : { body: JSON.stringify(options.body) },
			signal: AbortSignal.timeout(options.timeoutMs ?? 8e3)
		});
	} catch (cause) {
		throw new OfflineError(cause instanceof Error ? cause.message : String(cause));
	}
	const payload = await response.json().catch(() => ({}));
	if (response.status >= 500) throw new OfflineError(`Host answered ${response.status}.`);
	if (!response.ok) throw new RejectedError(response.status, String(payload.message ?? payload.error ?? `Host answered ${response.status}.`));
	return payload;
};
const sendBatch = (config, batch) => callHost(config, "/api/lp/helper/ingest", {
	body: batch,
	timeoutMs: 15e3
});
const gitCache = /* @__PURE__ */ new Map();
const git = (cwd, args) => {
	try {
		return NodeChildProcess.execFileSync("git", [
			"-C",
			cwd,
			...args
		], {
			encoding: "utf8",
			stdio: [
				"ignore",
				"pipe",
				"ignore"
			],
			timeout: 3e3
		}).trim() || null;
	} catch {
		return null;
	}
};
/** The repository root, its origin (or first) remote, and branch, so the host can match the project. */
const gitInfo = (cwd) => {
	const cached = gitCache.get(cwd);
	if (cached) return cached;
	const root = git(cwd, ["rev-parse", "--show-toplevel"]);
	const firstRemote = root === null ? null : git(cwd, ["remote"])?.split("\n")[0];
	const remote = root === null ? null : git(cwd, [
		"config",
		"--get",
		"remote.origin.url"
	]) ?? (firstRemote ? git(cwd, [
		"config",
		"--get",
		`remote.${firstRemote}.url`
	]) : null);
	const branch = root === null ? null : git(cwd, [
		"rev-parse",
		"--abbrev-ref",
		"HEAD"
	]);
	const info = {
		root,
		remote,
		branch: branch === "HEAD" ? null : branch
	};
	gitCache.set(cwd, info);
	return info;
};
// src/daemon.ts
const LABEL = "io.logicpacks.helper";
const run = (command, args) => NodeChildProcess.spawnSync(command, args, {
	encoding: "utf8",
	stdio: [
		"ignore",
		"pipe",
		"pipe"
	]
});
const xml = (value) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const launchAgentFile = () => NodePath.join(NodeOS.homedir(), "Library", "LaunchAgents", `${LABEL}.plist`);
/** Windows: a hidden launcher in the user's Startup folder (no admin rights needed). */
const startupFile = () => NodePath.join(process.env.APPDATA || NodePath.join(NodeOS.homedir(), "AppData", "Roaming"), "Microsoft", "Windows", "Start Menu", "Programs", "Startup", "logicpacks-helper.vbs");
const systemdUnitFile = () => NodePath.join(NodeOS.homedir(), ".config", "systemd", "user", "logicpacks-helper.service");
/**
* Keeps `lp watch` running in the background: it tails Codex sessions (Codex has no
* hooks), catches Claude Code output the hooks missed, and resends queued batches.
*/
const installWatcher = (script) => {
	const log = NodePath.join(helperHome(), "watch.log");
	const env = process.env.LP_HELPER_HOME ? { LP_HELPER_HOME: process.env.LP_HELPER_HOME } : {};
	if (process.platform === "darwin") {
		const file = launchAgentFile();
		NodeFS.mkdirSync(NodePath.dirname(file), { recursive: true });
		const envXml = Object.entries(env).map(([key, value]) => `<key>${xml(key)}</key><string>${xml(value)}</string>`).join("");
		NodeFS.writeFileSync(file, `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
<key>Label</key><string>${LABEL}</string>
<key>ProgramArguments</key><array><string>${xml(process.execPath)}</string><string>${xml(script)}</string><string>watch</string></array>
<key>EnvironmentVariables</key><dict>${envXml}</dict>
<key>RunAtLoad</key><true/>
<key>KeepAlive</key><true/>
<key>ProcessType</key><string>Background</string>
<key>StandardOutPath</key><string>${xml(log)}</string>
<key>StandardErrorPath</key><string>${xml(log)}</string>
</dict></plist>
`);
		const domain = `gui/${process.getuid?.() ?? 501}`;
		run("launchctl", ["bootout", `${domain}/${LABEL}`]);
		const loaded = run("launchctl", [
			"bootstrap",
			domain,
			file
		]);
		if (loaded.status !== 0) throw new Error(`launchctl: ${loaded.stderr.trim()}`);
		return `launchd agent ${LABEL}`;
	}
	if (process.platform === "linux" && run("systemctl", ["--user", "--version"]).status === 0) {
		const file = systemdUnitFile();
		NodeFS.mkdirSync(NodePath.dirname(file), { recursive: true });
		const envLines = Object.entries(env).map(([key, value]) => `Environment=${key}=${value}\n`).join("");
		NodeFS.writeFileSync(file, `[Unit]\nDescription=LogicPacks helper\n\n[Service]\nExecStart="${process.execPath}" "${script}" watch\n${envLines}Restart=always\nRestartSec=5\n\n[Install]\nWantedBy=default.target\n`);
		run("systemctl", ["--user", "daemon-reload"]);
		const enabled = run("systemctl", [
			"--user",
			"enable",
			"--now",
			"logicpacks-helper.service"
		]);
		if (enabled.status !== 0) throw new Error(`systemctl: ${enabled.stderr.trim()}`);
		return "systemd user service logicpacks-helper";
	}
	if (process.platform === "win32") {
		const file = startupFile();
		NodeFS.mkdirSync(NodePath.dirname(file), { recursive: true });
		const quote = (value) => `""${value}""`;
		const envSet = Object.entries(env).map(([key, value]) => `env("${key}") = "${value}"\r\n`).join("");
		NodeFS.writeFileSync(file, `Set shell = CreateObject("WScript.Shell")\r\nSet env = shell.Environment("Process")\r\n${envSet}shell.Run "${quote(process.execPath)} ${quote(script)} watch", 0, False\r\n`);
		const started = run("wscript.exe", [file]);
		if (started.status !== 0) throw new Error(`wscript: ${started.stderr.trim()}`);
		return `Startup launcher ${file}`;
	}
	throw new Error("No launchd or systemd here. Run `lp watch` in the background yourself.");
};
const uninstallWatcher = () => {
	if (process.platform === "darwin") {
		run("launchctl", ["bootout", `gui/${process.getuid?.() ?? 501}/${LABEL}`]);
		NodeFS.rmSync(launchAgentFile(), { force: true });
	} else if (process.platform === "linux") {
		run("systemctl", [
			"--user",
			"disable",
			"--now",
			"logicpacks-helper.service"
		]);
		NodeFS.rmSync(systemdUnitFile(), { force: true });
	} else if (process.platform === "win32") {
		NodeFS.rmSync(startupFile(), { force: true });
		run("powershell.exe", [
			"-NoProfile",
			"-Command",
			"Get-CimInstance Win32_Process -Filter \"Name='node.exe'\" | Where-Object { $_.CommandLine -like '*lp.mjs*watch*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }"
		]);
	}
};
const watcherRunning = () => {
	if (process.platform === "darwin") return run("launchctl", ["print", `gui/${process.getuid?.() ?? 501}/${LABEL}`]).status === 0;
	if (process.platform === "linux") return run("systemctl", [
		"--user",
		"is-active",
		"logicpacks-helper.service"
	]).status === 0;
	if (process.platform === "win32") {
		const found = run("powershell.exe", [
			"-NoProfile",
			"-Command",
			"@(Get-CimInstance Win32_Process -Filter \"Name='node.exe'\" | Where-Object { $_.CommandLine -like '*lp.mjs*watch*' }).Count"
		]);
		return Number(found.stdout.trim()) > 0;
	}
	return false;
};
// src/claude.ts
const FILE_EDIT_TOOLS = /* @__PURE__ */ new Set([
	"Edit",
	"MultiEdit",
	"Write",
	"NotebookEdit"
]);
/** Claude Code's slash-command echoes and local command output are not conversation. */
const isCommandEcho = (text) => /^\s*<(command-name|command-message|command-args|local-command-stdout|local-command-stderr|local-command-caveat)>/.test(text);
const classifyClaudeTool = (name, rawInput) => {
	const input = asRecord(rawInput) ?? {};
	const field = (key) => asString(input[key]) ?? "";
	const filePath = field("file_path") || field("notebook_path");
	if (name === "Bash") return {
		name,
		kind: "command",
		input: field("command"),
		files: []
	};
	if (FILE_EDIT_TOOLS.has(name)) return {
		name,
		kind: "file_change",
		input: filePath,
		files: filePath ? [filePath] : []
	};
	if (name === "Read") return {
		name,
		kind: "other",
		input: filePath,
		files: filePath ? [filePath] : []
	};
	if (name === "Grep" || name === "Glob") {
		const where = field("path");
		return {
			name,
			kind: "search",
			input: where ? `${field("pattern")} in ${where}` : field("pattern"),
			files: []
		};
	}
	if (name === "WebSearch") return {
		name,
		kind: "web",
		input: field("query"),
		files: []
	};
	if (name === "WebFetch") return {
		name,
		kind: "web",
		input: field("url"),
		files: []
	};
	const described = field("description") || field("prompt") || field("query");
	return {
		name,
		kind: "other",
		input: described ? oneLine(described) : oneLine(JSON.stringify(input)),
		files: []
	};
};
const textOf = (content) => {
	if (typeof content === "string") return content;
	if (!Array.isArray(content)) return "";
	return content.map((block) => {
		const record = asRecord(block);
		return record?.type === "text" ? asString(record.text) ?? "" : "";
	}).filter((part) => part.trim().length > 0).join("\n");
};
/** Claude Code tool results: a string, or text blocks; images and other blocks are left out. */
const toolResultText = (content) => typeof content === "string" ? content : textOf(content);
/**
* Turns new lines of a Claude Code transcript (`~/.claude/projects/<dir>/<session>.jsonl`)
* into helper events. Subagent (sidechain), meta and compaction records are skipped.
*/
const parseClaudeLines = (lines, state) => {
	const events = [];
	for (const line of lines) {
		const record = parseJsonLine(line.text);
		if (record === null) continue;
		const sessionId = asString(record.sessionId);
		if (sessionId) state.meta.sessionId = sessionId;
		const cwd = asString(record.cwd);
		if (cwd) state.meta.cwd = cwd;
		const branch = asString(record.gitBranch);
		if (branch) state.meta.branch = branch;
		if (record.isSidechain === true || record.isMeta === true || record.isCompactSummary === true) continue;
		const message = asRecord(record.message);
		const model = asString(message?.model);
		if (model && model !== "<synthetic>") state.meta.model = model;
		const at = asString(record.timestamp) ?? (/* @__PURE__ */ new Date()).toISOString();
		const uid = asString(record.uuid) ?? `line:${line.offset}`;
		if (record.type === "user" && message) {
			const text = textOf(message.content);
			if (text.trim().length > 0 && !isCommandEcho(text)) events.push({
				uid,
				at,
				type: "user",
				text
			});
			if (!Array.isArray(message.content)) continue;
			for (const block of message.content) {
				const result = asRecord(block);
				if (result?.type !== "tool_result") continue;
				const toolUseId = asString(result.tool_use_id);
				const pending = toolUseId ? state.pendingTools[toolUseId] : void 0;
				if (!toolUseId || !pending) continue;
				delete state.pendingTools[toolUseId];
				const output = summarize(toolResultText(result.content));
				events.push({
					uid: toolUseId,
					at,
					type: "tool",
					tool: {
						...pending,
						status: result.is_error === true ? "failed" : "completed",
						...output ? { output } : {}
					}
				});
			}
			continue;
		}
		if (record.type === "assistant" && message && Array.isArray(message.content)) {
			const text = textOf(message.content);
			if (text.trim().length > 0) events.push({
				uid,
				at,
				type: "assistant",
				text
			});
			for (const block of message.content) {
				const toolUse = asRecord(block);
				if (toolUse?.type !== "tool_use") continue;
				const id = asString(toolUse.id);
				const name = asString(toolUse.name);
				if (!id || !name) continue;
				const tool = classifyClaudeTool(name, toolUse.input);
				rememberTool(state, id, tool);
				events.push({
					uid: id,
					at,
					type: "tool",
					tool: {
						...tool,
						status: "running"
					}
				});
			}
		}
	}
	return events;
};
// src/codex.ts
const contentText = (content, blockTypes) => Array.isArray(content) ? content.map((block) => {
	const record = asRecord(block);
	return record && blockTypes.includes(String(record.type)) ? asString(record.text) ?? "" : "";
}).filter((part) => part.trim().length > 0).join("\n") : "";
/** `["/bin/zsh", "-lc", "npm test"]` reads as `npm test`. */
const commandText = (command) => {
	if (typeof command === "string") return command;
	if (!Array.isArray(command)) return "";
	const parts = command.map(String);
	const shellFlag = parts.findIndex((part) => part === "-lc" || part === "-c");
	return shellFlag >= 0 && parts[shellFlag + 1] !== void 0 ? parts.slice(shellFlag + 1).join(" ") : parts.join(" ");
};
const filePath = (value) => value.replace(/^file:\/\//, "");
/** Codex's `item_completed` records: one finished item each, already free of setup preambles. */
const modernItem = (item, at) => {
	const uid = asString(item.id);
	if (!uid) return null;
	switch (item.type) {
		case "UserMessage": {
			const text = contentText(item.content, [
				"text",
				"Text",
				"input_text"
			]);
			return text ? {
				uid,
				at,
				type: "user",
				text
			} : null;
		}
		case "AgentMessage": {
			const text = contentText(item.content, [
				"Text",
				"text",
				"output_text"
			]);
			return text ? {
				uid,
				at,
				type: "assistant",
				text
			} : null;
		}
		case "CommandExecution": {
			const exitCode = typeof item.exit_code === "number" ? item.exit_code : void 0;
			const output = summarize(asString(item.aggregated_output) ?? "");
			return {
				uid,
				at,
				type: "tool",
				tool: {
					name: "shell",
					kind: "command",
					input: commandText(item.command),
					status: item.status === "failed" || exitCode !== void 0 && exitCode !== 0 ? "failed" : "completed",
					...output ? { output } : {},
					...exitCode === void 0 ? {} : { exitCode }
				}
			};
		}
		case "FileChange": {
			const files = Object.keys(asRecord(item.changes) ?? {}).map(filePath);
			return {
				uid,
				at,
				type: "tool",
				tool: {
					name: "apply_patch",
					kind: "file_change",
					input: files.length === 1 ? files[0] : `${files.length} files`,
					status: item.status === "failed" ? "failed" : "completed",
					files
				}
			};
		}
		case "McpToolCall": {
			const name = [asString(item.server), asString(item.tool)].filter(Boolean).join(".");
			const result = asRecord(item.result);
			const output = summarize(contentText(result?.content, ["text"]));
			return {
				uid,
				at,
				type: "tool",
				tool: {
					name: name || "mcp",
					kind: "other",
					input: oneLine(JSON.stringify(item.arguments ?? {})),
					status: item.status === "failed" ? "failed" : "completed",
					...output ? { output } : {}
				}
			};
		}
		case "Extension": {
			const query = asString(item.query) ?? "";
			return item.kind === "web.search" ? {
				uid,
				at,
				type: "tool",
				tool: {
					name: "web_search",
					kind: "web",
					input: query,
					status: "completed"
				}
			} : null;
		}
		default: return null;
	}
};
/**
* Turns new lines of a Codex rollout (`~/.codex/sessions/YYYY/MM/DD/rollout-*.jsonl`)
* into helper events. Current Codex writes `item_completed` records; older versions
* wrote `event_msg` user and agent messages plus exec and patch end events.
*/
const parseCodexLines = (lines, state) => {
	const events = [];
	for (const line of lines) {
		const record = parseJsonLine(line.text);
		if (record === null) continue;
		const payload = asRecord(record.payload) ?? {};
		const at = asString(record.timestamp) ?? (/* @__PURE__ */ new Date()).toISOString();
		if (record.type === "session_meta") {
			const id = asString(payload.id) ?? asString(payload.session_id);
			if (id) state.meta.sessionId = id;
			const cwd = asString(payload.cwd);
			if (cwd) state.meta.cwd = cwd;
			const branch = asString(asRecord(payload.git)?.branch);
			if (branch) state.meta.branch = branch;
			continue;
		}
		if (record.type === "turn_context") {
			const model = asString(payload.model);
			if (model) state.meta.model = model;
			const cwd = asString(payload.cwd);
			if (cwd) state.meta.cwd = cwd;
			continue;
		}
		if (record.type !== "event_msg") continue;
		if (payload.type === "item_completed") {
			state.modernCodex = true;
			const item = asRecord(payload.item);
			const event = item ? modernItem(item, at) : null;
			if (event) events.push(event);
			continue;
		}
		if (state.modernCodex) continue;
		const uid = `line:${line.offset}`;
		if (payload.type === "user_message") {
			const text = asString(payload.message) ?? "";
			if (text.trim()) events.push({
				uid,
				at,
				type: "user",
				text
			});
		} else if (payload.type === "agent_message") {
			const text = asString(payload.message) ?? "";
			if (text.trim()) events.push({
				uid,
				at,
				type: "assistant",
				text
			});
		} else if (payload.type === "exec_command_end") {
			const exitCode = typeof payload.exit_code === "number" ? payload.exit_code : void 0;
			const output = summarize(asString(payload.aggregated_output) ?? [asString(payload.stdout), asString(payload.stderr)].filter(Boolean).join("\n"));
			events.push({
				uid: asString(payload.call_id) ?? uid,
				at,
				type: "tool",
				tool: {
					name: "shell",
					kind: "command",
					input: commandText(payload.command),
					status: exitCode !== void 0 && exitCode !== 0 ? "failed" : "completed",
					...output ? { output } : {},
					...exitCode === void 0 ? {} : { exitCode }
				}
			});
		} else if (payload.type === "patch_apply_end") {
			const files = Object.keys(asRecord(payload.changes) ?? {}).map(filePath);
			events.push({
				uid: asString(payload.call_id) ?? uid,
				at,
				type: "tool",
				tool: {
					name: "apply_patch",
					kind: "file_change",
					input: files.length === 1 ? files[0] : `${files.length} files`,
					status: payload.success === false ? "failed" : "completed",
					files
				}
			});
		}
	}
	return events;
};
// src/sync.ts
const BATCH_SIZE = 200;
const MAX_READ_BYTES = 8388608;
/** Complete lines from `offset`; a final line without its newline is left for the next pass. */
const readNewLines = (file, offset) => {
	const size = NodeFS.statSync(file, { throwIfNoEntry: false })?.size ?? 0;
	const start = size < offset ? 0 : offset;
	const length = Math.min(size - start, MAX_READ_BYTES);
	if (length <= 0) return {
		lines: [],
		nextOffset: start
	};
	const buffer = Buffer.alloc(length);
	const handle = NodeFS.openSync(file, "r");
	try {
		NodeFS.readSync(handle, buffer, 0, length, start);
	} finally {
		NodeFS.closeSync(handle);
	}
	const lines = [];
	let lineStart = 0;
	for (let index = 0; index < buffer.length; index += 1) {
		if (buffer[index] !== 10) continue;
		const text = buffer.subarray(lineStart, index).toString("utf8");
		if (text.trim().length > 0) lines.push({
			offset: start + lineStart,
			text
		});
		lineStart = index + 1;
	}
	return {
		lines,
		nextOffset: start + lineStart
	};
};
/** Sends what the host missed while it was unreachable, oldest first. Stops at the first failure. */
const flushQueue = async (config) => {
	for (const file of queuedFiles()) {
		const batch = readQueued(file);
		if (batch === null) {
			NodeFS.rmSync(file, { force: true });
			continue;
		}
		try {
			await sendBatch(config, batch);
		} catch (error) {
			if (error instanceof OfflineError) return false;
			if (error instanceof RejectedError && error.status === 401) return false;
		}
		NodeFS.rmSync(file, { force: true });
	}
	return true;
};
const parse = (source, lines, parser) => source === "claude" ? parseClaudeLines(lines, parser) : parseCodexLines(lines, parser);
/**
* Streams what was added to one transcript since the last pass. Sessions in no
* LogicPacks project stay private and are retried later from the same place, so a
* folder added to LogicPacks afterwards still gets its whole session.
*/
const syncTranscript = async (file, source, config, now = Date.now()) => {
	let outcome = { kind: "idle" };
	await withTranscriptLock(file, async () => {
		const state = loadTranscriptState(file, source);
		if (state.link?.status === "stopped") {
			outcome = {
				kind: "stopped",
				reason: state.link.reason
			};
			return;
		}
		if (state.link?.status === "unmatched" && now - state.link.checkedAt < 12e4) {
			outcome = {
				kind: "unmatched",
				message: "No LogicPacks project matches this folder yet."
			};
			return;
		}
		const { lines, nextOffset } = readNewLines(file, state.offset);
		if (lines.length === 0 && nextOffset === state.offset) return;
		const parser = structuredClone(state.parser);
		const events = parse(source, lines, parser);
		const commit = () => {
			state.offset = nextOffset;
			state.parser = parser;
			saveTranscriptState(state);
		};
		const cwd = parser.meta.cwd;
		const sessionId = parser.meta.sessionId ?? (source === "claude" ? NodePath.basename(file, ".jsonl") : null);
		if (events.length === 0 || cwd === null || sessionId === null) {
			commit();
			return;
		}
		const git = gitInfo(cwd);
		if (config.paused || isUnlinked(config, git.root ?? cwd)) {
			commit();
			outcome = {
				kind: "private",
				reason: config.paused ? "paused" : "unlinked"
			};
			return;
		}
		const batchOf = (chunk) => ({
			source,
			sessionId,
			cwd,
			gitRoot: git.root,
			gitRemote: git.remote,
			branch: parser.meta.branch ?? git.branch,
			model: parser.meta.model,
			device: config.device,
			events: chunk
		});
		const chunks = [];
		for (let index = 0; index < events.length; index += BATCH_SIZE) chunks.push(events.slice(index, index + BATCH_SIZE));
		const online = await flushQueue(config);
		let sent = 0;
		let threadId = "";
		for (const [index, chunk] of chunks.entries()) {
			if (!online) {
				enqueue(batchOf(chunk));
				continue;
			}
			try {
				const response = await sendBatch(config, batchOf(chunk));
				if (response.linked) {
					state.link = {
						status: "linked",
						projectId: response.projectId,
						threadId: response.threadId
					};
					threadId = response.threadId;
					sent += chunk.length;
					continue;
				}
				if (response.reason === "no_project") {
					state.link = {
						status: "unmatched",
						checkedAt: now
					};
					saveTranscriptState(state);
					outcome = {
						kind: "unmatched",
						message: response.message
					};
					return;
				}
				state.link = {
					status: "stopped",
					reason: response.message
				};
				commit();
				outcome = {
					kind: "stopped",
					reason: response.message
				};
				return;
			} catch (error) {
				if (error instanceof RejectedError && error.status === 401) {
					outcome = {
						kind: "signed-out",
						message: error.message
					};
					return;
				}
				if (error instanceof OfflineError) {
					for (const rest of chunks.slice(index)) enqueue(batchOf(rest));
					commit();
					outcome = {
						kind: "queued",
						events: chunks.slice(index).flat().length
					};
					return;
				}
			}
		}
		commit();
		outcome = {
			kind: "sent",
			events: sent,
			threadId
		};
	});
	return outcome;
};
const listFiles = (dir, accept) => {
	try {
		return NodeFS.readdirSync(dir).filter(accept).map((name) => NodePath.join(dir, name));
	} catch {
		return [];
	}
};
/** Top-level session transcripts written since `sinceMs`; subagent transcripts live in subfolders and are skipped. */
const discoverTranscripts = (sinceMs) => {
	const found = [];
	const consider = (file, source) => {
		const stat = NodeFS.statSync(file, { throwIfNoEntry: false });
		if (stat?.isFile() && stat.mtimeMs >= sinceMs) found.push({
			file,
			source,
			size: stat.size
		});
	};
	for (const dir of listFiles(NodePath.join(claudeHome(), "projects"), () => true)) for (const file of listFiles(dir, (name) => name.endsWith(".jsonl"))) consider(file, "claude");
	const sessions = NodePath.join(codexHome(), "sessions");
	const cutoffDay = (/* @__PURE__ */ new Date(sinceMs - 864e5)).toISOString().slice(0, 10);
	for (const year of listFiles(sessions, (name) => /^\d{4}$/.test(name))) for (const month of listFiles(year, (name) => /^\d{2}$/.test(name))) for (const day of listFiles(month, (name) => /^\d{2}$/.test(name))) {
		if (`${NodePath.basename(year)}-${NodePath.basename(month)}-${NodePath.basename(day)}` < cutoffDay) continue;
		for (const file of listFiles(day, (name) => name.startsWith("rollout-") && name.endsWith(".jsonl"))) consider(file, "codex");
	}
	return found;
};
/** What the host says about this folder's project, for the agent and for `lp status`. */
const fetchContext = (config, input, timeoutMs = 2e3) => {
	const git = gitInfo(input.cwd);
	return callHost(config, "/api/lp/helper/context", {
		body: {
			...input,
			gitRoot: git.root,
			gitRemote: git.remote
		},
		timeoutMs
	});
};
// src/hooks.ts
const HOOK_EVENTS = [
	"SessionStart",
	"UserPromptSubmit",
	"PostToolUse",
	"Stop"
];
/** Marks the hooks the helper owns, so reinstalling replaces them and uninstalling finds them. */
const MARKER = "# logicpacks-helper";
const hookCommand = (lpPath, event) => `"${lpPath}" hook ${event} ${MARKER}`;
const isOurs = (group) => (asRecord(group)?.hooks)?.some((hook) => asString(asRecord(hook)?.command)?.includes(MARKER)) ?? false;
/** Adds the helper's hooks to a Claude Code settings object, keeping everything else as it was. */
const withHelperHooks = (settings, lpPath) => {
	const hooks = { ...asRecord(settings.hooks) };
	for (const event of HOOK_EVENTS) {
		const groups = (Array.isArray(hooks[event]) ? hooks[event] : []).filter((group) => !isOurs(group));
		if (lpPath !== null) {
			const group = { hooks: [{
				type: "command",
				command: hookCommand(lpPath, event),
				timeout: 10
			}] };
			if (event === "PostToolUse") group.matcher = "*";
			groups.push(group);
		}
		if (groups.length > 0) hooks[event] = groups;
		else delete hooks[event];
	}
	const next = { ...settings };
	if (Object.keys(hooks).length > 0) next.hooks = hooks;
	else delete next.hooks;
	return next;
};
const settingsFile = () => NodePath.join(claudeHome(), "settings.json");
/** `lpPath: null` removes the hooks. Refuses to touch a settings file it cannot parse. */
const writeClaudeHooks = (lpPath) => {
	const file = settingsFile();
	let settings = {};
	if (NodeFS.existsSync(file)) {
		const parsed = asRecord(JSON.parse(NodeFS.readFileSync(file, "utf8")));
		if (parsed === null) throw new Error(`${file} is not a JSON object; left it unchanged.`);
		settings = parsed;
		const backup = `${file}.before-logicpacks`;
		if (!NodeFS.existsSync(backup)) NodeFS.copyFileSync(file, backup);
	}
	writeJson(file, withHelperHooks(settings, lpPath), 420);
	return file;
};
const claudeHooksInstalled = () => {
	try {
		const settings = asRecord(JSON.parse(NodeFS.readFileSync(settingsFile(), "utf8")));
		const hooks = asRecord(settings?.hooks) ?? {};
		return HOOK_EVENTS.every((event) => Array.isArray(hooks[event]) && hooks[event].some(isOurs));
	} catch {
		return false;
	}
};
const readStdin = async (timeoutMs) => new Promise((resolve) => {
	let data = "";
	const timer = setTimeout(() => resolve(data), timeoutMs);
	process.stdin.setEncoding("utf8");
	process.stdin.on("data", (chunk) => {
		data += chunk;
	});
	process.stdin.on("end", () => {
		clearTimeout(timer);
		resolve(data);
	});
});
/** Syncs in a detached process so a hook never holds up the agent. */
const syncInBackground = (transcript) => {
	const script = process.argv[1];
	if (!script) return;
	NodeChildProcess.spawn(process.execPath, [
		script,
		"sync",
		"--source",
		"claude",
		"--file",
		transcript
	], {
		detached: true,
		stdio: "ignore",
		env: process.env
	}).unref();
};
const CONTEXT_CACHE_MS = 6e4;
const cachedContext = async (sessionId, load, fresh) => {
	const file = NodePath.join(helperHome(), "context", `${sessionId.replace(/[^\w.-]/g, "_")}.json`);
	if (!fresh) try {
		const cached = JSON.parse(NodeFS.readFileSync(file, "utf8"));
		if (Date.now() - cached.at < CONTEXT_CACHE_MS) return cached.text;
	} catch {}
	const text = await load();
	writeJson(file, {
		at: Date.now(),
		text
	});
	return text;
};
/**
* `lp hook <Event>`, run by Claude Code. It must stay fast and never fail the
* agent: it starts a background sync and, at session start and on each prompt,
* hands the agent the project's live context.
*/
const runHook = async (event) => {
	const input = asRecord(JSON.parse(await readStdin(2e3) || "{}")) ?? {};
	const transcript = asString(input.transcript_path);
	const sessionId = asString(input.session_id);
	const cwd = asString(input.cwd);
	const config = loadConfig();
	if (!config.token || config.paused) return;
	if (transcript) syncInBackground(transcript);
	if (event !== "SessionStart" && event !== "UserPromptSubmit" || !cwd || !sessionId) return;
	const text = await cachedContext(sessionId, async () => {
		try {
			const context = await fetchContext(config, {
				cwd,
				source: "claude",
				sessionId
			}, 1800);
			if (context.linked) return context.text ?? null;
			return event === "SessionStart" ? context.message ?? null : null;
		} catch {
			return null;
		}
	}, event === "SessionStart");
	if (text) process.stdout.write(`${JSON.stringify({ hookSpecificOutput: {
		hookEventName: event,
		additionalContext: text
	} })}\n`);
};
// src/inbox.ts
const ago = (atMs, nowMs) => {
	const seconds = Math.max(0, Math.round((nowMs - atMs) / 1e3));
	if (seconds < 60) return "just now";
	const minutes = Math.round(seconds / 60);
	if (minutes < 60) return `${minutes}m ago`;
	const hours = Math.round(minutes / 60);
	if (hours < 48) return `${hours}h ago`;
	return `${Math.round(hours / 24)}d ago`;
};
const quote = (text) => JSON.stringify(text);
/** The first word of a display name, as `lp send` takes it. */
const handle = (name) => name.replace(/\s*\(from .*\)$/, "").split(/\s+/)[0] ?? name;
const indent = (text) => text.split("\n").map((line) => `    ${line}`).join("\n");
/** The commands that act on one item. */
const nextCommands = (item) => {
	switch (item.kind) {
		case "ask": return [
			`lp reply ${item.id} ${quote("<your answer>")}`,
			`lp who ${handle(item.from)}`,
			`lp done ${item.id}`
		];
		case "reply": return [`lp reply ${item.id} ${quote("<follow-up>")}`, `lp done ${item.id}`];
		case "notice": return [`lp send ${handle(item.from)} ${quote("<message>")}`, `lp done ${item.id}`];
		case "conflict": return [`lp who ${item.files[0] ?? item.people[0] ?? ""}`.trim(), ...item.people[0] ? [`lp ask ${handle(item.people[0])} ${quote("<how to merge>")}`] : []];
		case "negotiation": return item.question !== null ? [`lp decide ${item.id} accept|mine|theirs|both   (ask your user first)`] : item.needsPosition ? [`lp reply ${item.id} ${quote("<why>")} --keep "<a,b>" --change "<c>" --drop "<d>"`] : [`lp inbox --all`];
		case "drift": return [
			`lp goals decide ${item.id} message --note ${quote("<what to change>")}   (ask your user first)`,
			`lp goals decide ${item.id} accept|ignore`,
			`lp agents   (watch what ${handle(item.person)} is on)`
		];
		case "review": return [
			`lp goals show ${item.goalId ?? item.id}`,
			`lp goals decide ${item.id} approve   (ask your user first)`,
			`lp goals decide ${item.id} changes --note ${quote("<what to fix>")}`
		];
		case "milestone": return [
			`lp goals start ${item.id}`,
			`lp goals done ${item.id} --note ${quote("<what you did>")}`,
			`lp goals blocked ${item.id} --note ${quote("<why>")}`
		];
		case "goal": return [
			`lp goals show ${item.id}`,
			`lp goals confirm ${item.id}   (after your user agrees; this sends the milestones)`,
			`lp goals cancel ${item.id}`
		];
	}
};
const headline = (item, nowMs) => {
	const when = ago(item.atMs, nowMs);
	switch (item.kind) {
		case "ask": return `[${item.id}] question from ${item.from} (${item.projectTitle}, ${when})`;
		case "reply": return `[${item.id}] reply from ${item.from} (${item.projectTitle}, ${when})`;
		case "notice": return `[${item.id}] message from ${item.from} (${item.projectTitle}, ${when})`;
		case "conflict": return `[${item.id}] conflict in ${item.files.join(", ") || "files"} with ${item.people.join(" and ") || "a teammate"} (${item.projectTitle}, ${when})`;
		case "negotiation": return `[${item.id}] merge negotiation, ${item.state.replaceAll("_", " ")}, with ${item.people.join(", ")} (${item.projectTitle}, ${when})`;
		case "drift": return `[${item.id}] drift: ${item.person} is off the plan (${item.projectTitle}, ${when})`;
		case "review": return `[${item.id}] review requested by ${item.person} (${item.projectTitle}, ${when})`;
		case "milestone": return `[${item.id}] milestone for you from ${item.person} (${item.projectTitle}, ${when})`;
		case "goal": return `[${item.id}] draft goal to confirm (${item.projectTitle}, ${when})`;
	}
};
const detail = (item) => {
	switch (item.kind) {
		case "ask":
		case "reply":
		case "notice":
		case "drift":
		case "review":
		case "milestone":
		case "goal": return item.text;
		case "conflict": return item.reason;
		case "negotiation": return item.question ?? (item.needsPosition ? "Your agent's position is needed." : "Waiting on the others.");
	}
};
const formatInboxItem = (item, nowMs) => [
	headline(item, nowMs),
	indent(detail(item)),
	`    next: ${nextCommands(item).join("  |  ")}`
].join("\n");
const formatInbox = (items, nowMs) => items.length === 0 ? "Inbox is empty." : [
	`${items.length} item${items.length === 1 ? "" : "s"} for you:`,
	"",
	items.map((item) => formatInboxItem(item, nowMs)).join("\n\n")
].join("\n");
const formatAgents = (agents, ownThreadId, nowMs) => {
	if (agents.length === 0) return "Nobody else is working here right now.";
	const multiProject = new Set(agents.map((agent) => agent.projectId)).size > 1;
	return agents.map((agent) => {
		const who = agent.person ?? "Someone";
		const task = agent.task ? `: ${agent.task}` : "";
		const files = agent.files.length > 0 ? ` (files: ${agent.files.join(", ")})` : "";
		const where = multiProject ? ` in ${agent.projectTitle}` : "";
		return `${who}${agent.threadId === ownThreadId ? " (you)" : ""} via ${agent.harness}${where}, ${agent.status}, ${ago(agent.lastActiveAtMs, nowMs)}${task}${files}\n    thread ${agent.threadId}`;
	}).join("\n");
};
// src/globalBlock.ts
const MARKDOWN_MARKERS = {
	start: "<!-- logicpacks:start -->",
	end: "<!-- logicpacks:end -->"
};
const YAML_MARKERS = {
	start: "# logicpacks:start",
	end: "# logicpacks:end"
};
/**
* Adds, replaces (`body`) or removes (`null`) the marked block. Appending always adds exactly
* one newline before the block, and removal takes exactly that one back, so the original
* comes back byte for byte whether or not it ended with a newline.
*/
const withMarkedBlock = (text, body, markers) => {
	const start = text.indexOf(markers.start);
	const end = start < 0 ? -1 : text.indexOf(markers.end, start);
	if (start >= 0 && end >= 0) {
		const tail = end + markers.end.length;
		if (body !== null) return `${text.slice(0, start)}${markers.start}\n${body}\n${text.slice(end)}`;
		let from = start;
		let to = tail;
		if (text[to] === "\n") to += 1;
		if (from >= 1 && text[from - 1] === "\n") from -= 1;
		return `${text.slice(0, from)}${text.slice(to)}`;
	}
	if (body === null) return text;
	const block = `${markers.start}\n${body}\n${markers.end}\n`;
	if (text.length === 0) return block;
	return `${text}\n${block}`;
};
const hasMarkedBlock = (text, markers) => {
	const start = text.indexOf(markers.start);
	return start >= 0 && text.indexOf(markers.end, start) >= 0;
};
const writeAtomically = (file, text) => {
	NodeFS.mkdirSync(NodePath.dirname(file), { recursive: true });
	const mode = NodeFS.existsSync(file) ? NodeFS.statSync(file).mode & 511 : 420;
	const temp = `${file}.lp-${process.pid}.tmp`;
	NodeFS.writeFileSync(temp, text, { mode });
	NodeFS.renameSync(temp, file);
};
/** Puts (`body`) or takes out (`null`) the block in `file`. */
const writeBlockFile = (file, body, markers, created) => {
	if (!NodeFS.existsSync(file)) {
		if (body === null) return "absent";
		writeAtomically(file, withMarkedBlock("", body, markers));
		created.add(file);
		return "added";
	}
	const before = NodeFS.readFileSync(file, "utf8");
	const had = hasMarkedBlock(before, markers);
	const after = withMarkedBlock(before, body, markers);
	if (after === before) return body === null ? "absent" : "unchanged";
	if (body === null && after === "" && created.has(file)) {
		NodeFS.rmSync(file);
		created.remove(file);
		return "removed";
	}
	writeAtomically(file, after);
	if (body === null) return "removed";
	return had ? "updated" : "added";
};
/** The first line of a file LogicPacks owns outright; we never delete a file without it. */
const OWN_FILE_MARK = "<!-- logicpacks: this file is managed by `lp setup`; lp uninstall removes it -->";
const ownFileText = (body, frontmatter = "") => `${frontmatter}${OWN_FILE_MARK}\n${body}\n`;
/** Writes or removes a rules file of our own (Cline, Roo, Kiro, Cursor .mdc). */
const writeOwnFile = (file, text) => {
	const exists = NodeFS.existsSync(file);
	if (text === null) {
		if (!exists) return "absent";
		if (!NodeFS.readFileSync(file, "utf8").includes("<!-- logicpacks: this file is managed by `lp setup`; lp uninstall removes it -->")) throw new Error(`${file} was not written by LogicPacks; left it unchanged.`);
		NodeFS.rmSync(file);
		return "removed";
	}
	if (exists) {
		const current = NodeFS.readFileSync(file, "utf8");
		if (!current.includes("<!-- logicpacks: this file is managed by `lp setup`; lp uninstall removes it -->")) throw new Error(`${file} already exists and is not LogicPacks'; left it unchanged.`);
		if (current === text) return "unchanged";
		writeAtomically(file, text);
		return "updated";
	}
	writeAtomically(file, text);
	return "added";
};
/**
* Aider: a marked `read:` entry in ~/.aider.conf.yml. When the file already has a top-level
* `read:` key we cannot add a second one, so we refuse and say what to add by hand.
*/
const withYamlRead = (text, rulesFile) => {
	if (rulesFile === null) return withMarkedBlock(text, null, YAML_MARKERS);
	const withoutOurs = withMarkedBlock(text, null, YAML_MARKERS);
	if (/^read\s*:/m.test(withoutOurs)) throw new Error(`It already has a read: list. Add ${JSON.stringify(rulesFile)} to it yourself.`);
	return withMarkedBlock(text, `read: [${JSON.stringify(rulesFile)}]`, YAML_MARKERS);
};
// src/setup.ts
const stateFile = () => NodePath.join(helperHome(), "setup.json");
const loadSetupState = () => {
	try {
		const parsed = JSON.parse(NodeFS.readFileSync(stateFile(), "utf8"));
		return {
			records: parsed.records ?? [],
			created: parsed.created ?? []
		};
	} catch {
		return {
			records: [],
			created: []
		};
	}
};
const saveSetupState = (state) => writeJson(stateFile(), state);
const createdOf = (state) => ({
	has: (file) => state.created.includes(file),
	add: (file) => {
		if (!state.created.includes(file)) state.created.push(file);
	},
	remove: (file) => {
		state.created = state.created.filter((entry) => entry !== file);
	}
});
const remember = (state, record) => {
	state.records = state.records.filter((entry) => entry.file !== record.file);
	state.records.push(record);
};
const describeOutcome = {
	added: "added the LogicPacks block to",
	updated: "updated the LogicPacks block in",
	unchanged: "already up to date:",
	removed: "removed the LogicPacks block from",
	absent: "nothing to remove in"
};
const outcomeLine = (change) => `${describeOutcome[change.outcome]} ${change.file}`;
const writeBlock = (state, harnessId, file) => {
	const outcome = writeBlockFile(file, globalBlockBody(), MARKDOWN_MARKERS, createdOf(state));
	remember(state, {
		harness: harnessId,
		kind: "block",
		file
	});
	return {
		file,
		outcome
	};
};
const writeFile = (state, harnessId, file, frontmatter) => {
	const outcome = writeOwnFile(file, ownFileText(globalBlockBody(), frontmatter));
	remember(state, {
		harness: harnessId,
		kind: "file",
		file
	});
	return {
		file,
		outcome
	};
};
const runSetup = (options) => {
	const harness = findHarness(options.agent);
	if (harness === null) throw new Error(`Unknown agent "${options.agent}". Run lp setup --list for the ids, or use --agent generic --file <path>.`);
	const env = options.env ?? process.env;
	const resolveOptions = {
		platform: options.platform ?? process.platform,
		home: options.home ?? NodeOS.homedir(),
		env
	};
	const state = loadSetupState();
	const changes = [];
	let steps = [];
	let wroteProject = false;
	const writeProject = () => {
		if (harness.project === null || wroteProject) return;
		wroteProject = true;
		const file = NodePath.join(options.cwd, harness.project.path);
		changes.push(harness.project.kind === "file" ? writeFile(state, harness.id, file, harness.project.frontmatter) : writeBlock(state, harness.id, file));
	};
	try {
		if (options.file) {
			const file = NodePath.resolve(options.cwd, options.file);
			changes.push(writeBlock(state, harness.id, file));
		} else {
			const target = harness.global;
			switch (target.kind) {
				case "block":
					changes.push(writeBlock(state, harness.id, resolveOsPath(target.path, resolveOptions)));
					break;
				case "file":
					changes.push(writeFile(state, harness.id, resolveOsPath(target.path, resolveOptions), target.frontmatter));
					break;
				case "yaml-read": {
					const rules = resolveOsPath(target.rules, resolveOptions);
					const config = resolveOsPath(target.config, resolveOptions);
					changes.push({
						file: rules,
						outcome: writeOwnFile(rules, ownFileText(globalBlockBody()))
					});
					const exists = NodeFS.existsSync(config);
					const before = exists ? NodeFS.readFileSync(config, "utf8") : "";
					let after;
					try {
						after = withYamlRead(before, rules);
					} catch (error) {
						throw new Error(`${config}: ${error.message}`, { cause: error });
					}
					if (after !== before) {
						NodeFS.mkdirSync(NodePath.dirname(config), { recursive: true });
						NodeFS.writeFileSync(config, after);
						if (!exists) createdOf(state).add(config);
					}
					remember(state, {
						harness: harness.id,
						kind: "yaml-read",
						file: config,
						rulesFile: rules
					});
					changes.push({
						file: config,
						outcome: after === before ? "unchanged" : before.includes(YAML_MARKERS.start) ? "updated" : "added"
					});
					break;
				}
				case "ui":
					steps = target.steps;
					writeProject();
			}
		}
		if (options.project) writeProject();
	} finally {
		saveSetupState(state);
	}
	return {
		harness,
		changes,
		steps
	};
};
/** Takes back every block and rules file `lp setup` wrote (or only `agent`'s). */
const runUninstall = (agent = null) => {
	const state = loadSetupState();
	const created = createdOf(state);
	const lines = [];
	const harnessId = agent === null ? null : findHarness(agent)?.id ?? agent;
	const keep = [];
	for (const record of state.records) {
		if (harnessId !== null && record.harness !== harnessId) {
			keep.push(record);
			continue;
		}
		try {
			switch (record.kind) {
				case "block":
					lines.push(outcomeLine({
						file: record.file,
						outcome: writeBlockFile(record.file, null, MARKDOWN_MARKERS, created)
					}));
					break;
				case "file":
					lines.push(outcomeLine({
						file: record.file,
						outcome: writeOwnFile(record.file, null)
					}));
					break;
				case "yaml-read":
					if (NodeFS.existsSync(record.file)) {
						const before = NodeFS.readFileSync(record.file, "utf8");
						const after = withYamlRead(before, null);
						if (after === "" && created.has(record.file)) {
							NodeFS.rmSync(record.file);
							created.remove(record.file);
						} else if (after !== before) NodeFS.writeFileSync(record.file, after);
						lines.push(outcomeLine({
							file: record.file,
							outcome: after === before ? "absent" : "removed"
						}));
					}
					if (record.rulesFile) lines.push(outcomeLine({
						file: record.rulesFile,
						outcome: writeOwnFile(record.rulesFile, null)
					}));
			}
		} catch (error) {
			lines.push(error.message);
			keep.push(record);
		}
	}
	state.records = keep;
	saveSetupState(state);
	return lines;
};
// src/connect.ts
/** Flags that never take a value, so `--json foo` keeps `foo` as a positional. */
const BOOLEAN_FLAGS = /* @__PURE__ */ new Set([
	"json",
	"follow",
	"all",
	"workspace",
	"installed",
	"no-open",
	"no-mcp",
	"list",
	"once",
	"verbose",
	"start",
	"finish",
	"insist",
	"no-push",
	"help"
]);
const parseArgs = (argv) => {
	const positionals = [];
	const flags = /* @__PURE__ */ new Map();
	let command = null;
	for (let index = 0; index < argv.length; index += 1) {
		const arg = argv[index];
		if (arg === "--") {
			positionals.push(...argv.slice(index + 1));
			break;
		}
		if (arg.startsWith("--") && arg.length > 2) {
			const eq = arg.indexOf("=");
			if (eq > 0) {
				flags.set(arg.slice(2, eq), arg.slice(eq + 1));
				continue;
			}
			const name = arg.slice(2);
			const next = argv[index + 1];
			if (!BOOLEAN_FLAGS.has(name) && next !== void 0 && !next.startsWith("--")) {
				flags.set(name, next);
				index += 1;
			} else flags.set(name, true);
			continue;
		}
		if (command === null) command = arg;
		else positionals.push(arg);
	}
	return {
		command: command ?? "help",
		positionals,
		flags
	};
};
const flagValue = (args, name) => {
	const value = args.flags.get(name);
	return typeof value === "string" ? value : null;
};
const hasFlag = (args, name) => args.flags.has(name);
const defaultContext = () => ({
	cwd: process.cwd(),
	env: process.env,
	loadConfig,
	saveConfig,
	call: callHost,
	run: (command, args, cwd) => {
		const result = NodeChildProcess.spawnSync(command, [...args], {
			cwd,
			encoding: "utf8",
			timeout: 12e4,
			windowsHide: true
		});
		return {
			ok: result.status === 0,
			stdout: (result.stdout ?? "").trim(),
			stderr: (result.stderr ?? result.error?.message ?? "").trim()
		};
	},
	print: (line) => process.stdout.write(`${line}\n`),
	sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms))
});
const refuse = (text, json = {}) => ({
	text,
	json: {
		ok: false,
		error: text,
		...json
	},
	exitCode: 1
});
const signedIn = (ctx) => {
	const config = ctx.loadConfig();
	if (!config.server || !config.token) throw new RejectedError(401, "Not signed in. Run lp login (lp login --host <url> for your team's host).");
	return config;
};
const location = (ctx) => {
	const git = gitInfo(ctx.cwd);
	return {
		cwd: ctx.cwd,
		gitRoot: git.root,
		gitRemote: git.remote,
		branch: git.branch
	};
};
/** The harness this `lp` runs under: --harness, LP_HARNESS, the environment, or what lp setup chose. */
const detectHarness = (env, config, given = null) => {
	const named = given ?? env.LP_HARNESS ?? null;
	if (named) return findHarness(named)?.name ?? named;
	if (env.CLAUDECODE === "1" || env.CLAUDE_CODE_ENTRYPOINT) return "Claude Code";
	if (env.CODEX_SANDBOX || env.CODEX_THREAD_ID || env.CODEX_MANAGED_BY_NPM) return "Codex CLI";
	if (env.GEMINI_CLI === "1") return "Gemini CLI";
	if (env.OPENCODE === "1") return "OpenCode";
	if (env.CURSOR_TRACE_ID || env.CURSOR_AGENT) return "Cursor";
	if (env.TERM_PROGRAM === "vscode") return "VS Code";
	return config.harness ?? "Terminal";
};
const slug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 24) || "agent";
/** One agent session per harness, device and folder, so its thread stays the same across runs. */
const agentSessionId = (harness, device, root) => `${slug(harness)}-${NodeCrypto.createHash("sha1").update(`${device ?? ""}\0${root}`).digest("hex").slice(0, 12)}`;
/** This folder's project and this agent's own thread in it. */
const register = async (ctx, args, task = null) => {
	const config = signedIn(ctx);
	const where = location(ctx);
	const harness = detectHarness(ctx.env, config, flagValue(args, "harness"));
	try {
		return await ctx.call(config, "/api/lp/connect/register", {
			body: {
				cwd: where.cwd,
				gitRoot: where.gitRoot,
				gitRemote: where.gitRemote,
				branch: where.branch,
				device: config.device,
				harness,
				sessionId: agentSessionId(harness, config.device, where.gitRoot ?? where.cwd),
				...task ? { task } : {}
			},
			timeoutMs: 15e3
		});
	} catch (error) {
		if (error instanceof RejectedError && error.status === 404) throw new RejectedError(404, `${error.message}\nThis folder is not shared on LogicPacks yet. Run lp share to share it.`);
		throw error;
	}
};
const output = (text, json) => ({
	text,
	json
});
const loginCommand = async (ctx, args) => {
	const config = ctx.loadConfig();
	const server = (flagValue(args, "host") ?? flagValue(args, "server") ?? ctx.env.LP_SERVER ?? config.server ?? "https://app.logicpacks.io").replace(/\/+$/, "");
	const token = flagValue(args, "token") ?? ctx.env.LP_TOKEN ?? null;
	if (token) {
		const me = await ctx.call({
			server,
			token
		}, "/api/lp/helper/whoami");
		ctx.saveConfig({
			...config,
			server,
			token,
			who: me.who,
			pending: null
		});
		return output(`Connected to ${server} as ${me.who}.`, {
			ok: true,
			server,
			who: me.who
		});
	}
	const finishOnly = hasFlag(args, "finish");
	let pending = config.pending ?? null;
	if (!finishOnly || pending === null || pending.server !== server) {
		const started = await ctx.call({
			server,
			token: null
		}, "/api/lp/helper/pair/start", {
			body: { device: config.device },
			auth: false
		});
		pending = {
			server,
			code: started.code,
			pollToken: started.pollToken,
			url: `${server}${started.approvePath}`
		};
		ctx.saveConfig({
			...ctx.loadConfig(),
			pending
		});
		if (hasFlag(args, "start")) return output([
			`Ask your user to open this link and approve the code ${pending.code}:`,
			`  ${pending.url}`,
			"Then run: lp login --finish"
		].join("\n"), {
			ok: true,
			status: "pending",
			url: pending.url,
			code: pending.code,
			server
		});
		ctx.print(`Open this link and approve the code ${pending.code}:\n  ${pending.url}`);
		if (!hasFlag(args, "no-open") && process.platform === "darwin" && ctx.env.LP_NO_OPEN !== "1") NodeChildProcess.spawn("open", [pending.url], {
			stdio: "ignore",
			detached: true
		}).unref();
	}
	const timeoutMs = Number(flagValue(args, "timeout") ?? 600) * 1e3;
	const deadline = Date.now() + timeoutMs;
	while (Date.now() < deadline) {
		const polled = await ctx.call({
			server,
			token: null
		}, "/api/lp/helper/pair/poll", {
			body: { pollToken: pending.pollToken },
			auth: false
		}).catch(() => ({ status: "pending" }));
		if (polled.status === "approved" && polled.token) {
			ctx.saveConfig({
				...ctx.loadConfig(),
				server,
				token: polled.token,
				who: polled.who ?? null,
				pending: null
			});
			return output(`Connected to ${server} as ${polled.who ?? "you"}.`, {
				ok: true,
				server,
				who: polled.who ?? null
			});
		}
		if (polled.status === "expired") break;
		await ctx.sleep(1500);
	}
	return refuse(Date.now() >= deadline ? `Not approved yet. Approve ${pending.url} (code ${pending.code}), then run lp login --finish.` : "The code expired before it was approved. Run lp login again.", {
		url: pending.url,
		code: pending.code
	});
};
const whoamiCommand = async (ctx) => {
	const config = signedIn(ctx);
	const me = await ctx.call(config, "/api/lp/helper/whoami");
	const email = (await ctx.call(config, "/api/lp/me").catch(() => ({ user: null }))).user?.email ?? null;
	return output(`${me.who}${email ? ` <${email}>` : ""} on ${config.server}`, {
		who: me.who,
		email,
		kind: me.kind,
		server: config.server,
		harness: detectHarness(ctx.env, config)
	});
};
const projectsCommand = async (ctx) => {
	const config = signedIn(ctx);
	const { projects } = await ctx.call(config, "/api/lp/projects");
	return output(projects.length === 0 ? "No projects yet. Run lp share in a folder to share it." : projects.map((project) => `${project.title}  [${project.id}]  ${project.role}${project.synced ? ", synced" : ""}`).join("\n"), { projects });
};
const inviteLink = async (ctx, config, workspaceId) => {
	if (workspaceId === null) return null;
	const { path } = await ctx.call(config, `/api/lp/workspaces/invite?workspaceId=${encodeURIComponent(workspaceId)}`);
	return new URL(path, config.server).toString();
};
const repoName = (root) => NodePath.basename(root).replace(/[^A-Za-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "") || "project";
const shareCommand = async (ctx, args) => {
	const config = signedIn(ctx);
	const steps = [];
	let root = gitInfo(ctx.cwd).root;
	const git = (...gitArgs) => ctx.run("git", gitArgs, root ?? ctx.cwd);
	if (root === null) {
		const init = ctx.run("git", ["init"], ctx.cwd);
		if (!init.ok) return refuse(`git init failed: ${init.stderr}`);
		root = ctx.cwd;
		steps.push("Started a git repository here.");
	}
	if (!git("rev-parse", "--verify", "HEAD").ok) {
		git("add", "-A");
		const commit = git("commit", "-m", "Share with LogicPacks", "--allow-empty");
		if (!commit.ok) return refuse(`git commit failed: ${commit.stderr}`);
		steps.push("Made a first commit.");
	}
	let remote = flagValue(args, "remote") ?? gitInfo(root).remote;
	if (remote === null) remote = git("config", "--get", "remote.origin.url").stdout || null;
	if (remote === null) {
		const name = flagValue(args, "repo") ?? repoName(root);
		const created = ctx.run("gh", [
			"repo",
			"create",
			name,
			"--private",
			"--source",
			root,
			"--remote",
			"origin",
			"--push"
		], root);
		if (!created.ok) return refuse([
			"This folder has no git remote, and creating a GitHub repository with gh failed:",
			created.stderr || "gh is not installed or not signed in (gh auth login).",
			"Add a remote yourself (git remote add origin <url>) and run lp share again."
		].join("\n"));
		remote = git("config", "--get", "remote.origin.url").stdout;
		steps.push(`Created the private GitHub repository ${name} and pushed.`);
	} else if (flagValue(args, "remote") !== null && !gitInfo(root).remote) git("remote", "add", "origin", remote);
	if (!hasFlag(args, "no-push")) {
		const push = git("push", "-u", "origin", "HEAD");
		if (!push.ok && !/Everything up-to-date/.test(push.stderr)) return refuse(`git push failed: ${push.stderr}`);
		steps.push(`Pushed to ${remote}.`);
	}
	const title = flagValue(args, "title") ?? repoName(root);
	const imported = await ctx.call(config, "/api/lp/sync/import", {
		body: {
			remoteUrl: remote,
			title
		},
		timeoutMs: 12e4
	});
	steps.push(imported.kind === "imported" ? `Registered "${title}" on ${config.server}.` : `"${title}" was already on ${config.server}.`);
	const project = await ctx.call(config, `/api/lp/connect/project?projectId=${encodeURIComponent(imported.projectId)}`);
	const link = await inviteLink(ctx, config, project.workspaceId);
	const registration = await register(ctx, args).catch(() => null);
	return output([
		...steps,
		link ? `Invite link: ${link}` : "This project is in no workspace, so it has no invite link yet.",
		"Send the link to teammates, or add someone directly: lp invite <email or name>."
	].join("\n"), {
		ok: true,
		projectId: imported.projectId,
		title: project.title,
		remote,
		inviteLink: link,
		threadId: registration?.threadId ?? null
	});
};
const currentProject = async (ctx, args) => {
	return await register(ctx, args);
};
const inviteCommand = async (ctx, args) => {
	const config = signedIn(ctx);
	const who = args.positionals.join(" ").trim();
	const project = await currentProject(ctx, args);
	const link = await inviteLink(ctx, config, project.workspaceId);
	if (who.length === 0) return output(link ? `Invite link for ${project.projectTitle}: ${link}` : "No invite link.", {
		inviteLink: link,
		projectId: project.projectId
	});
	try {
		const added = await ctx.call(config, "/api/lp/members", { body: {
			projectId: project.projectId,
			user: who
		} });
		return output(`Added ${added.member.user.displayName} to ${project.projectTitle}.${link ? `\nThey can also open: ${link}` : ""}`, {
			ok: true,
			added: added.member.user,
			inviteLink: link,
			projectId: project.projectId
		});
	} catch (error) {
		if (!(error instanceof RejectedError) || error.status === 403) throw error;
		return output([
			`${who} has no LogicPacks account yet (or none by that name). Send them this invite link:`,
			`  ${link ?? "(no link: this project is in no workspace)"}`,
			"When they open it and sign up, they join this project's workspace."
		].join("\n"), {
			ok: true,
			added: null,
			inviteLink: link,
			projectId: project.projectId,
			invitee: who
		});
	}
};
const joinCommand = async (ctx, args) => {
	const config = signedIn(ctx);
	const link = args.positionals[0] ?? "";
	const invite = (() => {
		try {
			return new URL(link).searchParams.get("invite") ?? link;
		} catch {
			return link;
		}
	})();
	if (invite.length === 0) return refuse("Pass the invite link: lp join <link>");
	const joined = await ctx.call(config, "/api/lp/join", { body: {
		invite,
		mode: "session"
	} });
	return output(`Joined the workspace ${joined.workspace.name}. Run lp projects to see its projects.`, {
		ok: true,
		workspace: joined.workspace
	});
};
const membersCommand = async (ctx, args) => {
	const config = signedIn(ctx);
	const project = await currentProject(ctx, args);
	const { members } = await ctx.call(config, `/api/lp/members?projectId=${encodeURIComponent(project.projectId)}`);
	return output([`${project.projectTitle}:`, ...members.map((member) => `  ${member.user.displayName} <${member.user.email}>  ${member.role}`)].join("\n"), {
		projectId: project.projectId,
		members
	});
};
const ledgerTool = async (ctx, tool, toolArgs, args) => {
	const config = signedIn(ctx);
	const where = location(ctx);
	const harness = detectHarness(ctx.env, config, flagValue(args, "harness"));
	return ctx.call(config, "/api/lp/helper/ledger", {
		body: {
			cwd: where.cwd,
			gitRoot: where.gitRoot,
			gitRemote: where.gitRemote,
			source: "agent",
			sessionId: agentSessionId(harness, config.device, where.gitRoot ?? where.cwd),
			tool,
			args: toolArgs
		},
		timeoutMs: 15e3
	});
};
const whoCommand = async (ctx, args) => {
	await register(ctx, args);
	const query = args.positionals.join(" ").trim();
	const reply = await ledgerTool(ctx, query.length === 0 ? "threads" : "who_is_working_on", query.length === 0 ? {} : { query }, args);
	return output(reply.text, {
		query: query || null,
		text: reply.text,
		projectId: reply.projectId
	});
};
const agentsCommand = async (ctx, args) => {
	const config = signedIn(ctx);
	const me = await register(ctx, args, flagValue(args, "task"));
	const query = new URLSearchParams({ projectId: me.projectId });
	if (hasFlag(args, "workspace")) query.set("workspace", "1");
	if (hasFlag(args, "all")) query.set("all", "1");
	const { agents } = await ctx.call(config, `/api/lp/connect/agents?${query}`);
	return output(formatAgents(agents, me.threadId, Date.now()), {
		projectId: me.projectId,
		you: me.threadId,
		agents
	});
};
const resolveProjectId = async (ctx, config, given) => {
	const { projects } = await ctx.call(config, "/api/lp/projects");
	const lower = given.toLowerCase();
	return (projects.find((project) => project.id === given) ?? projects.find((project) => project.title.toLowerCase() === lower) ?? null)?.id;
};
const sendMessage = async (ctx, args, kind) => {
	const config = signedIn(ctx);
	const [to, ...rest] = args.positionals;
	const text = rest.join(" ").trim();
	if (!to || text.length === 0) return refuse(`Usage: lp ${kind} <person> "<${kind === "ask" ? "question" : "message"}>"`);
	const me = await register(ctx, args);
	const projectArg = flagValue(args, "project");
	const projectId = projectArg === null ? null : await resolveProjectId(ctx, config, projectArg);
	if (projectArg !== null && !projectId) return refuse(`You have no access to a project called ${projectArg}.`);
	const sent = await ctx.call(config, "/api/lp/connect/send", { body: {
		fromThreadId: me.threadId,
		to,
		text,
		kind,
		...projectId ? { projectId } : {}
	} });
	const who = sent.to ?? to;
	return output(kind === "ask" ? `Asked ${who} (${sent.message.id}) in ${sent.projectTitle}. Their agent gets it on its next turn or lp inbox; the answer comes back to your lp inbox.` : `Sent to ${who} (${sent.message.id}) in ${sent.projectTitle}.`, {
		ok: true,
		id: sent.message.id,
		to: who,
		toThreadId: sent.message.toThreadId,
		kind
	});
};
const sendCommand = (ctx, args) => sendMessage(ctx, args, "send");
const askCommand = (ctx, args) => sendMessage(ctx, args, "ask");
const fetchInbox = async (ctx, config, all) => (await ctx.call(config, `/api/lp/connect/inbox${all ? "?all=1" : ""}`, { timeoutMs: 15e3 })).items;
const listOf = (args, name) => (flagValue(args, name) ?? "").split(",").map((entry) => entry.trim()).filter((entry) => entry.length > 0);
const replyCommand = async (ctx, args) => {
	const config = signedIn(ctx);
	const [id, ...rest] = args.positionals;
	const text = rest.join(" ").trim();
	if (!id || text.length === 0 && !flagValue(args, "keep") && !flagValue(args, "drop")) return refuse("Usage: lp reply <id> \"<text>\"");
	const item = (await fetchInbox(ctx, config, true)).find((entry) => entry.id === id);
	if (item?.kind === "negotiation") {
		const reply = await ledgerTool(ctx, "propose_merge", {
			action: "position",
			negotiationId: id,
			keep: listOf(args, "keep"),
			change: listOf(args, "change"),
			drop: listOf(args, "drop"),
			insist: hasFlag(args, "insist"),
			note: text
		}, args);
		return output(reply.text, {
			ok: true,
			id,
			kind: "negotiation",
			text: reply.text
		});
	}
	if (item?.kind === "conflict") return refuse(`A conflict is answered by negotiating it: lp who ${item.people.join(", ")}, then tell your user. To start merging both sides, ask the other agent with lp ask.`);
	const me = await register(ctx, args);
	const sent = await ctx.call(config, "/api/lp/connect/send", { body: {
		fromThreadId: me.threadId,
		text,
		replyTo: id,
		kind: "send"
	} });
	return output(`Replied to ${sent.to ?? "them"} (${sent.message.id}).`, {
		ok: true,
		id: sent.message.id,
		replyTo: id,
		to: sent.to
	});
};
const decideCommand = async (ctx, args) => {
	const config = signedIn(ctx);
	const [id, choice] = args.positionals;
	if (!id || !choice || ![
		"accept",
		"mine",
		"theirs",
		"both"
	].includes(choice)) return refuse("Usage: lp decide <negotiation id> accept|mine|theirs|both");
	const item = (await fetchInbox(ctx, config, true)).find((entry) => entry.id === id && entry.kind === "negotiation");
	if (item === void 0 || item.kind !== "negotiation") return refuse(`No negotiation ${id} in your inbox.`);
	const decided = await ctx.call(config, "/api/lp/ledger/decide", { body: {
		negotiationId: id,
		threadId: item.threadId,
		choice
	} });
	return output(`Recorded "${choice}". The negotiation is ${decided.negotiation.state}.`, {
		ok: true,
		id,
		state: decided.negotiation.state
	});
};
const doneCommand = async (ctx, args) => {
	const config = signedIn(ctx);
	if (args.positionals.length === 0) return refuse("Usage: lp done <id> [<id>...]");
	const { dismissed } = await ctx.call(config, "/api/lp/connect/seen", { body: { ids: args.positionals } });
	return output(`Dismissed ${dismissed} item(s).`, {
		ok: true,
		dismissed
	});
};
const inboxCommand = async (ctx, args) => {
	const config = signedIn(ctx);
	const all = hasFlag(args, "all");
	if (!hasFlag(args, "follow")) {
		const items = await fetchInbox(ctx, config, all);
		return output(formatInbox(items, Date.now()), { items });
	}
	const interval = Number(flagValue(args, "interval") ?? 5) * 1e3;
	const seen = /* @__PURE__ */ new Set();
	const json = hasFlag(args, "json");
	for (;;) {
		const fresh = (await fetchInbox(ctx, config, all).catch(() => null) ?? []).filter((item) => !seen.has(`${item.kind}:${item.id}:${item.atMs}`));
		for (const item of fresh) seen.add(`${item.kind}:${item.id}:${item.atMs}`);
		if (fresh.length > 0) ctx.print(json ? fresh.map((item) => JSON.stringify(item)).join("\n") : formatInbox(fresh, Date.now()));
		if (hasFlag(args, "once")) return output("", { items: fresh });
		await ctx.sleep(interval);
	}
};
/**
* `lp editing <files>`: an outside agent tells the project which files it is changing. They
* show in lp who and lp agents, and two agents on one file get an overlap notice in lp inbox.
*/
const editingCommand = async (ctx, args) => {
	const config = signedIn(ctx);
	if (args.positionals.length === 0) return refuse("Usage: lp editing <file> [<file>...]");
	const me = await register(ctx, args);
	const where = location(ctx);
	const harness = detectHarness(ctx.env, config, flagValue(args, "harness"));
	const files = args.positionals.map((file) => NodePath.resolve(ctx.cwd, file));
	const at = (/* @__PURE__ */ new Date()).toISOString();
	await ctx.call(config, "/api/lp/helper/ingest", { body: {
		cwd: where.cwd,
		gitRoot: where.gitRoot,
		gitRemote: where.gitRemote,
		source: "agent",
		harness,
		device: config.device,
		sessionId: agentSessionId(harness, config.device, where.gitRoot ?? where.cwd),
		events: [{
			uid: `editing-${NodeCrypto.randomUUID()}`,
			at,
			type: "tool",
			tool: {
				name: "Edit",
				kind: "file_change",
				input: args.positionals.join(", "),
				status: "completed",
				files
			}
		}]
	} });
	return output(`Teammates now see you editing ${args.positionals.join(", ")} in ${me.projectTitle}.`, {
		ok: true,
		files: args.positionals,
		projectId: me.projectId
	});
};
const assistCommand = async (ctx, args) => {
	const config = signedIn(ctx);
	const [sub = "list", ...rest] = args.positionals;
	if (sub === "experts") {
		const { experts } = await ctx.call(config, "/api/lp/experts");
		return output(experts.map((expert) => `${expert.id}  ${expert.name}${expert.headline ? `: ${expert.headline}` : ""}`).join("\n") || "No experts in the catalog.", { experts });
	}
	const me = await register(ctx, args);
	if (sub === "request") {
		const brief = rest.join(" ").trim();
		if (brief.length < 10) return refuse("Say what you need: lp assist request \"<brief>\"");
		let expertId = flagValue(args, "expert");
		if (expertId === null) {
			const { experts } = await ctx.call(config, "/api/lp/experts");
			const words = brief.toLowerCase();
			const match = experts.find((expert) => (expert.specialties ?? []).some((specialty) => words.includes(specialty.toLowerCase()))) ?? experts[0];
			if (match === void 0) return refuse("No experts are available on this host.");
			expertId = match.id;
		}
		const created = await ctx.call(config, "/api/lp/experts/requests", { body: {
			projectId: me.projectId,
			expertId,
			brief,
			fromThreadId: me.threadId
		} });
		return output(`Requested assistance (${created.request.id}) from ${created.request.expert?.name ?? expertId}. Status: ${created.request.status}. Follow it with lp assist list.`, {
			ok: true,
			request: created.request
		});
	}
	if (sub === "list") {
		const { requests } = await ctx.call(config, `/api/lp/experts/requests?projectId=${encodeURIComponent(me.projectId)}`);
		return output(requests.length === 0 ? "No assistance requests in this project." : requests.map((request) => `${request.id}  ${request.status}  ${request.expert?.name ?? ""}: ${request.brief.slice(0, 80)}`).join("\n"), { requests });
	}
	if (sub === "end") {
		const requestId = rest[0];
		if (!requestId) return refuse("Usage: lp assist end <request id>");
		await ctx.call(config, "/api/lp/experts/end", { body: { requestId } });
		return output(`Ended ${requestId}; the expert's access is revoked.`, {
			ok: true,
			requestId
		});
	}
	return refuse("Usage: lp assist request|list|experts|end");
};
const packsCommand = async (ctx, args) => {
	const config = signedIn(ctx);
	const [sub = "list", ...rest] = args.positionals;
	const me = await register(ctx, args);
	if (sub === "list") {
		const { packs } = await ctx.call(config, `/api/lp/packs?projectId=${encodeURIComponent(me.projectId)}`);
		return output(packs.length === 0 ? "No packs in this project yet. Save one with lp packs save \"<name>\"." : packs.map(({ pack }) => `${pack.id}  ${pack.name}`).join("\n"), { packs: packs.map(({ pack }) => pack) });
	}
	if (sub === "save") {
		const name = rest.join(" ").trim();
		const saved = await ctx.call(config, "/api/lp/packs/save", {
			body: {
				threadId: me.threadId,
				...name ? { name } : {}
			},
			timeoutMs: 3e4
		});
		return output(`Saved pack ${saved.pack.name} (${saved.pack.id}).`, {
			ok: true,
			pack: saved.pack
		});
	}
	if (sub === "use") {
		const packId = rest[0];
		if (!packId) return refuse("Usage: lp packs use <id> [--to <person>]");
		let targetThreadId = me.threadId;
		const to = flagValue(args, "to");
		if (to !== null) {
			const { agents } = await ctx.call(config, `/api/lp/connect/agents?projectId=${encodeURIComponent(me.projectId)}&all=1`);
			const target = agents.find((agent) => agent.person?.toLowerCase() === to.toLowerCase());
			if (target === void 0) return refuse(`No thread for ${to} in this project.`);
			targetThreadId = target.threadId;
		}
		await ctx.call(config, "/api/lp/packs/use", { body: {
			projectId: me.projectId,
			packId,
			targetThreadId
		} });
		return output(`Handed pack ${packId} to ${to ?? "your thread"}; the agent reads it on its next turn.`, {
			ok: true,
			packId,
			targetThreadId
		});
	}
	return refuse("Usage: lp packs save|list|use");
};
const GOALS_UNAVAILABLE = "Goals are not available on this host yet.";
const DUE_WORDS = /\s+(?:by|due)\s+((?:today|tomorrow|tonight|(?:next\s+)?(?:mon|tues|wednes|thurs|fri|satur|sun)day|end of (?:day|week)|in \d+ (?:days?|weeks?)|\d{4}-\d{2}-\d{2}))\.?$/i;
/**
* One milestone as an agent writes it on the command line: "Omar: build the footer by
* friday". The name before the colon is the assignee; a trailing "by <day>" is the due date.
*/
const parseMilestone = (text) => {
	const colon = text.indexOf(":");
	if (colon <= 0) return null;
	const assignee = text.slice(0, colon).trim();
	let title = text.slice(colon + 1).trim();
	const due = DUE_WORDS.exec(title);
	if (due !== null) title = title.slice(0, due.index).trim();
	if (assignee.length === 0 || title.length === 0) return null;
	return {
		title,
		assignee,
		...due === null ? {} : { due: due[1].toLowerCase() }
	};
};
const splitList = (value) => value === null ? void 0 : value.split(/;|\n/).map((entry) => entry.trim()).filter(Boolean);
/** A host without Goals refuses the ledger tool (400) or has no route (404). */
const goalsMissing = (error) => error instanceof RejectedError && (error.status === 404 || error.status === 400 || error.status === 503) && !/no goal|not found\. run lp goals/i.test(error.message);
const GOALS_USAGE = [
	"lp goals plan \"<goal>\" \"<person>: <task> [by <day>]\" ... [--outcome \"<text>\"] [--criteria \"<a; b>\"] [--paths \"<a; b>\"] [--avoid \"<a; b>\"]",
	"lp goals list | show <id> | confirm <goal> | cancel <goal>",
	"lp goals start|blocked|done <milestone> [--note \"<text>\"]",
	"lp goals review | decide <id> <action> [--note \"<text>\"]"
].join("\n");
const goalsCommand = async (ctx, args) => {
	const config = signedIn(ctx);
	const [sub = "list", ...rest] = args.positionals;
	try {
		return await goalsAction(ctx, config, args, sub, rest);
	} catch (error) {
		if (goalsMissing(error)) return refuse(`${GOALS_UNAVAILABLE} (lp goals ${sub})`, { available: false });
		throw error;
	}
};
const goalsAction = async (ctx, config, args, sub, rest) => {
	const me = await register(ctx, args);
	const goalsCall = (body) => ctx.call(config, "/api/lp/connect/goals", { body });
	switch (sub) {
		case "list":
		case "show": {
			const goalId = sub === "show" ? rest[0] : void 0;
			if (sub === "show" && !goalId) return refuse("Usage: lp goals show <goal id>");
			const reply = await ledgerTool(ctx, "goals", goalId ? { goalId } : {}, args);
			const { goals = [] } = await goalsCall({
				op: "list",
				projectId: me.projectId
			});
			return output(reply.text, {
				projectId: me.projectId,
				text: reply.text,
				goals: goalId ? goals.filter((goal) => goal.id === goalId) : goals
			});
		}
		case "plan": {
			const [title, ...lines] = rest;
			const fromJson = flagValue(args, "plan");
			if (fromJson !== null) {
				const plan = JSON.parse(fromJson);
				const reply = await ledgerTool(ctx, "goal_plan", {
					...plan,
					...goalRef(args)
				}, args);
				return output(reply.text, { text: reply.text });
			}
			const milestones = lines.map((line) => ({
				line,
				parsed: parseMilestone(line)
			}));
			const bad = milestones.filter((entry) => entry.parsed === null).map((entry) => entry.line);
			if (!title || milestones.length === 0 || bad.length > 0) return refuse([
				bad.length > 0 ? `Write each milestone as "<person>: <task> [by <day>]": ${bad.join(", ")}` : "",
				"Usage:",
				GOALS_USAGE,
				"Example: lp goals plan \"Launch the pricing page\" \"Omar: build the footer by friday\" \"Priya: write the tests\""
			].filter(Boolean).join("\n"));
			const criteria = splitList(flagValue(args, "criteria"));
			const paths = splitList(flagValue(args, "paths"));
			const avoid = splitList(flagValue(args, "avoid"));
			const outcome = flagValue(args, "outcome") ?? void 0;
			const reply = await ledgerTool(ctx, "goal_plan", {
				title,
				...outcome === void 0 ? {} : { outcome },
				...goalRef(args),
				milestones: milestones.map(({ parsed }) => ({
					...parsed,
					...criteria === void 0 ? {} : { criteria },
					...paths === void 0 && avoid === void 0 ? {} : { scope: {
						...paths ? { paths } : {},
						...avoid ? { avoid } : {}
					} }
				}))
			}, args);
			const goalId = /Draft goal (\S+)/.exec(reply.text)?.[1] ?? null;
			const text = reply.text.replace(/Nothing is sent yet:.*$/m, goalId === null ? "Nothing is sent yet: your user confirms it." : `Nothing is sent yet. Show your user the plan; when they agree, run lp goals confirm ${goalId} (or they confirm it in LogicPacks Goals).`);
			return output(text, {
				goalId,
				text
			});
		}
		case "confirm":
		case "cancel": {
			const goalId = rest[0];
			if (!goalId) return refuse(`Usage: lp goals ${sub} <goal id>`);
			const { goal } = await goalsCall({
				op: sub,
				goalId
			});
			return output(sub === "confirm" ? `Confirmed "${goal?.title}". Each milestone goes to its person's agent now; progress shows in lp goals list.` : `Cancelled "${goal?.title}".`, { goal });
		}
		case "start":
		case "blocked":
		case "done": {
			const milestoneId = rest[0];
			if (!milestoneId) return refuse(`Usage: lp goals ${sub} <milestone id> [--note "<text>"]`);
			const note = flagValue(args, "note") ?? rest.slice(1).join(" ");
			const reply = await ledgerTool(ctx, "goal_update", {
				milestoneId,
				status: sub === "start" ? "in_progress" : sub,
				...note ? { note } : {}
			}, args);
			return output(reply.text, {
				milestoneId,
				text: reply.text
			});
		}
		case "review": {
			const items = (await fetchInbox(ctx, config, false)).filter((item) => item.kind === "drift" || item.kind === "review" || item.kind === "goal");
			return output(items.length === 0 ? "Nothing to review or decide." : formatInbox(items, Date.now()), { items });
		}
		case "decide": {
			const [decisionId, action] = rest;
			if (!decisionId || !action) return refuse("Usage: lp goals decide <id> <action> [--note \"<text>\"]");
			const note = flagValue(args, "note") ?? void 0;
			const { goal } = await goalsCall({
				op: "decide",
				decisionId,
				action,
				...note === void 0 ? {} : { note }
			});
			return output(`Recorded "${action}" on ${decisionId} (goal "${goal?.title}").`, { goal });
		}
		default: return refuse(`Usage:\n${GOALS_USAGE}`);
	}
};
const goalRef = (args) => {
	const goalId = flagValue(args, "goal");
	return goalId === null ? {} : { goalId };
};
const setupCommand = (ctx, args) => {
	if (hasFlag(args, "list") || !flagValue(args, "agent") && args.positionals.length === 0) return output([
		"lp setup --agent <id> [--file <path>] [--project]",
		"",
		...HARNESSES.map((harness) => `  ${harness.id.padEnd(14)}${harness.name}`)
	].join("\n"), { harnesses: HARNESSES.map(({ id, name }) => ({
		id,
		name
	})) });
	const agent = flagValue(args, "agent") ?? args.positionals[0];
	const result = runSetup({
		agent,
		file: flagValue(args, "file"),
		project: hasFlag(args, "project"),
		cwd: ctx.cwd,
		env: ctx.env
	});
	const config = ctx.loadConfig();
	ctx.saveConfig({
		...config,
		harness: result.harness.name
	});
	const lines = [
		`${result.harness.name}:`,
		...result.changes.map((change) => `  ${outcomeLine(change)}`),
		...result.steps.length > 0 ? [
			"",
			"Do this by hand:",
			...result.steps.map((step) => `  - ${step}`)
		] : [],
		...result.harness.shell ? [] : ["", `${result.harness.name} does not run commands on its own: run the lp commands it suggests.`]
	];
	return output(lines.join("\n"), {
		ok: true,
		harness: result.harness.id,
		changes: result.changes,
		steps: result.steps
	});
};
const setupPromptCommand = (args) => {
	const text = setupPrompt(hasFlag(args, "installed") ? "installed" : "new");
	return output(text, { prompt: text });
};
const setupBlockCommand = () => {
	const block = `<!-- logicpacks:start -->\n${globalBlockBody()}\n<!-- logicpacks:end -->`;
	return output(block, { block });
};
const helpAgentsCommand = () => output(agentsHelp(), { help: agentsHelp() });
/** Every agent-facing command, by name. */
const CONNECT_COMMANDS = {
	whoami: whoamiCommand,
	projects: projectsCommand,
	share: shareCommand,
	invite: inviteCommand,
	join: joinCommand,
	members: membersCommand,
	who: whoCommand,
	agents: agentsCommand,
	send: sendCommand,
	ask: askCommand,
	reply: replyCommand,
	decide: decideCommand,
	done: doneCommand,
	inbox: inboxCommand,
	editing: editingCommand,
	assist: assistCommand,
	packs: packsCommand,
	goals: goalsCommand,
	setup: setupCommand,
	"setup-prompt": (_ctx, args) => setupPromptCommand(args),
	"setup-block": () => setupBlockCommand()
};
/** Prints an Output as text or JSON and sets the exit code. */
const emit = (ctx, args, result) => {
	if (hasFlag(args, "json")) ctx.print(JSON.stringify(result.json, null, 2));
	else if (result.text.length > 0) ctx.print(result.text);
	if (result.exitCode) process.exitCode = result.exitCode;
};
/** Errors as an agent should read them: one line, plus JSON when asked. */
const emitError = (ctx, args, error) => {
	const message = error instanceof Error ? error.message : String(error);
	if (hasFlag(args, "json")) ctx.print(JSON.stringify({
		ok: false,
		error: message
	}, null, 2));
	else ctx.print(message);
	process.exitCode = 1;
};
// src/mcp.ts
/**
* `lp mcp`: a stdio MCP server that gives Codex and Claude Code sessions the
* LogicPacks project ledger. It signs in with the helper's stored token and
* finds the project from the session's folder and git remote.
*/
const list = (description) => ({
	type: "array",
	items: { type: "string" },
	maxItems: 30,
	description
});
const LEDGER_TOOLS = [
	{
		name: "threads",
		description: "The project ledger: every other thread in this project with its people, agent, goal, files and branch, plus recent decisions.",
		inputSchema: {
			type: "object",
			properties: {}
		},
		annotations: { readOnlyHint: true }
	},
	{
		name: "who_is_working_on",
		description: "Who is working on a person, file or topic in this project (\"Ali\", \"src/checkout.tsx\", \"newsletter\"). Call it before you start work and when asked about teammates.",
		inputSchema: {
			type: "object",
			properties: { query: {
				type: "string",
				description: "A person, file path or topic."
			} },
			required: ["query"]
		},
		annotations: { readOnlyHint: true }
	},
	{
		name: "conflicts",
		description: "Open conflicts in this project: files, whose work, why, and any negotiation.",
		inputSchema: {
			type: "object",
			properties: {}
		},
		annotations: { readOnlyHint: true }
	},
	{
		name: "send_to_thread",
		description: "Message a teammate's thread (\"tell Ali to work on X\"): `to` is a person's name or a thread id. They see it at once; their agent gets it next turn. Answer a message with `replyTo`.",
		inputSchema: {
			type: "object",
			properties: {
				to: { type: "string" },
				message: {
					type: "string",
					maxLength: 4e3
				},
				replyTo: {
					type: "string",
					description: "The id of the message you are answering."
				}
			},
			required: ["message"]
		}
	},
	{
		name: "propose_merge",
		description: "Negotiate a conflict with the other agents. action propose (default without negotiationId): start, for a conflictId or threadIds/people. action position: keep/change/drop lists, insist only for what your user needs. Agreed: the named agent merges on lp/merge-<id> and reports action merged (branch, summary) or failed.",
		inputSchema: {
			type: "object",
			properties: {
				action: {
					type: "string",
					enum: [
						"propose",
						"position",
						"merged",
						"failed"
					]
				},
				negotiationId: { type: "string" },
				conflictId: { type: "string" },
				threadIds: list("Threads to include."),
				people: list("People to include."),
				keep: list("What you keep as is."),
				change: list("What you accept changing."),
				drop: list("What you give up."),
				insist: { type: "boolean" },
				note: { type: "string" },
				branch: { type: "string" },
				summary: { type: "string" }
			}
		}
	},
	{
		name: "note",
		description: "Tell the project ledger your current goal, or record a decision teammates should know.",
		inputSchema: {
			type: "object",
			properties: {
				goal: { type: "string" },
				decision: { type: "string" }
			}
		}
	},
	{
		name: "packs",
		description: "Packs saved in this project carry context between threads and apps: summary, decisions, file and app references, workflow steps. No query lists them; query = a pack id reads one in full.",
		inputSchema: {
			type: "object",
			properties: { query: { type: "string" } }
		}
	},
	{
		name: "ask",
		description: "Ask a teammate's agent a question (`to`: a person's name). Their agent answers with reply; the answer shows in your inbox.",
		inputSchema: {
			type: "object",
			properties: {
				to: { type: "string" },
				question: {
					type: "string",
					maxLength: 4e3
				}
			},
			required: ["to", "question"]
		}
	},
	{
		name: "reply",
		description: "Answer a question or message from your inbox by its id.",
		inputSchema: {
			type: "object",
			properties: {
				id: { type: "string" },
				text: {
					type: "string",
					maxLength: 4e3
				}
			},
			required: ["id", "text"]
		}
	},
	{
		name: "inbox",
		description: "Messages, questions from other agents, conflicts and negotiations waiting for you. Check it at the start of a session.",
		inputSchema: {
			type: "object",
			properties: {}
		},
		annotations: { readOnlyHint: true }
	},
	{
		name: "goals",
		description: "Goals (Beta) in this project: drafts and active goals with each milestone's assignee, criteria, scope, due date and status, plus the people you can assign. goalId reads one.",
		inputSchema: {
			type: "object",
			properties: { goalId: { type: "string" } }
		},
		annotations: { readOnlyHint: true }
	},
	{
		name: "goal_plan",
		description: "Draft a goal when your user asks teammates or experts to do work (\"ask Omar to do X, and Priya to do Y by Friday\"). Nothing is sent: your user reviews and confirms it in LogicPacks Goals. Pass goalId to revise your draft.",
		inputSchema: {
			type: "object",
			properties: {
				title: { type: "string" },
				outcome: { type: "string" },
				goalId: { type: "string" },
				milestones: {
					type: "array",
					maxItems: 12,
					items: {
						type: "object",
						properties: {
							title: { type: "string" },
							assignee: {
								type: "string",
								description: "A person's or expert's name."
							},
							criteria: list("Acceptance criteria."),
							scope: {
								type: "object",
								properties: {
									paths: list("Paths or globs the work may touch."),
									avoid: list("Paths or globs it must not touch."),
									branch: { type: "string" },
									newDependencies: { type: "boolean" },
									notes: list("Other boundaries, like \"don't change the API\".")
								}
							},
							due: {
								type: "string",
								description: "YYYY-MM-DD or a weekday."
							}
						},
						required: ["title", "assignee"]
					}
				}
			},
			required: ["title", "milestones"]
		}
	},
	{
		name: "goal_update",
		description: "Report on the goal milestone assigned to this session: status in_progress, blocked or done. With done, add a note and each criterion with met and evidence.",
		inputSchema: {
			type: "object",
			properties: {
				milestoneId: { type: "string" },
				status: {
					type: "string",
					enum: [
						"in_progress",
						"blocked",
						"done"
					]
				},
				note: { type: "string" },
				criteria: {
					type: "array",
					maxItems: 12,
					items: {
						type: "object",
						properties: {
							criterion: { type: "string" },
							met: { type: "boolean" },
							evidence: { type: "string" }
						},
						required: ["criterion", "met"]
					}
				}
			},
			required: ["milestoneId", "status"]
		}
	}
];
/** ask and reply are send_to_thread under friendlier names; inbox reads the connect route. */
const aliasTool = (name, args) => {
	if (name === "ask") return {
		tool: "send_to_thread",
		args: {
			to: args.to,
			message: args.question
		}
	};
	if (name === "reply") return {
		tool: "send_to_thread",
		args: {
			replyTo: args.id,
			message: args.text
		}
	};
	return {
		tool: name,
		args
	};
};
const TOOL_NAMES = new Set(LEDGER_TOOLS.map((tool) => tool.name));
const SESSION_MAX_AGE_MS = 432e5;
/**
* The session this server most likely belongs to: the newest linked transcript
* of `source` in the same repository. MCP clients do not pass their session id.
*/
const guessSession = (source, root) => {
	const dir = NodePath.join(helperHome(), "state");
	let best = null;
	let names = [];
	try {
		names = NodeFS.readdirSync(dir).filter((name) => name.endsWith(".json"));
	} catch {
		return null;
	}
	for (const name of names) {
		const file = NodePath.join(dir, name);
		try {
			const at = NodeFS.statSync(file).mtimeMs;
			if (Date.now() - at > SESSION_MAX_AGE_MS || best !== null && at <= best.at) continue;
			const state = JSON.parse(NodeFS.readFileSync(file, "utf8"));
			const cwd = state.parser?.meta?.cwd;
			const sessionId = state.parser?.meta?.sessionId;
			if (state.source !== source || state.link?.status !== "linked" || !cwd || !sessionId) continue;
			if (cwd !== root && !cwd.startsWith(`${root}/`)) continue;
			best = {
				sessionId,
				at
			};
		} catch {}
	}
	return best?.sessionId ?? null;
};
/** One ledger call through the host. Errors come back as text the agent can read. */
const callLedgerTool = async (options, tool, args) => {
	const config = (options.loadConfig ?? loadConfig)();
	if (!config.server || !config.token) return {
		text: "LogicPacks is not signed in on this computer. Run lp login.",
		isError: true
	};
	const git = gitInfo(options.cwd);
	if (isUnlinked(config, git.root ?? options.cwd)) return {
		text: "This folder is private (lp unlink); LogicPacks tools are off here.",
		isError: true
	};
	const sessionId = options.sessionId ?? (options.source !== null && git.root !== null ? guessSession(options.source, git.root) : null);
	try {
		return {
			text: (await callHost(config, "/api/lp/helper/ledger", {
				body: {
					cwd: options.cwd,
					gitRoot: git.root,
					gitRemote: git.remote,
					...options.source !== null && sessionId !== null ? {
						source: options.source,
						sessionId
					} : {},
					tool,
					args
				},
				timeoutMs: 15e3
			})).text,
			isError: false
		};
	} catch (error) {
		if (error instanceof OfflineError) return {
			text: `The LogicPacks host is unreachable: ${error.message}`,
			isError: true
		};
		if (error instanceof RejectedError) return {
			text: error.message,
			isError: true
		};
		throw error;
	}
};
/** The inbox as the CLI prints it. */
const readInbox = async (options) => {
	const config = (options.loadConfig ?? loadConfig)();
	if (!config.server || !config.token) return {
		text: "LogicPacks is not signed in on this computer. Run lp login.",
		isError: true
	};
	try {
		const { items } = await callHost(config, "/api/lp/connect/inbox");
		return {
			text: formatInbox(items, Date.now()),
			isError: false
		};
	} catch (error) {
		return {
			text: error.message,
			isError: true
		};
	}
};
const PROTOCOL_VERSIONS = [
	"2025-06-18",
	"2025-03-26",
	"2024-11-05"
];
/** Answers one JSON-RPC message; null for notifications. */
const handleMcpMessage = async (options, message) => {
	const id = message.id ?? null;
	const method = asString(message.method);
	const params = asRecord(message.params) ?? {};
	const isRequest = "id" in message && method !== null;
	const ok = (result) => ({
		jsonrpc: "2.0",
		id,
		result
	});
	const fail = (code, text) => ({
		jsonrpc: "2.0",
		id,
		error: {
			code,
			message: text
		}
	});
	if (!isRequest) return null;
	switch (method) {
		case "initialize": {
			const asked = asString(params.protocolVersion);
			return ok({
				protocolVersion: asked !== null && PROTOCOL_VERSIONS.includes(asked) ? asked : PROTOCOL_VERSIONS[0],
				capabilities: { tools: { listChanged: false } },
				serverInfo: {
					name: "logicpacks",
					version: "1.0.0"
				},
				instructions: "LogicPacks project ledger: who is working on what in this project, messages between threads, conflicts and merge negotiation. Call who_is_working_on before starting work and when asked about teammates."
			});
		}
		case "ping": return ok({});
		case "tools/list": return ok({ tools: LEDGER_TOOLS });
		case "tools/call": {
			const name = asString(params.name);
			if (name === null || !TOOL_NAMES.has(name)) return fail(-32602, `Unknown tool ${name}`);
			const toolArgs = asRecord(params.arguments) ?? {};
			if (name === "inbox") {
				const result = await readInbox(options);
				return ok({
					content: [{
						type: "text",
						text: result.text
					}],
					isError: result.isError
				});
			}
			const mapped = aliasTool(name, toolArgs);
			const result = await callLedgerTool(options, mapped.tool, mapped.args);
			return ok({
				content: [{
					type: "text",
					text: result.text
				}],
				isError: result.isError
			});
		}
		case "resources/list": return ok({ resources: [] });
		case "prompts/list": return ok({ prompts: [] });
		default: return fail(-32601, `Method not found: ${method}`);
	}
};
/** Newline-delimited JSON-RPC over stdin/stdout, as the MCP stdio transport defines. */
const runMcpServer = async (options) => {
	const input = NodeReadline.createInterface({
		input: process.stdin,
		crlfDelay: Infinity
	});
	const write = (value) => process.stdout.write(`${JSON.stringify(value)}\n`);
	const pending = /* @__PURE__ */ new Set();
	for await (const line of input) {
		if (line.trim() === "") continue;
		let message;
		try {
			message = asRecord(JSON.parse(line));
		} catch {
			write({
				jsonrpc: "2.0",
				id: null,
				error: {
					code: -32700,
					message: "Parse error"
				}
			});
			continue;
		}
		if (message === null) continue;
		const work = handleMcpMessage(options, message).then((reply) => {
			if (reply !== null) write(reply);
		}).catch((error) => {
			write({
				jsonrpc: "2.0",
				id: message?.id ?? null,
				error: {
					code: -32603,
					message: error instanceof Error ? error.message : String(error)
				}
			});
		}).finally(() => pending.delete(work));
		pending.add(work);
	}
	await Promise.all(pending);
};
// src/cli.ts
const HELP = `LogicPacks helper (lp): use LogicPacks from any agent harness, no app needed.

  lp login [--host <url>]                    sign in with a device code (default https://app.logicpacks.io)
  lp whoami | lp projects                    who you are, the projects you can open
  lp share | lp invite <email|name>          share this folder, add a teammate or print the invite link
  lp members | lp who [x] | lp agents        who is in the project, working on what, which agents are active
  lp send | lp ask | lp reply | lp inbox     talk to teammates and their agents
  lp assist | lp packs | lp goals            Request assistance, packs, goals (beta)
  lp setup --agent <id>                      add the LogicPacks block to an agent's global instructions
  lp setup-prompt                            the prompt to paste into any agent
  lp help agents                             every command, for agents

  lp status                                  connection, this folder's project, queue
  lp pause | lp resume                       stop or restart streaming sessions
  lp unlink [folder] | lp link [folder]      keep a folder's sessions private, or share them again
  lp watch | lp install                      stream Claude Code and Codex sessions (hooks, watcher, MCP)
  lp mcp                                     the optional MCP server (stdio)
  lp uninstall                               remove every block, rules file, hook and MCP registration
  lp logout                                  forget this computer's token

Add --json to any agent command for machine-readable output. Guide: https://logicpacks.io/setup.md
`;
const flag = (args, name) => {
	const index = args.indexOf(`--${name}`);
	return index >= 0 ? args[index + 1] ?? null : null;
};
const say = (line) => process.stdout.write(`${line}\n`);
const folderArg = (args) => {
	const given = args.find((arg) => !arg.startsWith("--"));
	const folder = NodePath.resolve(given ?? process.cwd());
	return gitInfo(folder).root ?? folder;
};
const scriptPath = () => NodeFS.realpathSync(process.argv[1] ?? "lp");
/**
* The launcher hooks call: the installer's wrapper when present, else this script through node.
* On Windows, Claude Code runs hooks through Git Bash, so the path uses forward slashes and
* points at the installer's sh wrapper (bin/lp); lp.cmd next to it serves PowerShell and cmd.
*/
const lpCommandPath = () => {
	const wrapper = NodePath.join(helperHome(), "bin", "lp");
	const path = NodeFS.existsSync(wrapper) ? wrapper : scriptPath();
	return process.platform === "win32" ? path.replaceAll("\\", "/") : path;
};
/** How Codex and Claude Code start `lp mcp`. Windows cannot spawn the sh wrapper, so node runs the script. */
const mcpLaunch = (source) => {
	const wrapper = NodePath.join(helperHome(), "bin", "lp");
	return NodeFS.existsSync(wrapper) && process.platform !== "win32" ? {
		command: wrapper,
		args: [
			"mcp",
			"--source",
			source
		]
	} : {
		command: process.execPath,
		args: [
			scriptPath(),
			"mcp",
			"--source",
			source
		]
	};
};
/** Adds (or with `remove`, takes out) the logicpacks MCP server in Codex and Claude Code. */
const registerMcp = (remove = false) => {
	const lines = [];
	const attempt = (label, run) => {
		try {
			const file = run();
			lines.push(file === null ? `${label}: ${remove ? "nothing to remove" : "already set up"}` : `${label}: ${remove ? "removed from" : "registered in"} ${file}`);
		} catch (error) {
			lines.push(`${label}: ${error.message}`);
		}
	};
	attempt("Codex MCP server", () => writeCodexMcp(remove ? null : mcpLaunch("codex")));
	attempt("Claude Code MCP server", () => writeClaudeMcp(remove ? null : mcpLaunch("claude")));
	return lines;
};
/** Keeps the LogicPacks rules in `folder`/AGENTS.md while the folder belongs to a project. */
const syncAgentsFile = async (folder, timeoutMs = 3e3) => {
	const config = loadConfig();
	if (!config.server || !config.token || isUnlinked(config, folder)) return null;
	const context = await fetchContext(config, { cwd: folder }, timeoutMs).catch(() => null);
	if (!context?.linked) return null;
	return writeAgentsBlock(folder, agentsBlockBody(context.projectTitle ?? null));
};
const status = async () => {
	const config = loadConfig();
	say(`Host:      ${config.server ?? "not connected (run lp login)"}`);
	if (config.server && config.token) try {
		const me = await callHost(config, "/api/lp/helper/whoami", { timeoutMs: 3e3 });
		say(`Signed in: ${me.who}`);
	} catch (error) {
		say(`Signed in: ${error instanceof OfflineError ? "host unreachable, sessions are queued" : error.message}`);
	}
	say(`Streaming: ${config.paused ? "paused (lp resume)" : "on"}`);
	say(`Queued:    ${queuedFiles().length} batch(es) waiting for the host`);
	say(`Hooks:     ${claudeHooksInstalled() ? "Claude Code hooks installed" : "not installed (lp install)"}`);
	say(`Watcher:   ${watcherRunning() ? "running" : "not running (lp install)"}`);
	say(`Codex MCP: ${codexMcpInstalled() ? "registered" : "not registered (lp install)"}`);
	const folder = folderArg([]);
	if (config.unlinked.includes(folder)) say(`This folder: private (lp link to share it)`);
	else if (config.server && config.token) try {
		const context = await fetchContext(config, { cwd: process.cwd() }, 3e3);
		say(context.linked ? `This folder: streams into "${context.projectTitle}"${context.synced ? " (Synced)" : " (Not synced: teammates cannot work on it while this computer is off)"}` : `This folder: ${context.message ?? "not part of a LogicPacks project"}`);
	} catch {}
};
const syncCommand = async (args) => {
	const config = loadConfig();
	if (!config.token) return;
	const file = flag(args, "file");
	if (file) {
		const source = flag(args, "source") ?? "claude";
		const outcome = await syncTranscript(NodePath.resolve(file), source, config);
		if (args.includes("--verbose")) say(JSON.stringify(outcome));
		return;
	}
	await flushQueue(config);
	for (const transcript of discoverTranscripts(Date.parse(config.since))) {
		const outcome = await syncTranscript(transcript.file, transcript.source, config);
		if (args.includes("--verbose")) say(`${transcript.file}: ${JSON.stringify(outcome)}`);
	}
};
/** The background loop: tail every transcript that grew, and resend the queue. */
const watch = async (args) => {
	const interval = Number(flag(args, "interval") ?? 2e3);
	const seen = /* @__PURE__ */ new Map();
	for (;;) {
		const config = loadConfig();
		if (config.token) {
			await flushQueue(config).catch(() => false);
			for (const transcript of discoverTranscripts(Date.parse(config.since))) {
				if (seen.get(transcript.file) === transcript.size) continue;
				const outcome = await syncTranscript(transcript.file, transcript.source, config).catch((error) => ({
					kind: "error",
					message: error.message
				}));
				if (outcome.kind !== "unmatched" && outcome.kind !== "signed-out") seen.set(transcript.file, transcript.size);
				if (outcome.kind !== "idle" && args.includes("--verbose")) say(`${(/* @__PURE__ */ new Date()).toISOString()} ${NodePath.basename(transcript.file)} ${JSON.stringify(outcome)}`);
			}
		}
		if (args.includes("--once")) return;
		await new Promise((resolve) => setTimeout(resolve, interval));
	}
};
const main = async () => {
	const [command = "help", ...args] = process.argv.slice(2);
	switch (command) {
		case "login": {
			const ctx = defaultContext();
			const parsed = parseArgs(["login", ...args]);
			const result = await loginCommand(ctx, parsed).catch((error) => {
				emitError(ctx, parsed, error);
				return null;
			});
			if (result === null) return;
			emit(ctx, parsed, result);
			if (!result.exitCode && !args.includes("--no-mcp") && !args.includes("--start")) {
				if (!parsed.flags.has("json")) registerMcp().forEach(say);
			}
			return;
		}
		case "logout": {
			const config = loadConfig();
			await callHost(config, "/api/lp/helper/logout", { body: {} }).catch(() => void 0);
			saveConfig({
				...config,
				token: null,
				who: null
			});
			return say("Signed out. Sessions are no longer streamed from this computer.");
		}
		case "status": return status();
		case "pause":
		case "resume":
			saveConfig({
				...loadConfig(),
				paused: command === "pause"
			});
			return say(command === "pause" ? "Paused. New sessions stay on this computer until you run lp resume." : "Streaming again.");
		case "unlink":
		case "link": {
			const config = loadConfig();
			const folder = folderArg(args);
			const unlinked = config.unlinked.filter((root) => root !== folder);
			if (command === "unlink") unlinked.push(folder);
			saveConfig({
				...config,
				unlinked
			});
			say(command === "unlink" ? `Sessions in ${folder} stay private now.` : `Sessions in ${folder} stream to their LogicPacks project again.`);
			const agentsFile = command === "unlink" ? writeAgentsBlock(folder, null) : await syncAgentsFile(folder);
			if (agentsFile !== null) say(`${command === "unlink" ? "Removed" : "Updated"} the LogicPacks block in ${agentsFile}`);
			return;
		}
		case "context": {
			const config = loadConfig();
			const context = await fetchContext(config, { cwd: NodePath.resolve(flag(args, "cwd") ?? process.cwd()) });
			return say(context.linked ? context.text ?? "" : context.message ?? "Not linked.");
		}
		case "install":
			if (!args.includes("--no-hooks")) say(`Claude Code hooks added to ${writeClaudeHooks(lpCommandPath())}`);
			if (!args.includes("--no-watcher")) try {
				say(`Background watcher: ${installWatcher(scriptPath())}`);
			} catch (error) {
				say(error.message);
			}
			if (!args.includes("--no-mcp")) registerMcp().forEach(say);
			return;
		case "uninstall":
			runUninstall(flag(args, "agent")).forEach(say);
			if (flag(args, "agent") !== null) return;
			if (!args.includes("--no-hooks")) writeClaudeHooks(null);
			if (!args.includes("--no-watcher")) uninstallWatcher();
			if (!args.includes("--no-mcp")) registerMcp(true).forEach(say);
			return say("Removed the LogicPacks blocks, the Claude Code hooks, the background watcher and the MCP server.");
		case "help":
			if (args[0] === "agents") return say(helpAgentsCommand().text);
			return say(HELP);
		case "mcp": {
			const cwd = NodePath.resolve(flag(args, "cwd") ?? process.cwd());
			const sourceArg = flag(args, "source");
			const source = sourceArg === "codex" || sourceArg === "claude" ? sourceArg : null;
			const root = gitInfo(cwd).root;
			if (root !== null && !args.includes("--no-agents-md")) syncAgentsFile(root).catch(() => null);
			return runMcpServer({
				cwd,
				source,
				sessionId: flag(args, "session")
			});
		}
		case "agents-md": {
			const folder = folderArg(args);
			const file = await syncAgentsFile(folder, 8e3);
			return say(file === null ? "AGENTS.md is up to date (or this folder is not linked)." : `Updated ${file}`);
		}
		case "hook": return runHook(args[0] ?? "").catch(() => void 0);
		case "sync": return syncCommand(args);
		case "watch": return watch(args);
		default: {
			const run = CONNECT_COMMANDS[command];
			if (run === void 0) return say(HELP);
			const ctx = defaultContext();
			const parsed = parseArgs([command, ...args]);
			try {
				emit(ctx, parsed, await run(ctx, parsed));
			} catch (error) {
				emitError(ctx, parsed, error);
			}
			return;
		}
	}
};
main().catch((error) => {
	if (error instanceof RejectedError || error instanceof OfflineError) say(error.message);
	else say(error instanceof Error ? error.stack ?? error.message : String(error));
	process.exitCode = 1;
});
export {};
