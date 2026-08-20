# org-skills-cli

An internal CLI that adds an organization's own governance layer — an approved-skills allowlist, a local install registry, and search — in front of [`skills`](https://www.npmjs.com/package/skills) (a.k.a. "skills.sh"), the open-source CLI from [Vercel Labs](https://github.com/vercel-labs/skills) that fetches and wires up skills for agents like Claude Code and Codex.

This started as a proof of concept for a simple idea: rather than forking or reimplementing `skills.sh`, wrap it — so an org can plug in its own policy (an allowlist of approved skills, a private source of truth, an audit trail of what's installed where) while still relying on the upstream tool to do the actual fetching and wiring.

## How it fits together

```
org-skills add <skill>
        │
        ▼
lib/wrapper.js
  1. looks up <skill> in lib/approved-skills.js (the allowlist)
  2. shells out to `npx skills add <source> --skill <skill> -a claude-code -a codex`
  3. records the install in registry.json via lib/registry.js
```

- **`bin/org-skills.js`** — CLI entry point (built on [Commander](https://github.com/tj/commander.js)). Defines the `add`, `list`, and `search` commands.
- **`lib/approved-skills.js`** — the allowlist. Maps a skill name to the internal source repo it's allowed to be installed from. This is the org-specific policy layer — edit this file to approve new skills.
- **`lib/wrapper.js`** — rejects any skill not on the allowlist, then invokes the upstream `skills.sh` CLI (`npx skills add ...`) to perform the install.
- **`lib/registry.js`** — writes/reads a local `registry.json` tracking which skills have been installed into the current project and when.
- **`lib/search.js`** — searches the allowlist by name.

## Commands

```bash
# Install an approved skill (rejects anything not on the allowlist)
org-skills add <skill>

# List skills already installed/registered in this project
org-skills list

# Search the approved skills list by name
org-skills search <query>
```

## Requirements

- Node.js
- Network access to `npx skills` (the upstream Vercel Labs CLI) and to the internal source repos referenced in `lib/approved-skills.js`

## Adding a new approved skill

Add an entry to `APPROVED_SKILLS` in `lib/approved-skills.js` mapping the skill name to its source repo:

```js
const APPROVED_SKILLS = {
  'my-new-skill': 'org/my-skills-repo',
};
```

## Attribution

All skill-fetching, source resolution, and agent-wiring logic belongs to [vercel-labs/skills](https://github.com/vercel-labs/skills), distributed under its own MIT License. This project depends on it as a declared npm package (see `package.json`) and calls it as a subprocess — it is never copied or vendored.

## Status

Proof of concept — validates that `skills.sh` can be wrapped to enforce org-specific policy (an allowlist, install tracking) without forking or reimplementing the upstream tool.