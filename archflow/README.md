# ArchFlow

> **AI-powered system architecture diagramming tool for developers.**  
> Design, visualize, and share your system architecture on an infinite canvas — with diagram-as-code, AI generation, and real-time collaboration.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Development Phases](#development-phases)
- [Redux Store](#redux-store)
- [Node Types](#node-types)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [API Routes](#api-routes)
- [Database Schema](#database-schema)
- [Scripts](#scripts)
- [Contributing](#contributing)

---

## Overview

ArchFlow is an open-source, developer-focused architecture diagramming tool inspired by [Eraser.io](https://www.eraser.io). It lets developers drag, connect, and label system components on an infinite canvas — and supports diagram-as-code via Mermaid.js, AI-powered diagram generation, and shareable read-only links.

```
Prompt → AI → Canvas → Export / Share
Code   → Mermaid → Canvas (two-way sync)
Drag   → Drop → Connect → Design
```

---

## Features

### Phase 1 — Canvas MVP ✅
- Infinite zoomable/pannable canvas (React Flow)
- Node types, Eraser icons, canvas text labels, drag-and-drop palette
- L-shape / curve / straight edges, line controls, bend handles
- Properties panel (resizable desktop, sheet on mobile), auto-open on selection
- Undo/redo, copy/paste, context menu, keyboard shortcuts
- PNG export, localStorage auto-save, mobile banner, error boundary

### Phase 2 — Diagram-as-Code ✅
- Code sheet (`Ctrl+/`) with Monaco Mermaid editor + live preview
- Two-way sync: canvas ↔ Mermaid; Eraser DSL mode with validation
- Copy snippet, sync badge, onboarding tip, Vitest round-trip tests

### Phase 3 — Auth + Persistence 📋 Planned
- UI shells for login, register, and dashboard (localStorage today)
- API routes and Prisma schema — **not yet implemented**

### Phase 4 — AI Generation 📋 Planned
- API route stubs only; toolbar AI buttons disabled

### Phase 5 — Sharing + Templates 📋 Planned
- Shared view placeholder; share/templates not yet implemented

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Canvas | React Flow |
| Code Editor | Monaco Editor |
| Diagram-as-Code | Mermaid.js |
| State Management | Redux Toolkit + React Redux |
| Auth | NextAuth.js |
| Database ORM | Prisma |
| Database | PostgreSQL |
| AI | Claude API (Anthropic) |
| ID Generation | nanoid |
| Package Manager | npm |

---

## Project Structure

```
archflow/
├── public/
│   ├── icons/
│   │   ├── nodes/                        # Node type SVG icons
│   │   └── clouds/                       # AWS / GCP / Azure icons
│   └── templates/                        # JSON diagram templates
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── src/
│   ├── app/
│   │   ├── (auth)/                       # Login / Register pages
│   │   ├── dashboard/                    # Diagram list
│   │   ├── editor/[diagramId]/           # Main canvas editor
│   │   ├── shared/[shareId]/             # Read-only shared view
│   │   └── api/                          # API routes
│   │       ├── auth/[...nextauth]/
│   │       ├── diagrams/[diagramId]/
│   │       └── ai/generate | explain
│   │
│   ├── components/
│   │   ├── canvas/                       # CanvasBoard, controls, edges
│   │   ├── nodes/                        # All node type components
│   │   ├── sidebar/                      # NodePalette, PaletteItem
│   │   ├── toolbar/                      # Top bar, export, share, AI
│   │   ├── properties/                   # Node/Edge property panels
│   │   ├── code-panel/                   # Monaco + Mermaid preview
│   │   ├── auth/                         # Login/Register forms
│   │   ├── dashboard/                    # DiagramCard, DiagramGrid
│   │   ├── ai/                           # AI prompt modal, explain panel
│   │   ├── share/                        # Share modal, read-only banner
│   │   ├── templates/                    # Template gallery
│   │   └── ui/                           # Button, Modal, Input, Tooltip...
│   │
│   ├── store/
│   │   ├── index.ts                      # configureStore
│   │   ├── hooks.ts                      # useAppDispatch, useAppSelector
│   │   └── slices/
│   │       ├── diagramSlice.ts           # nodes, edges, undo/redo
│   │       ├── uiSlice.ts                # sidebar, panels, selected
│   │       ├── authSlice.ts              # user session
│   │       ├── diagramsSlice.ts          # dashboard list
│   │       └── aiSlice.ts                # prompt, loading, result
│   │
│   ├── hooks/
│   │   ├── useCanvasDrop.ts              # Palette → canvas drop
│   │   ├── useExport.ts                  # PNG export
│   │   ├── useUndoRedo.ts                # Keyboard undo/redo
│   │   ├── useAutoSave.ts                # localStorage / DB save
│   │   ├── useMermaidSync.ts             # Code ↔ canvas sync
│   │   ├── useDiagrams.ts                # Fetch diagram list
│   │   ├── useAiGenerate.ts              # Call AI API
│   │   └── useShareLink.ts               # Generate share URL
│   │
│   ├── lib/
│   │   ├── reactflow/                    # nodeTypes, edgeTypes, viewport
│   │   ├── mermaid/                      # mermaidToFlow, flowToMermaid
│   │   ├── ai/                           # promptBuilder, responseParser
│   │   ├── db/                           # Prisma client singleton
│   │   └── auth/                         # NextAuth options
│   │
│   ├── utils/
│   │   ├── nodeFactory.ts                # Create RF node by type
│   │   ├── edgeFactory.ts                # Create RF edge with defaults
│   │   ├── generateId.ts                 # nanoid wrapper
│   │   ├── downloadFile.ts               # Trigger browser download
│   │   └── cn.ts                         # Tailwind clsx helper
│   │
│   ├── types/
│   │   ├── diagram.ts                    # Node, Edge, NodeType
│   │   ├── auth.ts                       # User, Session
│   │   ├── api.ts                        # API request/response
│   │   └── ai.ts                         # AI prompt/response
│   │
│   └── constants/
│       ├── nodeDefaults.ts               # Default label/color per type
│       ├── edgeDefaults.ts               # Default edge style
│       ├── paletteGroups.ts              # Sidebar grouping config
│       └── shortcuts.ts                  # Keyboard shortcut map
│
├── .env.local
├── .env.example
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/yashdark01/archflow.git
cd archflow

# 2. Install dependencies
npm install reactflow @monaco-editor/react mermaid @reduxjs/toolkit react-redux

# 3. Install dev/utility packages
npm install nanoid clsx tailwind-merge

# 4. Install auth + db packages (Phase 3)
npm install next-auth @prisma/client prisma

# 5. Copy environment variables
cp .env.example .env.local

# 6. Setup database (Phase 3)
npx prisma generate
npx prisma migrate dev --name init

# 7. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

```env
# .env.example

# App
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_here

# Database (Phase 3)
DATABASE_URL=postgresql://user:password@localhost:5432/archflow

# Auth Providers (Phase 3)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# AI (Phase 4)
ANTHROPIC_API_KEY=your_anthropic_api_key
```

---

## Development Phases

### Phase 1 — Canvas MVP *(Weeks 1–3)*
Core canvas with drag-drop nodes, connections, properties panel, undo/redo, PNG export, and localStorage auto-save.

```bash
# Only needs base install
npm run dev
```

### Phase 2 — Diagram-as-Code *(Weeks 4–5)*
Monaco editor with Mermaid.js. Two-way sync between code and canvas.

```bash
npm install mermaid @monaco-editor/react
```

### Phase 3 — Auth + Persistence *(Week 6)*
NextAuth login, PostgreSQL via Prisma, diagram dashboard.

```bash
npm install next-auth @prisma/client prisma
npx prisma migrate dev --name init
```

### Phase 4 — AI Generation *(Week 7)*
Claude API integration. Prompt → diagram, node explanation.

```bash
# Add ANTHROPIC_API_KEY to .env.local
```

### Phase 5 — Share + Templates *(Week 8)*
Shareable read-only links, template gallery, iframe embed.

---

## Redux Store

### State Shape

```ts
// diagramSlice — canvas state
{
  nodes: Node[],
  edges: Edge[],
  past:   Array<{ nodes: Node[], edges: Edge[] }>,  // undo stack
  future: Array<{ nodes: Node[], edges: Edge[] }>,  // redo stack
}

// uiSlice — UI state
{
  selectedNodeId:      string | null,
  selectedEdgeId:      string | null,
  sidebarOpen:         boolean,
  propertiesPanelOpen: boolean,
  codePanelOpen:       boolean,
  activeEdgeType:      'bezier' | 'straight' | 'smoothstep',
}

// authSlice — user session (Phase 3)
{
  user:   { id, name, email, image } | null,
  status: 'idle' | 'loading' | 'authenticated' | 'unauthenticated',
}

// diagramsSlice — dashboard list (Phase 3)
{
  diagrams: Diagram[],
  status:   'idle' | 'loading' | 'succeeded' | 'failed',
  error:    string | null,
}

// aiSlice — AI state (Phase 4)
{
  prompt:  string,
  status:  'idle' | 'loading' | 'succeeded' | 'failed',
  result:  string | null,
  error:   string | null,
}
```

### Key Actions

```ts
// diagramSlice
diagramSlice.actions.addNode(node)
diagramSlice.actions.updateNode({ id, changes })
diagramSlice.actions.removeNode(id)
diagramSlice.actions.addEdge(edge)
diagramSlice.actions.removeEdge(id)
diagramSlice.actions.setNodes(nodes)
diagramSlice.actions.setEdges(edges)
diagramSlice.actions.undo()
diagramSlice.actions.redo()
diagramSlice.actions.loadDiagram({ nodes, edges })

// uiSlice
uiSlice.actions.setSelectedNode(id)
uiSlice.actions.setSelectedEdge(id)
uiSlice.actions.toggleSidebar()
uiSlice.actions.toggleCodePanel()
uiSlice.actions.setActiveEdgeType(type)
```

---

## Node Types

| Type | Description | Shape |
|---|---|---|
| `service` | Generic microservice / application | Rectangle |
| `database` | SQL / NoSQL database | Cylinder |
| `queue` | Message queue / event bus | Rectangle + arrows |
| `cache` | Redis / Memcached | Rectangle |
| `apiGateway` | API Gateway / reverse proxy | Diamond |
| `loadBalancer` | Load balancer | Trapezoid |
| `user` | Actor / end user | Circle |
| `group` | Boundary container (VPC, cluster) | Dashed rectangle |
| `cloud` | AWS / GCP / Azure service node | Icon box |

Each node supports:
- Editable label (double-click)
- Source/target handles on all 4 sides
- Custom color via properties panel
- Description field
- Selected state highlight

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl + Z` | Undo |
| `Ctrl + Shift + Z` | Redo |
| `Ctrl + A` | Select all |
| `Delete` / `Backspace` | Delete selected node or edge |
| `Escape` | Deselect all |
| `Ctrl + C` | Copy selected nodes |
| `Ctrl + V` | Paste nodes |
| `Ctrl + D` | Duplicate selected nodes |
| `Ctrl + E` | Export as PNG |
| `Ctrl + /` | Toggle code panel |
| `Space + Drag` | Pan canvas |
| `Scroll` | Zoom in / out |

---

## API Routes

### Diagrams

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/diagrams` | Get all diagrams for user |
| `POST` | `/api/diagrams` | Create new diagram |
| `GET` | `/api/diagrams/[id]` | Get single diagram |
| `PUT` | `/api/diagrams/[id]` | Update diagram |
| `DELETE` | `/api/diagrams/[id]` | Delete diagram |
| `POST` | `/api/diagrams/[id]/share` | Generate share link |

### AI

| Method | Route | Description |
|---|---|---|
| `POST` | `/api/ai/generate` | Prompt → diagram nodes/edges |
| `POST` | `/api/ai/explain` | Explain selected node |

### Request / Response Examples

```ts
// POST /api/ai/generate
{
  "prompt": "Design a microservices architecture for an e-commerce app"
}

// Response
{
  "nodes": [...],
  "edges": [...]
}

// POST /api/diagrams
{
  "title": "My Architecture",
  "nodes": [...],
  "edges": [...]
}
```

---

## Database Schema

```prisma
// prisma/schema.prisma

model User {
  id        String    @id @default(cuid())
  name      String?
  email     String    @unique
  image     String?
  diagrams  Diagram[]
  createdAt DateTime  @default(now())
}

model Diagram {
  id        String   @id @default(cuid())
  title     String   @default("Untitled Diagram")
  nodes     Json
  edges     Json
  shareId   String?  @unique
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

## Scripts

```bash
# Development
npm run dev           # Start dev server on localhost:3000

# Build
npm run build         # Production build
npm run start         # Start production server

# Database
npx prisma generate           # Generate Prisma client
npx prisma migrate dev        # Run migrations in dev
npx prisma migrate deploy     # Run migrations in production
npx prisma studio             # Open Prisma Studio GUI

# Linting
npm run lint          # ESLint check
npm run lint:fix      # ESLint auto-fix
```

---

## Contributing

```bash
# Fork and clone
git clone https://github.com/yashdark01/archflow.git

# Create a feature branch
git checkout -b feature/your-feature-name

# Make your changes, then commit
git commit -m "feat: add your feature"

# Push and open a PR
git push origin feature/your-feature-name
```

### Branch Naming

| Prefix | Use |
|---|---|
| `feature/` | New features |
| `fix/` | Bug fixes |
| `phase/` | Phase-level work |
| `docs/` | Documentation only |
| `refactor/` | Code restructure |

---

## Roadmap

- [ ] Phase 1 — Canvas MVP
- [ ] Phase 2 — Diagram-as-Code (Mermaid)
- [ ] Phase 3 — Auth + PostgreSQL
- [ ] Phase 4 — AI Generation (Claude API)
- [ ] Phase 5 — Share + Templates
- [ ] Phase 6 — GitHub import (repo → architecture)
- [ ] Phase 7 — Real-time collaboration (WebSockets)
- [ ] Phase 8 — VS Code extension

---

## License

MIT © [Yash Patidar](https://github.com/yashdark01)