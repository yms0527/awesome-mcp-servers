# Multi-Agent, Multi-Session Dashboard Spec

**Status**: Design draft
**Author**: auto-generated from architecture review
**Date**: 2026-02-28

---

## 1. Goals

Support a dashboard that can:

1. Display **multiple agents running in parallel**, each with its own conversation, tool calls, and state.
2. Allow the user to **switch between sessions** for any agent — viewing historical conversations alongside the live one.
3. Present a **unified activity stream** that aggregates tool calls, state changes, and plans across all agents.
4. Route **browser input** (messages, commands, tool approvals) to the correct agent.
5. Remain **backward-compatible** — a single-agent setup works exactly as today with zero configuration.

---

## 2. Concepts

### 2.1 Agent

An **agent** is an autonomous LLM-driven entity with:

- An **agent_id** (e.g. `"agent-main"`, `"agent-research"`, `"agent-coder"`)
- Its own **ChatContext** (model, provider, system prompt, tools, conversation history)
- Its own **ConversationProcessor** and **ToolProcessor**
- Its own **input queue** for receiving browser / terminal input
- A **role** or **description** (free text, displayed in the UI)
- An optional **parent agent_id** (for supervisor → delegate relationships)

An agent may be:

| Lifecycle       | Description |
|-----------------|-------------|
| **active**      | Running its chat loop, can receive input |
| **paused**      | Exists but chat loop is suspended (awaiting user or another agent) |
| **completed**   | Finished its task, read-only history |
| **failed**      | Errored out, read-only history |

### 2.2 Session

A **session** is a persisted conversation for an agent:

- Each agent has a **current session** (live) and zero or more **saved sessions** (on disk).
- Session files are namespaced: `~/.mcp-cli/sessions/{agent_id}/{session_id}.json`
- `SessionMetadata` gains an `agent_id` field.
- The session list endpoint can filter by agent.

### 2.3 Agent Group

An **agent group** is the top-level orchestration unit:

- Contains one or more agents.
- Has a **supervisor agent** (optional) that can spawn/stop other agents.
- Has a shared **plan** (optional) that coordinates agent work.
- Single-agent mode is just a group of one with no supervisor.

---

## 3. Data Model Changes

### 3.1 SessionMetadata (session_store.py)

```python
class SessionMetadata(BaseModel):
    session_id: str
    agent_id: str = "default"        # NEW
    agent_name: str = ""             # NEW — human-readable label
    created_at: str
    updated_at: str
    provider: str
    model: str
    message_count: int = 0
    description: str = ""
    parent_session_id: str | None = None  # NEW — if spawned from another session
    tags: list[str] = []             # NEW — user-defined tags for organisation
```

### 3.2 ChatContext additions

```python
class ChatContext:
    agent_id: str = "default"        # NEW — propagated to bridge, sessions
    agent_name: str = ""             # NEW — human label
    agent_role: str = ""             # NEW — e.g. "researcher", "coder"
    parent_agent_id: str | None      # NEW — supervisor link
```

### 3.3 AgentDescriptor (new)

```python
@dataclass
class AgentDescriptor:
    """Lightweight descriptor for an agent visible to the dashboard."""
    agent_id: str
    name: str
    role: str
    status: Literal["active", "paused", "completed", "failed"]
    model: str
    provider: str
    session_id: str
    parent_agent_id: str | None = None
    tool_count: int = 0
    message_count: int = 0
    created_at: str = ""
```

---

## 4. Bridge Architecture

### 4.1 Current: 1 Bridge → 1 Server → 1 ChatContext

```
Terminal ─── input_queue ──► ChatContext ◄── DashboardBridge ──► DashboardServer ──► Browser
```

### 4.2 Future: AgentRouter → N Bridges → 1 Server

```
                                  ┌── DashboardBridge(agent-A) ◄──► ChatContext(A)
Terminal ──► AgentRouter ─────────┤
                │                 ├── DashboardBridge(agent-B) ◄──► ChatContext(B)
                │                 │
                │                 └── DashboardBridge(agent-C) ◄──► ChatContext(C)
                │
                └──► DashboardServer ──► Browser(s)
```

**Key principle**: One `DashboardServer` (one WebSocket endpoint, one HTTP port), but messages are **tagged with `agent_id`** and **routed** by an `AgentRouter`.

### 4.3 AgentRouter (new module: `dashboard/router.py`)

```python
class AgentRouter:
    """Routes messages between browser clients and multiple agent bridges."""

    def __init__(self, server: DashboardServer) -> None:
        self.server = server
        self._bridges: dict[str, DashboardBridge] = {}
        self._agent_descriptors: dict[str, AgentDescriptor] = {}

        # Which agent each browser client is "focused" on
        self._client_focus: dict[ServerConnection, str] = {}  # ws → agent_id

        # Wire server callbacks
        server.on_browser_message = self._on_browser_message
        server.on_client_connected = self._on_client_connected
        server.on_client_disconnected = self._on_client_disconnected

    # ── Agent lifecycle ──────────────────────────────────────────
    def register_agent(self, agent_id: str, bridge: DashboardBridge, descriptor: AgentDescriptor) -> None: ...
    def unregister_agent(self, agent_id: str) -> None: ...
    def update_agent_status(self, agent_id: str, status: str) -> None: ...

    # ── Outbound (agent → browser) ──────────────────────────────
    async def broadcast_from_agent(self, agent_id: str, message: dict) -> None:
        """Inject agent_id into the envelope and broadcast."""
        message["payload"]["agent_id"] = agent_id
        await self.server.broadcast(message)

    async def broadcast_global(self, message: dict) -> None:
        """Broadcast a message not scoped to any agent (e.g. AGENT_LIST)."""
        await self.server.broadcast(message)

    # ── Inbound (browser → agent) ───────────────────────────────
    async def _on_browser_message(self, msg: dict, ws: ServerConnection) -> None:
        """Route browser message to the correct agent bridge."""
        agent_id = msg.get("agent_id") or self._client_focus.get(ws) or "default"
        bridge = self._bridges.get(agent_id)
        if bridge:
            await bridge._on_browser_message(msg)

    # ── Focus management ─────────────────────────────────────────
    async def _handle_focus_agent(self, msg: dict, ws: ServerConnection) -> None:
        """Browser client changed which agent it's viewing."""
        agent_id = msg.get("agent_id", "default")
        self._client_focus[ws] = agent_id
        # Send full state replay for the focused agent
        bridge = self._bridges.get(agent_id)
        if bridge:
            await bridge._on_client_connected(ws)
```

### 4.4 DashboardBridge changes

The existing `DashboardBridge` stays mostly the same but:

1. **Receives its `agent_id`** in the constructor.
2. **Does NOT own the server** — the `AgentRouter` owns it.
3. Uses `router.broadcast_from_agent(self.agent_id, msg)` instead of `self.server.broadcast(msg)`.
4. `_on_client_connected` becomes a method that the router calls when a client focuses this agent.
5. Inbound messages already arrive pre-routed by the router.

```python
class DashboardBridge:
    def __init__(self, agent_id: str, router: AgentRouter) -> None:
        self.agent_id = agent_id
        self.router = router
        # ... rest same as today

    async def _broadcast(self, envelope: dict) -> None:
        """Broadcast via router (injects agent_id)."""
        await self.router.broadcast_from_agent(self.agent_id, envelope)
```

**Backward compat**: When `AgentRouter` has only one bridge and it's `"default"`, behavior is identical to today.

### 4.5 DashboardServer changes

The server needs to pass the `ws` (client connection) to the message callback so the router can identify which client sent the message:

```python
# Current:
on_browser_message: Callable[[dict], Awaitable] | None

# New:
on_browser_message: Callable[[dict, ServerConnection], Awaitable] | None
```

The server also gains:

```python
async def send_to_client(self, ws: ServerConnection, message: str) -> None:
    """Send to a specific client (not broadcast)."""

@property
def clients(self) -> set[ServerConnection]:
    """Expose client set for router focus tracking."""
```

---

## 5. Message Protocol Changes

### 5.1 Universal `agent_id` on all payloads

Every outbound envelope gains `agent_id` in the payload:

```json
{
  "protocol": "mcp-dashboard",
  "version": 2,
  "type": "TOOL_RESULT",
  "payload": {
    "agent_id": "agent-research",
    "tool_name": "web_search",
    ...
  }
}
```

**Version bump**: Protocol version goes from 1 → 2. Views check version and handle both.

### 5.2 New message types

| Type | Direction | Payload | Description |
|------|-----------|---------|-------------|
| `AGENT_LIST` | server → browser | `{ agents: AgentDescriptor[] }` | Full list of registered agents |
| `AGENT_REGISTERED` | server → browser | `AgentDescriptor` | A new agent joined |
| `AGENT_UNREGISTERED` | server → browser | `{ agent_id }` | An agent left |
| `AGENT_STATUS` | server → browser | `{ agent_id, status, ... }` | Agent status update (active/paused/completed/failed) |
| `FOCUS_AGENT` | browser → server | `{ agent_id }` | Client wants to focus a different agent |
| `REQUEST_AGENT_LIST` | browser → server | `{}` | Client requests current agent list |

### 5.3 Inbound messages gain `agent_id`

All browser → server messages can optionally include `agent_id`:

```json
{ "type": "USER_MESSAGE", "agent_id": "agent-coder", "content": "Fix the bug" }
```

If omitted, the router uses the client's current focus agent.

### 5.4 Session messages gain `agent_id` scoping

| Type | Change |
|------|--------|
| `REQUEST_SESSIONS` | Response filtered by `agent_id` of focused agent |
| `SESSION_LIST` | Includes `agent_id` per session entry |
| `SWITCH_SESSION` | Can specify `agent_id` to switch a different agent's session |

---

## 6. Shell (UI) Changes

### 6.1 Agent Selector

The shell header gains an **agent tab bar**:

```
┌─────────────────────────────────────────────────────┐
│ [Main ●] [Research ◐] [Coder ○]     ⚙ Settings     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────┐  ┌─────────────────────────┐  │
│  │ Agent Terminal   │  │ Activity Stream          │  │
│  │ (focused agent)  │  │ (all agents or filtered) │  │
│  └─────────────────┘  └─────────────────────────┘  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

- Each tab shows: agent name, status indicator (●=active, ◐=paused, ○=completed, ✗=failed)
- Clicking a tab sends `FOCUS_AGENT` → router replays that agent's state
- The currently focused agent receives keyboard/browser input

### 6.2 Agent-scoped views

When the focus changes:

1. Shell sends `FOCUS_AGENT` to the server.
2. Router responds with `CONVERSATION_HISTORY`, `ACTIVITY_HISTORY`, `CONFIG_STATE`, `TOOL_REGISTRY` for the focused agent.
3. Views that are agent-scoped (agent-terminal, plan-viewer) update.
4. Views that are global (activity-stream in "all agents" mode) continue showing everything.

### 6.3 Activity stream modes

The activity stream gains a filter dropdown:

| Mode | Behavior |
|------|----------|
| **All Agents** | Shows events from every agent, color-coded by agent |
| **Focused Agent** | Only shows events from the currently focused agent |
| **Agent X** | Pin to a specific agent regardless of focus |

Each event card gains an agent badge:

```
┌─ agent-research ──────────────────────────┐
│ 🔧 web_search                    342ms    │
│ ✓ 3 results                  14:23:01     │
└───────────────────────────────────────────┘
```

### 6.4 Message routing in js/dispatcher.js

The shell UI is split into ES modules under `static/js/`. Message routing
lives in `dispatcher.js` (`handleBridgeMessage`):

```javascript
// Current (implemented): agent-aware routing
case 'TOOL_RESULT':
  sendToActivityStream('TOOL_RESULT', msg.payload);
  if (isFocusedAgent(msg)) routeToViews('TOOL_RESULT', msg.payload);
  break;
```

Module layout:

```
static/js/
├── state.js        — shared state, constants, SIDEBAR_VIEW_IDS
├── utils.js        — esc(), showToast(), makeDraggable(), drawers
├── theme.js        — loadThemes(), applyTheme()
├── websocket.js    — connectWS(), sendToBridge(), agent tabs
├── views.js        — iframe lifecycle, postMessage routing
├── layout.js       — grid panels, resize handles, syncViewPositions
├── sidebar.js      — collapsible sections, open/close, mobile mode
├── apps.js         — handleAppLaunched(), handleAppClosed()
├── config.js       — provider/model/server selects
├── sessions.js     — session list, session switching
├── export.js       — exportConversation()
├── toolbar.js      — toolbar click handlers, overflow menu
├── approval.js     — tool approval dialog
├── dispatcher.js   — handleBridgeMessage() (big switch)
└── init.js         — entry point, wires late-binding deps
```

---

## 7. View Changes

### 7.1 Agent Terminal

- Displays conversation for **one agent at a time** (the focused agent).
- On `FOCUS_AGENT` change, clears and replays from `CONVERSATION_HISTORY`.
- Input always routes to the focused agent.
- Status bar shows: `agent-name · model · tokens · turn`

### 7.2 Activity Stream

- Each event card has an **agent badge** (colored dot + short name).
- Agent colors are assigned from a palette based on registration order.
- Filter bar gains agent dropdown alongside existing server/status filters.
- `ACTIVITY_HISTORY` replays are tagged with the originating agent_id.

### 7.3 Plan Viewer

- Shows plans for the **focused agent** by default.
- Can optionally show a "supervisor plan" that spans multiple agents.
- Each plan step can indicate which agent is executing it.

### 7.4 Config Panel

- Shows config for the **focused agent** (model, provider, servers, system prompt).
- Model/provider switching applies to the focused agent only.
- Shows a read-only summary of other agents' configs.

### 7.5 NEW: Agent Overview Panel (`builtin:agent-overview`)

A new built-in view showing all agents at a glance:

```
┌─────────────────────────────────────────────────┐
│                Agent Overview                    │
├─────────────────────────────────────────────────┤
│                                                  │
│  ┌─ agent-main ──────────────────────┐          │
│  │ ● Active  │  claude-sonnet  │  42 msgs      │
│  │ Role: Supervisor                   │          │
│  │ Current: Planning next steps...    │          │
│  └────────────────────────────────────┘          │
│                                                  │
│  ┌─ agent-research ──────────────────┐          │
│  │ ◐ Tool calling  │  gpt-4o  │  18 msgs       │
│  │ Role: Research assistant           │          │
│  │ Current: web_search("mcp spec")    │          │
│  └────────────────────────────────────┘          │
│                                                  │
│  ┌─ agent-coder ─────────────────────┐          │
│  │ ○ Completed  │  claude-opus  │  67 msgs      │
│  │ Role: Code implementation          │          │
│  │ Finished: All tests passing        │          │
│  └────────────────────────────────────┘          │
│                                                  │
└─────────────────────────────────────────────────┘
```

---

## 8. Session Management for Multi-Agent

### 8.1 Storage layout

```
~/.mcp-cli/sessions/
├── default/                    # single-agent (backward compat)
│   ├── chat-a1b2c3d4e5f6.json
│   └── chat-f6e5d4c3b2a1.json
├── agent-research/
│   ├── chat-111111111111.json
│   └── chat-222222222222.json
└── agent-coder/
    └── chat-333333333333.json
```

### 8.2 Session list scoping

`SessionStore.list_sessions(agent_id=None)`:

- `agent_id=None` → list all sessions across all agents
- `agent_id="agent-research"` → list only that agent's sessions

### 8.3 Session switching per agent

Each agent can independently switch sessions without affecting other agents:

```json
// Browser sends:
{ "type": "SWITCH_SESSION", "agent_id": "agent-research", "session_id": "chat-222222222222" }

// Router routes to agent-research's bridge
// Bridge loads the session, broadcasts CONVERSATION_HISTORY + ACTIVITY_HISTORY
// Only clients focused on agent-research see the update
```

### 8.4 Group save/restore

Save/restore an entire agent group:

```
~/.mcp-cli/groups/
└── my-project-2026-02-28/
    ├── group.json              # agent descriptors, relationships, shared plan
    ├── agent-main/session.json
    ├── agent-research/session.json
    └── agent-coder/session.json
```

`group.json`:
```json
{
  "group_id": "grp-abc123",
  "created_at": "2026-02-28T12:00:00Z",
  "description": "Project X implementation",
  "agents": [
    {
      "agent_id": "agent-main",
      "name": "Main",
      "role": "supervisor",
      "model": "claude-sonnet",
      "provider": "anthropic",
      "session_id": "chat-aaa",
      "parent_agent_id": null
    },
    {
      "agent_id": "agent-research",
      "name": "Research",
      "role": "researcher",
      "model": "gpt-4o",
      "provider": "openai",
      "session_id": "chat-bbb",
      "parent_agent_id": "agent-main"
    }
  ],
  "plan": { ... }
}
```

---

## 9. Inter-Agent Communication

### 9.1 Message passing

Agents can send messages to each other through the router:

```python
# New message type
{ "type": "AGENT_MESSAGE", "from_agent": "agent-main", "to_agent": "agent-research", "content": "Search for MCP spec v2" }
```

The router delivers this to the target agent's input queue as a system-injected message.

### 9.2 Shared context / artifacts

Agents can publish artifacts (text, data, files) to a shared store:

```python
{ "type": "PUBLISH_ARTIFACT", "agent_id": "agent-research", "artifact_id": "search-results", "content": "..." }
{ "type": "REQUEST_ARTIFACT", "agent_id": "agent-coder", "artifact_id": "search-results" }
```

The dashboard can visualize these as edges in the agent overview.

### 9.3 Supervisor delegation

A supervisor agent can:

1. **Spawn** a new agent: `{ "type": "SPAWN_AGENT", "descriptor": {...}, "initial_prompt": "..." }`
2. **Stop** an agent: `{ "type": "STOP_AGENT", "agent_id": "agent-research" }`
3. **Query** agent status: `{ "type": "REQUEST_AGENT_STATUS", "agent_id": "agent-research" }`
4. **Receive** completion notifications: `{ "type": "AGENT_COMPLETED", "agent_id": "agent-research", "summary": "..." }`

These are implemented as internal tools available to the supervisor:

```python
# Planning/orchestration tools
agent_spawn(name, role, model, provider, initial_prompt) -> agent_id
agent_stop(agent_id) -> bool
agent_status(agent_id) -> AgentDescriptor
agent_message(agent_id, content) -> str
agent_wait(agent_id) -> completion_summary
```

---

## 10. Tool State Isolation

### 10.1 Current problem

`get_tool_state()` from `chuk_ai_session_manager.guards` returns a **module-level singleton**. Multiple agents sharing the same process would share tool limits, rate counters, and guard state.

### 10.2 Solution

```python
# Per-agent tool state factory
def get_tool_state(agent_id: str = "default") -> ToolState:
    """Return a ToolState scoped to the given agent."""
    ...

# In ChatContext.__init__:
self._tool_state = get_tool_state(self.agent_id)

# In ConversationProcessor.__init__:
self._tool_state = self.context._tool_state  # no more module-level call
```

### 10.3 Per-agent tool filtering

Each agent can have a restricted tool set:

```python
class AgentConfig:
    agent_id: str
    allowed_tools: list[str] | None = None     # None = all tools
    denied_tools: list[str] | None = None      # explicit blocklist
    allowed_servers: list[str] | None = None    # None = all servers
    tool_timeout_override: float | None = None
    auto_approve_tools: list[str] | None = None  # skip confirmation for these
```

---

## 11. WebSocket Protocol v2

### 11.1 Envelope changes

```json
{
  "protocol": "mcp-dashboard",
  "version": 2,
  "type": "TOOL_RESULT",
  "agent_id": "agent-research",
  "payload": { ... }
}
```

`agent_id` moves to the **envelope level** (not buried in payload) for efficient routing without deserializing payload.

### 11.2 Client subscription model

Instead of "broadcast everything to everyone", clients subscribe:

```json
// Client sends on connect:
{ "type": "SUBSCRIBE", "agents": ["agent-main", "agent-research"], "global": true }

// Server only sends events for subscribed agents + global events
// Client can update subscription:
{ "type": "SUBSCRIBE", "agents": ["agent-coder"], "global": true }
```

Benefits:
- Reduces bandwidth for multi-agent setups
- Allows activity stream to subscribe to all, terminal to subscribe to one
- Popout windows can subscribe independently

### 11.3 Per-view subscriptions

Views declare what they want in their READY message:

```json
{
  "type": "READY",
  "payload": {
    "name": "Agent Terminal",
    "accepts": ["CONVERSATION_MESSAGE", "CONVERSATION_TOKEN", ...],
    "agent_scope": "focused",      // "focused" | "all" | specific agent_id
    "version": 2
  }
}
```

The shell uses this to route efficiently.

---

## 12. Implementation Phases

### Phase A: Foundation (agent_id plumbing)

**No visible multi-agent yet — just add the wiring.**

1. Add `agent_id` field to `ChatContext`, `SessionMetadata`, all bridge payloads
2. Add `agent_id` to envelope level (protocol v2, backward compat with v1)
3. Namespace session storage: `sessions/{agent_id}/`
4. Pass `agent_id` through `ToolProcessor`, `ConversationProcessor`
5. Shell ignores `agent_id` for now (treats everything as "default")

**Tests**: Verify all payloads carry `agent_id`, session files go in right directory, backward compat with existing `sessions/` files (auto-migrate to `sessions/default/`).

### Phase B: AgentRouter + Server changes

1. Implement `AgentRouter` class
2. Modify `DashboardServer` to pass `ws` to message callbacks
3. Add `send_to_client()` method on server
4. Bridge uses router instead of server directly
5. Single-agent mode: router has one bridge, behaves identically to today

**Tests**: Router with 1 bridge = same as direct bridge. Router with 2 bridges routes correctly. Focus switching replays correct state.

### Phase C: Shell multi-agent UI

1. Agent tab bar in shell header
2. `FOCUS_AGENT` message type
3. Agent-scoped view routing
4. Activity stream agent filtering + badges
5. Agent overview panel (new built-in view)
6. `AGENT_LIST` / `AGENT_REGISTERED` / `AGENT_UNREGISTERED` handling

**Tests**: UI tests with mock agents. Focus switching. Activity stream filtering.

### Phase D: Agent orchestration

1. `AgentConfig` model for per-agent tool/server restrictions
2. Supervisor tools: `agent_spawn`, `agent_stop`, `agent_message`, `agent_wait`
3. Inter-agent message passing via router
4. Shared artifact store
5. Group save/restore

**Tests**: Spawn/stop lifecycle. Message delivery. Artifact publish/request. Group save/load.

### Phase E: Client subscriptions + scale

1. Subscription model on WebSocket
2. Per-view agent_scope in READY
3. Efficient routing (only send to subscribed clients)
4. Tool state isolation per agent
5. Performance testing with 5+ concurrent agents

---

## 13. Backward Compatibility

| Concern | Strategy |
|---------|----------|
| Existing sessions in `~/.mcp-cli/sessions/` | Auto-migrate to `sessions/default/` on first access |
| Protocol v1 clients | Router checks version, omits `agent_id` from envelope for v1 |
| Single-agent mode | `AgentRouter` with one `"default"` bridge = transparent |
| Bridge API | Keep `DashboardBridge` constructor accepting `server` (creates implicit router) |
| No `--multi-agent` flag | Default behavior is single agent, no overhead |
| `agent_id: "default"` in payloads | All existing views ignore unknown fields gracefully |

---

## 14. Open Questions

1. **Agent model heterogeneity**: Can agents use different providers simultaneously? (Yes, each has its own ChatContext with its own provider/model — already supported.)

2. **Shared tool state**: Should agents share rate limits or have fully independent budgets? (Recommend: independent by default, shared optionally via AgentConfig.)

3. **Agent-to-agent tool access**: Can agent A call a tool that only agent B has? (Recommend: no, each agent has its own ToolManager. Delegation should go through message passing.)

4. **Browser multi-tab**: Multiple browser tabs each focused on different agents — does this create separate WebSocket connections? (Yes, each tab connects independently, each has its own focus.)

5. **Terminal input in multi-agent**: The terminal (stdin) can only feed one agent at a time. How? (Focus concept applies to terminal too — terminal input goes to the "active" agent. `/focus agent-research` switches terminal focus.)

6. **Maximum agent count**: What's the practical limit? (Probably 5-10 concurrent agents due to LLM API concurrency, memory, and cognitive overload for the user.)

7. **Cost tracking per agent**: Should token usage be tracked per agent? (Yes — TokenTracker is already per ChatContext, just needs surfacing in the dashboard.)
