# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start dev server
npm run build     # tsc + vite build
npm run lint      # eslint
npx tsc --noEmit  # type-check only (no test suite exists)
```

## Architecture

Single-page React app (Vite + TypeScript + Chakra UI v3). No routing — two views (`today` / `all`) are toggled via `useState` in `App.tsx`.

### Data model

`Todo` is a recursive tree: each node has `children: Todo[]`. The entire tree is stored flat in `localStorage` under `just-to-do-items` and loaded via a `migrate()` guard. `TaskMeta` (difficulty, estimatedMinutes, focusRequired) is optional on each node — its presence controls whether meta tags are rendered.

### State

All todo state lives in `useTodos` (`src/hooks/useTodos.ts`). Key internals:
- `mapNode` — recursive tree updater by id
- `autoCompleteParent` — one-level-only: completes a direct parent when all its children are done
- `reparentItem` — removes a node and re-inserts it at (parentId, index) for DnD drops
- `filter` / `filteredTodos` are returned but currently unused in the UI (filter UI was removed)

### Views

**Today mode** (`TodayView` → `TaskCard`): calls `getRecommendations(todos, energy)` which scores and buckets incomplete items into `doNow` / `easyPicks` / `defer`. Energy level (`low`/`normal`/`high`) is persisted via `useEnergy` (localStorage). Scoring weights are in `src/lib/recommendation.ts`.

**All todos** (`TodoList` → `TodoItem`): DnD is handled by `@dnd-kit`. `TodoList` flattens the tree with depth metadata, runs a `calcProjected` function to resolve the drop target's new (parentId, index) from cursor X-delta, then calls `reparentItem`. Items are visually grouped by root ancestor — each depth-0 item and all its descendants are wrapped in a single card `Box`. `{...listeners}` are spread on the item's outer Box (no separate handle) with `touchAction: none` and activation constraints (`distance:5` mouse, `delay:250ms` touch).

### Component responsibilities

- `TodoItem` — inline text edit (native `<input>`, transparent, auto-save on blur), expandable `MetaInput` panel toggled by `...` button, delete inside that panel
- `MetaInput` — difficulty/time/focus selectors; time has preset select + optional custom numeric input
- `EnergySelector` — persisted to localStorage via `useEnergy`
- `useStreak` — tracks daily completion streaks in localStorage

### Path alias

`@/` maps to `src/` (configured in `vite.config.ts`).

### UI library

Chakra UI v3 (`@chakra-ui/react@^3`). Uses semantic color tokens (`bg.panel`, `bg.subtle`, `fg.muted`, `border.subtle`) — prefer these over hardcoded colors. `defaultSystem` is passed as the ChakraProvider value (no custom theme).
