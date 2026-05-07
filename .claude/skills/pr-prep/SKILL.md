---
name: pr-prep
description: Generate a commit message and PR description from current branch changes. Use when the user asks for a commit message, PR description, or both.
user-invocable: true
---

Generate a commit message and PR description for the current branch changes.

## Procedure

### Step 1 — Read the diff

Run these in parallel:
- `git diff HEAD` — full diff of all changes
- `git log main..HEAD --oneline` — commits on this branch (if any)
- `git diff --stat HEAD` — file summary

### Step 2 — Commit message

One subject line, 50 chars or fewer. Use the conventional commits prefix that fits:
- `feat:` — new capability
- `fix:` — bug fix
- `refactor:` — restructure without behaviour change
- `chore:` — tooling, deps, config

Add a short body (2–4 lines) only when the subject line can't capture the why or key tradeoffs. Wrap at 72 chars. Skip the body for trivial changes.

### Step 3 — PR description

Use this exact format:

```
## Summary
<1–3 tight bullet points — what changed and why, not how>

## Test plan
- [ ] <each testable behaviour, one checkbox per item>
```

Keep bullets concrete. "Add X" or "Replace Y with Z" beats "various improvements."
The test plan should cover the happy path and any edge cases introduced by the change.

### Step 4 — Output

Present both blocks clearly labelled so the user can copy them directly. Do not commit or create the PR — just output the text.
