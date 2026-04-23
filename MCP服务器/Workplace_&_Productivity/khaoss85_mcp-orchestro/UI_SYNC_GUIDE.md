# 🎨 UI Sync Guide: Claude Code ↔️ Orchestro

## 📋 Panoramica

Abbiamo aggiunto un **banner intelligente** nella dashboard che suggerisce automaticamente il prompt da copiare in Claude Code per sincronizzare agenti e MCP tools.

---

## ✨ Funzionalità del Banner

### 1. **Rilevamento Automatico dello Stato**

Il banner cambia aspetto in base allo stato di sincronizzazione:

#### 🟡 **Non Sincronizzato** (Giallo/Amber)
```
┌─────────────────────────────────────────────────┐
│ ⚠️  Sincronizza Orchestro con Claude Code      │
│                                                 │
│ Per abilitare AI suggestions, sincronizza i    │
│ tuoi agenti e MCP tools con Claude Code.       │
│                                                 │
│ [📋 Copia Prompt per Claude Code]              │
│                                                 │
│ "Usa mcp-orchestro per fare setup completo..." │
└─────────────────────────────────────────────────┘
```

#### 🟢 **Sincronizzato** (Verde)
```
┌─────────────────────────────────────────────────┐
│ ✅ Sincronizzazione Attiva                     │
│                                                 │
│ 5 agenti e 6 MCP tools sincronizzati          │
│ Ultimo sync: 04/10/2025, 16:30                │
│                                                 │
│ [📋 Copia Prompt per Claude Code]              │
│ [🔄 Risincronizza agenti e tools]             │
│                                                 │
│ ● 5 Agenti  ● 6 MCP Tools  ● Sincronizzato    │
└─────────────────────────────────────────────────┘
```

---

## 🎯 Come Funziona per l'Utente

### Step 1: Apri la Dashboard

L'utente vede il banner in alto nella dashboard:

```tsx
// app/dashboard/page.tsx
<ClaudeCodeSyncBanner
  projectId={data.projectId}
  lastSyncDate={data.lastSyncDate}
  agentCount={data.agentCount}
  toolCount={data.toolCount}
/>
```

### Step 2: Click "Copia Prompt"

Quando l'utente clicca il pulsante, viene copiato questo prompt:

**Versione Quick (Default)**:
```
Usa mcp-orchestro per fare setup completo: sync agenti da .claude/agents/,
inizializza config progetto (projectId: 7b189723-6695-4f56-80bd-ef242f293402),
e mostrami il risultato finale con numero di agenti e tools configurati.
```

**Versione Dettagliata (Click "Mostra prompt dettagliato")**:
```
Esegui il setup completo di mcp-orchestro:

1. Sync agenti Claude Code:
   mcp__orchestro__sync_claude_code_agents con projectId: 7b189723-6695-4f56-80bd-ef242f293402

2. Inizializza configurazione:
   mcp__orchestro__initialize_project_configuration con projectId: 7b189723-6695-4f56-80bd-ef242f293402

3. Verifica sincronizzazione:
   mcp__orchestro__get_project_configuration con projectId: 7b189723-6695-4f56-80bd-ef242f293402

Mostrami un riepilogo dei risultati.
```

### Step 3: Incolla in Claude Code

1. L'utente apre Claude Code nel suo editor
2. Incolla il prompt copiato
3. Preme Invio
4. Claude Code esegue automaticamente:
   - Sync degli agenti da `.claude/agents/`
   - Inizializzazione MCP tools
   - Verifica configurazione

### Step 4: Ricarica Dashboard

Dopo il sync, l'utente ricarica la dashboard e vede:

```
✅ Sincronizzazione Attiva
5 agenti e 6 MCP tools sincronizzati
● 5 Agenti  ● 6 MCP Tools  ● Sincronizzato
```

---

## 🔧 Componenti Creati

### 1. **ClaudeCodeSyncBanner.tsx**

**Path**: `web-dashboard/components/ClaudeCodeSyncBanner.tsx`

**Props**:
```typescript
interface ClaudeCodeSyncBannerProps {
  projectId: string;        // ID progetto
  lastSyncDate?: string;    // Data ultimo sync
  agentCount?: number;      // Numero agenti sincronizzati
  toolCount?: number;       // Numero MCP tools
}
```

**Features**:
- ✅ Rilevamento automatico stato sync
- ✅ Copy to clipboard con feedback visuale
- ✅ Prompt quick (1 comando)
- ✅ Prompt dettagliato (3 step)
- ✅ Istruzioni passo-passo
- ✅ Pulsante risincronizza
- ✅ Status indicators

### 2. **Dashboard Page**

**Path**: `web-dashboard/app/dashboard/page.tsx`

**Features**:
- ✅ Integrazione banner in alto
- ✅ Stats cards (tasks, agenti, tools, completed)
- ✅ Recent tasks con agent suggestions
- ✅ Auto-refresh dello stato

### 3. **Sync Status API**

**Path**: `web-dashboard/app/api/sync-status/route.ts`

**Endpoint**: `GET /api/sync-status?projectId=xxx`

**Response**:
```json
{
  "synced": true,
  "agentCount": 5,
  "toolCount": 6,
  "lastSyncDate": "2025-10-04T14:30:00Z",
  "agents": [
    {"name": "database-guardian", "type": "database-guardian", "enabled": true},
    ...
  ],
  "tools": [
    {"name": "supabase", "type": "supabase", "enabled": true},
    ...
  ]
}
```

---

## 🎨 Design Specs

### Colori

| Stato | Background | Border | Text | Icon |
|-------|-----------|--------|------|------|
| Not Synced | `bg-amber-50` | `border-amber-200` | `text-amber-800` | `text-amber-600` |
| Synced | `bg-green-50` | `border-green-200` | `text-green-800` | `text-green-600` |

### Icone (Lucide React)

- ⚠️ Not Synced: `<AlertCircle />`
- ✅ Synced: `<Check />`
- 📋 Copy: `<Copy />`
- 🔄 Refresh: `<RefreshCw />`
- ⚡ Quick: `<Zap />`

### Spacing

- Padding interno: `p-4`
- Margine bottom: `mb-6`
- Gap tra elementi: `gap-4`

---

## 🚀 Setup & Deploy

### 1. Installa Dipendenze

```bash
cd web-dashboard
npm install lucide-react
```

### 2. Aggiungi Componente alla Dashboard

```tsx
// app/dashboard/page.tsx
import ClaudeCodeSyncBanner from '@/components/ClaudeCodeSyncBanner';

export default function DashboardPage() {
  // ... fetch data

  return (
    <div>
      <ClaudeCodeSyncBanner
        projectId={data.projectId}
        lastSyncDate={data.lastSyncDate}
        agentCount={data.agentCount}
        toolCount={data.toolCount}
      />
      {/* resto della dashboard */}
    </div>
  );
}
```

### 3. API Route (già creato)

Il file `app/api/sync-status/route.ts` gestisce il fetch dello stato.

### 4. Build & Run

```bash
npm run dev
# Apri http://localhost:3000/dashboard
```

---

## 📱 Responsive Design

Il banner è completamente responsive:

### Desktop (≥1024px)
- Layout orizzontale
- Prompt visibile inline
- Dettagli espandibili

### Tablet (768px - 1023px)
- Layout orizzontale compatto
- Prompt troncato con "..."

### Mobile (<768px)
- Layout verticale
- Stack degli elementi
- Pulsanti full-width

---

## 🔄 Auto-Refresh Strategy

### Opzione A: Polling (Attuale)

```tsx
useEffect(() => {
  const interval = setInterval(() => {
    fetchSyncStatus();
  }, 30000); // Ogni 30 secondi

  return () => clearInterval(interval);
}, []);
```

### Opzione B: WebSocket (Futuro)

```tsx
useEffect(() => {
  const ws = new WebSocket('ws://localhost:3000/sync-status');

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    setSyncStatus(data);
  };

  return () => ws.close();
}, []);
```

### Opzione C: Manual Refresh

Pulsante "Ricarica" che l'utente può cliccare dopo il sync in Claude Code.

---

## 🎯 User Flow Completo

```
1. Utente apre Dashboard
   ↓
2. Vede banner "Non Sincronizzato"
   ↓
3. Click "Copia Prompt per Claude Code"
   ↓
4. Prompt copiato in clipboard
   ↓
5. Apre Claude Code
   ↓
6. Incolla prompt
   ↓
7. Claude Code esegue sync (5-10 secondi)
   ↓
8. Ritorna alla Dashboard
   ↓
9. (Opzionale) Click "Refresh" o auto-refresh
   ↓
10. Banner cambia a "Sincronizzato ✅"
    ↓
11. Stats aggiornate (5 agenti, 6 tools)
    ↓
12. Task con agent suggestions visibili
```

---

## 🧪 Testing Checklist

### UI Testing

- [ ] Banner appare correttamente non sincronizzato
- [ ] Copy to clipboard funziona
- [ ] Feedback visuale "Copiato!" appare
- [ ] Prompt quick è corretto
- [ ] Prompt dettagliato è espandibile
- [ ] Istruzioni sono chiare
- [ ] Banner cambia a sincronizzato dopo sync
- [ ] Stats aggiornate correttamente

### Integration Testing

- [ ] API `/api/sync-status` ritorna dati corretti
- [ ] Dashboard fetch funziona
- [ ] Auto-refresh aggiorna stato
- [ ] Pulsante risincronizza funziona

### E2E Testing

- [ ] Flow completo utente → Claude Code → Dashboard
- [ ] Sync agenti funziona
- [ ] Init tools funziona
- [ ] Tasks mostrano agent suggestions

---

## 📝 Customization

### Modifica Prompt Template

Per cambiare il prompt suggerito:

```tsx
// ClaudeCodeSyncBanner.tsx
const quickPrompt = `
IL TUO PROMPT PERSONALIZZATO QUI
projectId: ${projectId}
`;
```

### Aggiungi Nuovi MCP Tools

```tsx
// Durante init
const defaultTools = [
  ...existingTools,
  {
    name: 'custom-tool',
    tool_type: 'custom',
    command: 'npx custom-tool',
    when_to_use: ['keyword1', 'keyword2'],
  }
];
```

### Cambia Stile

```tsx
// Modifica colori
const needsSync
  ? 'border-blue-200 bg-blue-50'  // Invece di amber
  : 'border-green-200 bg-green-50'
```

---

## 🐛 Troubleshooting

### Banner non appare

**Causa**: Componente non importato

**Fix**:
```tsx
import ClaudeCodeSyncBanner from '@/components/ClaudeCodeSyncBanner';
```

### Copy non funziona

**Causa**: HTTPS richiesto per clipboard API

**Fix**: Usa `localhost` o HTTPS in production

### Sync status sempre "non sincronizzato"

**Causa**: API non ritorna dati

**Fix**: Verifica che migration 012 sia applicata

### Agent count sempre 0

**Causa**: Sync non eseguito

**Fix**: Copia prompt e esegui in Claude Code

---

## 📚 Files di Riferimento

### UI Components
- `/Users/pelleri/Documents/mcp-coder-expert/web-dashboard/components/ClaudeCodeSyncBanner.tsx`
- `/Users/pelleri/Documents/mcp-coder-expert/web-dashboard/app/dashboard/page.tsx`

### API Routes
- `/Users/pelleri/Documents/mcp-coder-expert/web-dashboard/app/api/sync-status/route.ts`

### Backend Integration
- `/Users/pelleri/Documents/mcp-coder-expert/src/tools/claudeCodeSync.ts`
- `/Users/pelleri/Documents/mcp-coder-expert/src/tools/configuration.ts`

---

## ✅ Conclusione

Il banner intelligente rende il processo di sync **self-service** e **user-friendly**:

1. ✅ L'utente vede subito se è sincronizzato
2. ✅ Copy-paste del prompt con 1 click
3. ✅ Istruzioni chiare passo-passo
4. ✅ Feedback visuale immediato
5. ✅ Stats aggiornate in tempo reale

**Risultato**: L'utente può sincronizzare agenti e tools in **< 30 secondi** senza conoscere i comandi MCP! 🎉
