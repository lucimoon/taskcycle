---
name: write-skills
description: Guide for creating new Claude Code skills — format, structure, and conventions including Obsidian linking
user-invocable: true
---

Help the user create a new Claude Code skill.

## What a Skill Is

A skill is a markdown file that loads focused instructions or context into Claude when invoked. Skills let you extend Claude's behavior for recurring tasks without restating the same context each time.

## File Structure

Skills live in the Claude config directory:

```
.claude/
  skills/
    your-skill-name/
      SKILL.md
```

The directory name must match the `name` field in frontmatter.

### Resource Files

When a skill covers a large topic, split detailed content into **resource files** — plain markdown files in the same skill directory. `SKILL.md` acts as a table of contents with brief descriptions; each resource holds one focused chunk of detail.

```
.claude/
  skills/
    your-skill-name/
      SKILL.md          ← index + overview; links to resources
      resource-name.md  ← detailed content
      another-topic.md
```

Use resources when:
- A section is large enough to obscure the skill's overall structure
- A chunk of content is only relevant in specific contexts (not every invocation)
- You want to link to a specific sub-topic from another skill

Link to resource files from `SKILL.md` using an Obsidian wiki link without the `.md` extension:

```
[[skill-name/resource-name|display text]]
```

## Frontmatter

Every `SKILL.md` requires frontmatter:

```yaml
---
name: skill-name          # kebab-case, matches the directory name
description: One-line description — shown in the skill list and used by Claude to decide relevance
user-invocable: true      # omit or set false if the skill loads only via triggers, not slash commands
---
```

## Writing Good Skill Content

- **Lead with what Claude should do**, not with background info — instructions first
- **Be specific**: vague content produces vague behavior
- **Scope tightly**: one skill = one focused purpose; split large skills rather than bloating one
- **Include a Coaching section** when the skill supports a multi-turn workflow (e.g., interview prep)
- **Use headers** to organize distinct chunks: context, instructions, examples, coaching

## Linking Skills in Obsidian

When a skill references or builds on another, add an Obsidian wiki link. This enables graph visualization across the vault.

Because all skill files are named `SKILL.md`, use the folder name to disambiguate:

```
[[skill-name/SKILL|skill-name]]
```

The folder name makes the link unique; the display text after `|` keeps it readable.

**Link when:**
- This skill is designed to be used *alongside* another (e.g., `[[bullet-points/SKILL|bullet-points]]` pairs with any interview prep skill)
- This skill provides context that another skill depends on (e.g., `[[rula-job/SKILL|rula-job]]` underpins `[[rula-recruiter/SKILL|rula-recruiter]]`)
- A user reading this skill would benefit from knowing the other exists

**Do not link** just because two skills share a domain — link when there is a meaningful functional relationship.

Place links in a `## Related Skills` section at the bottom.

## Trigger Conditions

If your skill has a specific trigger (not just a slash command), document it in the description:

```
TRIGGER when: <condition>. DO NOT TRIGGER when: <condition>.
```

## Checklist

- [ ] Directory name matches `name` in frontmatter
- [ ] `description` is specific enough to distinguish this from similar skills
- [ ] Content tells Claude *what to do*, not just what to know
- [ ] Large topics are split into resource files; `SKILL.md` links to them
- [ ] Related skills are linked with `[[wiki links]]`
- [ ] Trigger condition is documented if applicable
