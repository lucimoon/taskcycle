---
name: milestone
description: Complete or add a milestone in a docs/ plan file. Completing checks it off and moves it to a completed section in completion order. Adding inserts a new milestone following the established format.
user-invocable: true
---

Two operations: **complete** a milestone, or **add** a new one. Determine which from context or ask.

---

## Operation: Complete a Milestone

Mark a milestone done and reorganise the plan doc so completed milestones are visually separated and ordered by completion sequence (not planned sequence).

### Step 1 — Identify the plan file and milestone

If the user named the milestone (e.g. "complete M5" or "mark Alerts done"), confirm the match before editing. If the plan file is ambiguous, ask which `docs/*-plan.md` to use.

Read the plan file.

### Step 2 — Update the TOC

The Milestones section at the top of the doc must be split into two subsections if not already:

```markdown
## Milestones

### To Do

1. [Milestone 6 — Themes](#milestone-6--themes)
2. [Milestone 7 — Scheduling Enhancements](#milestone-7--scheduling-enhancements)
...

### Completed

- ✅ [Milestone 5 — Alerts](#milestone-5--alerts) — 2026-04-17
```

Rules:
- Remove the completed milestone from **To Do** and append it to the bottom of **Completed**, in the order it was completed (most recent last).
- Renumber the **To Do** entries sequentially (1, 2, 3…) after removal. The section bodies keep their original `## Milestone N` headings — only the TOC numbers change.
- If **To Do** / **Completed** subsections don't exist yet, create them. Move all existing ✅ entries into **Completed** (preserve their relative order from the list), and put the rest in **To Do**.
- Add today's date (from `currentDate` in context) to the completed entry.

### Step 3 — Update the milestone section heading

Find the `## Milestone N — Name` heading for the completed milestone. Add a ✅ and completion date on the line immediately below the heading:

```markdown
## Milestone 5 — Alerts

✅ Completed 2026-04-17
```

Do not alter any other content in the section.

### Step 4 — Confirm

Tell the user what changed (which milestone, new TOC order, any renumbering). Keep it brief.

---

## Operation: Add a Milestone

Insert a new milestone into the plan doc following the existing format.

### Step 1 — Gather details

Ask (or infer from context):
- What is the milestone name?
- What is the one-sentence goal?
- Where does it fit in the sequence (after which milestone, or at the end)?
- Any known dependencies on other milestones?

Read the plan file to understand existing structure and numbering.

### Step 2 — Write the milestone section

Append or insert a new section following the doc's established format. Minimum structure:

```markdown
## Milestone N — Name

**Goal:** One sentence.

### New Files

*(list new files, or omit section if none)*

### Changes to Existing Files

*(list affected files and what changes)*

### Implementation Notes

*(optional: key decisions, edge cases, gotchas)*

### Done When

Observable, unambiguous condition that confirms this milestone is complete.
```

Match the level of detail used by nearby milestones in the same doc.

### Step 3 — Update the TOC

Add the new milestone to the **To Do** subsection of the Milestones list at the correct position. If To Do / Completed subsections don't exist, create them first (see completing rules above).

### Step 4 — Confirm

Show the user the new section and TOC entry. Ask if anything needs adjusting.

---

## Related Skills

[[write-skills/SKILL|write-skills]] — skill format and conventions
[[new-project/SKILL|new-project]] — creating a full plan from scratch
