// Sections 5 to 7 of /safety.md: sharing, secrets and removing access. Written from a
// read of the v2 server, web app and helper code (feat/v2 f988b48805, feat/v2-connect
// 1f0f438734) on 2026-11-01. Update this file when that behaviour changes.

export const SERVER_SAFETY = `## 5. What teammates can see

Sharing has two levels:

- **One project.** "Share" on a project (or \`lp invite <email>\`) adds a person to that project only. They see that project's threads and files.
- **A workspace.** A workspace invite link (what \`lp share\` and \`lp invite\` print, and "Invite your team" in the app) makes the person a workspace member, and members work in **all** of that workspace's projects. Use a separate workspace for work you do not want everyone in it to see.

What streams from your computer:

- The helper sends Claude Code and Codex sessions whose folder is inside a shared project (or is a clone with the same git remote). Sessions in other folders are not stored by the host. The helper does send a session's first batch before the host answers that it belongs to no project, and it retries unmatched sessions, so a folder added to a project later brings that session's earlier history with it.
- **A streamed session includes its tool calls, MCP calls too**: the tool name, its input (up to about 300 characters) and a summary of its result (up to about 1,500 characters), alongside your prompts and the agent's replies. Anyone who can see the project can read them. There is no automatic redaction.
- So keep sessions that use sensitive tools (messaging, email, analytics, account or admin tools) out of shared project folders, or keep them private with \`lp unlink <folder>\` (that folder and its subfolders, on this computer) or \`lp pause\` (everything, until \`lp resume\`). While paused or unlinked, nothing from that time is sent later.

What teammates cannot do:

- Run your local agent, your MCP servers or your tools. Each person's agent runs on their own login, on their own computer or in their own cloud seat. Teammates can send messages and questions to your agent's thread (\`lp send\`, \`lp ask\`), and your agent sees their thread titles and the files they are editing as project context.
- Use your model login. By default each member's cloud turns run only on the login that member connected. The one exception is "Share my agent login" in Request assistance, which lets that expert run turns on your login in that one project until you revoke it (section 7).

## 6. Secrets and access to files

- A member reaches only their own folder, the projects shared with them and those projects' worktrees. Every request is checked against their current role. Host-level actions are refused, and terminals are off for members.
- On the LogicPacks cloud (app.logicpacks.io), each member's agent runs as its own Unix user with a scrubbed environment (no host credentials, no GitHub token, no SSH agent). Checks: [/research.md](/research.md) (Member sandbox). This applies to the LogicPacks cloud. A machine you host yourself is your own: its owner and admins can reach everything on it.
- **A member can read everything in a shared project folder, including \`.env\` and key files.** Experts from Request assistance join as ordinary project members, so the same applies to them. Neither files nor pasted text are filtered or redacted for them today.
- Keep secrets out of shared projects: use \`.gitignore\` for \`.env\` and key files, keep them outside the project folder, or use a secrets manager. Do not paste keys into a shared thread. \`lp share\` pushes the project to its GitHub remote, so anything committed is in that repository as well.
- Do not put access to other machines (servers, home lab, VPN, SSH keys) in a shared project.

## 7. Removing someone, and how fast it takes effect

- **From a project:** open the project's "Share" dialog (sidebar, project menu), then "Remove" next to the person. Only the owner can do this. It removes a direct share only: a person who is also a member of the workspace keeps access through the workspace.
- **From a workspace:** workspace menu, "Manage workspace", "People", "Remove" (owner only). This removes their workspace membership and every project share they had in that workspace.
- **An invite link:** "Manage workspace", "Advanced", "Reset invite link". The old link stops working ("This invite link has expired"); people who already joined stay until you remove them.
- **An expert (Request assistance):** "End session" in the Request assistance panel, or \`lp assist end <request id>\`. It revokes their use of your login and removes them from the project if that request is what added them.
- **A shared agent login:** "Revoke login" in the Request assistance panel. Their next turn on your login is refused; their project membership stays until you end the session.
- **From the command line:** \`lp members\` lists who is in the project. Removing people is done in the app; there is no \`lp\` command for it.
- **Timing:** removal applies to the person's next request (each request checks their current access), and their helper can no longer stream into the project. An agent turn that is already running is not stopped and keeps its access until it ends. Removal does not touch GitHub: LogicPacks does not add teammates as collaborators on your repository, and any copy a person already cloned stays with them.

## In the next release (built, not live yet)

These are built and ship with LogicPacks 0.1.9. Until then, sections 5 to 7 describe what is live.

- Experts: \`.env\` and key files hidden from them, pasted secrets redacted, and their work scoped by goals and milestones.
- Session streaming: secrets (API keys and tokens, private keys, passwords in commands, config and connection strings) are redacted on your computer before anything is sent. MCP tool calls stream as the tool name only (opt in per folder with \`lp stream --mcp-details on\`). Reading \`.env\`, key, credential or \`.ssh\` files sends the path only, never the content. \`lp stream --status\` shows exactly what a folder sends.
- Invites: \`lp share\` and \`lp invite\` print a link for this project only; the workspace link needs \`--workspace\`. \`lp revoke-invite\` resets a link or cancels one pending invite.
- Command line: \`lp remove <person>\` (from the project and workspace, or \`--project-only\`) and \`lp revoke-invite\` (see section 4 for the other helper changes).
`;
