# 🎨 UI Mockup - Claude Code Sync Banner

## 📱 Preview Completo Dashboard

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Orchestro Dashboard                                     👤 User  ⚙️      │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Dashboard                                                               │
│  Gestisci i tuoi task e la configurazione Orchestro                    │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │ ⚠️  Sincronizza Orchestro con Claude Code                         │ │
│  │                                                                     │ │
│  │ Per abilitare AI suggestions, sincronizza i tuoi agenti e MCP     │ │
│  │ tools con Claude Code. Copia il prompt qui sotto e incollalo:     │ │
│  │                                                                     │ │
│  │ ┌─────────────────────────────────┐  ┌──────────────────────────┐ │ │
│  │ │ 📋 Copia Prompt per Claude Code │  │ Mostra prompt dettagliato│ │ │
│  │ └─────────────────────────────────┘  └──────────────────────────┘ │ │
│  │                                                                     │ │
│  │ ⚡ "Usa mcp-orchestro per fare setup completo: sync agenti da     │ │
│  │     .claude/agents/, inizializza config progetto (projectId: ...) │ │
│  │                                                                     │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│  │ 📋 Tasks    │  │ ⚡ Agents   │  │ 🔧 Tools    │  │ ✅ Done     │   │
│  │             │  │             │  │             │  │             │   │
│  │     42      │  │      0      │  │      0      │  │     12      │   │
│  │             │  │             │  │             │  │             │   │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘   │
│                                                                          │
│  Recent Tasks                                                            │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │ No tasks                                                            │ │
│  │                                                                     │ │
│  │ Get started by decomposing a user story in Claude Code             │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 🟢 Stato DOPO Sync

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Orchestro Dashboard                                     👤 User  ⚙️      │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Dashboard                                                               │
│  Gestisci i tuoi task e la configurazione Orchestro                    │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │ ✅ Sincronizzazione Attiva                                         │ │
│  │                                                                     │ │
│  │ 5 agenti e 6 MCP tools sincronizzati                              │ │
│  │ Ultimo sync: 04/10/2025, 16:30                                     │ │
│  │                                                                     │ │
│  │ ┌─────────────────────────────────┐  ┌──────────────────────────┐ │ │
│  │ │ 📋 Copia Prompt per Claude Code │  │ Mostra prompt dettagliato│ │ │
│  │ └─────────────────────────────────┘  └──────────────────────────┘ │ │
│  │                                                                     │ │
│  │ ⚡ "Usa mcp-orchestro per fare setup completo..."                 │ │
│  │                                                                     │ │
│  │ ────────────────────────────────────────────────────────────────── │ │
│  │ 🔄 Risincronizza agenti e tools                                    │ │
│  │                                                                     │ │
│  │ ● 5 Agenti    ● 6 MCP Tools    ● Sincronizzato                    │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│  │ 📋 Tasks    │  │ ⚡ Agents   │  │ 🔧 Tools    │  │ ✅ Done     │   │
│  │             │  │             │  │             │  │             │   │
│  │     42      │  │      5      │  │      6      │  │     12      │   │
│  │             │  │             │  │             │  │             │   │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘   │
│                                                                          │
│  Recent Tasks                                                            │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │ Setup database schema for JWT authentication              backlog  │ │
│  │ Create PostgreSQL tables for users and refresh_tokens...           │ │
│  │ 🤖 database-guardian (91% confidence)                              │ │
│  ├────────────────────────────────────────────────────────────────────┤ │
│  │ Implement JWT token generation and validation            backlog  │ │
│  │ Create TypeScript utilities for JWT operations...                  │ │
│  ├────────────────────────────────────────────────────────────────────┤ │
│  │ Build authentication endpoints with password hashing     backlog  │ │
│  │ Create Node.js/Express endpoints: POST /auth/register...           │ │
│  │ 🤖 api-guardian (37% confidence)                                   │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 🔍 Banner Espanso (Dettagli)

```
┌────────────────────────────────────────────────────────────────────────┐
│ ⚠️  Sincronizza Orchestro con Claude Code                             │
│                                                                        │
│ Per abilitare AI suggestions, sincronizza i tuoi agenti e MCP tools   │
│ con Claude Code. Copia il prompt qui sotto e incollalo:               │
│                                                                        │
│ ┌─────────────────────────────────┐  ┌─────────────────────────────┐ │
│ │ 📋 Copia Prompt per Claude Code │  │ ▼ Nascondi dettagli         │ │
│ └─────────────────────────────────┘  └─────────────────────────────┘ │
│                                                                        │
│ ⚡ "Usa mcp-orchestro per fare setup completo: sync agenti da         │
│     .claude/agents/, inizializza config progetto..."                  │
│                                                                        │
│ ┌──────────────────────────────────────────────────────────────────┐ │
│ │ 📋 Prompt Completo (Step-by-Step)                    📋 Copia    │ │
│ ├──────────────────────────────────────────────────────────────────┤ │
│ │                                                                   │ │
│ │ Esegui il setup completo di mcp-orchestro:                       │ │
│ │                                                                   │ │
│ │ 1. Sync agenti Claude Code:                                      │ │
│ │    mcp__orchestro__sync_claude_code_agents con projectId:        │ │
│ │    7b189723-6695-4f56-80bd-ef242f293402                          │ │
│ │                                                                   │ │
│ │ 2. Inizializza configurazione:                                   │ │
│ │    mcp__orchestro__initialize_project_configuration con          │ │
│ │    projectId: 7b189723-6695-4f56-80bd-ef242f293402               │ │
│ │                                                                   │ │
│ │ 3. Verifica sincronizzazione:                                    │ │
│ │    mcp__orchestro__get_project_configuration con projectId:      │ │
│ │    7b189723-6695-4f56-80bd-ef242f293402                          │ │
│ │                                                                   │ │
│ │ Mostrami un riepilogo dei risultati.                             │ │
│ └──────────────────────────────────────────────────────────────────┘ │
│                                                                        │
│ ┌──────────────────────────────────────────────────────────────────┐ │
│ │ 💡 Come usarlo:                                                   │ │
│ │                                                                   │ │
│ │ 1. Copia il prompt usando il pulsante sopra                       │ │
│ │ 2. Apri Claude Code nel tuo editor                               │ │
│ │ 3. Incolla il prompt nella chat di Claude Code                   │ │
│ │ 4. Premi Invio e attendi il completamento                        │ │
│ │ 5. Ricarica questa pagina per vedere i risultati                 │ │
│ └──────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 📱 Mobile View

```
┌─────────────────────────────┐
│  Orchestro       👤 ⚙️      │
├─────────────────────────────┤
│                             │
│ ┌─────────────────────────┐ │
│ │ ⚠️  Sync Orchestro      │ │
│ │                         │ │
│ │ Abilita AI suggestions  │ │
│ │ con Claude Code.        │ │
│ │                         │ │
│ │ ┌─────────────────────┐ │ │
│ │ │ 📋 Copia Prompt     │ │ │
│ │ └─────────────────────┘ │ │
│ │                         │ │
│ │ ⚡ "Usa mcp-orchestro   │ │
│ │    per setup..."        │ │
│ │                         │ │
│ │ ┌─────────────────────┐ │ │
│ │ │ ▼ Dettagli          │ │ │
│ │ └─────────────────────┘ │ │
│ └─────────────────────────┘ │
│                             │
│ ┌──────┐ ┌──────┐           │
│ │Tasks │ │Agents│           │
│ │  42  │ │  0   │           │
│ └──────┘ └──────┘           │
│                             │
│ ┌──────┐ ┌──────┐           │
│ │Tools │ │Done  │           │
│ │  0   │ │  12  │           │
│ └──────┘ └──────┘           │
│                             │
│ Recent Tasks                │
│ ┌─────────────────────────┐ │
│ │ No tasks                │ │
│ │                         │ │
│ │ Get started in          │ │
│ │ Claude Code             │ │
│ └─────────────────────────┘ │
│                             │
└─────────────────────────────┘
```

---

## 🎬 Animazione Copy Feedback

### Before Click
```
┌─────────────────────────────────┐
│ 📋 Copia Prompt per Claude Code │
└─────────────────────────────────┘
```

### During Copy (100ms)
```
┌─────────────────────────────────┐
│ ⏳ Copiando...                   │
└─────────────────────────────────┘
```

### After Copy (2 seconds)
```
┌─────────────────────────────────┐
│ ✅ Copiato!                      │
└─────────────────────────────────┘
```

### Back to Normal
```
┌─────────────────────────────────┐
│ 📋 Copia Prompt per Claude Code │
└─────────────────────────────────┘
```

---

## 🌈 Color Palette

### Not Synced (Amber)
```css
Background:   #FFFBEB  (amber-50)
Border:       #FDE68A  (amber-200)
Text:         #92400E  (amber-900)
Text Light:   #B45309  (amber-800)
Button BG:    #D97706  (amber-600)
Button Hover: #B45309  (amber-700)
Icon:         #D97706  (amber-600)
```

### Synced (Green)
```css
Background:   #F0FDF4  (green-50)
Border:       #BBF7D0  (green-200)
Text:         #14532D  (green-900)
Text Light:   #166534  (green-800)
Button BG:    #16A34A  (green-600)
Button Hover: #15803D  (green-700)
Icon:         #16A34A  (green-600)
```

### Neutral (White/Gray)
```css
Card BG:      #FFFFFF  (white)
Border:       #E5E7EB  (gray-200)
Text:         #111827  (gray-900)
Text Light:   #6B7280  (gray-600)
Code BG:      #F9FAFB  (gray-50)
```

---

## 🔤 Typography

```
Banner Title (Amber):
  Font: Inter, sans-serif
  Size: 14px (text-sm)
  Weight: 600 (font-semibold)
  Color: #92400E (amber-900)

Banner Description:
  Font: Inter, sans-serif
  Size: 14px (text-sm)
  Weight: 400 (normal)
  Color: #B45309 (amber-800)

Button:
  Font: Inter, sans-serif
  Size: 14px (text-sm)
  Weight: 500 (font-medium)
  Color: #FFFFFF (white)

Code/Prompt:
  Font: JetBrains Mono, monospace
  Size: 12px (text-xs)
  Weight: 400 (normal)
  Color: #374151 (gray-700)

Stats:
  Font: Inter, sans-serif
  Size: 12px (text-xs)
  Weight: 400 (normal)
  Color: #16A34A (green-700)
```

---

## 📐 Spacing & Layout

```
Banner:
  Padding: 16px (p-4)
  Margin Bottom: 24px (mb-6)
  Border Radius: 8px (rounded-lg)
  Border Width: 1px

Icon Container:
  Width: 24px (h-6 w-6)
  Flex Shrink: 0

Content Gap:
  Between Icon & Content: 16px (gap-4)
  Between Elements: 12px (mb-3)

Button:
  Padding: 8px 16px (px-4 py-2)
  Border Radius: 6px (rounded-md)
  Gap Icon-Text: 8px (gap-2)

Code Block:
  Padding: 12px (p-3)
  Border Radius: 6px (rounded-md)
  Background: 50% opacity white
```

---

## 🎨 Interactive States

### Button Hover
```
Normal:      bg-amber-600
Hover:       bg-amber-700
Active:      bg-amber-800
Disabled:    bg-gray-300 cursor-not-allowed
```

### Copy Feedback
```
Idle:        "📋 Copia Prompt per Claude Code"
Copied:      "✅ Copiato!" (2s duration)
```

### Expand/Collapse
```
Collapsed:   "▶ Mostra prompt dettagliato"
Expanded:    "▼ Nascondi dettagli"
```

---

## ✨ Features Highlights

### 1. Smart Status Detection
```
if (agentCount === 0 || toolCount === 0) {
  → Show "⚠️ Not Synced" (Amber)
} else {
  → Show "✅ Synced" (Green)
}
```

### 2. One-Click Copy
```
onClick={() => {
  navigator.clipboard.writeText(prompt);
  setCopied(true);
  setTimeout(() => setCopied(false), 2000);
}}
```

### 3. Collapsible Details
```
showDetails ?
  <DetailedPrompt /> :
  <QuickPrompt />
```

### 4. Auto-Generated Prompt
```
const prompt = `
Usa mcp-orchestro per fare setup completo:
sync agenti, init config (projectId: ${projectId}),
mostra risultati.
`;
```

---

## 🚀 Quick Integration

### Step 1: Import Component
```tsx
import ClaudeCodeSyncBanner from '@/components/ClaudeCodeSyncBanner';
```

### Step 2: Fetch Data
```tsx
const [syncStatus, setSyncStatus] = useState({
  projectId: '',
  agentCount: 0,
  toolCount: 0,
  lastSyncDate: null,
});

useEffect(() => {
  fetch(`/api/sync-status?projectId=${projectId}`)
    .then(res => res.json())
    .then(setSyncStatus);
}, []);
```

### Step 3: Render
```tsx
<ClaudeCodeSyncBanner {...syncStatus} />
```

---

**Risultato**: Banner intelligente che guida l'utente step-by-step! 🎉
