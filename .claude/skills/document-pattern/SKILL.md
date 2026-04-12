---
name: document-pattern
description: Document a newly implemented pattern into architecture skill — reads the relevant code, writes or updates the architecture resource, and updates the SKILL.md index
user-invocable: true
---

The user just implemented something and wants it documented in the architecture skills. Follow these steps:

## Step 1 — Understand what was implemented

If the user didn't describe it, ask: _What did you just implement, and which files are the key pieces?_

Read the relevant source files to understand:

- What problem it solves
- What the pattern looks like (class names, how to attach/use it)
- What the old approach was (if replacing something)
- Any important gotchas or constraints

## Step 2 — Find the right home

Check `architecture/SKILL.md` and its resource files. Decide:

- **Existing resource** — does this belong in an existing resource file (e.g. rendering, navigation, commands)?
- **New resource** — if it's a distinct system, create a new `.md` file in `.claude/skills/architecture/`

## Step 3 — Write or update the resource

Write clearly for a future Claude that has never seen this code:

- What it is and what problem it solves
- How to use it (class name, where it lives, how to attach)
- When to use it vs. alternatives
- What NOT to do (anti-patterns, removed systems)

Keep it dense — no padding. Use tables where there are multiple variants.

## Step 4 — Update SKILL.md

In `architecture/SKILL.md`:

- Add a link to the new/updated resource in the "See detailed notes in" list (if new file)
- Add a row to the "When to Use What" table if there's a clear "you want to X → use Y" mapping

Use the Obsidian wiki link format: `[[architecture/resource-name|Display Text]]`

## Step 5 — Confirm

Show the user what was written/changed and ask if anything is missing or needs adjustment.

## Related Skills

[[write-skills/SKILL|write-skills]] — skill format and conventions
[[architecture/SKILL|architecture]] — the skill being updated
