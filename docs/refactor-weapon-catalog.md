# Refactor Plan: `src/weapon-catalog.ts`

Focus: maintainability, separation of concerns, readability. Keep behavior identical at each step. Small, verifiable deltas.

## Goals
- clear boundaries: state, routing, UI building, data access, lifecycle
- fewer magic numbers; central layout/theme
- predictable header/nav; fewer scattered updates
- easy cleanup; no UI leaks
- simpler event handling; less string parsing

## Target architecture (condensed modules)
- `weapon-catalog.ts` (orchestrator + public API: open/close/onUIButtonEvent)
- `weapon-catalog.state.ts` (state model + router/back stack + pure transitions)
- `weapon-catalog.view.ts` (UI registry + constants (LAYOUT/THEME) + header + sidebar + pages + event id helpers)
- (reuse) `src/weapons.ts` for data access

Note: 3 files total (plus existing weapons.ts). Keeps boundaries without fragmentation.

## Step-by-step

1) Extract constants (layout/theme) — DONE
- Moved magic numbers/colors into `weapon-catalog.view.ts` constants section (LAYOUT/THEME: catalog size, paddings, item sizes, spacing, button sizes, header sizes, colors)
- Acceptance: no functional change; grid math uses constants only.

2) Introduce UI registry + lifecycle
- Add `UIRegistry` (map name->widget) + helpers: add(name,w), get(name), safeVisible(name,bool), remove(name)
- Add `destroy()` on catalog: delete all created widgets, clear handlers, reset state
- Wire `PlayerState.destroyUI()` to call `weaponCatalog.destroy()`
- Acceptance: open/close/destroy leaves no stray widgets; reopen works.

3) Centralize header control
- Implement header creation + updates inside `weapon-catalog.view.ts`
- Single `updateHeader(state)` entrypoint. No direct header mutations elsewhere
- Back button visibility computed from router
- Acceptance: header text/visibility always correct when changing category/weapon/slot/page

4) Routing (state machine + back stack)
- Replace ad-hoc `#pageState` mutations with router: `push(page,payload)`, `pop()`, `current()`
- Pages: `weaponSelection`, `attachmentSlotSelection`, `attachmentSelection`
- Back button calls `router.pop()`; orchestrator shows relevant page
- Acceptance: back navigates one level at a time, never skips; header reflects route

5) State model consolidation
- Single `CatalogState` object: `{ categoryIndex, weapon, slot, attachments, page }`
- Provide pure functions for transitions (e.g., `selectCategory`, `selectWeapon`, `selectSlot`, `setAttachment`)
- Acceptance: all mutations go through state functions; easier to reason/test

6) Event dispatch map
- Replace string `startsWith` chain with a map + small parser for dynamic IDs
- Example keys: `CLOSE`, `BACK`, `CATEGORY:{index}`, `WEAPON:{id}`, `SLOT:{slot}`, `ATTACH:{id}`
- Acceptance: `onUIButtonEvent` becomes short; adding handlers doesn’t touch big if/else

7) Sidebar componentization
- Build once; store both button + label per entry
- Provide `highlightCategory(index)` and `setEnabled(index,bool)`
- Acceptance: color/enable changes isolated; category switch updates exactly two entries (old/new)

8) Category pages: lazy + scroll-friendly
- Create page on first open; cache by index
- Add basic scrolling or pagination if available; else bounded height with safe overflow handling
- Acceptance: large categories don’t overflow view; memory stays bounded

9) Weapon item builder
- Create helper `buildWeaponTile(weapon)` to compose button+label+image consistently
- Ensure text doesn’t intercept clicks (non-interactive)
- Acceptance: grid code simplified; consistent visuals; click target is the button

10) Attachment slot list page
- Extract to `buildSlotList(weapon)`; re-render on open
- Use `weaponAttachmentSlotNames` for labels
- Acceptance: page creation is one call; router controls visibility; no leaks

11) Attachment list page
- Extract to `buildAttachmentList(weapon, slot)`; re-render on slot change
- Apply attachment on click; re-give weapon package via orchestration
- Acceptance: attachments apply immediately; back returns to slot list

12) Data adapter + types hardening
- Prefer `Partial<Record<WeaponAttachmentSlot, mod.WeaponAttachments>>` for attachments
- Add helpers in adapter: `getWeaponsForCategory`, `getSlotsForWeapon`, `getAttachmentsForSlot`
- Acceptance: UI/logic don’t know about raw arrays; compile-time safety improved

13) Naming normalization
- Shorten long private field names (`#header`, `#headerTitle`, `#backBtn`, `#categoryPages`)
- Introduce ID helpers: `idCategory(i)`, `idWeapon(id)`, `idSlot(slot)`, `idAttachment(id)`
- Acceptance: consistent name scheme; fewer bespoke string literals

14) Debug + logging toggle
- Add `DEBUG_UI` flag; conditional bg colors, logs for route/state changes
- Acceptance: can flip one flag for dev diagnostics; off by default

15) Perf pass (optional)
- Defer `AddUIWeaponImage` until tile visible/hovered or selected
- Consider sprite caching if API allows
- Acceptance: smoother open on large lists; no visual regressions

16) Documentation
- Add brief README section or code comments: module boundaries, lifecycle, routing contract, event names
- Acceptance: new contributors can navigate code in minutes

## Acceptance guardrails (global)
- build passes at each step
- no regressions in open/close, category change, header updates, selection flows
- memory stable across open/close cycles; no duplicate widgets after reopen

## Proposed working order for PRs (condensed)
- PR1: UI registry + constants in view + destroy (view skeleton)
- PR2: state model + router/back stack + header updates (wire view to state)
- PR3: sidebar + category pages (lazy) + weapon tile builder
- PR4: slot page + attachment page builders
- PR5: event dispatch map + naming helpers + types hardening
- PR6: debug flag + perf pass + docs tidy

## Open questions
- auto-equip weapon on select vs only after finalize?
- scrollable containers available in engine? or manual pagination?
- max expected weapons/attachments (virtualization needed)?
- performance impact of `AddUIWeaponImage` per tile?
- input mode interactions if multiple UIs open (shared coordinator needed)?
- naming constraints for widget names (length/charset)?
- should attachments persist across sessions or per open?

---

## Constants naming conventions (for `weapon-catalog.view.ts`)

- Groups UPPER_SNAKE: `LAYOUT`, `THEME`, `IDS`, `TEXT`.
- Sections PascalCase: `Catalog`, `Sidebar`, `Header`, `Grid`, `Slots`, `Attachments`.
- Fields lowerCamelCase: `width`, `height`, `padding`, `spacing`, `textSize`.
- Semantic names > color numbers; derive, don’t duplicate; centralize event/ID strings.

Suggested skeleton:

- export const LAYOUT = {
	Catalog: { width: 1200, height: 600, padding: 16 },
	Sidebar: { width: 250, button: { height: 50, textSize: 24, spacing: 4 } },
	Header: { height: 60, padding: 8, back: { size: 40 }, close: { size: 40 } },
	Grid: {
		item: { width: 250, height: 166, textWidth: 250 },
		gap: { x: 16, y: 16 },
		pagePadding: 16
	}
} as const;

- export const THEME = {
	colors: {
		surfaceBg: [0, 0, 0],
		elementBg: [0.05, 0.05, 0.05],
		textPrimary: [1, 1, 1],
		textAccent: [1, 0.98, 0.65]
	},
	alpha: { surface: 0.75, header: 0.0, solid: 1.0 },
	depth: { default: mod.UIDepth.AboveGameUI }
} as const;

- export const IDS = {
	buttons: { close: "__closeBtn", back: "__backBtn", categoryPrefix: "__categoryBtn_" },
	header: { title: "__mainHeaderTitle" }
} as const;

- export const TEXT = {
	icons: { close: "X", back: "<" }
} as const;

ID helpers (avoid string concat elsewhere):
- function idCategory(i: number) { return IDS.buttons.categoryPrefix + i; }
- function idWeapon(id: string) { return id; } // weapon ids already unique
- function idSlot(slot: string) { return `attachmentSlot_${slot}`; }
- function idAttachment(id: string) { return `attachment_${id}`; }
