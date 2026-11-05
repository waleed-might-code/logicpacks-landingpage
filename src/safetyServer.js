// Sections 5 to 7 of /safety.md: sharing, secrets and removing access. Written from a
// read of the v2 server, web app and helper code (LogicPacks 0.1.9 code; copy updated for 0.1.11) on
// 2026-11-01. Update this file when that behaviour changes.

export const SERVER_SAFETY = `## 5. What teammates can see

Sharing has two levels:

- **One project.** "Share" on a project, \`lp invite <email>\`, and the invite link that \`lp share\` and \`lp invite\` print add a person to that project only. They see that project's threads and files.
- **A workspace.** A workspace invite link ("Invite your team" in the app, or \`lp invite --workspace\`) makes the person a workspace member, and members work in **all** of that workspace's projects. Use a separate workspace for work you do not want everyone in it to see.

What streams from your computer:

- The helper sends Claude Code and Codex sessions whose folder is inside a shared project (or is a clone with the same git remote). Sessions in other folders are not stored by the host. The helper does send a session's first batch before the host answers that it belongs to no project, and it retries unmatched sessions, so a folder added to a project later brings that session's earlier history with it.
- **A streamed session includes its tool calls**: the tool name, its input (up to about 300 characters) and a summary of its result (up to about 1,500 characters), alongside your prompts and the agent's replies. Anyone who can see the project can read them.
- **Redaction happens on your computer, before anything is sent:** secrets (API keys and tokens, private keys, passwords in commands, config and connection strings) are replaced with \`[redacted]\`. MCP tool calls stream as the tool name only, unless you opt in per folder with \`lp stream --mcp-details on\`. Reading \`.env\`, key, credential or \`.ssh\` files sends the path only, never the content. \`lp stream --status\` shows exactly what a folder sends. This is the helper from 2026-11-01 on; an older install sends tool calls without redaction, so run the install line again.
- Redaction matches known secret shapes, so it can miss some. Keep sessions that use sensitive tools (messaging, email, analytics, account or admin tools) out of shared project folders, or keep them private with \`lp unlink <folder>\` (that folder and its subfolders, on this computer) or \`lp pause\` (everything, until \`lp resume\`). While paused or unlinked, nothing from that time is sent later.

What teammates cannot do:

- Run your local agent, your MCP servers or your tools. Each person's agent runs on their own login, on their own computer. Teammates can send messages and questions to your agent's thread (\`lp send\`, \`lp ask\`), and your agent sees their thread titles and the files they are editing as project context.
- Use your model login. Each member's turns run only on the login that member has on their own computer.

## 6. Secrets and access to files

- A member reaches only their own folder, the projects shared with them and those projects' worktrees. Every request is checked against their current role. Host-level actions are refused, and terminals are off for members.
- When you share a project, the host is your own laptop: its owner can reach everything on it, and teammates connect and sync to it while it is on. Our cloud, where each member's agent would run as its own isolated user with a scrubbed environment (no host credentials, no GitHub token, no SSH agent), is coming soon and is not available yet. Checks of that design: [/research.md](/research.md) (Member sandbox).
- **A public share link goes through our relay.** The Share dialog can give a link on logicpacks.io. Your app opens one outbound connection to a relay we run, and the link is a random name that reaches only the join and sign-in pages until someone joins. While it forwards traffic, the relay can technically see it (pages, files, messages): the connection is encrypted to Cloudflare and to our relay, and there is no end-to-end encryption between a teammate and your computer. The relay does not store contents and logs only a short host id, status, size and time per request. Treat the relay and Cloudflare as trusted for what you share, or share on your own network instead. Stopping the share, or removing a person, cuts their access and closes their open connections at once.
- **What the sandbox covers.** On a Mac host, Claude turns and terminals for people you share with run inside an operating-system sandbox limited to the shared folders. Codex and OpenCode keep their tool limits only. A Windows host has no sandboxed compute: people you share with get the agent's tool limits, and a terminal for them runs as your Windows user, so leave Compute off unless you trust them.
- **A member can read everything in a shared project folder, including \`.env\` and key files.** Neither files nor pasted text are filtered or redacted for them.
- Keep secrets out of shared projects: use \`.gitignore\` for \`.env\` and key files, keep them outside the project folder, or use a secrets manager. Do not paste keys into a shared thread. \`lp share\` pushes the project to its GitHub remote, so anything committed is in that repository as well.
- Do not put access to other machines (servers, home lab, VPN, SSH keys) in a shared project.

## 7. Removing someone, and how fast it takes effect

- **From a project:** open the project's "Share" dialog (sidebar, project menu), then "Remove" next to the person. Only the owner can do this. It removes a direct share only: a person who is also a member of the workspace keeps access through the workspace.
- **From a workspace:** workspace menu, "Manage workspace", "People", "Remove" (owner only). This removes their workspace membership and every project share they had in that workspace.
- **A workspace invite link:** "Manage workspace", "Advanced", "Reset invite link". The old link stops working ("This invite link has expired"); people who already joined stay until you remove them.
- **A project's invite link:** the project's "Share" dialog turns the link off or resets it; \`lp revoke-invite\` does the same from the command line (\`lp revoke-invite <email>\` cancels one pending invite).
- **From the command line:** \`lp members\` lists who is in the project; \`lp remove <person>\` removes them from the project and its workspace (\`--project-only\` for just the project, \`--dry-run\` to see what it would do).
- **Timing:** removal applies to the person's next request (each request checks their current access), and their helper can no longer stream into the project. An agent turn that is already running is not stopped and keeps its access until it ends. Removal does not touch GitHub: LogicPacks does not add teammates as collaborators on your repository, and any copy a person already cloned stays with them.

## 8. Agent logins and code
- **Agents run on your own computer.** The app (Mac or Windows) uses the Claude Code or Codex CLI that is already installed and logged in on your machine. There is no "Log in with Claude" in the app; if the CLI is missing, the app shows the install command and tells you to log in in your terminal. Nothing of that login is stored on our servers.
- **Sharing is host-based:** teammates connect and sync to the host's laptop while it is on. The project lives on the host's laptop.

### Our cloud (coming soon, not available yet)

Our cloud is not live. The following describes how it is designed, so you can judge it ahead of time:

- **Cloud logins:** a stored agent login would be kept for your account only and encrypted at rest (AES-256-GCM, with a key per member derived from a host key that is not part of any backup), decrypted only while your agent runs in the cloud and sealed again when it stops. This protects copies of the disk and backups; the host's administrator, who holds the key, could still read it. No API or screen would show one member's login to another member.
- **Each member runs separately:** each member's agent runs in its own sandbox.
- **Your code:** a project created from scratch in the cloud has no GitHub copy until you sync it, and thread history is stored in the cloud only.
`;
