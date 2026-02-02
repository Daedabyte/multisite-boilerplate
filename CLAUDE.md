# CLAUDE.md - AI Assistant Guide

This document provides guidelines for AI assistants working with this Astro boilerplate, including agent delegation for specialized tasks.

## Agent Delegation

Route tasks to specialized agents based on the request type:

| Trigger | Agent | When to Use |
|---------|-------|-------------|
| Create page, layout, route, template | `page-scaffolder` | New pages, dynamic routes, layouts, content structures |
| Style, theme, CSS, SASS, colors, design | `brand-stylist` | Styling work, visual identity, design system, brand compliance |
| Write copy, content, headlines, CTAs | `content-writer` | Generating new content from scratch |
| Optimize, SEO, meta tags, conversion | `content-optimizer` | Reviewing/improving existing content |
| Form, analytics, schema, API, integration | `integration-wirer` | Third-party services, tracking, structured data |
| Review code, refactor, abstract, cleanup | `code-reviewer` | Code quality, duplication, architecture review |
| QA, audit, launch, test, accessibility | `qa-auditor` | Pre-launch checks, quality verification |
| Plan, tickets, tasks, breakdown | `plan-executor` | Converting plans to actionable tasks |
| Document, comments, JSDoc, guidelines, plan | `documentation-keeper` | Code docs, guideline updates, plan creation |

### Delegation Logic

```
1. Parse user request
2. Match against trigger keywords above
3. If match found -> Invoke appropriate agent
4. If multiple matches -> Primary task determines agent, note secondary agents needed
5. If no match -> Handle directly using guidelines below
```

### Multi-Agent Workflows

Some tasks require multiple agents in sequence:

| Workflow | Agent Sequence |
|----------|----------------|
| New page with content | `page-scaffolder` -> `content-writer` -> `brand-stylist` |
| New feature from plan | `plan-executor` -> [task-specific agents] -> `documentation-keeper` |
| Pre-launch | `qa-auditor` -> `content-optimizer` -> `code-reviewer` |
| Add integration | `integration-wirer` -> `qa-auditor` (verify) |
| Post-implementation | `code-reviewer` -> `documentation-keeper` |
| New pattern established | [implementing agent] -> `documentation-keeper` (update guidelines) |

### Agent Locations

Agent definitions should be stored in `.ai/agents/` (create as needed):

```
.ai/agents/
├── page-scaffolder.md
├── brand-stylist.md
├── content-writer.md
├── content-optimizer.md
├── integration-wirer.md
├── code-reviewer.md
├── qa-auditor.md
├── plan-executor.md
└── documentation-keeper.md
```

---

## Tools & Workflow

- **Dev Server**: `npm run dev`
- **Build**: `npm run build`
- **Preview**: `npm run preview`
- **TypeScript Check**: `npx astro check`

## Guidelines Reference

Read relevant guidelines before coding. Located in `.ai/guidelines/`:

| File | Contents | Used By Agents |
|------|----------|----------------|
| `project.md` | Contributing, best practices | All |
| `site.md` | Site setup, customization | `page-scaffolder`, `content-writer` |
| `components.md` | Component architecture | `page-scaffolder`, `code-reviewer` |
| `astro.md` | Astro patterns, imports, props | `page-scaffolder`, `code-reviewer` |
| `typescript.md` | TypeScript architecture | `page-scaffolder`, `code-reviewer` |
| `sass.md` | SCSS styling, color system | `brand-stylist` |
| `naming.md` | BEM, file naming | `brand-stylist`, `code-reviewer` |
| `data.md` | Content data patterns | `page-scaffolder`, `content-writer` |
| `integrations.md` | External integrations | `integration-wirer` |
| `branding.md` | Brand identity, visual guidelines, voice & tone | `brand-stylist`, `content-writer`, `content-optimizer` |
| `layout.md` | Layout patterns, grid, spacing | `page-scaffolder`, `brand-stylist` |

## Plans Reference

Implementation plans in `.ai/plans/` are consumed by `plan-executor`:

```
.ai/plans/
├── feature-name.md
└── migration-name.md
```

---

## Quick Start for New Sites

1. **Check for `site-blueprint.json`** - If exists, use it to drive setup
2. **Configure site data** - `src/data/config.ts`, `src/data/site/navigation.ts`
3. **Set brand colors** - `src/styles/abstracts/_colors.scss`
4. **Update types** - `src/types/`
5. **Create content/data** - `src/data/content/`
6. **Build pages** - `src/pages/`

## Path Aliases

```
@components -> src/components/
@data       -> src/data/
@types      -> src/types/
@assets     -> src/assets/
@styles     -> src/styles/
@scripts    -> src/scripts/
```

## Common Tasks -> Agent Routing

| Task | Agent | Location |
|------|-------|----------|
| Site metadata | Direct | `src/data/config.ts` |
| Navigation | Direct | `src/data/site/navigation.ts` |
| Page content data | `content-writer` | `src/data/content/*.ts` |
| Brand colors | `brand-stylist` | `src/styles/abstracts/_colors.scss` |
| Typography | `brand-stylist` | `src/styles/abstracts/_typography.scss` |
| New page | `page-scaffolder` | `src/pages/*.astro` |
| New section | `page-scaffolder` | `src/components/sections/*` |
| New UI element | `page-scaffolder` + `brand-stylist` | `src/components/ui/*` |
| New behavior | Direct | `src/scripts/behaviors/*` |
| Images | Direct | `src/assets/images/*` |
| Form setup | `integration-wirer` | Component + config |
| Analytics | `integration-wirer` | Layout head |
| Schema markup | `integration-wirer` | Page/layout |
| Pre-launch check | `qa-auditor` | Full site |
| Code cleanup | `code-reviewer` | Target files |

## Key Principles

- **TypeScript everywhere** - All JavaScript and data files use TypeScript
- **BEM class names** - Block__Element--Modifier pattern
- **Data attributes** - JavaScript behaviors via `data-*` attributes
- **Semantic HTML** - `<section>`, `<nav>`, `<article>`, etc.
- **Accessibility first** - ARIA attributes, focus management, keyboard support

## Keeping Types in Sync

When modifying brand colors in `src/styles/abstracts/_colors.scss`, update TypeScript types in `src/types/components.ts`:

```scss
// _colors.scss
$brand-colors: (
    'primary': #E8871E,
    'secondary': #008148,
    'accent': #FF6B6B,  // New color
);
```

```typescript
// src/types/components.ts
export type BrandColor =
  | 'primary'
  | 'secondary'
  | 'accent';  // Add here too
```

---

## Documentation Protocol

Use `documentation-keeper` agent for documentation tasks, or when told "document this", add to:
1. `CLAUDE.md` - If workflow/agent related
2. `.ai/guidelines/[file].md` - Technical patterns
3. `.ai/plans/[file].md` - Implementation plans

## CONTEXT.md

`CONTEXT.md` is for temporary context:
- **Input**: External content, errors for debugging, data to incorporate
- **Output**: Structured communication back to user

---

## Agent Quick Reference

| Agent | Primary Skill |
|-------|---------------|
| `page-scaffolder` | Structure & routing |
| `brand-stylist` | Visual design & CSS |
| `content-writer` | Copy generation |
| `content-optimizer` | SEO & conversion |
| `integration-wirer` | Third-party services |
| `code-reviewer` | Code quality |
| `qa-auditor` | Quality assurance |
| `plan-executor` | Task breakdown |
| `documentation-keeper` | Docs & guidelines |
