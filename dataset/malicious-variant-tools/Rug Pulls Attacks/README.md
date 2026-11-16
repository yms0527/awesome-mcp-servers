# Rug Pulls Attacks Malicious Variant Tools

## Category Overview

| Field | Value |
|---|---|
| Attack type | Rug Pulls Attacks |
| DTPE stage | Processing |
| Source server directories | 17 |
| Modified tools | 97 |
| Languages | Python: 97 |
| Mutation forms | safe behavior branch insertion: 97 |

## Modified Tool Records

### MV-RP-8a7d86147d4b `RobSpectre_mvf1` / `player`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-8a7d86147d4b` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Sports/RobSpectre_mvf1_6e11cfd_python/mvf1/mcp.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/RobSpectre_mvf1/mvf1/mcp.py` |
| Tool name | `player` -> `player` |
| Original location | `Sports/RobSpectre_mvf1_6e11cfd_python/mvf1/mcp.py:149` |
| Mutation location | `Rug Pulls Attacks/RobSpectre_mvf1/mvf1/mcp.py:164--165` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `id` |
| Canary | `bf771f3f56` |

#### Original Source Context

Lines 158--170 from the reference file:

~~~python
        Returns
        -------
        str
            Player information as string.

        """
        player_obj = client.player(id=id)
        return str(player_obj)

    @mcp.tool()
    def player_create(
        content_id,  # Accept both int and str
        driver_tla: Optional[str] = None,
~~~

### MV-RP-af28c40eb4f4 `RobSpectre_mvf1` / `player_set_bounds`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-af28c40eb4f4` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Sports/RobSpectre_mvf1_6e11cfd_python/mvf1/mcp.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/RobSpectre_mvf1/mvf1/mcp.py` |
| Tool name | `player_set_bounds` -> `player_set_bounds` |
| Original location | `Sports/RobSpectre_mvf1_6e11cfd_python/mvf1/mcp.py:294` |
| Mutation location | `Rug Pulls Attacks/RobSpectre_mvf1/mvf1/mcp.py:329--330` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `id` |
| Canary | `5394b9cf39` |

#### Original Source Context

Lines 321--333 from the reference file:

~~~python
        Returns
        -------
        dict
            True if operation is successful.

        """
        return client.player_set_bounds(id=id,
                                        x=x,
                                        y=y,
                                        width=width,
                                        height=height)

    @mcp.tool()
~~~

### MV-RP-833b70a94919 `RobSpectre_mvf1` / `player_set_fullscreen`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-833b70a94919` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Sports/RobSpectre_mvf1_6e11cfd_python/mvf1/mcp.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/RobSpectre_mvf1/mvf1/mcp.py` |
| Tool name | `player_set_fullscreen` -> `player_set_fullscreen` |
| Original location | `Sports/RobSpectre_mvf1_6e11cfd_python/mvf1/mcp.py:377` |
| Mutation location | `Rug Pulls Attacks/RobSpectre_mvf1/mvf1/mcp.py:400--401` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `id` |
| Canary | `44bf68bbdb` |

#### Original Source Context

Lines 390--402 from the reference file:

~~~python
        Returns
        -------
        dict
            True if operation is successful.

        """
        return client.player_set_fullscreen(id=id, fullscreen=fullscreen)

    @mcp.tool()
    def player_set_muted(id: int, muted: Optional[bool] = None) -> dict:
        """
        Mutes/unmutes MultiViewer video player or specifies
        muted state for player.
~~~

### MV-RP-e000aa51735f `RobSpectre_mvf1` / `player_set_speedometer_visibility`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-e000aa51735f` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Sports/RobSpectre_mvf1_6e11cfd_python/mvf1/mcp.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/RobSpectre_mvf1/mvf1/mcp.py` |
| Tool name | `player_set_speedometer_visibility` -> `player_set_speedometer_visibility` |
| Original location | `Sports/RobSpectre_mvf1_6e11cfd_python/mvf1/mcp.py:421` |
| Mutation location | `Rug Pulls Attacks/RobSpectre_mvf1/mvf1/mcp.py:448--449` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `id` |
| Canary | `1e768d70e5` |

#### Original Source Context

Lines 436--448 from the reference file:

~~~python
        Returns
        -------
        dict
            True if operation is successful.

        """
        return client.player_set_speedometer_visibility(id=id,
                                                        visible=visible)

    @mcp.tool()
    def player_set_driver_header_mode(id: int,
                                      mode: Optional[str] = None) -> dict:
        """
~~~

### MV-RP-f5dc61b82eb2 `RobSpectre_mvf1` / `player_set_driver_header_mode`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-f5dc61b82eb2` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Sports/RobSpectre_mvf1_6e11cfd_python/mvf1/mcp.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/RobSpectre_mvf1/mvf1/mcp.py` |
| Tool name | `player_set_driver_header_mode` -> `player_set_driver_header_mode` |
| Original location | `Sports/RobSpectre_mvf1_6e11cfd_python/mvf1/mcp.py:446` |
| Mutation location | `Rug Pulls Attacks/RobSpectre_mvf1/mvf1/mcp.py:475--476` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `id` |
| Canary | `477998cf37` |

#### Original Source Context

Lines 461--473 from the reference file:

~~~python
        Returns
        -------
        dict
            True if operation is successful.

        """
        return client.player_set_driver_header_mode(id=id,
                                                    mode=mode)

    @mcp.tool()
    def player_set_always_on_top(
        id: int, always_on_top: Optional[bool] = None
    ) -> dict:
~~~

### MV-RP-c68c22ad7ef7 `RobSpectre_mvf1` / `player_sync`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-c68c22ad7ef7` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Sports/RobSpectre_mvf1_6e11cfd_python/mvf1/mcp.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/RobSpectre_mvf1/mvf1/mcp.py` |
| Tool name | `player_sync` -> `player_sync` |
| Original location | `Sports/RobSpectre_mvf1_6e11cfd_python/mvf1/mcp.py:495` |
| Mutation location | `Rug Pulls Attacks/RobSpectre_mvf1/mvf1/mcp.py:522--523` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `id` |
| Canary | `b48dc300af` |

#### Original Source Context

Lines 506--518 from the reference file:

~~~python
        Returns
        -------
        dict
            True if operation is successful.

        """
        return client.player_sync(id=id)

    @mcp.tool()
    def player_sync_to_commentary() -> dict:
        """
        Synchronizes all MultiViewer video players to the player
        with a broadcast commentary stream.
~~~

### MV-RP-6feb2c31b026 `alpacahq_alpaca-mcp-server` / `update_account_config`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-6feb2c31b026` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/ai/alpacahq_alpaca-mcp-server_57ecdee_python/src/alpaca_mcp_server/server.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/alpacahq_alpaca-mcp-server/src/alpaca_mcp_server/server.py` |
| Tool name | `update_account_config` -> `update_account_config` |
| Original location | `ai/alpacahq_alpaca-mcp-server_57ecdee_python/src/alpaca_mcp_server/server.py:302` |
| Mutation location | `Rug Pulls Attacks/alpacahq_alpaca-mcp-server/src/alpaca_mcp_server/server.py:331--332` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `fractional_trading` |
| Canary | `c4a378c256` |

#### Original Source Context

Lines 325--337 from the reference file:

~~~python
        ptp_no_exception_entry (Optional[bool]): If True, accept orders for PTP symbols without exception
        max_options_trading_level (Optional[int]): Options level: 0=disabled, 1=Covered/CSP, 2=Long, 3=Spreads

    Returns:
        CallToolResult: Updated account configuration in both human-readable and structured form.
    """
    _ensure_clients()
    tool_name = "update_account_config"
    provided = [v for v in [
        fractional_trading, no_shorting, suspend_trade, max_margin_multiplier,
        dtbp_check, pdt_check, trade_confirm_email, ptp_no_exception_entry,
        max_options_trading_level
    ] if v is not None]
~~~

### MV-RP-b224df4e721b `alpacahq_alpaca-mcp-server` / `get_open_position`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-b224df4e721b` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/ai/alpacahq_alpaca-mcp-server_57ecdee_python/src/alpaca_mcp_server/server.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/alpacahq_alpaca-mcp-server/src/alpaca_mcp_server/server.py` |
| Tool name | `get_open_position` -> `get_open_position` |
| Original location | `ai/alpacahq_alpaca-mcp-server_57ecdee_python/src/alpaca_mcp_server/server.py:455` |
| Mutation location | `Rug Pulls Attacks/alpacahq_alpaca-mcp-server/src/alpaca_mcp_server/server.py:467--468` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `symbol` |
| Canary | `af110dca73` |

#### Original Source Context

Lines 459--471 from the reference file:

~~~python
    Args:
        symbol (str): The symbol name of the asset to get position for (e.g., 'AAPL', 'MSFT')
    
    Returns:
        str: Compact JSON position payload with the position details or an error message
    """
    _ensure_clients()
    try:
        position = trade_client.get_open_position(symbol)
        return compact_json(to_serializable(position))
    except Exception as e:
        return compact_json({"error": {"code": "get_open_position_failed", "message": str(e), "symbol": symbol}})

~~~

### MV-RP-2caa5fcba8a9 `alpacahq_alpaca-mcp-server` / `update_watchlist_by_id`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-2caa5fcba8a9` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/ai/alpacahq_alpaca-mcp-server_57ecdee_python/src/alpaca_mcp_server/server.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/alpacahq_alpaca-mcp-server/src/alpaca_mcp_server/server.py` |
| Tool name | `update_watchlist_by_id` -> `update_watchlist_by_id` |
| Original location | `ai/alpacahq_alpaca-mcp-server_57ecdee_python/src/alpaca_mcp_server/server.py:809` |
| Mutation location | `Rug Pulls Attacks/alpacahq_alpaca-mcp-server/src/alpaca_mcp_server/server.py:825--826` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `watchlist_id` |
| Canary | `287473ea52` |

#### Original Source Context

Lines 815--827 from the reference file:

~~~python
        name (str): New name for the watchlist
        symbols (List[str]): New list of symbols for the watchlist

    Returns:
        str: Confirmation message with updated watchlist name
    """
    _ensure_clients()
    try:
        update_request = UpdateWatchlistRequest(name=name, symbols=symbols)
        watchlist = trade_client.update_watchlist_by_id(watchlist_id, update_request)
        return f"Watchlist updated successfully: {watchlist.name}"
    except Exception as e:
        return f"Error updating watchlist: {str(e)}"
~~~

### MV-RP-37fb4202d20b `alpacahq_alpaca-mcp-server` / `get_stock_screener`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-37fb4202d20b` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/ai/alpacahq_alpaca-mcp-server_57ecdee_python/src/alpaca_mcp_server/server.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/alpacahq_alpaca-mcp-server/src/alpaca_mcp_server/server.py` |
| Tool name | `get_stock_screener` -> `get_stock_screener` |
| Original location | `ai/alpacahq_alpaca-mcp-server_57ecdee_python/src/alpaca_mcp_server/server.py:1725` |
| Mutation location | `Rug Pulls Attacks/alpacahq_alpaca-mcp-server/src/alpaca_mcp_server/server.py:1752--1753` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `screener_type` |
| Canary | `c537391235` |

#### Original Source Context

Lines 1740--1752 from the reference file:

~~~python
        top (Optional[int]): Number of results to return (default determined by API)

    Returns:
        CallToolResult: Screener results with symbol, price, and change data in both
        human-readable text and structured content.
    """
    _ensure_clients()
    tool_name = "get_stock_screener"
    try:
        if screener_type == "most_actives":
            try:
                by_enum = MostActivesBy(by.lower()) if by else MostActivesBy.VOLUME
            except ValueError:
~~~

### MV-RP-2b2dad85b79f `alpacahq_alpaca-mcp-server` / `get_option_latest_quote`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-2b2dad85b79f` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/ai/alpacahq_alpaca-mcp-server_57ecdee_python/src/alpaca_mcp_server/server.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/alpacahq_alpaca-mcp-server/src/alpaca_mcp_server/server.py` |
| Tool name | `get_option_latest_quote` -> `get_option_latest_quote` |
| Original location | `ai/alpacahq_alpaca-mcp-server_57ecdee_python/src/alpaca_mcp_server/server.py:2609` |
| Mutation location | `Rug Pulls Attacks/alpacahq_alpaca-mcp-server/src/alpaca_mcp_server/server.py:2638--2639` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `symbol_or_symbols` |
| Canary | `2dd15704b1` |

#### Original Source Context

Lines 2624--2636 from the reference file:

~~~python
            - Ask Price, Ask Size, Bid Price, Bid Size, Ask Exchange, Bid Exchange, Trade Conditions, Tape Information, Timestamp (in UTC)
    
    Note:
        This endpoint returns real-time market data. For contract specifications and static data,
        use get_option_contracts instead.
    """
    _ensure_clients()
    tool_name = "get_option_latest_quote"
    symbols_list = [symbol_or_symbols] if isinstance(symbol_or_symbols, str) else list(symbol_or_symbols)
    if not symbols_list:
        return build_error_result(tool_name, "missing_symbols", "No symbols provided.", field="symbol_or_symbols")
    try:
        request = OptionLatestQuoteRequest(symbol_or_symbols=symbol_or_symbols, feed=feed)
~~~

### MV-RP-d5ef8befef2c `alpacahq_alpaca-mcp-server` / `replace_order_by_id`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-d5ef8befef2c` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/ai/alpacahq_alpaca-mcp-server_57ecdee_python/src/alpaca_mcp_server/server.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/alpacahq_alpaca-mcp-server/src/alpaca_mcp_server/server.py` |
| Tool name | `replace_order_by_id` -> `replace_order_by_id` |
| Original location | `ai/alpacahq_alpaca-mcp-server_57ecdee_python/src/alpaca_mcp_server/server.py:3724` |
| Mutation location | `Rug Pulls Attacks/alpacahq_alpaca-mcp-server/src/alpaca_mcp_server/server.py:3759--3760` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `order_id` |
| Canary | `7fcd53d004` |

#### Original Source Context

Lines 3743--3755 from the reference file:

~~~python
        trail (Optional[float]): New trail value in price or percent (for trailing_stop orders only)
        client_order_id (Optional[str]): New client-assigned order identifier

    Returns:
        CallToolResult: Details of the replaced order in both human-readable and structured form.
    """
    _ensure_clients()
    tool_name = "replace_order_by_id"
    if all(v is None for v in [qty, time_in_force, limit_price, stop_price, trail, client_order_id]):
        return build_error_result(tool_name, "no_fields", "At least one field must be provided to replace an order.", details={"accepted_fields": ["qty", "time_in_force", "limit_price", "stop_price", "trail", "client_order_id"]})
    try:
        tif_enum = None
        if time_in_force:
~~~

### MV-RP-c0c3abc76500 `andybrandt_mcp-simple-openai-assistant` / `update_thread`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-c0c3abc76500` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/andybrandt_mcp-simple-openai-assistant_e8303ec_python/mcp_simple_openai_assistant/app.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/andybrandt_mcp-simple-openai-assistant/mcp_simple_openai_assistant/app.py` |
| Tool name | `update_thread` -> `update_thread` |
| Original location | `Other_Tools_and_Integrations/andybrandt_mcp-simple-openai-assistant_e8303ec_python/mcp_simple_openai_assistant/app.py:94` |
| Mutation location | `Rug Pulls Attacks/andybrandt_mcp-simple-openai-assistant/mcp_simple_openai_assistant/app.py:103--104` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `thread_id` |
| Canary | `323bf966b8` |

#### Original Source Context

Lines 97--109 from the reference file:

~~~python
    """
    Updates the name and/or description of a locally saved conversation thread.
    Both the local database and the OpenAI thread object will be updated.

    The thread ID can be retrieved from the list_threads tool.
    """
    if not manager:
        raise ToolError("AssistantManager not initialized.")
    if not name and not description:
        raise ToolError("You must provide either a new name or a new description.")
    try:
        await manager.update_thread(thread_id, name, description)
        return f"Successfully updated thread {thread_id}."
~~~

### MV-RP-cc79ac604777 `andybrandt_mcp-simple-openai-assistant` / `delete_thread`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-cc79ac604777` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/andybrandt_mcp-simple-openai-assistant_e8303ec_python/mcp_simple_openai_assistant/app.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/andybrandt_mcp-simple-openai-assistant/mcp_simple_openai_assistant/app.py` |
| Tool name | `delete_thread` -> `delete_thread` |
| Original location | `Other_Tools_and_Integrations/andybrandt_mcp-simple-openai-assistant_e8303ec_python/mcp_simple_openai_assistant/app.py:115` |
| Mutation location | `Rug Pulls Attacks/andybrandt_mcp-simple-openai-assistant/mcp_simple_openai_assistant/app.py:122--123` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `thread_id` |
| Canary | `320c0e2377` |

#### Original Source Context

Lines 114--126 from the reference file:

~~~python
@app.tool(annotations={"title": "Delete Managed Thread", "readOnlyHint": False})
async def delete_thread(thread_id: str) -> str:
    """
    Deletes a conversation thread from both OpenAI's servers and the local database.
    This action is irreversible.
    """
    if not manager:
        raise ToolError("AssistantManager not initialized.")
    try:
        result = await manager.delete_thread(thread_id)
        if result.deleted:
            return f"Successfully deleted thread {thread_id}."
        else:
~~~

### MV-RP-ec713f8b7f34 `andybrandt_mcp-simple-openai-assistant` / `ask_assistant_in_thread`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-ec713f8b7f34` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/andybrandt_mcp-simple-openai-assistant_e8303ec_python/mcp_simple_openai_assistant/app.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/andybrandt_mcp-simple-openai-assistant/mcp_simple_openai_assistant/app.py` |
| Tool name | `ask_assistant_in_thread` -> `ask_assistant_in_thread` |
| Original location | `Other_Tools_and_Integrations/andybrandt_mcp-simple-openai-assistant_e8303ec_python/mcp_simple_openai_assistant/app.py:138` |
| Mutation location | `Rug Pulls Attacks/andybrandt_mcp-simple-openai-assistant/mcp_simple_openai_assistant/app.py:152--153` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `thread_id` |
| Canary | `151eab3ee3` |

#### Original Source Context

Lines 142--154 from the reference file:

~~~python

    Use this to continue a conversation with an assistant in a specific thread.
    The thread ID can be retrieved from the list_threads tool.
    The assistant ID can be retrieved from the list_assistants tool.
    Threads are not inherently linked to a particular assistant, so you can use this tool to talk to any assistant in any thread.
    """
    if not manager:
        raise ToolError("AssistantManager not initialized.")

    final_message = ""
    try:
        await ctx.report_progress(progress=0, message="Starting assistant run...")
        async for event in manager.run_thread(thread_id, assistant_id, message):
~~~

### MV-RP-de5ef7a4127b `andybrandt_mcp-simple-openai-assistant` / `retrieve_assistant`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-de5ef7a4127b` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/andybrandt_mcp-simple-openai-assistant_e8303ec_python/mcp_simple_openai_assistant/app.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/andybrandt_mcp-simple-openai-assistant/mcp_simple_openai_assistant/app.py` |
| Tool name | `retrieve_assistant` -> `retrieve_assistant` |
| Original location | `Other_Tools_and_Integrations/andybrandt_mcp-simple-openai-assistant_e8303ec_python/mcp_simple_openai_assistant/app.py:206` |
| Mutation location | `Rug Pulls Attacks/andybrandt_mcp-simple-openai-assistant/mcp_simple_openai_assistant/app.py:215--216` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `assistant_id` |
| Canary | `ae099c51c0` |

#### Original Source Context

Lines 203--215 from the reference file:

~~~python
        "readOnlyHint": True
    }
)
async def retrieve_assistant(assistant_id: str) -> str:
    """Get detailed information about a specific assistant. 
       The ID required can be retrieved from the list_assistants tool."""
    if not manager:
        raise ToolError("AssistantManager not initialized.")
    try:
        result = await manager.retrieve_assistant(assistant_id)
        return dedent(f"""
        Assistant Details:
        ID: {result.id}
~~~

### MV-RP-ec65e5450659 `andybrandt_mcp-simple-openai-assistant` / `update_assistant`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-ec65e5450659` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/andybrandt_mcp-simple-openai-assistant_e8303ec_python/mcp_simple_openai_assistant/app.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/andybrandt_mcp-simple-openai-assistant/mcp_simple_openai_assistant/app.py` |
| Tool name | `update_assistant` -> `update_assistant` |
| Original location | `Other_Tools_and_Integrations/andybrandt_mcp-simple-openai-assistant_e8303ec_python/mcp_simple_openai_assistant/app.py:229` |
| Mutation location | `Rug Pulls Attacks/andybrandt_mcp-simple-openai-assistant/mcp_simple_openai_assistant/app.py:249--250` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `assistant_id` |
| Canary | `a22ea090d9` |

#### Original Source Context

Lines 235--247 from the reference file:

~~~python
    """
    Modify an existing assistant's name, instructions, or model used.
    
    At least one optional parameter - what to change - must be provided, otherwise the tool will return an error.
    The ID required can be retrieved from the list_assistants tool.
    """
    if not manager:
        raise ToolError("AssistantManager not initialized.")
    if not any([name, instructions, model]):
        raise ToolError("You must provide at least one field to update (name, instructions, or model).")
    try:
        result = await manager.update_assistant(assistant_id, name, instructions, model)
        return f"Successfully updated assistant '{result.name}' (ID: {result.id})."
~~~

### MV-RP-a747461677a8 `ashishroy077_mcp-kusto` / `execute_query`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-a747461677a8` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/math-solver/ashishroy077_mcp-kusto_d43b0f9_python/src/kusto_mcp/tools/query_tools.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/ashishroy077_mcp-kusto/src/kusto_mcp/tools/query_tools.py` |
| Tool name | `execute_query` -> `execute_query` |
| Original location | `math-solver/ashishroy077_mcp-kusto_d43b0f9_python/src/kusto_mcp/tools/query_tools.py:29` |
| Mutation location | `Rug Pulls Attacks/ashishroy077_mcp-kusto/src/kusto_mcp/tools/query_tools.py:40--41` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `query` |
| Canary | `7c6a50081d` |

#### Original Source Context

Lines 34--46 from the reference file:

~~~python
            query: The KQL query string to execute
            
        Returns:
            Formatted query results
        """
        # Get the connection manager - try from context state first, then create new instance
        kusto_manager = None
        
        try:
            if hasattr(ctx, "lifespan_context") and hasattr(ctx.lifespan_context, "kusto_manager"):
                kusto_manager = ctx.lifespan_context.kusto_manager
            elif hasattr(ctx, "get_state"):
                try:
~~~

### MV-RP-e731688260d9 `ashishroy077_mcp-kusto` / `analyze_data`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-e731688260d9` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/math-solver/ashishroy077_mcp-kusto_d43b0f9_python/src/kusto_mcp/tools/query_tools.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/ashishroy077_mcp-kusto/src/kusto_mcp/tools/query_tools.py` |
| Tool name | `analyze_data` -> `analyze_data` |
| Original location | `math-solver/ashishroy077_mcp-kusto_d43b0f9_python/src/kusto_mcp/tools/query_tools.py:120` |
| Mutation location | `Rug Pulls Attacks/ashishroy077_mcp-kusto/src/kusto_mcp/tools/query_tools.py:134--135` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `query` |
| Canary | `9fc10b66c0` |

#### Original Source Context

Lines 126--138 from the reference file:

~~~python
            analysis_type: Type of analysis to perform (summary, stats, or plot_ready)
            
        Returns:
            Analysis results
        """
        # Get the connection manager - try from context state first, then create new instance
        kusto_manager = None
        
        try:
            if hasattr(ctx, "lifespan_context") and hasattr(ctx.lifespan_context, "kusto_manager"):
                kusto_manager = ctx.lifespan_context.kusto_manager
            elif hasattr(ctx, "get_state"):
                try:
~~~

### MV-RP-735d5a755d2e `ashishroy077_mcp-kusto` / `optimize_query`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-735d5a755d2e` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/math-solver/ashishroy077_mcp-kusto_d43b0f9_python/src/kusto_mcp/tools/query_tools.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/ashishroy077_mcp-kusto/src/kusto_mcp/tools/query_tools.py` |
| Tool name | `optimize_query` -> `optimize_query` |
| Original location | `math-solver/ashishroy077_mcp-kusto_d43b0f9_python/src/kusto_mcp/tools/query_tools.py:270` |
| Mutation location | `Rug Pulls Attacks/ashishroy077_mcp-kusto/src/kusto_mcp/tools/query_tools.py:284--285` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `query` |
| Canary | `8f3f4feb98` |

#### Original Source Context

Lines 274--286 from the reference file:

~~~python
        Args:
            query: The KQL query string to analyze
            
        Returns:
            Suggestions for optimizing the query
        """
        if not query:
            return "❌ Query cannot be empty. Please provide a valid KQL query."
        
        # Check if the query already follows best practices
        is_optimal = (
            "where" in query.lower() and 
            "project" in query.lower() and 
~~~

### MV-RP-70196f0206b6 `cohnen-mcp-google-ads` / `execute_gaql_query`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-70196f0206b6` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/data-analysis/cohnen-mcp-google-ads_461a1d6_python/cohnen-mcp-google-ads-461a1d6/google_ads_server.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/cohnen-mcp-google-ads/cohnen-mcp-google-ads-461a1d6/google_ads_server.py` |
| Tool name | `execute_gaql_query` -> `execute_gaql_query` |
| Original location | `data-analysis/cohnen-mcp-google-ads_461a1d6_python/cohnen-mcp-google-ads-461a1d6/google_ads_server.py:285` |
| Mutation location | `Rug Pulls Attacks/cohnen-mcp-google-ads/cohnen-mcp-google-ads-461a1d6/google_ads_server.py:305--306` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `customer_id` |
| Canary | `f65dc9a28c` |

#### Original Source Context

Lines 299--311 from the reference file:

~~~python
        Formatted query results or error message
        
    Example:
        customer_id: "1234567890"
        query: "SELECT campaign.id, campaign.name FROM campaign LIMIT 10"
    """
    try:
        creds = get_credentials()
        headers = get_headers(creds)
        
        formatted_customer_id = format_customer_id(customer_id)
        url = f"https://googleads.googleapis.com/{API_VERSION}/customers/{formatted_customer_id}/googleAds:search"
        
~~~

### MV-RP-962530c179ad `cohnen-mcp-google-ads` / `get_campaign_performance`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-962530c179ad` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/data-analysis/cohnen-mcp-google-ads_461a1d6_python/cohnen-mcp-google-ads-461a1d6/google_ads_server.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/cohnen-mcp-google-ads/cohnen-mcp-google-ads-461a1d6/google_ads_server.py` |
| Tool name | `get_campaign_performance` -> `get_campaign_performance` |
| Original location | `data-analysis/cohnen-mcp-google-ads_461a1d6_python/cohnen-mcp-google-ads-461a1d6/google_ads_server.py:358` |
| Mutation location | `Rug Pulls Attacks/cohnen-mcp-google-ads/cohnen-mcp-google-ads-461a1d6/google_ads_server.py:387--388` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `customer_id` |
| Canary | `bed1d07697` |

#### Original Source Context

Lines 379--391 from the reference file:

~~~python
        (e.g., 1000000 = 1 USD in a USD account)
        
    Example:
        customer_id: "1234567890"
        days: 14
    """
    query = f"""
        SELECT
            campaign.id,
            campaign.name,
            campaign.status,
            metrics.impressions,
            metrics.clicks,
~~~

### MV-RP-891eda92b1aa `cohnen-mcp-google-ads` / `get_ad_performance`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-891eda92b1aa` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/data-analysis/cohnen-mcp-google-ads_461a1d6_python/cohnen-mcp-google-ads-461a1d6/google_ads_server.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/cohnen-mcp-google-ads/cohnen-mcp-google-ads-461a1d6/google_ads_server.py` |
| Tool name | `get_ad_performance` -> `get_ad_performance` |
| Original location | `data-analysis/cohnen-mcp-google-ads_461a1d6_python/cohnen-mcp-google-ads-461a1d6/google_ads_server.py:404` |
| Mutation location | `Rug Pulls Attacks/cohnen-mcp-google-ads/cohnen-mcp-google-ads-461a1d6/google_ads_server.py:435--436` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `customer_id` |
| Canary | `255ab700d8` |

#### Original Source Context

Lines 425--437 from the reference file:

~~~python
        (e.g., 1000000 = 1 USD in a USD account)
        
    Example:
        customer_id: "1234567890"
        days: 14
    """
    query = f"""
        SELECT
            ad_group_ad.ad.id,
            ad_group_ad.ad.name,
            ad_group_ad.status,
            campaign.name,
            ad_group.name,
~~~

### MV-RP-ee10f5a3076f `cohnen-mcp-google-ads` / `run_gaql`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-ee10f5a3076f` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/data-analysis/cohnen-mcp-google-ads_461a1d6_python/cohnen-mcp-google-ads-461a1d6/google_ads_server.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/cohnen-mcp-google-ads/cohnen-mcp-google-ads-461a1d6/google_ads_server.py` |
| Tool name | `run_gaql` -> `run_gaql` |
| Original location | `data-analysis/cohnen-mcp-google-ads_461a1d6_python/cohnen-mcp-google-ads-461a1d6/google_ads_server.py:451` |
| Mutation location | `Rug Pulls Attacks/cohnen-mcp-google-ads/cohnen-mcp-google-ads-461a1d6/google_ads_server.py:516--517` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `customer_id` |
| Canary | `def51a1050` |

#### Original Source Context

Lines 504--516 from the reference file:

~~~python
        WHERE segments.date DURING LAST_30_DAYS
        
            Note:
        Cost values are in micros (millionths) of the account currency
        (e.g., 1000000 = 1 USD in a USD account)
    """
    try:
        creds = get_credentials()
        headers = get_headers(creds)
        
        formatted_customer_id = format_customer_id(customer_id)
        url = f"https://googleads.googleapis.com/{API_VERSION}/customers/{formatted_customer_id}/googleAds:search"
        
~~~

### MV-RP-959f7b46bbc4 `cohnen-mcp-google-ads` / `get_ad_creatives`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-959f7b46bbc4` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/data-analysis/cohnen-mcp-google-ads_461a1d6_python/cohnen-mcp-google-ads-461a1d6/google_ads_server.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/cohnen-mcp-google-ads/cohnen-mcp-google-ads-461a1d6/google_ads_server.py` |
| Tool name | `get_ad_creatives` -> `get_ad_creatives` |
| Original location | `data-analysis/cohnen-mcp-google-ads_461a1d6_python/cohnen-mcp-google-ads-461a1d6/google_ads_server.py:608` |
| Mutation location | `Rug Pulls Attacks/cohnen-mcp-google-ads/cohnen-mcp-google-ads-461a1d6/google_ads_server.py:638--639` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `customer_id` |
| Canary | `ce93f1a0ab` |

#### Original Source Context

Lines 624--636 from the reference file:

~~~python
    Returns:
        Formatted list of ad creative details
        
    Example:
        customer_id: "1234567890"
    """
    query = """
        SELECT
            ad_group_ad.ad.id,
            ad_group_ad.ad.name,
            ad_group_ad.ad.type,
            ad_group_ad.ad.final_urls,
            ad_group_ad.status,
~~~

### MV-RP-e82d056c4918 `cohnen-mcp-google-ads` / `get_image_assets`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-e82d056c4918` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/data-analysis/cohnen-mcp-google-ads_461a1d6_python/cohnen-mcp-google-ads-461a1d6/google_ads_server.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/cohnen-mcp-google-ads/cohnen-mcp-google-ads-461a1d6/google_ads_server.py` |
| Tool name | `get_image_assets` -> `get_image_assets` |
| Original location | `data-analysis/cohnen-mcp-google-ads_461a1d6_python/cohnen-mcp-google-ads-461a1d6/google_ads_server.py:922` |
| Mutation location | `Rug Pulls Attacks/cohnen-mcp-google-ads/cohnen-mcp-google-ads-461a1d6/google_ads_server.py:957--958` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `customer_id` |
| Canary | `c54730b95e` |

#### Original Source Context

Lines 941--953 from the reference file:

~~~python
        Formatted list of image assets with their download URLs
        
    Example:
        customer_id: "1234567890"
        limit: 100
    """
    query = f"""
        SELECT
            asset.id,
            asset.name,
            asset.type,
            asset.image_asset.full_size.url,
            asset.image_asset.full_size.height_pixels,
~~~

### MV-RP-9354a95d0d03 `cohnen-mcp-google-ads` / `analyze_image_assets`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-9354a95d0d03` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/data-analysis/cohnen-mcp-google-ads_461a1d6_python/cohnen-mcp-google-ads-461a1d6/google_ads_server.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/cohnen-mcp-google-ads/cohnen-mcp-google-ads-461a1d6/google_ads_server.py` |
| Tool name | `analyze_image_assets` -> `analyze_image_assets` |
| Original location | `data-analysis/cohnen-mcp-google-ads_461a1d6_python/cohnen-mcp-google-ads-461a1d6/google_ads_server.py:1290` |
| Mutation location | `Rug Pulls Attacks/cohnen-mcp-google-ads/cohnen-mcp-google-ads-461a1d6/google_ads_server.py:1330--1331` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `customer_id` |
| Canary | `6ba098205f` |

#### Original Source Context

Lines 1312--1324 from the reference file:

~~~python
    Example:
        customer_id: "1234567890"
        days: 14
    """
    # Make sure to use a valid date range format
    # Valid formats are: LAST_7_DAYS, LAST_14_DAYS, LAST_30_DAYS, etc. (with underscores)
    if days == 7:
        date_range = "LAST_7_DAYS"
    elif days == 14:
        date_range = "LAST_14_DAYS"
    elif days == 30:
        date_range = "LAST_30_DAYS"
    else:
~~~

### MV-RP-5af7f36b2678 `cohnen-mcp-google-ads` / `list_resources`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-5af7f36b2678` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/data-analysis/cohnen-mcp-google-ads_461a1d6_python/cohnen-mcp-google-ads-461a1d6/google_ads_server.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/cohnen-mcp-google-ads/cohnen-mcp-google-ads-461a1d6/google_ads_server.py` |
| Tool name | `list_resources` -> `list_resources` |
| Original location | `data-analysis/cohnen-mcp-google-ads_461a1d6_python/cohnen-mcp-google-ads-461a1d6/google_ads_server.py:1444` |
| Mutation location | `Rug Pulls Attacks/cohnen-mcp-google-ads/cohnen-mcp-google-ads-461a1d6/google_ads_server.py:1472--1473` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `customer_id` |
| Canary | `b9ca26c0f6` |

#### Original Source Context

Lines 1452--1464 from the reference file:

~~~python
        
    Returns:
        Formatted list of valid resources
    """
    # Example query that lists some common resources
    # This might need to be adjusted based on what's available in your API version
    query = """
        SELECT
            google_ads_field.name,
            google_ads_field.category,
            google_ads_field.data_type
        FROM
            google_ads_field
~~~

### MV-RP-582d2c6b6af5 `coleam00-supabase-mcp` / `read_table_rows`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-582d2c6b6af5` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Cloud_Platforms/coleam00-supabase-mcp_fc4229e_python/coleam00-supabase-mcp-fc4229e/supabase_mcp/server.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/coleam00-supabase-mcp/coleam00-supabase-mcp-fc4229e/supabase_mcp/server.py` |
| Tool name | `read_table_rows` -> `read_table_rows` |
| Original location | `Cloud_Platforms/coleam00-supabase-mcp_fc4229e_python/coleam00-supabase-mcp-fc4229e/supabase_mcp/server.py:74` |
| Mutation location | `Rug Pulls Attacks/coleam00-supabase-mcp/coleam00-supabase-mcp-fc4229e/supabase_mcp/server.py:109--110` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `table_name` |
| Canary | `e0426ed142` |

#### Original Source Context

Lines 103--115 from the reference file:

~~~python
        To get all users: read_table_rows(table_name="users")
        To get specific columns: read_table_rows(table_name="users", columns="id,name,email")
        To filter rows: read_table_rows(table_name="users", filters={"is_active": True})
        To limit results: read_table_rows(table_name="users", limit=10)
        To order results: read_table_rows(table_name="users", order_by="created_at", ascending=False)
    """
    supabase = ctx.request_context.lifespan_context.client
    
    # Start building the query
    query = supabase.table(table_name).select(columns)
    
    # Apply filters if provided
    if filters:
~~~

### MV-RP-01a00f67015c `coleam00-supabase-mcp` / `create_table_records`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-01a00f67015c` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Cloud_Platforms/coleam00-supabase-mcp_fc4229e_python/coleam00-supabase-mcp-fc4229e/supabase_mcp/server.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/coleam00-supabase-mcp/coleam00-supabase-mcp-fc4229e/supabase_mcp/server.py` |
| Tool name | `create_table_records` -> `create_table_records` |
| Original location | `Cloud_Platforms/coleam00-supabase-mcp_fc4229e_python/coleam00-supabase-mcp-fc4229e/supabase_mcp/server.py:136` |
| Mutation location | `Rug Pulls Attacks/coleam00-supabase-mcp/coleam00-supabase-mcp-fc4229e/supabase_mcp/server.py:173--174` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `table_name` |
| Canary | `62796210fa` |

#### Original Source Context

Lines 165--177 from the reference file:

~~~python
                records=[
                    {"name": "John Doe", "email": "john@example.com"},
                    {"name": "Jane Smith", "email": "jane@example.com"}
                ]
            )
    """
    supabase = ctx.request_context.lifespan_context.client
    
    # Insert the records
    response = supabase.table(table_name).insert(records).execute()
    
    # Return the response
    return {
~~~

### MV-RP-d359d4de57b2 `coleam00-supabase-mcp` / `update_table_records`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-d359d4de57b2` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Cloud_Platforms/coleam00-supabase-mcp_fc4229e_python/coleam00-supabase-mcp-fc4229e/supabase_mcp/server.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/coleam00-supabase-mcp/coleam00-supabase-mcp-fc4229e/supabase_mcp/server.py` |
| Tool name | `update_table_records` -> `update_table_records` |
| Original location | `Cloud_Platforms/coleam00-supabase-mcp_fc4229e_python/coleam00-supabase-mcp-fc4229e/supabase_mcp/server.py:185` |
| Mutation location | `Rug Pulls Attacks/coleam00-supabase-mcp/coleam00-supabase-mcp-fc4229e/supabase_mcp/server.py:218--219` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `table_name` |
| Canary | `9b95b49012` |

#### Original Source Context

Lines 208--220 from the reference file:

~~~python
            update_table_records(
                table_name="users",
                updates={"status": "premium"},
                filters={"is_active": True}
            )
    """
    supabase = ctx.request_context.lifespan_context.client
    
    # Start building the query
    query = supabase.table(table_name).update(updates)
    
    # Apply filters
    for column, value in filters.items():
~~~

### MV-RP-a482cac8e5de `coleam00-supabase-mcp` / `delete_table_records`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-a482cac8e5de` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Cloud_Platforms/coleam00-supabase-mcp_fc4229e_python/coleam00-supabase-mcp-fc4229e/supabase_mcp/server.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/coleam00-supabase-mcp/coleam00-supabase-mcp-fc4229e/supabase_mcp/server.py` |
| Tool name | `delete_table_records` -> `delete_table_records` |
| Original location | `Cloud_Platforms/coleam00-supabase-mcp_fc4229e_python/coleam00-supabase-mcp-fc4229e/supabase_mcp/server.py:235` |
| Mutation location | `Rug Pulls Attacks/coleam00-supabase-mcp/coleam00-supabase-mcp-fc4229e/supabase_mcp/server.py:267--268` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `table_name` |
| Canary | `9d689ab15c` |

#### Original Source Context

Lines 255--267 from the reference file:

~~~python
        To delete inactive users:
            delete_table_records(
                table_name="users",
                filters={"is_active": False}
            )
    """
    supabase = ctx.request_context.lifespan_context.client
    
    # Start building the query
    query = supabase.table(table_name).delete()
    
    # Apply filters
    for column, value in filters.items():
~~~

### MV-RP-c618e9d42f4d `crystaldba-postgres-mcp` / `list_objects`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-c618e9d42f4d` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/databases/crystaldba-postgres-mcp_15c8e33_python/crystaldba-postgres-mcp-15c8e33/src/postgres_mcp/server.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/crystaldba-postgres-mcp/crystaldba-postgres-mcp-15c8e33/src/postgres_mcp/server.py` |
| Tool name | `list_objects` -> `list_objects` |
| Original location | `databases/crystaldba-postgres-mcp_15c8e33_python/crystaldba-postgres-mcp-15c8e33/src/postgres_mcp/server.py:123` |
| Mutation location | `Rug Pulls Attacks/crystaldba-postgres-mcp/crystaldba-postgres-mcp-15c8e33/src/postgres_mcp/server.py:128--129` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `schema_name` |
| Canary | `a5be0a299a` |

#### Original Source Context

Lines 122--134 from the reference file:

~~~python
)
async def list_objects(
    schema_name: str = Field(description="Schema name"),
    object_type: str = Field(description="Object type: 'table', 'view', 'sequence', or 'extension'", default="table"),
) -> ResponseType:
    """List objects of a given type in a schema."""
    try:
        sql_driver = await get_sql_driver()

        if object_type in ("table", "view"):
            table_type = "BASE TABLE" if object_type == "table" else "VIEW"
            rows = await SafeSqlDriver.execute_param_query(
                sql_driver,
~~~

### MV-RP-f8d5071c6d7d `crystaldba-postgres-mcp` / `get_object_details`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-f8d5071c6d7d` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/databases/crystaldba-postgres-mcp_15c8e33_python/crystaldba-postgres-mcp-15c8e33/src/postgres_mcp/server.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/crystaldba-postgres-mcp/crystaldba-postgres-mcp-15c8e33/src/postgres_mcp/server.py` |
| Tool name | `get_object_details` -> `get_object_details` |
| Original location | `databases/crystaldba-postgres-mcp_15c8e33_python/crystaldba-postgres-mcp-15c8e33/src/postgres_mcp/server.py:197` |
| Mutation location | `Rug Pulls Attacks/crystaldba-postgres-mcp/crystaldba-postgres-mcp-15c8e33/src/postgres_mcp/server.py:205--206` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `schema_name` |
| Canary | `84be2f20ca` |

#### Original Source Context

Lines 197--209 from the reference file:

~~~python
async def get_object_details(
    schema_name: str = Field(description="Schema name"),
    object_name: str = Field(description="Object name"),
    object_type: str = Field(description="Object type: 'table', 'view', 'sequence', or 'extension'", default="table"),
) -> ResponseType:
    """Get detailed information about a database object."""
    try:
        sql_driver = await get_sql_driver()

        if object_type in ("table", "view"):
            # Get columns
            col_rows = await SafeSqlDriver.execute_param_query(
                sql_driver,
~~~

### MV-RP-10a71d6c9d12 `crystaldba-postgres-mcp` / `explain_query`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-10a71d6c9d12` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/databases/crystaldba-postgres-mcp_15c8e33_python/crystaldba-postgres-mcp-15c8e33/src/postgres_mcp/server.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/crystaldba-postgres-mcp/crystaldba-postgres-mcp-15c8e33/src/postgres_mcp/server.py` |
| Tool name | `explain_query` -> `explain_query` |
| Original location | `databases/crystaldba-postgres-mcp_15c8e33_python/crystaldba-postgres-mcp-15c8e33/src/postgres_mcp/server.py:336` |
| Mutation location | `Rug Pulls Attacks/crystaldba-postgres-mcp/crystaldba-postgres-mcp-15c8e33/src/postgres_mcp/server.py:369--370` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `sql` |
| Canary | `fe0243df97` |

#### Original Source Context

Lines 359--371 from the reference file:

~~~python

    Args:
        sql: The SQL query to explain
        analyze: When True, actually runs the query for real statistics
        hypothetical_indexes: Optional list of indexes to simulate
    """
    try:
        sql_driver = await get_sql_driver()
        explain_tool = ExplainPlanTool(sql_driver=sql_driver)
        result: ExplainPlanArtifact | ErrorResult | None = None

        # If hypothetical indexes are specified, check for HypoPG extension
        if hypothetical_indexes and len(hypothetical_indexes) > 0:
~~~

### MV-RP-1af113eed9a4 `crystaldba-postgres-mcp` / `analyze_workload_indexes`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-1af113eed9a4` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/databases/crystaldba-postgres-mcp_15c8e33_python/crystaldba-postgres-mcp-15c8e33/src/postgres_mcp/server.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/crystaldba-postgres-mcp/crystaldba-postgres-mcp-15c8e33/src/postgres_mcp/server.py` |
| Tool name | `analyze_workload_indexes` -> `analyze_workload_indexes` |
| Original location | `databases/crystaldba-postgres-mcp_15c8e33_python/crystaldba-postgres-mcp-15c8e33/src/postgres_mcp/server.py:438` |
| Mutation location | `Rug Pulls Attacks/crystaldba-postgres-mcp/crystaldba-postgres-mcp-15c8e33/src/postgres_mcp/server.py:449--450` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `max_index_size_mb` |
| Canary | `74ba432a42` |

#### Original Source Context

Lines 437--449 from the reference file:

~~~python
@validate_call
async def analyze_workload_indexes(
    max_index_size_mb: int = Field(description="Max index size in MB", default=10000),
    method: Literal["dta", "llm"] = Field(description="Method to use for analysis", default="dta"),
) -> ResponseType:
    """Analyze frequently executed queries in the database and recommend optimal indexes."""
    try:
        sql_driver = await get_sql_driver()
        if method == "dta":
            index_tuning = DatabaseTuningAdvisor(sql_driver)
        else:
            index_tuning = LLMOptimizerTool(sql_driver)
        dta_tool = TextPresentation(sql_driver, index_tuning)
~~~

### MV-RP-f10aa3f402f7 `crystaldba-postgres-mcp` / `analyze_query_indexes`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-f10aa3f402f7` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/databases/crystaldba-postgres-mcp_15c8e33_python/crystaldba-postgres-mcp-15c8e33/src/postgres_mcp/server.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/crystaldba-postgres-mcp/crystaldba-postgres-mcp-15c8e33/src/postgres_mcp/server.py` |
| Tool name | `analyze_query_indexes` -> `analyze_query_indexes` |
| Original location | `databases/crystaldba-postgres-mcp_15c8e33_python/crystaldba-postgres-mcp-15c8e33/src/postgres_mcp/server.py:465` |
| Mutation location | `Rug Pulls Attacks/crystaldba-postgres-mcp/crystaldba-postgres-mcp-15c8e33/src/postgres_mcp/server.py:479--480` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `queries` |
| Canary | `47efbebc96` |

#### Original Source Context

Lines 465--477 from the reference file:

~~~python
async def analyze_query_indexes(
    queries: list[str] = Field(description="List of Query strings to analyze"),
    max_index_size_mb: int = Field(description="Max index size in MB", default=10000),
    method: Literal["dta", "llm"] = Field(description="Method to use for analysis", default="dta"),
) -> ResponseType:
    """Analyze a list of SQL queries and recommend optimal indexes."""
    if len(queries) == 0:
        return format_error_response("Please provide a non-empty list of queries to analyze.")
    if len(queries) > MAX_NUM_INDEX_TUNING_QUERIES:
        return format_error_response(f"Please provide a list of up to {MAX_NUM_INDEX_TUNING_QUERIES} queries to analyze.")

    try:
        sql_driver = await get_sql_driver()
~~~

### MV-RP-8b184a6a6720 `crystaldba-postgres-mcp` / `get_top_queries`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-8b184a6a6720` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/databases/crystaldba-postgres-mcp_15c8e33_python/crystaldba-postgres-mcp-15c8e33/src/postgres_mcp/server.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/crystaldba-postgres-mcp/crystaldba-postgres-mcp-15c8e33/src/postgres_mcp/server.py` |
| Tool name | `get_top_queries` -> `get_top_queries` |
| Original location | `databases/crystaldba-postgres-mcp_15c8e33_python/crystaldba-postgres-mcp-15c8e33/src/postgres_mcp/server.py:531` |
| Mutation location | `Rug Pulls Attacks/crystaldba-postgres-mcp/crystaldba-postgres-mcp-15c8e33/src/postgres_mcp/server.py:549--550` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `sort_by` |
| Canary | `8e64ddef8b` |

#### Original Source Context

Lines 533--545 from the reference file:

~~~python
        description="Ranking criteria: 'total_time' for total execution time or 'mean_time' for mean execution time per call, or 'resources' "
        "for resource-intensive queries",
        default="resources",
    ),
    limit: int = Field(description="Number of queries to return when ranking based on mean_time or total_time", default=10),
) -> ResponseType:
    try:
        sql_driver = await get_sql_driver()
        top_queries_tool = TopQueriesCalc(sql_driver=sql_driver)

        if sort_by == "resources":
            result = await top_queries_tool.get_top_resource_queries()
            return format_text_response(result)
~~~

### MV-RP-d59454793ccf `danielmeppiel-mcp-db-context` / `get_tables_schema`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-d59454793ccf` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/databases/danielmeppiel-mcp-db-context_37ce2ea_python/danielmeppiel-oracle-mcp-server-37ce2ea/main.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/danielmeppiel-mcp-db-context/danielmeppiel-oracle-mcp-server-37ce2ea/main.py` |
| Tool name | `get_tables_schema` -> `get_tables_schema` |
| Original location | `databases/danielmeppiel-mcp-db-context_37ce2ea_python/danielmeppiel-oracle-mcp-server-37ce2ea/main.py:100` |
| Mutation location | `Rug Pulls Attacks/danielmeppiel-mcp-db-context/danielmeppiel-oracle-mcp-server-37ce2ea/main.py:107--108` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `table_names` |
| Canary | `99ef972080` |

#### Original Source Context

Lines 101--113 from the reference file:

~~~python
    """Batch version of get_table_schema for a small explicit list.

    Use: You already have a short candidate set (< ~25) and need detail.
    Compose: Combine results with constraints / indexes per table if deeper profiling needed.
    Avoid: Broad discovery (use search_tables_schema first).
    """
    db_context: DatabaseContext = ctx.request_context.lifespan_context
    results = []
    
    for table_name in table_names:
        table_info = await db_context.get_schema_info(table_name)
        if not table_info:
            results.append(f"\nTable '{table_name}' not found in the schema.")
~~~

### MV-RP-73736ff0d71f `danielmeppiel-mcp-db-context` / `get_object_source`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-73736ff0d71f` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/databases/danielmeppiel-mcp-db-context_37ce2ea_python/danielmeppiel-oracle-mcp-server-37ce2ea/main.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/danielmeppiel-mcp-db-context/danielmeppiel-oracle-mcp-server-37ce2ea/main.py` |
| Tool name | `get_object_source` -> `get_object_source` |
| Original location | `databases/danielmeppiel-mcp-db-context_37ce2ea_python/danielmeppiel-oracle-mcp-server-37ce2ea/main.py:269` |
| Mutation location | `Rug Pulls Attacks/danielmeppiel-mcp-db-context/danielmeppiel-oracle-mcp-server-37ce2ea/main.py:278--279` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `object_type` |
| Canary | `12ea661055` |

#### Original Source Context

Lines 270--282 from the reference file:

~~~python
    """Retrieve full DDL/source text for a single PL/SQL object.

    Use: Deep dive / debugging after identifying object via get_pl_sql_objects.
    Compose: Pair with dependency info for refactor planning.
    Avoid: Bulk enumeration (fetch only what you need).
    """
    db_context: DatabaseContext = ctx.request_context.lifespan_context
    
    try:
        source = await db_context.get_object_source(object_type.upper(), object_name.upper())
        
        if not source:
            return wrap_untrusted(f"No source found for {object_type} {object_name}")
~~~

### MV-RP-dfe260f737d6 `danielmeppiel-mcp-db-context` / `get_table_indexes`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-dfe260f737d6` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/databases/danielmeppiel-mcp-db-context_37ce2ea_python/danielmeppiel-oracle-mcp-server-37ce2ea/main.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/danielmeppiel-mcp-db-context/danielmeppiel-oracle-mcp-server-37ce2ea/main.py` |
| Tool name | `get_table_indexes` -> `get_table_indexes` |
| Original location | `databases/danielmeppiel-mcp-db-context_37ce2ea_python/danielmeppiel-oracle-mcp-server-37ce2ea/main.py:327` |
| Mutation location | `Rug Pulls Attacks/danielmeppiel-mcp-db-context/danielmeppiel-oracle-mcp-server-37ce2ea/main.py:338--339` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `table_name` |
| Canary | `ca243c8af5` |

#### Original Source Context

Lines 328--340 from the reference file:

~~~python
    """Enumerate indexes (name, columns, uniqueness, status) for a table.

    Use: Performance hints + structural importance (index density, unique keys).
    Compose: With get_table_constraints (PK/UK) + get_dependent_objects.
    Avoid: Calling just to re-learn column order (columns via get_table_schema).
    """
    db_context: DatabaseContext = ctx.request_context.lifespan_context
    
    try:
        indexes = await db_context.get_table_indexes(table_name)
        
        if not indexes:
            return f"No indexes found for table '{table_name}'"
~~~

### MV-RP-f1c2e8f5e50a `danielmeppiel-mcp-db-context` / `run_sql_query`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-f1c2e8f5e50a` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/databases/danielmeppiel-mcp-db-context_37ce2ea_python/danielmeppiel-oracle-mcp-server-37ce2ea/main.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/danielmeppiel-mcp-db-context/danielmeppiel-oracle-mcp-server-37ce2ea/main.py` |
| Tool name | `run_sql_query` -> `run_sql_query` |
| Original location | `databases/danielmeppiel-mcp-db-context_37ce2ea_python/danielmeppiel-oracle-mcp-server-37ce2ea/main.py:453` |
| Mutation location | `Rug Pulls Attacks/danielmeppiel-mcp-db-context/danielmeppiel-oracle-mcp-server-37ce2ea/main.py:466--467` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `sql` |
| Canary | `29995b740e` |

#### Original Source Context

Lines 454--466 from the reference file:

~~~python
    """Generic read-only SELECT executor (formatted output).

    Use: Ad hoc data inspection or metrics not exposed by other tools.
    Compose: Supplement structured metadata tools (e.g. row counts) sparingly.
    Avoid: Rebuilding metadata graphs already available via dedicated tools.
    """
    db_context: DatabaseContext = ctx.request_context.lifespan_context
    
    try:
        result = await db_context.run_sql_query(sql, max_rows=max_rows)
        if not result.get("rows"):
            # Write or empty read response
            if "message" in result:
~~~

### MV-RP-bad483f027f0 `danielmeppiel-mcp-db-context` / `explain_query_plan`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-bad483f027f0` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/databases/danielmeppiel-mcp-db-context_37ce2ea_python/danielmeppiel-oracle-mcp-server-37ce2ea/main.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/danielmeppiel-mcp-db-context/danielmeppiel-oracle-mcp-server-37ce2ea/main.py` |
| Tool name | `explain_query_plan` -> `explain_query_plan` |
| Original location | `databases/danielmeppiel-mcp-db-context_37ce2ea_python/danielmeppiel-oracle-mcp-server-37ce2ea/main.py:479` |
| Mutation location | `Rug Pulls Attacks/danielmeppiel-mcp-db-context/danielmeppiel-oracle-mcp-server-37ce2ea/main.py:497--498` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `sql` |
| Canary | `deca37ca2b` |

#### Original Source Context

Lines 483--495 from the reference file:

~~~python
    cleanup (DELETE) statements; on locked-down or strictly read-only accounts
    this may fail. If so, a structured error is returned instead of a plan.

    Use: Pre-flight cost / access path inspection before running large queries.
    Avoid: High frequency calls in loops.
    """
    db_context: DatabaseContext = ctx.request_context.lifespan_context
    try:
        plan = await db_context.explain_query_plan(sql)
        # Standardize error wrapping
        if plan.get("error"):
            return wrap_untrusted(f"Explain plan unavailable: {plan['error']}")
        if not plan.get("execution_plan"):
~~~

### MV-RP-964ea485c977 `fosdickio-binary_ninja_mcp` / `get_il`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-964ea485c977` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/fosdickio-binary_ninja_mcp_8c5134e_python/fosdickio-binary_ninja_mcp-8c5134e/bridge/binja_mcp_bridge.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/fosdickio-binary_ninja_mcp/fosdickio-binary_ninja_mcp-8c5134e/bridge/binja_mcp_bridge.py` |
| Tool name | `get_il` -> `get_il` |
| Original location | `Other_Tools_and_Integrations/fosdickio-binary_ninja_mcp_8c5134e_python/fosdickio-binary_ninja_mcp-8c5134e/bridge/binja_mcp_bridge.py:345` |
| Mutation location | `Rug Pulls Attacks/fosdickio-binary_ninja_mcp/fosdickio-binary_ninja_mcp-8c5134e/bridge/binja_mcp_bridge.py:351--352` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `name_or_address` |
| Canary | `f910c883d9` |

#### Original Source Context

Lines 345--357 from the reference file:

~~~python
def get_il(name_or_address: str, view: str = "hlil", ssa: bool = False) -> str:
    """
    Get IL for a function in the selected view.
    - view: one of hlil, mlil, llil
    - ssa: set True to request SSA form (MLIL/LLIL only)
    """
    file_line = f"File: {_active_filename()}\n\n"
    ident = (name_or_address or "").strip()
    params = {"view": view, "ssa": int(bool(ssa))}
    if ident.lower().startswith("0x") or ident.isdigit():
        params["address"] = ident
    else:
        params["name"] = ident
~~~

### MV-RP-025c89ff1d18 `fosdickio-binary_ninja_mcp` / `fetch_disassembly`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-025c89ff1d18` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/fosdickio-binary_ninja_mcp_8c5134e_python/fosdickio-binary_ninja_mcp-8c5134e/bridge/binja_mcp_bridge.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/fosdickio-binary_ninja_mcp/fosdickio-binary_ninja_mcp-8c5134e/bridge/binja_mcp_bridge.py` |
| Tool name | `fetch_disassembly` -> `fetch_disassembly` |
| Original location | `Other_Tools_and_Integrations/fosdickio-binary_ninja_mcp_8c5134e_python/fosdickio-binary_ninja_mcp-8c5134e/bridge/binja_mcp_bridge.py:371` |
| Mutation location | `Rug Pulls Attacks/fosdickio-binary_ninja_mcp/fosdickio-binary_ninja_mcp-8c5134e/bridge/binja_mcp_bridge.py:377--378` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `name` |
| Canary | `291bed9d58` |

#### Original Source Context

Lines 369--381 from the reference file:

~~~python

@mcp.tool()
def fetch_disassembly(name: str) -> str:
    """
    Retrive the disassembled code of a function with a given name as assemby mnemonic instructions.
    """
    file_line = f"File: {_active_filename()}\n\n"
    data = get_json("assembly", {"name": name}, timeout=None)
    if not data:
        return file_line + "Error: no response"
    if "assembly" in data:
        return file_line + data["assembly"]
    if "error" in data:
~~~

### MV-RP-26915e2db15a `fosdickio-binary_ninja_mcp` / `list_strings_filter`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-26915e2db15a` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/fosdickio-binary_ninja_mcp_8c5134e_python/fosdickio-binary_ninja_mcp-8c5134e/bridge/binja_mcp_bridge.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/fosdickio-binary_ninja_mcp/fosdickio-binary_ninja_mcp-8c5134e/bridge/binja_mcp_bridge.py` |
| Tool name | `list_strings_filter` -> `list_strings_filter` |
| Original location | `Other_Tools_and_Integrations/fosdickio-binary_ninja_mcp_8c5134e_python/fosdickio-binary_ninja_mcp-8c5134e/bridge/binja_mcp_bridge.py:488` |
| Mutation location | `Rug Pulls Attacks/fosdickio-binary_ninja_mcp/fosdickio-binary_ninja_mcp-8c5134e/bridge/binja_mcp_bridge.py:496--497` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `offset` |
| Canary | `a71443eb98` |

#### Original Source Context

Lines 486--498 from the reference file:

~~~python

@mcp.tool()
def list_strings_filter(offset: int = 0, count: int = 100, filter: str = "") -> list:
    """
    List matching strings in the database (paginated, filtered).
    """
    return safe_get(
        "strings/filter",
        {"offset": offset, "limit": count, "filter": filter},
        timeout=None,
    )


~~~

### MV-RP-a7b7f9166bba `fosdickio-binary_ninja_mcp` / `list_namespaces`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-a7b7f9166bba` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/fosdickio-binary_ninja_mcp_8c5134e_python/fosdickio-binary_ninja_mcp-8c5134e/bridge/binja_mcp_bridge.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/fosdickio-binary_ninja_mcp/fosdickio-binary_ninja_mcp-8c5134e/bridge/binja_mcp_bridge.py` |
| Tool name | `list_namespaces` -> `list_namespaces` |
| Original location | `Other_Tools_and_Integrations/fosdickio-binary_ninja_mcp_8c5134e_python/fosdickio-binary_ninja_mcp-8c5134e/bridge/binja_mcp_bridge.py:569` |
| Mutation location | `Rug Pulls Attacks/fosdickio-binary_ninja_mcp/fosdickio-binary_ninja_mcp-8c5134e/bridge/binja_mcp_bridge.py:579--580` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `offset` |
| Canary | `de9667eae4` |

#### Original Source Context

Lines 567--579 from the reference file:

~~~python

@mcp.tool()
def list_namespaces(offset: int = 0, limit: int = 100) -> list:
    """
    List all non-global namespaces in the program with pagination.
    """
    return safe_get("namespaces", {"offset": offset, "limit": limit})


@mcp.tool()
def list_data_items(offset: int = 0, limit: int = 100) -> list:
    """
    List defined data labels and their values with pagination.
~~~

### MV-RP-b801a1c8c55d `fosdickio-binary_ninja_mcp` / `list_data_items`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-b801a1c8c55d` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/fosdickio-binary_ninja_mcp_8c5134e_python/fosdickio-binary_ninja_mcp-8c5134e/bridge/binja_mcp_bridge.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/fosdickio-binary_ninja_mcp/fosdickio-binary_ninja_mcp-8c5134e/bridge/binja_mcp_bridge.py` |
| Tool name | `list_data_items` -> `list_data_items` |
| Original location | `Other_Tools_and_Integrations/fosdickio-binary_ninja_mcp_8c5134e_python/fosdickio-binary_ninja_mcp-8c5134e/bridge/binja_mcp_bridge.py:577` |
| Mutation location | `Rug Pulls Attacks/fosdickio-binary_ninja_mcp/fosdickio-binary_ninja_mcp-8c5134e/bridge/binja_mcp_bridge.py:589--590` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `offset` |
| Canary | `cfa64634c9` |

#### Original Source Context

Lines 575--587 from the reference file:

~~~python

@mcp.tool()
def list_data_items(offset: int = 0, limit: int = 100) -> list:
    """
    List defined data labels and their values with pagination.
    """
    return safe_get("data", {"offset": offset, "limit": limit})


@mcp.tool()
def search_functions_by_name(query: str, offset: int = 0, limit: int = 100) -> list:
    """
    Search for functions whose name contains the given substring.
~~~

### MV-RP-0f90fe82ecdb `fosdickio-binary_ninja_mcp` / `get_xrefs_to_type`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-0f90fe82ecdb` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/fosdickio-binary_ninja_mcp_8c5134e_python/fosdickio-binary_ninja_mcp-8c5134e/bridge/binja_mcp_bridge.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/fosdickio-binary_ninja_mcp/fosdickio-binary_ninja_mcp-8c5134e/bridge/binja_mcp_bridge.py` |
| Tool name | `get_xrefs_to_type` -> `get_xrefs_to_type` |
| Original location | `Other_Tools_and_Integrations/fosdickio-binary_ninja_mcp_8c5134e_python/fosdickio-binary_ninja_mcp-8c5134e/bridge/binja_mcp_bridge.py:720` |
| Mutation location | `Rug Pulls Attacks/fosdickio-binary_ninja_mcp/fosdickio-binary_ninja_mcp-8c5134e/bridge/binja_mcp_bridge.py:735--736` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `type_name` |
| Canary | `a42ef4a58b` |

#### Original Source Context

Lines 719--731 from the reference file:

~~~python
@mcp.tool()
def get_xrefs_to_type(type_name: str) -> list:
    """
    Get xrefs/usages related to a struct or type name.
    Includes global instances, code refs to those, HLIL matches, and functions whose signature mentions the type.
    """
    return safe_get("getXrefsToType", {"name": type_name})


@mcp.tool()
def get_xrefs_to_enum(enum_name: str) -> list:
    """
    Get usages/xrefs of an enum by scanning for member values and matches.
~~~

### MV-RP-edcd1674185e `jordan-gibbs-hyperresearch` / `search_notes`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-edcd1674185e` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/ai/jordan-gibbs-hyperresearch_9c16854_python/jordan-gibbs-hyperresearch-9c16854/src/hyperresearch/mcp/server.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/jordan-gibbs-hyperresearch/jordan-gibbs-hyperresearch-9c16854/src/hyperresearch/mcp/server.py` |
| Tool name | `search_notes` -> `search_notes` |
| Original location | `ai/jordan-gibbs-hyperresearch_9c16854_python/jordan-gibbs-hyperresearch-9c16854/src/hyperresearch/mcp/server.py:33` |
| Mutation location | `Rug Pulls Attacks/jordan-gibbs-hyperresearch/jordan-gibbs-hyperresearch-9c16854/src/hyperresearch/mcp/server.py:52--53` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `query` |
| Canary | `64b50c5b3b` |

#### Original Source Context

Lines 46--58 from the reference file:

~~~python
        oa_version: Retrieved text version: submittedVersion, acceptedVersion, publishedVersion
        tag: Filter by tag (comma-separated for multiple, AND logic)
        status: Filter by status (draft, review, evergreen, stale, deprecated, archive)
        parent: Filter by parent topic (e.g. "ml/deep-learning")
        limit: Max results to return (default 10)
    """
    vault = _get_vault()
    vault.auto_sync()
    from hyperresearch.search.filters import SearchFilters
    from hyperresearch.search.fts import SearchQueryError, search_fts
    tags = [t.strip() for t in tag.split(",") if t.strip()] or None
    try:
        filters = SearchFilters(
~~~

### MV-RP-1e428600cc60 `jordan-gibbs-hyperresearch` / `read_many`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-1e428600cc60` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/ai/jordan-gibbs-hyperresearch_9c16854_python/jordan-gibbs-hyperresearch-9c16854/src/hyperresearch/mcp/server.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/jordan-gibbs-hyperresearch/jordan-gibbs-hyperresearch-9c16854/src/hyperresearch/mcp/server.py` |
| Tool name | `read_many` -> `read_many` |
| Original location | `ai/jordan-gibbs-hyperresearch_9c16854_python/jordan-gibbs-hyperresearch-9c16854/src/hyperresearch/mcp/server.py:111` |
| Mutation location | `Rug Pulls Attacks/jordan-gibbs-hyperresearch/jordan-gibbs-hyperresearch-9c16854/src/hyperresearch/mcp/server.py:119--120` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `note_ids` |
| Canary | `a08ac70628` |

#### Original Source Context

Lines 111--123 from the reference file:

~~~python
def read_many(note_ids: str) -> str:
    """Read multiple notes at once. Pass comma-separated IDs.

    Args:
        note_ids: Comma-separated note IDs (e.g. "auth-flow,session-mgmt,jwt-tokens")
    """
    vault = _get_vault()
    vault.auto_sync()
    ids = [nid.strip() for nid in note_ids.split(",") if nid.strip()]
    notes, not_found = [], []
    for nid in ids:
        row = vault.db.execute(
            "SELECT n.*, nc.body FROM notes n JOIN note_content nc ON n.id = nc.note_id WHERE n.id = ?", (nid,)
~~~

### MV-RP-3bbcca9f4576 `jordan-gibbs-hyperresearch` / `get_backlinks`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-3bbcca9f4576` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/ai/jordan-gibbs-hyperresearch_9c16854_python/jordan-gibbs-hyperresearch-9c16854/src/hyperresearch/mcp/server.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/jordan-gibbs-hyperresearch/jordan-gibbs-hyperresearch-9c16854/src/hyperresearch/mcp/server.py` |
| Tool name | `get_backlinks` -> `get_backlinks` |
| Original location | `ai/jordan-gibbs-hyperresearch_9c16854_python/jordan-gibbs-hyperresearch-9c16854/src/hyperresearch/mcp/server.py:174` |
| Mutation location | `Rug Pulls Attacks/jordan-gibbs-hyperresearch/jordan-gibbs-hyperresearch-9c16854/src/hyperresearch/mcp/server.py:184--185` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `note_id` |
| Canary | `e32120f0d2` |

#### Original Source Context

Lines 174--186 from the reference file:

~~~python
def get_backlinks(note_id: str) -> str:
    """Get all notes that link TO a given note.

    Args:
        note_id: The target note ID
    """
    vault = _get_vault()
    vault.auto_sync()
    rows = vault.db.execute(
        "SELECT l.source_id, n.title, l.line_number, l.context "
        "FROM links l JOIN notes n ON l.source_id = n.id WHERE l.target_id = ? ORDER BY n.title",
        (note_id,),
    ).fetchall()
~~~

### MV-RP-594e3114a4ba `jordan-gibbs-hyperresearch` / `get_hubs`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-594e3114a4ba` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/ai/jordan-gibbs-hyperresearch_9c16854_python/jordan-gibbs-hyperresearch-9c16854/src/hyperresearch/mcp/server.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/jordan-gibbs-hyperresearch/jordan-gibbs-hyperresearch-9c16854/src/hyperresearch/mcp/server.py` |
| Tool name | `get_hubs` -> `get_hubs` |
| Original location | `ai/jordan-gibbs-hyperresearch_9c16854_python/jordan-gibbs-hyperresearch-9c16854/src/hyperresearch/mcp/server.py:193` |
| Mutation location | `Rug Pulls Attacks/jordan-gibbs-hyperresearch/jordan-gibbs-hyperresearch-9c16854/src/hyperresearch/mcp/server.py:205--206` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `limit` |
| Canary | `53659c0838` |

#### Original Source Context

Lines 193--205 from the reference file:

~~~python
def get_hubs(limit: int = 20) -> str:
    """Get the most-linked-to notes in the research base (hub notes).

    Args:
        limit: Max results (default 20)
    """
    vault = _get_vault()
    vault.auto_sync()
    rows = vault.db.execute(
        "SELECT l.target_id as id, n.title, COUNT(*) as inbound "
        "FROM links l JOIN notes n ON l.target_id = n.id "
        "WHERE l.target_id IS NOT NULL GROUP BY l.target_id ORDER BY inbound DESC LIMIT ?",
        (limit,),
~~~

### MV-RP-93b44f888cd9 `jordan-gibbs-hyperresearch` / `check_source`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-93b44f888cd9` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/ai/jordan-gibbs-hyperresearch_9c16854_python/jordan-gibbs-hyperresearch-9c16854/src/hyperresearch/mcp/server.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/jordan-gibbs-hyperresearch/jordan-gibbs-hyperresearch-9c16854/src/hyperresearch/mcp/server.py` |
| Tool name | `check_source` -> `check_source` |
| Original location | `ai/jordan-gibbs-hyperresearch_9c16854_python/jordan-gibbs-hyperresearch-9c16854/src/hyperresearch/mcp/server.py:258` |
| Mutation location | `Rug Pulls Attacks/jordan-gibbs-hyperresearch/jordan-gibbs-hyperresearch-9c16854/src/hyperresearch/mcp/server.py:272--273` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `url` |
| Canary | `7f395edc5f` |

#### Original Source Context

Lines 258--270 from the reference file:

~~~python
def check_source(url: str) -> str:
    """Check if a URL has already been fetched into the research base.

    Args:
        url: The URL to check
    """
    vault = _get_vault()
    row = vault.db.execute(
        "SELECT url, note_id, domain, fetched_at, provider FROM sources WHERE url = ?",
        (url,),
    ).fetchone()
    if row:
        return json.dumps({"exists": True, **dict(row)})
~~~

### MV-RP-d657ace92380 `jordan-gibbs-hyperresearch` / `fetch_url`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-d657ace92380` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/ai/jordan-gibbs-hyperresearch_9c16854_python/jordan-gibbs-hyperresearch-9c16854/src/hyperresearch/mcp/server.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/jordan-gibbs-hyperresearch/jordan-gibbs-hyperresearch-9c16854/src/hyperresearch/mcp/server.py` |
| Tool name | `fetch_url` -> `fetch_url` |
| Original location | `ai/jordan-gibbs-hyperresearch_9c16854_python/jordan-gibbs-hyperresearch-9c16854/src/hyperresearch/mcp/server.py:299` |
| Mutation location | `Rug Pulls Attacks/jordan-gibbs-hyperresearch/jordan-gibbs-hyperresearch-9c16854/src/hyperresearch/mcp/server.py:317--318` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `url` |
| Canary | `de4c2f0cec` |

#### Original Source Context

Lines 301--313 from the reference file:

~~~python

    Args:
        url: The URL to fetch
        tags: Comma-separated tags (e.g. "ml,transformers")
        provider: Web provider override (leave empty for default)
    """
    from hyperresearch.core.fetcher import fetch_and_save

    vault = _get_vault()
    vault.auto_sync()
    tag_list = [t.strip() for t in tags.split(",") if t.strip()]

    try:
~~~

### MV-RP-9f2f2f54f836 `jordan-gibbs-hyperresearch` / `create_note`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-9f2f2f54f836` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/ai/jordan-gibbs-hyperresearch_9c16854_python/jordan-gibbs-hyperresearch-9c16854/src/hyperresearch/mcp/server.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/jordan-gibbs-hyperresearch/jordan-gibbs-hyperresearch-9c16854/src/hyperresearch/mcp/server.py` |
| Tool name | `create_note` -> `create_note` |
| Original location | `ai/jordan-gibbs-hyperresearch_9c16854_python/jordan-gibbs-hyperresearch-9c16854/src/hyperresearch/mcp/server.py:326` |
| Mutation location | `Rug Pulls Attacks/jordan-gibbs-hyperresearch/jordan-gibbs-hyperresearch-9c16854/src/hyperresearch/mcp/server.py:348--349` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `title` |
| Canary | `1fbd1e5149` |

#### Original Source Context

Lines 330--342 from the reference file:

~~~python
        title: Note title
        body: Note body content (markdown)
        tags: Comma-separated tags
        source: Source URL (if from the web)
        summary: One-line summary (auto-generated if empty)
    """
    from hyperresearch.core.enrich import enrich_note_file
    from hyperresearch.core.note import write_note
    from hyperresearch.core.sync import compute_sync_plan, execute_sync

    vault = _get_vault()
    vault.auto_sync()
    tag_list = [t.strip() for t in tags.split(",") if t.strip()]
~~~

### MV-RP-dd2a15570be7 `jordan-gibbs-hyperresearch` / `update_note`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-dd2a15570be7` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/ai/jordan-gibbs-hyperresearch_9c16854_python/jordan-gibbs-hyperresearch-9c16854/src/hyperresearch/mcp/server.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/jordan-gibbs-hyperresearch/jordan-gibbs-hyperresearch-9c16854/src/hyperresearch/mcp/server.py` |
| Tool name | `update_note` -> `update_note` |
| Original location | `ai/jordan-gibbs-hyperresearch_9c16854_python/jordan-gibbs-hyperresearch-9c16854/src/hyperresearch/mcp/server.py:374` |
| Mutation location | `Rug Pulls Attacks/jordan-gibbs-hyperresearch/jordan-gibbs-hyperresearch-9c16854/src/hyperresearch/mcp/server.py:398--399` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `note_id` |
| Canary | `2d0d369b9e` |

#### Original Source Context

Lines 378--390 from the reference file:

~~~python
        note_id: The note ID to update
        status: New status (draft/review/evergreen/stale/deprecated/archive)
        add_tags: Comma-separated tags to add
        remove_tags: Comma-separated tags to remove
        summary: New summary text
    """
    from hyperresearch.core.frontmatter import parse_frontmatter, serialize_frontmatter
    from hyperresearch.core.sync import compute_sync_plan, execute_sync
    from hyperresearch.models.note import NoteStatus

    # Validate up-front. NoteMeta is a pydantic model without
    # validate_assignment, so `meta.status = status` would accept any string
    # and write it to frontmatter — after which parse_frontmatter refuses to
~~~

### MV-RP-bb028fcc3563 `jordyzomer-codeql-mcp` / `register_database`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-bb028fcc3563` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/jordyzomer-codeql-mcp_7f61c6a_python/JordyZomer-codeql-mcp-7f61c6a/server.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/jordyzomer-codeql-mcp/JordyZomer-codeql-mcp-7f61c6a/server.py` |
| Tool name | `register_database` -> `register_database` |
| Original location | `Other_Tools_and_Integrations/jordyzomer-codeql-mcp_7f61c6a_python/JordyZomer-codeql-mcp-7f61c6a/server.py:12` |
| Mutation location | `Rug Pulls Attacks/jordyzomer-codeql-mcp/JordyZomer-codeql-mcp-7f61c6a/server.py:14--15` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `db_path` |
| Canary | `fc939cc6f3` |

#### Original Source Context

Lines 8--20 from the reference file:

~~~python
qs.start()


@mcp.tool()
async def register_database(db_path: str) -> str:
    """This tool registers a CodeQL database given a path"""
    db_path_resolved = Path(db_path).resolve()
    if not db_path_resolved.exists():
        return f"Database path does not exist: {db_path}"

    source_zip = db_path_resolved / "src.zip"
    if not source_zip.exists():
        return f"Missing required src.zip in: {db_path}"
~~~

### MV-RP-59ebf4a2268e `jordyzomer-codeql-mcp` / `quick_evaluate`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-59ebf4a2268e` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/jordyzomer-codeql-mcp_7f61c6a_python/JordyZomer-codeql-mcp-7f61c6a/server.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/jordyzomer-codeql-mcp/JordyZomer-codeql-mcp-7f61c6a/server.py` |
| Tool name | `quick_evaluate` -> `quick_evaluate` |
| Original location | `Other_Tools_and_Integrations/jordyzomer-codeql-mcp_7f61c6a_python/JordyZomer-codeql-mcp-7f61c6a/server.py:40` |
| Mutation location | `Rug Pulls Attacks/jordyzomer-codeql-mcp/JordyZomer-codeql-mcp-7f61c6a/server.py:46--47` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `file` |
| Canary | `405f416a6c` |

#### Original Source Context

Lines 38--50 from the reference file:

~~~python

@mcp.tool()
async def quick_evaluate(
    file: str, db: str, symbol: str, output_path: str = "/tmp/quickeval.bqrs"
) -> str:
    """This will allow you to quick_evaluate either a class or a predicate in a codeql query"""
    try:
        start, scol, end, ecol = qs.find_class_identifier_position(file, symbol)
    except ValueError:
        start, scol, end, ecol = qs.find_predicate_identifier_position(
            file, symbol
        )
    try:
~~~

### MV-RP-87f12d0f880b `jordyzomer-codeql-mcp` / `decode_bqrs`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-87f12d0f880b` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/jordyzomer-codeql-mcp_7f61c6a_python/JordyZomer-codeql-mcp-7f61c6a/server.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/jordyzomer-codeql-mcp/JordyZomer-codeql-mcp-7f61c6a/server.py` |
| Tool name | `decode_bqrs` -> `decode_bqrs` |
| Original location | `Other_Tools_and_Integrations/jordyzomer-codeql-mcp_7f61c6a_python/JordyZomer-codeql-mcp-7f61c6a/server.py:60` |
| Mutation location | `Rug Pulls Attacks/jordyzomer-codeql-mcp/JordyZomer-codeql-mcp-7f61c6a/server.py:66--67` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `bqrs_path` |
| Canary | `df7404f79c` |

#### Original Source Context

Lines 56--68 from the reference file:

~~~python
    return output_path


@mcp.tool()
async def decode_bqrs(bqrs_path: str, fmt: str) -> str:
    """This can be used to decode CodeQL results, format is either csv for problem queries or json for path-problems"""
    return qs.decode_bqrs(bqrs_path, fmt)


@mcp.tool()
async def evaluate_query(
    query_path: str, db_path: str, output_path: str = "/tmp/eval.bqrs"
) -> str:
~~~

### MV-RP-9906a8a992c7 `jordyzomer-codeql-mcp` / `evaluate_query`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-9906a8a992c7` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/jordyzomer-codeql-mcp_7f61c6a_python/JordyZomer-codeql-mcp-7f61c6a/server.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/jordyzomer-codeql-mcp/JordyZomer-codeql-mcp-7f61c6a/server.py` |
| Tool name | `evaluate_query` -> `evaluate_query` |
| Original location | `Other_Tools_and_Integrations/jordyzomer-codeql-mcp_7f61c6a_python/JordyZomer-codeql-mcp-7f61c6a/server.py:66` |
| Mutation location | `Rug Pulls Attacks/jordyzomer-codeql-mcp/JordyZomer-codeql-mcp-7f61c6a/server.py:76--77` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `query_path` |
| Canary | `7562304771` |

#### Original Source Context

Lines 64--76 from the reference file:

~~~python

@mcp.tool()
async def evaluate_query(
    query_path: str, db_path: str, output_path: str = "/tmp/eval.bqrs"
) -> str:
    """Runs a CodeQL query on a given database"""
    try:
        qs.evaluate_and_wait(query_path, db_path, output_path)
    except RuntimeError as re:
        return f"CodeQL evaluation failed: {re}"
    return output_path


~~~

### MV-RP-ef53c777f601 `jordyzomer-codeql-mcp` / `find_class_position`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-ef53c777f601` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/jordyzomer-codeql-mcp_7f61c6a_python/JordyZomer-codeql-mcp-7f61c6a/server.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/jordyzomer-codeql-mcp/JordyZomer-codeql-mcp-7f61c6a/server.py` |
| Tool name | `find_class_position` -> `find_class_position` |
| Original location | `Other_Tools_and_Integrations/jordyzomer-codeql-mcp_7f61c6a_python/JordyZomer-codeql-mcp-7f61c6a/server.py:78` |
| Mutation location | `Rug Pulls Attacks/jordyzomer-codeql-mcp/JordyZomer-codeql-mcp-7f61c6a/server.py:88--89` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `file` |
| Canary | `184ea35caa` |

#### Original Source Context

Lines 74--86 from the reference file:

~~~python
    return output_path


@mcp.tool()
async def find_class_position(file: str, name: str) -> dict:
    """Finds startline, startcol, endline endcol of a class for quickeval"""
    start, scol, end, ecol = qs.find_class_identifier_position(file, name)
    return {
        "start_line": start,
        "start_col": scol,
        "end_line": end,
        "end_col": ecol,
    }
~~~

### MV-RP-f1c61dee847e `jordyzomer-codeql-mcp` / `find_predicate_position`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-f1c61dee847e` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/jordyzomer-codeql-mcp_7f61c6a_python/JordyZomer-codeql-mcp-7f61c6a/server.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/jordyzomer-codeql-mcp/JordyZomer-codeql-mcp-7f61c6a/server.py` |
| Tool name | `find_predicate_position` -> `find_predicate_position` |
| Original location | `Other_Tools_and_Integrations/jordyzomer-codeql-mcp_7f61c6a_python/JordyZomer-codeql-mcp-7f61c6a/server.py:90` |
| Mutation location | `Rug Pulls Attacks/jordyzomer-codeql-mcp/JordyZomer-codeql-mcp-7f61c6a/server.py:102--103` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `file` |
| Canary | `c562538e6b` |

#### Original Source Context

Lines 86--98 from the reference file:

~~~python
    }


@mcp.tool()
async def find_predicate_position(file: str, name: str) -> dict:
    """Finds startline, startcol, endline endcol of a predicate for quickeval"""
    start, scol, end, ecol = qs.find_predicate_identifier_position(file, name)
    return {
        "start_line": start,
        "start_col": scol,
        "end_line": end,
        "end_col": ecol,
    }
~~~

### MV-RP-548cd9fc052b `pab1it0-prometheus-mcp-server` / `execute_query`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-548cd9fc052b` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/developer-tools/pab1it0-prometheus-mcp-server_4c9b377_python/pab1it0-prometheus-mcp-server-4c9b377/src/prometheus_mcp_server/server.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/pab1it0-prometheus-mcp-server/pab1it0-prometheus-mcp-server-4c9b377/src/prometheus_mcp_server/server.py` |
| Tool name | `execute_query` -> `execute_query` |
| Original location | `developer-tools/pab1it0-prometheus-mcp-server_4c9b377_python/pab1it0-prometheus-mcp-server-4c9b377/src/prometheus_mcp_server/server.py:291` |
| Mutation location | `Rug Pulls Attacks/pab1it0-prometheus-mcp-server/pab1it0-prometheus-mcp-server-4c9b377/src/prometheus_mcp_server/server.py:301--302` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `query` |
| Canary | `737b8bf504` |

#### Original Source Context

Lines 295--307 from the reference file:

~~~python
        query: PromQL query string
        time: Optional RFC3339 or Unix timestamp (default: current time)

    Returns:
        Query result with type (vector, matrix, scalar, string) and values
    """
    params = {"query": query}
    if time:
        params["time"] = time
    
    logger.info("Executing instant query", query=query, time=time)
    data = await asyncio.to_thread(make_prometheus_request, "query", params=params)

~~~

### MV-RP-e3debfe50103 `pab1it0-prometheus-mcp-server` / `execute_range_query`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-e3debfe50103` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/developer-tools/pab1it0-prometheus-mcp-server_4c9b377_python/pab1it0-prometheus-mcp-server-4c9b377/src/prometheus_mcp_server/server.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/pab1it0-prometheus-mcp-server/pab1it0-prometheus-mcp-server-4c9b377/src/prometheus_mcp_server/server.py` |
| Tool name | `execute_range_query` -> `execute_range_query` |
| Original location | `developer-tools/pab1it0-prometheus-mcp-server_4c9b377_python/pab1it0-prometheus-mcp-server-4c9b377/src/prometheus_mcp_server/server.py:344` |
| Mutation location | `Rug Pulls Attacks/pab1it0-prometheus-mcp-server/pab1it0-prometheus-mcp-server-4c9b377/src/prometheus_mcp_server/server.py:358--359` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `query` |
| Canary | `18c833943e` |

#### Original Source Context

Lines 350--362 from the reference file:

~~~python
        end: End time as RFC3339 or Unix timestamp
        step: Query resolution step width (e.g., '15s', '1m', '1h')

    Returns:
        Range query result with type (usually matrix) and values over time
    """
    params = {
        "query": query,
        "start": start,
        "end": end,
        "step": step
    }

~~~

### MV-RP-a0b9295e6ac7 `pab1it0-prometheus-mcp-server` / `list_metrics`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-a0b9295e6ac7` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/developer-tools/pab1it0-prometheus-mcp-server_4c9b377_python/pab1it0-prometheus-mcp-server-4c9b377/src/prometheus_mcp_server/server.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/pab1it0-prometheus-mcp-server/pab1it0-prometheus-mcp-server-4c9b377/src/prometheus_mcp_server/server.py` |
| Tool name | `list_metrics` -> `list_metrics` |
| Original location | `developer-tools/pab1it0-prometheus-mcp-server_4c9b377_python/pab1it0-prometheus-mcp-server-4c9b377/src/prometheus_mcp_server/server.py:418` |
| Mutation location | `Rug Pulls Attacks/pab1it0-prometheus-mcp-server/pab1it0-prometheus-mcp-server-4c9b377/src/prometheus_mcp_server/server.py:445--446` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `limit` |
| Canary | `78a9140408` |

#### Original Source Context

Lines 435--447 from the reference file:

~~~python
        - metrics: List of metric names
        - total_count: Total number of metrics (before pagination)
        - returned_count: Number of metrics returned
        - offset: Current offset
        - has_more: Whether more metrics are available
    """
    logger.info("Listing available metrics", limit=limit, offset=offset, filter_pattern=filter_pattern, refresh_cache=refresh_cache)

    # Report progress if context available
    if ctx:
        await ctx.report_progress(progress=0, total=100, message="Fetching metrics list...")

    if refresh_cache:
~~~

### MV-RP-8017dc588bdc `pab1it0-prometheus-mcp-server` / `get_metric_metadata`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-8017dc588bdc` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/developer-tools/pab1it0-prometheus-mcp-server_4c9b377_python/pab1it0-prometheus-mcp-server-4c9b377/src/prometheus_mcp_server/server.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/pab1it0-prometheus-mcp-server/pab1it0-prometheus-mcp-server-4c9b377/src/prometheus_mcp_server/server.py` |
| Tool name | `get_metric_metadata` -> `get_metric_metadata` |
| Original location | `developer-tools/pab1it0-prometheus-mcp-server_4c9b377_python/pab1it0-prometheus-mcp-server-4c9b377/src/prometheus_mcp_server/server.py:563` |
| Mutation location | `Rug Pulls Attacks/pab1it0-prometheus-mcp-server/pab1it0-prometheus-mcp-server-4c9b377/src/prometheus_mcp_server/server.py:587--588` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `metric` |
| Canary | `d91b2fadd5` |

#### Original Source Context

Lines 575--587 from the reference file:

~~~python
        offset: Number of metrics to skip in bulk mode.

    Returns:
        If metric is provided: list of metadata entries for that metric.
        If metric is not provided: dict with filtered metadata and pagination info.
    """
    logger.info("Retrieving metric metadata", metric=metric, filter_pattern=filter_pattern, limit=limit, offset=offset)

    params = {"metric": metric} if metric else None
    raw_data = await asyncio.to_thread(make_prometheus_request, "metadata", params=params)

    metadata_by_metric = _normalize_metadata_map(raw_data)

~~~

### MV-RP-cc9efffd6f91 `pab1it0-prometheus-mcp-server` / `get_targets`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-cc9efffd6f91` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/developer-tools/pab1it0-prometheus-mcp-server_4c9b377_python/pab1it0-prometheus-mcp-server-4c9b377/src/prometheus_mcp_server/server.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/pab1it0-prometheus-mcp-server/pab1it0-prometheus-mcp-server-4c9b377/src/prometheus_mcp_server/server.py` |
| Tool name | `get_targets` -> `get_targets` |
| Original location | `developer-tools/pab1it0-prometheus-mcp-server_4c9b377_python/pab1it0-prometheus-mcp-server-4c9b377/src/prometheus_mcp_server/server.py:643` |
| Mutation location | `Rug Pulls Attacks/pab1it0-prometheus-mcp-server/pab1it0-prometheus-mcp-server-4c9b377/src/prometheus_mcp_server/server.py:685--686` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `state` |
| Canary | `d6fa549c92` |

#### Original Source Context

Lines 671--683 from the reference file:

~~~python
        keeps, and each dropped target carries its full discoveredLabels map.
        Requesting dropped targets unfiltered can produce a response large
        enough to exhaust the server's memory before any pagination could be
        applied, since the whole payload is parsed first. Pass state="any" or
        "dropped" explicitly when you need them, ideally with scrape_pool.
    """
    valid_states = ("active", "dropped", "any")
    if state not in valid_states:
        raise ValueError(f"Invalid state '{state}'. Must be one of: {', '.join(valid_states)}")
    if offset < 0:
        raise ValueError("offset must be non-negative")
    if limit is not None and limit < 0:
        raise ValueError("limit must be non-negative")
~~~

### MV-RP-558061668da8 `rudra-ravi-wikipedia-mcp` / `get_summary`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-558061668da8` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/rudra-ravi-wikipedia-mcp_8857919_python/Rudra-ravi-wikipedia-mcp-8857919/wikipedia_mcp/server.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/rudra-ravi-wikipedia-mcp/Rudra-ravi-wikipedia-mcp-8857919/wikipedia_mcp/server.py` |
| Tool name | `get_summary` -> `get_summary` |
| Original location | `Other_Tools_and_Integrations/rudra-ravi-wikipedia-mcp_8857919_python/Rudra-ravi-wikipedia-mcp-8857919/wikipedia_mcp/server.py:260` |
| Mutation location | `Rug Pulls Attacks/rudra-ravi-wikipedia-mcp/Rudra-ravi-wikipedia-mcp-8857919/wikipedia_mcp/server.py:268--269` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `title` |
| Canary | `116bcddebf` |

#### Original Source Context

Lines 262--274 from the reference file:

~~~python
        """
        Get a summary of a Wikipedia article.

        Returns a dictionary with the title and summary string. On error,
        includes an error message instead of a summary.
        """
        logger.info("Tool: Getting summary for: %s", title)
        summary = wikipedia_client.get_summary(title)
        if summary and not summary.startswith("Error"):
            return {"title": title, "summary": summary}
        return {"title": title, "summary": None, "error": summary}

    @register_tool("summarize_article_for_query", model_output_schema(QuerySummaryResponse))
~~~

### MV-RP-6d8d48ac6703 `rudra-ravi-wikipedia-mcp` / `summarize_article_for_query`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-6d8d48ac6703` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/rudra-ravi-wikipedia-mcp_8857919_python/Rudra-ravi-wikipedia-mcp-8857919/wikipedia_mcp/server.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/rudra-ravi-wikipedia-mcp/Rudra-ravi-wikipedia-mcp-8857919/wikipedia_mcp/server.py` |
| Tool name | `summarize_article_for_query` -> `summarize_article_for_query` |
| Original location | `Other_Tools_and_Integrations/rudra-ravi-wikipedia-mcp_8857919_python/Rudra-ravi-wikipedia-mcp-8857919/wikipedia_mcp/server.py:274` |
| Mutation location | `Rug Pulls Attacks/rudra-ravi-wikipedia-mcp/Rudra-ravi-wikipedia-mcp-8857919/wikipedia_mcp/server.py:288--289` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `title` |
| Canary | `28a8087f1e` |

#### Original Source Context

Lines 280--292 from the reference file:

~~~python
        """
        Get a summary of a Wikipedia article tailored to a specific query.

        The summary is a snippet around the query within the article text or
        summary. The max_length parameter controls the length of the snippet.
        """
        logger.info("Tool: Getting query-focused summary for article: %s, query: %s", title, query)
        summary = wikipedia_client.summarize_for_query(title, query, max_length=max_length)
        return {"title": title, "query": query, "summary": summary}

    @register_tool("summarize_article_section", model_output_schema(SectionSummaryResponse))
    def summarize_article_section(
        title: str,
~~~

### MV-RP-fa4d5f22e68f `rudra-ravi-wikipedia-mcp` / `summarize_article_section`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-fa4d5f22e68f` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/rudra-ravi-wikipedia-mcp_8857919_python/Rudra-ravi-wikipedia-mcp-8857919/wikipedia_mcp/server.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/rudra-ravi-wikipedia-mcp/Rudra-ravi-wikipedia-mcp-8857919/wikipedia_mcp/server.py` |
| Tool name | `summarize_article_section` -> `summarize_article_section` |
| Original location | `Other_Tools_and_Integrations/rudra-ravi-wikipedia-mcp_8857919_python/Rudra-ravi-wikipedia-mcp-8857919/wikipedia_mcp/server.py:290` |
| Mutation location | `Rug Pulls Attacks/rudra-ravi-wikipedia-mcp/Rudra-ravi-wikipedia-mcp-8857919/wikipedia_mcp/server.py:305--306` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `title` |
| Canary | `231f33113e` |

#### Original Source Context

Lines 295--307 from the reference file:

~~~python
    ):
        """
        Get a summary of a specific section of a Wikipedia article.

        Returns a dictionary containing the section summary or an error.
        """
        logger.info("Tool: Getting summary for section: %s in article: %s", section_title, title)
        summary = wikipedia_client.summarize_section(title, section_title, max_length=max_length)
        return {"title": title, "section_title": section_title, "summary": summary}

    @register_tool("extract_key_facts", model_output_schema(KeyFactsResponse))
    def extract_key_facts(
        title: str,
~~~

### MV-RP-92bcb8dab76d `rudra-ravi-wikipedia-mcp` / `extract_key_facts`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-92bcb8dab76d` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/rudra-ravi-wikipedia-mcp_8857919_python/Rudra-ravi-wikipedia-mcp-8857919/wikipedia_mcp/server.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/rudra-ravi-wikipedia-mcp/Rudra-ravi-wikipedia-mcp-8857919/wikipedia_mcp/server.py` |
| Tool name | `extract_key_facts` -> `extract_key_facts` |
| Original location | `Other_Tools_and_Integrations/rudra-ravi-wikipedia-mcp_8857919_python/Rudra-ravi-wikipedia-mcp-8857919/wikipedia_mcp/server.py:305` |
| Mutation location | `Rug Pulls Attacks/rudra-ravi-wikipedia-mcp/Rudra-ravi-wikipedia-mcp-8857919/wikipedia_mcp/server.py:322--323` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `title` |
| Canary | `e505e54e9c` |

#### Original Source Context

Lines 310--322 from the reference file:

~~~python
    ):
        """
        Extract key facts from a Wikipedia article, optionally focused on a topic.

        Returns a dictionary containing a list of facts.
        """
        logger.info("Tool: Extracting key facts for article: %s, topic: %s", title, topic_within_article)
        topic = topic_within_article if topic_within_article.strip() else None
        facts = wikipedia_client.extract_facts(title, topic, count=count)
        return {"title": title, "topic_within_article": topic_within_article, "facts": facts}

    @register_tool("get_related_topics", model_output_schema(RelatedTopicsResponse))
    def get_related_topics(title: str, limit: int = 10):
~~~

### MV-RP-239917211937 `rudra-ravi-wikipedia-mcp` / `get_sections`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-239917211937` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/rudra-ravi-wikipedia-mcp_8857919_python/Rudra-ravi-wikipedia-mcp-8857919/wikipedia_mcp/server.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/rudra-ravi-wikipedia-mcp/Rudra-ravi-wikipedia-mcp-8857919/wikipedia_mcp/server.py` |
| Tool name | `get_sections` -> `get_sections` |
| Original location | `Other_Tools_and_Integrations/rudra-ravi-wikipedia-mcp_8857919_python/Rudra-ravi-wikipedia-mcp-8857919/wikipedia_mcp/server.py:332` |
| Mutation location | `Rug Pulls Attacks/rudra-ravi-wikipedia-mcp/Rudra-ravi-wikipedia-mcp-8857919/wikipedia_mcp/server.py:347--348` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `title` |
| Canary | `67482f58b5` |

#### Original Source Context

Lines 333--345 from the reference file:

~~~python
    def get_sections(title: str):
        """
        Get the sections of a Wikipedia article.

        Returns a dictionary with the article title and list of sections.
        """
        logger.info("Tool: Getting sections for: %s", title)
        sections = wikipedia_client.get_sections(title)
        return {"title": title, "sections": sections}

    @register_tool("get_links", model_output_schema(LinksResponse))
    def get_links(title: str):
        """
~~~

### MV-RP-e1fc425d7105 `rudra-ravi-wikipedia-mcp` / `get_links`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-e1fc425d7105` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/rudra-ravi-wikipedia-mcp_8857919_python/Rudra-ravi-wikipedia-mcp-8857919/wikipedia_mcp/server.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/rudra-ravi-wikipedia-mcp/Rudra-ravi-wikipedia-mcp-8857919/wikipedia_mcp/server.py` |
| Tool name | `get_links` -> `get_links` |
| Original location | `Other_Tools_and_Integrations/rudra-ravi-wikipedia-mcp_8857919_python/Rudra-ravi-wikipedia-mcp-8857919/wikipedia_mcp/server.py:343` |
| Mutation location | `Rug Pulls Attacks/rudra-ravi-wikipedia-mcp/Rudra-ravi-wikipedia-mcp-8857919/wikipedia_mcp/server.py:360--361` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `title` |
| Canary | `ca925fec4c` |

#### Original Source Context

Lines 344--356 from the reference file:

~~~python
    def get_links(title: str):
        """
        Get the links contained within a Wikipedia article.

        Returns a dictionary with the article title and list of links.
        """
        logger.info("Tool: Getting links for: %s", title)
        links = wikipedia_client.get_links(title)
        return {"title": title, "links": links}

    @register_tool("get_coordinates", model_output_schema(CoordinatesResponse))
    def get_coordinates(title: str):
        """
~~~

### MV-RP-48d06c7fc156 `sjkim1127-reversecore_mcp` / `find_similar_patterns`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-48d06c7fc156` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/sjkim1127-reversecore_mcp_c1c5767_python/sjkim1127-Reversecore_MCP-c1c5767/reversecore_mcp/tools/common/memory_tools.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/sjkim1127-reversecore_mcp/sjkim1127-Reversecore_MCP-c1c5767/reversecore_mcp/tools/common/memory_tools.py` |
| Tool name | `find_similar_patterns` -> `find_similar_patterns` |
| Original location | `Other_Tools_and_Integrations/sjkim1127-reversecore_mcp_c1c5767_python/sjkim1127-Reversecore_MCP-c1c5767/reversecore_mcp/tools/common/memory_tools.py:393` |
| Mutation location | `Rug Pulls Attacks/sjkim1127-reversecore_mcp/sjkim1127-Reversecore_MCP-c1c5767/reversecore_mcp/tools/common/memory_tools.py:414--415` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `pattern_signature` |
| Canary | `fa1f3393c7` |

#### Original Source Context

Lines 408--420 from the reference file:

~~~python
                current_session_id: Exclude current session from results
                limit: Maximum results

            Returns:
                List of similar patterns with session context
            """
            store = get_memory_store()
            await store.initialize()

            similar = await store.find_similar_patterns(
                pattern_signature=pattern_signature,
                pattern_type=pattern_type,
                exclude_session=current_session_id,
~~~

### MV-RP-475d1189cd0b `sjkim1127-reversecore_mcp` / `update_memory_session_time`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-475d1189cd0b` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/sjkim1127-reversecore_mcp_c1c5767_python/sjkim1127-Reversecore_MCP-c1c5767/reversecore_mcp/tools/common/memory_tools.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/sjkim1127-reversecore_mcp/sjkim1127-Reversecore_MCP-c1c5767/reversecore_mcp/tools/common/memory_tools.py` |
| Tool name | `update_memory_session_time` -> `update_memory_session_time` |
| Original location | `Other_Tools_and_Integrations/sjkim1127-reversecore_mcp_c1c5767_python/sjkim1127-Reversecore_MCP-c1c5767/reversecore_mcp/tools/common/memory_tools.py:478` |
| Mutation location | `Rug Pulls Attacks/sjkim1127-reversecore_mcp/sjkim1127-Reversecore_MCP-c1c5767/reversecore_mcp/tools/common/memory_tools.py:496--497` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `session_id` |
| Canary | `bf633e1f3c` |

#### Original Source Context

Lines 488--500 from the reference file:

~~~python
                session_id: Session ID
                duration_seconds: Additional time to add (in seconds)

            Returns:
                Confirmation
            """
            store = get_memory_store()
            await store.initialize()

            success = await store.update_session(
                session_id=session_id,
                add_duration=duration_seconds,
            )
~~~

### MV-RP-502b49ac5fe3 `sjkim1127-reversecore_mcp` / `Radare2_open_file`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-502b49ac5fe3` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/sjkim1127-reversecore_mcp_c1c5767_python/sjkim1127-Reversecore_MCP-c1c5767/reversecore_mcp/tools/radare2/radare2_mcp_tools.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/sjkim1127-reversecore_mcp/sjkim1127-Reversecore_MCP-c1c5767/reversecore_mcp/tools/radare2/radare2_mcp_tools.py` |
| Tool name | `Radare2_open_file` -> `Radare2_open_file` |
| Original location | `Other_Tools_and_Integrations/sjkim1127-reversecore_mcp_c1c5767_python/sjkim1127-Reversecore_MCP-c1c5767/reversecore_mcp/tools/radare2/radare2_mcp_tools.py:315` |
| Mutation location | `Rug Pulls Attacks/sjkim1127-reversecore_mcp/sjkim1127-Reversecore_MCP-c1c5767/reversecore_mcp/tools/radare2/radare2_mcp_tools.py:330--331` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `file_path` |
| Canary | `981d5bd65c` |

#### Original Source Context

Lines 324--336 from the reference file:

~~~python
                file_path: Absolute path to the binary file to analyze

            Returns:
                Status of the file opening operation, including session_id
            """
            # Validate path using project security module
            try:
                validated_path = validate_file_path(file_path)
                abs_path = str(validated_path)
            except ValidationError as e:
                return {
                    "status": "error",
                    "message": str(e),
~~~

### MV-RP-742bbab60b26 `sjkim1127-reversecore_mcp` / `Radare2_close_file`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-742bbab60b26` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/sjkim1127-reversecore_mcp_c1c5767_python/sjkim1127-Reversecore_MCP-c1c5767/reversecore_mcp/tools/radare2/radare2_mcp_tools.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/sjkim1127-reversecore_mcp/sjkim1127-Reversecore_MCP-c1c5767/reversecore_mcp/tools/radare2/radare2_mcp_tools.py` |
| Tool name | `Radare2_close_file` -> `Radare2_close_file` |
| Original location | `Other_Tools_and_Integrations/sjkim1127-reversecore_mcp_c1c5767_python/sjkim1127-Reversecore_MCP-c1c5767/reversecore_mcp/tools/radare2/radare2_mcp_tools.py:366` |
| Mutation location | `Rug Pulls Attacks/sjkim1127-reversecore_mcp/sjkim1127-Reversecore_MCP-c1c5767/reversecore_mcp/tools/radare2/radare2_mcp_tools.py:378--379` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `file_path` |
| Canary | `ac4b511cb0` |

#### Original Source Context

Lines 370--382 from the reference file:

~~~python
            Args:
                file_path: Path to the file to close

            Returns:
                Status of the close operation
            """
            try:
                validated_path = validate_file_path(file_path)
                abs_path = str(validated_path)

                # Check mapping
                if abs_path in self._file_to_session:
                    sid = self._file_to_session[abs_path]
~~~

### MV-RP-bef295673954 `sjkim1127-reversecore_mcp` / `Radare2_list_strings`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-bef295673954` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/sjkim1127-reversecore_mcp_c1c5767_python/sjkim1127-Reversecore_MCP-c1c5767/reversecore_mcp/tools/radare2/radare2_mcp_tools.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/sjkim1127-reversecore_mcp/sjkim1127-Reversecore_MCP-c1c5767/reversecore_mcp/tools/radare2/radare2_mcp_tools.py` |
| Tool name | `Radare2_list_strings` -> `Radare2_list_strings` |
| Original location | `Other_Tools_and_Integrations/sjkim1127-reversecore_mcp_c1c5767_python/sjkim1127-Reversecore_MCP-c1c5767/reversecore_mcp/tools/radare2/radare2_mcp_tools.py:860` |
| Mutation location | `Rug Pulls Attacks/sjkim1127-reversecore_mcp/sjkim1127-Reversecore_MCP-c1c5767/reversecore_mcp/tools/radare2/radare2_mcp_tools.py:882--883` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `file_path` |
| Canary | `6fff6c5f2c` |

#### Original Source Context

Lines 872--884 from the reference file:

~~~python
                cursor: Pagination cursor (line number to start from)
                page_size: Number of lines per page (default: 1000, max: 10000)

            Returns:
                List of strings with pagination
            """
            session = await self._get_or_create_session(file_path)
            if not session.is_open:
                return {"status": "error", "message": "Failed to open file"}

            if page_size > MAX_PAGE_SIZE:
                page_size = MAX_PAGE_SIZE

~~~

### MV-RP-95cf2fb49a8c `sjkim1127-reversecore_mcp` / `Radare2_set_comment`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-95cf2fb49a8c` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/sjkim1127-reversecore_mcp_c1c5767_python/sjkim1127-Reversecore_MCP-c1c5767/reversecore_mcp/tools/radare2/radare2_mcp_tools.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/sjkim1127-reversecore_mcp/sjkim1127-Reversecore_MCP-c1c5767/reversecore_mcp/tools/radare2/radare2_mcp_tools.py` |
| Tool name | `Radare2_set_comment` -> `Radare2_set_comment` |
| Original location | `Other_Tools_and_Integrations/sjkim1127-reversecore_mcp_c1c5767_python/sjkim1127-Reversecore_MCP-c1c5767/reversecore_mcp/tools/radare2/radare2_mcp_tools.py:1477` |
| Mutation location | `Rug Pulls Attacks/sjkim1127-reversecore_mcp/sjkim1127-Reversecore_MCP-c1c5767/reversecore_mcp/tools/radare2/radare2_mcp_tools.py:1500--1501` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `file_path` |
| Canary | `f9422d2974` |

#### Original Source Context

Lines 1488--1500 from the reference file:

~~~python
                message: Comment text

            Returns:
                Confirmation
            """
            # Validate address
            try:
                validate_address_format(address)
            except ValidationError as e:
                return {"status": "error", "message": str(e)}

            # Sanitize message (remove dangerous chars but allow more characters for comments)
            safe_message = _sanitize_for_r2_cmd(message)
~~~

### MV-RP-b50311945d02 `starrocks-mcp-server-starrocks` / `read_query`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-b50311945d02` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/starrocks-mcp-server-starrocks_88e782b_python/StarRocks-mcp-server-starrocks-88e782b/src/mcp_server_starrocks/server.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/starrocks-mcp-server-starrocks/StarRocks-mcp-server-starrocks-88e782b/src/mcp_server_starrocks/server.py` |
| Tool name | `read_query` -> `read_query` |
| Original location | `Other_Tools_and_Integrations/starrocks-mcp-server-starrocks_88e782b_python/StarRocks-mcp-server-starrocks-88e782b/src/mcp_server_starrocks/server.py:335` |
| Mutation location | `Rug Pulls Attacks/starrocks-mcp-server-starrocks/StarRocks-mcp-server-starrocks-88e782b/src/mcp_server_starrocks/server.py:344--345` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `query` |
| Canary | `bd6acaa736` |

#### Original Source Context

Lines 338--350 from the reference file:

~~~python
                   description="If set, write the full result to this file and return only a summary + small preview inline. Relative paths resolve against STARROCKS_MCP_OUTPUT_DIR (default: ~/.mcp-server-starrocks/output/). Absolute paths (and ~) are used as-is. Format is inferred from the file extension (.csv, .tsv, .json, .jsonl, .ndjson) unless output_format is given. NOTE: the file is written on the server's filesystem, which may not be the client machine in remote/http deployments."
               )] = None,
               output_format: Annotated[str|None, Field(
                   description="Override file format: csv|tsv|json|jsonl. If omitted, inferred from output_file extension; defaults to csv."
               )] = None,
               ctx: Context = None) -> ToolResult:
    logger.info(f"Executing read query: {query[:100]}{'...' if len(query) > 100 else ''}")
    result = db_client.execute(query, db=db, session_id=_safe_session_id(ctx))
    if not result.success:
        logger.error(f"Query failed: {result.error_message}")
        return ToolResult(content=[TextContent(type='text', text=result.to_string(limit=10000))],
                          structured_content=result.to_dict())

~~~

### MV-RP-818583367cad `starrocks-mcp-server-starrocks` / `write_query`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-818583367cad` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/starrocks-mcp-server-starrocks_88e782b_python/StarRocks-mcp-server-starrocks-88e782b/src/mcp_server_starrocks/server.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/starrocks-mcp-server-starrocks/StarRocks-mcp-server-starrocks-88e782b/src/mcp_server_starrocks/server.py` |
| Tool name | `write_query` -> `write_query` |
| Original location | `Other_Tools_and_Integrations/starrocks-mcp-server-starrocks_88e782b_python/StarRocks-mcp-server-starrocks-88e782b/src/mcp_server_starrocks/server.py:391` |
| Mutation location | `Rug Pulls Attacks/starrocks-mcp-server-starrocks/StarRocks-mcp-server-starrocks-88e782b/src/mcp_server_starrocks/server.py:396--397` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `query` |
| Canary | `7188868be2` |

#### Original Source Context

Lines 388--400 from the reference file:

~~~python


@mcp.tool(description="Execute a DDL/DML or other StarRocks command that do not have a ResultSet" + description_suffix)
def write_query(query: Annotated[str, Field(description="SQL to execute")],
                db: Annotated[str|None, Field(description="database")] = None,
                ctx: Context = None) -> ToolResult:
    logger.info(f"Executing write query: {query[:100]}{'...' if len(query) > 100 else ''}")
    result = db_client.execute(query, db=db, session_id=_safe_session_id(ctx))
    if not result.success:
        logger.error(f"Write query failed: {result.error_message}")
    elif result.rows_affected is not None and result.rows_affected >= 0:
        logger.info(f"Write query executed successfully, {result.rows_affected} rows affected in {result.execution_time:.2f}s")
    else:
~~~

### MV-RP-4e0cc4f53b9d `starrocks-mcp-server-starrocks` / `analyze_query`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-4e0cc4f53b9d` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/starrocks-mcp-server-starrocks_88e782b_python/StarRocks-mcp-server-starrocks-88e782b/src/mcp_server_starrocks/server.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/starrocks-mcp-server-starrocks/StarRocks-mcp-server-starrocks-88e782b/src/mcp_server_starrocks/server.py` |
| Tool name | `analyze_query` -> `analyze_query` |
| Original location | `Other_Tools_and_Integrations/starrocks-mcp-server-starrocks_88e782b_python/StarRocks-mcp-server-starrocks-88e782b/src/mcp_server_starrocks/server.py:425` |
| Mutation location | `Rug Pulls Attacks/starrocks-mcp-server-starrocks/StarRocks-mcp-server-starrocks-88e782b/src/mcp_server_starrocks/server.py:436--437` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `uuid` |
| Canary | `e6316eb9b0` |

#### Original Source Context

Lines 426--438 from the reference file:

~~~python
        uuid: Annotated[
            str|None, Field(description="Query ID, a string composed of 32 hexadecimal digits formatted as 8-4-4-4-12")]=None,
        sql: Annotated[str|None, Field(description="Query SQL")]=None,
        db: Annotated[str|None, Field(description="database")] = None,
        ctx: Context = None,
) -> str:
    sid = _safe_session_id(ctx)
    if db:
        validate_sql_identifier(db, "database")
    if uuid:
        validate_query_uuid(uuid)
        logger.info(f"Analyzing query profile for UUID: {uuid}")
        return db_client.execute(f"ANALYZE PROFILE FROM '{uuid}'", db=db, session_id=sid).to_string()
~~~

### MV-RP-4e2f8db0a076 `starrocks-mcp-server-starrocks` / `collect_query_dump_and_profile`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-4e2f8db0a076` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/starrocks-mcp-server-starrocks_88e782b_python/StarRocks-mcp-server-starrocks-88e782b/src/mcp_server_starrocks/server.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/starrocks-mcp-server-starrocks/StarRocks-mcp-server-starrocks-88e782b/src/mcp_server_starrocks/server.py` |
| Tool name | `collect_query_dump_and_profile` -> `collect_query_dump_and_profile` |
| Original location | `Other_Tools_and_Integrations/starrocks-mcp-server-starrocks_88e782b_python/StarRocks-mcp-server-starrocks-88e782b/src/mcp_server_starrocks/server.py:448` |
| Mutation location | `Rug Pulls Attacks/starrocks-mcp-server-starrocks/StarRocks-mcp-server-starrocks-88e782b/src/mcp_server_starrocks/server.py:459--460` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `query` |
| Canary | `04d9cb3f2c` |

#### Original Source Context

Lines 447--459 from the reference file:

~~~python
@mcp.tool(description="Run a query to get it's query dump and profile, output very large, need special tools to do further processing")
def collect_query_dump_and_profile(
        query: Annotated[str, Field(description="query to execute")],
        db: Annotated[str|None, Field(description="database")] = None,
        ctx: Context = None,
) -> ToolResult:
    logger.info(f"Collecting query dump and profile for query: {query[:100]}{'...' if len(query) > 100 else ''}")
    result : PerfAnalysisInput = db_client.collect_perf_analysis_input(query, db=db, session_id=_safe_session_id(ctx))
    if result.get('error_message'):
        status = f"collecting query dump and profile failed, query_id={result.get('query_id')} error_message={result.get('error_message')}"
        logger.warning(status)
    else:
        status = f"collecting query dump and profile succeeded, but it's only for user/tool, not for AI, query_id={result.get('query_id')}"
~~~

### MV-RP-1cfc382a542a `starrocks-mcp-server-starrocks` / `query_and_plotly_chart`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-1cfc382a542a` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/starrocks-mcp-server-starrocks_88e782b_python/StarRocks-mcp-server-starrocks-88e782b/src/mcp_server_starrocks/server.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/starrocks-mcp-server-starrocks/StarRocks-mcp-server-starrocks-88e782b/src/mcp_server_starrocks/server.py` |
| Tool name | `query_and_plotly_chart` -> `query_and_plotly_chart` |
| Original location | `Other_Tools_and_Integrations/starrocks-mcp-server-starrocks_88e782b_python/StarRocks-mcp-server-starrocks-88e782b/src/mcp_server_starrocks/server.py:580` |
| Mutation location | `Rug Pulls Attacks/starrocks-mcp-server-starrocks/StarRocks-mcp-server-starrocks-88e782b/src/mcp_server_starrocks/server.py:613--614` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `query` |
| Canary | `6e257efc1b` |

#### Original Source Context

Lines 599--611 from the reference file:

~~~python
        db: Optional database name to execute the query in.

    Returns:
        A list containing types.TextContent and types.ImageContent,
        or just types.TextContent in case of an error or no data.
    """
    try:
        logger.info(f'query_and_plotly_chart query:{one_line_summary(query)}, plotly:{one_line_summary(plotly_expr)} format:{format}, db:{db}')
        result = db_client.execute(query, db=db, return_format="pandas", session_id=_safe_session_id(ctx))
        errmsg = None
        if not result.success:
            errmsg = result.error_message
        elif result.pandas is None:
~~~

### MV-RP-c60be2d0346f `theralabs-legion-mcp` / `get_database_info`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-c60be2d0346f` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/databases/theralabs-legion-mcp_0601994_python/TheRaLabs-legion-mcp-0601994/src/database_mcp/mcp_server.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/theralabs-legion-mcp/TheRaLabs-legion-mcp-0601994/src/database_mcp/mcp_server.py` |
| Tool name | `get_database_info` -> `get_database_info` |
| Original location | `databases/theralabs-legion-mcp_0601994_python/TheRaLabs-legion-mcp-0601994/src/database_mcp/mcp_server.py:351` |
| Mutation location | `Rug Pulls Attacks/theralabs-legion-mcp/TheRaLabs-legion-mcp-0601994/src/database_mcp/mcp_server.py:353--354` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `db_id` |
| Canary | `403aa90012` |

#### Original Source Context

Lines 347--359 from the reference file:

~~~python
    
    return "\n".join(table_summaries) if table_summaries else "No tables found in schema"

@mcp.tool()
def get_database_info(ctx: Context, db_id: Optional[str] = None) -> str:
    """Get detailed information about a database including schema summary"""
    db_context: DbContext = ctx.request_context.lifespan_context
    
    if db_id is None:
        # Return info for all databases
        all_info = []
        for curr_db_id, db_config in db_context.db_configs.items():
            info = f"Database ID: {curr_db_id}\n"
~~~

### MV-RP-ff2dd9b25987 `theralabs-legion-mcp` / `execute_query`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-ff2dd9b25987` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/databases/theralabs-legion-mcp_0601994_python/TheRaLabs-legion-mcp-0601994/src/database_mcp/mcp_server.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/theralabs-legion-mcp/TheRaLabs-legion-mcp-0601994/src/database_mcp/mcp_server.py` |
| Tool name | `execute_query` -> `execute_query` |
| Original location | `databases/theralabs-legion-mcp_0601994_python/TheRaLabs-legion-mcp-0601994/src/database_mcp/mcp_server.py:428` |
| Mutation location | `Rug Pulls Attacks/theralabs-legion-mcp/TheRaLabs-legion-mcp-0601994/src/database_mcp/mcp_server.py:432--433` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `query` |
| Canary | `ff0ad5eb26` |

#### Original Source Context

Lines 424--436 from the reference file:

~~~python
    }

# Define tools
@mcp.tool()
def execute_query(query: str, ctx: Context, db_id: str) -> str:
    """Execute a SQL query and return results as a markdown table"""
    try:
        result = _execute_and_get_results(query, ctx, db_id)
        
        # Add database info to the output
        db_info = f"Database: {result['database']['description']} (Type: {result['database']['db_type']})"
        
        # Build a markdown table for output
~~~

### MV-RP-fe84220384e7 `theralabs-legion-mcp` / `execute_query_json`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-fe84220384e7` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/databases/theralabs-legion-mcp_0601994_python/TheRaLabs-legion-mcp-0601994/src/database_mcp/mcp_server.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/theralabs-legion-mcp/TheRaLabs-legion-mcp-0601994/src/database_mcp/mcp_server.py` |
| Tool name | `execute_query_json` -> `execute_query_json` |
| Original location | `databases/theralabs-legion-mcp_0601994_python/TheRaLabs-legion-mcp-0601994/src/database_mcp/mcp_server.py:459` |
| Mutation location | `Rug Pulls Attacks/theralabs-legion-mcp/TheRaLabs-legion-mcp-0601994/src/database_mcp/mcp_server.py:465--466` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `query` |
| Canary | `a120909429` |

#### Original Source Context

Lines 455--467 from the reference file:

~~~python
    except Exception as e:
        return f"Error executing query: {str(e)}"

@mcp.tool()
def execute_query_json(query: str, ctx: Context, db_id: str) -> str:
    """Execute a SQL query and return results as JSON"""
    try:
        result = _execute_and_get_results(query, ctx, db_id)
        
        # Create a more compact representation for JSON output
        output = {
            'database': result['database'],
            'columns': result['column_names'],
~~~

### MV-RP-cefe428ae852 `theralabs-legion-mcp` / `get_table_types`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-cefe428ae852` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/databases/theralabs-legion-mcp_0601994_python/TheRaLabs-legion-mcp-0601994/src/database_mcp/mcp_server.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/theralabs-legion-mcp/TheRaLabs-legion-mcp-0601994/src/database_mcp/mcp_server.py` |
| Tool name | `get_table_types` -> `get_table_types` |
| Original location | `databases/theralabs-legion-mcp_0601994_python/TheRaLabs-legion-mcp-0601994/src/database_mcp/mcp_server.py:500` |
| Mutation location | `Rug Pulls Attacks/theralabs-legion-mcp/TheRaLabs-legion-mcp-0601994/src/database_mcp/mcp_server.py:508--509` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `table_name` |
| Canary | `ec9934b508` |

#### Original Source Context

Lines 496--508 from the reference file:

~~~python
    except Exception as e:
        return f"Error getting columns for table {table_name}: {str(e)}"

@mcp.tool()
def get_table_types(table_name: str, ctx: Context, db_id: str) -> str:
    """Get column types for a specific table"""
    try:
        db_context: DbContext = ctx.request_context.lifespan_context
        
        if db_id not in db_context.db_configs:
            raise ValueError(f"Invalid database ID: {db_id}")
        
        db_config = db_context.db_configs[db_id]
~~~

### MV-RP-39dacdbc226f `theralabs-legion-mcp` / `get_table_sample`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-39dacdbc226f` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/databases/theralabs-legion-mcp_0601994_python/TheRaLabs-legion-mcp-0601994/src/database_mcp/mcp_server.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/theralabs-legion-mcp/TheRaLabs-legion-mcp-0601994/src/database_mcp/mcp_server.py` |
| Tool name | `get_table_sample` -> `get_table_sample` |
| Original location | `databases/theralabs-legion-mcp_0601994_python/TheRaLabs-legion-mcp-0601994/src/database_mcp/mcp_server.py:551` |
| Mutation location | `Rug Pulls Attacks/theralabs-legion-mcp/TheRaLabs-legion-mcp-0601994/src/database_mcp/mcp_server.py:561--562` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `table_name` |
| Canary | `961e23074a` |

#### Original Source Context

Lines 547--559 from the reference file:

~~~python
    except Exception as e:
        return f"Error describing table {table_name}: {str(e)}"

@mcp.tool()
def get_table_sample(ctx: Context, table_name: str, db_id: str, limit: int = 10) -> str:
    """Get a sample of data from a table"""
    try:
        db_context: DbContext = ctx.request_context.lifespan_context
        
        if db_id not in db_context.db_configs:
            return f"Error: Invalid database ID {db_id}"
        
        db_config = db_context.db_configs[db_id]
~~~

### MV-RP-490a7f2cb1c6 `theralabs-legion-mcp` / `find_table`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-490a7f2cb1c6` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/databases/theralabs-legion-mcp_0601994_python/TheRaLabs-legion-mcp-0601994/src/database_mcp/mcp_server.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/theralabs-legion-mcp/TheRaLabs-legion-mcp-0601994/src/database_mcp/mcp_server.py` |
| Tool name | `find_table` -> `find_table` |
| Original location | `databases/theralabs-legion-mcp_0601994_python/TheRaLabs-legion-mcp-0601994/src/database_mcp/mcp_server.py:603` |
| Mutation location | `Rug Pulls Attacks/theralabs-legion-mcp/TheRaLabs-legion-mcp-0601994/src/database_mcp/mcp_server.py:615--616` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `table_name` |
| Canary | `8d31b3120f` |

#### Original Source Context

Lines 599--611 from the reference file:

~~~python
    except Exception as e:
        return f"Error getting sample data from table {table_name}: {str(e)}"

@mcp.tool()
def find_table(table_name: str, ctx: Context) -> str:
    """Find which database contains a specific table"""
    db_context: DbContext = ctx.request_context.lifespan_context
    found_in = []
    
    for db_id, db_config in db_context.db_configs.items():
        if not db_config.schema:
            continue
        
~~~

### MV-RP-8522221c5e3d `zinja-coder-jadx-mcp-server` / `fetch_current_class`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-8522221c5e3d` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/zinja-coder-jadx-mcp-server_a8e5b7d_python/zinja-coder-jadx-mcp-server-a8e5b7d/jadx_mcp_server.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/zinja-coder-jadx-mcp-server/zinja-coder-jadx-mcp-server-a8e5b7d/jadx_mcp_server.py` |
| Tool name | `fetch_current_class` -> `fetch_current_class` |
| Original location | `Other_Tools_and_Integrations/zinja-coder-jadx-mcp-server_a8e5b7d_python/zinja-coder-jadx-mcp-server-a8e5b7d/jadx_mcp_server.py:86` |
| Mutation location | `Rug Pulls Attacks/zinja-coder-jadx-mcp-server/zinja-coder-jadx-mcp-server-a8e5b7d/jadx_mcp_server.py:91--92` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `slim` |
| Canary | `72fa2c39e9` |

#### Original Source Context

Lines 85--97 from the reference file:

~~~python
@mcp.tool()
async def fetch_current_class(slim: bool = True) -> dict:
    """Fetch the currently selected class and its code from the JADX-GUI plugin.

    Kotlin compiler metadata (@Metadata / @DebugMetadata) is stripped by default;
    pass slim=False for a raw dump. Line numbering is unaffected."""
    return await tools.class_tools.fetch_current_class(slim)


@mcp.tool()
async def get_selected_text() -> dict:
    """Returns the currently selected text in the decompiled code view."""
    return await tools.class_tools.get_selected_text()
~~~

### MV-RP-77a3f46c5c1b `zinja-coder-jadx-mcp-server` / `search_method_by_name`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-77a3f46c5c1b` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/zinja-coder-jadx-mcp-server_a8e5b7d_python/zinja-coder-jadx-mcp-server-a8e5b7d/jadx_mcp_server.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/zinja-coder-jadx-mcp-server/zinja-coder-jadx-mcp-server-a8e5b7d/jadx_mcp_server.py` |
| Tool name | `search_method_by_name` -> `search_method_by_name` |
| Original location | `Other_Tools_and_Integrations/zinja-coder-jadx-mcp-server_a8e5b7d_python/zinja-coder-jadx-mcp-server-a8e5b7d/jadx_mcp_server.py:129` |
| Mutation location | `Rug Pulls Attacks/zinja-coder-jadx-mcp-server/zinja-coder-jadx-mcp-server-a8e5b7d/jadx_mcp_server.py:133--134` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `method_name` |
| Canary | `a4207a7d41` |

#### Original Source Context

Lines 125--137 from the reference file:

~~~python
    return await tools.class_tools.get_class_source(class_name, with_line_numbers, slim)


@mcp.tool()
async def search_method_by_name(method_name: str, ctx: Context = None) -> dict:
    """Search for a method name across all classes."""
    report_progress = ctx.report_progress if ctx else None
    return await tools.search_tools.search_method_by_name(method_name, report_progress=report_progress)


@mcp.tool()
async def get_methods_of_class(class_name: str) -> dict:
    """List all method names in a class."""
~~~

### MV-RP-88ec0306c7d0 `zinja-coder-jadx-mcp-server` / `get_methods_of_class`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-88ec0306c7d0` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/zinja-coder-jadx-mcp-server_a8e5b7d_python/zinja-coder-jadx-mcp-server-a8e5b7d/jadx_mcp_server.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/zinja-coder-jadx-mcp-server/zinja-coder-jadx-mcp-server-a8e5b7d/jadx_mcp_server.py` |
| Tool name | `get_methods_of_class` -> `get_methods_of_class` |
| Original location | `Other_Tools_and_Integrations/zinja-coder-jadx-mcp-server_a8e5b7d_python/zinja-coder-jadx-mcp-server-a8e5b7d/jadx_mcp_server.py:136` |
| Mutation location | `Rug Pulls Attacks/zinja-coder-jadx-mcp-server/zinja-coder-jadx-mcp-server-a8e5b7d/jadx_mcp_server.py:142--143` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `class_name` |
| Canary | `5a8babb292` |

#### Original Source Context

Lines 132--144 from the reference file:

~~~python
    return await tools.search_tools.search_method_by_name(method_name, report_progress=report_progress)


@mcp.tool()
async def get_methods_of_class(class_name: str) -> dict:
    """List all method names in a class."""
    return await tools.class_tools.get_methods_of_class(class_name)


@mcp.tool()
async def search_classes_by_keyword(
    search_term: str,
    package: str = "",
~~~

### MV-RP-6c5b639602ed `zinja-coder-jadx-mcp-server` / `get_all_resource_file_names`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-6c5b639602ed` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/zinja-coder-jadx-mcp-server_a8e5b7d_python/zinja-coder-jadx-mcp-server-a8e5b7d/jadx_mcp_server.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/zinja-coder-jadx-mcp-server/zinja-coder-jadx-mcp-server-a8e5b7d/jadx_mcp_server.py` |
| Tool name | `get_all_resource_file_names` -> `get_all_resource_file_names` |
| Original location | `Other_Tools_and_Integrations/zinja-coder-jadx-mcp-server_a8e5b7d_python/zinja-coder-jadx-mcp-server-a8e5b7d/jadx_mcp_server.py:228` |
| Mutation location | `Rug Pulls Attacks/zinja-coder-jadx-mcp-server/zinja-coder-jadx-mcp-server-a8e5b7d/jadx_mcp_server.py:236--237` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `offset` |
| Canary | `ee967a042f` |

#### Original Source Context

Lines 224--236 from the reference file:

~~~python
    return await tools.resource_tools.get_strings(offset, count)


@mcp.tool()
async def get_all_resource_file_names(offset: int = 0, count: int = 0) -> dict:
    """Retrieve all resource files names."""
    return await tools.resource_tools.get_all_resource_file_names(offset, count)


@mcp.tool()
async def get_resource_file(resource_name: str) -> dict:
    """Retrieve resource file content."""
    return await tools.resource_tools.get_resource_file(resource_name)
~~~

### MV-RP-745b939dc398 `zinja-coder-jadx-mcp-server` / `rename_variable`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-745b939dc398` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/zinja-coder-jadx-mcp-server_a8e5b7d_python/zinja-coder-jadx-mcp-server-a8e5b7d/jadx_mcp_server.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/zinja-coder-jadx-mcp-server/zinja-coder-jadx-mcp-server-a8e5b7d/jadx_mcp_server.py` |
| Tool name | `rename_variable` -> `rename_variable` |
| Original location | `Other_Tools_and_Integrations/zinja-coder-jadx-mcp-server_a8e5b7d_python/zinja-coder-jadx-mcp-server-a8e5b7d/jadx_mcp_server.py:312` |
| Mutation location | `Rug Pulls Attacks/zinja-coder-jadx-mcp-server/zinja-coder-jadx-mcp-server-a8e5b7d/jadx_mcp_server.py:322--323` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `class_name` |
| Canary | `587f95101f` |

#### Original Source Context

Lines 308--320 from the reference file:

~~~python
    return await tools.refactor_tools.rename_package(old_package_name, new_package_name)


@mcp.tool()
async def rename_variable(class_name: str, method_name: str, variable_name: str, new_name: str, reg: str | None = None, ssa: str | None = None) -> dict:
    """Renames a specific variable in a method."""
    return await tools.refactor_tools.rename_variable(class_name, method_name, variable_name, new_name, reg, ssa)


@mcp.tool()
async def add_comment(
    class_name: str,
    comment: str,
~~~

### MV-RP-02c62c3b8653 `zinja-coder-jadx-mcp-server` / `get_xrefs_to_class`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RP-02c62c3b8653` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/zinja-coder-jadx-mcp-server_a8e5b7d_python/zinja-coder-jadx-mcp-server-a8e5b7d/jadx_mcp_server.py` |
| Malicious variant tool | `malicious-variant-tools/Rug Pulls Attacks/zinja-coder-jadx-mcp-server/zinja-coder-jadx-mcp-server-a8e5b7d/jadx_mcp_server.py` |
| Tool name | `get_xrefs_to_class` -> `get_xrefs_to_class` |
| Original location | `Other_Tools_and_Integrations/zinja-coder-jadx-mcp-server_a8e5b7d_python/zinja-coder-jadx-mcp-server-a8e5b7d/jadx_mcp_server.py:388` |
| Mutation location | `Rug Pulls Attacks/zinja-coder-jadx-mcp-server/zinja-coder-jadx-mcp-server-a8e5b7d/jadx_mcp_server.py:400--401` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `class_name` |
| Canary | `c647cc4c46` |

#### Original Source Context

Lines 384--396 from the reference file:

~~~python
    return await tools.debug_tools.debug_get_variables()


@mcp.tool()
async def get_xrefs_to_class(class_name: str, offset: int = 0, count: int = 20) -> dict:
    """Find all references to a class."""
    return await tools.xrefs_tools.get_xrefs_to_class(class_name, offset, count)


@mcp.tool()
async def get_xrefs_to_method(
    class_name: str, method_name: str, offset: int = 0, count: int = 20
) -> dict:
~~~

## Tool Index

| ID | Server | Tool | Language | Reference location | Variant location | Mutation form |
|---|---|---|---|---|---|---|
| `MV-RP-8a7d86147d4b` | RobSpectre_mvf1 | `player` | Python | `Sports/RobSpectre_mvf1_6e11cfd_python/mvf1/mcp.py:149` | `Rug Pulls Attacks/RobSpectre_mvf1/mvf1/mcp.py:164` | safe behavior branch insertion |
| `MV-RP-af28c40eb4f4` | RobSpectre_mvf1 | `player_set_bounds` | Python | `Sports/RobSpectre_mvf1_6e11cfd_python/mvf1/mcp.py:294` | `Rug Pulls Attacks/RobSpectre_mvf1/mvf1/mcp.py:329` | safe behavior branch insertion |
| `MV-RP-833b70a94919` | RobSpectre_mvf1 | `player_set_fullscreen` | Python | `Sports/RobSpectre_mvf1_6e11cfd_python/mvf1/mcp.py:377` | `Rug Pulls Attacks/RobSpectre_mvf1/mvf1/mcp.py:400` | safe behavior branch insertion |
| `MV-RP-e000aa51735f` | RobSpectre_mvf1 | `player_set_speedometer_visibility` | Python | `Sports/RobSpectre_mvf1_6e11cfd_python/mvf1/mcp.py:421` | `Rug Pulls Attacks/RobSpectre_mvf1/mvf1/mcp.py:448` | safe behavior branch insertion |
| `MV-RP-f5dc61b82eb2` | RobSpectre_mvf1 | `player_set_driver_header_mode` | Python | `Sports/RobSpectre_mvf1_6e11cfd_python/mvf1/mcp.py:446` | `Rug Pulls Attacks/RobSpectre_mvf1/mvf1/mcp.py:475` | safe behavior branch insertion |
| `MV-RP-c68c22ad7ef7` | RobSpectre_mvf1 | `player_sync` | Python | `Sports/RobSpectre_mvf1_6e11cfd_python/mvf1/mcp.py:495` | `Rug Pulls Attacks/RobSpectre_mvf1/mvf1/mcp.py:522` | safe behavior branch insertion |
| `MV-RP-6feb2c31b026` | alpacahq_alpaca-mcp-server | `update_account_config` | Python | `ai/alpacahq_alpaca-mcp-server_57ecdee_python/src/alpaca_mcp_server/server.py:302` | `Rug Pulls Attacks/alpacahq_alpaca-mcp-server/src/alpaca_mcp_server/server.py:331` | safe behavior branch insertion |
| `MV-RP-b224df4e721b` | alpacahq_alpaca-mcp-server | `get_open_position` | Python | `ai/alpacahq_alpaca-mcp-server_57ecdee_python/src/alpaca_mcp_server/server.py:455` | `Rug Pulls Attacks/alpacahq_alpaca-mcp-server/src/alpaca_mcp_server/server.py:467` | safe behavior branch insertion |
| `MV-RP-2caa5fcba8a9` | alpacahq_alpaca-mcp-server | `update_watchlist_by_id` | Python | `ai/alpacahq_alpaca-mcp-server_57ecdee_python/src/alpaca_mcp_server/server.py:809` | `Rug Pulls Attacks/alpacahq_alpaca-mcp-server/src/alpaca_mcp_server/server.py:825` | safe behavior branch insertion |
| `MV-RP-37fb4202d20b` | alpacahq_alpaca-mcp-server | `get_stock_screener` | Python | `ai/alpacahq_alpaca-mcp-server_57ecdee_python/src/alpaca_mcp_server/server.py:1725` | `Rug Pulls Attacks/alpacahq_alpaca-mcp-server/src/alpaca_mcp_server/server.py:1752` | safe behavior branch insertion |
| `MV-RP-2b2dad85b79f` | alpacahq_alpaca-mcp-server | `get_option_latest_quote` | Python | `ai/alpacahq_alpaca-mcp-server_57ecdee_python/src/alpaca_mcp_server/server.py:2609` | `Rug Pulls Attacks/alpacahq_alpaca-mcp-server/src/alpaca_mcp_server/server.py:2638` | safe behavior branch insertion |
| `MV-RP-d5ef8befef2c` | alpacahq_alpaca-mcp-server | `replace_order_by_id` | Python | `ai/alpacahq_alpaca-mcp-server_57ecdee_python/src/alpaca_mcp_server/server.py:3724` | `Rug Pulls Attacks/alpacahq_alpaca-mcp-server/src/alpaca_mcp_server/server.py:3759` | safe behavior branch insertion |
| `MV-RP-c0c3abc76500` | andybrandt_mcp-simple-openai-assistant | `update_thread` | Python | `Other_Tools_and_Integrations/andybrandt_mcp-simple-openai-assistant_e8303ec_python/mcp_simple_openai_assistant/app.py:94` | `Rug Pulls Attacks/andybrandt_mcp-simple-openai-assistant/mcp_simple_openai_assistant/app.py:103` | safe behavior branch insertion |
| `MV-RP-cc79ac604777` | andybrandt_mcp-simple-openai-assistant | `delete_thread` | Python | `Other_Tools_and_Integrations/andybrandt_mcp-simple-openai-assistant_e8303ec_python/mcp_simple_openai_assistant/app.py:115` | `Rug Pulls Attacks/andybrandt_mcp-simple-openai-assistant/mcp_simple_openai_assistant/app.py:122` | safe behavior branch insertion |
| `MV-RP-ec713f8b7f34` | andybrandt_mcp-simple-openai-assistant | `ask_assistant_in_thread` | Python | `Other_Tools_and_Integrations/andybrandt_mcp-simple-openai-assistant_e8303ec_python/mcp_simple_openai_assistant/app.py:138` | `Rug Pulls Attacks/andybrandt_mcp-simple-openai-assistant/mcp_simple_openai_assistant/app.py:152` | safe behavior branch insertion |
| `MV-RP-de5ef7a4127b` | andybrandt_mcp-simple-openai-assistant | `retrieve_assistant` | Python | `Other_Tools_and_Integrations/andybrandt_mcp-simple-openai-assistant_e8303ec_python/mcp_simple_openai_assistant/app.py:206` | `Rug Pulls Attacks/andybrandt_mcp-simple-openai-assistant/mcp_simple_openai_assistant/app.py:215` | safe behavior branch insertion |
| `MV-RP-ec65e5450659` | andybrandt_mcp-simple-openai-assistant | `update_assistant` | Python | `Other_Tools_and_Integrations/andybrandt_mcp-simple-openai-assistant_e8303ec_python/mcp_simple_openai_assistant/app.py:229` | `Rug Pulls Attacks/andybrandt_mcp-simple-openai-assistant/mcp_simple_openai_assistant/app.py:249` | safe behavior branch insertion |
| `MV-RP-a747461677a8` | ashishroy077_mcp-kusto | `execute_query` | Python | `math-solver/ashishroy077_mcp-kusto_d43b0f9_python/src/kusto_mcp/tools/query_tools.py:29` | `Rug Pulls Attacks/ashishroy077_mcp-kusto/src/kusto_mcp/tools/query_tools.py:40` | safe behavior branch insertion |
| `MV-RP-e731688260d9` | ashishroy077_mcp-kusto | `analyze_data` | Python | `math-solver/ashishroy077_mcp-kusto_d43b0f9_python/src/kusto_mcp/tools/query_tools.py:120` | `Rug Pulls Attacks/ashishroy077_mcp-kusto/src/kusto_mcp/tools/query_tools.py:134` | safe behavior branch insertion |
| `MV-RP-735d5a755d2e` | ashishroy077_mcp-kusto | `optimize_query` | Python | `math-solver/ashishroy077_mcp-kusto_d43b0f9_python/src/kusto_mcp/tools/query_tools.py:270` | `Rug Pulls Attacks/ashishroy077_mcp-kusto/src/kusto_mcp/tools/query_tools.py:284` | safe behavior branch insertion |
| `MV-RP-70196f0206b6` | cohnen-mcp-google-ads | `execute_gaql_query` | Python | `data-analysis/cohnen-mcp-google-ads_461a1d6_python/cohnen-mcp-google-ads-461a1d6/google_ads_server.py:285` | `Rug Pulls Attacks/cohnen-mcp-google-ads/cohnen-mcp-google-ads-461a1d6/google_ads_server.py:305` | safe behavior branch insertion |
| `MV-RP-962530c179ad` | cohnen-mcp-google-ads | `get_campaign_performance` | Python | `data-analysis/cohnen-mcp-google-ads_461a1d6_python/cohnen-mcp-google-ads-461a1d6/google_ads_server.py:358` | `Rug Pulls Attacks/cohnen-mcp-google-ads/cohnen-mcp-google-ads-461a1d6/google_ads_server.py:387` | safe behavior branch insertion |
| `MV-RP-891eda92b1aa` | cohnen-mcp-google-ads | `get_ad_performance` | Python | `data-analysis/cohnen-mcp-google-ads_461a1d6_python/cohnen-mcp-google-ads-461a1d6/google_ads_server.py:404` | `Rug Pulls Attacks/cohnen-mcp-google-ads/cohnen-mcp-google-ads-461a1d6/google_ads_server.py:435` | safe behavior branch insertion |
| `MV-RP-ee10f5a3076f` | cohnen-mcp-google-ads | `run_gaql` | Python | `data-analysis/cohnen-mcp-google-ads_461a1d6_python/cohnen-mcp-google-ads-461a1d6/google_ads_server.py:451` | `Rug Pulls Attacks/cohnen-mcp-google-ads/cohnen-mcp-google-ads-461a1d6/google_ads_server.py:516` | safe behavior branch insertion |
| `MV-RP-959f7b46bbc4` | cohnen-mcp-google-ads | `get_ad_creatives` | Python | `data-analysis/cohnen-mcp-google-ads_461a1d6_python/cohnen-mcp-google-ads-461a1d6/google_ads_server.py:608` | `Rug Pulls Attacks/cohnen-mcp-google-ads/cohnen-mcp-google-ads-461a1d6/google_ads_server.py:638` | safe behavior branch insertion |
| `MV-RP-e82d056c4918` | cohnen-mcp-google-ads | `get_image_assets` | Python | `data-analysis/cohnen-mcp-google-ads_461a1d6_python/cohnen-mcp-google-ads-461a1d6/google_ads_server.py:922` | `Rug Pulls Attacks/cohnen-mcp-google-ads/cohnen-mcp-google-ads-461a1d6/google_ads_server.py:957` | safe behavior branch insertion |
| `MV-RP-9354a95d0d03` | cohnen-mcp-google-ads | `analyze_image_assets` | Python | `data-analysis/cohnen-mcp-google-ads_461a1d6_python/cohnen-mcp-google-ads-461a1d6/google_ads_server.py:1290` | `Rug Pulls Attacks/cohnen-mcp-google-ads/cohnen-mcp-google-ads-461a1d6/google_ads_server.py:1330` | safe behavior branch insertion |
| `MV-RP-5af7f36b2678` | cohnen-mcp-google-ads | `list_resources` | Python | `data-analysis/cohnen-mcp-google-ads_461a1d6_python/cohnen-mcp-google-ads-461a1d6/google_ads_server.py:1444` | `Rug Pulls Attacks/cohnen-mcp-google-ads/cohnen-mcp-google-ads-461a1d6/google_ads_server.py:1472` | safe behavior branch insertion |
| `MV-RP-582d2c6b6af5` | coleam00-supabase-mcp | `read_table_rows` | Python | `Cloud_Platforms/coleam00-supabase-mcp_fc4229e_python/coleam00-supabase-mcp-fc4229e/supabase_mcp/server.py:74` | `Rug Pulls Attacks/coleam00-supabase-mcp/coleam00-supabase-mcp-fc4229e/supabase_mcp/server.py:109` | safe behavior branch insertion |
| `MV-RP-01a00f67015c` | coleam00-supabase-mcp | `create_table_records` | Python | `Cloud_Platforms/coleam00-supabase-mcp_fc4229e_python/coleam00-supabase-mcp-fc4229e/supabase_mcp/server.py:136` | `Rug Pulls Attacks/coleam00-supabase-mcp/coleam00-supabase-mcp-fc4229e/supabase_mcp/server.py:173` | safe behavior branch insertion |
| `MV-RP-d359d4de57b2` | coleam00-supabase-mcp | `update_table_records` | Python | `Cloud_Platforms/coleam00-supabase-mcp_fc4229e_python/coleam00-supabase-mcp-fc4229e/supabase_mcp/server.py:185` | `Rug Pulls Attacks/coleam00-supabase-mcp/coleam00-supabase-mcp-fc4229e/supabase_mcp/server.py:218` | safe behavior branch insertion |
| `MV-RP-a482cac8e5de` | coleam00-supabase-mcp | `delete_table_records` | Python | `Cloud_Platforms/coleam00-supabase-mcp_fc4229e_python/coleam00-supabase-mcp-fc4229e/supabase_mcp/server.py:235` | `Rug Pulls Attacks/coleam00-supabase-mcp/coleam00-supabase-mcp-fc4229e/supabase_mcp/server.py:267` | safe behavior branch insertion |
| `MV-RP-c618e9d42f4d` | crystaldba-postgres-mcp | `list_objects` | Python | `databases/crystaldba-postgres-mcp_15c8e33_python/crystaldba-postgres-mcp-15c8e33/src/postgres_mcp/server.py:123` | `Rug Pulls Attacks/crystaldba-postgres-mcp/crystaldba-postgres-mcp-15c8e33/src/postgres_mcp/server.py:128` | safe behavior branch insertion |
| `MV-RP-f8d5071c6d7d` | crystaldba-postgres-mcp | `get_object_details` | Python | `databases/crystaldba-postgres-mcp_15c8e33_python/crystaldba-postgres-mcp-15c8e33/src/postgres_mcp/server.py:197` | `Rug Pulls Attacks/crystaldba-postgres-mcp/crystaldba-postgres-mcp-15c8e33/src/postgres_mcp/server.py:205` | safe behavior branch insertion |
| `MV-RP-10a71d6c9d12` | crystaldba-postgres-mcp | `explain_query` | Python | `databases/crystaldba-postgres-mcp_15c8e33_python/crystaldba-postgres-mcp-15c8e33/src/postgres_mcp/server.py:336` | `Rug Pulls Attacks/crystaldba-postgres-mcp/crystaldba-postgres-mcp-15c8e33/src/postgres_mcp/server.py:369` | safe behavior branch insertion |
| `MV-RP-1af113eed9a4` | crystaldba-postgres-mcp | `analyze_workload_indexes` | Python | `databases/crystaldba-postgres-mcp_15c8e33_python/crystaldba-postgres-mcp-15c8e33/src/postgres_mcp/server.py:438` | `Rug Pulls Attacks/crystaldba-postgres-mcp/crystaldba-postgres-mcp-15c8e33/src/postgres_mcp/server.py:449` | safe behavior branch insertion |
| `MV-RP-f10aa3f402f7` | crystaldba-postgres-mcp | `analyze_query_indexes` | Python | `databases/crystaldba-postgres-mcp_15c8e33_python/crystaldba-postgres-mcp-15c8e33/src/postgres_mcp/server.py:465` | `Rug Pulls Attacks/crystaldba-postgres-mcp/crystaldba-postgres-mcp-15c8e33/src/postgres_mcp/server.py:479` | safe behavior branch insertion |
| `MV-RP-8b184a6a6720` | crystaldba-postgres-mcp | `get_top_queries` | Python | `databases/crystaldba-postgres-mcp_15c8e33_python/crystaldba-postgres-mcp-15c8e33/src/postgres_mcp/server.py:531` | `Rug Pulls Attacks/crystaldba-postgres-mcp/crystaldba-postgres-mcp-15c8e33/src/postgres_mcp/server.py:549` | safe behavior branch insertion |
| `MV-RP-d59454793ccf` | danielmeppiel-mcp-db-context | `get_tables_schema` | Python | `databases/danielmeppiel-mcp-db-context_37ce2ea_python/danielmeppiel-oracle-mcp-server-37ce2ea/main.py:100` | `Rug Pulls Attacks/danielmeppiel-mcp-db-context/danielmeppiel-oracle-mcp-server-37ce2ea/main.py:107` | safe behavior branch insertion |
| `MV-RP-73736ff0d71f` | danielmeppiel-mcp-db-context | `get_object_source` | Python | `databases/danielmeppiel-mcp-db-context_37ce2ea_python/danielmeppiel-oracle-mcp-server-37ce2ea/main.py:269` | `Rug Pulls Attacks/danielmeppiel-mcp-db-context/danielmeppiel-oracle-mcp-server-37ce2ea/main.py:278` | safe behavior branch insertion |
| `MV-RP-dfe260f737d6` | danielmeppiel-mcp-db-context | `get_table_indexes` | Python | `databases/danielmeppiel-mcp-db-context_37ce2ea_python/danielmeppiel-oracle-mcp-server-37ce2ea/main.py:327` | `Rug Pulls Attacks/danielmeppiel-mcp-db-context/danielmeppiel-oracle-mcp-server-37ce2ea/main.py:338` | safe behavior branch insertion |
| `MV-RP-f1c2e8f5e50a` | danielmeppiel-mcp-db-context | `run_sql_query` | Python | `databases/danielmeppiel-mcp-db-context_37ce2ea_python/danielmeppiel-oracle-mcp-server-37ce2ea/main.py:453` | `Rug Pulls Attacks/danielmeppiel-mcp-db-context/danielmeppiel-oracle-mcp-server-37ce2ea/main.py:466` | safe behavior branch insertion |
| `MV-RP-bad483f027f0` | danielmeppiel-mcp-db-context | `explain_query_plan` | Python | `databases/danielmeppiel-mcp-db-context_37ce2ea_python/danielmeppiel-oracle-mcp-server-37ce2ea/main.py:479` | `Rug Pulls Attacks/danielmeppiel-mcp-db-context/danielmeppiel-oracle-mcp-server-37ce2ea/main.py:497` | safe behavior branch insertion |
| `MV-RP-964ea485c977` | fosdickio-binary_ninja_mcp | `get_il` | Python | `Other_Tools_and_Integrations/fosdickio-binary_ninja_mcp_8c5134e_python/fosdickio-binary_ninja_mcp-8c5134e/bridge/binja_mcp_bridge.py:345` | `Rug Pulls Attacks/fosdickio-binary_ninja_mcp/fosdickio-binary_ninja_mcp-8c5134e/bridge/binja_mcp_bridge.py:351` | safe behavior branch insertion |
| `MV-RP-025c89ff1d18` | fosdickio-binary_ninja_mcp | `fetch_disassembly` | Python | `Other_Tools_and_Integrations/fosdickio-binary_ninja_mcp_8c5134e_python/fosdickio-binary_ninja_mcp-8c5134e/bridge/binja_mcp_bridge.py:371` | `Rug Pulls Attacks/fosdickio-binary_ninja_mcp/fosdickio-binary_ninja_mcp-8c5134e/bridge/binja_mcp_bridge.py:377` | safe behavior branch insertion |
| `MV-RP-26915e2db15a` | fosdickio-binary_ninja_mcp | `list_strings_filter` | Python | `Other_Tools_and_Integrations/fosdickio-binary_ninja_mcp_8c5134e_python/fosdickio-binary_ninja_mcp-8c5134e/bridge/binja_mcp_bridge.py:488` | `Rug Pulls Attacks/fosdickio-binary_ninja_mcp/fosdickio-binary_ninja_mcp-8c5134e/bridge/binja_mcp_bridge.py:496` | safe behavior branch insertion |
| `MV-RP-a7b7f9166bba` | fosdickio-binary_ninja_mcp | `list_namespaces` | Python | `Other_Tools_and_Integrations/fosdickio-binary_ninja_mcp_8c5134e_python/fosdickio-binary_ninja_mcp-8c5134e/bridge/binja_mcp_bridge.py:569` | `Rug Pulls Attacks/fosdickio-binary_ninja_mcp/fosdickio-binary_ninja_mcp-8c5134e/bridge/binja_mcp_bridge.py:579` | safe behavior branch insertion |
| `MV-RP-b801a1c8c55d` | fosdickio-binary_ninja_mcp | `list_data_items` | Python | `Other_Tools_and_Integrations/fosdickio-binary_ninja_mcp_8c5134e_python/fosdickio-binary_ninja_mcp-8c5134e/bridge/binja_mcp_bridge.py:577` | `Rug Pulls Attacks/fosdickio-binary_ninja_mcp/fosdickio-binary_ninja_mcp-8c5134e/bridge/binja_mcp_bridge.py:589` | safe behavior branch insertion |
| `MV-RP-0f90fe82ecdb` | fosdickio-binary_ninja_mcp | `get_xrefs_to_type` | Python | `Other_Tools_and_Integrations/fosdickio-binary_ninja_mcp_8c5134e_python/fosdickio-binary_ninja_mcp-8c5134e/bridge/binja_mcp_bridge.py:720` | `Rug Pulls Attacks/fosdickio-binary_ninja_mcp/fosdickio-binary_ninja_mcp-8c5134e/bridge/binja_mcp_bridge.py:735` | safe behavior branch insertion |
| `MV-RP-edcd1674185e` | jordan-gibbs-hyperresearch | `search_notes` | Python | `ai/jordan-gibbs-hyperresearch_9c16854_python/jordan-gibbs-hyperresearch-9c16854/src/hyperresearch/mcp/server.py:33` | `Rug Pulls Attacks/jordan-gibbs-hyperresearch/jordan-gibbs-hyperresearch-9c16854/src/hyperresearch/mcp/server.py:52` | safe behavior branch insertion |
| `MV-RP-1e428600cc60` | jordan-gibbs-hyperresearch | `read_many` | Python | `ai/jordan-gibbs-hyperresearch_9c16854_python/jordan-gibbs-hyperresearch-9c16854/src/hyperresearch/mcp/server.py:111` | `Rug Pulls Attacks/jordan-gibbs-hyperresearch/jordan-gibbs-hyperresearch-9c16854/src/hyperresearch/mcp/server.py:119` | safe behavior branch insertion |
| `MV-RP-3bbcca9f4576` | jordan-gibbs-hyperresearch | `get_backlinks` | Python | `ai/jordan-gibbs-hyperresearch_9c16854_python/jordan-gibbs-hyperresearch-9c16854/src/hyperresearch/mcp/server.py:174` | `Rug Pulls Attacks/jordan-gibbs-hyperresearch/jordan-gibbs-hyperresearch-9c16854/src/hyperresearch/mcp/server.py:184` | safe behavior branch insertion |
| `MV-RP-594e3114a4ba` | jordan-gibbs-hyperresearch | `get_hubs` | Python | `ai/jordan-gibbs-hyperresearch_9c16854_python/jordan-gibbs-hyperresearch-9c16854/src/hyperresearch/mcp/server.py:193` | `Rug Pulls Attacks/jordan-gibbs-hyperresearch/jordan-gibbs-hyperresearch-9c16854/src/hyperresearch/mcp/server.py:205` | safe behavior branch insertion |
| `MV-RP-93b44f888cd9` | jordan-gibbs-hyperresearch | `check_source` | Python | `ai/jordan-gibbs-hyperresearch_9c16854_python/jordan-gibbs-hyperresearch-9c16854/src/hyperresearch/mcp/server.py:258` | `Rug Pulls Attacks/jordan-gibbs-hyperresearch/jordan-gibbs-hyperresearch-9c16854/src/hyperresearch/mcp/server.py:272` | safe behavior branch insertion |
| `MV-RP-d657ace92380` | jordan-gibbs-hyperresearch | `fetch_url` | Python | `ai/jordan-gibbs-hyperresearch_9c16854_python/jordan-gibbs-hyperresearch-9c16854/src/hyperresearch/mcp/server.py:299` | `Rug Pulls Attacks/jordan-gibbs-hyperresearch/jordan-gibbs-hyperresearch-9c16854/src/hyperresearch/mcp/server.py:317` | safe behavior branch insertion |
| `MV-RP-9f2f2f54f836` | jordan-gibbs-hyperresearch | `create_note` | Python | `ai/jordan-gibbs-hyperresearch_9c16854_python/jordan-gibbs-hyperresearch-9c16854/src/hyperresearch/mcp/server.py:326` | `Rug Pulls Attacks/jordan-gibbs-hyperresearch/jordan-gibbs-hyperresearch-9c16854/src/hyperresearch/mcp/server.py:348` | safe behavior branch insertion |
| `MV-RP-dd2a15570be7` | jordan-gibbs-hyperresearch | `update_note` | Python | `ai/jordan-gibbs-hyperresearch_9c16854_python/jordan-gibbs-hyperresearch-9c16854/src/hyperresearch/mcp/server.py:374` | `Rug Pulls Attacks/jordan-gibbs-hyperresearch/jordan-gibbs-hyperresearch-9c16854/src/hyperresearch/mcp/server.py:398` | safe behavior branch insertion |
| `MV-RP-bb028fcc3563` | jordyzomer-codeql-mcp | `register_database` | Python | `Other_Tools_and_Integrations/jordyzomer-codeql-mcp_7f61c6a_python/JordyZomer-codeql-mcp-7f61c6a/server.py:12` | `Rug Pulls Attacks/jordyzomer-codeql-mcp/JordyZomer-codeql-mcp-7f61c6a/server.py:14` | safe behavior branch insertion |
| `MV-RP-59ebf4a2268e` | jordyzomer-codeql-mcp | `quick_evaluate` | Python | `Other_Tools_and_Integrations/jordyzomer-codeql-mcp_7f61c6a_python/JordyZomer-codeql-mcp-7f61c6a/server.py:40` | `Rug Pulls Attacks/jordyzomer-codeql-mcp/JordyZomer-codeql-mcp-7f61c6a/server.py:46` | safe behavior branch insertion |
| `MV-RP-87f12d0f880b` | jordyzomer-codeql-mcp | `decode_bqrs` | Python | `Other_Tools_and_Integrations/jordyzomer-codeql-mcp_7f61c6a_python/JordyZomer-codeql-mcp-7f61c6a/server.py:60` | `Rug Pulls Attacks/jordyzomer-codeql-mcp/JordyZomer-codeql-mcp-7f61c6a/server.py:66` | safe behavior branch insertion |
| `MV-RP-9906a8a992c7` | jordyzomer-codeql-mcp | `evaluate_query` | Python | `Other_Tools_and_Integrations/jordyzomer-codeql-mcp_7f61c6a_python/JordyZomer-codeql-mcp-7f61c6a/server.py:66` | `Rug Pulls Attacks/jordyzomer-codeql-mcp/JordyZomer-codeql-mcp-7f61c6a/server.py:76` | safe behavior branch insertion |
| `MV-RP-ef53c777f601` | jordyzomer-codeql-mcp | `find_class_position` | Python | `Other_Tools_and_Integrations/jordyzomer-codeql-mcp_7f61c6a_python/JordyZomer-codeql-mcp-7f61c6a/server.py:78` | `Rug Pulls Attacks/jordyzomer-codeql-mcp/JordyZomer-codeql-mcp-7f61c6a/server.py:88` | safe behavior branch insertion |
| `MV-RP-f1c61dee847e` | jordyzomer-codeql-mcp | `find_predicate_position` | Python | `Other_Tools_and_Integrations/jordyzomer-codeql-mcp_7f61c6a_python/JordyZomer-codeql-mcp-7f61c6a/server.py:90` | `Rug Pulls Attacks/jordyzomer-codeql-mcp/JordyZomer-codeql-mcp-7f61c6a/server.py:102` | safe behavior branch insertion |
| `MV-RP-548cd9fc052b` | pab1it0-prometheus-mcp-server | `execute_query` | Python | `developer-tools/pab1it0-prometheus-mcp-server_4c9b377_python/pab1it0-prometheus-mcp-server-4c9b377/src/prometheus_mcp_server/server.py:291` | `Rug Pulls Attacks/pab1it0-prometheus-mcp-server/pab1it0-prometheus-mcp-server-4c9b377/src/prometheus_mcp_server/server.py:301` | safe behavior branch insertion |
| `MV-RP-e3debfe50103` | pab1it0-prometheus-mcp-server | `execute_range_query` | Python | `developer-tools/pab1it0-prometheus-mcp-server_4c9b377_python/pab1it0-prometheus-mcp-server-4c9b377/src/prometheus_mcp_server/server.py:344` | `Rug Pulls Attacks/pab1it0-prometheus-mcp-server/pab1it0-prometheus-mcp-server-4c9b377/src/prometheus_mcp_server/server.py:358` | safe behavior branch insertion |
| `MV-RP-a0b9295e6ac7` | pab1it0-prometheus-mcp-server | `list_metrics` | Python | `developer-tools/pab1it0-prometheus-mcp-server_4c9b377_python/pab1it0-prometheus-mcp-server-4c9b377/src/prometheus_mcp_server/server.py:418` | `Rug Pulls Attacks/pab1it0-prometheus-mcp-server/pab1it0-prometheus-mcp-server-4c9b377/src/prometheus_mcp_server/server.py:445` | safe behavior branch insertion |
| `MV-RP-8017dc588bdc` | pab1it0-prometheus-mcp-server | `get_metric_metadata` | Python | `developer-tools/pab1it0-prometheus-mcp-server_4c9b377_python/pab1it0-prometheus-mcp-server-4c9b377/src/prometheus_mcp_server/server.py:563` | `Rug Pulls Attacks/pab1it0-prometheus-mcp-server/pab1it0-prometheus-mcp-server-4c9b377/src/prometheus_mcp_server/server.py:587` | safe behavior branch insertion |
| `MV-RP-cc9efffd6f91` | pab1it0-prometheus-mcp-server | `get_targets` | Python | `developer-tools/pab1it0-prometheus-mcp-server_4c9b377_python/pab1it0-prometheus-mcp-server-4c9b377/src/prometheus_mcp_server/server.py:643` | `Rug Pulls Attacks/pab1it0-prometheus-mcp-server/pab1it0-prometheus-mcp-server-4c9b377/src/prometheus_mcp_server/server.py:685` | safe behavior branch insertion |
| `MV-RP-558061668da8` | rudra-ravi-wikipedia-mcp | `get_summary` | Python | `Other_Tools_and_Integrations/rudra-ravi-wikipedia-mcp_8857919_python/Rudra-ravi-wikipedia-mcp-8857919/wikipedia_mcp/server.py:260` | `Rug Pulls Attacks/rudra-ravi-wikipedia-mcp/Rudra-ravi-wikipedia-mcp-8857919/wikipedia_mcp/server.py:268` | safe behavior branch insertion |
| `MV-RP-6d8d48ac6703` | rudra-ravi-wikipedia-mcp | `summarize_article_for_query` | Python | `Other_Tools_and_Integrations/rudra-ravi-wikipedia-mcp_8857919_python/Rudra-ravi-wikipedia-mcp-8857919/wikipedia_mcp/server.py:274` | `Rug Pulls Attacks/rudra-ravi-wikipedia-mcp/Rudra-ravi-wikipedia-mcp-8857919/wikipedia_mcp/server.py:288` | safe behavior branch insertion |
| `MV-RP-fa4d5f22e68f` | rudra-ravi-wikipedia-mcp | `summarize_article_section` | Python | `Other_Tools_and_Integrations/rudra-ravi-wikipedia-mcp_8857919_python/Rudra-ravi-wikipedia-mcp-8857919/wikipedia_mcp/server.py:290` | `Rug Pulls Attacks/rudra-ravi-wikipedia-mcp/Rudra-ravi-wikipedia-mcp-8857919/wikipedia_mcp/server.py:305` | safe behavior branch insertion |
| `MV-RP-92bcb8dab76d` | rudra-ravi-wikipedia-mcp | `extract_key_facts` | Python | `Other_Tools_and_Integrations/rudra-ravi-wikipedia-mcp_8857919_python/Rudra-ravi-wikipedia-mcp-8857919/wikipedia_mcp/server.py:305` | `Rug Pulls Attacks/rudra-ravi-wikipedia-mcp/Rudra-ravi-wikipedia-mcp-8857919/wikipedia_mcp/server.py:322` | safe behavior branch insertion |
| `MV-RP-239917211937` | rudra-ravi-wikipedia-mcp | `get_sections` | Python | `Other_Tools_and_Integrations/rudra-ravi-wikipedia-mcp_8857919_python/Rudra-ravi-wikipedia-mcp-8857919/wikipedia_mcp/server.py:332` | `Rug Pulls Attacks/rudra-ravi-wikipedia-mcp/Rudra-ravi-wikipedia-mcp-8857919/wikipedia_mcp/server.py:347` | safe behavior branch insertion |
| `MV-RP-e1fc425d7105` | rudra-ravi-wikipedia-mcp | `get_links` | Python | `Other_Tools_and_Integrations/rudra-ravi-wikipedia-mcp_8857919_python/Rudra-ravi-wikipedia-mcp-8857919/wikipedia_mcp/server.py:343` | `Rug Pulls Attacks/rudra-ravi-wikipedia-mcp/Rudra-ravi-wikipedia-mcp-8857919/wikipedia_mcp/server.py:360` | safe behavior branch insertion |
| `MV-RP-48d06c7fc156` | sjkim1127-reversecore_mcp | `find_similar_patterns` | Python | `Other_Tools_and_Integrations/sjkim1127-reversecore_mcp_c1c5767_python/sjkim1127-Reversecore_MCP-c1c5767/reversecore_mcp/tools/common/memory_tools.py:393` | `Rug Pulls Attacks/sjkim1127-reversecore_mcp/sjkim1127-Reversecore_MCP-c1c5767/reversecore_mcp/tools/common/memory_tools.py:414` | safe behavior branch insertion |
| `MV-RP-475d1189cd0b` | sjkim1127-reversecore_mcp | `update_memory_session_time` | Python | `Other_Tools_and_Integrations/sjkim1127-reversecore_mcp_c1c5767_python/sjkim1127-Reversecore_MCP-c1c5767/reversecore_mcp/tools/common/memory_tools.py:478` | `Rug Pulls Attacks/sjkim1127-reversecore_mcp/sjkim1127-Reversecore_MCP-c1c5767/reversecore_mcp/tools/common/memory_tools.py:496` | safe behavior branch insertion |
| `MV-RP-502b49ac5fe3` | sjkim1127-reversecore_mcp | `Radare2_open_file` | Python | `Other_Tools_and_Integrations/sjkim1127-reversecore_mcp_c1c5767_python/sjkim1127-Reversecore_MCP-c1c5767/reversecore_mcp/tools/radare2/radare2_mcp_tools.py:315` | `Rug Pulls Attacks/sjkim1127-reversecore_mcp/sjkim1127-Reversecore_MCP-c1c5767/reversecore_mcp/tools/radare2/radare2_mcp_tools.py:330` | safe behavior branch insertion |
| `MV-RP-742bbab60b26` | sjkim1127-reversecore_mcp | `Radare2_close_file` | Python | `Other_Tools_and_Integrations/sjkim1127-reversecore_mcp_c1c5767_python/sjkim1127-Reversecore_MCP-c1c5767/reversecore_mcp/tools/radare2/radare2_mcp_tools.py:366` | `Rug Pulls Attacks/sjkim1127-reversecore_mcp/sjkim1127-Reversecore_MCP-c1c5767/reversecore_mcp/tools/radare2/radare2_mcp_tools.py:378` | safe behavior branch insertion |
| `MV-RP-bef295673954` | sjkim1127-reversecore_mcp | `Radare2_list_strings` | Python | `Other_Tools_and_Integrations/sjkim1127-reversecore_mcp_c1c5767_python/sjkim1127-Reversecore_MCP-c1c5767/reversecore_mcp/tools/radare2/radare2_mcp_tools.py:860` | `Rug Pulls Attacks/sjkim1127-reversecore_mcp/sjkim1127-Reversecore_MCP-c1c5767/reversecore_mcp/tools/radare2/radare2_mcp_tools.py:882` | safe behavior branch insertion |
| `MV-RP-95cf2fb49a8c` | sjkim1127-reversecore_mcp | `Radare2_set_comment` | Python | `Other_Tools_and_Integrations/sjkim1127-reversecore_mcp_c1c5767_python/sjkim1127-Reversecore_MCP-c1c5767/reversecore_mcp/tools/radare2/radare2_mcp_tools.py:1477` | `Rug Pulls Attacks/sjkim1127-reversecore_mcp/sjkim1127-Reversecore_MCP-c1c5767/reversecore_mcp/tools/radare2/radare2_mcp_tools.py:1500` | safe behavior branch insertion |
| `MV-RP-b50311945d02` | starrocks-mcp-server-starrocks | `read_query` | Python | `Other_Tools_and_Integrations/starrocks-mcp-server-starrocks_88e782b_python/StarRocks-mcp-server-starrocks-88e782b/src/mcp_server_starrocks/server.py:335` | `Rug Pulls Attacks/starrocks-mcp-server-starrocks/StarRocks-mcp-server-starrocks-88e782b/src/mcp_server_starrocks/server.py:344` | safe behavior branch insertion |
| `MV-RP-818583367cad` | starrocks-mcp-server-starrocks | `write_query` | Python | `Other_Tools_and_Integrations/starrocks-mcp-server-starrocks_88e782b_python/StarRocks-mcp-server-starrocks-88e782b/src/mcp_server_starrocks/server.py:391` | `Rug Pulls Attacks/starrocks-mcp-server-starrocks/StarRocks-mcp-server-starrocks-88e782b/src/mcp_server_starrocks/server.py:396` | safe behavior branch insertion |
| `MV-RP-4e0cc4f53b9d` | starrocks-mcp-server-starrocks | `analyze_query` | Python | `Other_Tools_and_Integrations/starrocks-mcp-server-starrocks_88e782b_python/StarRocks-mcp-server-starrocks-88e782b/src/mcp_server_starrocks/server.py:425` | `Rug Pulls Attacks/starrocks-mcp-server-starrocks/StarRocks-mcp-server-starrocks-88e782b/src/mcp_server_starrocks/server.py:436` | safe behavior branch insertion |
| `MV-RP-4e2f8db0a076` | starrocks-mcp-server-starrocks | `collect_query_dump_and_profile` | Python | `Other_Tools_and_Integrations/starrocks-mcp-server-starrocks_88e782b_python/StarRocks-mcp-server-starrocks-88e782b/src/mcp_server_starrocks/server.py:448` | `Rug Pulls Attacks/starrocks-mcp-server-starrocks/StarRocks-mcp-server-starrocks-88e782b/src/mcp_server_starrocks/server.py:459` | safe behavior branch insertion |
| `MV-RP-1cfc382a542a` | starrocks-mcp-server-starrocks | `query_and_plotly_chart` | Python | `Other_Tools_and_Integrations/starrocks-mcp-server-starrocks_88e782b_python/StarRocks-mcp-server-starrocks-88e782b/src/mcp_server_starrocks/server.py:580` | `Rug Pulls Attacks/starrocks-mcp-server-starrocks/StarRocks-mcp-server-starrocks-88e782b/src/mcp_server_starrocks/server.py:613` | safe behavior branch insertion |
| `MV-RP-c60be2d0346f` | theralabs-legion-mcp | `get_database_info` | Python | `databases/theralabs-legion-mcp_0601994_python/TheRaLabs-legion-mcp-0601994/src/database_mcp/mcp_server.py:351` | `Rug Pulls Attacks/theralabs-legion-mcp/TheRaLabs-legion-mcp-0601994/src/database_mcp/mcp_server.py:353` | safe behavior branch insertion |
| `MV-RP-ff2dd9b25987` | theralabs-legion-mcp | `execute_query` | Python | `databases/theralabs-legion-mcp_0601994_python/TheRaLabs-legion-mcp-0601994/src/database_mcp/mcp_server.py:428` | `Rug Pulls Attacks/theralabs-legion-mcp/TheRaLabs-legion-mcp-0601994/src/database_mcp/mcp_server.py:432` | safe behavior branch insertion |
| `MV-RP-fe84220384e7` | theralabs-legion-mcp | `execute_query_json` | Python | `databases/theralabs-legion-mcp_0601994_python/TheRaLabs-legion-mcp-0601994/src/database_mcp/mcp_server.py:459` | `Rug Pulls Attacks/theralabs-legion-mcp/TheRaLabs-legion-mcp-0601994/src/database_mcp/mcp_server.py:465` | safe behavior branch insertion |
| `MV-RP-cefe428ae852` | theralabs-legion-mcp | `get_table_types` | Python | `databases/theralabs-legion-mcp_0601994_python/TheRaLabs-legion-mcp-0601994/src/database_mcp/mcp_server.py:500` | `Rug Pulls Attacks/theralabs-legion-mcp/TheRaLabs-legion-mcp-0601994/src/database_mcp/mcp_server.py:508` | safe behavior branch insertion |
| `MV-RP-39dacdbc226f` | theralabs-legion-mcp | `get_table_sample` | Python | `databases/theralabs-legion-mcp_0601994_python/TheRaLabs-legion-mcp-0601994/src/database_mcp/mcp_server.py:551` | `Rug Pulls Attacks/theralabs-legion-mcp/TheRaLabs-legion-mcp-0601994/src/database_mcp/mcp_server.py:561` | safe behavior branch insertion |
| `MV-RP-490a7f2cb1c6` | theralabs-legion-mcp | `find_table` | Python | `databases/theralabs-legion-mcp_0601994_python/TheRaLabs-legion-mcp-0601994/src/database_mcp/mcp_server.py:603` | `Rug Pulls Attacks/theralabs-legion-mcp/TheRaLabs-legion-mcp-0601994/src/database_mcp/mcp_server.py:615` | safe behavior branch insertion |
| `MV-RP-8522221c5e3d` | zinja-coder-jadx-mcp-server | `fetch_current_class` | Python | `Other_Tools_and_Integrations/zinja-coder-jadx-mcp-server_a8e5b7d_python/zinja-coder-jadx-mcp-server-a8e5b7d/jadx_mcp_server.py:86` | `Rug Pulls Attacks/zinja-coder-jadx-mcp-server/zinja-coder-jadx-mcp-server-a8e5b7d/jadx_mcp_server.py:91` | safe behavior branch insertion |
| `MV-RP-77a3f46c5c1b` | zinja-coder-jadx-mcp-server | `search_method_by_name` | Python | `Other_Tools_and_Integrations/zinja-coder-jadx-mcp-server_a8e5b7d_python/zinja-coder-jadx-mcp-server-a8e5b7d/jadx_mcp_server.py:129` | `Rug Pulls Attacks/zinja-coder-jadx-mcp-server/zinja-coder-jadx-mcp-server-a8e5b7d/jadx_mcp_server.py:133` | safe behavior branch insertion |
| `MV-RP-88ec0306c7d0` | zinja-coder-jadx-mcp-server | `get_methods_of_class` | Python | `Other_Tools_and_Integrations/zinja-coder-jadx-mcp-server_a8e5b7d_python/zinja-coder-jadx-mcp-server-a8e5b7d/jadx_mcp_server.py:136` | `Rug Pulls Attacks/zinja-coder-jadx-mcp-server/zinja-coder-jadx-mcp-server-a8e5b7d/jadx_mcp_server.py:142` | safe behavior branch insertion |
| `MV-RP-6c5b639602ed` | zinja-coder-jadx-mcp-server | `get_all_resource_file_names` | Python | `Other_Tools_and_Integrations/zinja-coder-jadx-mcp-server_a8e5b7d_python/zinja-coder-jadx-mcp-server-a8e5b7d/jadx_mcp_server.py:228` | `Rug Pulls Attacks/zinja-coder-jadx-mcp-server/zinja-coder-jadx-mcp-server-a8e5b7d/jadx_mcp_server.py:236` | safe behavior branch insertion |
| `MV-RP-745b939dc398` | zinja-coder-jadx-mcp-server | `rename_variable` | Python | `Other_Tools_and_Integrations/zinja-coder-jadx-mcp-server_a8e5b7d_python/zinja-coder-jadx-mcp-server-a8e5b7d/jadx_mcp_server.py:312` | `Rug Pulls Attacks/zinja-coder-jadx-mcp-server/zinja-coder-jadx-mcp-server-a8e5b7d/jadx_mcp_server.py:322` | safe behavior branch insertion |
| `MV-RP-02c62c3b8653` | zinja-coder-jadx-mcp-server | `get_xrefs_to_class` | Python | `Other_Tools_and_Integrations/zinja-coder-jadx-mcp-server_a8e5b7d_python/zinja-coder-jadx-mcp-server-a8e5b7d/jadx_mcp_server.py:388` | `Rug Pulls Attacks/zinja-coder-jadx-mcp-server/zinja-coder-jadx-mcp-server-a8e5b7d/jadx_mcp_server.py:400` | safe behavior branch insertion |
