# Realm Builder — Claude Code Project Guide

## What the game is
Realm Builder is a browser-based incremental city-builder game written in vanilla HTML, CSS, and JavaScript with no dependencies and no build step. The player places buildings to generate resources (gold, food, workers, faith), trades goods at the shop, responds to random events that can help or hurt their city, and eventually prestiges to restart with permanent multiplier bonuses. The entire game loop runs client-side via a `setInterval` tick and all state lives in a single global object.

## Source of truth
**`city-builder.html` is the canonical working source until the split is complete.** If there is any ambiguity about how a feature works, read that file first. The files under `js/` and `css/` are placeholders until each section is extracted. Do not treat the placeholder files as authoritative.

## Key data structures

### `G` — global game state object
The single source of truth for all runtime state. Lives in `js/game.js` (currently inline in `city-builder.html`). Key fields include:
- `G.gold`, `G.food`, `G.workers`, `G.faith` — primary resources
- `G.population`, `G.maxPop` — population cap
- `G.buildings` — object mapping building id → count owned
- `G.day`, `G.season`, `G.year` — in-game time
- `G.speed` — current tick multiplier (0 = paused)
- `G.prestigeLevel`, `G.prestigeBonus` — prestige state
- `G.log` — array of recent event/action strings shown in the log panel

### `BUILDINGS` — building data array
Array of objects, each defining one purchasable building type. Each entry has: `id`, `name`, `icon`, `cost` (object), `produces` (object of resource deltas per tick), `requires` (unlock conditions), and `description`.

### `EVENT_POOL` — random event definitions
Array of event objects drawn from during the game tick. Each entry has: `id`, `text` (display string), `condition` (optional function), `effect` (function that mutates `G`), and `weight` (probability weight).

### `TRADE_ITEMS` — shop inventory
Array of tradeable goods. Each entry has: `id`, `name`, `buyPrice`, `sellPrice`, and which resource it maps to. Drives the shop tab UI.

## Key functions

| Function | Location (planned) | What it does |
|---|---|---|
| `gameTick()` | `js/game.js` | Main loop callback. Advances time, applies building production, triggers random events, calls `calcStats()` and `updateUI()`. |
| `calcStats()` | `js/game.js` | Recalculates derived values (income rates, population cap, unlock states) from current `G` and `BUILDINGS`. |
| `buildBuilding(id)` | `js/buildings.js` | Deducts cost, increments `G.buildings[id]`, calls `calcStats()` and `updateUI()`. |
| `setSpeed(n)` | `js/game.js` | Sets `G.speed`, restarts the `setInterval` at the new rate. `0` pauses. |
| `switchTab(name)` | `js/ui.js` | Shows the named panel, hides others, updates active tab highlight. |

## Planned module split
When extraction is complete, each file will own the following:

| File | Owns |
|---|---|
| `js/game.js` | `G` object initialisation, `gameTick()`, `calcStats()`, `setSpeed()`, the `setInterval` handle |
| `js/buildings.js` | `BUILDINGS` array, `buildBuilding()`, build-card render function |
| `js/trade.js` | `TRADE_ITEMS` array, `doSell()`, `doBuy()`, `renderShop()` |
| `js/events.js` | `EVENT_POOL` array, `resolveEvent()` |
| `js/ui.js` | `updateUI()`, `switchTab()`, `toast()`, `addLog()` |
| `js/canvas.js` | `<canvas>` skyline renderer, `generateSprites()`, `drawCity()` |
| `js/prestige.js` | `tryPrestige()`, prestige confirmation dialog, restart sequence |
| `css/main.css` | All layout, panel, card, typography, and colour styles |
| `css/animations.css` | All `@keyframes` blocks |

## How to test
Open `index.html` (or `city-builder.html` during the transition) directly in a browser — no server, no build step, no install required. After any change:
1. Hard-refresh the browser (`Ctrl+Shift+R` / `Cmd+Shift+R`).
2. Open the browser console and confirm there are no JS errors on load.
3. Let the game run for several ticks and confirm resources are changing correctly.
4. Click through every tab (Build, Trade, Events, Prestige) to check for regressions.

## Rules for Claude Code
- **One feature at a time.** Do not bundle unrelated changes into a single session. Finish and verify one thing before moving on.
- **Always test in the browser after each change.** Type checking and linting are not substitutes for running the game.
- **Never remove existing logic unless explicitly told to.** If something looks dead or redundant, flag it as a comment or ask — do not silently delete it.
- **Keep `G` as the single state source.** Do not introduce module-level variables that shadow or duplicate fields in `G`.
- **No build tooling.** Do not add webpack, Vite, npm scripts, or any other toolchain without explicit approval. Scripts are loaded via plain `<script>` tags.
- **No external libraries.** Vanilla JS and CSS only.
