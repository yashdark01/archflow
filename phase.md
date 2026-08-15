# ArchFlow — Product Phases & Development Stages

> **Last updated:** August 2026  
> **Author:** Yash Patidar  
> **Status:** Phase 1 & 2 complete · Phase 3+ planned  
> **Companion docs:** [product.md](./product.md) · [README.md](./README.md)

---

## Table of Contents

- [Development Strategy](#development-strategy)
- [Phase Overview](#phase-overview)
- [Responsive Design Policy](#responsive-design-policy)
- [Phase 1 — Responsive Web Application (Canvas MVP)](#phase-1--responsive-web-application-canvas-mvp)
- [Phase 2 — Diagram-as-Code (Mermaid Sync)](#phase-2--diagram-as-code-mermaid-sync)
- [Phase 3 — Auth, Persistence & Dashboard](#phase-3--auth-persistence--dashboard)
- [Phase 4 — Sharing, Templates & Embed](#phase-4--sharing-templates--embed)
- [Phase 5 — AI Features](#phase-5--ai-features)
- [Phase 6+ — Future Roadmap](#phase-6--future-roadmap)
- [Cross-Phase Quality Gates](#cross-phase-quality-gates)
- [File Ownership Map](#file-ownership-map)
- [Status Tracker](#status-tracker)

---

## Development Strategy

### Core principle

Build the **full responsive web application first**, then add **AI on top of a stable canvas**.

```
┌─────────────────────────────────────────────────────────────────┐
│  WEB APPLICATION (Phases 1–4)                                   │
│  Canvas → Code Panel → Auth/DB → Share/Templates                │
└───────────────────────────────┬─────────────────────────────────┘
                                │ stable product surface
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│  AI LAYER (Phase 5)                                             │
│  Generate · Explain · Streaming                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Why AI comes last

| Reason | Detail |
|---|---|
| AI needs a canvas | Generated nodes/edges must render on a working editor |
| AI needs persistence | Users expect AI output to be saved like any diagram |
| AI needs sharing | Generated diagrams are often shared immediately |
| Cost & complexity | API keys, rate limits, and streaming add ops overhead |
| Faster MVP | A usable Eraser-style editor ships without external deps |

### Eraser.io parity target (v1)

| Eraser feature | ArchFlow phase |
|---|---|
| Infinite canvas + visual editor | Phase 1 |
| Diagram-as-code | Phase 2 |
| Save diagrams to account | Phase 3 |
| Share links + embed | Phase 4 |
| AI prompt → diagram | Phase 5 |
| AI chat iteration | Phase 6+ (future) |
| Git / file inputs | Phase 6+ (future) |

---

## Phase Overview

| Phase | Name | Duration | Depends on | Ship criteria |
|---|---|---|---|---|
| **1** | Responsive Web Application | Weeks 1–4 | — | Guest can create, edit, export a diagram on desktop & tablet |
| **2** | Diagram-as-Code | Weeks 5–6 | Phase 1 | Two-way Mermaid ↔ canvas sync works |
| **3** | Auth & Persistence | Weeks 7–8 | Phase 1 | Users sign in, save diagrams, use dashboard |
| **4** | Sharing & Templates | Weeks 9–10 | Phase 3 | Share links, embed, template gallery live |
| **5** | AI Features | Weeks 11–13 | Phases 1–4 | Prompt → diagram, node explain, streaming UI |
| **6+** | Platform expansion | TBD | Phase 5 | Git import, collab, MCP, VS Code extension |

---

## Responsive Design Policy

ArchFlow follows a **progressive responsive** model — not every surface is fully editable on every device.

| Breakpoint | Width | Editor | Dashboard | Shared view |
|---|---|---|---|---|
| Mobile | `< 640px` | Read-only banner → link to desktop | List view, stacked cards | Pan/zoom, no edit |
| Tablet | `640–1024px` | Full editor, collapsible panels | Grid (2 cols) | Pan/zoom, no edit |
| Desktop | `> 1024px` | Full editor, all panels | Grid (3–4 cols) | Pan/zoom, no edit |

### Responsive rules (all phases)

1. **Mobile-first CSS** — base styles for small screens, enhance with `sm:` / `md:` / `lg:` Tailwind breakpoints
2. **Touch targets** — minimum 44×44px on interactive elements
3. **Collapsible panels** — sidebar and properties panel become drawers on `< lg`
4. **Canvas editing** — desktop & tablet only; mobile shows read-only with CTA
5. **No horizontal scroll** — except inside the infinite canvas itself
6. **Test viewports** — 375px (iPhone), 768px (iPad), 1280px (laptop), 1920px (desktop)

---

# Phase 1 — Responsive Web Application (Canvas MVP)

> **Goal:** A fast, keyboard-friendly, responsive diagram editor that works in guest mode with localStorage persistence.  
> **Duration:** Weeks 1–4  
> **Status:** ✅ Complete (Stages 1.1–1.10)

---

## Stage 1.1 — Project Foundation & Design System

**Duration:** 2–3 days  
**Depends on:** nothing

### Tasks

- [x] Flatten or document nested `archflow/archflow/` layout — dev runs from app directory
- [ ] Configure Tailwind v4, fonts (Geist), CSS variables in `globals.css`
- [ ] Build UI primitives: `Button`, `Input`, `Modal`, `Tooltip`, `Spinner`, `Badge`, `Dropdown`, `ContextMenu`
- [ ] Create `cn()` utility (`clsx` + `tailwind-merge`)
- [ ] Set up Redux store shell: `store/index.ts`, `store/hooks.ts`
- [ ] Define base types in `types/diagram.ts` (NodeType, NodeData, EdgeData)
- [ ] Update root `layout.tsx` metadata → ArchFlow branding

### Files

```
src/components/ui/*
src/utils/cn.ts
src/store/index.ts
src/store/hooks.ts
src/types/diagram.ts
src/app/globals.css
src/app/layout.tsx
```

### Acceptance criteria

- [ ] `npm run dev` starts without errors
- [ ] UI components render in a test page with light/dark support
- [ ] Redux Provider wraps the app
- [ ] Design tokens (colors, spacing, radius) documented in `globals.css`

---

## Stage 1.2 — App Shell & Responsive Layout

**Duration:** 2–3 days  
**Depends on:** Stage 1.1

### Tasks

- [ ] Create editor layout: toolbar (top) + sidebar (left) + canvas (center) + properties (right)
- [ ] Implement responsive panel behavior:
  - `≥ lg` — all panels visible
  - `md–lg` — sidebar icon-only or collapsible
  - `< md` — sidebar & properties as slide-over drawers
- [ ] Build `Toolbar` skeleton with placeholder actions
- [ ] Build `Sidebar` wrapper component
- [ ] Add `uiSlice` for panel open/close, selected node/edge state
- [ ] Implement `Ctrl+/` placeholder hook for future code panel toggle

### Files

```
src/components/toolbar/Toolbar.tsx
src/components/sidebar/Sidebar.tsx
src/store/slices/uiSlice.ts
src/app/editor/[diagramId]/page.tsx   (layout shell)
```

### Acceptance criteria

- [ ] Layout adapts cleanly at 375px, 768px, 1280px without overflow
- [ ] Panels toggle open/close on mobile via hamburger / FAB buttons
- [ ] Toolbar stays fixed at top; canvas fills remaining viewport height

---

## Stage 1.3 — Landing & Navigation Pages

**Duration:** 2 days  
**Depends on:** Stage 1.1

### Tasks

- [ ] Replace default Next.js homepage with ArchFlow landing page
- [ ] Hero section: headline, CTA "Start Designing" → `/editor/new`
- [ ] Feature highlights (canvas, code, AI coming soon badge)
- [ ] Responsive nav: logo, Start Designing, Login (placeholder link)
- [ ] Footer with GitHub link, license
- [ ] `/editor` route redirects to new guest diagram (`/editor/[id]`)

### Files

```
src/app/page.tsx
src/app/editor/page.tsx
```

### Acceptance criteria

- [ ] Landing page is fully responsive (stacked on mobile, side-by-side on desktop)
- [ ] CTA opens editor in guest mode
- [ ] Lighthouse mobile score ≥ 90 for landing page

---

## Stage 1.4 — Canvas Core (React Flow)

**Duration:** 3–4 days  
**Depends on:** Stage 1.2

### Tasks

- [ ] Integrate React Flow in `CanvasBoard.tsx` + `CanvasWrapper.tsx`
- [ ] Configure default viewport, zoom limits, snap grid
- [ ] Add dot/grid background
- [ ] Implement pan: scroll wheel zoom, Space + drag to pan
- [ ] Build `CanvasControls` (zoom in/out, fit view, lock)
- [ ] Build `MiniMapControl` (toggleable, bottom-right)
- [ ] Wire canvas selection → `uiSlice` (selectedNodeId, selectedEdgeId)
- [ ] Create `diagramSlice` with nodes[], edges[], past[], future[]

### Files

```
src/components/canvas/CanvasBoard.tsx
src/components/canvas/CanvasWrapper.tsx
src/components/canvas/controls/CanvasControls.tsx
src/components/canvas/controls/MiniMapControl.tsx
src/lib/reactflow/defaultViewport.ts
src/lib/reactflow/nodeTypes.ts
src/lib/reactflow/edgeTypes.ts
src/store/slices/diagramSlice.ts
```

### Acceptance criteria

- [ ] Canvas renders at full viewport height on all breakpoints
- [ ] Zoom 10%–400% works smoothly
- [ ] Mini-map toggles on/off
- [ ] Click empty canvas deselects all nodes/edges
- [ ] 50+ nodes render without visible lag

---

## Stage 1.5 — Node Types & Palette

**Duration:** 4–5 days  
**Depends on:** Stage 1.4

### Tasks

- [ ] Implement `BaseNode` with 4-side handles, selection ring, inline label edit
- [ ] Build all 9 node components: Service, Database, Cache, Queue, ApiGateway, LoadBalancer, User, Group, Cloud
- [ ] Create `nodeFactory.ts` + `nodeDefaults.ts` + `paletteGroups.ts`
- [ ] Build `NodePalette`, `PaletteGroup`, `PaletteItem`, `SearchPalette`
- [ ] Implement drag-from-palette → canvas drop via `useCanvasDrop.ts`
- [ ] Double-click label → inline text edit
- [ ] Delete key removes selected node (+ connected edges)

### Files

```
src/components/nodes/*
src/components/sidebar/NodePalette.tsx
src/components/sidebar/PaletteGroup.tsx
src/components/sidebar/PaletteItem.tsx
src/components/sidebar/SearchPalette.tsx
src/hooks/useCanvasDrop.ts
src/utils/nodeFactory.ts
src/constants/nodeDefaults.ts
src/constants/paletteGroups.ts
```

### Acceptance criteria

- [ ] All 9 node types draggable onto canvas
- [ ] Palette scrolls on mobile drawer without breaking layout
- [ ] Search filters palette items by name
- [ ] Node label editable via double-click
- [ ] Each node type has distinct visual shape per product spec

---

## Stage 1.6 — Edges & Connections

**Duration:** 3 days  
**Depends on:** Stage 1.5

### Tasks

- [ ] Build `CustomEdge` with bezier / straight / smoothstep support
- [ ] Build `EdgeLabel` with double-click inline edit
- [ ] Create `edgeFactory.ts` + `edgeDefaults.ts`
- [ ] Drag handle → handle connection creates labeled edge
- [ ] Click edge to select; Delete removes edge
- [ ] Toolbar edge-type picker updates `activeEdgeType` in uiSlice
- [ ] Edge color inherits source node accent (overridable in properties)

### Files

```
src/components/canvas/edges/CustomEdge.tsx
src/components/canvas/edges/EdgeLabel.tsx
src/utils/edgeFactory.ts
src/constants/edgeDefaults.ts
```

### Acceptance criteria

- [ ] All 3 edge types render correctly
- [ ] Edge labels editable inline
- [ ] Deleting a node removes its connected edges
- [ ] New connections use currently selected edge type from toolbar

---

## Stage 1.7 — Properties Panel

**Duration:** 2–3 days  
**Depends on:** Stage 1.5, 1.6

### Tasks

- [ ] Build `PropertiesPanel` container (right drawer on mobile)
- [ ] Build `NodeProperties`: label, color (6 presets + hex), description, border style
- [ ] Build `EdgeProperties`: label, type, arrow direction, color
- [ ] Live update — changes reflect on canvas immediately (no save button)
- [ ] Panel auto-opens on selection, collapses on deselect
- [ ] Resizable panel border on desktop (`≥ lg`)

### Files

```
src/components/properties/PropertiesPanel.tsx
src/components/properties/NodeProperties.tsx
src/components/properties/EdgeProperties.tsx
```

### Acceptance criteria

- [ ] Selecting a node opens node properties; selecting edge opens edge properties
- [ ] Color change updates node accent live
- [ ] Panel is usable as bottom sheet on mobile (< md)
- [ ] Description field supports multi-line text

---

## Stage 1.8 — Undo / Redo & Keyboard Shortcuts

**Duration:** 2 days  
**Depends on:** Stage 1.4

### Tasks

- [ ] Implement undo/redo in `diagramSlice` (past[] / future[], max 50 steps)
- [ ] Build `useUndoRedo.ts` hook — listens for Ctrl+Z / Ctrl+Shift+Z
- [ ] Build `UndoRedoButtons` in toolbar
- [ ] Implement copy/paste/duplicate (Ctrl+C, Ctrl+V, Ctrl+D)
- [ ] Implement select all (Ctrl+A) and deselect (Escape)
- [ ] Document shortcuts in `constants/shortcuts.ts`
- [ ] Right-click context menu: Add Node, Paste, Select All

### Files

```
src/hooks/useUndoRedo.ts
src/components/toolbar/UndoRedoButtons.tsx
src/components/ui/ContextMenu.tsx
src/constants/shortcuts.ts
```

### Acceptance criteria

- [ ] Undo/redo works for: add, delete, move, edit label, paste
- [ ] AI generation (future) will be undoable as single action — stack design supports this
- [ ] All shortcuts in product.md work on desktop
- [ ] Context menu appears on right-click (desktop) and long-press (mobile read-only)

---

## Stage 1.9 — Export & Local Auto-Save

**Duration:** 2–3 days  
**Depends on:** Stage 1.4

### Tasks

- [ ] Build `useExport.ts` — PNG export of full canvas (not just viewport)
- [ ] Build `ExportButton` in toolbar; shortcut Ctrl+E
- [ ] Copy PNG to clipboard option
- [ ] File naming: `{diagram-title}-{date}.png`
- [ ] Build `useAutoSave.ts` — debounced save to localStorage (1s)
- [ ] Load diagram from localStorage on editor mount
- [ ] Show save indicator in toolbar: Saved / Saving…
- [ ] Handle localStorage quota exceeded gracefully

### Files

```
src/hooks/useExport.ts
src/hooks/useAutoSave.ts
src/components/toolbar/ExportButton.tsx
src/utils/downloadFile.ts
src/utils/generateId.ts
```

### Acceptance criteria

- [ ] PNG export downloads correctly with transparent or white background toggle
- [ ] Refreshing the page restores the diagram from localStorage
- [ ] Auto-save fires 1s after last change
- [ ] Guest diagram persists across browser sessions

---

## Stage 1.10 — Phase 1 Polish & Responsive QA

**Duration:** 3 days  
**Depends on:** All Stage 1.x

### Tasks

- [ ] Cross-browser test: Chrome, Firefox, Safari
- [ ] Responsive QA pass at all breakpoints
- [ ] Mobile editor shows banner: "Editing works best on desktop" with continue option
- [ ] Empty state: canvas shows hint "Drag a node from the sidebar to start"
- [ ] Loading skeleton for editor route
- [ ] Error boundary around canvas
- [ ] Performance: canvas load < 1.5s on 3G throttled
- [ ] Fix all ESLint errors; add `lint:fix` script

### Acceptance criteria

- [ ] Phase 1 feature checklist 100% complete (see product.md Features 1–6)
- [ ] No console errors during normal editing flow
- [ ] Editor usable on iPad (768px) in landscape
- [ ] README updated — Phase 1 marked complete, Phases 2–5 marked planned

### Phase 1 exit gate

> Guest user can open archflow.app → create diagram → drag nodes → connect → edit properties → undo/redo → export PNG → close tab → return → diagram restored.

---

# Phase 2 — Diagram-as-Code (Mermaid Sync)

> **Goal:** Two-way sync between the visual canvas and Mermaid code in a Monaco editor panel.  
> **Duration:** Weeks 5–6  
> **Depends on:** Phase 1 complete  
> **Status:** ✅ Complete (Stages 2.1–2.4)

---

## Stage 2.1 — Code Panel UI

**Duration:** 2 days  
**Depends on:** Phase 1 exit gate

### Tasks

- [ ] Build `CodePanel` slide-in panel (right side desktop, bottom sheet mobile)
- [ ] Build `CodePanelToggle` button in toolbar
- [ ] Wire toggle to `codePanelOpen` in uiSlice
- [ ] Keyboard shortcut Ctrl+/ toggles panel
- [ ] Split layout: Monaco editor (top) + Mermaid preview (bottom)
- [ ] Sync indicator badge: green = synced, red = parse error

### Files

```
src/components/code-panel/CodePanel.tsx
src/components/code-panel/CodePanelToggle.tsx
```

### Acceptance criteria

- [ ] Panel slides in/out smoothly without reflowing canvas incorrectly
- [ ] On mobile, code panel replaces properties panel (tab switcher)
- [ ] Panel state persists in uiSlice during session

---

## Stage 2.2 — Canvas → Mermaid Conversion

**Duration:** 3 days  
**Depends on:** Stage 2.1

### Tasks

- [ ] Implement `flowToMermaid.ts` — converts nodes + edges to `graph TD` / `graph LR`
- [ ] Map node types to Mermaid shapes (rectangle, cylinder, diamond, circle, subgraph)
- [ ] Preserve labels, edge labels, and edge arrow direction
- [ ] Debounce conversion (300ms) to avoid blocking UI on rapid edits
- [ ] Update Monaco editor content when canvas changes

### Files

```
src/lib/mermaid/flowToMermaid.ts
src/components/code-panel/MermaidEditor.tsx
```

### Acceptance criteria

- [ ] Editing canvas updates Mermaid code within 500ms
- [ ] All 9 node types map to valid Mermaid syntax
- [ ] Edge labels and types appear in generated code

---

## Stage 2.3 — Mermaid → Canvas Conversion

**Duration:** 3–4 days  
**Depends on:** Stage 2.2

### Tasks

- [ ] Implement `mermaidToFlow.ts` — parses Mermaid flowchart → nodes + edges
- [ ] Auto-layout parsed nodes (grid placement if no position data)
- [ ] Handle parse errors — show red underline in Monaco, keep last valid canvas state
- [ ] Build `MermaidPreview.tsx` — live rendered preview below editor
- [ ] Support `graph TD` and `graph LR` (sequenceDiagram = stretch goal)

### Files

```
src/lib/mermaid/mermaidToFlow.ts
src/components/code-panel/MermaidPreview.tsx
src/hooks/useMermaidSync.ts
```

### Acceptance criteria

- [ ] Typing valid Mermaid updates canvas in real time
- [ ] Invalid Mermaid shows inline error without crashing canvas
- [ ] Copy-to-clipboard button exports Mermaid snippet
- [ ] Round-trip: canvas → code → canvas preserves structure (positions may shift)

---

## Stage 2.4 — Phase 2 Polish

**Duration:** 2 days  
**Depends on:** Stage 2.3

### Tasks

- [ ] Stress test with 50-node diagram round-trip
- [ ] Add "View Code" onboarding tooltip on first code panel open
- [ ] Responsive: code panel full-screen overlay on `< md`
- [ ] Update README and product.md status

### Phase 2 exit gate

> User toggles code panel → edits Mermaid → canvas updates → drags node on canvas → code updates → copies snippet to clipboard.

---

# Phase 3 — Auth, Persistence & Dashboard

> **Goal:** User accounts, PostgreSQL storage, diagram dashboard with auto-save.  
> **Duration:** Weeks 7–8  
> **Depends on:** Phase 1 complete (Phase 2 optional but recommended)  
> **Status:** 📋 Planned

---

## Stage 3.1 — Database & Prisma Setup

**Duration:** 1–2 days  
**Depends on:** Phase 1 exit gate

### Tasks

- [ ] Write `prisma/schema.prisma` (User + Diagram models per product.md)
- [ ] Run initial migration
- [ ] Create `lib/db/prisma.ts` singleton
- [ ] Add `next-auth`, `@prisma/client`, `prisma` to package.json
- [ ] Verify `.env.example` documents all required vars

### Files

```
prisma/schema.prisma
prisma/migrations/*
src/lib/db/prisma.ts
.env.example
```

### Acceptance criteria

- [ ] `npx prisma migrate dev` runs cleanly
- [ ] Prisma Studio shows User and Diagram tables
- [ ] DATABASE_URL connection verified

---

## Stage 3.2 — Authentication (NextAuth)

**Duration:** 3 days  
**Depends on:** Stage 3.1

### Tasks

- [ ] Configure NextAuth in `lib/auth/authOptions.ts`
- [ ] Providers: Google OAuth + Email magic link
- [ ] API route: `api/auth/[...nextauth]/route.ts`
- [ ] Build `LoginForm`, `RegisterForm`, auth pages
- [ ] Build `AuthGuard` wrapper for protected routes
- [ ] Create `authSlice` — sync session state to Redux
- [ ] Responsive auth pages (centered card, full-width on mobile)

### Files

```
src/lib/auth/authOptions.ts
src/app/api/auth/[...nextauth]/route.ts
src/app/(auth)/login/page.tsx
src/app/(auth)/register/page.tsx
src/components/auth/*
src/store/slices/authSlice.ts
src/types/auth.ts
```

### Acceptance criteria

- [ ] Google sign-in works end-to-end
- [ ] Email magic link sends and verifies
- [ ] Session persists across browser restarts
- [ ] Unauthenticated users redirected from `/dashboard`

---

## Stage 3.3 — Guest → Authenticated Migration

**Duration:** 1–2 days  
**Depends on:** Stage 3.2

### Tasks

- [ ] On first sign-in, detect localStorage guest diagram
- [ ] Prompt: "Save your guest diagram to your account?"
- [ ] POST guest diagram to API → clear localStorage on success
- [ ] Redirect to `/editor/[newDiagramId]`

### Acceptance criteria

- [ ] Guest diagram not lost on sign-up
- [ ] User can dismiss migration prompt and keep guest data locally

---

## Stage 3.4 — Diagram CRUD API

**Duration:** 3 days  
**Depends on:** Stage 3.1, 3.2

### Tasks

- [ ] `GET/POST /api/diagrams` — list + create
- [ ] `GET/PUT/DELETE /api/diagrams/[diagramId]` — single diagram ops
- [ ] Auth middleware — users can only access own diagrams
- [ ] Validate request/response shapes in `types/api.ts`
- [ ] Store nodes/edges as JSON columns
- [ ] Return createdAt, updatedAt, title metadata

### Files

```
src/app/api/diagrams/route.ts
src/app/api/diagrams/[diagramId]/route.ts
src/types/api.ts
```

### Acceptance criteria

- [ ] CRUD operations work via API client (curl or Postman)
- [ ] Unauthorized requests return 401
- [ ] Accessing another user's diagram returns 403

---

## Stage 3.5 — Dashboard UI

**Duration:** 3–4 days  
**Depends on:** Stage 3.4

### Tasks

- [ ] Build `/dashboard` page with auth guard
- [ ] Build `DiagramGrid`, `DiagramCard`, `DiagramActions`, `NewDiagramButton`
- [ ] Create `diagramsSlice` + `useDiagrams.ts` hook
- [ ] Diagram card: thumbnail placeholder, title, last updated
- [ ] Actions: rename (inline), duplicate, delete (confirm modal)
- [ ] Search bar filters by title
- [ ] Sort: last updated / created / alphabetical
- [ ] Responsive grid: 1 col mobile, 2 col tablet, 3–4 col desktop
- [ ] Empty state: "Create your first diagram"
- [ ] Loading skeleton

### Files

```
src/app/dashboard/page.tsx
src/app/dashboard/loading.tsx
src/components/dashboard/*
src/store/slices/diagramsSlice.ts
src/hooks/useDiagrams.ts
```

### Acceptance criteria

- [ ] Dashboard loads user's diagrams on login
- [ ] New diagram creates blank canvas in editor
- [ ] Delete removes diagram with confirmation
- [ ] Dashboard fully responsive

---

## Stage 3.6 — Auto-Save to Database

**Duration:** 2 days  
**Depends on:** Stage 3.4, 3.5

### Tasks

- [ ] Extend `useAutoSave.ts` — save to DB when authenticated, localStorage when guest
- [ ] Debounce: 2 seconds after last change
- [ ] Optimistic UI — canvas stays editable during save
- [ ] Toolbar indicator: Saved / Saving… / Unsaved changes / Error
- [ ] `DiagramTitle` editable component in toolbar
- [ ] Load diagram from DB on `/editor/[diagramId]` mount

### Files

```
src/hooks/useAutoSave.ts
src/components/toolbar/DiagramTitle.tsx
src/app/editor/[diagramId]/page.tsx
```

### Acceptance criteria

- [ ] Changes persist to DB within 2s of last edit
- [ ] Navigating away and back restores latest state
- [ ] Save errors shown non-blocking in toolbar
- [ ] Guest mode still uses localStorage (no DB calls)

### Phase 3 exit gate

> User signs in → dashboard shows diagrams → opens diagram → edits → auto-saves → logs out → logs back in → diagram intact.

---

# Phase 4 — Sharing, Templates & Embed

> **Goal:** Shareable read-only links, template gallery, iframe embed — full web product before AI.  
> **Duration:** Weeks 9–10  
> **Depends on:** Phase 3 complete  
> **Status:** 📋 Planned

---

## Stage 4.1 — Share Link API & Modal

**Duration:** 2–3 days  
**Depends on:** Phase 3 exit gate

### Tasks

- [ ] `POST /api/diagrams/[diagramId]/share` — generate unique `shareId`
- [ ] `DELETE` or `PUT` to revoke share link
- [ ] Build `ShareModal` + `ShareButton` in toolbar
- [ ] Copy link to clipboard: `archflow.app/shared/{shareId}`
- [ ] Optional: password-protect field (stretch)

### Files

```
src/app/api/diagrams/[diagramId]/share/route.ts
src/components/share/ShareModal.tsx
src/components/toolbar/ShareButton.tsx
src/hooks/useShareLink.ts
```

### Acceptance criteria

- [ ] Generate link copies to clipboard with toast confirmation
- [ ] Owner can revoke link — shared URL returns 404 after revoke

---

## Stage 4.2 — Read-Only Shared View

**Duration:** 3 days  
**Depends on:** Stage 4.1

### Tasks

- [ ] Build `/shared/[shareId]` page — server-fetches diagram by shareId
- [ ] Render canvas in read-only mode (no drag, no connect, no delete)
- [ ] Build `ReadOnlyBanner` — "View only · Open in ArchFlow" CTA
- [ ] Allow pan/zoom and minimap
- [ ] Export PNG available on shared view
- [ ] **Mobile responsive:** full-width canvas, touch pan/zoom, banner collapses

### Files

```
src/app/shared/[shareId]/page.tsx
src/components/share/ReadOnlyBanner.tsx
```

### Acceptance criteria

- [ ] Shared link viewable without login
- [ ] No editing possible in shared view
- [ ] Works on mobile (375px) with touch pan/zoom
- [ ] Invalid/revoked shareId shows friendly 404 page

---

## Stage 4.3 — Template Gallery

**Duration:** 3–4 days  
**Depends on:** Phase 3

### Tasks

- [ ] Create JSON templates in `public/templates/` (8 built-in per product.md)
- [ ] Build `TemplateGallery`, `TemplateCard`, `TemplatePreview`
- [ ] Gallery accessible from dashboard + editor toolbar
- [ ] "Use template" → creates new diagram pre-filled with template nodes/edges
- [ ] Preview modal before confirming
- [ ] Responsive grid layout

### Files

```
public/templates/*.json
src/components/templates/*
```

### Acceptance criteria

- [ ] All 8 templates load and render correctly
- [ ] Using a template creates a new saved diagram
- [ ] Gallery accessible on mobile (single column cards)

---

## Stage 4.4 — Embed View

**Duration:** 2 days  
**Depends on:** Stage 4.2

### Tasks

- [ ] Build `/embed/[shareId]` route — minimal chrome, no toolbar/banner
- [ ] Read-only canvas with pan/zoom only
- [ ] Auto-resize to iframe container width
- [ ] Document embed snippet in ShareModal

### Acceptance criteria

- [ ] iframe embed works in a test HTML page
- [ ] No scrollbars outside canvas area
- [ ] Embed updates when owner saves changes

---

## Stage 4.5 — Phase 4 Polish & Launch Prep

**Duration:** 2 days  
**Depends on:** All Stage 4.x

### Tasks

- [ ] End-to-end test: create → share → view on mobile → embed in doc
- [ ] Open Graph meta tags for shared pages (title, thumbnail)
- [ ] Rate limiting on share API (prevent abuse)
- [ ] Update docs — Phases 1–4 complete

### Phase 4 exit gate

> Full web product live: create, edit, save, share, embed, templates — no AI required. Ready for beta users.

---

# Phase 5 — AI Features

> **Goal:** AI diagram generation and node explanation — built on top of the complete web app.  
> **Duration:** Weeks 11–13  
> **Depends on:** Phase 4 exit gate  
> **Status:** 📋 Planned

---

## Stage 5.1 — AI Infrastructure

**Duration:** 2–3 days  
**Depends on:** Phase 4 exit gate

### Tasks

- [ ] Add `ANTHROPIC_API_KEY` to env config
- [ ] Build `lib/ai/promptBuilder.ts` — system prompt with node type vocabulary
- [ ] Build `lib/ai/responseParser.ts` — Claude JSON → nodes + edges
- [ ] Define types in `types/ai.ts`
- [ ] Create `aiSlice` — prompt, status, result, error
- [ ] Server-side only API calls — never expose API key to client

### Files

```
src/lib/ai/promptBuilder.ts
src/lib/ai/responseParser.ts
src/types/ai.ts
src/store/slices/aiSlice.ts
```

### Acceptance criteria

- [ ] Prompt builder produces structured system prompt with all node types
- [ ] Response parser handles valid JSON and rejects malformed responses
- [ ] API key never appears in client bundle (verify with build inspect)

---

## Stage 5.2 — Generate Diagram API

**Duration:** 3 days  
**Depends on:** Stage 5.1

### Tasks

- [ ] `POST /api/ai/generate` — accepts `{ prompt: string }`
- [ ] Call Claude API with streaming enabled
- [ ] Return `{ nodes, edges }` JSON payload
- [ ] Rate limiting: max 10 requests/hour per user (configurable)
- [ ] Error handling: API down, rate limit, invalid response
- [ ] Log usage for monitoring (no prompt content in logs)

### Files

```
src/app/api/ai/generate/route.ts
```

### Acceptance criteria

- [ ] Valid prompt returns renderable nodes + edges
- [ ] Rate limit returns 429 with retry-after header
- [ ] API errors return user-friendly messages

---

## Stage 5.3 — AI Prompt UI & Streaming

**Duration:** 4–5 days  
**Depends on:** Stage 5.2

### Tasks

- [ ] Build `AiPromptModal` — text input, example prompts, submit
- [ ] Build `AiPromptButton` in toolbar; shortcut Ctrl+K
- [ ] Build `AiResponseLoader` — streaming progress UI
- [ ] Build `useAiGenerate.ts` hook
- [ ] Progressive render — nodes appear on canvas as streamed
- [ ] Place generated diagram in center of current viewport
- [ ] Undo treats full generation as single undo action
- [ ] "Regenerate" option with modified prompt
- [ ] Responsive modal — full-screen on mobile

### Files

```
src/components/ai/AiPromptModal.tsx
src/components/ai/AiPromptButton.tsx
src/components/ai/AiResponseLoader.tsx
src/components/toolbar/AiPromptButton.tsx
src/hooks/useAiGenerate.ts
```

### Acceptance criteria

- [ ] Ctrl+K opens prompt modal
- [ ] Example prompts clickable to fill input
- [ ] Generated diagram renders on canvas correctly
- [ ] Ctrl+Z undo removes entire AI generation
- [ ] Modal works on mobile (full-screen overlay)

---

## Stage 5.4 — AI Node Explanation

**Duration:** 2–3 days  
**Depends on:** Stage 5.1

### Tasks

- [ ] `POST /api/ai/explain` — accepts `{ nodeId, nodes, edges }`
- [ ] Build `AiExplainPanel` in properties panel
- [ ] "Explain" button visible when node selected
- [ ] Claude reads node type, label, connections, neighbors
- [ ] Display plain-English explanation below properties
- [ ] Loading state + error state

### Files

```
src/app/api/ai/explain/route.ts
src/components/ai/AiExplainPanel.tsx
```

### Acceptance criteria

- [ ] Explanation references connected nodes by label
- [ ] Works for all node types
- [ ] Explanation cached in session (don't re-call for same node)

---

## Stage 5.5 — AI Polish, Limits & Launch

**Duration:** 2–3 days  
**Depends on:** Stage 5.3, 5.4

### Tasks

- [ ] Guest users: AI disabled — prompt to sign in
- [ ] Authenticated free tier: 20 AI generations/day (configurable)
- [ ] Error toasts for all failure modes
- [ ] AI feature flag via env var (`AI_ENABLED=true`)
- [ ] Update landing page — remove "AI coming soon" badge
- [ ] Document AI setup in README

### Phase 5 exit gate

> Authenticated user presses Ctrl+K → describes system → diagram streams onto canvas → selects node → clicks Explain → gets contextual explanation → saves → shares link.

---

# Phase 6+ — Future Roadmap

> These phases are **not scheduled**. Revisit after Phase 5 launch and user feedback.

| Phase | Name | Key deliverables |
|---|---|---|
| **6** | GitHub Import | Connect repo → infer architecture diagram from file structure |
| **7** | Real-time Collaboration | WebSockets, cursors, presence, conflict resolution |
| **8** | VS Code Extension | View/edit `.archflow` diagrams from the editor |
| **9** | AI Chat Iteration | Persistent side chat for iterative diagram refinement (Eraser parity) |
| **10** | MCP Server | Agent CRUD API for Claude, Cursor, ChatGPT |
| **11** | Team Features | Workspaces, shared templates, style presets, SSO |
| **12** | File Inputs | Upload PDF, Terraform, Draw.io → AI diagram |
| **13** | C4 Drill-Down | Nested system → container → component views |

---

## Cross-Phase Quality Gates

Every phase must pass these checks before moving to the next:

### Performance

| Check | Target |
|---|---|
| Canvas initial load | < 1.5s (desktop), < 2.5s (mobile) |
| Auto-save latency | < 500ms API response |
| AI generation | First nodes visible < 3s |
| Lighthouse (landing) | ≥ 90 mobile |

### Accessibility

- [ ] All interactive elements keyboard-accessible
- [ ] Focus rings visible on tab navigation
- [ ] Color contrast ≥ 4.5:1 on text
- [ ] ARIA labels on icon-only buttons

### Security

- [ ] No API keys in client bundle
- [ ] Auth required on all mutation endpoints
- [ ] Share IDs are unguessable (nanoid/cuid)
- [ ] Input sanitization on diagram title and labels

### Responsive

- [ ] No layout breakage at 375px, 768px, 1280px, 1920px
- [ ] Touch targets ≥ 44px on mobile/tablet
- [ ] Shared view works with touch pan/zoom

---

## File Ownership Map

Quick reference for which phase owns which directories:

| Directory | Phase |
|---|---|
| `src/components/ui/` | 1.1 |
| `src/components/canvas/` | 1.4, 1.6 |
| `src/components/nodes/` | 1.5 |
| `src/components/sidebar/` | 1.5 |
| `src/components/properties/` | 1.7 |
| `src/components/toolbar/` | 1.2, 1.8, 1.9 |
| `src/components/code-panel/` | 2.x |
| `src/components/auth/` | 3.2 |
| `src/components/dashboard/` | 3.5 |
| `src/components/share/` | 4.x |
| `src/components/templates/` | 4.3 |
| `src/components/ai/` | 5.x |
| `src/app/api/diagrams/` | 3.4, 4.1 |
| `src/app/api/ai/` | 5.x |
| `src/app/api/auth/` | 3.2 |
| `src/lib/mermaid/` | 2.x |
| `src/lib/ai/` | 5.x |
| `src/lib/auth/` | 3.2 |
| `src/lib/db/` | 3.1 |
| `public/templates/` | 4.3 |

---

## Status Tracker

Update this table as stages complete.

### Phase 1 — Responsive Web Application

| Stage | Name | Status |
|---|---|---|
| 1.1 | Project Foundation & Design System | ✅ Complete |
| 1.2 | App Shell & Responsive Layout | ✅ Complete |
| 1.3 | Landing & Navigation Pages | ✅ Complete |
| 1.4 | Canvas Core (React Flow) | ✅ Complete |
| 1.5 | Node Types & Palette | ✅ Complete |
| 1.6 | Edges & Connections | ✅ Complete |
| 1.7 | Properties Panel | ✅ Complete |
| 1.8 | Undo / Redo & Keyboard Shortcuts | ✅ Complete |
| 1.9 | Export & Local Auto-Save | ✅ Complete |
| 1.10 | Phase 1 Polish & Responsive QA | ✅ Complete |

### Phase 2 — Diagram-as-Code

| Stage | Name | Status |
|---|---|---|
| 2.1 | Code Panel UI | ✅ Complete |
| 2.2 | Canvas → Mermaid Conversion | ✅ Complete |
| 2.3 | Mermaid → Canvas Conversion | ✅ Complete |
| 2.4 | Phase 2 Polish | ✅ Complete |

### Phase 3 — Auth & Persistence

| Stage | Name | Status |
|---|---|---|
| 3.1 | Database & Prisma Setup | ⬜ Not started |
| 3.2 | Authentication (NextAuth) | ⬜ Not started |
| 3.3 | Guest → Authenticated Migration | ⬜ Not started |
| 3.4 | Diagram CRUD API | ⬜ Not started |
| 3.5 | Dashboard UI | ⬜ Not started |
| 3.6 | Auto-Save to Database | ⬜ Not started |

### Phase 4 — Sharing & Templates

| Stage | Name | Status |
|---|---|---|
| 4.1 | Share Link API & Modal | ⬜ Not started |
| 4.2 | Read-Only Shared View | ⬜ Not started |
| 4.3 | Template Gallery | ⬜ Not started |
| 4.4 | Embed View | ⬜ Not started |
| 4.5 | Phase 4 Polish & Launch Prep | ⬜ Not started |

### Phase 5 — AI Features

| Stage | Name | Status |
|---|---|---|
| 5.1 | AI Infrastructure | ⬜ Not started |
| 5.2 | Generate Diagram API | ⬜ Not started |
| 5.3 | AI Prompt UI & Streaming | ⬜ Not started |
| 5.4 | AI Node Explanation | ⬜ Not started |
| 5.5 | AI Polish, Limits & Launch | ⬜ Not started |

---

*This document is the single source of truth for development sequencing. Update stage status as work progresses. For product requirements, see [product.md](./product.md).*
