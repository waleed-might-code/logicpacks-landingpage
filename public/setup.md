# Set up LogicPacks in your agent

You are an AI agent and your user asked you to set up LogicPacks. Follow these steps in order. Run the commands yourself when you can run shell commands; otherwise show each one to your user and ask them to run it.

LogicPacks lets your user share a project with teammates, see who is working on what, message teammates and their agents, plan goals and bring in experts. You use it through one small command line tool, `lp`.

## 1. Install the helper

Pick the line for the operating system you run on.

macOS and Linux (bash or zsh):

```sh
command -v lp || curl -fsSL https://logicpacks.io/helper.sh | bash
```

Windows (PowerShell):

```powershell
if (-not (Get-Command lp -ErrorAction SilentlyContinue)) { irm https://logicpacks.io/helper.ps1 | iex }
```

The helper needs Node.js 18 or newer (Claude Code, Codex and most agents already have it; otherwise install Node.js LTS from https://nodejs.org). It puts `lp` in `~/.local/bin` on macOS and Linux and in `%USERPROFILE%\.logicpacks\helper\bin` on Windows (`lp.cmd` for PowerShell and cmd, `lp` for Git Bash), and adds that folder to your PATH. If `lp` is not found right after installing, open a new shell or call it by its full path: `~/.local/bin/lp` or `%USERPROFILE%\.logicpacks\helper\bin\lp.cmd`.

## 2. Log in

Check first: `lp whoami`. If it says you are not signed in:

```sh
lp login --start
```

It prints a link and a short code and returns at once. Show both to your user and ask them to open the link and approve. Then run:

```sh
lp login --finish
```

It waits (up to 10 minutes) until they approve, then stores a token in `~/.logicpacks/`. A person in a terminal can simply run `lp login`. Teams with their own host add `--host https://their-host`.

## 3. Add the LogicPacks block to your global instructions

Run the command for your harness. It writes a short block between `<!-- logicpacks:start -->` and `<!-- logicpacks:end -->`, keeps the rest of the file as it is, and running it twice changes nothing.

```sh
lp setup --agent <id>
```

| Harness | id | Global instructions | Project file | Runs `lp` itself | MCP |
|---|---|---|---|---|---|
| Claude Code | `claude` | `~/.claude/CLAUDE.md` | `CLAUDE.md` | yes | yes |
| Codex CLI | `codex` | `~/.codex/AGENTS.md` | `AGENTS.md` | yes | yes |
| OpenCode | `opencode` | `~/.config/opencode/AGENTS.md` | `AGENTS.md` | yes | yes |
| Gemini CLI | `gemini` | `~/.gemini/GEMINI.md` | `GEMINI.md` | yes | yes |
| Command Code | `command-code` | `~/.commandcode/AGENTS.md` | `AGENTS.md` | yes | yes |
| Z.ai GLM Coding Plan | `zai` | `~/.claude/CLAUDE.md` | `CLAUDE.md` | yes | yes |
| Cursor | `cursor` | settings UI only | `.cursor/rules/logicpacks.mdc` | yes | yes |
| VS Code + GitHub Copilot | `copilot` | `~/.copilot/copilot-instructions.md` | `.github/copilot-instructions.md` | yes | yes |
| Windsurf | `windsurf` | `~/.devin/global_rules.md` | `AGENTS.md` | yes | yes |
| Cline | `cline` | `~/Documents/Cline/Rules/logicpacks.md` | `.clinerules/logicpacks.md` | yes | yes |
| Roo Code | `roo` | `~/.roo/rules/logicpacks.md` | `.roo/rules/logicpacks.md` | yes | yes |
| Kilo Code | `kilo` | settings UI only | `.kilo/rules/logicpacks.md` | yes | yes |
| Zed | `zed` | `~/.config/zed/AGENTS.md` | `.rules` | yes | yes |
| Continue | `continue` | settings UI only | `.continue/rules/logicpacks.md` | yes | yes |
| Aider | `aider` | `~/.aider.conf.yml (read: ~/.logicpacks/rules/logicpacks.md)` | `CONVENTIONS.md` | asks you | no |
| Amp | `amp` | `~/.config/amp/AGENTS.md` | `AGENTS.md` | yes | yes |
| Warp | `warp` | settings UI only | `AGENTS.md` | yes | yes |
| Kiro | `kiro` | `~/.kiro/steering/logicpacks.md` | `.kiro/steering/logicpacks.md` | yes | yes |
| Goose | `goose` | `~/.config/goose/.goosehints` | `.goosehints` | yes | yes |
| Qwen Code | `qwen` | `~/.qwen/QWEN.md` | `QWEN.md` | yes | yes |
| Crush | `crush` | `~/.config/crush/CRUSH.md` | `AGENTS.md` | yes | yes |
| Factory Droid | `droid` | `~/.factory/AGENTS.md` | `AGENTS.md` | yes | yes |
| JetBrains Junie | `junie` | `~/.junie/AGENTS.md` | `.junie/AGENTS.md` | yes | yes |
| Hermes Agent | `hermes` | settings UI only | `AGENTS.md` | yes | yes |
| T3 Code | `t3code` | settings UI only | `AGENTS.md` | yes | yes |
| Any other agent | `generic` | settings UI only | `AGENTS.md` | yes | yes |

Notes:
- **Codex CLI**: An AGENTS.override.md next to it wins over AGENTS.md; LogicPacks writes AGENTS.md.
- **Command Code**: commandcode.ai, CLI `cmd` (npm i -g command-code).
- **Z.ai GLM Coding Plan**: A model plan, not a harness: it runs inside Claude Code (or OpenCode, Cline, Codex...). Set up the harness you run GLM in; this target is Claude Code's.
- **Cursor**: Open Cursor Settings, then Rules (Customize > Rules). Under User Rules, add a rule and paste the LogicPacks block (lp setup-block prints it). User Rules live in the app only. Cursor also reads a root AGENTS.md.
- **VS Code + GitHub Copilot**: Personal *.instructions.md files go in ~/.copilot/instructions; AGENTS.md is read too (chat.useAgentsMdFile).
- **Windsurf**: Older installs read ~/.codeium/windsurf/memories/global_rules.md; pass --file for that one.
- **Kilo Code**: Open ~/.config/kilo/kilo.jsonc (Kilo Code settings). Add the rules file to "instructions", e.g. "instructions": ["~/.logicpacks/rules/logicpacks.md"] (lp setup --agent kilo writes that file). Global rules are listed in kilo.jsonc `instructions`; LogicPacks does not edit JSONC.
- **Continue**: Continue's docs name no global rules file; LogicPacks writes .continue/rules/logicpacks.md in this project. For every project, add the block as a rule in your Continue config (Hub or config.yaml `rules:`).
- **Aider**: Aider is not an agent loop: it asks you before running a command. Run the lp commands it suggests yourself.
- **Warp**: In Warp, open Warp Drive > Personal > Rules (or Settings > AI > Knowledge > Manage Rules). Add a Global rule and paste the LogicPacks block (lp setup-block prints it).
- **Goose**: Hints need the Developer extension, which is also what runs shell commands.
- **Factory Droid**: The docs say Droid looks in ~/.factory/; the exact global file name is unverified.
- **JetBrains Junie**: Older projects use .junie/guidelines.md, which Junie still reads.
- **Hermes Agent**: Hermes has no global instructions file (~/.hermes/SOUL.md is persona only). LogicPacks writes the block into this project's AGENTS.md, which Hermes reads.
- **T3 Code**: T3 Code runs the agents you have installed (Codex, Claude Code, OpenCode...) and has no file of its own. Set up each of those (lp setup --agent codex, --agent claude...); LogicPacks also writes this project's AGENTS.md.
- **Any other agent**: Pass the file your agent reads its instructions from: lp setup --agent generic --file <path>. Without --file, LogicPacks writes this project's AGENTS.md, which most agents read.
- Any other harness: `lp setup --agent generic --file <the file you read instructions from>`. If you would rather edit the file yourself, `lp setup-block` prints the block; paste it with its markers.
- To also write the project file (for example `AGENTS.md`), add `--project`.

The block is:

```markdown
<!-- logicpacks:start -->
## LogicPacks
Team work runs through the `lp` command (add `--json` to parse its output). If `lp` is missing, follow https://logicpacks.io/setup.md.
- At the start of a session and after long tasks, run `lp inbox` and tell the user what is new (messages, questions from other agents, conflicts, drift, review requests).
- "share this project" / "create a shared session" -> `lp share`, then give the user the invite link.
- "add my friend X" / "invite X" -> `lp invite <email or name>`.
- "what is X working on" -> `lp who X`; "who is working right now" -> `lp agents` (`--workspace` for every project).
- "tell X ..." -> `lp send X "<message>"`.
- To coordinate with a teammate's agent, use `lp ask <person> "<question>"` and `lp reply <id> "<answer>"`; check `lp inbox` for questions from other agents and answer them.
- "request assistance" / "get an expert" -> `lp assist request "<brief>"`.
- "set goals" / "plan milestones" / "ask X to do Y" -> `lp goals plan "<text>"`; then `lp goals list`, `lp goals done <milestone>`.
- "save this as a pack" -> `lp packs save "<name>"`; `lp packs list`, `lp packs use <id>`.
- Before you edit shared files, run `lp who <file or topic>`; if a teammate is on it, tell the user first.
- On a conflict or negotiation in `lp inbox`, answer with `lp reply <id>`; when it needs a person, ask the user, then `lp decide <id> mine|theirs|both`.
- If you cannot run shell commands, ask the user to run the `lp` command, or use the `logicpacks` MCP tools if they are set up.
- Everything else: `lp help agents` or https://logicpacks.io/setup.md. `lp uninstall` removes this block.
<!-- logicpacks:end -->
```

## 4. Share the project

If your user asked you to share the project they are in:

```sh
lp share
```

It pushes the folder to its git remote (it creates a private GitHub repository with `gh` when there is none), registers it on the LogicPacks host and prints an invite link. Give your user the link. To add a teammate by email: `lp invite friend@example.com`.

## 5. Every session from now on

- Run `lp inbox` at the start of a session and after long tasks. Tell your user about anything new. Each item lists the commands to act on it.
- Map your user's requests to commands with the block above. The full list:

```text
LogicPacks for agents. Every command prints readable text; add --json for machine output.

  lp login [--host <url>] [--start | --finish]                           sign in with a device code (default host app.logicpacks.io)
  lp whoami                                                              who you are signed in as, and on which host
  lp projects                                                            the projects you can open
  lp share [--title <name>]                                              share this folder: push it to its git remote (GitHub) and register it on the host; prints an invite link
  lp invite <email|name>                                                 add someone to this project, or print the invite link to send them
  lp join <invite link>                                                  accept an invite link from a teammate
  lp members                                                             who is in this project
  lp who [person|file|topic]                                             who is working on what in this project
  lp agents [--workspace]                                                active agents and sessions: person, harness, thread, current task
  lp send <person> "<message>"                                           message a teammate's thread; no reply expected
  lp ask <person> "<question>" [--project <id|name>]                     ask a teammate's agent; the reply comes back to your lp inbox
  lp reply <id> "<text>"                                                 answer a message, question or negotiation from lp inbox
  lp decide <negotiation id> accept|mine|theirs|both                     record your user's decision on a merge negotiation
  lp inbox [--follow] [--all]                                            messages, questions, conflicts, negotiations, drift and review requests for you
  lp editing <file...>                                                   tell teammates which files you are changing (lp who shows it; overlaps raise a notice)
  lp done <id>                                                           dismiss an inbox item you handled
  lp assist request "<brief>" [--expert <id>]                            Request assistance: bring in an expert (beta)
  lp assist experts | list | end <request id>                            the expert catalog, this project's requests, end a request
  lp packs save "<name>" | list | use <id> [--to <person>]               save this session as a pack, list packs, hand one to a thread
  lp goals plan "<text>" | list | show <id> | done <milestone> | review  plan milestones and send them to people's agents (beta)
  lp setup --agent <id> [--file <path>] [--project]                      write the LogicPacks block into an agent's instructions
  lp setup-prompt [--installed]                                          print the prompt to paste into any agent
  lp status | lp watch | lp link | lp unlink                             stream Claude Code and Codex sessions into the project
  lp mcp                                                                 the optional MCP server (stdio)
  lp uninstall                                                           remove every LogicPacks block, rules file, hook and MCP registration

Setup guide: https://logicpacks.io/setup.md
```

## Optional: MCP

If your user wants MCP tools as well, `lp install` registers the `logicpacks` MCP server (`lp mcp`, stdio) with Claude Code and Codex (and adds the Claude Code session hooks and the background watcher that stream sessions into the project). Other harnesses can add it by hand: command `lp`, args `["mcp"]`. The tools are a small subset of the CLI (who is working on what, send, ask, reply, conflicts, notes, packs). The CLI is the main way.

## Uninstall

```sh
lp uninstall
```

It removes every LogicPacks block and rules file `lp setup` wrote, the Claude Code hooks, the background watcher and the MCP registrations, and leaves the rest of each file exactly as it was. `lp logout` forgets the token.
