# Tool Shadowing Attack Malicious Variant Tools

## Category Overview

| Field | Value |
|---|---|
| Attack type | Tool Shadowing Attack |
| DTPE stage | Execution |
| Source server directories | 16 |
| Modified tools | 83 |
| Languages | Go: 6, JavaScript: 13, Python: 4, TypeScript: 60 |
| Mutation forms | Python tool-docstring insertion: 4, tool-description mutation: 79 |

## Modified Tool Records

### MV-TSH-8a997caeeaef `InditexTech_mcp-teams-server` / `start_thread`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-8a997caeeaef` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Communication/InditexTech_mcp-teams-server_8a16c62_python/src/mcp_teams_server/__init__.py` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/InditexTech_mcp-teams-server/src/mcp_teams_server/__init__.py` |
| Tool name | `start_thread` -> `start_thread` |
| Original location | `Communication/InditexTech_mcp-teams-server_8a16c62_python/src/mcp_teams_server/__init__.py:110` |
| Mutation location | `Tool Shadowing Attack/InditexTech_mcp-teams-server/src/mcp_teams_server/__init__.py:118--118` |
| Mutation form | Python tool-docstring insertion |

#### Original Source Context

Lines 112--124 from the reference file:

~~~python
    title: str = Field(description="The thread title"),
    content: str = Field(description="The thread content"),
    member_name: str | None = Field(
        description="Member name to mention in the thread", default=None
    ),
) -> TeamsThread:
    await ctx.debug(f"start_thread with title={title} and content={content}")
    client = _get_teams_client(ctx)
    return await client.start_thread(title, content, member_name)


@mcp.tool(
    name="update_thread", description="Update an existing thread with new content"
~~~

### MV-TSH-3d4fca89a897 `InditexTech_mcp-teams-server` / `update_thread`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-3d4fca89a897` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Communication/InditexTech_mcp-teams-server_8a16c62_python/src/mcp_teams_server/__init__.py` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/InditexTech_mcp-teams-server/src/mcp_teams_server/__init__.py` |
| Tool name | `update_thread` -> `update_thread` |
| Original location | `Communication/InditexTech_mcp-teams-server_8a16c62_python/src/mcp_teams_server/__init__.py:126` |
| Mutation location | `Tool Shadowing Attack/InditexTech_mcp-teams-server/src/mcp_teams_server/__init__.py:137--137` |
| Mutation form | Python tool-docstring insertion |

#### Original Source Context

Lines 130--142 from the reference file:

~~~python
    ),
    content: str = Field(description="The content to update in the thread"),
    member_name: str | None = Field(
        description="Member name to mention in the thread", default=None
    ),
) -> TeamsMessage:
    await ctx.debug(f"update_thread with thread_id={thread_id} and content={content}")
    client = _get_teams_client(ctx)
    return await client.update_thread(thread_id, content, member_name)


@mcp.tool(name="read_thread", description="Read replies in a thread")
async def read_thread(
~~~

### MV-TSH-1d74f3a2c52e `InditexTech_mcp-teams-server` / `read_thread`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-1d74f3a2c52e` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Communication/InditexTech_mcp-teams-server_8a16c62_python/src/mcp_teams_server/__init__.py` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/InditexTech_mcp-teams-server/src/mcp_teams_server/__init__.py` |
| Tool name | `read_thread` -> `read_thread` |
| Original location | `Communication/InditexTech_mcp-teams-server_8a16c62_python/src/mcp_teams_server/__init__.py:142` |
| Mutation location | `Tool Shadowing Attack/InditexTech_mcp-teams-server/src/mcp_teams_server/__init__.py:150--150` |
| Mutation form | Python tool-docstring insertion |

#### Original Source Context

Lines 142--154 from the reference file:

~~~python
async def read_thread(
    ctx: Context,
    thread_id: str = Field(
        description="The thread ID as a string in the format '1743086901347'"
    ),
) -> PagedTeamsMessages:
    await ctx.debug(f"read_thread with thread_id={thread_id}")
    client = _get_teams_client(ctx)
    return await client.read_thread_replies(thread_id, 50)


@mcp.tool(name="list_threads", description="List threads in channel with pagination")
async def list_threads(
~~~

### MV-TSH-c543bde29717 `InditexTech_mcp-teams-server` / `list_threads`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-c543bde29717` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Communication/InditexTech_mcp-teams-server_8a16c62_python/src/mcp_teams_server/__init__.py` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/InditexTech_mcp-teams-server/src/mcp_teams_server/__init__.py` |
| Tool name | `list_threads` -> `list_threads` |
| Original location | `Communication/InditexTech_mcp-teams-server_8a16c62_python/src/mcp_teams_server/__init__.py:154` |
| Mutation location | `Tool Shadowing Attack/InditexTech_mcp-teams-server/src/mcp_teams_server/__init__.py:166--166` |
| Mutation form | Python tool-docstring insertion |

#### Original Source Context

Lines 157--169 from the reference file:

~~~python
        description="Maximum number of items to retrieve or page size", default=50
    ),
    cursor: str | None = Field(
        description="Pagination cursor for the next page of results", default=None
    ),
) -> PagedTeamsMessages:
    await ctx.debug(f"list_threads with cursor={cursor} and limit={limit}")
    client = _get_teams_client(ctx)
    return await client.read_threads(limit, cursor)


@mcp.tool(name="get_member_by_name", description="Get a member by its name")
async def get_member_by_name(
~~~

### MV-TSH-ab4c8b19db80 `dearlordylord_huly-mcp` / `list_thread_replies`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-ab4c8b19db80` |
| Subtype | N/A |
| Language | TypeScript |
| Reference tool | `reference-tools/Workplace_&_Productivity/dearlordylord_huly-mcp_e8303ec_typescript/src/mcp/tools/channels.ts` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/dearlordylord_huly-mcp/src/mcp/tools/channels.ts` |
| Tool name | `list_thread_replies` -> `list_thread_replies` |
| Original location | `Workplace_&_Productivity/dearlordylord_huly-mcp_e8303ec_typescript/src/mcp/tools/channels.ts:138` |
| Mutation location | `Tool Shadowing Attack/dearlordylord_huly-mcp/src/mcp/tools/channels.ts:139--139` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 133--145 from the reference file:

~~~typescript
      parseListDirectMessagesParams,
      listDirectMessages
    )
  },
  {
    name: "list_thread_replies",
    description: "List replies in a message thread. Returns replies sorted by date (oldest first).",
    category: CATEGORY,
    inputSchema: listThreadRepliesParamsJsonSchema,
    handler: createToolHandler(
      "list_thread_replies",
      parseListThreadRepliesParams,
      listThreadReplies
~~~

### MV-TSH-8fc95886a07b `dearlordylord_huly-mcp` / `get_unread_notification_count`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-8fc95886a07b` |
| Subtype | N/A |
| Language | TypeScript |
| Reference tool | `reference-tools/Workplace_&_Productivity/dearlordylord_huly-mcp_e8303ec_typescript/src/mcp/tools/notifications.ts` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/dearlordylord_huly-mcp/src/mcp/tools/notifications.ts` |
| Tool name | `get_unread_notification_count` -> `get_unread_notification_count` |
| Original location | `Workplace_&_Productivity/dearlordylord_huly-mcp_e8303ec_typescript/src/mcp/tools/notifications.ts:181` |
| Mutation location | `Tool Shadowing Attack/dearlordylord_huly-mcp/src/mcp/tools/notifications.ts:182--182` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 176--188 from the reference file:

~~~typescript
      parseUpdateNotificationProviderSettingParams,
      updateNotificationProviderSetting
    )
  },
  {
    name: "get_unread_notification_count",
    description: "Get the count of unread notifications.",
    category: CATEGORY,
    inputSchema: emptyParamsJsonSchema,
    handler: createToolHandler(
      "get_unread_notification_count",
      () => Effect.succeed({}),
      getUnreadNotificationCount
~~~

### MV-TSH-3b3c769ee8f6 `dearlordylord_huly-mcp` / `get_test_result`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-3b3c769ee8f6` |
| Subtype | N/A |
| Language | TypeScript |
| Reference tool | `reference-tools/Workplace_&_Productivity/dearlordylord_huly-mcp_e8303ec_typescript/src/mcp/tools/test-management-plans.ts` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/dearlordylord_huly-mcp/src/mcp/tools/test-management-plans.ts` |
| Tool name | `get_test_result` -> `get_test_result` |
| Original location | `Workplace_&_Productivity/dearlordylord_huly-mcp_e8303ec_typescript/src/mcp/tools/test-management-plans.ts:170` |
| Mutation location | `Tool Shadowing Attack/dearlordylord_huly-mcp/src/mcp/tools/test-management-plans.ts:171--171` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 165--177 from the reference file:

~~~typescript
    category: CATEGORY,
    inputSchema: listTestResultsParamsJsonSchema,
    handler: createToolHandler("list_test_results", parseListTestResultsParams, listTestResults)
  },
  {
    name: "get_test_result",
    description: "Get test result details. Accepts result ID or name.",
    category: CATEGORY,
    inputSchema: getTestResultParamsJsonSchema,
    handler: createToolHandler("get_test_result", parseGetTestResultParams, getTestResult)
  },
  {
    name: "create_test_result",
~~~

### MV-TSH-d19d7fc2d690 `gregario_dnd-oracle` / `browse_races`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-d19d7fc2d690` |
| Subtype | N/A |
| Language | TypeScript |
| Reference tool | `reference-tools/Gaming/gregario_dnd-oracle_73a8ad0_typescript/src/tools/browse-races.ts` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/gregario_dnd-oracle/src/tools/browse-races.ts` |
| Tool name | `browse_races` -> `browse_races` |
| Original location | `Gaming/gregario_dnd-oracle_73a8ad0_typescript/src/tools/browse-races.ts:49` |
| Mutation location | `Tool Shadowing Attack/gregario_dnd-oracle/src/tools/browse-races.ts:53--53` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 47--59 from the reference file:

~~~typescript
  db: Database.Database,
): void {
  server.registerTool(
    'browse_races',
    {
      description:
        "Browse D&D 5e SRD races. List all races or view a specific race's traits, ability bonuses, and subraces.",
      inputSchema: {
        race_name: z
          .string()
          .optional()
          .describe('Name of a specific race to look up'),
      },
~~~

### MV-TSH-dc21484101e6 `gregario_dnd-oracle` / `compare_monsters`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-dc21484101e6` |
| Subtype | N/A |
| Language | TypeScript |
| Reference tool | `reference-tools/Gaming/gregario_dnd-oracle_73a8ad0_typescript/src/tools/compare-monsters.ts` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/gregario_dnd-oracle/src/tools/compare-monsters.ts` |
| Tool name | `compare_monsters` -> `compare_monsters` |
| Original location | `Gaming/gregario_dnd-oracle_73a8ad0_typescript/src/tools/compare-monsters.ts:70` |
| Mutation location | `Tool Shadowing Attack/gregario_dnd-oracle/src/tools/compare-monsters.ts:74--74` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 68--80 from the reference file:

~~~typescript
  db: Database.Database,
): void {
  server.registerTool(
    'compare_monsters',
    {
      description:
        'Compare 2-3 D&D 5e monsters side by side. Shows AC, HP, ability scores, speeds, resistances, immunities, actions, and special abilities.',
      inputSchema: {
        monster_names: z
          .array(z.string())
          .min(2)
          .max(3)
          .describe('Names of 2-3 monsters to compare'),
~~~

### MV-TSH-3032e9f8831c `gregario_dnd-oracle` / `search_equipment`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-3032e9f8831c` |
| Subtype | N/A |
| Language | TypeScript |
| Reference tool | `reference-tools/Gaming/gregario_dnd-oracle_73a8ad0_typescript/src/tools/search-equipment.ts` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/gregario_dnd-oracle/src/tools/search-equipment.ts` |
| Tool name | `search_equipment` -> `search_equipment` |
| Original location | `Gaming/gregario_dnd-oracle_73a8ad0_typescript/src/tools/search-equipment.ts:119` |
| Mutation location | `Tool Shadowing Attack/gregario_dnd-oracle/src/tools/search-equipment.ts:123--123` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 117--129 from the reference file:

~~~typescript
  db: Database.Database,
): void {
  server.registerTool(
    'search_equipment',
    {
      description:
        'Search D&D 5e SRD equipment, weapons, armor, and magic items. Filter by category, cost, weight, weapon properties, armor type, or rarity.',
      inputSchema: {
        query: z.string().optional().describe('Search term for item name or description'),
        category: z
          .string()
          .optional()
          .describe('Equipment category (e.g. "Weapon", "Armor", "Adventuring Gear", "Tools")'),
~~~

### MV-TSH-9ca1f6b44e67 `gregario_dnd-oracle` / `search_monsters`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-9ca1f6b44e67` |
| Subtype | N/A |
| Language | TypeScript |
| Reference tool | `reference-tools/Gaming/gregario_dnd-oracle_73a8ad0_typescript/src/tools/search-monsters.ts` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/gregario_dnd-oracle/src/tools/search-monsters.ts` |
| Tool name | `search_monsters` -> `search_monsters` |
| Original location | `Gaming/gregario_dnd-oracle_73a8ad0_typescript/src/tools/search-monsters.ts:118` |
| Mutation location | `Tool Shadowing Attack/gregario_dnd-oracle/src/tools/search-monsters.ts:122--122` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 116--128 from the reference file:

~~~typescript
  db: Database.Database,
): void {
  server.registerTool(
    'search_monsters',
    {
      description:
        'Search D&D 5e SRD monsters by name, CR, type, size, or alignment. Returns full stat blocks.',
      inputSchema: {
        query: z.string().optional().describe('Search term for monster name or description'),
        cr: z.string().optional().describe('Exact challenge rating (e.g. "1/4", "5")'),
        cr_min: z.number().optional().describe('Minimum challenge rating (numeric, e.g. 0.25 for 1/4)'),
        cr_max: z.number().optional().describe('Maximum challenge rating (numeric)'),
        type: z.string().optional().describe('Monster type (e.g. "beast", "undead", "dragon")'),
~~~

### MV-TSH-aa25a99a7d4d `gregario_dnd-oracle` / `search_rules`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-aa25a99a7d4d` |
| Subtype | N/A |
| Language | TypeScript |
| Reference tool | `reference-tools/Gaming/gregario_dnd-oracle_73a8ad0_typescript/src/tools/search-rules.ts` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/gregario_dnd-oracle/src/tools/search-rules.ts` |
| Tool name | `search_rules` -> `search_rules` |
| Original location | `Gaming/gregario_dnd-oracle_73a8ad0_typescript/src/tools/search-rules.ts:14` |
| Mutation location | `Tool Shadowing Attack/gregario_dnd-oracle/src/tools/search-rules.ts:18--18` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 12--24 from the reference file:

~~~typescript
  db: Database.Database,
): void {
  server.registerTool(
    'search_rules',
    {
      description:
        'Search D&D 5e SRD rules and conditions. Look up specific conditions or search rules text.',
      inputSchema: {
        query: z
          .string()
          .optional()
          .describe('Full-text search query for rules'),
        condition_name: z
~~~

### MV-TSH-291f0173d10e `gregario_dnd-oracle` / `search_spells`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-291f0173d10e` |
| Subtype | N/A |
| Language | TypeScript |
| Reference tool | `reference-tools/Gaming/gregario_dnd-oracle_73a8ad0_typescript/src/tools/search-spells.ts` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/gregario_dnd-oracle/src/tools/search-spells.ts` |
| Tool name | `search_spells` -> `search_spells` |
| Original location | `Gaming/gregario_dnd-oracle_73a8ad0_typescript/src/tools/search-spells.ts:93` |
| Mutation location | `Tool Shadowing Attack/gregario_dnd-oracle/src/tools/search-spells.ts:97--97` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 91--103 from the reference file:

~~~typescript
  db: Database.Database,
): void {
  server.registerTool(
    'search_spells',
    {
      description:
        'Search D&D 5e SRD spells by name, level, school, class, concentration, ritual, components, damage type, or save type.',
      inputSchema: {
        query: z.string().optional().describe('Search term for spell name or description'),
        level: z.number().min(0).max(9).optional().describe('Spell level (0 for cantrips, 1-9 for leveled spells)'),
        school: z.string().optional().describe('School of magic (e.g. "evocation", "necromancy")'),
        class_name: z.string().optional().describe('Spellcasting class (e.g. "Wizard", "Cleric")'),
        concentration: z.boolean().optional().describe('Filter by concentration requirement'),
~~~

### MV-TSH-bfd490a8a034 `hightemp_go_mcp_server_google_sheets` / `get_multiple_sheet_data`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-bfd490a8a034` |
| Subtype | N/A |
| Language | Go |
| Reference tool | `reference-tools/golang/hightemp_go_mcp_server_google_sheets_cddad1d_go/internal/server/server.go` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/hightemp_go_mcp_server_google_sheets/internal/server/server.go` |
| Tool name | `get_multiple_sheet_data` -> `get_multiple_sheet_data` |
| Original location | `golang/hightemp_go_mcp_server_google_sheets_cddad1d_go/internal/server/server.go:117` |
| Mutation location | `Tool Shadowing Attack/hightemp_go_mcp_server_google_sheets/internal/server/server.go:118--118` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 112--124 from the reference file:

~~~go
			mcp.Description("Dictionary mapping range strings to 2D arrays of values"),
		),
	)
	gs.mcpServer.AddTool(batchUpdateCellsTool, handlers.NewBatchUpdateCellsHandler(gs.authManager))

	getMultipleSheetDataTool := mcp.NewTool("get_multiple_sheet_data",
		mcp.WithDescription("Get data from multiple specific ranges in Google Spreadsheets"),
		mcp.WithArray("queries",
			mcp.Required(),
			mcp.Description("A list of dictionaries, each specifying a query with 'spreadsheet_id', 'sheet', and 'range' keys"),
		),
	)
	gs.mcpServer.AddTool(getMultipleSheetDataTool, handlers.NewGetMultipleSheetDataHandler(gs.authManager))
~~~

### MV-TSH-0e2c73f9e309 `hightemp_go_mcp_server_google_sheets` / `get_multiple_spreadsheet_summary`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-0e2c73f9e309` |
| Subtype | N/A |
| Language | Go |
| Reference tool | `reference-tools/golang/hightemp_go_mcp_server_google_sheets_cddad1d_go/internal/server/server.go` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/hightemp_go_mcp_server_google_sheets/internal/server/server.go` |
| Tool name | `get_multiple_spreadsheet_summary` -> `get_multiple_spreadsheet_summary` |
| Original location | `golang/hightemp_go_mcp_server_google_sheets_cddad1d_go/internal/server/server.go:126` |
| Mutation location | `Tool Shadowing Attack/hightemp_go_mcp_server_google_sheets/internal/server/server.go:127--127` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 121--133 from the reference file:

~~~go
			mcp.Description("A list of dictionaries, each specifying a query with 'spreadsheet_id', 'sheet', and 'range' keys"),
		),
	)
	gs.mcpServer.AddTool(getMultipleSheetDataTool, handlers.NewGetMultipleSheetDataHandler(gs.authManager))

	getMultipleSpreadsheetSummaryTool := mcp.NewTool("get_multiple_spreadsheet_summary",
		mcp.WithDescription("Get a summary of multiple Google Spreadsheets, including sheet names, headers, and the first few rows of data for each sheet"),
		mcp.WithArray("spreadsheet_ids",
			mcp.Required(),
			mcp.Description("A list of spreadsheet IDs to summarize"),
		),
		mcp.WithNumber("rows_to_fetch",
			mcp.Description("The number of rows (including header) to fetch for the summary (default: 5)"),
~~~

### MV-TSH-c858b7729db2 `hightemp_go_mcp_server_google_sheets` / `copy_sheet`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-c858b7729db2` |
| Subtype | N/A |
| Language | Go |
| Reference tool | `reference-tools/golang/hightemp_go_mcp_server_google_sheets_cddad1d_go/internal/server/server.go` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/hightemp_go_mcp_server_google_sheets/internal/server/server.go` |
| Tool name | `copy_sheet` -> `copy_sheet` |
| Original location | `golang/hightemp_go_mcp_server_google_sheets_cddad1d_go/internal/server/server.go:189` |
| Mutation location | `Tool Shadowing Attack/hightemp_go_mcp_server_google_sheets/internal/server/server.go:190--190` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 184--196 from the reference file:

~~~go
			mcp.Description("0-based column index to start adding. If not provided, adds at the end."),
		),
	)
	gs.mcpServer.AddTool(addColumnsTool, handlers.NewAddColumnsHandler(gs.authManager))

	copySheetTool := mcp.NewTool("copy_sheet",
		mcp.WithDescription("Copy a sheet from one spreadsheet to another"),
		mcp.WithString("src_spreadsheet",
			mcp.Required(),
			mcp.Description("Source spreadsheet ID"),
		),
		mcp.WithString("src_sheet",
			mcp.Required(),
~~~

### MV-TSH-9eb3b7f5f443 `hightemp_go_mcp_server_google_sheets` / `create_spreadsheet`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-9eb3b7f5f443` |
| Subtype | N/A |
| Language | Go |
| Reference tool | `reference-tools/golang/hightemp_go_mcp_server_google_sheets_cddad1d_go/internal/server/server.go` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/hightemp_go_mcp_server_google_sheets/internal/server/server.go` |
| Tool name | `create_spreadsheet` -> `create_spreadsheet` |
| Original location | `golang/hightemp_go_mcp_server_google_sheets_cddad1d_go/internal/server/server.go:242` |
| Mutation location | `Tool Shadowing Attack/hightemp_go_mcp_server_google_sheets/internal/server/server.go:243--243` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 237--249 from the reference file:

~~~go
	)
	gs.mcpServer.AddTool(createSheetTool, handlers.NewCreateSheetHandler(gs.authManager))
}

func (gs *GoogleSheetsServer) registerSpreadsheetManagementTools() {
	createSpreadsheetTool := mcp.NewTool("create_spreadsheet",
		mcp.WithDescription("Create a new Google Spreadsheet"),
		mcp.WithString("title",
			mcp.Required(),
			mcp.Description("The title of the new spreadsheet"),
		),
	)
	gs.mcpServer.AddTool(createSpreadsheetTool, handlers.NewCreateSpreadsheetHandler(gs.authManager))
~~~

### MV-TSH-cb4fc9d8b25a `hightemp_go_mcp_server_google_sheets` / `list_spreadsheets`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-cb4fc9d8b25a` |
| Subtype | N/A |
| Language | Go |
| Reference tool | `reference-tools/golang/hightemp_go_mcp_server_google_sheets_cddad1d_go/internal/server/server.go` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/hightemp_go_mcp_server_google_sheets/internal/server/server.go` |
| Tool name | `list_spreadsheets` -> `list_spreadsheets` |
| Original location | `golang/hightemp_go_mcp_server_google_sheets_cddad1d_go/internal/server/server.go:251` |
| Mutation location | `Tool Shadowing Attack/hightemp_go_mcp_server_google_sheets/internal/server/server.go:252--252` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 246--258 from the reference file:

~~~go
			mcp.Description("The title of the new spreadsheet"),
		),
	)
	gs.mcpServer.AddTool(createSpreadsheetTool, handlers.NewCreateSpreadsheetHandler(gs.authManager))

	listSpreadsheetsTool := mcp.NewTool("list_spreadsheets",
		mcp.WithDescription("List all spreadsheets in the configured Google Drive folder"),
	)
	gs.mcpServer.AddTool(listSpreadsheetsTool, handlers.NewListSpreadsheetsHandler(gs.authManager))
}

func (gs *GoogleSheetsServer) registerSharingTools() {
	shareSpreadsheetTool := mcp.NewTool("share_spreadsheet",
~~~

### MV-TSH-8292af6a0da4 `hightemp_go_mcp_server_google_sheets` / `share_spreadsheet`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-8292af6a0da4` |
| Subtype | N/A |
| Language | Go |
| Reference tool | `reference-tools/golang/hightemp_go_mcp_server_google_sheets_cddad1d_go/internal/server/server.go` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/hightemp_go_mcp_server_google_sheets/internal/server/server.go` |
| Tool name | `share_spreadsheet` -> `share_spreadsheet` |
| Original location | `golang/hightemp_go_mcp_server_google_sheets_cddad1d_go/internal/server/server.go:258` |
| Mutation location | `Tool Shadowing Attack/hightemp_go_mcp_server_google_sheets/internal/server/server.go:259--259` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 253--265 from the reference file:

~~~go
	)
	gs.mcpServer.AddTool(listSpreadsheetsTool, handlers.NewListSpreadsheetsHandler(gs.authManager))
}

func (gs *GoogleSheetsServer) registerSharingTools() {
	shareSpreadsheetTool := mcp.NewTool("share_spreadsheet",
		mcp.WithDescription("Share a Google Spreadsheet with multiple users via email, assigning specific roles"),
		mcp.WithString("spreadsheet_id",
			mcp.Required(),
			mcp.Description("The ID of the spreadsheet to share"),
		),
		mcp.WithArray("recipients",
			mcp.Required(),
~~~

### MV-TSH-6819bb62903f `ihiteshsharma_mcp-servers` / `serper_web_search`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-6819bb62903f` |
| Subtype | N/A |
| Language | TypeScript |
| Reference tool | `reference-tools/ai/ihiteshsharma_mcp-servers_6255eb6_typescript/src/serper-firecrawl-mcp/index.ts` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/ihiteshsharma_mcp-servers/src/serper-firecrawl-mcp/index.ts` |
| Tool name | `serper_web_search` -> `serper_web_search` |
| Original location | `ai/ihiteshsharma_mcp-servers_6255eb6_typescript/src/serper-firecrawl-mcp/index.ts:12` |
| Mutation location | `Tool Shadowing Attack/ihiteshsharma_mcp-servers/src/serper-firecrawl-mcp/index.ts:14--14` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 8--20 from the reference file:

~~~typescript
  Tool,
} from "@modelcontextprotocol/sdk/types.js";

const SERPER_SEARCH_TOOL: Tool = {
  name: "serper_web_search",
  description:
    "Performs a web search using the Serper.dev API, ideal for general queries, news, articles, and online content. " +
    "Use this for broad information gathering, recent events, or when you need diverse web sources. " +
    "Supports location-based search and language/region customization. " +
    "Maximum 20 results per request. ",
  inputSchema: {
    type: "object",
    properties: {
~~~

### MV-TSH-515c01ce1541 `ihiteshsharma_mcp-servers` / `serper_news_search`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-515c01ce1541` |
| Subtype | N/A |
| Language | TypeScript |
| Reference tool | `reference-tools/ai/ihiteshsharma_mcp-servers_6255eb6_typescript/src/serper-firecrawl-mcp/index.ts` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/ihiteshsharma_mcp-servers/src/serper-firecrawl-mcp/index.ts` |
| Tool name | `serper_news_search` -> `serper_news_search` |
| Original location | `ai/ihiteshsharma_mcp-servers_6255eb6_typescript/src/serper-firecrawl-mcp/index.ts:46` |
| Mutation location | `Tool Shadowing Attack/ihiteshsharma_mcp-servers/src/serper-firecrawl-mcp/index.ts:48--48` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 42--54 from the reference file:

~~~typescript
  },
};

const SERPER_NEWS_TOOL: Tool = {
  name: "serper_news_search",
  description:
    "Searches for news articles using the Serper.dev News API. " +
    "Best for recent news articles, press releases, and timely content. " +
    "Returns detailed information including:\n" +
    "- Article titles and snippets\n" +
    "- Source names and publication dates\n" +
    "- Links to articles\n" +
    "Use this when you need up-to-date news information on specific topics.",
~~~

### MV-TSH-206123ebd451 `ihiteshsharma_mcp-servers` / `serper_image_search`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-206123ebd451` |
| Subtype | N/A |
| Language | TypeScript |
| Reference tool | `reference-tools/ai/ihiteshsharma_mcp-servers_6255eb6_typescript/src/serper-firecrawl-mcp/index.ts` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/ihiteshsharma_mcp-servers/src/serper-firecrawl-mcp/index.ts` |
| Tool name | `serper_image_search` -> `serper_image_search` |
| Original location | `ai/ihiteshsharma_mcp-servers_6255eb6_typescript/src/serper-firecrawl-mcp/index.ts:83` |
| Mutation location | `Tool Shadowing Attack/ihiteshsharma_mcp-servers/src/serper-firecrawl-mcp/index.ts:85--85` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 79--91 from the reference file:

~~~typescript
  }
};

const SERPER_IMAGE_TOOL: Tool = {
  name: "serper_image_search",
  description:
    "Searches for images using the Serper.dev Images API. " +
    "Ideal for finding visuals, diagrams, photos, logos, and other graphical content. " +
    "Returns detailed information including:\n" +
    "- Image URLs and thumbnails\n" +
    "- Image dimensions\n" +
    "- Source websites\n" +
    "Use this when you need visual content related to a search query.",
~~~

### MV-TSH-98f77ccf1ff8 `ihiteshsharma_mcp-servers` / `serper_video_search`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-98f77ccf1ff8` |
| Subtype | N/A |
| Language | TypeScript |
| Reference tool | `reference-tools/ai/ihiteshsharma_mcp-servers_6255eb6_typescript/src/serper-firecrawl-mcp/index.ts` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/ihiteshsharma_mcp-servers/src/serper-firecrawl-mcp/index.ts` |
| Tool name | `serper_video_search` -> `serper_video_search` |
| Original location | `ai/ihiteshsharma_mcp-servers_6255eb6_typescript/src/serper-firecrawl-mcp/index.ts:115` |
| Mutation location | `Tool Shadowing Attack/ihiteshsharma_mcp-servers/src/serper-firecrawl-mcp/index.ts:117--117` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 111--123 from the reference file:

~~~typescript
  }
};

const SERPER_VIDEO_TOOL: Tool = {
  name: "serper_video_search",
  description:
    "Searches for videos using the Serper.dev Videos API. " +
    "Great for finding video content from platforms like YouTube and other video hosting sites. " +
    "Returns information including:\n" +
    "- Video titles and descriptions\n" +
    "- Source links\n" +
    "- Channel information when available\n" +
    "Use this when you need video content related to a search query.",
~~~

### MV-TSH-5efa454217ea `ihiteshsharma_mcp-servers` / `gps_coordinates`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-5efa454217ea` |
| Subtype | N/A |
| Language | TypeScript |
| Reference tool | `reference-tools/ai/ihiteshsharma_mcp-servers_6255eb6_typescript/src/serper-firecrawl-mcp/index.ts` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/ihiteshsharma_mcp-servers/src/serper-firecrawl-mcp/index.ts` |
| Tool name | `gps_coordinates` -> `gps_coordinates` |
| Original location | `ai/ihiteshsharma_mcp-servers_6255eb6_typescript/src/serper-firecrawl-mcp/index.ts:228` |
| Mutation location | `Tool Shadowing Attack/ihiteshsharma_mcp-servers/src/serper-firecrawl-mcp/index.ts:230--230` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 224--236 from the reference file:

~~~typescript
  }
};

const GPS_COORDINATES_TOOL: Tool = {
  name: "gps_coordinates",
  description:
    "Gets the current GPS coordinates using browser geolocation or fallback IP-based location services. " +
    "Provides latitude and longitude that can be used for location-aware searches and services. " +
    "No input parameters required - simply returns the current detected location. " +
    "Note: Accuracy may vary depending on the device and available location services.",
  inputSchema: {
    type: "object",
    properties: {
~~~

### MV-TSH-2a50e4a1788f `ihiteshsharma_mcp-servers` / `firecrawl_scrape`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-2a50e4a1788f` |
| Subtype | N/A |
| Language | TypeScript |
| Reference tool | `reference-tools/ai/ihiteshsharma_mcp-servers_6255eb6_typescript/src/serper-firecrawl-mcp/index.ts` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/ihiteshsharma_mcp-servers/src/serper-firecrawl-mcp/index.ts` |
| Tool name | `firecrawl_scrape` -> `firecrawl_scrape` |
| Original location | `ai/ihiteshsharma_mcp-servers_6255eb6_typescript/src/serper-firecrawl-mcp/index.ts:248` |
| Mutation location | `Tool Shadowing Attack/ihiteshsharma_mcp-servers/src/serper-firecrawl-mcp/index.ts:250--250` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 244--256 from the reference file:

~~~typescript
  },
};

const FIRECRAWL_SCRAPE_TOOL: Tool = {
  name: "firecrawl_scrape",
  description:
    "Scrapes web pages using the FireCrawl API to extract content in a structured format. " +
    "Ideal for retrieving the full content of articles, documentation, or any web page found in search results. " +
    "Returns content in markdown format for easy readability. " +
    "Use this tool when you need detailed information from a specific website.",
  inputSchema: {
    type: "object",
    properties: {
~~~

### MV-TSH-305b8c16639f `javierb507_anywhere-mcp-server` / `search_pulses`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-305b8c16639f` |
| Subtype | N/A |
| Language | TypeScript |
| Reference tool | `reference-tools/security/javierb507_anywhere-mcp-server_badb616_javascript/src/handlers/tools.ts` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/javierb507_anywhere-mcp-server/src/handlers/tools.ts` |
| Tool name | `search_pulses` -> `search_pulses` |
| Original location | `security/javierb507_anywhere-mcp-server_badb616_javascript/src/handlers/tools.ts:394` |
| Mutation location | `Tool Shadowing Attack/javierb507_anywhere-mcp-server/src/handlers/tools.ts:395--395` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 389--401 from the reference file:

~~~typescript
            required: ['investigation_id']
          }
        },
        // Legacy OTX API tools (for backward compatibility)
        {
          name: 'search_pulses',
          description: 'Search for threat intelligence pulses in AlienVault OTX (Legacy API)',
          inputSchema: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'Search query for threat intelligence pulses'
~~~

### MV-TSH-146834dfbb5f `javierb507_anywhere-mcp-server` / `execute_advanced_query`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-146834dfbb5f` |
| Subtype | N/A |
| Language | TypeScript |
| Reference tool | `reference-tools/security/javierb507_anywhere-mcp-server_badb616_javascript/src/handlers/tools.ts` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/javierb507_anywhere-mcp-server/src/handlers/tools.ts` |
| Tool name | `execute_advanced_query` -> `execute_advanced_query` |
| Original location | `security/javierb507_anywhere-mcp-server_badb616_javascript/src/handlers/tools.ts:449` |
| Mutation location | `Tool Shadowing Attack/javierb507_anywhere-mcp-server/src/handlers/tools.ts:450--450` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 444--456 from the reference file:

~~~typescript
            required: ['pulse_id']
          }
        },
        // Advanced Query API tools
        {
          name: 'execute_advanced_query',
          description: 'Execute advanced SQL or PPL queries against USM Anywhere data',
          inputSchema: {
            type: 'object',
            properties: {
              account_name: {
                type: 'string',
                description: 'The account name for the query (required)'
~~~

### MV-TSH-750d4d6fb039 `javierb507_anywhere-mcp-server` / `validate_query_syntax`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-750d4d6fb039` |
| Subtype | N/A |
| Language | TypeScript |
| Reference tool | `reference-tools/security/javierb507_anywhere-mcp-server_badb616_javascript/src/handlers/tools.ts` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/javierb507_anywhere-mcp-server/src/handlers/tools.ts` |
| Tool name | `validate_query_syntax` -> `validate_query_syntax` |
| Original location | `security/javierb507_anywhere-mcp-server_badb616_javascript/src/handlers/tools.ts:499` |
| Mutation location | `Tool Shadowing Attack/javierb507_anywhere-mcp-server/src/handlers/tools.ts:500--500` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 494--506 from the reference file:

~~~typescript
            },
            required: ['account_name', 'query_string']
          }
        },
        {
          name: 'validate_query_syntax',
          description: 'Validate SQL or PPL query syntax without executing the query',
          inputSchema: {
            type: 'object',
            properties: {
              query_string: {
                type: 'string',
                description: 'The SQL or PPL query string to validate'
~~~

### MV-TSH-2ea63151e405 `javierb507_anywhere-mcp-server` / `get_query_examples`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-2ea63151e405` |
| Subtype | N/A |
| Language | TypeScript |
| Reference tool | `reference-tools/security/javierb507_anywhere-mcp-server_badb616_javascript/src/handlers/tools.ts` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/javierb507_anywhere-mcp-server/src/handlers/tools.ts` |
| Tool name | `get_query_examples` -> `get_query_examples` |
| Original location | `security/javierb507_anywhere-mcp-server_badb616_javascript/src/handlers/tools.ts:519` |
| Mutation location | `Tool Shadowing Attack/javierb507_anywhere-mcp-server/src/handlers/tools.ts:520--520` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 514--526 from the reference file:

~~~typescript
            },
            required: ['query_string']
          }
        },
        {
          name: 'get_query_examples',
          description: 'Get example queries for different categories and use cases',
          inputSchema: {
            type: 'object',
            properties: {
              category: {
                type: 'string',
                description: 'Category of query examples to retrieve',
~~~

### MV-TSH-2c4b82f232bb `jtalk22_slack-mcp-server` / `slack_search_messages`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-2c4b82f232bb` |
| Subtype | N/A |
| Language | JavaScript |
| Reference tool | `reference-tools/Communication/jtalk22_slack-mcp-server_ce10721_javascript/lib/tools.js` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/jtalk22_slack-mcp-server/lib/tools.js` |
| Tool name | `slack_search_messages` -> `slack_search_messages` |
| Original location | `Communication/jtalk22_slack-mcp-server_ce10721_javascript/lib/tools.js:157` |
| Mutation location | `Tool Shadowing Attack/jtalk22_slack-mcp-server/lib/tools.js:158--158` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 152--164 from the reference file:

~~~javascript
      idempotentHint: true,
      openWorldHint: true
    }
  },
  {
    name: "slack_search_messages",
    description: "Search messages across the Slack workspace",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search query (supports Slack syntax like from:@user, in:#channel)"
~~~

### MV-TSH-b8316ab42bbb `jtalk22_slack-mcp-server` / `slack_conversations_unreads`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-b8316ab42bbb` |
| Subtype | N/A |
| Language | JavaScript |
| Reference tool | `reference-tools/Communication/jtalk22_slack-mcp-server_ce10721_javascript/lib/tools.js` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/jtalk22_slack-mcp-server/lib/tools.js` |
| Tool name | `slack_conversations_unreads` -> `slack_conversations_unreads` |
| Original location | `Communication/jtalk22_slack-mcp-server_ce10721_javascript/lib/tools.js:356` |
| Mutation location | `Tool Shadowing Attack/jtalk22_slack-mcp-server/lib/tools.js:357--357` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 351--363 from the reference file:

~~~javascript
      idempotentHint: true,
      openWorldHint: true
    }
  },
  {
    name: "slack_conversations_unreads",
    description: "Get channels and DMs with unread messages, sorted by unread count (highest first)",
    inputSchema: {
      type: "object",
      properties: {
        types: {
          type: "string",
          description: "Comma-separated types: im, mpim, public_channel, private_channel (default all)",
~~~

### MV-TSH-289fd7805607 `jtalk22_slack-mcp-server` / `slack_users_search`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-289fd7805607` |
| Subtype | N/A |
| Language | JavaScript |
| Reference tool | `reference-tools/Communication/jtalk22_slack-mcp-server_ce10721_javascript/lib/tools.js` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/jtalk22_slack-mcp-server/lib/tools.js` |
| Tool name | `slack_users_search` -> `slack_users_search` |
| Original location | `Communication/jtalk22_slack-mcp-server_ce10721_javascript/lib/tools.js:380` |
| Mutation location | `Tool Shadowing Attack/jtalk22_slack-mcp-server/lib/tools.js:381--381` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 375--387 from the reference file:

~~~javascript
      idempotentHint: true,
      openWorldHint: true
    }
  },
  {
    name: "slack_users_search",
    description: "Search workspace users by name, display name, or email. Case-insensitive partial match.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search term to match against name, display name, real name, or email"
~~~

### MV-TSH-8d53691d9e5d `jtalk22_slack-mcp-server` / `slack_search_messages`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-8d53691d9e5d` |
| Subtype | N/A |
| Language | JavaScript |
| Reference tool | `reference-tools/Communication/jtalk22_slack-mcp-server_ce10721_javascript/workers/mcp-worker.js` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/jtalk22_slack-mcp-server/workers/mcp-worker.js` |
| Tool name | `slack_search_messages` -> `slack_search_messages` |
| Original location | `Communication/jtalk22_slack-mcp-server_ce10721_javascript/workers/mcp-worker.js:110` |
| Mutation location | `Tool Shadowing Attack/jtalk22_slack-mcp-server/workers/mcp-worker.js:111--111` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 105--117 from the reference file:

~~~javascript
      required: ["channel_id"]
    },
    annotations: { title: "Full Conversation Export", readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true }
  },
  {
    name: "slack_search_messages",
    description: "Search messages across the Slack workspace",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Search query (supports from:@user, in:#channel)" },
        count: { type: "number", description: "Number of results (max 100, default 20)" }
      },
~~~

### MV-TSH-1f8072750c56 `jtalk22_slack-mcp-server` / `slack_get_thread`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-1f8072750c56` |
| Subtype | N/A |
| Language | JavaScript |
| Reference tool | `reference-tools/Communication/jtalk22_slack-mcp-server_ce10721_javascript/workers/mcp-worker.js` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/jtalk22_slack-mcp-server/workers/mcp-worker.js` |
| Tool name | `slack_get_thread` -> `slack_get_thread` |
| Original location | `Communication/jtalk22_slack-mcp-server_ce10721_javascript/workers/mcp-worker.js:137` |
| Mutation location | `Tool Shadowing Attack/jtalk22_slack-mcp-server/workers/mcp-worker.js:138--138` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 132--144 from the reference file:

~~~javascript
      required: ["channel_id", "text"]
    },
    annotations: { title: "Send Message", readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true }
  },
  {
    name: "slack_get_thread",
    description: "Get all replies in a message thread",
    inputSchema: {
      type: "object",
      properties: {
        channel_id: { type: "string", description: "Channel or DM ID" },
        thread_ts: { type: "string", description: "Thread parent message timestamp" }
      },
~~~

### MV-TSH-76ff7af3b566 `kryptosai-mcp-observatory` / `run_cmd`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-76ff7af3b566` |
| Subtype | N/A |
| Language | TypeScript |
| Reference tool | `reference-tools/developer-tools/kryptosai-mcp-observatory_e37d197_typescript/KryptosAI-mcp-observatory-e37d197/scripts/evaluate-permission-delta-conformance.ts` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/kryptosai-mcp-observatory/KryptosAI-mcp-observatory-e37d197/scripts/evaluate-permission-delta-conformance.ts` |
| Tool name | `run_cmd` -> `run_cmd` |
| Original location | `developer-tools/kryptosai-mcp-observatory_e37d197_typescript/KryptosAI-mcp-observatory-e37d197/scripts/evaluate-permission-delta-conformance.ts:154` |
| Mutation location | `Tool Shadowing Attack/kryptosai-mcp-observatory/KryptosAI-mcp-observatory-e37d197/scripts/evaluate-permission-delta-conformance.ts:152--152` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 146--158 from the reference file:

~~~typescript
    head: schemas(tool("api", s("object", { endpoint: prop("string") }, ["endpoint"]))),
    expectedWidening: true, expectedReview: false, expectedNarrowing: false, expectedNeutral: false,
    expectedRule: "W1 (additionalProperties widened)",
  },

  {
    id: "rugpull-03", description: "Required sensitive field becomes optional (server-side default)",
    class: "seeded-escalation-scenario",
    base: schemas(tool("run_cmd", s("object", { command: prop("string"), scope: prop("string") }, ["command", "scope"]))),
    head: schemas(tool("run_cmd", s("object", { command: prop("string"), scope: prop("string") }, ["command"]))),
    expectedWidening: true, expectedReview: false, expectedNarrowing: false, expectedNeutral: false,
    expectedRule: "W2 (required permission field became optional)",
  },
~~~

### MV-TSH-7fbbc4739252 `kryptosai-mcp-observatory` / `search`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-7fbbc4739252` |
| Subtype | N/A |
| Language | TypeScript |
| Reference tool | `reference-tools/developer-tools/kryptosai-mcp-observatory_e37d197_typescript/KryptosAI-mcp-observatory-e37d197/scripts/evaluate-permission-delta-conformance.ts` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/kryptosai-mcp-observatory/KryptosAI-mcp-observatory-e37d197/scripts/evaluate-permission-delta-conformance.ts` |
| Tool name | `search` -> `search` |
| Original location | `developer-tools/kryptosai-mcp-observatory_e37d197_typescript/KryptosAI-mcp-observatory-e37d197/scripts/evaluate-permission-delta-conformance.ts:163` |
| Mutation location | `Tool Shadowing Attack/kryptosai-mcp-observatory/KryptosAI-mcp-observatory-e37d197/scripts/evaluate-permission-delta-conformance.ts:161--161` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 155--167 from the reference file:

~~~typescript
    head: schemas(tool("run_cmd", s("object", { command: prop("string"), scope: prop("string") }, ["command"]))),
    expectedWidening: true, expectedReview: false, expectedNarrowing: false, expectedNeutral: false,
    expectedRule: "W2 (required permission field became optional)",
  },

  {
    id: "rugpull-04", description: "New sensitive field added (secret backdoor param)",
    class: "seeded-escalation-scenario",
    base: schemas(tool("search", s("object", { query: prop("string") }, ["query"]))),
    head: schemas(tool("search", s("object", { query: prop("string"), token: prop("string") }, ["query"]))),
    expectedWidening: false, expectedReview: true, expectedNarrowing: false, expectedNeutral: false,
    expectedRule: "R1 (new permission-sensitive field added)",
  },
~~~

### MV-TSH-f9600eee87b4 `kryptosai-mcp-observatory` / `search`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-f9600eee87b4` |
| Subtype | N/A |
| Language | TypeScript |
| Reference tool | `reference-tools/developer-tools/kryptosai-mcp-observatory_e37d197_typescript/KryptosAI-mcp-observatory-e37d197/scripts/evaluate-permission-delta-conformance.ts` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/kryptosai-mcp-observatory/KryptosAI-mcp-observatory-e37d197/scripts/evaluate-permission-delta-conformance.ts` |
| Tool name | `search` -> `search` |
| Original location | `developer-tools/kryptosai-mcp-observatory_e37d197_typescript/KryptosAI-mcp-observatory-e37d197/scripts/evaluate-permission-delta-conformance.ts:192` |
| Mutation location | `Tool Shadowing Attack/kryptosai-mcp-observatory/KryptosAI-mcp-observatory-e37d197/scripts/evaluate-permission-delta-conformance.ts:190--190` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 184--196 from the reference file:

~~~typescript
    expectedRule: "R3 (type broadened on permission field)",
  },

  // ── NEUTRAL CHANGES (should not alert) ──

  {
    id: "neutral-01", description: "Optional insensitive field added",
    class: "synthetic-rule-coverage",
    base: schemas(tool("search", s("object", { query: prop("string") }, ["query"]))),
    head: schemas(tool("search", s("object", { query: prop("string"), format: prop("string") }, ["query"]))),
    expectedWidening: false, expectedReview: false, expectedNarrowing: false, expectedNeutral: true,
    expectedRule: "N1 (optional parser field added)",
  },
~~~

### MV-TSH-efd787e238ed `kryptosai-mcp-observatory` / `read`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-efd787e238ed` |
| Subtype | N/A |
| Language | TypeScript |
| Reference tool | `reference-tools/developer-tools/kryptosai-mcp-observatory_e37d197_typescript/KryptosAI-mcp-observatory-e37d197/scripts/evaluate-permission-delta-conformance.ts` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/kryptosai-mcp-observatory/KryptosAI-mcp-observatory-e37d197/scripts/evaluate-permission-delta-conformance.ts` |
| Tool name | `read` -> `read` |
| Original location | `developer-tools/kryptosai-mcp-observatory_e37d197_typescript/KryptosAI-mcp-observatory-e37d197/scripts/evaluate-permission-delta-conformance.ts:241` |
| Mutation location | `Tool Shadowing Attack/kryptosai-mcp-observatory/KryptosAI-mcp-observatory-e37d197/scripts/evaluate-permission-delta-conformance.ts:239--239` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 233--245 from the reference file:

~~~typescript
    expectedRule: "D3 (enum narrowed on sensitive/mutating)",
  },

  // ── MULTI-TOOL (tool set changes) ──

  {
    id: "multi-01", description: "Tool added to server",
    class: "synthetic-rule-coverage",
    base: schemas(tool("read", s("object", { path: prop("string") }, ["path"]))),
    head: schemas(tool("read", s("object", { path: prop("string") }, ["path"])), tool("write", s("object", { path: prop("string"), content: prop("string") }, ["path", "content"]))),
    expectedWidening: false, expectedReview: true, expectedNarrowing: false, expectedNeutral: false,
    expectedRule: "tool-set change (new tool)",
  },
~~~

### MV-TSH-600abbe69b24 `kryptosai-mcp-observatory` / `read`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-600abbe69b24` |
| Subtype | N/A |
| Language | TypeScript |
| Reference tool | `reference-tools/developer-tools/kryptosai-mcp-observatory_e37d197_typescript/KryptosAI-mcp-observatory-e37d197/scripts/evaluate-permission-delta-conformance.ts` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/kryptosai-mcp-observatory/KryptosAI-mcp-observatory-e37d197/scripts/evaluate-permission-delta-conformance.ts` |
| Tool name | `read` -> `read` |
| Original location | `developer-tools/kryptosai-mcp-observatory_e37d197_typescript/KryptosAI-mcp-observatory-e37d197/scripts/evaluate-permission-delta-conformance.ts:250` |
| Mutation location | `Tool Shadowing Attack/kryptosai-mcp-observatory/KryptosAI-mcp-observatory-e37d197/scripts/evaluate-permission-delta-conformance.ts:248--248` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 242--254 from the reference file:

~~~typescript
    head: schemas(tool("read", s("object", { path: prop("string") }, ["path"])), tool("write", s("object", { path: prop("string"), content: prop("string") }, ["path", "content"]))),
    expectedWidening: false, expectedReview: true, expectedNarrowing: false, expectedNeutral: false,
    expectedRule: "tool-set change (new tool)",
  },

  {
    id: "multi-02", description: "Harmless optional field added",
    class: "synthetic-rule-coverage",
    base: schemas(tool("read", s("object", { path: prop("string") }, ["path"]))),
    head: schemas(tool("read", s("object", { path: prop("string"), verbose: prop("boolean") }, ["path"]))),
    expectedWidening: false, expectedReview: false, expectedNarrowing: false, expectedNeutral: true,
    expectedRule: "N1 only",
  },
~~~

### MV-TSH-5def161f0bb0 `kryptosai-mcp-observatory` / `read_file`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-5def161f0bb0` |
| Subtype | N/A |
| Language | TypeScript |
| Reference tool | `reference-tools/developer-tools/kryptosai-mcp-observatory_e37d197_typescript/KryptosAI-mcp-observatory-e37d197/scripts/evaluate-permission-delta-conformance.ts` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/kryptosai-mcp-observatory/KryptosAI-mcp-observatory-e37d197/scripts/evaluate-permission-delta-conformance.ts` |
| Tool name | `read_file` -> `read_file` |
| Original location | `developer-tools/kryptosai-mcp-observatory_e37d197_typescript/KryptosAI-mcp-observatory-e37d197/scripts/evaluate-permission-delta-conformance.ts:273` |
| Mutation location | `Tool Shadowing Attack/kryptosai-mcp-observatory/KryptosAI-mcp-observatory-e37d197/scripts/evaluate-permission-delta-conformance.ts:270--270` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 264--276 from the reference file:

~~~typescript
    expectedRule: "W3 + D3 (rotation)",
  },

  // ── COMBINATORIAL RELEASE ──

  {
    id: "combo-01", description: "Realistic multi-tool release: benign refactoring only",
    class: "synthetic-rule-coverage",
    base: schemas(
      tool("read_file", s("object", { path: prop("string") }, ["path"], false)),
      tool("search", s("object", { query: prop("string") }, ["query"])),
      tool("status", s("object", { verbose: prop("boolean") })),
    ),
~~~

### MV-TSH-949c3cc01fd6 `kryptosai-mcp-observatory` / `search`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-949c3cc01fd6` |
| Subtype | N/A |
| Language | TypeScript |
| Reference tool | `reference-tools/developer-tools/kryptosai-mcp-observatory_e37d197_typescript/KryptosAI-mcp-observatory-e37d197/scripts/evaluate-permission-delta-conformance.ts` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/kryptosai-mcp-observatory/KryptosAI-mcp-observatory-e37d197/scripts/evaluate-permission-delta-conformance.ts` |
| Tool name | `search` -> `search` |
| Original location | `developer-tools/kryptosai-mcp-observatory_e37d197_typescript/KryptosAI-mcp-observatory-e37d197/scripts/evaluate-permission-delta-conformance.ts:279` |
| Mutation location | `Tool Shadowing Attack/kryptosai-mcp-observatory/KryptosAI-mcp-observatory-e37d197/scripts/evaluate-permission-delta-conformance.ts:287--287` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 281--293 from the reference file:

~~~typescript
    ),
    expectedWidening: false, expectedReview: false, expectedNarrowing: false, expectedNeutral: true,
    expectedRule: "2× N1 (all benign refactoring)",
  },

  {
    id: "combo-02", description: "Multi-tool: privilege escalation hidden in benign release",
    class: "seeded-escalation-scenario",
    base: schemas(
      tool("read", s("object", { path: prop("string") }, ["path"], false)),
      tool("config", s("object", { key: prop("string") }, ["key"])),
    ),
    head: schemas(
~~~

### MV-TSH-e3763328a00d `mkummer225-google-sheets-mcp` / `create_spreadsheet`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-e3763328a00d` |
| Subtype | N/A |
| Language | TypeScript |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/mkummer225-google-sheets-mcp_1d52b9d_typescript/mkummer225-google-sheets-mcp-1d52b9d/index.ts` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/mkummer225-google-sheets-mcp/mkummer225-google-sheets-mcp-1d52b9d/index.ts` |
| Tool name | `create_spreadsheet` -> `create_spreadsheet` |
| Original location | `Other_Tools_and_Integrations/mkummer225-google-sheets-mcp_1d52b9d_typescript/mkummer225-google-sheets-mcp-1d52b9d/index.ts:90` |
| Mutation location | `Tool Shadowing Attack/mkummer225-google-sheets-mcp/mkummer225-google-sheets-mcp-1d52b9d/index.ts:91--91` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 85--97 from the reference file:

~~~typescript
                    properties: {},
                    required: [],
                },
            },
            {
                name: "create_spreadsheet",
                description: "Create a new Google Spreadsheet",
                inputSchema: {
                    type: "object",
                    properties: {
                        title: {
                            type: "string",
                            description: "The title for the new spreadsheet",
~~~

### MV-TSH-36b2f9e435bc `mkummer225-google-sheets-mcp` / `read_all_from_sheet`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-36b2f9e435bc` |
| Subtype | N/A |
| Language | TypeScript |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/mkummer225-google-sheets-mcp_1d52b9d_typescript/mkummer225-google-sheets-mcp-1d52b9d/index.ts` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/mkummer225-google-sheets-mcp/mkummer225-google-sheets-mcp-1d52b9d/index.ts` |
| Tool name | `read_all_from_sheet` -> `read_all_from_sheet` |
| Original location | `Other_Tools_and_Integrations/mkummer225-google-sheets-mcp_1d52b9d_typescript/mkummer225-google-sheets-mcp-1d52b9d/index.ts:140` |
| Mutation location | `Tool Shadowing Attack/mkummer225-google-sheets-mcp/mkummer225-google-sheets-mcp-1d52b9d/index.ts:141--141` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 135--147 from the reference file:

~~~typescript
                    },
                    required: ["spreadsheetId", "sheetName"],
                },
            },
            {
                name: "read_all_from_sheet",
                description: "Read all data from a specified sheet in a Google Spreadsheet",
                inputSchema: {
                    type: "object",
                    properties: {
                        spreadsheetId: {
                            type: "string",
                            description: "The ID of the spreadsheet",
~~~

### MV-TSH-e0235dbdb8b6 `mkummer225-google-sheets-mcp` / `read_headings`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-e0235dbdb8b6` |
| Subtype | N/A |
| Language | TypeScript |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/mkummer225-google-sheets-mcp_1d52b9d_typescript/mkummer225-google-sheets-mcp-1d52b9d/index.ts` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/mkummer225-google-sheets-mcp/mkummer225-google-sheets-mcp-1d52b9d/index.ts` |
| Tool name | `read_headings` -> `read_headings` |
| Original location | `Other_Tools_and_Integrations/mkummer225-google-sheets-mcp_1d52b9d_typescript/mkummer225-google-sheets-mcp-1d52b9d/index.ts:158` |
| Mutation location | `Tool Shadowing Attack/mkummer225-google-sheets-mcp/mkummer225-google-sheets-mcp-1d52b9d/index.ts:159--159` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 153--165 from the reference file:

~~~typescript
                    },
                    required: ["spreadsheetId"],
                },
            },
            {
                name: "read_headings",
                description: "Read the column headings from a Google Sheet",
                inputSchema: {
                    type: "object",
                    properties: {
                        spreadsheetId: {
                            type: "string",
                            description: "The ID of the spreadsheet",
~~~

### MV-TSH-68062cd075be `mkummer225-google-sheets-mcp` / `read_rows`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-68062cd075be` |
| Subtype | N/A |
| Language | TypeScript |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/mkummer225-google-sheets-mcp_1d52b9d_typescript/mkummer225-google-sheets-mcp-1d52b9d/index.ts` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/mkummer225-google-sheets-mcp/mkummer225-google-sheets-mcp-1d52b9d/index.ts` |
| Tool name | `read_rows` -> `read_rows` |
| Original location | `Other_Tools_and_Integrations/mkummer225-google-sheets-mcp_1d52b9d_typescript/mkummer225-google-sheets-mcp-1d52b9d/index.ts:177` |
| Mutation location | `Tool Shadowing Attack/mkummer225-google-sheets-mcp/mkummer225-google-sheets-mcp-1d52b9d/index.ts:178--178` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 172--184 from the reference file:

~~~typescript
                    },
                    required: ["spreadsheetId"],
                },
            },
            {
                name: "read_rows",
                description: "Read rows from a Google Sheet",
                inputSchema: {
                    type: "object",
                    properties: {
                        spreadsheetId: {
                            type: "string",
                            description: "The ID of the spreadsheet",
~~~

### MV-TSH-d16d55b24cbb `mkummer225-google-sheets-mcp` / `read_columns`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-d16d55b24cbb` |
| Subtype | N/A |
| Language | TypeScript |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/mkummer225-google-sheets-mcp_1d52b9d_typescript/mkummer225-google-sheets-mcp-1d52b9d/index.ts` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/mkummer225-google-sheets-mcp/mkummer225-google-sheets-mcp-1d52b9d/index.ts` |
| Tool name | `read_columns` -> `read_columns` |
| Original location | `Other_Tools_and_Integrations/mkummer225-google-sheets-mcp_1d52b9d_typescript/mkummer225-google-sheets-mcp-1d52b9d/index.ts:204` |
| Mutation location | `Tool Shadowing Attack/mkummer225-google-sheets-mcp/mkummer225-google-sheets-mcp-1d52b9d/index.ts:205--205` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 199--211 from the reference file:

~~~typescript
                    },
                    required: ["spreadsheetId", "startRow", "endRow"],
                },
            },
            {
                name: "read_columns",
                description: "Read columns from a Google Sheet",
                inputSchema: {
                    type: "object",
                    properties: {
                        spreadsheetId: {
                            type: "string",
                            description: "The ID of the spreadsheet",
~~~

### MV-TSH-0f8bc874152d `mkummer225-google-sheets-mcp` / `edit_cell`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-0f8bc874152d` |
| Subtype | N/A |
| Language | TypeScript |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/mkummer225-google-sheets-mcp_1d52b9d_typescript/mkummer225-google-sheets-mcp-1d52b9d/index.ts` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/mkummer225-google-sheets-mcp/mkummer225-google-sheets-mcp-1d52b9d/index.ts` |
| Tool name | `edit_cell` -> `edit_cell` |
| Original location | `Other_Tools_and_Integrations/mkummer225-google-sheets-mcp_1d52b9d_typescript/mkummer225-google-sheets-mcp-1d52b9d/index.ts:230` |
| Mutation location | `Tool Shadowing Attack/mkummer225-google-sheets-mcp/mkummer225-google-sheets-mcp-1d52b9d/index.ts:231--231` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 225--237 from the reference file:

~~~typescript
                    },
                    required: ["spreadsheetId", "columns"],
                },
            },
            {
                name: "edit_cell",
                description: "Edit a cell in a Google Sheet",
                inputSchema: {
                    type: "object",
                    properties: {
                        spreadsheetId: {
                            type: "string",
                            description: "The ID of the spreadsheet",
~~~

### MV-TSH-7205b9ef308b `mkummer225-google-sheets-mcp` / `edit_column`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-7205b9ef308b` |
| Subtype | N/A |
| Language | TypeScript |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/mkummer225-google-sheets-mcp_1d52b9d_typescript/mkummer225-google-sheets-mcp-1d52b9d/index.ts` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/mkummer225-google-sheets-mcp/mkummer225-google-sheets-mcp-1d52b9d/index.ts` |
| Tool name | `edit_column` -> `edit_column` |
| Original location | `Other_Tools_and_Integrations/mkummer225-google-sheets-mcp_1d52b9d_typescript/mkummer225-google-sheets-mcp-1d52b9d/index.ts:287` |
| Mutation location | `Tool Shadowing Attack/mkummer225-google-sheets-mcp/mkummer225-google-sheets-mcp-1d52b9d/index.ts:288--288` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 282--294 from the reference file:

~~~typescript
                    },
                    required: ["spreadsheetId", "rowIndex", "values"],
                },
            },
            {
                name: "edit_column",
                description: "Edit an entire column in a Google Sheet",
                inputSchema: {
                    type: "object",
                    properties: {
                        spreadsheetId: {
                            type: "string",
                            description: "The ID of the spreadsheet",
~~~

### MV-TSH-864fbed56c9e `ryaker-outlook-mcp` / `search-emails`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-864fbed56c9e` |
| Subtype | N/A |
| Language | JavaScript |
| Reference tool | `reference-tools/Communication/ryaker-outlook-mcp_95d6ff2_javascript/ryaker-outlook-mcp-95d6ff2/email/index.js` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/ryaker-outlook-mcp/ryaker-outlook-mcp-95d6ff2/email/index.js` |
| Tool name | `search-emails` -> `search-emails` |
| Original location | `Communication/ryaker-outlook-mcp_95d6ff2_javascript/ryaker-outlook-mcp-95d6ff2/email/index.js:34` |
| Mutation location | `Tool Shadowing Attack/ryaker-outlook-mcp/ryaker-outlook-mcp-95d6ff2/email/index.js:35--35` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 29--41 from the reference file:

~~~javascript
      required: []
    },
    handler: handleListEmails
  },
  {
    name: "search-emails",
    description: "Search for emails using various criteria",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search query text to find in emails"
~~~

### MV-TSH-10adc42d8a91 `ryaker-outlook-mcp` / `mark-as-read`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-10adc42d8a91` |
| Subtype | N/A |
| Language | JavaScript |
| Reference tool | `reference-tools/Communication/ryaker-outlook-mcp_95d6ff2_javascript/ryaker-outlook-mcp-95d6ff2/email/index.js` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/ryaker-outlook-mcp/ryaker-outlook-mcp-95d6ff2/email/index.js` |
| Tool name | `mark-as-read` -> `mark-as-read` |
| Original location | `Communication/ryaker-outlook-mcp_95d6ff2_javascript/ryaker-outlook-mcp-95d6ff2/email/index.js:176` |
| Mutation location | `Tool Shadowing Attack/ryaker-outlook-mcp/ryaker-outlook-mcp-95d6ff2/email/index.js:177--177` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 171--183 from the reference file:

~~~javascript
      required: []
    },
    handler: handleDraftEmail
  },
  {
    name: "mark-as-read",
    description: "Marks an email as read or unread",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "ID of the email to mark as read/unread"
~~~

### MV-TSH-ea60d7e2fcc7 `ryaker-outlook-mcp` / `onedrive-search`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-ea60d7e2fcc7` |
| Subtype | N/A |
| Language | JavaScript |
| Reference tool | `reference-tools/Communication/ryaker-outlook-mcp_95d6ff2_javascript/ryaker-outlook-mcp-95d6ff2/onedrive/index.js` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/ryaker-outlook-mcp/ryaker-outlook-mcp-95d6ff2/onedrive/index.js` |
| Tool name | `onedrive-search` -> `onedrive-search` |
| Original location | `Communication/ryaker-outlook-mcp_95d6ff2_javascript/ryaker-outlook-mcp-95d6ff2/onedrive/index.js:34` |
| Mutation location | `Tool Shadowing Attack/ryaker-outlook-mcp/ryaker-outlook-mcp-95d6ff2/onedrive/index.js:35--35` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 29--41 from the reference file:

~~~javascript
      required: []
    },
    handler: handleListFiles
  },
  {
    name: "onedrive-search",
    description: "Search for files in OneDrive by name or content",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search query to find files"
~~~

### MV-TSH-fdba32bcf97d `screenpipe-screenpipe` / `start_worktree`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-fdba32bcf97d` |
| Subtype | N/A |
| Language | JavaScript |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/screenpipe-screenpipe_6661b7d_typescript/screenpipe-screenpipe-6661b7d/crates/screenpipe-core/assets/acp/screenpipe-tools.mjs` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/screenpipe-screenpipe/screenpipe-screenpipe-6661b7d/crates/screenpipe-core/assets/acp/screenpipe-tools.mjs` |
| Tool name | `start_worktree` -> `start_worktree` |
| Original location | `Other_Tools_and_Integrations/screenpipe-screenpipe_6661b7d_typescript/screenpipe-screenpipe-6661b7d/crates/screenpipe-core/assets/acp/screenpipe-tools.mjs:383` |
| Mutation location | `Tool Shadowing Attack/screenpipe-screenpipe/screenpipe-screenpipe-6661b7d/crates/screenpipe-core/assets/acp/screenpipe-tools.mjs:385--385` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 379--391 from the reference file:

~~~javascript
  ".tsv": "text",
};

const WORKTREE_ROUTE_TOOL = {
  name: "start_worktree",
  description:
    "Select the exact Git repository for the user's coding task and create its isolated conversation worktree. Call exactly once with one repository_path from the candidate list in the prompt.",
  inputSchema: {
    type: "object",
    properties: {
      repository_path: {
        type: "string",
        description: "Exact absolute repository path copied from the candidate list.",
~~~

### MV-TSH-52ee420beca5 `screenpipe-screenpipe` / `search_chats`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-52ee420beca5` |
| Subtype | N/A |
| Language | JavaScript |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/screenpipe-screenpipe_6661b7d_typescript/screenpipe-screenpipe-6661b7d/crates/screenpipe-core/assets/acp/screenpipe-tools.mjs` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/screenpipe-screenpipe/screenpipe-screenpipe-6661b7d/crates/screenpipe-core/assets/acp/screenpipe-tools.mjs` |
| Tool name | `search_chats` -> `search_chats` |
| Original location | `Other_Tools_and_Integrations/screenpipe-screenpipe_6661b7d_typescript/screenpipe-screenpipe-6661b7d/crates/screenpipe-core/assets/acp/screenpipe-tools.mjs:441` |
| Mutation location | `Tool Shadowing Attack/screenpipe-screenpipe/screenpipe-screenpipe-6661b7d/crates/screenpipe-core/assets/acp/screenpipe-tools.mjs:443--443` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 437--449 from the reference file:

~~~javascript
      return text;
    },
  },
  {
    name: "search_chats",
    description:
      "Search existing local screenpipe, Codex, Claude, and Cursor chats by title, message preview, working directory, or exact id. Use this before send_to_chat and pass the exact source + id returned here; never guess a target from a fuzzy title. This is read-only.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Optional case-insensitive search text. Omit for the most recently updated chats.",
~~~

### MV-TSH-43a2558bb6be `screenpipe-screenpipe` / `sp_web_search`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-43a2558bb6be` |
| Subtype | N/A |
| Language | JavaScript |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/screenpipe-screenpipe_6661b7d_typescript/screenpipe-screenpipe-6661b7d/crates/screenpipe-core/assets/acp/screenpipe-tools.mjs` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/screenpipe-screenpipe/screenpipe-screenpipe-6661b7d/crates/screenpipe-core/assets/acp/screenpipe-tools.mjs` |
| Tool name | `sp_web_search` -> `sp_web_search` |
| Original location | `Other_Tools_and_Integrations/screenpipe-screenpipe_6661b7d_typescript/screenpipe-screenpipe-6661b7d/crates/screenpipe-core/assets/acp/screenpipe-tools.mjs:686` |
| Mutation location | `Tool Shadowing Attack/screenpipe-screenpipe/screenpipe-screenpipe-6661b7d/crates/screenpipe-core/assets/acp/screenpipe-tools.mjs:688--688` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 682--694 from the reference file:

~~~javascript
      return JSON.stringify({ status: "saved", filename, kind });
    },
  },
  {
    name: "sp_web_search",
    description:
      "Search the public internet via Google Search. Use ONLY for public, external information the user explicitly asks about (current events, news, public people or companies, public product docs). Do NOT use it for the user's own screenpipe data. When unsure, do not search. Returns results with sources.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "The search query" },
      },
      required: ["query"],
~~~

### MV-TSH-67ca0d07ccbf `screenpipe-screenpipe` / `keyword_search`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-67ca0d07ccbf` |
| Subtype | N/A |
| Language | JavaScript |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/screenpipe-screenpipe_6661b7d_typescript/screenpipe-screenpipe-6661b7d/crates/screenpipe-core/assets/acp/screenpipe-tools.mjs` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/screenpipe-screenpipe/screenpipe-screenpipe-6661b7d/crates/screenpipe-core/assets/acp/screenpipe-tools.mjs` |
| Tool name | `keyword_search` -> `keyword_search` |
| Original location | `Other_Tools_and_Integrations/screenpipe-screenpipe_6661b7d_typescript/screenpipe-screenpipe-6661b7d/crates/screenpipe-core/assets/acp/screenpipe-tools.mjs:1102` |
| Mutation location | `Tool Shadowing Attack/screenpipe-screenpipe/screenpipe-screenpipe-6661b7d/crates/screenpipe-core/assets/acp/screenpipe-tools.mjs:1104--1104` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 1098--1110 from the reference file:

~~~javascript
      return engineGet(`/activity-summary${queryString(args, ["start_time", "end_time", "app_name", "include_starred"])}`);
    },
  },
  {
    name: "keyword_search",
    description:
      "Fast FTS5 keyword search across screen text and audio combined. Returns matches with frame_id, app, timestamp, and text. Use when you have a specific keyword or phrase and want the fastest hit-list. For broad 'what was I doing' questions use activity_summary instead. Proxies the local engine /search/keyword.",
    inputSchema: {
      type: "object",
      properties: {
        q: { type: "string", description: "Keyword query (FTS5 syntax: quoted phrases, AND/OR, prefix*)" },
        start_time: { type: "string", description: "ISO 8601, relative, or local calendar ('today', 'yesterday', 'tomorrow', 'YYYY-MM-DD')" },
        end_time: { type: "string", description: "ISO 8601, relative, or local calendar ('today', 'yesterday', 'tomorrow', 'YYYY-MM-DD')" },
~~~

### MV-TSH-74d38f3f0306 `screenpipe-screenpipe` / `search_elements`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-74d38f3f0306` |
| Subtype | N/A |
| Language | JavaScript |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/screenpipe-screenpipe_6661b7d_typescript/screenpipe-screenpipe-6661b7d/crates/screenpipe-core/assets/acp/screenpipe-tools.mjs` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/screenpipe-screenpipe/screenpipe-screenpipe-6661b7d/crates/screenpipe-core/assets/acp/screenpipe-tools.mjs` |
| Tool name | `search_elements` -> `search_elements` |
| Original location | `Other_Tools_and_Integrations/screenpipe-screenpipe_6661b7d_typescript/screenpipe-screenpipe-6661b7d/crates/screenpipe-core/assets/acp/screenpipe-tools.mjs:1142` |
| Mutation location | `Tool Shadowing Attack/screenpipe-screenpipe/screenpipe-screenpipe-6661b7d/crates/screenpipe-core/assets/acp/screenpipe-tools.mjs:1144--1144` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 1138--1150 from the reference file:

~~~javascript
      return engineGet(`/search/keyword?${params.toString()}`);
    },
  },
  {
    name: "search_elements",
    description:
      "Search UI elements (buttons, links, text fields) from the accessibility tree, filterable by role. Use for a specific UI control or page-structure question ('find every Submit button', 'list the links on that page'). Proxies the local engine /elements.",
    inputSchema: {
      type: "object",
      properties: {
        q: { type: "string", description: "Full-text search on element text" },
        frame_id: { type: "integer", description: "Filter to a specific frame ID" },
        source: { type: "string", enum: ["accessibility", "ocr"], description: "Element source; 'accessibility' preferred" },
~~~

### MV-TSH-c744c946c761 `southleft-design-systems-mcp` / `search_design_knowledge`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-c744c946c761` |
| Subtype | N/A |
| Language | TypeScript |
| Reference tool | `reference-tools/media-and-design/southleft-design-systems-mcp_eca371b_typescript/southleft-design-systems-mcp-eca371b/src/sse-session.ts` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/southleft-design-systems-mcp/southleft-design-systems-mcp-eca371b/src/sse-session.ts` |
| Tool name | `search_design_knowledge` -> `search_design_knowledge` |
| Original location | `media-and-design/southleft-design-systems-mcp_eca371b_typescript/southleft-design-systems-mcp-eca371b/src/sse-session.ts:330` |
| Mutation location | `Tool Shadowing Attack/southleft-design-systems-mcp/southleft-design-systems-mcp-eca371b/src/sse-session.ts:331--331` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 325--337 from the reference file:

~~~typescript
            jsonrpc: '2.0',
            id,
            result: {
              tools: [
                {
                  name: 'search_design_knowledge',
                  description: 'Search through design system knowledge base entries by query, category, or tags',
                  inputSchema: {
                    type: 'object',
                    properties: {
                      query: {
                        type: 'string',
                        description: 'Search query for finding relevant design system knowledge'
~~~

### MV-TSH-370d164bbe31 `southleft-design-systems-mcp` / `search_chunks`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-370d164bbe31` |
| Subtype | N/A |
| Language | TypeScript |
| Reference tool | `reference-tools/media-and-design/southleft-design-systems-mcp_eca371b_typescript/southleft-design-systems-mcp-eca371b/src/sse-session.ts` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/southleft-design-systems-mcp/southleft-design-systems-mcp-eca371b/src/sse-session.ts` |
| Tool name | `search_chunks` -> `search_chunks` |
| Original location | `media-and-design/southleft-design-systems-mcp_eca371b_typescript/southleft-design-systems-mcp-eca371b/src/sse-session.ts:359` |
| Mutation location | `Tool Shadowing Attack/southleft-design-systems-mcp/southleft-design-systems-mcp-eca371b/src/sse-session.ts:360--360` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 354--366 from the reference file:

~~~typescript
                    },
                    required: ['query']
                  }
                },
                {
                  name: 'search_chunks',
                  description: 'Search through specific content chunks for detailed information',
                  inputSchema: {
                    type: 'object',
                    properties: {
                      query: {
                        type: 'string',
                        description: 'Search query for finding specific content chunks'
~~~

### MV-TSH-71fa04279fc8 `southleft-design-systems-mcp` / `search_design_knowledge`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-71fa04279fc8` |
| Subtype | N/A |
| Language | TypeScript |
| Reference tool | `reference-tools/media-and-design/southleft-design-systems-mcp_eca371b_typescript/southleft-design-systems-mcp-eca371b/src/streamable-http-handler.ts` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/southleft-design-systems-mcp/southleft-design-systems-mcp-eca371b/src/streamable-http-handler.ts` |
| Tool name | `search_design_knowledge` -> `search_design_knowledge` |
| Original location | `media-and-design/southleft-design-systems-mcp_eca371b_typescript/southleft-design-systems-mcp-eca371b/src/streamable-http-handler.ts:171` |
| Mutation location | `Tool Shadowing Attack/southleft-design-systems-mcp/southleft-design-systems-mcp-eca371b/src/streamable-http-handler.ts:172--172` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 166--178 from the reference file:

~~~typescript
        }
        else if (message.method === "tools/list") {
          // Return list of available tools
          const tools = [
            {
              name: "search_design_knowledge",
              description: "Search through design system knowledge base entries by query, category, or tags",
              inputSchema: {
                type: "object",
                properties: {
                  query: {
                    type: "string",
                    description: "Search query for finding relevant design system knowledge"
~~~

### MV-TSH-c5e5bd0dc7b6 `southleft-design-systems-mcp` / `search_chunks`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-c5e5bd0dc7b6` |
| Subtype | N/A |
| Language | TypeScript |
| Reference tool | `reference-tools/media-and-design/southleft-design-systems-mcp_eca371b_typescript/southleft-design-systems-mcp-eca371b/src/streamable-http-handler.ts` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/southleft-design-systems-mcp/southleft-design-systems-mcp-eca371b/src/streamable-http-handler.ts` |
| Tool name | `search_chunks` -> `search_chunks` |
| Original location | `media-and-design/southleft-design-systems-mcp_eca371b_typescript/southleft-design-systems-mcp-eca371b/src/streamable-http-handler.ts:200` |
| Mutation location | `Tool Shadowing Attack/southleft-design-systems-mcp/southleft-design-systems-mcp-eca371b/src/streamable-http-handler.ts:201--201` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 195--207 from the reference file:

~~~typescript
                },
                required: ["query"]
              }
            },
            {
              name: "search_chunks",
              description: "Search through specific content chunks for detailed information",
              inputSchema: {
                type: "object",
                properties: {
                  query: {
                    type: "string",
                    description: "Search query for finding specific content chunks"
~~~

### MV-TSH-7538231b453f `southleft-design-systems-mcp` / `get_all_tags`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-7538231b453f` |
| Subtype | N/A |
| Language | TypeScript |
| Reference tool | `reference-tools/media-and-design/southleft-design-systems-mcp_eca371b_typescript/southleft-design-systems-mcp-eca371b/src/streamable-http-handler.ts` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/southleft-design-systems-mcp/southleft-design-systems-mcp-eca371b/src/streamable-http-handler.ts` |
| Tool name | `get_all_tags` -> `get_all_tags` |
| Original location | `media-and-design/southleft-design-systems-mcp_eca371b_typescript/southleft-design-systems-mcp-eca371b/src/streamable-http-handler.ts:234` |
| Mutation location | `Tool Shadowing Attack/southleft-design-systems-mcp/southleft-design-systems-mcp-eca371b/src/streamable-http-handler.ts:235--235` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 229--241 from the reference file:

~~~typescript
                },
                required: ["category"]
              }
            },
            {
              name: "get_all_tags",
              description: "Get a list of all available tags in the knowledge base",
              inputSchema: {
                type: "object",
                properties: {},
                additionalProperties: false
              }
            },
~~~

### MV-TSH-2ebf702c267c `thelunarcompany-lunar` / `read_file`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-2ebf702c267c` |
| Subtype | N/A |
| Language | TypeScript |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/thelunarcompany-lunar_0b25606_typescript/TheLunarCompany-lunar-0b25606/mcpx/packages/ui/src/components/tools/CustomToolDialog.stories.tsx` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/thelunarcompany-lunar/TheLunarCompany-lunar-0b25606/mcpx/packages/ui/src/components/tools/CustomToolDialog.stories.tsx` |
| Tool name | `read_file` -> `read_file` |
| Original location | `Other_Tools_and_Integrations/thelunarcompany-lunar_0b25606_typescript/TheLunarCompany-lunar-0b25606/mcpx/packages/ui/src/components/tools/CustomToolDialog.stories.tsx:24` |
| Mutation location | `Tool Shadowing Attack/thelunarcompany-lunar/TheLunarCompany-lunar-0b25606/mcpx/packages/ui/src/components/tools/CustomToolDialog.stories.tsx:25--25` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 19--31 from the reference file:

~~~typescript
  {
    name: "my-mcp-server",
    icon: "#4078c0",
    originalTools: [
      {
        name: "read_file",
        description: "Read a file from the filesystem",
        inputSchema: {
          type: "object" as const,
          properties: {
            path: { type: "string", description: "The file path to read" },
            encoding: { type: "string", description: "File encoding" },
          },
~~~

### MV-TSH-608d5b411781 `thelunarcompany-lunar` / `read_file`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-608d5b411781` |
| Subtype | N/A |
| Language | TypeScript |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/thelunarcompany-lunar_0b25606_typescript/TheLunarCompany-lunar-0b25606/mcpx/packages/ui/src/components/tools/ProviderCard.stories.tsx` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/thelunarcompany-lunar/TheLunarCompany-lunar-0b25606/mcpx/packages/ui/src/components/tools/ProviderCard.stories.tsx` |
| Tool name | `read_file` -> `read_file` |
| Original location | `Other_Tools_and_Integrations/thelunarcompany-lunar_0b25606_typescript/TheLunarCompany-lunar-0b25606/mcpx/packages/ui/src/components/tools/ProviderCard.stories.tsx:28` |
| Mutation location | `Tool Shadowing Attack/thelunarcompany-lunar/TheLunarCompany-lunar-0b25606/mcpx/packages/ui/src/components/tools/ProviderCard.stories.tsx:29--29` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 23--35 from the reference file:

~~~typescript
      inputSchema: { type: "object" as const },
    },
  ],
  originalTools: [
    {
      name: "read_file",
      description: "Read a file from the filesystem",
      inputSchema: { type: "object" as const },
    },
    {
      name: "write_file",
      description: "Write content to a file",
      inputSchema: { type: "object" as const },
~~~

### MV-TSH-93f01ef49794 `thelunarcompany-lunar` / `read_file`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-93f01ef49794` |
| Subtype | N/A |
| Language | TypeScript |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/thelunarcompany-lunar_0b25606_typescript/TheLunarCompany-lunar-0b25606/mcpx/packages/ui/src/components/tools/ToolCard.stories.tsx` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/thelunarcompany-lunar/TheLunarCompany-lunar-0b25606/mcpx/packages/ui/src/components/tools/ToolCard.stories.tsx` |
| Tool name | `read_file` -> `read_file` |
| Original location | `Other_Tools_and_Integrations/thelunarcompany-lunar_0b25606_typescript/TheLunarCompany-lunar-0b25606/mcpx/packages/ui/src/components/tools/ToolCard.stories.tsx:6` |
| Mutation location | `Tool Shadowing Attack/thelunarcompany-lunar/TheLunarCompany-lunar-0b25606/mcpx/packages/ui/src/components/tools/ToolCard.stories.tsx:8--8` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 2--14 from the reference file:

~~~typescript
import { ToolCard } from "./ToolCard";
import { fn } from "@storybook/test";

const baseTool = {
  name: "read_file",
  description:
    "Read a file from the filesystem given a relative or absolute path.",
  inputSchema: {
    type: "object" as const,
    properties: {
      path: { type: "string", description: "The file path to read" },
    },
    required: ["path"],
~~~

### MV-TSH-0072267a3a57 `thelunarcompany-lunar` / `read_file`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-0072267a3a57` |
| Subtype | N/A |
| Language | TypeScript |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/thelunarcompany-lunar_0b25606_typescript/TheLunarCompany-lunar-0b25606/mcpx/packages/ui/src/components/tools/ToolDetailsDialog.stories.tsx` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/thelunarcompany-lunar/TheLunarCompany-lunar-0b25606/mcpx/packages/ui/src/components/tools/ToolDetailsDialog.stories.tsx` |
| Tool name | `read_file` -> `read_file` |
| Original location | `Other_Tools_and_Integrations/thelunarcompany-lunar_0b25606_typescript/TheLunarCompany-lunar-0b25606/mcpx/packages/ui/src/components/tools/ToolDetailsDialog.stories.tsx:6` |
| Mutation location | `Tool Shadowing Attack/thelunarcompany-lunar/TheLunarCompany-lunar-0b25606/mcpx/packages/ui/src/components/tools/ToolDetailsDialog.stories.tsx:8--8` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 2--14 from the reference file:

~~~typescript
import { ToolDetailsDialog } from "./ToolDetailsDialog";
import { fn } from "@storybook/test";

const baseTool = {
  name: "read_file",
  description:
    "Read a file from the filesystem given a relative or absolute path. Returns the file contents as a string.",
  inputSchema: {
    type: "object" as const,
    properties: {
      path: { type: "string", description: "The file path to read" },
      encoding: {
        type: "string",
~~~

### MV-TSH-48def8a75ea7 `tiberriver256-mcp-server-azure-devops` / `get_pipeline`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-48def8a75ea7` |
| Subtype | N/A |
| Language | TypeScript |
| Reference tool | `reference-tools/Cloud_Platforms/tiberriver256-mcp-server-azure-devops_5c8ad17_typescript/Tiberriver256-mcp-server-azure-devops-5c8ad17/src/features/pipelines/tool-definitions.ts` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/tiberriver256-mcp-server-azure-devops/Tiberriver256-mcp-server-azure-devops-5c8ad17/src/features/pipelines/tool-definitions.ts` |
| Tool name | `get_pipeline` -> `get_pipeline` |
| Original location | `Cloud_Platforms/tiberriver256-mcp-server-azure-devops_5c8ad17_typescript/Tiberriver256-mcp-server-azure-devops-5c8ad17/src/features/pipelines/tool-definitions.ts:23` |
| Mutation location | `Tool Shadowing Attack/tiberriver256-mcp-server-azure-devops/Tiberriver256-mcp-server-azure-devops-5c8ad17/src/features/pipelines/tool-definitions.ts:24--24` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 18--30 from the reference file:

~~~typescript
    description: 'List pipelines in a project',
    inputSchema: toJsonSchema(ListPipelinesSchema),
    mcp_enabled: true,
  },
  {
    name: 'get_pipeline',
    description: 'Get details of a specific pipeline',
    inputSchema: toJsonSchema(GetPipelineSchema),
    mcp_enabled: true,
  },
  {
    name: 'list_pipeline_runs',
    description: 'List recent runs for a pipeline',
~~~

### MV-TSH-7cba9fcf6257 `tiberriver256-mcp-server-azure-devops` / `update_pull_request_thread_status`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-7cba9fcf6257` |
| Subtype | N/A |
| Language | TypeScript |
| Reference tool | `reference-tools/Cloud_Platforms/tiberriver256-mcp-server-azure-devops_5c8ad17_typescript/Tiberriver256-mcp-server-azure-devops-5c8ad17/src/features/pull-requests/tool-definitions.ts` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/tiberriver256-mcp-server-azure-devops/Tiberriver256-mcp-server-azure-devops-5c8ad17/src/features/pull-requests/tool-definitions.ts` |
| Tool name | `update_pull_request_thread_status` -> `update_pull_request_thread_status` |
| Original location | `Cloud_Platforms/tiberriver256-mcp-server-azure-devops_5c8ad17_typescript/Tiberriver256-mcp-server-azure-devops-5c8ad17/src/features/pull-requests/tool-definitions.ts:69` |
| Mutation location | `Tool Shadowing Attack/tiberriver256-mcp-server-azure-devops/Tiberriver256-mcp-server-azure-devops-5c8ad17/src/features/pull-requests/tool-definitions.ts:71--71` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 65--74 from the reference file:

~~~typescript
    ].join('\n'),
    inputSchema: toJsonSchema(GetPullRequestChecksSchema),
  },
  {
    name: 'update_pull_request_thread_status',
    description:
      'Update the status of a comment thread in a pull request (repositoryId optional; derived from pullRequestId when omitted)',
    inputSchema: toJsonSchema(UpdatePullRequestThreadStatusSchema),
  },
];
~~~

### MV-TSH-dd557584a158 `tiberriver256-mcp-server-azure-devops` / `search_code`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-dd557584a158` |
| Subtype | N/A |
| Language | TypeScript |
| Reference tool | `reference-tools/Cloud_Platforms/tiberriver256-mcp-server-azure-devops_5c8ad17_typescript/Tiberriver256-mcp-server-azure-devops-5c8ad17/src/features/search/tool-definitions.ts` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/tiberriver256-mcp-server-azure-devops/Tiberriver256-mcp-server-azure-devops-5c8ad17/src/features/search/tool-definitions.ts` |
| Tool name | `search_code` -> `search_code` |
| Original location | `Cloud_Platforms/tiberriver256-mcp-server-azure-devops_5c8ad17_typescript/Tiberriver256-mcp-server-azure-devops-5c8ad17/src/features/search/tool-definitions.ts:14` |
| Mutation location | `Tool Shadowing Attack/tiberriver256-mcp-server-azure-devops/Tiberriver256-mcp-server-azure-devops-5c8ad17/src/features/search/tool-definitions.ts:15--15` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 9--21 from the reference file:

~~~typescript
/**
 * List of search tools
 */
export const searchTools: ToolDefinition[] = [
  {
    name: 'search_code',
    description: 'Search for code across repositories in a project',
    inputSchema: toJsonSchema(SearchCodeSchema),
  },
  {
    name: 'search_wiki',
    description: 'Search for content across wiki pages in a project',
    inputSchema: toJsonSchema(SearchWikiSchema),
~~~

### MV-TSH-1e086874d60e `tiberriver256-mcp-server-azure-devops` / `search_wiki`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-1e086874d60e` |
| Subtype | N/A |
| Language | TypeScript |
| Reference tool | `reference-tools/Cloud_Platforms/tiberriver256-mcp-server-azure-devops_5c8ad17_typescript/Tiberriver256-mcp-server-azure-devops-5c8ad17/src/features/search/tool-definitions.ts` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/tiberriver256-mcp-server-azure-devops/Tiberriver256-mcp-server-azure-devops-5c8ad17/src/features/search/tool-definitions.ts` |
| Tool name | `search_wiki` -> `search_wiki` |
| Original location | `Cloud_Platforms/tiberriver256-mcp-server-azure-devops_5c8ad17_typescript/Tiberriver256-mcp-server-azure-devops-5c8ad17/src/features/search/tool-definitions.ts:19` |
| Mutation location | `Tool Shadowing Attack/tiberriver256-mcp-server-azure-devops/Tiberriver256-mcp-server-azure-devops-5c8ad17/src/features/search/tool-definitions.ts:20--20` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 14--26 from the reference file:

~~~typescript
    name: 'search_code',
    description: 'Search for code across repositories in a project',
    inputSchema: toJsonSchema(SearchCodeSchema),
  },
  {
    name: 'search_wiki',
    description: 'Search for content across wiki pages in a project',
    inputSchema: toJsonSchema(SearchWikiSchema),
  },
  {
    name: 'search_work_items',
    description: 'Search for work items across projects in Azure DevOps',
    inputSchema: toJsonSchema(SearchWorkItemsSchema),
~~~

### MV-TSH-ad889aa79e76 `tiberriver256-mcp-server-azure-devops` / `search_work_items`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-ad889aa79e76` |
| Subtype | N/A |
| Language | TypeScript |
| Reference tool | `reference-tools/Cloud_Platforms/tiberriver256-mcp-server-azure-devops_5c8ad17_typescript/Tiberriver256-mcp-server-azure-devops-5c8ad17/src/features/search/tool-definitions.ts` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/tiberriver256-mcp-server-azure-devops/Tiberriver256-mcp-server-azure-devops-5c8ad17/src/features/search/tool-definitions.ts` |
| Tool name | `search_work_items` -> `search_work_items` |
| Original location | `Cloud_Platforms/tiberriver256-mcp-server-azure-devops_5c8ad17_typescript/Tiberriver256-mcp-server-azure-devops-5c8ad17/src/features/search/tool-definitions.ts:24` |
| Mutation location | `Tool Shadowing Attack/tiberriver256-mcp-server-azure-devops/Tiberriver256-mcp-server-azure-devops-5c8ad17/src/features/search/tool-definitions.ts:25--25` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 19--28 from the reference file:

~~~typescript
    name: 'search_wiki',
    description: 'Search for content across wiki pages in a project',
    inputSchema: toJsonSchema(SearchWikiSchema),
  },
  {
    name: 'search_work_items',
    description: 'Search for work items across projects in Azure DevOps',
    inputSchema: toJsonSchema(SearchWorkItemsSchema),
  },
];
~~~

### MV-TSH-3bb53ae8e89a `tiberriver256-mcp-server-azure-devops` / `update_work_item`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-3bb53ae8e89a` |
| Subtype | N/A |
| Language | TypeScript |
| Reference tool | `reference-tools/Cloud_Platforms/tiberriver256-mcp-server-azure-devops_5c8ad17_typescript/Tiberriver256-mcp-server-azure-devops-5c8ad17/src/features/work-items/tool-definitions.ts` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/tiberriver256-mcp-server-azure-devops/Tiberriver256-mcp-server-azure-devops-5c8ad17/src/features/work-items/tool-definitions.ts` |
| Tool name | `update_work_item` -> `update_work_item` |
| Original location | `Cloud_Platforms/tiberriver256-mcp-server-azure-devops_5c8ad17_typescript/Tiberriver256-mcp-server-azure-devops-5c8ad17/src/features/work-items/tool-definitions.ts:35` |
| Mutation location | `Tool Shadowing Attack/tiberriver256-mcp-server-azure-devops/Tiberriver256-mcp-server-azure-devops-5c8ad17/src/features/work-items/tool-definitions.ts:36--36` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 30--42 from the reference file:

~~~typescript
    name: 'create_work_item',
    description: 'Create a new work item',
    inputSchema: toJsonSchema(CreateWorkItemSchema),
  },
  {
    name: 'update_work_item',
    description: 'Update an existing work item',
    inputSchema: toJsonSchema(UpdateWorkItemSchema),
  },
  {
    name: 'manage_work_item_link',
    description: 'Add or remove links between work items',
    inputSchema: toJsonSchema(ManageWorkItemLinkSchema),
~~~

### MV-TSH-ccb95d49d732 `ubie-oss-slack-mcp-server` / `slack_reply_to_thread`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-ccb95d49d732` |
| Subtype | N/A |
| Language | TypeScript |
| Reference tool | `reference-tools/Communication/ubie-oss-slack-mcp-server_c3efcb1_typescript/ubie-oss-slack-mcp-server-c3efcb1/src/index.ts` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/ubie-oss-slack-mcp-server/ubie-oss-slack-mcp-server-c3efcb1/src/index.ts` |
| Tool name | `slack_reply_to_thread` -> `slack_reply_to_thread` |
| Original location | `Communication/ubie-oss-slack-mcp-server_c3efcb1_typescript/ubie-oss-slack-mcp-server-c3efcb1/src/index.ts:127` |
| Mutation location | `Tool Shadowing Attack/ubie-oss-slack-mcp-server/ubie-oss-slack-mcp-server-c3efcb1/src/index.ts:128--128` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 122--134 from the reference file:

~~~typescript
          name: 'slack_post_message',
          description: 'Post a new message to a Slack channel',
          inputSchema: zodToJsonSchema(PostMessageRequestSchema),
        },
        {
          name: 'slack_reply_to_thread',
          description: 'Reply to a specific message thread in Slack',
          inputSchema: zodToJsonSchema(ReplyToThreadRequestSchema),
        },
        {
          name: 'slack_add_reaction',
          description: 'Add a reaction emoji to a message',
          inputSchema: zodToJsonSchema(AddReactionRequestSchema),
~~~

### MV-TSH-81030447c91b `ubie-oss-slack-mcp-server` / `slack_get_thread_replies`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-81030447c91b` |
| Subtype | N/A |
| Language | TypeScript |
| Reference tool | `reference-tools/Communication/ubie-oss-slack-mcp-server_c3efcb1_typescript/ubie-oss-slack-mcp-server-c3efcb1/src/index.ts` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/ubie-oss-slack-mcp-server/ubie-oss-slack-mcp-server-c3efcb1/src/index.ts` |
| Tool name | `slack_get_thread_replies` -> `slack_get_thread_replies` |
| Original location | `Communication/ubie-oss-slack-mcp-server_c3efcb1_typescript/ubie-oss-slack-mcp-server-c3efcb1/src/index.ts:143` |
| Mutation location | `Tool Shadowing Attack/ubie-oss-slack-mcp-server/ubie-oss-slack-mcp-server-c3efcb1/src/index.ts:144--144` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 138--150 from the reference file:

~~~typescript
          description:
            'Get messages from a channel in chronological order. Use this when: 1) You need the latest conversation flow without specific filters, 2) You want ALL messages including bot/automation messages, 3) You need to browse messages sequentially with pagination. Do NOT use if you have specific search criteria (user, keywords, dates) - use slack_search_messages instead.',
          inputSchema: zodToJsonSchema(GetChannelHistoryRequestSchema),
        },
        {
          name: 'slack_get_thread_replies',
          description: 'Get all replies in a message thread',
          inputSchema: zodToJsonSchema(GetThreadRepliesRequestSchema),
        },
        {
          name: 'slack_get_users',
          description:
            'Retrieve basic profile information of all users in the workspace',
~~~

### MV-TSH-69882a129079 `ubie-oss-slack-mcp-server` / `slack_get_users`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-69882a129079` |
| Subtype | N/A |
| Language | TypeScript |
| Reference tool | `reference-tools/Communication/ubie-oss-slack-mcp-server_c3efcb1_typescript/ubie-oss-slack-mcp-server-c3efcb1/src/index.ts` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/ubie-oss-slack-mcp-server/ubie-oss-slack-mcp-server-c3efcb1/src/index.ts` |
| Tool name | `slack_get_users` -> `slack_get_users` |
| Original location | `Communication/ubie-oss-slack-mcp-server_c3efcb1_typescript/ubie-oss-slack-mcp-server-c3efcb1/src/index.ts:148` |
| Mutation location | `Tool Shadowing Attack/ubie-oss-slack-mcp-server/ubie-oss-slack-mcp-server-c3efcb1/src/index.ts:150--150` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 144--156 from the reference file:

~~~typescript
          description: 'Get all replies in a message thread',
          inputSchema: zodToJsonSchema(GetThreadRepliesRequestSchema),
        },
        {
          name: 'slack_get_users',
          description:
            'Retrieve basic profile information of all users in the workspace',
          inputSchema: zodToJsonSchema(GetUsersRequestSchema),
        },
        {
          name: 'slack_get_user_profiles',
          description: 'Get multiple users profile information in bulk',
          inputSchema: zodToJsonSchema(GetUserProfilesRequestSchema),
~~~

### MV-TSH-eddca9a5b71a `ubie-oss-slack-mcp-server` / `slack_search_messages`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-eddca9a5b71a` |
| Subtype | N/A |
| Language | TypeScript |
| Reference tool | `reference-tools/Communication/ubie-oss-slack-mcp-server_c3efcb1_typescript/ubie-oss-slack-mcp-server-c3efcb1/src/index.ts` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/ubie-oss-slack-mcp-server/ubie-oss-slack-mcp-server-c3efcb1/src/index.ts` |
| Tool name | `slack_search_messages` -> `slack_search_messages` |
| Original location | `Communication/ubie-oss-slack-mcp-server_c3efcb1_typescript/ubie-oss-slack-mcp-server-c3efcb1/src/index.ts:159` |
| Mutation location | `Tool Shadowing Attack/ubie-oss-slack-mcp-server/ubie-oss-slack-mcp-server-c3efcb1/src/index.ts:161--161` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 155--167 from the reference file:

~~~typescript
          description: 'Get multiple users profile information in bulk',
          inputSchema: zodToJsonSchema(GetUserProfilesRequestSchema),
        },
        {
          name: 'slack_search_messages',
          description:
            'Search for messages with specific criteria/filters. Use this when: 1) You need to find messages from a specific user, 2) You need messages from a specific date range, 3) You need to search by keywords, 4) You want to filter by channel. This tool is optimized for targeted searches. For general channel browsing without filters, use slack_get_channel_history instead.',
          inputSchema: zodToJsonSchema(SearchMessagesRequestSchema),
        },
        {
          name: 'slack_search_channels',
          description:
            'Search for channels by partial name match. Use this when you need to find channels containing specific keywords in their names. Returns up to the specified limit of matching channels.',
~~~

### MV-TSH-22e4f0b2c567 `ubie-oss-slack-mcp-server` / `slack_search_channels`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-22e4f0b2c567` |
| Subtype | N/A |
| Language | TypeScript |
| Reference tool | `reference-tools/Communication/ubie-oss-slack-mcp-server_c3efcb1_typescript/ubie-oss-slack-mcp-server-c3efcb1/src/index.ts` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/ubie-oss-slack-mcp-server/ubie-oss-slack-mcp-server-c3efcb1/src/index.ts` |
| Tool name | `slack_search_channels` -> `slack_search_channels` |
| Original location | `Communication/ubie-oss-slack-mcp-server_c3efcb1_typescript/ubie-oss-slack-mcp-server-c3efcb1/src/index.ts:165` |
| Mutation location | `Tool Shadowing Attack/ubie-oss-slack-mcp-server/ubie-oss-slack-mcp-server-c3efcb1/src/index.ts:167--167` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 161--173 from the reference file:

~~~typescript
            'Search for messages with specific criteria/filters. Use this when: 1) You need to find messages from a specific user, 2) You need messages from a specific date range, 3) You need to search by keywords, 4) You want to filter by channel. This tool is optimized for targeted searches. For general channel browsing without filters, use slack_get_channel_history instead.',
          inputSchema: zodToJsonSchema(SearchMessagesRequestSchema),
        },
        {
          name: 'slack_search_channels',
          description:
            'Search for channels by partial name match. Use this when you need to find channels containing specific keywords in their names. Returns up to the specified limit of matching channels.',
          inputSchema: zodToJsonSchema(SearchChannelsRequestSchema),
        },
        {
          name: 'slack_search_users',
          description:
            'Search for users by partial name match across username, display name, and real name. Use this when you need to find users containing specific keywords in their names. Returns up to the specified limit of matching users.',
~~~

### MV-TSH-c439689c8a65 `ubie-oss-slack-mcp-server` / `slack_search_users`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-c439689c8a65` |
| Subtype | N/A |
| Language | TypeScript |
| Reference tool | `reference-tools/Communication/ubie-oss-slack-mcp-server_c3efcb1_typescript/ubie-oss-slack-mcp-server-c3efcb1/src/index.ts` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/ubie-oss-slack-mcp-server/ubie-oss-slack-mcp-server-c3efcb1/src/index.ts` |
| Tool name | `slack_search_users` -> `slack_search_users` |
| Original location | `Communication/ubie-oss-slack-mcp-server_c3efcb1_typescript/ubie-oss-slack-mcp-server-c3efcb1/src/index.ts:171` |
| Mutation location | `Tool Shadowing Attack/ubie-oss-slack-mcp-server/ubie-oss-slack-mcp-server-c3efcb1/src/index.ts:173--173` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 167--179 from the reference file:

~~~typescript
            'Search for channels by partial name match. Use this when you need to find channels containing specific keywords in their names. Returns up to the specified limit of matching channels.',
          inputSchema: zodToJsonSchema(SearchChannelsRequestSchema),
        },
        {
          name: 'slack_search_users',
          description:
            'Search for users by partial name match across username, display name, and real name. Use this when you need to find users containing specific keywords in their names. Returns up to the specified limit of matching users.',
          inputSchema: zodToJsonSchema(SearchUsersRequestSchema),
        },
      ],
    };
  });

~~~

### MV-TSH-7d4d1a405973 `zcaceres-fetch-mcp` / `fetch_html`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-7d4d1a405973` |
| Subtype | N/A |
| Language | TypeScript |
| Reference tool | `reference-tools/browser-automation/zcaceres-fetch-mcp_1ddb1a5_typescript/zcaceres-fetch-mcp-1ddb1a5/src/index.ts` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/zcaceres-fetch-mcp/zcaceres-fetch-mcp-1ddb1a5/src/index.ts` |
| Tool name | `fetch_html` -> `fetch_html` |
| Original location | `browser-automation/zcaceres-fetch-mcp_1ddb1a5_typescript/zcaceres-fetch-mcp-1ddb1a5/src/index.ts:32` |
| Mutation location | `Tool Shadowing Attack/zcaceres-fetch-mcp/zcaceres-fetch-mcp-1ddb1a5/src/index.ts:33--33` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 27--39 from the reference file:

~~~typescript

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "fetch_html",
        description: "Fetch a website and return its unmodified contents as HTML",
        inputSchema: {
          type: "object",
          properties: {
            url: {
              type: "string",
              description: "URL of the website to fetch",
~~~

### MV-TSH-adb2dfa1d66d `zcaceres-fetch-mcp` / `fetch_markdown`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-adb2dfa1d66d` |
| Subtype | N/A |
| Language | TypeScript |
| Reference tool | `reference-tools/browser-automation/zcaceres-fetch-mcp_1ddb1a5_typescript/zcaceres-fetch-mcp-1ddb1a5/src/index.ts` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/zcaceres-fetch-mcp/zcaceres-fetch-mcp-1ddb1a5/src/index.ts` |
| Tool name | `fetch_markdown` -> `fetch_markdown` |
| Original location | `browser-automation/zcaceres-fetch-mcp_1ddb1a5_typescript/zcaceres-fetch-mcp-1ddb1a5/src/index.ts:62` |
| Mutation location | `Tool Shadowing Attack/zcaceres-fetch-mcp/zcaceres-fetch-mcp-1ddb1a5/src/index.ts:63--63` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 57--69 from the reference file:

~~~typescript
          },
          required: ["url"],
        },
      },
      {
        name: "fetch_markdown",
        description: "Fetch a website and return its contents converted to Markdown",
        inputSchema: {
          type: "object",
          properties: {
            url: {
              type: "string",
              description: "URL of the website to fetch",
~~~

### MV-TSH-b6b167e815eb `zcaceres-fetch-mcp` / `fetch_txt`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-b6b167e815eb` |
| Subtype | N/A |
| Language | TypeScript |
| Reference tool | `reference-tools/browser-automation/zcaceres-fetch-mcp_1ddb1a5_typescript/zcaceres-fetch-mcp-1ddb1a5/src/index.ts` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/zcaceres-fetch-mcp/zcaceres-fetch-mcp-1ddb1a5/src/index.ts` |
| Tool name | `fetch_txt` -> `fetch_txt` |
| Original location | `browser-automation/zcaceres-fetch-mcp_1ddb1a5_typescript/zcaceres-fetch-mcp-1ddb1a5/src/index.ts:92` |
| Mutation location | `Tool Shadowing Attack/zcaceres-fetch-mcp/zcaceres-fetch-mcp-1ddb1a5/src/index.ts:94--94` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 88--100 from the reference file:

~~~typescript
          required: ["url"],
        },
      },
      {
        name: "fetch_txt",
        description:
          "Fetch a website, convert the content to plain text (no HTML)",
        inputSchema: {
          type: "object",
          properties: {
            url: {
              type: "string",
              description: "URL of the website to fetch",
~~~

### MV-TSH-10511a02d004 `zcaceres-fetch-mcp` / `fetch_json`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-10511a02d004` |
| Subtype | N/A |
| Language | TypeScript |
| Reference tool | `reference-tools/browser-automation/zcaceres-fetch-mcp_1ddb1a5_typescript/zcaceres-fetch-mcp-1ddb1a5/src/index.ts` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/zcaceres-fetch-mcp/zcaceres-fetch-mcp-1ddb1a5/src/index.ts` |
| Tool name | `fetch_json` -> `fetch_json` |
| Original location | `browser-automation/zcaceres-fetch-mcp_1ddb1a5_typescript/zcaceres-fetch-mcp-1ddb1a5/src/index.ts:123` |
| Mutation location | `Tool Shadowing Attack/zcaceres-fetch-mcp/zcaceres-fetch-mcp-1ddb1a5/src/index.ts:124--124` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 118--130 from the reference file:

~~~typescript
          },
          required: ["url"],
        },
      },
      {
        name: "fetch_json",
        description: "Fetch a JSON file from a URL",
        inputSchema: {
          type: "object",
          properties: {
            url: {
              type: "string",
              description: "URL of the JSON to fetch",
~~~

### MV-TSH-ec0329f5017c `zcaceres-fetch-mcp` / `fetch_readable`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-ec0329f5017c` |
| Subtype | N/A |
| Language | TypeScript |
| Reference tool | `reference-tools/browser-automation/zcaceres-fetch-mcp_1ddb1a5_typescript/zcaceres-fetch-mcp-1ddb1a5/src/index.ts` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/zcaceres-fetch-mcp/zcaceres-fetch-mcp-1ddb1a5/src/index.ts` |
| Tool name | `fetch_readable` -> `fetch_readable` |
| Original location | `browser-automation/zcaceres-fetch-mcp_1ddb1a5_typescript/zcaceres-fetch-mcp-1ddb1a5/src/index.ts:153` |
| Mutation location | `Tool Shadowing Attack/zcaceres-fetch-mcp/zcaceres-fetch-mcp-1ddb1a5/src/index.ts:155--155` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 149--161 from the reference file:

~~~typescript
          required: ["url"],
        },
      },
      {
        name: "fetch_readable",
        description:
          "Fetch a website and return its main content parsed by Mozilla Readability, converted to Markdown. Strips away navigation, ads, and boilerplate. Ideal for articles and blog posts.",
        inputSchema: {
          type: "object",
          properties: {
            url: {
              type: "string",
              description: "URL of the website to fetch",
~~~

### MV-TSH-a2366fd1c7c1 `zcaceres-fetch-mcp` / `fetch_youtube_transcript`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-TSH-a2366fd1c7c1` |
| Subtype | N/A |
| Language | TypeScript |
| Reference tool | `reference-tools/browser-automation/zcaceres-fetch-mcp_1ddb1a5_typescript/zcaceres-fetch-mcp-1ddb1a5/src/index.ts` |
| Malicious variant tool | `malicious-variant-tools/Tool Shadowing Attack/zcaceres-fetch-mcp/zcaceres-fetch-mcp-1ddb1a5/src/index.ts` |
| Tool name | `fetch_youtube_transcript` -> `fetch_youtube_transcript` |
| Original location | `browser-automation/zcaceres-fetch-mcp_1ddb1a5_typescript/zcaceres-fetch-mcp-1ddb1a5/src/index.ts:184` |
| Mutation location | `Tool Shadowing Attack/zcaceres-fetch-mcp/zcaceres-fetch-mcp-1ddb1a5/src/index.ts:186--186` |
| Mutation form | tool-description mutation |

#### Original Source Context

Lines 180--192 from the reference file:

~~~typescript
          required: ["url"],
        },
      },
      {
        name: "fetch_youtube_transcript",
        description:
          "Fetch a YouTube video page and extract its captions/transcript",
        inputSchema: {
          type: "object",
          properties: {
            url: {
              type: "string",
              description: "URL of the YouTube video",
~~~

## Tool Index

| ID | Server | Tool | Language | Reference location | Variant location | Mutation form |
|---|---|---|---|---|---|---|
| `MV-TSH-8a997caeeaef` | InditexTech_mcp-teams-server | `start_thread` | Python | `Communication/InditexTech_mcp-teams-server_8a16c62_python/src/mcp_teams_server/__init__.py:110` | `Tool Shadowing Attack/InditexTech_mcp-teams-server/src/mcp_teams_server/__init__.py:118` | Python tool-docstring insertion |
| `MV-TSH-3d4fca89a897` | InditexTech_mcp-teams-server | `update_thread` | Python | `Communication/InditexTech_mcp-teams-server_8a16c62_python/src/mcp_teams_server/__init__.py:126` | `Tool Shadowing Attack/InditexTech_mcp-teams-server/src/mcp_teams_server/__init__.py:137` | Python tool-docstring insertion |
| `MV-TSH-1d74f3a2c52e` | InditexTech_mcp-teams-server | `read_thread` | Python | `Communication/InditexTech_mcp-teams-server_8a16c62_python/src/mcp_teams_server/__init__.py:142` | `Tool Shadowing Attack/InditexTech_mcp-teams-server/src/mcp_teams_server/__init__.py:150` | Python tool-docstring insertion |
| `MV-TSH-c543bde29717` | InditexTech_mcp-teams-server | `list_threads` | Python | `Communication/InditexTech_mcp-teams-server_8a16c62_python/src/mcp_teams_server/__init__.py:154` | `Tool Shadowing Attack/InditexTech_mcp-teams-server/src/mcp_teams_server/__init__.py:166` | Python tool-docstring insertion |
| `MV-TSH-ab4c8b19db80` | dearlordylord_huly-mcp | `list_thread_replies` | TypeScript | `Workplace_&_Productivity/dearlordylord_huly-mcp_e8303ec_typescript/src/mcp/tools/channels.ts:138` | `Tool Shadowing Attack/dearlordylord_huly-mcp/src/mcp/tools/channels.ts:139` | tool-description mutation |
| `MV-TSH-8fc95886a07b` | dearlordylord_huly-mcp | `get_unread_notification_count` | TypeScript | `Workplace_&_Productivity/dearlordylord_huly-mcp_e8303ec_typescript/src/mcp/tools/notifications.ts:181` | `Tool Shadowing Attack/dearlordylord_huly-mcp/src/mcp/tools/notifications.ts:182` | tool-description mutation |
| `MV-TSH-3b3c769ee8f6` | dearlordylord_huly-mcp | `get_test_result` | TypeScript | `Workplace_&_Productivity/dearlordylord_huly-mcp_e8303ec_typescript/src/mcp/tools/test-management-plans.ts:170` | `Tool Shadowing Attack/dearlordylord_huly-mcp/src/mcp/tools/test-management-plans.ts:171` | tool-description mutation |
| `MV-TSH-d19d7fc2d690` | gregario_dnd-oracle | `browse_races` | TypeScript | `Gaming/gregario_dnd-oracle_73a8ad0_typescript/src/tools/browse-races.ts:49` | `Tool Shadowing Attack/gregario_dnd-oracle/src/tools/browse-races.ts:53` | tool-description mutation |
| `MV-TSH-dc21484101e6` | gregario_dnd-oracle | `compare_monsters` | TypeScript | `Gaming/gregario_dnd-oracle_73a8ad0_typescript/src/tools/compare-monsters.ts:70` | `Tool Shadowing Attack/gregario_dnd-oracle/src/tools/compare-monsters.ts:74` | tool-description mutation |
| `MV-TSH-3032e9f8831c` | gregario_dnd-oracle | `search_equipment` | TypeScript | `Gaming/gregario_dnd-oracle_73a8ad0_typescript/src/tools/search-equipment.ts:119` | `Tool Shadowing Attack/gregario_dnd-oracle/src/tools/search-equipment.ts:123` | tool-description mutation |
| `MV-TSH-9ca1f6b44e67` | gregario_dnd-oracle | `search_monsters` | TypeScript | `Gaming/gregario_dnd-oracle_73a8ad0_typescript/src/tools/search-monsters.ts:118` | `Tool Shadowing Attack/gregario_dnd-oracle/src/tools/search-monsters.ts:122` | tool-description mutation |
| `MV-TSH-aa25a99a7d4d` | gregario_dnd-oracle | `search_rules` | TypeScript | `Gaming/gregario_dnd-oracle_73a8ad0_typescript/src/tools/search-rules.ts:14` | `Tool Shadowing Attack/gregario_dnd-oracle/src/tools/search-rules.ts:18` | tool-description mutation |
| `MV-TSH-291f0173d10e` | gregario_dnd-oracle | `search_spells` | TypeScript | `Gaming/gregario_dnd-oracle_73a8ad0_typescript/src/tools/search-spells.ts:93` | `Tool Shadowing Attack/gregario_dnd-oracle/src/tools/search-spells.ts:97` | tool-description mutation |
| `MV-TSH-bfd490a8a034` | hightemp_go_mcp_server_google_sheets | `get_multiple_sheet_data` | Go | `golang/hightemp_go_mcp_server_google_sheets_cddad1d_go/internal/server/server.go:117` | `Tool Shadowing Attack/hightemp_go_mcp_server_google_sheets/internal/server/server.go:118` | tool-description mutation |
| `MV-TSH-0e2c73f9e309` | hightemp_go_mcp_server_google_sheets | `get_multiple_spreadsheet_summary` | Go | `golang/hightemp_go_mcp_server_google_sheets_cddad1d_go/internal/server/server.go:126` | `Tool Shadowing Attack/hightemp_go_mcp_server_google_sheets/internal/server/server.go:127` | tool-description mutation |
| `MV-TSH-c858b7729db2` | hightemp_go_mcp_server_google_sheets | `copy_sheet` | Go | `golang/hightemp_go_mcp_server_google_sheets_cddad1d_go/internal/server/server.go:189` | `Tool Shadowing Attack/hightemp_go_mcp_server_google_sheets/internal/server/server.go:190` | tool-description mutation |
| `MV-TSH-9eb3b7f5f443` | hightemp_go_mcp_server_google_sheets | `create_spreadsheet` | Go | `golang/hightemp_go_mcp_server_google_sheets_cddad1d_go/internal/server/server.go:242` | `Tool Shadowing Attack/hightemp_go_mcp_server_google_sheets/internal/server/server.go:243` | tool-description mutation |
| `MV-TSH-cb4fc9d8b25a` | hightemp_go_mcp_server_google_sheets | `list_spreadsheets` | Go | `golang/hightemp_go_mcp_server_google_sheets_cddad1d_go/internal/server/server.go:251` | `Tool Shadowing Attack/hightemp_go_mcp_server_google_sheets/internal/server/server.go:252` | tool-description mutation |
| `MV-TSH-8292af6a0da4` | hightemp_go_mcp_server_google_sheets | `share_spreadsheet` | Go | `golang/hightemp_go_mcp_server_google_sheets_cddad1d_go/internal/server/server.go:258` | `Tool Shadowing Attack/hightemp_go_mcp_server_google_sheets/internal/server/server.go:259` | tool-description mutation |
| `MV-TSH-6819bb62903f` | ihiteshsharma_mcp-servers | `serper_web_search` | TypeScript | `ai/ihiteshsharma_mcp-servers_6255eb6_typescript/src/serper-firecrawl-mcp/index.ts:12` | `Tool Shadowing Attack/ihiteshsharma_mcp-servers/src/serper-firecrawl-mcp/index.ts:14` | tool-description mutation |
| `MV-TSH-515c01ce1541` | ihiteshsharma_mcp-servers | `serper_news_search` | TypeScript | `ai/ihiteshsharma_mcp-servers_6255eb6_typescript/src/serper-firecrawl-mcp/index.ts:46` | `Tool Shadowing Attack/ihiteshsharma_mcp-servers/src/serper-firecrawl-mcp/index.ts:48` | tool-description mutation |
| `MV-TSH-206123ebd451` | ihiteshsharma_mcp-servers | `serper_image_search` | TypeScript | `ai/ihiteshsharma_mcp-servers_6255eb6_typescript/src/serper-firecrawl-mcp/index.ts:83` | `Tool Shadowing Attack/ihiteshsharma_mcp-servers/src/serper-firecrawl-mcp/index.ts:85` | tool-description mutation |
| `MV-TSH-98f77ccf1ff8` | ihiteshsharma_mcp-servers | `serper_video_search` | TypeScript | `ai/ihiteshsharma_mcp-servers_6255eb6_typescript/src/serper-firecrawl-mcp/index.ts:115` | `Tool Shadowing Attack/ihiteshsharma_mcp-servers/src/serper-firecrawl-mcp/index.ts:117` | tool-description mutation |
| `MV-TSH-5efa454217ea` | ihiteshsharma_mcp-servers | `gps_coordinates` | TypeScript | `ai/ihiteshsharma_mcp-servers_6255eb6_typescript/src/serper-firecrawl-mcp/index.ts:228` | `Tool Shadowing Attack/ihiteshsharma_mcp-servers/src/serper-firecrawl-mcp/index.ts:230` | tool-description mutation |
| `MV-TSH-2a50e4a1788f` | ihiteshsharma_mcp-servers | `firecrawl_scrape` | TypeScript | `ai/ihiteshsharma_mcp-servers_6255eb6_typescript/src/serper-firecrawl-mcp/index.ts:248` | `Tool Shadowing Attack/ihiteshsharma_mcp-servers/src/serper-firecrawl-mcp/index.ts:250` | tool-description mutation |
| `MV-TSH-305b8c16639f` | javierb507_anywhere-mcp-server | `search_pulses` | TypeScript | `security/javierb507_anywhere-mcp-server_badb616_javascript/src/handlers/tools.ts:394` | `Tool Shadowing Attack/javierb507_anywhere-mcp-server/src/handlers/tools.ts:395` | tool-description mutation |
| `MV-TSH-146834dfbb5f` | javierb507_anywhere-mcp-server | `execute_advanced_query` | TypeScript | `security/javierb507_anywhere-mcp-server_badb616_javascript/src/handlers/tools.ts:449` | `Tool Shadowing Attack/javierb507_anywhere-mcp-server/src/handlers/tools.ts:450` | tool-description mutation |
| `MV-TSH-750d4d6fb039` | javierb507_anywhere-mcp-server | `validate_query_syntax` | TypeScript | `security/javierb507_anywhere-mcp-server_badb616_javascript/src/handlers/tools.ts:499` | `Tool Shadowing Attack/javierb507_anywhere-mcp-server/src/handlers/tools.ts:500` | tool-description mutation |
| `MV-TSH-2ea63151e405` | javierb507_anywhere-mcp-server | `get_query_examples` | TypeScript | `security/javierb507_anywhere-mcp-server_badb616_javascript/src/handlers/tools.ts:519` | `Tool Shadowing Attack/javierb507_anywhere-mcp-server/src/handlers/tools.ts:520` | tool-description mutation |
| `MV-TSH-2c4b82f232bb` | jtalk22_slack-mcp-server | `slack_search_messages` | JavaScript | `Communication/jtalk22_slack-mcp-server_ce10721_javascript/lib/tools.js:157` | `Tool Shadowing Attack/jtalk22_slack-mcp-server/lib/tools.js:158` | tool-description mutation |
| `MV-TSH-b8316ab42bbb` | jtalk22_slack-mcp-server | `slack_conversations_unreads` | JavaScript | `Communication/jtalk22_slack-mcp-server_ce10721_javascript/lib/tools.js:356` | `Tool Shadowing Attack/jtalk22_slack-mcp-server/lib/tools.js:357` | tool-description mutation |
| `MV-TSH-289fd7805607` | jtalk22_slack-mcp-server | `slack_users_search` | JavaScript | `Communication/jtalk22_slack-mcp-server_ce10721_javascript/lib/tools.js:380` | `Tool Shadowing Attack/jtalk22_slack-mcp-server/lib/tools.js:381` | tool-description mutation |
| `MV-TSH-8d53691d9e5d` | jtalk22_slack-mcp-server | `slack_search_messages` | JavaScript | `Communication/jtalk22_slack-mcp-server_ce10721_javascript/workers/mcp-worker.js:110` | `Tool Shadowing Attack/jtalk22_slack-mcp-server/workers/mcp-worker.js:111` | tool-description mutation |
| `MV-TSH-1f8072750c56` | jtalk22_slack-mcp-server | `slack_get_thread` | JavaScript | `Communication/jtalk22_slack-mcp-server_ce10721_javascript/workers/mcp-worker.js:137` | `Tool Shadowing Attack/jtalk22_slack-mcp-server/workers/mcp-worker.js:138` | tool-description mutation |
| `MV-TSH-76ff7af3b566` | kryptosai-mcp-observatory | `run_cmd` | TypeScript | `developer-tools/kryptosai-mcp-observatory_e37d197_typescript/KryptosAI-mcp-observatory-e37d197/scripts/evaluate-permission-delta-conformance.ts:154` | `Tool Shadowing Attack/kryptosai-mcp-observatory/KryptosAI-mcp-observatory-e37d197/scripts/evaluate-permission-delta-conformance.ts:152` | tool-description mutation |
| `MV-TSH-7fbbc4739252` | kryptosai-mcp-observatory | `search` | TypeScript | `developer-tools/kryptosai-mcp-observatory_e37d197_typescript/KryptosAI-mcp-observatory-e37d197/scripts/evaluate-permission-delta-conformance.ts:163` | `Tool Shadowing Attack/kryptosai-mcp-observatory/KryptosAI-mcp-observatory-e37d197/scripts/evaluate-permission-delta-conformance.ts:161` | tool-description mutation |
| `MV-TSH-f9600eee87b4` | kryptosai-mcp-observatory | `search` | TypeScript | `developer-tools/kryptosai-mcp-observatory_e37d197_typescript/KryptosAI-mcp-observatory-e37d197/scripts/evaluate-permission-delta-conformance.ts:192` | `Tool Shadowing Attack/kryptosai-mcp-observatory/KryptosAI-mcp-observatory-e37d197/scripts/evaluate-permission-delta-conformance.ts:190` | tool-description mutation |
| `MV-TSH-efd787e238ed` | kryptosai-mcp-observatory | `read` | TypeScript | `developer-tools/kryptosai-mcp-observatory_e37d197_typescript/KryptosAI-mcp-observatory-e37d197/scripts/evaluate-permission-delta-conformance.ts:241` | `Tool Shadowing Attack/kryptosai-mcp-observatory/KryptosAI-mcp-observatory-e37d197/scripts/evaluate-permission-delta-conformance.ts:239` | tool-description mutation |
| `MV-TSH-600abbe69b24` | kryptosai-mcp-observatory | `read` | TypeScript | `developer-tools/kryptosai-mcp-observatory_e37d197_typescript/KryptosAI-mcp-observatory-e37d197/scripts/evaluate-permission-delta-conformance.ts:250` | `Tool Shadowing Attack/kryptosai-mcp-observatory/KryptosAI-mcp-observatory-e37d197/scripts/evaluate-permission-delta-conformance.ts:248` | tool-description mutation |
| `MV-TSH-5def161f0bb0` | kryptosai-mcp-observatory | `read_file` | TypeScript | `developer-tools/kryptosai-mcp-observatory_e37d197_typescript/KryptosAI-mcp-observatory-e37d197/scripts/evaluate-permission-delta-conformance.ts:273` | `Tool Shadowing Attack/kryptosai-mcp-observatory/KryptosAI-mcp-observatory-e37d197/scripts/evaluate-permission-delta-conformance.ts:270` | tool-description mutation |
| `MV-TSH-949c3cc01fd6` | kryptosai-mcp-observatory | `search` | TypeScript | `developer-tools/kryptosai-mcp-observatory_e37d197_typescript/KryptosAI-mcp-observatory-e37d197/scripts/evaluate-permission-delta-conformance.ts:279` | `Tool Shadowing Attack/kryptosai-mcp-observatory/KryptosAI-mcp-observatory-e37d197/scripts/evaluate-permission-delta-conformance.ts:287` | tool-description mutation |
| `MV-TSH-e3763328a00d` | mkummer225-google-sheets-mcp | `create_spreadsheet` | TypeScript | `Other_Tools_and_Integrations/mkummer225-google-sheets-mcp_1d52b9d_typescript/mkummer225-google-sheets-mcp-1d52b9d/index.ts:90` | `Tool Shadowing Attack/mkummer225-google-sheets-mcp/mkummer225-google-sheets-mcp-1d52b9d/index.ts:91` | tool-description mutation |
| `MV-TSH-36b2f9e435bc` | mkummer225-google-sheets-mcp | `read_all_from_sheet` | TypeScript | `Other_Tools_and_Integrations/mkummer225-google-sheets-mcp_1d52b9d_typescript/mkummer225-google-sheets-mcp-1d52b9d/index.ts:140` | `Tool Shadowing Attack/mkummer225-google-sheets-mcp/mkummer225-google-sheets-mcp-1d52b9d/index.ts:141` | tool-description mutation |
| `MV-TSH-e0235dbdb8b6` | mkummer225-google-sheets-mcp | `read_headings` | TypeScript | `Other_Tools_and_Integrations/mkummer225-google-sheets-mcp_1d52b9d_typescript/mkummer225-google-sheets-mcp-1d52b9d/index.ts:158` | `Tool Shadowing Attack/mkummer225-google-sheets-mcp/mkummer225-google-sheets-mcp-1d52b9d/index.ts:159` | tool-description mutation |
| `MV-TSH-68062cd075be` | mkummer225-google-sheets-mcp | `read_rows` | TypeScript | `Other_Tools_and_Integrations/mkummer225-google-sheets-mcp_1d52b9d_typescript/mkummer225-google-sheets-mcp-1d52b9d/index.ts:177` | `Tool Shadowing Attack/mkummer225-google-sheets-mcp/mkummer225-google-sheets-mcp-1d52b9d/index.ts:178` | tool-description mutation |
| `MV-TSH-d16d55b24cbb` | mkummer225-google-sheets-mcp | `read_columns` | TypeScript | `Other_Tools_and_Integrations/mkummer225-google-sheets-mcp_1d52b9d_typescript/mkummer225-google-sheets-mcp-1d52b9d/index.ts:204` | `Tool Shadowing Attack/mkummer225-google-sheets-mcp/mkummer225-google-sheets-mcp-1d52b9d/index.ts:205` | tool-description mutation |
| `MV-TSH-0f8bc874152d` | mkummer225-google-sheets-mcp | `edit_cell` | TypeScript | `Other_Tools_and_Integrations/mkummer225-google-sheets-mcp_1d52b9d_typescript/mkummer225-google-sheets-mcp-1d52b9d/index.ts:230` | `Tool Shadowing Attack/mkummer225-google-sheets-mcp/mkummer225-google-sheets-mcp-1d52b9d/index.ts:231` | tool-description mutation |
| `MV-TSH-7205b9ef308b` | mkummer225-google-sheets-mcp | `edit_column` | TypeScript | `Other_Tools_and_Integrations/mkummer225-google-sheets-mcp_1d52b9d_typescript/mkummer225-google-sheets-mcp-1d52b9d/index.ts:287` | `Tool Shadowing Attack/mkummer225-google-sheets-mcp/mkummer225-google-sheets-mcp-1d52b9d/index.ts:288` | tool-description mutation |
| `MV-TSH-864fbed56c9e` | ryaker-outlook-mcp | `search-emails` | JavaScript | `Communication/ryaker-outlook-mcp_95d6ff2_javascript/ryaker-outlook-mcp-95d6ff2/email/index.js:34` | `Tool Shadowing Attack/ryaker-outlook-mcp/ryaker-outlook-mcp-95d6ff2/email/index.js:35` | tool-description mutation |
| `MV-TSH-10adc42d8a91` | ryaker-outlook-mcp | `mark-as-read` | JavaScript | `Communication/ryaker-outlook-mcp_95d6ff2_javascript/ryaker-outlook-mcp-95d6ff2/email/index.js:176` | `Tool Shadowing Attack/ryaker-outlook-mcp/ryaker-outlook-mcp-95d6ff2/email/index.js:177` | tool-description mutation |
| `MV-TSH-ea60d7e2fcc7` | ryaker-outlook-mcp | `onedrive-search` | JavaScript | `Communication/ryaker-outlook-mcp_95d6ff2_javascript/ryaker-outlook-mcp-95d6ff2/onedrive/index.js:34` | `Tool Shadowing Attack/ryaker-outlook-mcp/ryaker-outlook-mcp-95d6ff2/onedrive/index.js:35` | tool-description mutation |
| `MV-TSH-fdba32bcf97d` | screenpipe-screenpipe | `start_worktree` | JavaScript | `Other_Tools_and_Integrations/screenpipe-screenpipe_6661b7d_typescript/screenpipe-screenpipe-6661b7d/crates/screenpipe-core/assets/acp/screenpipe-tools.mjs:383` | `Tool Shadowing Attack/screenpipe-screenpipe/screenpipe-screenpipe-6661b7d/crates/screenpipe-core/assets/acp/screenpipe-tools.mjs:385` | tool-description mutation |
| `MV-TSH-52ee420beca5` | screenpipe-screenpipe | `search_chats` | JavaScript | `Other_Tools_and_Integrations/screenpipe-screenpipe_6661b7d_typescript/screenpipe-screenpipe-6661b7d/crates/screenpipe-core/assets/acp/screenpipe-tools.mjs:441` | `Tool Shadowing Attack/screenpipe-screenpipe/screenpipe-screenpipe-6661b7d/crates/screenpipe-core/assets/acp/screenpipe-tools.mjs:443` | tool-description mutation |
| `MV-TSH-43a2558bb6be` | screenpipe-screenpipe | `sp_web_search` | JavaScript | `Other_Tools_and_Integrations/screenpipe-screenpipe_6661b7d_typescript/screenpipe-screenpipe-6661b7d/crates/screenpipe-core/assets/acp/screenpipe-tools.mjs:686` | `Tool Shadowing Attack/screenpipe-screenpipe/screenpipe-screenpipe-6661b7d/crates/screenpipe-core/assets/acp/screenpipe-tools.mjs:688` | tool-description mutation |
| `MV-TSH-67ca0d07ccbf` | screenpipe-screenpipe | `keyword_search` | JavaScript | `Other_Tools_and_Integrations/screenpipe-screenpipe_6661b7d_typescript/screenpipe-screenpipe-6661b7d/crates/screenpipe-core/assets/acp/screenpipe-tools.mjs:1102` | `Tool Shadowing Attack/screenpipe-screenpipe/screenpipe-screenpipe-6661b7d/crates/screenpipe-core/assets/acp/screenpipe-tools.mjs:1104` | tool-description mutation |
| `MV-TSH-74d38f3f0306` | screenpipe-screenpipe | `search_elements` | JavaScript | `Other_Tools_and_Integrations/screenpipe-screenpipe_6661b7d_typescript/screenpipe-screenpipe-6661b7d/crates/screenpipe-core/assets/acp/screenpipe-tools.mjs:1142` | `Tool Shadowing Attack/screenpipe-screenpipe/screenpipe-screenpipe-6661b7d/crates/screenpipe-core/assets/acp/screenpipe-tools.mjs:1144` | tool-description mutation |
| `MV-TSH-c744c946c761` | southleft-design-systems-mcp | `search_design_knowledge` | TypeScript | `media-and-design/southleft-design-systems-mcp_eca371b_typescript/southleft-design-systems-mcp-eca371b/src/sse-session.ts:330` | `Tool Shadowing Attack/southleft-design-systems-mcp/southleft-design-systems-mcp-eca371b/src/sse-session.ts:331` | tool-description mutation |
| `MV-TSH-370d164bbe31` | southleft-design-systems-mcp | `search_chunks` | TypeScript | `media-and-design/southleft-design-systems-mcp_eca371b_typescript/southleft-design-systems-mcp-eca371b/src/sse-session.ts:359` | `Tool Shadowing Attack/southleft-design-systems-mcp/southleft-design-systems-mcp-eca371b/src/sse-session.ts:360` | tool-description mutation |
| `MV-TSH-71fa04279fc8` | southleft-design-systems-mcp | `search_design_knowledge` | TypeScript | `media-and-design/southleft-design-systems-mcp_eca371b_typescript/southleft-design-systems-mcp-eca371b/src/streamable-http-handler.ts:171` | `Tool Shadowing Attack/southleft-design-systems-mcp/southleft-design-systems-mcp-eca371b/src/streamable-http-handler.ts:172` | tool-description mutation |
| `MV-TSH-c5e5bd0dc7b6` | southleft-design-systems-mcp | `search_chunks` | TypeScript | `media-and-design/southleft-design-systems-mcp_eca371b_typescript/southleft-design-systems-mcp-eca371b/src/streamable-http-handler.ts:200` | `Tool Shadowing Attack/southleft-design-systems-mcp/southleft-design-systems-mcp-eca371b/src/streamable-http-handler.ts:201` | tool-description mutation |
| `MV-TSH-7538231b453f` | southleft-design-systems-mcp | `get_all_tags` | TypeScript | `media-and-design/southleft-design-systems-mcp_eca371b_typescript/southleft-design-systems-mcp-eca371b/src/streamable-http-handler.ts:234` | `Tool Shadowing Attack/southleft-design-systems-mcp/southleft-design-systems-mcp-eca371b/src/streamable-http-handler.ts:235` | tool-description mutation |
| `MV-TSH-2ebf702c267c` | thelunarcompany-lunar | `read_file` | TypeScript | `Other_Tools_and_Integrations/thelunarcompany-lunar_0b25606_typescript/TheLunarCompany-lunar-0b25606/mcpx/packages/ui/src/components/tools/CustomToolDialog.stories.tsx:24` | `Tool Shadowing Attack/thelunarcompany-lunar/TheLunarCompany-lunar-0b25606/mcpx/packages/ui/src/components/tools/CustomToolDialog.stories.tsx:25` | tool-description mutation |
| `MV-TSH-608d5b411781` | thelunarcompany-lunar | `read_file` | TypeScript | `Other_Tools_and_Integrations/thelunarcompany-lunar_0b25606_typescript/TheLunarCompany-lunar-0b25606/mcpx/packages/ui/src/components/tools/ProviderCard.stories.tsx:28` | `Tool Shadowing Attack/thelunarcompany-lunar/TheLunarCompany-lunar-0b25606/mcpx/packages/ui/src/components/tools/ProviderCard.stories.tsx:29` | tool-description mutation |
| `MV-TSH-93f01ef49794` | thelunarcompany-lunar | `read_file` | TypeScript | `Other_Tools_and_Integrations/thelunarcompany-lunar_0b25606_typescript/TheLunarCompany-lunar-0b25606/mcpx/packages/ui/src/components/tools/ToolCard.stories.tsx:6` | `Tool Shadowing Attack/thelunarcompany-lunar/TheLunarCompany-lunar-0b25606/mcpx/packages/ui/src/components/tools/ToolCard.stories.tsx:8` | tool-description mutation |
| `MV-TSH-0072267a3a57` | thelunarcompany-lunar | `read_file` | TypeScript | `Other_Tools_and_Integrations/thelunarcompany-lunar_0b25606_typescript/TheLunarCompany-lunar-0b25606/mcpx/packages/ui/src/components/tools/ToolDetailsDialog.stories.tsx:6` | `Tool Shadowing Attack/thelunarcompany-lunar/TheLunarCompany-lunar-0b25606/mcpx/packages/ui/src/components/tools/ToolDetailsDialog.stories.tsx:8` | tool-description mutation |
| `MV-TSH-48def8a75ea7` | tiberriver256-mcp-server-azure-devops | `get_pipeline` | TypeScript | `Cloud_Platforms/tiberriver256-mcp-server-azure-devops_5c8ad17_typescript/Tiberriver256-mcp-server-azure-devops-5c8ad17/src/features/pipelines/tool-definitions.ts:23` | `Tool Shadowing Attack/tiberriver256-mcp-server-azure-devops/Tiberriver256-mcp-server-azure-devops-5c8ad17/src/features/pipelines/tool-definitions.ts:24` | tool-description mutation |
| `MV-TSH-7cba9fcf6257` | tiberriver256-mcp-server-azure-devops | `update_pull_request_thread_status` | TypeScript | `Cloud_Platforms/tiberriver256-mcp-server-azure-devops_5c8ad17_typescript/Tiberriver256-mcp-server-azure-devops-5c8ad17/src/features/pull-requests/tool-definitions.ts:69` | `Tool Shadowing Attack/tiberriver256-mcp-server-azure-devops/Tiberriver256-mcp-server-azure-devops-5c8ad17/src/features/pull-requests/tool-definitions.ts:71` | tool-description mutation |
| `MV-TSH-dd557584a158` | tiberriver256-mcp-server-azure-devops | `search_code` | TypeScript | `Cloud_Platforms/tiberriver256-mcp-server-azure-devops_5c8ad17_typescript/Tiberriver256-mcp-server-azure-devops-5c8ad17/src/features/search/tool-definitions.ts:14` | `Tool Shadowing Attack/tiberriver256-mcp-server-azure-devops/Tiberriver256-mcp-server-azure-devops-5c8ad17/src/features/search/tool-definitions.ts:15` | tool-description mutation |
| `MV-TSH-1e086874d60e` | tiberriver256-mcp-server-azure-devops | `search_wiki` | TypeScript | `Cloud_Platforms/tiberriver256-mcp-server-azure-devops_5c8ad17_typescript/Tiberriver256-mcp-server-azure-devops-5c8ad17/src/features/search/tool-definitions.ts:19` | `Tool Shadowing Attack/tiberriver256-mcp-server-azure-devops/Tiberriver256-mcp-server-azure-devops-5c8ad17/src/features/search/tool-definitions.ts:20` | tool-description mutation |
| `MV-TSH-ad889aa79e76` | tiberriver256-mcp-server-azure-devops | `search_work_items` | TypeScript | `Cloud_Platforms/tiberriver256-mcp-server-azure-devops_5c8ad17_typescript/Tiberriver256-mcp-server-azure-devops-5c8ad17/src/features/search/tool-definitions.ts:24` | `Tool Shadowing Attack/tiberriver256-mcp-server-azure-devops/Tiberriver256-mcp-server-azure-devops-5c8ad17/src/features/search/tool-definitions.ts:25` | tool-description mutation |
| `MV-TSH-3bb53ae8e89a` | tiberriver256-mcp-server-azure-devops | `update_work_item` | TypeScript | `Cloud_Platforms/tiberriver256-mcp-server-azure-devops_5c8ad17_typescript/Tiberriver256-mcp-server-azure-devops-5c8ad17/src/features/work-items/tool-definitions.ts:35` | `Tool Shadowing Attack/tiberriver256-mcp-server-azure-devops/Tiberriver256-mcp-server-azure-devops-5c8ad17/src/features/work-items/tool-definitions.ts:36` | tool-description mutation |
| `MV-TSH-ccb95d49d732` | ubie-oss-slack-mcp-server | `slack_reply_to_thread` | TypeScript | `Communication/ubie-oss-slack-mcp-server_c3efcb1_typescript/ubie-oss-slack-mcp-server-c3efcb1/src/index.ts:127` | `Tool Shadowing Attack/ubie-oss-slack-mcp-server/ubie-oss-slack-mcp-server-c3efcb1/src/index.ts:128` | tool-description mutation |
| `MV-TSH-81030447c91b` | ubie-oss-slack-mcp-server | `slack_get_thread_replies` | TypeScript | `Communication/ubie-oss-slack-mcp-server_c3efcb1_typescript/ubie-oss-slack-mcp-server-c3efcb1/src/index.ts:143` | `Tool Shadowing Attack/ubie-oss-slack-mcp-server/ubie-oss-slack-mcp-server-c3efcb1/src/index.ts:144` | tool-description mutation |
| `MV-TSH-69882a129079` | ubie-oss-slack-mcp-server | `slack_get_users` | TypeScript | `Communication/ubie-oss-slack-mcp-server_c3efcb1_typescript/ubie-oss-slack-mcp-server-c3efcb1/src/index.ts:148` | `Tool Shadowing Attack/ubie-oss-slack-mcp-server/ubie-oss-slack-mcp-server-c3efcb1/src/index.ts:150` | tool-description mutation |
| `MV-TSH-eddca9a5b71a` | ubie-oss-slack-mcp-server | `slack_search_messages` | TypeScript | `Communication/ubie-oss-slack-mcp-server_c3efcb1_typescript/ubie-oss-slack-mcp-server-c3efcb1/src/index.ts:159` | `Tool Shadowing Attack/ubie-oss-slack-mcp-server/ubie-oss-slack-mcp-server-c3efcb1/src/index.ts:161` | tool-description mutation |
| `MV-TSH-22e4f0b2c567` | ubie-oss-slack-mcp-server | `slack_search_channels` | TypeScript | `Communication/ubie-oss-slack-mcp-server_c3efcb1_typescript/ubie-oss-slack-mcp-server-c3efcb1/src/index.ts:165` | `Tool Shadowing Attack/ubie-oss-slack-mcp-server/ubie-oss-slack-mcp-server-c3efcb1/src/index.ts:167` | tool-description mutation |
| `MV-TSH-c439689c8a65` | ubie-oss-slack-mcp-server | `slack_search_users` | TypeScript | `Communication/ubie-oss-slack-mcp-server_c3efcb1_typescript/ubie-oss-slack-mcp-server-c3efcb1/src/index.ts:171` | `Tool Shadowing Attack/ubie-oss-slack-mcp-server/ubie-oss-slack-mcp-server-c3efcb1/src/index.ts:173` | tool-description mutation |
| `MV-TSH-7d4d1a405973` | zcaceres-fetch-mcp | `fetch_html` | TypeScript | `browser-automation/zcaceres-fetch-mcp_1ddb1a5_typescript/zcaceres-fetch-mcp-1ddb1a5/src/index.ts:32` | `Tool Shadowing Attack/zcaceres-fetch-mcp/zcaceres-fetch-mcp-1ddb1a5/src/index.ts:33` | tool-description mutation |
| `MV-TSH-adb2dfa1d66d` | zcaceres-fetch-mcp | `fetch_markdown` | TypeScript | `browser-automation/zcaceres-fetch-mcp_1ddb1a5_typescript/zcaceres-fetch-mcp-1ddb1a5/src/index.ts:62` | `Tool Shadowing Attack/zcaceres-fetch-mcp/zcaceres-fetch-mcp-1ddb1a5/src/index.ts:63` | tool-description mutation |
| `MV-TSH-b6b167e815eb` | zcaceres-fetch-mcp | `fetch_txt` | TypeScript | `browser-automation/zcaceres-fetch-mcp_1ddb1a5_typescript/zcaceres-fetch-mcp-1ddb1a5/src/index.ts:92` | `Tool Shadowing Attack/zcaceres-fetch-mcp/zcaceres-fetch-mcp-1ddb1a5/src/index.ts:94` | tool-description mutation |
| `MV-TSH-10511a02d004` | zcaceres-fetch-mcp | `fetch_json` | TypeScript | `browser-automation/zcaceres-fetch-mcp_1ddb1a5_typescript/zcaceres-fetch-mcp-1ddb1a5/src/index.ts:123` | `Tool Shadowing Attack/zcaceres-fetch-mcp/zcaceres-fetch-mcp-1ddb1a5/src/index.ts:124` | tool-description mutation |
| `MV-TSH-ec0329f5017c` | zcaceres-fetch-mcp | `fetch_readable` | TypeScript | `browser-automation/zcaceres-fetch-mcp_1ddb1a5_typescript/zcaceres-fetch-mcp-1ddb1a5/src/index.ts:153` | `Tool Shadowing Attack/zcaceres-fetch-mcp/zcaceres-fetch-mcp-1ddb1a5/src/index.ts:155` | tool-description mutation |
| `MV-TSH-a2366fd1c7c1` | zcaceres-fetch-mcp | `fetch_youtube_transcript` | TypeScript | `browser-automation/zcaceres-fetch-mcp_1ddb1a5_typescript/zcaceres-fetch-mcp-1ddb1a5/src/index.ts:184` | `Tool Shadowing Attack/zcaceres-fetch-mcp/zcaceres-fetch-mcp-1ddb1a5/src/index.ts:186` | tool-description mutation |
