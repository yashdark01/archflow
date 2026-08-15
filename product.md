# ArchFlow — Product Document

> Last updated: August 2026  
> Author: Yash Patidar  
> Status: In Development

---

## Table of Contents

- [Product Vision](#product-vision)
- [Problem Statement](#problem-statement)
- [Target Users](#target-users)
- [Value Proposition](#value-proposition)
- [Product Goals](#product-goals)
- [Feature Breakdown](#feature-breakdown)
- [User Stories](#user-stories)
- [User Flows](#user-flows)
- [Non-Goals](#non-goals)
- [Competitive Landscape](#competitive-landscape)
- [Differentiation](#differentiation)
- [Success Metrics](#success-metrics)
- [Phased Delivery](#phased-delivery)
- [Technical Constraints](#technical-constraints)
- [Open Questions](#open-questions)

---

## Product Vision

**ArchFlow is the diagramming tool built by developers, for developers.**

Most diagramming tools are built for business analysts and project managers — they are polished but shallow. Developers are left importing icon packs, fighting with alignment grids, and copy-pasting boilerplate boxes into Lucidchart or Miro just to explain a system they built in their heads.

ArchFlow solves this by meeting developers where they already are:
- On a **canvas** when they need to think visually
- In **code** when they need precision and version control
- With **AI** when they need a starting point fast

> **"Design your architecture the way you think about it — not the way a tool forces you to."**

---

## Problem Statement

### The Core Pain

When a developer needs to document, plan, or communicate a system architecture, their options are:

| Option | Problem |
|---|---|
| Lucidchart / Draw.io | Heavy UI, not dev-native, slow |
| Miro / FigJam | Too general, no code primitives |
| Eraser.io | Great, but expensive and closed |
| Mermaid in Markdown | No visual canvas, hard to share |
| Whiteboard photo | Not searchable, not shareable |

There is no tool that combines:
- A fast, keyboard-friendly infinite canvas
- Diagram-as-code (write code, see diagram)
- AI that understands system design vocabulary
- Free, open, and built for the developer community

### The Specific Moments of Pain

1. **Design Review** — Engineer draws boxes in Miro, wastes 20 min aligning, shares a screenshot. Nobody can edit it later.
2. **Onboarding Docs** — Senior dev draws architecture in a Google Doc. It's outdated in 3 weeks.
3. **RFC / ADR Writing** — Engineers describe architecture in prose. Reviewers still don't understand the system.
4. **Quick Ideation** — Developer opens Excalidraw, draws rough boxes, but can't export to Mermaid for docs.
5. **AI Design** — Developer prompts ChatGPT for architecture. Gets a wall of text. Has to manually draw it.

---

## Target Users

### Primary — The Backend / Full Stack Developer

- 2–8 years of experience
- Designs systems daily (services, APIs, queues, databases)
- Comfortable with code editors and CLI
- Frustrated by visual tools that feel like PowerPoint
- Wants their diagrams in Git, not locked in a SaaS

### Secondary — The Tech Lead / Staff Engineer

- Responsible for design reviews and architecture decisions
- Needs to communicate system design to non-technical stakeholders
- Wants shareable, embed-ready diagrams for RFCs and ADRs
- Values speed — can't spend 45 mins making a diagram look good

### Tertiary — The DevOps / Platform Engineer

- Designs infrastructure: VPCs, clusters, cloud services
- Wants AWS/GCP/Azure icon libraries built in
- Needs to export diagrams for runbooks and incident docs

### Out of Scope (for now)

- Product managers (no roadmap / timeline features)
- UX designers (not a wireframing tool)
- Business analysts (no flowchart-first workflow)

---

## Value Proposition

### For the Individual Developer

> Stop drawing boxes. Start shipping diagrams.

- Open the canvas, drag your first node in under 10 seconds
- Describe your system in plain English — AI draws it for you
- Write Mermaid code, see the diagram update live
- Export PNG in one click for Notion, Confluence, Slack

### For the Tech Lead

> One source of truth for your system design.

- Save diagrams to your account, not a screenshot folder
- Share a read-only link — no account required to view
- Embed diagrams in your internal docs via iframe
- Templates for common patterns (microservices, CQRS, event-driven)

### For the Team

> Architecture diagrams that stay current.

- Everyone on the team can access and fork diagrams
- Diagram-as-code means diffs are readable in GitHub PR reviews
- AI explains any node — new joiners can self-serve

---

## Product Goals

### 6-Month Goals

1. Deliver a fully working Phase 1–3 product (canvas + code + auth + persistence)
2. Reach 500 registered users organically via developer communities
3. Achieve < 3 second load time for the canvas editor
4. Zero data loss — every diagram change is persisted reliably

### 12-Month Goals

1. Complete all 5 phases (including AI and sharing)
2. Open source the codebase on GitHub
3. Reach 5,000 active users
4. 50+ community-contributed templates
5. VS Code extension (view/edit diagrams from the editor)

---

## Feature Breakdown

---

### Feature 1 — Infinite Canvas

**What it is:** A pannable, zoomable canvas powered by React Flow where developers drag, drop, and connect architecture components.

**Why it matters:** The canvas is the core surface. Everything else is built on top of it. It must feel fast, fluid, and keyboard-native.

**Behaviour:**
- Canvas loads instantly with a grid background
- Mouse scroll = zoom, Space + drag = pan
- Click empty area = deselect all
- Right-click = context menu (Add Node, Paste, Select All)
- Snap-to-grid toggle in toolbar
- Mini-map in bottom-right corner (toggleable)

**Edge cases:**
- Very large diagrams (100+ nodes) must not lag — use React Flow virtualization
- Zoom level persists when navigating away and back
- Canvas state auto-saves every 1 second (debounced)

---

### Feature 2 — Node Types

**What it is:** A set of pre-built, styled architecture primitives available in the sidebar palette.

**Node Library:**

| Node | Icon | Use Case |
|---|---|---|
| Service | Rectangle | Any microservice, app, or worker |
| Database | Cylinder | PostgreSQL, MongoDB, MySQL |
| Cache | Rectangle (dashed) | Redis, Memcached |
| Queue | Rectangle + arrows | RabbitMQ, SQS, Kafka |
| API Gateway | Diamond | Kong, AWS API Gateway, Nginx |
| Load Balancer | Trapezoid | ALB, Nginx, HAProxy |
| User / Actor | Circle | End user, client, browser |
| Group / Boundary | Dashed container | VPC, Kubernetes cluster, region |
| Cloud Service | Icon box | AWS/GCP/Azure specific services |

**Behaviour:**
- Drag any node from sidebar palette onto canvas
- Double-click label to edit inline
- Select node → Properties Panel opens on right
- Delete key removes selected node (with connected edges)
- Nodes snap to grid when snap is enabled

**Node Properties (editable):**
- Label text
- Accent color (6 presets + custom hex)
- Description / notes
- Border style (solid, dashed, none)

---

### Feature 3 — Connections (Edges)

**What it is:** Directional connections between nodes with labels and style options.

**Behaviour:**
- Hover any node → handles appear on all 4 sides
- Drag from handle to another node to create an edge
- Click edge to select it
- Double-click edge label to edit
- Delete selected edge with Delete/Backspace

**Edge Options:**
- Type: Bezier (default) / Straight / Step / Smoothstep
- Label: optional text on edge
- Arrow direction: forward / backward / bidirectional / none
- Color: inherits from source node accent (overridable)

**Smart Routing:**
- Edges auto-route around nodes (smoothstep)
- Edge labels avoid overlapping with nodes

---

### Feature 4 — Properties Panel

**What it is:** A right-side panel that shows editable properties for the selected node or edge.

**Node properties:** Label, Color, Description, Border style  
**Edge properties:** Label, Type, Arrow direction, Color

**Behaviour:**
- Panel opens automatically on node/edge selection
- Changes apply live to canvas (no save button needed)
- Panel collapses when nothing is selected
- Panel is resizable (drag the left border)

---

### Feature 5 — Undo / Redo

**What it is:** Full undo/redo history for all canvas operations, stored in Redux.

**Supported operations:**
- Add / delete node
- Move node
- Add / delete edge
- Edit node label or properties
- Paste / duplicate nodes

**Implementation:**
- Redux `past[]` and `future[]` arrays in `diagramSlice`
- Every mutating action pushes current state to `past`
- Undo pops from `past`, pushes to `future`
- History limit: 50 steps

**Shortcuts:** `Ctrl+Z` undo, `Ctrl+Shift+Z` redo

---

### Feature 6 — Export

**What it is:** Export the current canvas as a PNG file.

**Phase 1 exports:**
- PNG (full canvas, transparent or white background)
- Copy to clipboard

**Phase 5 exports (later):**
- SVG
- Mermaid code snippet
- JSON (diagram state)

**Behaviour:**
- Export captures entire canvas, not just viewport
- File named `{diagram-title}-{date}.png`
- Export button in top toolbar
- Shortcut: `Ctrl+E`

---

### Feature 7 — Diagram-as-Code (Phase 2)

**What it is:** A Monaco editor panel showing the Mermaid representation of the canvas. Changes in either direction sync in real time.

**Two-way sync:**
```
Edit canvas → Mermaid code updates automatically
Edit Mermaid code → Canvas updates automatically
```

**Panel layout:**
- Code panel slides in from the right (or bottom — toggleable)
- Monaco editor with Mermaid syntax highlighting
- Live preview pane below the editor
- Sync indicator (green = in sync, red = parse error)

**Supported Mermaid diagrams:**
- `graph TD` / `graph LR` (flowchart)
- `sequenceDiagram`
- `erDiagram` (Phase 2 stretch)

**Behaviour:**
- Parse errors shown inline in editor (red underline)
- Invalid Mermaid does not crash the canvas — shows last valid state
- Code can be copied to clipboard in one click
- Toggle panel: `Ctrl+/`

---

### Feature 8 — Authentication (Phase 3)

**What it is:** User accounts via NextAuth.js.

**Auth methods:**
- Google OAuth
- Email + magic link (passwordless)

**Behaviour:**
- Unauthenticated users can use the canvas in guest mode (localStorage only)
- Guest prompted to sign in when they try to save or share
- On sign-in, guest diagram is migrated to their account automatically
- Session persists across browser sessions (JWT)

---

### Feature 9 — Diagram Persistence (Phase 3)

**What it is:** Save diagrams to PostgreSQL, accessible across devices and sessions.

**Behaviour:**
- Auto-save every 2 seconds after last change (debounced)
- Save indicator in toolbar (Saved / Saving... / Unsaved changes)
- Diagrams are scoped to the authenticated user
- Optimistic UI — canvas stays usable while save is in-flight

**Diagram metadata:**
- Title (editable in toolbar)
- Created at / Updated at timestamps
- Thumbnail (auto-generated on save)

---

### Feature 10 — Dashboard (Phase 3)

**What it is:** A grid of all saved diagrams for the authenticated user.

**Behaviour:**
- Shows diagram thumbnail, title, last updated date
- Click to open in editor
- Right-click or kebab menu: Rename, Duplicate, Delete
- New Diagram button creates a blank canvas
- Search bar to filter diagrams by title
- Sort: Last updated / Created / Alphabetical

---

### Feature 11 — AI Diagram Generation (Phase 4)

**What it is:** A natural language prompt that generates a diagram on the canvas using the Claude API.

**How it works:**
1. Developer clicks AI button in toolbar (or presses `Ctrl+K`)
2. Modal opens with a text input
3. Developer types a description of the system
4. ArchFlow calls Claude API with a structured system prompt
5. Claude returns a JSON payload of nodes and edges
6. ArchFlow renders them on the canvas

**Example prompts:**
```
"Design a microservices architecture for an e-commerce platform 
 with an order service, inventory service, payment service, 
 and an API gateway"

"Show me a CQRS architecture with event sourcing for a 
 banking application"

"Draw a three-tier web architecture on AWS with EC2, RDS, 
 and an Application Load Balancer"
```

**Behaviour:**
- Streaming response — nodes appear progressively
- Generated diagram placed in center of current viewport
- Undo treats generation as a single action
- User can regenerate with a modified prompt
- Error state shown if API fails

---

### Feature 12 — AI Node Explanation (Phase 4)

**What it is:** Select any node and ask AI to explain what it does in the context of the architecture.

**How it works:**
1. Select a node on canvas
2. Click "Explain" in properties panel
3. Claude reads the node type, label, connections, and surrounding context
4. Returns a plain-English explanation

**Example output:**
```
"This is the Order Service — a microservice responsible for 
 managing the lifecycle of customer orders. It receives 
 requests from the API Gateway, reads/writes to the Orders 
 Database, and publishes events to the Message Queue when 
 order state changes (e.g. OrderPlaced, OrderShipped)."
```

---

### Feature 13 — Shareable Links (Phase 5)

**What it is:** Generate a public, read-only URL for any diagram that anyone can view without an account.

**Behaviour:**
- Share button in toolbar opens Share Modal
- Click "Generate Link" → creates a unique `shareId`
- Link format: `archflow.app/shared/{shareId}`
- Shared view is read-only — no editing, no login required
- Diagram owner can revoke the link at any time
- Optional: password-protect the share link

**Shared view:**
- Full canvas (pan/zoom allowed, no editing)
- Read-only banner at top
- "Open in ArchFlow" button (opens editor — requires login)
- Export PNG button available on shared view

---

### Feature 14 — Template Gallery (Phase 5)

**What it is:** A library of pre-built architecture diagrams developers can use as starting points.

**Built-in templates:**

| Template | Description |
|---|---|
| Microservices | API Gateway → multiple services → shared DB |
| Monolith | Single app → DB → cache |
| Event-Driven | Services communicate via message queue |
| CQRS | Separate read/write models with event sourcing |
| Three-Tier Web | Frontend → Backend → Database |
| Serverless | API Gateway → Lambda → DynamoDB |
| CI/CD Pipeline | Git → Build → Test → Deploy → Monitor |
| Data Pipeline | Ingestion → Processing → Storage → Visualization |

**Behaviour:**
- Gallery accessible from dashboard and editor
- Click template → preview modal → "Use this template"
- Template loaded as new diagram (or inserted into existing canvas)
- Community templates (Phase 6) — user-submitted

---

### Feature 15 — Embed (Phase 5)

**What it is:** An iframe-embeddable version of any shared diagram for use in Notion, Confluence, GitHub READMEs, and internal docs.

**How to embed:**
```html
<iframe 
  src="https://archflow.app/embed/{shareId}" 
  width="800" 
  height="500"
  frameborder="0">
</iframe>
```

**Behaviour:**
- Embed view is read-only with pan/zoom
- No toolbar, no banner — clean for embedding
- Auto-resizes to container width
- Updates automatically when diagram owner saves

---

## User Stories

### Canvas

- As a developer, I want to drag a Service node onto the canvas so I can start building my architecture diagram.
- As a developer, I want to connect two nodes by dragging from one handle to another so I can show data flow.
- As a developer, I want to double-click a node label to edit it inline so I don't have to open a properties panel.
- As a developer, I want to undo my last action with Ctrl+Z so I can recover from mistakes quickly.
- As a developer, I want to export my diagram as a PNG so I can paste it into Notion or Slack.

### Code Panel

- As a developer, I want to write Mermaid code and see my canvas update live so I can work in code instead of drag-and-drop.
- As a developer, I want my canvas edits to reflect in the Mermaid code so I can copy the code into my project docs.

### Auth + Persistence

- As a developer, I want to sign in with Google so I don't have to create another password.
- As a developer, I want my diagram to auto-save so I never lose work if I close the tab.
- As a developer, I want a dashboard showing all my diagrams so I can organize my architecture docs.

### AI

- As a developer, I want to describe my system in plain English and get a diagram so I can skip the manual drag-and-drop.
- As a developer, I want to select a node and ask AI to explain it so I can understand an inherited architecture.

### Sharing

- As a tech lead, I want to generate a shareable link so I can send my architecture to a stakeholder who doesn't have an account.
- As a developer, I want to embed my diagram in a Confluence page so my team can always see the latest version.

---

## User Flows

### Flow 1 — First-Time User (Guest)

```
Land on archflow.app
→ Click "Start Designing"
→ Canvas opens (guest mode, no login)
→ Drag first node from palette
→ Connect two nodes
→ Edit labels
→ Try to share → prompted to sign in
→ Signs in with Google
→ Diagram migrated to account
→ Share link generated
```

### Flow 2 — AI Generation

```
Open editor
→ Click AI button (Ctrl+K)
→ Type: "Design a microservices e-commerce architecture"
→ Nodes stream onto canvas
→ Review and adjust positions
→ Edit labels as needed
→ Export or save
```

### Flow 3 — Code to Canvas

```
Open editor
→ Toggle code panel (Ctrl+/)
→ Type Mermaid flowchart
→ Canvas renders in real time
→ Switch to canvas, drag nodes to reposition
→ Code updates automatically
→ Copy Mermaid snippet for README
```

### Flow 4 — Returning User

```
Log in → Dashboard
→ See all saved diagrams with thumbnails
→ Click existing diagram
→ Canvas loads with saved state
→ Make changes → auto-saved
```

---

## Non-Goals

The following are explicitly out of scope for v1:

- **Real-time collaboration** — multiple users editing the same canvas simultaneously (planned for Phase 7)
- **Timeline / Gantt charts** — ArchFlow is for system architecture, not project management
- **Wireframing / UI mockups** — not a Figma replacement
- **Database query builder** — we show databases as nodes, not schema editors
- **Code generation** — AI generates diagrams, not source code
- **Mobile editing** — canvas editing is desktop-only (mobile view is read-only)
- **Offline mode** — requires internet for AI features and sync (localStorage fallback for canvas)
- **Plugin marketplace** — not in v1 roadmap

---

## Competitive Landscape

| Tool | Strength | Weakness vs ArchFlow |
|---|---|---|
| **Eraser.io** | Polished, AI-native | Closed source, expensive for teams |
| **Lucidchart** | Enterprise features, templates | Not dev-native, slow UI |
| **Draw.io** | Free, offline | No AI, no code sync, dated UI |
| **Miro** | Collaboration, flexibility | Too general, no code primitives |
| **Excalidraw** | Fast, open source, handdrawn | No code sync, no AI, no architecture nodes |
| **Mermaid (raw)** | Code-native, Git-friendly | No visual canvas, hard to learn syntax |
| **PlantUML** | Powerful, code-native | Steep learning curve, ugly output |

---

## Differentiation

What makes ArchFlow different from every tool above:

1. **Developer-native UX** — keyboard shortcuts, code panel, Git-friendly export. Not built for PMs.
2. **Two-way Mermaid sync** — no other visual tool does canvas ↔ code in both directions.
3. **AI that understands architecture** — not generic image generation. Knows what a service mesh is.
4. **Open source** — self-hostable, auditable, community-extendable.
5. **Free tier that's actually useful** — unlimited diagrams, no watermark, no node limit.
6. **Speed** — canvas loads in under 1 second. No onboarding wizard, no template picker on first open.

---

## Success Metrics

### Engagement

| Metric | Target (6 months) |
|---|---|
| Registered users | 500 |
| Weekly active users | 150 |
| Diagrams created | 2,000+ |
| Avg session length | > 8 minutes |
| Diagrams shared | 300+ |

### Quality

| Metric | Target |
|---|---|
| Canvas load time | < 1.5 seconds |
| Auto-save success rate | > 99.9% |
| AI generation success rate | > 90% |
| Error rate (JS errors) | < 0.5% of sessions |

### Retention

| Metric | Target |
|---|---|
| Day 7 retention | > 30% |
| Day 30 retention | > 15% |
| Users who create 3+ diagrams | > 40% |

---

## Phased Delivery

| Phase | Features | Timeline | Status |
|---|---|---|---|
| **Phase 1** | Canvas, Nodes, Edges, Properties, Undo/Redo, Export, LocalStorage | Weeks 1–4 | ✅ Complete |
| **Phase 2** | Monaco Editor, Mermaid + Eraser Sync, Code Panel | Weeks 5–6 | ✅ Complete |
| **Phase 3** | Auth, PostgreSQL, Dashboard, Auto-save to DB | Weeks 7–8 | 📋 Planned |
| **Phase 4** | Share Links, Templates, Embed | Weeks 9–10 | 📋 Planned |
| **Phase 5** | AI Generation, AI Explain, Streaming UI | Weeks 11–13 | 📋 Planned |
| **Phase 6** | GitHub Import, Community Templates | TBD | 💭 Idea |
| **Phase 7** | Real-time Collaboration (WebSockets) | TBD | 💭 Idea |
| **Phase 8** | VS Code Extension | TBD | 💭 Idea |

---

## Technical Constraints

- **React Flow** handles canvas virtualization — do not bypass its node rendering pipeline
- **Mermaid.js** parses synchronously — debounce canvas-to-code conversion to avoid UI blocking
- **Claude API** has rate limits — implement client-side request queuing for AI features
- **PostgreSQL JSON columns** store nodes/edges — avoid deep nesting beyond 3 levels
- **Next.js App Router** — all data fetching in Server Components where possible; canvas is entirely client-side
- **localStorage limit** is ~5MB — compress diagram JSON before storing for large diagrams

---

## Open Questions

1. **Guest mode limit** — Should guest users (no login) have a node count limit? (e.g. max 20 nodes before prompting sign-up)
2. **Mermaid vs custom DSL** — Should we build a custom ArchFlow DSL eventually, or stay Mermaid-compatible?
3. **Pricing model** — Free + paid team plan? Or fully free and open source forever?
4. **Cloud node icons** — License AWS/GCP/Azure icons properly or build custom alternatives?
5. **Mobile read-only** — Should shared diagrams be fully interactive on mobile (pan/zoom) or static image?
6. **AI model** — Claude API for now. Should we support OpenAI / local models (Ollama) as alternatives?
7. **Self-hosting** — Should Phase 1 ship with a Docker Compose setup for self-hosters?

---

*This document is a living product spec. Update it as decisions are made and scope changes.*