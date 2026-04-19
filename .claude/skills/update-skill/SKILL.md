---
name: update-skill
description: Update an existing skill when new information contradicts or significantly improves its guidance. TRIGGER when: a skill's guidance conflicts with something just learned or validated in the current conversation.
user-invocable: true
---

Update an existing skill in place when its guidance is contradicted, outdated, or significantly improvable.

## When to Use This Skill

- You just learned something that contradicts what a skill says
- A pattern was validated or rejected in the current conversation, and a skill should reflect that
- User explicitly asks to update or correct a skill

Do NOT rewrite a skill wholesale — make targeted edits only.

## Procedure

### Step 1 — Identify the skill and the delta

Name the skill and describe exactly what changed: what's wrong/outdated, and what should replace it. If auto-triggered, tell the user what you noticed before making any edits.

### Step 2 — Read the skill

Read `.claude/skills/<name>/SKILL.md` and any resource files that contain the relevant guidance.

### Step 3 — Assess change type

| Type | Action |
|------|--------|
| Contradiction | Replace or remove the outdated content |
| Significant improvement | Add or refine a section |
| Minor clarification | Edit in-place, minimal diff |
| Structural refactor | Discuss with user before editing |

### Step 4 — Edit

Apply the change following write-skills conventions: instructions first, specific, tightly scoped. Preserve all unaffected content exactly.

### Step 5 — Confirm

One-line summary: which skill, what changed, why.

## Related Skills

[[write-skills/SKILL|write-skills]] — skill format and conventions
