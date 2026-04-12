---
name: new-project
description: Interview the user about a new project and write a milestone plan into docs/
user-invocable: true
---

The user wants to plan a new project. Run a short interview, then write a structured milestone plan into `docs/`.

## Step 1 — Get the project description

Ask: _What are you building? Give me a rough description of the project — its goal, the player/user experience, and anything you already know about the scope._

Wait for their answer before continuing.

## Step 2 — Ask about systems

Based on what they described, name the high-level systems you can infer will be needed. Then ask:

- Are any of these wrong or out of scope?
- Are there systems you have in mind that I haven't named?
- Are there any systems that already exist in the codebase that should be reused?

Wait for their answer. Read any relevant existing files if they reference codebase systems.

## Step 3 — Confirm milestone structure

Ask:

- Do you have a rough ordering in mind, or should I propose a dependency-driven sequence?
- Any hard constraints — scope limits, things explicitly out of scope, or must-haves for the first milestone?

Wait for their answer.

## Step 4 — Write the plan

Write `docs/<project-slug>-plan.md` using this format:

```
# <Project Name> Roadmap

Living reference for <brief description>. Each milestone has a "done when" so progress is unambiguous. Work in dependency order — later milestones build on earlier ones.

---

## Milestone 1 — <Name>

**Goal:** One-sentence summary.

### New Files

**`path/to/file.gd`** (Type)

- Field or method details
- ...

### Changes to Existing Files

- **`path/to/existing.gd`** — what changes and why

### Reuse

- `path/to/system.gd` — why it applies

### Done When

Unambiguous, observable condition that confirms this milestone is complete.

---

## Milestone N — ...

...

---

## Existing Systems Reference

| System | File | Used In |
| ------ | ---- | ------- |
| Name   | `path/to/file.gd` | Milestones X, Y |
```

Omit sections that don't apply to a given milestone (e.g. no "Reuse" if nothing existing applies).

Include a list of links to to each milestone at the top of the doc.

After writing, confirm with the user and ask if anything needs adjusting.

## Related Skills

[[write-skills/SKILL|write-skills]] — skill format and conventions
[[hbc-architecture/SKILL|hbc-architecture]] — existing system patterns to reference when identifying reuse
