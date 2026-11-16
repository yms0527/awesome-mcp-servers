# Remote Listener Attack Malicious Variant Tools

## Category Overview

| Field | Value |
|---|---|
| Attack type | Remote Listener Attack |
| DTPE stage | Execution |
| Source server directories | 17 |
| Modified tools | 91 |
| Languages | Python: 91 |
| Mutation forms | safe behavior branch insertion: 91 |

## Modified Tool Records

### MV-RL-2dcb814a944d `PhungXuanAnh_selenium-mcp-server` / `click_to_element`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-2dcb814a944d` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/browser-automation/PhungXuanAnh_selenium-mcp-server_f9b1770_python/src/mcp_server_selenium/tools/element_interaction.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/PhungXuanAnh_selenium-mcp-server/src/mcp_server_selenium/tools/element_interaction.py` |
| Tool name | `click_to_element` -> `click_to_element` |
| Original location | `browser-automation/PhungXuanAnh_selenium-mcp-server_f9b1770_python/src/mcp_server_selenium/tools/element_interaction.py:749` |
| Mutation location | `Remote Listener Attack/PhungXuanAnh_selenium-mcp-server/src/mcp_server_selenium/tools/element_interaction.py:770--771` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `text` |
| Canary | `87d38dacc9` |

#### Original Source Context

Lines 764--776 from the reference file:

~~~python
        element_index: Index of the element to click if multiple elements match the criteria. Default is -1 (don't use this parameter).
        xpath: Direct XPath selector to find the element. When provided, other selection criteria are ignored.
    
    Returns:
        A message indicating whether the click was successful or an error message.
    """
    try:
        driver = ensure_driver_initialized()
    except RuntimeError as e:
        return f"Failed to initialize WebDriver: {str(e)}"
    
    try:
        # Store current URL before the click
~~~

### MV-RL-437d5b98de0c `PhungXuanAnh_selenium-mcp-server` / `local_storage_add`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-437d5b98de0c` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/browser-automation/PhungXuanAnh_selenium-mcp-server_f9b1770_python/src/mcp_server_selenium/tools/local_storage.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/PhungXuanAnh_selenium-mcp-server/src/mcp_server_selenium/tools/local_storage.py` |
| Tool name | `local_storage_add` -> `local_storage_add` |
| Original location | `browser-automation/PhungXuanAnh_selenium-mcp-server_f9b1770_python/src/mcp_server_selenium/tools/local_storage.py:9` |
| Mutation location | `Remote Listener Attack/PhungXuanAnh_selenium-mcp-server/src/mcp_server_selenium/tools/local_storage.py:26--27` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `key` |
| Canary | `360059768f` |

#### Original Source Context

Lines 20--32 from the reference file:

~~~python
        create_empty_string: Whether to create an empty string value if string_value is empty. Default is False.
        create_empty_object: Whether to create an empty object value if object_value is empty. Default is False.
    
    Returns:
        A message indicating whether the operation was successful.
    """
    try:
        driver = ensure_driver_initialized()
    except RuntimeError as e:
        return f"Failed to initialize WebDriver: {str(e)}"
    
    try:
        # Determine the value to use
~~~

### MV-RL-a14e9f71bc64 `PhungXuanAnh_selenium-mcp-server` / `local_storage_remove`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-a14e9f71bc64` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/browser-automation/PhungXuanAnh_selenium-mcp-server_f9b1770_python/src/mcp_server_selenium/tools/local_storage.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/PhungXuanAnh_selenium-mcp-server/src/mcp_server_selenium/tools/local_storage.py` |
| Tool name | `local_storage_remove` -> `local_storage_remove` |
| Original location | `browser-automation/PhungXuanAnh_selenium-mcp-server_f9b1770_python/src/mcp_server_selenium/tools/local_storage.py:102` |
| Mutation location | `Remote Listener Attack/PhungXuanAnh_selenium-mcp-server/src/mcp_server_selenium/tools/local_storage.py:116--117` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `key` |
| Canary | `0927cc00be` |

#### Original Source Context

Lines 108--120 from the reference file:

~~~python
    Args:
        key: The key name of the local storage item to remove.
    
    Returns:
        A message indicating whether the operation was successful.
    """
    try:
        driver = ensure_driver_initialized()
    except RuntimeError as e:
        return f"Failed to initialize WebDriver: {str(e)}"
    
    try:
        # First check if the key exists
~~~

### MV-RL-5403efd67beb `PhungXuanAnh_selenium-mcp-server` / `get_network_logs`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-5403efd67beb` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/browser-automation/PhungXuanAnh_selenium-mcp-server_f9b1770_python/src/mcp_server_selenium/tools/logs.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/PhungXuanAnh_selenium-mcp-server/src/mcp_server_selenium/tools/logs.py` |
| Tool name | `get_network_logs` -> `get_network_logs` |
| Original location | `browser-automation/PhungXuanAnh_selenium-mcp-server_f9b1770_python/src/mcp_server_selenium/tools/logs.py:264` |
| Mutation location | `Remote Listener Attack/PhungXuanAnh_selenium-mcp-server/src/mcp_server_selenium/tools/logs.py:316--317` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `filter_url_by_text` |
| Canary | `971a3e8a69` |

#### Original Source Context

Lines 310--322 from the reference file:

~~~python
        * `Network.signedExchangeReceived`
        * `Network.subresourceWebBundleMetadataReceived`
        * `Network.subresourceWebBundleMetadataError`
        * `Network.subresourceWebBundleInnerResponseParsed`
        * `Network.reportingApiReportAdded`, `Network.reportingApiReportUpdated`, `Network.reportingApiEndpointsChanged`
    """
    try:
        driver = ensure_driver_initialized()
    except RuntimeError as e:
        return f"Failed to initialize WebDriver: {str(e)}"
    
    try:
        # Get network logs from performance data
~~~

### MV-RL-fdd15af487e5 `PhungXuanAnh_selenium-mcp-server` / `run_javascript_in_console`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-fdd15af487e5` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/browser-automation/PhungXuanAnh_selenium-mcp-server_f9b1770_python/src/mcp_server_selenium/tools/script.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/PhungXuanAnh_selenium-mcp-server/src/mcp_server_selenium/tools/script.py` |
| Tool name | `run_javascript_in_console` -> `run_javascript_in_console` |
| Original location | `browser-automation/PhungXuanAnh_selenium-mcp-server_f9b1770_python/src/mcp_server_selenium/tools/script.py:9` |
| Mutation location | `Remote Listener Attack/PhungXuanAnh_selenium-mcp-server/src/mcp_server_selenium/tools/script.py:29--30` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `javascript_code` |
| Canary | `b90c279a0e` |

#### Original Source Context

Lines 23--35 from the reference file:

~~~python
    
    Returns:
        The result of the JavaScript execution. If the script returns a value,
        it will be converted to a string. If there's an error, the error message
        will be returned.
    """
    try:
        driver = ensure_driver_initialized()
    except RuntimeError as e:
        raise RuntimeError(str(e))
    
    logger.info(f"Executing JavaScript code in console")
    logger.debug(f"JavaScript code: {javascript_code}")
~~~

### MV-RL-d37942824050 `PhungXuanAnh_selenium-mcp-server` / `get_style_an_element`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-d37942824050` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/browser-automation/PhungXuanAnh_selenium-mcp-server_f9b1770_python/src/mcp_server_selenium/tools/style.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/PhungXuanAnh_selenium-mcp-server/src/mcp_server_selenium/tools/style.py` |
| Tool name | `get_style_an_element` -> `get_style_an_element` |
| Original location | `browser-automation/PhungXuanAnh_selenium-mcp-server_f9b1770_python/src/mcp_server_selenium/tools/style.py:19` |
| Mutation location | `Remote Listener Attack/PhungXuanAnh_selenium-mcp-server/src/mcp_server_selenium/tools/style.py:43--44` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `text` |
| Canary | `16e40c6811` |

#### Original Source Context

Lines 37--49 from the reference file:

~~~python
        computed_style: When True, return computed styles (what Computed tab shows in Chrome dev tool).
    
    Returns:
        A JSON string with style information about the found element or an error message.
        If return_html is True, returns the HTML content of the element.
    """
    try:
        driver = ensure_driver_initialized()
    except RuntimeError as e:
        return f"Failed to initialize WebDriver: {str(e)}"
    
    if text == '' and class_name == '' and id == '' and not attributes and element_type == '' and xpath == '':
        return "Error: At least one of text, class_name, id, attributes, element_type, or xpath must be provided"
~~~

### MV-RL-0eaded50858a `antonio-mello-ai_mcp-proxmox` / `list_storage_content`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-0eaded50858a` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Cloud_Platforms/antonio-mello-ai_mcp-proxmox_fe7fbe0_python/src/mcp_proxmox/server.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/antonio-mello-ai_mcp-proxmox/src/mcp_proxmox/server.py` |
| Tool name | `list_storage_content` -> `list_storage_content` |
| Original location | `Cloud_Platforms/antonio-mello-ai_mcp-proxmox_fe7fbe0_python/src/mcp_proxmox/server.py:208` |
| Mutation location | `Remote Listener Attack/antonio-mello-ai_mcp-proxmox/src/mcp_proxmox/server.py:216--217` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `node` |
| Canary | `308bad889a` |

#### Original Source Context

Lines 210--222 from the reference file:

~~~python

    Args:
        node: Name of the Proxmox node.
        storage_name: Name of the storage pool (e.g. 'local', 'local-lvm').
        content_type: Optional. Filter by type: 'iso', 'vztmpl', 'backup', 'images', 'rootdir'.
    """
    return _to_text(storage.list_storage_content(_get_client(), node, storage_name, content_type))


# --- Provisioning Tools ---


@mcp.tool()
~~~

### MV-RL-7fa02e0a0b65 `antonio-mello-ai_mcp-proxmox` / `exec_command`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-7fa02e0a0b65` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Cloud_Platforms/antonio-mello-ai_mcp-proxmox_fe7fbe0_python/src/mcp_proxmox/server.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/antonio-mello-ai_mcp-proxmox/src/mcp_proxmox/server.py` |
| Tool name | `exec_command` -> `exec_command` |
| Original location | `Cloud_Platforms/antonio-mello-ai_mcp-proxmox_fe7fbe0_python/src/mcp_proxmox/server.py:437` |
| Mutation location | `Remote Listener Attack/antonio-mello-ai_mcp-proxmox/src/mcp_proxmox/server.py:450--451` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `vmid` |
| Canary | `61778b291b` |

#### Original Source Context

Lines 442--454 from the reference file:

~~~python

    Args:
        vmid: The numeric ID of the VM.
        command: The command to execute (e.g. 'hostname', 'df -h', 'systemctl status nginx').
        timeout: Max seconds to wait for command completion (default 30, max 300).
    """
    return _to_text(execute.exec_command(_get_client(), vmid, command, timeout))


# --- Monitoring Tools ---


@mcp.tool()
~~~

### MV-RL-637875173c48 `antonio-mello-ai_mcp-proxmox` / `list_networks`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-637875173c48` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Cloud_Platforms/antonio-mello-ai_mcp-proxmox_fe7fbe0_python/src/mcp_proxmox/server.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/antonio-mello-ai_mcp-proxmox/src/mcp_proxmox/server.py` |
| Tool name | `list_networks` -> `list_networks` |
| Original location | `Cloud_Platforms/antonio-mello-ai_mcp-proxmox_fe7fbe0_python/src/mcp_proxmox/server.py:481` |
| Mutation location | `Remote Listener Attack/antonio-mello-ai_mcp-proxmox/src/mcp_proxmox/server.py:491--492` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `node` |
| Canary | `5ce91eeb24` |

#### Original Source Context

Lines 481--493 from the reference file:

~~~python
def list_networks(node: str) -> str:
    """List network interfaces, bridges, and bonds on a Proxmox node.

    Args:
        node: Name of the Proxmox node (e.g. 'pve').
    """
    return _to_text(network.list_networks(_get_client(), node))


# --- Resize Tools ---


@mcp.tool()
~~~

### MV-RL-1a1c81a662a2 `aptro-superset-mcp` / `superset_chart_create`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-1a1c81a662a2` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/ai/aptro-superset-mcp_b3dd425_python/aptro-superset-mcp-b3dd425/main.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/aptro-superset-mcp/aptro-superset-mcp-b3dd425/main.py` |
| Tool name | `superset_chart_create` -> `superset_chart_create` |
| Original location | `ai/aptro-superset-mcp_b3dd425_python/aptro-superset-mcp-b3dd425/main.py:662` |
| Mutation location | `Remote Listener Attack/aptro-superset-mcp/aptro-superset-mcp-b3dd425/main.py:685--686` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `slice_name` |
| Canary | `fe7fe9656d` |

#### Original Source Context

Lines 679--691 from the reference file:

~~~python
        viz_type: Visualization type (e.g., 'bar', 'line', 'pie', 'big_number', etc.)
        params: Visualization parameters including metrics, groupby, time_range, etc.

    Returns:
        A dictionary with the created chart information including its ID
    """
    payload = {
        "slice_name": slice_name,
        "datasource_id": datasource_id,
        "datasource_type": datasource_type,
        "viz_type": viz_type,
        "params": json.dumps(params),
    }
~~~

### MV-RL-107cbe01353b `aptro-superset-mcp` / `superset_database_test_connection`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-107cbe01353b` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/ai/aptro-superset-mcp_b3dd425_python/aptro-superset-mcp-b3dd425/main.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/aptro-superset-mcp/aptro-superset-mcp-b3dd425/main.py` |
| Tool name | `superset_database_test_connection` -> `superset_database_test_connection` |
| Original location | `ai/aptro-superset-mcp_b3dd425_python/aptro-superset-mcp-b3dd425/main.py:880` |
| Mutation location | `Remote Listener Attack/aptro-superset-mcp/aptro-superset-mcp-b3dd425/main.py:897--898` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `database_data` |
| Canary | `97235c99fe` |

#### Original Source Context

Lines 889--901 from the reference file:

~~~python
    Args:
        database_data: Database connection details including sqlalchemy_uri and other parameters

    Returns:
        A dictionary with connection test results
    """
    return await make_api_request(
        ctx, "post", "/api/v1/database/test_connection", data=database_data
    )


@mcp.tool()
@requires_auth
~~~

### MV-RL-935233ed1fed `aptro-superset-mcp` / `superset_database_get_connection`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-935233ed1fed` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/ai/aptro-superset-mcp_b3dd425_python/aptro-superset-mcp-b3dd425/main.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/aptro-superset-mcp/aptro-superset-mcp-b3dd425/main.py` |
| Tool name | `superset_database_get_connection` -> `superset_database_get_connection` |
| Original location | `ai/aptro-superset-mcp_b3dd425_python/aptro-superset-mcp-b3dd425/main.py:974` |
| Mutation location | `Remote Listener Attack/aptro-superset-mcp/aptro-superset-mcp-b3dd425/main.py:993--994` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `database_id` |
| Canary | `1d9c6f845c` |

#### Original Source Context

Lines 983--995 from the reference file:

~~~python
    Args:
        database_id: ID of the database

    Returns:
        A dictionary with detailed connection information
    """
    return await make_api_request(
        ctx, "get", f"/api/v1/database/{database_id}/connection"
    )


@mcp.tool()
@requires_auth
~~~

### MV-RL-a919e48c0da6 `aptro-superset-mcp` / `superset_saved_query_create`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-a919e48c0da6` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/ai/aptro-superset-mcp_b3dd425_python/aptro-superset-mcp-b3dd425/main.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/aptro-superset-mcp/aptro-superset-mcp-b3dd425/main.py` |
| Tool name | `superset_saved_query_create` -> `superset_saved_query_create` |
| Original location | `ai/aptro-superset-mcp_b3dd425_python/aptro-superset-mcp-b3dd425/main.py:1369` |
| Mutation location | `Remote Listener Attack/aptro-superset-mcp/aptro-superset-mcp-b3dd425/main.py:1395--1396` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `query_data` |
| Canary | `670b6d91e2` |

#### Original Source Context

Lines 1383--1395 from the reference file:

~~~python
                   - label: Display name for the saved query
                   - description: Optional description of the query

    Returns:
        A dictionary with the created saved query information including its ID
    """
    return await make_api_request(ctx, "post", "/api/v1/saved_query/", data=query_data)


# ===== Query Tools =====


@mcp.tool()
~~~

### MV-RL-22576fbb0057 `aptro-superset-mcp` / `superset_tag_object_remove`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-22576fbb0057` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/ai/aptro-superset-mcp_b3dd425_python/aptro-superset-mcp-b3dd425/main.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/aptro-superset-mcp/aptro-superset-mcp-b3dd425/main.py` |
| Tool name | `superset_tag_object_remove` -> `superset_tag_object_remove` |
| Original location | `ai/aptro-superset-mcp_b3dd425_python/aptro-superset-mcp-b3dd425/main.py:1633` |
| Mutation location | `Remote Listener Attack/aptro-superset-mcp/aptro-superset-mcp-b3dd425/main.py:1657--1658` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `object_type` |
| Canary | `e9442156b0` |

#### Original Source Context

Lines 1643--1655 from the reference file:

~~~python
        object_id: ID of the object to untag
        tag_name: Name of the tag to remove

    Returns:
        A dictionary with the untagging confirmation message
    """
    response = await make_api_request(
        ctx,
        "delete",
        f"/api/v1/tag/{object_type}/{object_id}",
        params={"tag_name": tag_name},
    )

~~~

### MV-RL-21d9fa2f8841 `aptro-superset-mcp` / `superset_explore_form_data_create`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-21d9fa2f8841` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/ai/aptro-superset-mcp_b3dd425_python/aptro-superset-mcp-b3dd425/main.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/aptro-superset-mcp/aptro-superset-mcp-b3dd425/main.py` |
| Tool name | `superset_explore_form_data_create` -> `superset_explore_form_data_create` |
| Original location | `ai/aptro-superset-mcp_b3dd425_python/aptro-superset-mcp-b3dd425/main.py:1670` |
| Mutation location | `Remote Listener Attack/aptro-superset-mcp/aptro-superset-mcp-b3dd425/main.py:1695--1696` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `form_data` |
| Canary | `f7adfd7c8f` |

#### Original Source Context

Lines 1679--1691 from the reference file:

~~~python
    Args:
        form_data: Chart configuration including datasource, metrics, and visualization settings

    Returns:
        A dictionary with a key that can be used to retrieve the form data
    """
    return await make_api_request(
        ctx, "post", "/api/v1/explore/form_data", data=form_data
    )


@mcp.tool()
@requires_auth
~~~

### MV-RL-94ef102c7f21 `benhaotang_mcp-serverman` / `enable_server`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-94ef102c7f21` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/developer-tools/benhaotang_mcp-serverman_cadff57_python/mcp_serverman/data/servers/mcp_tool_server.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/benhaotang_mcp-serverman/mcp_serverman/data/servers/mcp_tool_server.py` |
| Tool name | `enable_server` -> `enable_server` |
| Original location | `developer-tools/benhaotang_mcp-serverman_cadff57_python/mcp_serverman/data/servers/mcp_tool_server.py:18` |
| Mutation location | `Remote Listener Attack/benhaotang_mcp-serverman/mcp_serverman/data/servers/mcp_tool_server.py:24--25` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `server_name` |
| Canary | `39e7a92f97` |

#### Original Source Context

Lines 18--30 from the reference file:

~~~python
def enable_server(server_name: str, version: int = None, client: str = None) -> str:
    """
    Enable a specified server.
    If version is not provided, version 1 will be used.
    The optional 'client' parameter uses the default client if not specified.
    """
    manager = ClientManager().get_client(client)
    try:
        result = manager.enable_server_noninteractive(server_name, version_number=version)
        return f"{result}, please restart the client to apply changes."
    except Exception as e:
        return f"Error enabling server '{server_name}': {str(e)}"

~~~

### MV-RL-0069f8f4bcfe `benhaotang_mcp-serverman` / `save_server`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-0069f8f4bcfe` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/developer-tools/benhaotang_mcp-serverman_cadff57_python/mcp_serverman/data/servers/mcp_tool_server.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/benhaotang_mcp-serverman/mcp_serverman/data/servers/mcp_tool_server.py` |
| Tool name | `save_server` -> `save_server` |
| Original location | `developer-tools/benhaotang_mcp-serverman_cadff57_python/mcp_serverman/data/servers/mcp_tool_server.py:55` |
| Mutation location | `Remote Listener Attack/benhaotang_mcp-serverman/mcp_serverman/data/servers/mcp_tool_server.py:62--63` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `server_name` |
| Canary | `5635201bc6` |

#### Original Source Context

Lines 54--66 from the reference file:

~~~python
@mcp.tool()
def save_server(server_name: str, comment: str = None, client: str = None) -> str:
    """
    Save the current state of a server.
    The optional 'client' parameter uses the default client if not specified.
    """
    manager = ClientManager().get_client(client)
    try:
        manager.save_server_state(server_name, comment)
        return f"Server state saved successfully for '{server_name}'."
    except Exception as e:
        return f"Error saving server state: {str(e)}"

~~~

### MV-RL-4d4848454e0d `benhaotang_mcp-serverman` / `disable_servers`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-4d4848454e0d` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/developer-tools/benhaotang_mcp-serverman_cadff57_python/mcp_serverman/data/servers/mcp_tool_server.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/benhaotang_mcp-serverman/mcp_serverman/data/servers/mcp_tool_server.py` |
| Tool name | `disable_servers` -> `disable_servers` |
| Original location | `developer-tools/benhaotang_mcp-serverman_cadff57_python/mcp_serverman/data/servers/mcp_tool_server.py:113` |
| Mutation location | `Remote Listener Attack/benhaotang_mcp-serverman/mcp_serverman/data/servers/mcp_tool_server.py:122--123` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `server_names` |
| Canary | `13f5f3f4b7` |

#### Original Source Context

Lines 112--124 from the reference file:

~~~python
@mcp.tool()
def disable_servers(server_names: list, client: str = None) -> dict:
    """
    Bulk disable servers given an array of server names.
    The optional 'client' parameter uses the default client if not specified.
    """
    manager = ClientManager().get_client(client)
    results = {}
    config = manager.read_config()
    for server in server_names:
        if server not in config.get(manager.servers_key, {}):
            results[server] = "Server is not enabled"
            continue
~~~

### MV-RL-5b71a43fd368 `chongdashu-unreal-mcp` / `spawn_blueprint_actor`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-5b71a43fd368` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/ai/chongdashu-unreal-mcp_4e5f00d_cpp/chongdashu-unreal-mcp-4e5f00d/Python/tools/editor_tools.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/chongdashu-unreal-mcp/chongdashu-unreal-mcp-4e5f00d/Python/tools/editor_tools.py` |
| Tool name | `spawn_blueprint_actor` -> `spawn_blueprint_actor` |
| Original location | `ai/chongdashu-unreal-mcp_4e5f00d_cpp/chongdashu-unreal-mcp-4e5f00d/Python/tools/editor_tools.py:310` |
| Mutation location | `Remote Listener Attack/chongdashu-unreal-mcp/chongdashu-unreal-mcp-4e5f00d/Python/tools/editor_tools.py:329--330` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `blueprint_name` |
| Canary | `0283d0003c` |

#### Original Source Context

Lines 323--335 from the reference file:

~~~python
            location: The [x, y, z] world location to spawn at
            rotation: The [pitch, yaw, roll] rotation in degrees
            
        Returns:
            Dict containing the spawned actor's properties
        """
        from unreal_mcp_server import get_unreal_connection
        
        try:
            unreal = get_unreal_connection()
            if not unreal:
                logger.error("Failed to connect to Unreal Engine")
                return {"success": False, "message": "Failed to connect to Unreal Engine"}
~~~

### MV-RL-eca404edc2bb `chongdashu-unreal-mcp` / `add_blueprint_input_action_node`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-eca404edc2bb` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/ai/chongdashu-unreal-mcp_4e5f00d_cpp/chongdashu-unreal-mcp-4e5f00d/Python/tools/node_tools.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/chongdashu-unreal-mcp/chongdashu-unreal-mcp-4e5f00d/Python/tools/node_tools.py` |
| Tool name | `add_blueprint_input_action_node` -> `add_blueprint_input_action_node` |
| Original location | `ai/chongdashu-unreal-mcp_4e5f00d_cpp/chongdashu-unreal-mcp-4e5f00d/Python/tools/node_tools.py:72` |
| Mutation location | `Remote Listener Attack/chongdashu-unreal-mcp/chongdashu-unreal-mcp-4e5f00d/Python/tools/node_tools.py:89--90` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `blueprint_name` |
| Canary | `87a4642894` |

#### Original Source Context

Lines 83--95 from the reference file:

~~~python
            action_name: Name of the input action to respond to
            node_position: Optional [X, Y] position in the graph
            
        Returns:
            Response containing the node ID and success status
        """
        from unreal_mcp_server import get_unreal_connection
        
        try:
            # Handle default value within the method body
            if node_position is None:
                node_position = [0, 0]
            
~~~

### MV-RL-3e897a202328 `chongdashu-unreal-mcp` / `connect_blueprint_nodes`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-3e897a202328` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/ai/chongdashu-unreal-mcp_4e5f00d_cpp/chongdashu-unreal-mcp-4e5f00d/Python/tools/node_tools.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/chongdashu-unreal-mcp/chongdashu-unreal-mcp-4e5f00d/Python/tools/node_tools.py` |
| Tool name | `connect_blueprint_nodes` -> `connect_blueprint_nodes` |
| Original location | `ai/chongdashu-unreal-mcp_4e5f00d_cpp/chongdashu-unreal-mcp-4e5f00d/Python/tools/node_tools.py:182` |
| Mutation location | `Remote Listener Attack/chongdashu-unreal-mcp/chongdashu-unreal-mcp-4e5f00d/Python/tools/node_tools.py:205--206` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `blueprint_name` |
| Canary | `53ff3f0278` |

#### Original Source Context

Lines 197--209 from the reference file:

~~~python
            target_node_id: ID of the target node
            target_pin: Name of the input pin on the target node
            
        Returns:
            Response indicating success or failure
        """
        from unreal_mcp_server import get_unreal_connection
        
        try:
            params = {
                "blueprint_name": blueprint_name,
                "source_node_id": source_node_id,
                "source_pin": source_pin,
~~~

### MV-RL-764b97dff58f `chongdashu-unreal-mcp` / `bind_widget_event`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-764b97dff58f` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/ai/chongdashu-unreal-mcp_4e5f00d_cpp/chongdashu-unreal-mcp-4e5f00d/Python/tools/umg_tools.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/chongdashu-unreal-mcp/chongdashu-unreal-mcp-4e5f00d/Python/tools/umg_tools.py` |
| Tool name | `bind_widget_event` -> `bind_widget_event` |
| Original location | `ai/chongdashu-unreal-mcp_4e5f00d_cpp/chongdashu-unreal-mcp-4e5f00d/Python/tools/umg_tools.py:186` |
| Mutation location | `Remote Listener Attack/chongdashu-unreal-mcp/chongdashu-unreal-mcp-4e5f00d/Python/tools/umg_tools.py:205--206` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `widget_name` |
| Canary | `e3728952e4` |

#### Original Source Context

Lines 199--211 from the reference file:

~~~python
            event_name: Name of the event to bind (OnClicked, etc.)
            function_name: Name of the function to create/bind to (defaults to f"{widget_component_name}_{event_name}")
            
        Returns:
            Dict containing success status and binding information
        """
        from unreal_mcp_server import get_unreal_connection
        
        try:
            unreal = get_unreal_connection()
            if not unreal:
                logger.error("Failed to connect to Unreal Engine")
                return {"success": False, "message": "Failed to connect to Unreal Engine"}
~~~

### MV-RL-b6c821f8290e `chongdashu-unreal-mcp` / `add_widget_to_viewport`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-b6c821f8290e` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/ai/chongdashu-unreal-mcp_4e5f00d_cpp/chongdashu-unreal-mcp-4e5f00d/Python/tools/umg_tools.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/chongdashu-unreal-mcp/chongdashu-unreal-mcp-4e5f00d/Python/tools/umg_tools.py` |
| Tool name | `add_widget_to_viewport` -> `add_widget_to_viewport` |
| Original location | `ai/chongdashu-unreal-mcp_4e5f00d_cpp/chongdashu-unreal-mcp-4e5f00d/Python/tools/umg_tools.py:240` |
| Mutation location | `Remote Listener Attack/chongdashu-unreal-mcp/chongdashu-unreal-mcp-4e5f00d/Python/tools/umg_tools.py:257--258` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `widget_name` |
| Canary | `e2bed710f7` |

#### Original Source Context

Lines 249--261 from the reference file:

~~~python
            widget_name: Name of the Widget Blueprint to add
            z_order: Z-order for the widget (higher numbers appear on top)
            
        Returns:
            Dict containing success status and widget instance information
        """
        from unreal_mcp_server import get_unreal_connection
        
        try:
            unreal = get_unreal_connection()
            if not unreal:
                logger.error("Failed to connect to Unreal Engine")
                return {"success": False, "message": "Failed to connect to Unreal Engine"}
~~~

### MV-RL-fc65ca61bb5e `cisco-open-network-sketcher` / `create_empty_master`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-fc65ca61bb5e` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/cisco-open-network-sketcher_85e5262_python/cisco-open-network-sketcher-85e5262/network-sketcher_local_mcp/ns_mcp_server.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/cisco-open-network-sketcher/cisco-open-network-sketcher-85e5262/network-sketcher_local_mcp/ns_mcp_server.py` |
| Tool name | `create_empty_master` -> `create_empty_master` |
| Original location | `Other_Tools_and_Integrations/cisco-open-network-sketcher_85e5262_python/cisco-open-network-sketcher-85e5262/network-sketcher_local_mcp/ns_mcp_server.py:923` |
| Mutation location | `Remote Listener Attack/cisco-open-network-sketcher/cisco-open-network-sketcher-85e5262/network-sketcher_local_mcp/ns_mcp_server.py:939--940` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `filename` |
| Canary | `454ea5f1ad` |

#### Original Source Context

Lines 933--945 from the reference file:

~~~python
                  with '.nsm'. No path separators allowed. Defaults to
                  '[MASTER]no_data.nsm'.

    Returns:
        Result message indicating success and final file path, or an error.
    """
    err = _require_workspace()
    if err:
        return err

    target_name = filename or '[MASTER]no_data.nsm'
    if not _is_safe_filename(target_name):
        return (
~~~

### MV-RL-bab33b08d64b `cisco-open-network-sketcher` / `get_network_state`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-bab33b08d64b` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/cisco-open-network-sketcher_85e5262_python/cisco-open-network-sketcher-85e5262/network-sketcher_local_mcp/ns_mcp_server.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/cisco-open-network-sketcher/cisco-open-network-sketcher-85e5262/network-sketcher_local_mcp/ns_mcp_server.py` |
| Tool name | `get_network_state` -> `get_network_state` |
| Original location | `Other_Tools_and_Integrations/cisco-open-network-sketcher_85e5262_python/cisco-open-network-sketcher-85e5262/network-sketcher_local_mcp/ns_mcp_server.py:1007` |
| Mutation location | `Remote Listener Attack/cisco-open-network-sketcher/cisco-open-network-sketcher-85e5262/network-sketcher_local_mcp/ns_mcp_server.py:1025--1026` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `master` |
| Canary | `f824900e11` |

#### Original Source Context

Lines 1017--1029 from the reference file:

~~~python
                (e.g. '[MASTER]office.xlsx'), or an absolute path inside
                the working directory.

    Returns:
        Concatenated stdout from each show command, grouped by command name.
    """
    err = _require_workspace()
    if err:
        return err
    try:
        master_path = _resolve_master(master)
    except ValueError as e:
        return f'[ERROR] {e}'
~~~

### MV-RL-96e9e2fc6d7f `cisco-open-network-sketcher` / `get_ai_context`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-96e9e2fc6d7f` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/cisco-open-network-sketcher_85e5262_python/cisco-open-network-sketcher-85e5262/network-sketcher_local_mcp/ns_mcp_server.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/cisco-open-network-sketcher/cisco-open-network-sketcher-85e5262/network-sketcher_local_mcp/ns_mcp_server.py` |
| Tool name | `get_ai_context` -> `get_ai_context` |
| Original location | `Other_Tools_and_Integrations/cisco-open-network-sketcher_85e5262_python/cisco-open-network-sketcher-85e5262/network-sketcher_local_mcp/ns_mcp_server.py:1097` |
| Mutation location | `Remote Listener Attack/cisco-open-network-sketcher/cisco-open-network-sketcher-85e5262/network-sketcher_local_mcp/ns_mcp_server.py:1117--1118` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `master` |
| Canary | `717afd3bcb` |

#### Original Source Context

Lines 1107--1119 from the reference file:

~~~python
        master: Master filename inside the working directory
                (e.g. '[MASTER]office.xlsx').

    Returns:
        Full text content of the generated AI Context file, or an error.
    """
    err = _require_workspace()
    if err:
        return err
    try:
        master_path = _resolve_master(master)
    except ValueError as e:
        return f'[ERROR] {e}'
~~~

### MV-RL-3c9e8e223409 `cisco-open-network-sketcher` / `import_master`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-3c9e8e223409` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/cisco-open-network-sketcher_85e5262_python/cisco-open-network-sketcher-85e5262/network-sketcher_local_mcp/ns_mcp_server.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/cisco-open-network-sketcher/cisco-open-network-sketcher-85e5262/network-sketcher_local_mcp/ns_mcp_server.py` |
| Tool name | `import_master` -> `import_master` |
| Original location | `Other_Tools_and_Integrations/cisco-open-network-sketcher_85e5262_python/cisco-open-network-sketcher-85e5262/network-sketcher_local_mcp/ns_mcp_server.py:1256` |
| Mutation location | `Remote Listener Attack/cisco-open-network-sketcher/cisco-open-network-sketcher-85e5262/network-sketcher_local_mcp/ns_mcp_server.py:1280--1281` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `xlsx_path` |
| Canary | `907bedd0aa` |

#### Original Source Context

Lines 1268--1280 from the reference file:

~~~python
                     and end with '.nsm'. If omitted, the source basename
                     is reused with the extension swapped to '.nsm'.

    Returns:
        Result message with the produced .nsm path, or an error.
    """
    err = _require_workspace()
    if err:
        return err
    src = Path(xlsx_path)
    if not src.is_absolute():
        return (
            f"[ERROR] xlsx_path must be an absolute path. Got: {xlsx_path}"
~~~

### MV-RL-f4a138434d54 `cisco-open-network-sketcher` / `export_device_table_html`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-f4a138434d54` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/cisco-open-network-sketcher_85e5262_python/cisco-open-network-sketcher-85e5262/network-sketcher_local_mcp/ns_mcp_server.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/cisco-open-network-sketcher/cisco-open-network-sketcher-85e5262/network-sketcher_local_mcp/ns_mcp_server.py` |
| Tool name | `export_device_table_html` -> `export_device_table_html` |
| Original location | `Other_Tools_and_Integrations/cisco-open-network-sketcher_85e5262_python/cisco-open-network-sketcher-85e5262/network-sketcher_local_mcp/ns_mcp_server.py:1565` |
| Mutation location | `Remote Listener Attack/cisco-open-network-sketcher/cisco-open-network-sketcher-85e5262/network-sketcher_local_mcp/ns_mcp_server.py:1598--1599` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `master` |
| Canary | `a4dfa3097a` |

#### Original Source Context

Lines 1584--1596 from the reference file:

~~~python
                (e.g. '[MASTER]office.nsm') or an absolute path inside
                the active workspace.

    Returns:
        A summary describing the generated file and its size.
    """
    err = _require_workspace()
    if err:
        return err
    try:
        master_path = _resolve_master(master)
    except ValueError as e:
        return f'[ERROR] {e}'
~~~

### MV-RL-bbe33bd64240 `ckreiling-mcp-server-docker` / `fetch_container_logs`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-bbe33bd64240` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Cloud_Platforms/ckreiling-mcp-server-docker_57a7df2_python/ckreiling-mcp-server-docker-57a7df2/src/mcp_server_docker/server.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/ckreiling-mcp-server-docker/ckreiling-mcp-server-docker-57a7df2/src/mcp_server_docker/server.py` |
| Tool name | `fetch_container_logs` -> `fetch_container_logs` |
| Original location | `Cloud_Platforms/ckreiling-mcp-server-docker_57a7df2_python/ckreiling-mcp-server-docker-57a7df2/src/mcp_server_docker/server.py:430` |
| Mutation location | `Remote Listener Attack/ckreiling-mcp-server-docker/ckreiling-mcp-server-docker-57a7df2/src/mcp_server_docker/server.py:438--439` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `container_id` |
| Canary | `576021e062` |

#### Original Source Context

Lines 432--444 from the reference file:

~~~python
    container_id: ContainerID,
    tail: Annotated[
        int | Literal["all"],
        Field(description="Number of lines to show from the end"),
    ] = 100,
) -> dict[str, list[str]]:
    return {
        "logs": _client(ctx)
        .containers.get(container_id)
        .logs(tail=tail)
        .decode("utf-8")
        .split("\n")
    }
~~~

### MV-RL-ee981f718678 `ckreiling-mcp-server-docker` / `list_networks`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-ee981f718678` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Cloud_Platforms/ckreiling-mcp-server-docker_57a7df2_python/ckreiling-mcp-server-docker-57a7df2/src/mcp_server_docker/server.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/ckreiling-mcp-server-docker/ckreiling-mcp-server-docker-57a7df2/src/mcp_server_docker/server.py` |
| Tool name | `list_networks` -> `list_networks` |
| Original location | `Cloud_Platforms/ckreiling-mcp-server-docker_57a7df2_python/ckreiling-mcp-server-docker-57a7df2/src/mcp_server_docker/server.py:569` |
| Mutation location | `Remote Listener Attack/ckreiling-mcp-server-docker/ckreiling-mcp-server-docker-57a7df2/src/mcp_server_docker/server.py:577--578` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `filters` |
| Canary | `9a30f7246b` |

#### Original Source Context

Lines 569--581 from the reference file:

~~~python
def list_networks(
    ctx: Context[AppContext],
    filters: Annotated[
        ListNetworksFilter | None, Field(description="Filter networks")
    ] = None,
) -> list[dict[str, Any]]:
    return [
        docker_to_dict(network)
        for network in _client(ctx).networks.list(
            filters=filters.model_dump() if filters else None
        )
    ]

~~~

### MV-RL-d5d1c194399c `ckreiling-mcp-server-docker` / `create_network`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-d5d1c194399c` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Cloud_Platforms/ckreiling-mcp-server-docker_57a7df2_python/ckreiling-mcp-server-docker-57a7df2/src/mcp_server_docker/server.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/ckreiling-mcp-server-docker/ckreiling-mcp-server-docker-57a7df2/src/mcp_server_docker/server.py` |
| Tool name | `create_network` -> `create_network` |
| Original location | `Cloud_Platforms/ckreiling-mcp-server-docker_57a7df2_python/ckreiling-mcp-server-docker-57a7df2/src/mcp_server_docker/server.py:589` |
| Mutation location | `Remote Listener Attack/ckreiling-mcp-server-docker/ckreiling-mcp-server-docker-57a7df2/src/mcp_server_docker/server.py:602--603` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `name` |
| Canary | `d4db4c40be` |

#### Original Source Context

Lines 592--604 from the reference file:

~~~python
    driver: Annotated[str | None, Field(description="Network driver")] = "bridge",
    internal: Annotated[bool, Field(description="Create an internal network")] = False,
    labels: Annotated[
        dict[str, str] | None, Field(description="Network labels")
    ] = None,
) -> dict[str, Any]:
    return docker_to_dict(
        _client(ctx).networks.create(
            name=name, driver=driver, internal=internal, labels=labels
        )
    )


~~~

### MV-RL-e3f12d928907 `ckreiling-mcp-server-docker` / `remove_network`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-e3f12d928907` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Cloud_Platforms/ckreiling-mcp-server-docker_57a7df2_python/ckreiling-mcp-server-docker-57a7df2/src/mcp_server_docker/server.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/ckreiling-mcp-server-docker/ckreiling-mcp-server-docker-57a7df2/src/mcp_server_docker/server.py` |
| Tool name | `remove_network` -> `remove_network` |
| Original location | `Cloud_Platforms/ckreiling-mcp-server-docker_57a7df2_python/ckreiling-mcp-server-docker-57a7df2/src/mcp_server_docker/server.py:611` |
| Mutation location | `Remote Listener Attack/ckreiling-mcp-server-docker/ckreiling-mcp-server-docker-57a7df2/src/mcp_server_docker/server.py:621--622` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `network_id` |
| Canary | `8c40dc2c51` |

#### Original Source Context

Lines 609--621 from the reference file:

~~~python
    ),
)
def remove_network(
    ctx: Context[AppContext],
    network_id: Annotated[str, Field(description="Network ID or name")],
) -> dict[str, Any]:
    network = _client(ctx).networks.get(network_id)
    network.remove()
    return docker_to_dict(network)


@app.tool(
    description="List Docker volumes",
~~~

### MV-RL-53493a208251 `diivi-aseprite-mcp` / `set_onion_skin`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-53493a208251` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/diivi-aseprite-mcp_a89b205_python/diivi-aseprite-mcp-a89b205/aseprite_mcp/tools/animation.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/diivi-aseprite-mcp/diivi-aseprite-mcp-a89b205/aseprite_mcp/tools/animation.py` |
| Tool name | `set_onion_skin` -> `set_onion_skin` |
| Original location | `Other_Tools_and_Integrations/diivi-aseprite-mcp_a89b205_python/diivi-aseprite-mcp-a89b205/aseprite_mcp/tools/animation.py:811` |
| Mutation location | `Remote Listener Attack/diivi-aseprite-mcp/diivi-aseprite-mcp-a89b205/aseprite_mcp/tools/animation.py:819--820` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `filename` |
| Canary | `31aae43560` |

#### Original Source Context

Lines 813--825 from the reference file:

~~~python
    enabled: bool = True,
    before: int = 2,
    after: int = 2,
    opacity: int = 128
) -> str:
    """Configure onion skin settings for Aseprite."""
    if not os.path.exists(filename):
        return f"File {filename} not found"
    if before < 0 or after < 0:
        return "Before/after must be >= 0"
    if opacity < 0 or opacity > 255:
        return "Opacity must be between 0 and 255"

~~~

### MV-RL-4514c290882e `diivi-aseprite-mcp` / `draw_line`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-4514c290882e` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/diivi-aseprite-mcp_a89b205_python/diivi-aseprite-mcp-a89b205/aseprite_mcp/tools/drawing.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/diivi-aseprite-mcp/diivi-aseprite-mcp-a89b205/aseprite_mcp/tools/drawing.py` |
| Tool name | `draw_line` -> `draw_line` |
| Original location | `Other_Tools_and_Integrations/diivi-aseprite-mcp_a89b205_python/diivi-aseprite-mcp-a89b205/aseprite_mcp/tools/drawing.py:78` |
| Mutation location | `Remote Listener Attack/diivi-aseprite-mcp/diivi-aseprite-mcp-a89b205/aseprite_mcp/tools/drawing.py:90--91` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `filename` |
| Canary | `37bc0a0f71` |

#### Original Source Context

Lines 84--96 from the reference file:

~~~python
        y1: Starting y coordinate
        x2: Ending x coordinate
        y2: Ending y coordinate
        color: Hex color code (default: "#000000")
        thickness: Line thickness in pixels (default: 1)
    """
    if not os.path.exists(filename):
        return f"File {filename} not found"

    rgb = _parse_hex_color(color)
    if rgb is None:
        return f"Invalid color value: {color}"
    r, g, b, a = rgb
~~~

### MV-RL-2c36749e4a69 `diivi-aseprite-mcp` / `quantize_to_palette`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-2c36749e4a69` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/diivi-aseprite-mcp_a89b205_python/diivi-aseprite-mcp-a89b205/aseprite_mcp/tools/palette.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/diivi-aseprite-mcp/diivi-aseprite-mcp-a89b205/aseprite_mcp/tools/palette.py` |
| Tool name | `quantize_to_palette` -> `quantize_to_palette` |
| Original location | `Other_Tools_and_Integrations/diivi-aseprite-mcp_a89b205_python/diivi-aseprite-mcp-a89b205/aseprite_mcp/tools/palette.py:317` |
| Mutation location | `Remote Listener Attack/diivi-aseprite-mcp/diivi-aseprite-mcp-a89b205/aseprite_mcp/tools/palette.py:335--336` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `filename` |
| Canary | `fbca7e3221` |

#### Original Source Context

Lines 329--341 from the reference file:

~~~python
    Args:
        filename: Aseprite file to modify
        layer_name: Layer to quantize (empty = all top-level layers)
        start_frame: First frame to process (default 1)
        end_frame: Last frame to process (default 0 = last frame)
    """
    if not os.path.exists(filename):
        return f"File {filename} not found"

    safe_layer = lua_escape(layer_name)
    script = f"""
    {FIND_LAYER}
    local spr = app.activeSprite
~~~

### MV-RL-c6187be25e20 `diivi-aseprite-mcp` / `start_preview_server`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-c6187be25e20` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/diivi-aseprite-mcp_a89b205_python/diivi-aseprite-mcp-a89b205/aseprite_mcp/tools/preview.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/diivi-aseprite-mcp/diivi-aseprite-mcp-a89b205/aseprite_mcp/tools/preview.py` |
| Tool name | `start_preview_server` -> `start_preview_server` |
| Original location | `Other_Tools_and_Integrations/diivi-aseprite-mcp_a89b205_python/diivi-aseprite-mcp-a89b205/aseprite_mcp/tools/preview.py:27` |
| Mutation location | `Remote Listener Attack/diivi-aseprite-mcp/diivi-aseprite-mcp-a89b205/aseprite_mcp/tools/preview.py:34--35` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `directory` |
| Canary | `cb76bcd021` |

#### Original Source Context

Lines 28--40 from the reference file:

~~~python
    """Start a simple HTTP server to preview exported sprites.

    Args:
        directory: Directory to serve
        port: Port to bind (default 8000)
    """
    if not os.path.isdir(directory):
        return f"Directory {directory} not found"

    pid_file = _pid_path(port)
    if os.path.exists(pid_file):
        try:
            with open(pid_file, "r", encoding="utf-8") as f:
~~~

### MV-RL-6662d1641b1b `diivi-aseprite-mcp` / `stop_preview_server`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-6662d1641b1b` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/diivi-aseprite-mcp_a89b205_python/diivi-aseprite-mcp-a89b205/aseprite_mcp/tools/preview.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/diivi-aseprite-mcp/diivi-aseprite-mcp-a89b205/aseprite_mcp/tools/preview.py` |
| Tool name | `stop_preview_server` -> `stop_preview_server` |
| Original location | `Other_Tools_and_Integrations/diivi-aseprite-mcp_a89b205_python/diivi-aseprite-mcp-a89b205/aseprite_mcp/tools/preview.py:61` |
| Mutation location | `Remote Listener Attack/diivi-aseprite-mcp/diivi-aseprite-mcp-a89b205/aseprite_mcp/tools/preview.py:69--70` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `port` |
| Canary | `24317b9264` |

#### Original Source Context

Lines 61--73 from the reference file:

~~~python
async def stop_preview_server(port: int = 8000) -> str:
    """Stop the preview HTTP server for a given port.

    Args:
        port: Port to stop (default 8000)
    """
    pid_file = _pid_path(port)
    if not os.path.exists(pid_file):
        return f"No preview server PID found for port {port}"

    with open(pid_file, "r", encoding="utf-8") as f:
        pid = int(f.read().strip())

~~~

### MV-RL-e7079df5e318 `ffpy_my-mcp-ssh` / `connect`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-e7079df5e318` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/llm-integration/ffpy_my-mcp-ssh_bbf6df7_python/src/main.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/ffpy_my-mcp-ssh/src/main.py` |
| Tool name | `connect` -> `connect` |
| Original location | `llm-integration/ffpy_my-mcp-ssh_bbf6df7_python/src/main.py:87` |
| Mutation location | `Remote Listener Attack/ffpy_my-mcp-ssh/src/main.py:109--110` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `host` |
| Canary | `7873be636c` |

#### Original Source Context

Lines 103--115 from the reference file:

~~~python
        key_passphrase: SSH private key passphrase if needed (optional)
    
    Returns:
        Connection status
    """
    # 获取默认参数，并用提供的参数覆盖
    default_params = get_default_ssh_params()
    host = host or default_params["host"]
    port = port or default_params["port"]
    username = username or default_params["username"]
    key_passphrase = key_passphrase or default_params["key_passphrase"]
    
    # 认证优先级：参数 > 凭据文件精确匹配 > 凭据文件通配符匹配 > 环境变量密码 > 环境变量密钥
~~~

### MV-RL-76337ff800b3 `ffpy_my-mcp-ssh` / `disconnect`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-76337ff800b3` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/llm-integration/ffpy_my-mcp-ssh_bbf6df7_python/src/main.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/ffpy_my-mcp-ssh/src/main.py` |
| Tool name | `disconnect` -> `disconnect` |
| Original location | `llm-integration/ffpy_my-mcp-ssh_bbf6df7_python/src/main.py:166` |
| Mutation location | `Remote Listener Attack/ffpy_my-mcp-ssh/src/main.py:177--178` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `session_id` |
| Canary | `7805d29f3e` |

#### Original Source Context

Lines 169--181 from the reference file:

~~~python
    Args:
        session_id: Session ID to disconnect
    
    Returns:
        Disconnection status
    """
    session = session_manager.get_session(session_id)
    
    if not session:
        return {SUCCESS: False, ERROR: SESSION_NOT_FOUND.format(session_id)}
    
    try:
        # 关闭并移除会话
~~~

### MV-RL-c04ef64d97be `ffpy_my-mcp-ssh` / `execute`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-c04ef64d97be` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/llm-integration/ffpy_my-mcp-ssh_bbf6df7_python/src/main.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/ffpy_my-mcp-ssh/src/main.py` |
| Tool name | `execute` -> `execute` |
| Original location | `llm-integration/ffpy_my-mcp-ssh_bbf6df7_python/src/main.py:204` |
| Mutation location | `Remote Listener Attack/ffpy_my-mcp-ssh/src/main.py:220--221` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `session_id` |
| Canary | `4314a8247c` |

#### Original Source Context

Lines 210--222 from the reference file:

~~~python
        stdin: Input string to provide to the command, defaults to None
        timeout: Command timeout in seconds, defaults to 60 seconds
    
    Returns:
        Command output (stdout and stderr) and exit status
    """
    session = session_manager.get_session(session_id)
    
    if not session:
        return {SUCCESS: False, ERROR: SESSION_NOT_FOUND.format(session_id)}
    
    try:
        session_manager.update_session_activity(session_id)
~~~

### MV-RL-069f71004992 `ffpy_my-mcp-ssh` / `upload`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-069f71004992` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/llm-integration/ffpy_my-mcp-ssh_bbf6df7_python/src/main.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/ffpy_my-mcp-ssh/src/main.py` |
| Tool name | `upload` -> `upload` |
| Original location | `llm-integration/ffpy_my-mcp-ssh_bbf6df7_python/src/main.py:248` |
| Mutation location | `Remote Listener Attack/ffpy_my-mcp-ssh/src/main.py:265--266` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `session_id` |
| Canary | `4f2368eb8b` |

#### Original Source Context

Lines 253--265 from the reference file:

~~~python
        local_path: Local file path
        remote_path: Remote file path
    
    Returns:
        Dictionary containing upload status information
    """
    session = session_manager.get_session(session_id)
    
    if not session:
        return {SUCCESS: False, ERROR: SESSION_NOT_FOUND.format(session_id)}
    
    try:
        session_manager.update_session_activity(session_id)
~~~

### MV-RL-e7bd2f3b0dbb `ffpy_my-mcp-ssh` / `download`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-e7bd2f3b0dbb` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/llm-integration/ffpy_my-mcp-ssh_bbf6df7_python/src/main.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/ffpy_my-mcp-ssh/src/main.py` |
| Tool name | `download` -> `download` |
| Original location | `llm-integration/ffpy_my-mcp-ssh_bbf6df7_python/src/main.py:283` |
| Mutation location | `Remote Listener Attack/ffpy_my-mcp-ssh/src/main.py:302--303` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `session_id` |
| Canary | `0f9ead943e` |

#### Original Source Context

Lines 288--300 from the reference file:

~~~python
        remote_path: Remote file path
        local_path: Local file path
    
    Returns:
        Dictionary containing download status information
    """
    session = session_manager.get_session(session_id)
    
    if not session:
        return {SUCCESS: False, ERROR: SESSION_NOT_FOUND.format(session_id)}
    
    try:
        session_manager.update_session_activity(session_id)
~~~

### MV-RL-22cffefef096 `lpigeon-ros_mcp_server` / `send_action_goal`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-22cffefef096` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/lpigeon-ros_mcp_server_476591a_python/robotmcp-ros-mcp-server-476591a/ros_mcp/tools/actions.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/lpigeon-ros_mcp_server/robotmcp-ros-mcp-server-476591a/ros_mcp/tools/actions.py` |
| Tool name | `send_action_goal` -> `send_action_goal` |
| Original location | `Other_Tools_and_Integrations/lpigeon-ros_mcp_server_476591a_python/robotmcp-ros-mcp-server-476591a/ros_mcp/tools/actions.py:319` |
| Mutation location | `Remote Listener Attack/lpigeon-ros_mcp_server/robotmcp-ros-mcp-server-476591a/ros_mcp/tools/actions.py:338--339` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `action_name` |
| Canary | `49a22efc66` |

#### Original Source Context

Lines 332--344 from the reference file:

~~~python
            goal (dict): The goal message to send
            timeout (float): Timeout for action completion in seconds. If None, uses ws_manager.default_timeout.

        Returns:
            dict: Contains action response including goal_id, status, and result.
        """
        if not action_name or not action_name.strip():
            return {"error": "Action name cannot be empty"}
        if not action_type or not action_type.strip():
            return {"error": "Action type cannot be empty"}
        if not goal:
            return {"error": "Goal cannot be empty"}

~~~

### MV-RL-b48d10c4e5bc `lpigeon-ros_mcp_server` / `connect_to_robot`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-b48d10c4e5bc` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/lpigeon-ros_mcp_server_476591a_python/robotmcp-ros-mcp-server-476591a/ros_mcp/tools/connection.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/lpigeon-ros_mcp_server/robotmcp-ros-mcp-server-476591a/ros_mcp/tools/connection.py` |
| Tool name | `connect_to_robot` -> `connect_to_robot` |
| Original location | `Other_Tools_and_Integrations/lpigeon-ros_mcp_server_476591a_python/robotmcp-ros-mcp-server-476591a/ros_mcp/tools/connection.py:31` |
| Mutation location | `Remote Listener Attack/lpigeon-ros_mcp_server/robotmcp-ros-mcp-server-476591a/ros_mcp/tools/connection.py:50--51` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `ip` |
| Canary | `915263493a` |

#### Original Source Context

Lines 44--56 from the reference file:

~~~python
            port_timeout (float): Timeout for port check in seconds. Default = 2.0.

        Returns:
            dict: Connection status with ping and port check results.
        """
        # Set default values if None
        actual_ip = str(ip).strip() if ip else default_ip
        actual_port = int(port) if port else default_port

        # Set the IP and port
        ws_manager.set_ip(actual_ip, actual_port)

        # Test connectivity
~~~

### MV-RL-9ce93ed26b92 `lpigeon-ros_mcp_server` / `get_service_type`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-9ce93ed26b92` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/lpigeon-ros_mcp_server_476591a_python/robotmcp-ros-mcp-server-476591a/ros_mcp/tools/services.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/lpigeon-ros_mcp_server/robotmcp-ros-mcp-server-476591a/ros_mcp/tools/services.py` |
| Tool name | `get_service_type` -> `get_service_type` |
| Original location | `Other_Tools_and_Integrations/lpigeon-ros_mcp_server_476591a_python/robotmcp-ros-mcp-server-476591a/ros_mcp/tools/services.py:62` |
| Mutation location | `Remote Listener Attack/lpigeon-ros_mcp_server/robotmcp-ros-mcp-server-476591a/ros_mcp/tools/services.py:73--74` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `service` |
| Canary | `5612c139dd` |

#### Original Source Context

Lines 67--79 from the reference file:

~~~python
            service (str): The service name (e.g., '/rosapi/topics')

        Returns:
            dict: Contains the service type,
                or an error message if service doesn't exist.
        """
        if not service or not service.strip():
            return {"error": "Service name cannot be empty"}

        message = {
            "op": "call_service",
            "service": rosapi_service("service_type"),
            "type": rosapi_type("ServiceType"),
~~~

### MV-RL-ea0fc36af507 `lpigeon-ros_mcp_server` / `get_service_details`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-ea0fc36af507` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/lpigeon-ros_mcp_server_476591a_python/robotmcp-ros-mcp-server-476591a/ros_mcp/tools/services.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/lpigeon-ros_mcp_server/robotmcp-ros-mcp-server-476591a/ros_mcp/tools/services.py` |
| Tool name | `get_service_details` -> `get_service_details` |
| Original location | `Other_Tools_and_Integrations/lpigeon-ros_mcp_server_476591a_python/robotmcp-ros-mcp-server-476591a/ros_mcp/tools/services.py:110` |
| Mutation location | `Remote Listener Attack/lpigeon-ros_mcp_server/robotmcp-ros-mcp-server-476591a/ros_mcp/tools/services.py:124--125` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `service` |
| Canary | `6333dcd921` |

#### Original Source Context

Lines 116--128 from the reference file:

~~~python

        Returns:
            dict: Contains complete service definition with request and response structures,
                provider nodes, and provider count.
        """
        # Validate input
        if not service or not service.strip():
            return {"error": "Service name cannot be empty"}

        result = {
            "service": service,
            "type": "",
            "request": {},
~~~

### MV-RL-ffa4a210845a `lpigeon-ros_mcp_server` / `call_service`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-ffa4a210845a` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/lpigeon-ros_mcp_server_476591a_python/robotmcp-ros-mcp-server-476591a/ros_mcp/tools/services.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/lpigeon-ros_mcp_server/robotmcp-ros-mcp-server-476591a/ros_mcp/tools/services.py` |
| Tool name | `call_service` -> `call_service` |
| Original location | `Other_Tools_and_Integrations/lpigeon-ros_mcp_server_476591a_python/robotmcp-ros-mcp-server-476591a/ros_mcp/tools/services.py:260` |
| Mutation location | `Remote Listener Attack/lpigeon-ros_mcp_server/robotmcp-ros-mcp-server-476591a/ros_mcp/tools/services.py:283--284` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `service_name` |
| Canary | `2a478f3ce5` |

#### Original Source Context

Lines 273--285 from the reference file:

~~~python
            timeout (float): Timeout in seconds. If None, uses ws_manager.default_timeout.

        Returns:
            dict: Contains the service response or error information.
        """
        # Use ws_manager.default_timeout if timeout is None
        if timeout is None:
            timeout = ws_manager.default_timeout

        # rosbridge service call
        message = {
            "op": "call_service",
            "service": service_name,
~~~

### MV-RL-7ecb29c29054 `lpigeon-ros_mcp_server` / `subscribe_once`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-7ecb29c29054` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/lpigeon-ros_mcp_server_476591a_python/robotmcp-ros-mcp-server-476591a/ros_mcp/tools/topics.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/lpigeon-ros_mcp_server/robotmcp-ros-mcp-server-476591a/ros_mcp/tools/topics.py` |
| Tool name | `subscribe_once` -> `subscribe_once` |
| Original location | `Other_Tools_and_Integrations/lpigeon-ros_mcp_server_476591a_python/robotmcp-ros-mcp-server-476591a/ros_mcp/tools/topics.py:283` |
| Mutation location | `Remote Listener Attack/lpigeon-ros_mcp_server/robotmcp-ros-mcp-server-476591a/ros_mcp/tools/topics.py:311--312` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `topic` |
| Canary | `e1e41bca8e` |

#### Original Source Context

Lines 305--317 from the reference file:

~~~python
        Returns:
            dict:
                - {"msg": <parsed ROS message>} if successful
                - {"error": "<error message>"} if subscription or timeout fails
        """
        # Validate critical args before attempting subscription
        if not topic or not msg_type:
            return {"error": "Missing required arguments: topic and msg_type must be provided."}

        # Set defaults for optional parameters
        if timeout is None:
            timeout = ws_manager.default_timeout
        if queue_length is None:
~~~

### MV-RL-5c618d7a9383 `lpigeon-ros_mcp_server` / `publish_once`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-5c618d7a9383` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/lpigeon-ros_mcp_server_476591a_python/robotmcp-ros-mcp-server-476591a/ros_mcp/tools/topics.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/lpigeon-ros_mcp_server/robotmcp-ros-mcp-server-476591a/ros_mcp/tools/topics.py` |
| Tool name | `publish_once` -> `publish_once` |
| Original location | `Other_Tools_and_Integrations/lpigeon-ros_mcp_server_476591a_python/robotmcp-ros-mcp-server-476591a/ros_mcp/tools/topics.py:738` |
| Mutation location | `Remote Listener Attack/lpigeon-ros_mcp_server/robotmcp-ros-mcp-server-476591a/ros_mcp/tools/topics.py:755--756` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `topic` |
| Canary | `7e7a276088` |

#### Original Source Context

Lines 747--759 from the reference file:

~~~python
        Returns:
            dict:
                - {"success": True} if sent without errors
                - {"error": "<error message>"} if connection/send failed
        """
        # Neutralize the mutable default arguments
        msg = dict(msg)

        # Validate ws_manager is available
        if ws_manager is None:
            return {"error": "WebSocket manager is not initialized"}

        # Validate required arguments
~~~

### MV-RL-df615705e612 `mrexodia-ida-pro-mcp` / `callgraph`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-df615705e612` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/mrexodia-ida-pro-mcp_c133c38_python/mrexodia-ida-pro-mcp-c133c38/src/ida_pro_mcp/ida_mcp/api_analysis.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/mrexodia-ida-pro-mcp/mrexodia-ida-pro-mcp-c133c38/src/ida_pro_mcp/ida_mcp/api_analysis.py` |
| Tool name | `callgraph` -> `callgraph` |
| Original location | `Other_Tools_and_Integrations/mrexodia-ida-pro-mcp_c133c38_python/mrexodia-ida-pro-mcp-c133c38/src/ida_pro_mcp/ida_mcp/api_analysis.py:2469` |
| Mutation location | `Remote Listener Attack/mrexodia-ida-pro-mcp/mrexodia-ida-pro-mcp-c133c38/src/ida_pro_mcp/ida_mcp/api_analysis.py:2487--2488` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `roots` |
| Canary | `5b96be34e7` |

#### Original Source Context

Lines 2481--2493 from the reference file:

~~~python
    ] = 5000,
    max_edges_per_func: Annotated[
        int, "Max edges per function (default: 200, max: 5000)"
    ] = 200,
) -> list[CallGraphResult]:
    """Build bounded callgraph from roots with depth/node/edge limits."""
    roots = normalize_list_input(roots)
    if max_depth < 0:
        max_depth = 0
    if max_nodes <= 0 or max_nodes > 100000:
        max_nodes = 100000
    if max_edges <= 0 or max_edges > 200000:
        max_edges = 200000
~~~

### MV-RL-3ec6dbc07b9b `mrexodia-ida-pro-mcp` / `dbg_regs_remote`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-3ec6dbc07b9b` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/mrexodia-ida-pro-mcp_c133c38_python/mrexodia-ida-pro-mcp-c133c38/src/ida_pro_mcp/ida_mcp/api_debug.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/mrexodia-ida-pro-mcp/mrexodia-ida-pro-mcp-c133c38/src/ida_pro_mcp/ida_mcp/api_debug.py` |
| Tool name | `dbg_regs_remote` -> `dbg_regs_remote` |
| Original location | `Other_Tools_and_Integrations/mrexodia-ida-pro-mcp_c133c38_python/mrexodia-ida-pro-mcp-c133c38/src/ida_pro_mcp/ida_mcp/api_debug.py:753` |
| Mutation location | `Remote Listener Attack/mrexodia-ida-pro-mcp/mrexodia-ida-pro-mcp-c133c38/src/ida_pro_mcp/ida_mcp/api_debug.py:759--760` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `tids` |
| Canary | `1ad849119c` |

#### Original Source Context

Lines 753--765 from the reference file:

~~~python
@tool
@idasync
def dbg_regs_remote(
    tids: Annotated[list[int] | int, "Thread ID(s) to get registers for"],
) -> list[ThreadRegistersResult]:
    """Return full register sets for specified thread IDs."""
    if isinstance(tids, int):
        tids = [tids]

    dbg = dbg_ensure_suspended()
    available_tids = [ida_dbg.getn_thread(i) for i in range(ida_dbg.get_thread_qty())]
    results = []

~~~

### MV-RL-bcc95c805a9c `mrexodia-ida-pro-mcp` / `dbg_gpregs_remote`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-bcc95c805a9c` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/mrexodia-ida-pro-mcp_c133c38_python/mrexodia-ida-pro-mcp-c133c38/src/ida_pro_mcp/ida_mcp/api_debug.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/mrexodia-ida-pro-mcp/mrexodia-ida-pro-mcp-c133c38/src/ida_pro_mcp/ida_mcp/api_debug.py` |
| Tool name | `dbg_gpregs_remote` -> `dbg_gpregs_remote` |
| Original location | `Other_Tools_and_Integrations/mrexodia-ida-pro-mcp_c133c38_python/mrexodia-ida-pro-mcp-c133c38/src/ida_pro_mcp/ida_mcp/api_debug.py:794` |
| Mutation location | `Remote Listener Attack/mrexodia-ida-pro-mcp/mrexodia-ida-pro-mcp-c133c38/src/ida_pro_mcp/ida_mcp/api_debug.py:802--803` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `tids` |
| Canary | `dc316d98ab` |

#### Original Source Context

Lines 794--806 from the reference file:

~~~python
@tool
@idasync
def dbg_gpregs_remote(
    tids: Annotated[list[int] | int, "Thread ID(s) to get GP registers for"],
) -> list[ThreadRegistersResult]:
    """Get GP registers for threads"""
    if isinstance(tids, int):
        tids = [tids]

    dbg = dbg_ensure_suspended()
    available_tids = [ida_dbg.getn_thread(i) for i in range(ida_dbg.get_thread_qty())]
    results = []

~~~

### MV-RL-0ef4cd621f05 `mrexodia-ida-pro-mcp` / `dbg_regs_named_remote`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-0ef4cd621f05` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/mrexodia-ida-pro-mcp_c133c38_python/mrexodia-ida-pro-mcp-c133c38/src/ida_pro_mcp/ida_mcp/api_debug.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/mrexodia-ida-pro-mcp/mrexodia-ida-pro-mcp-c133c38/src/ida_pro_mcp/ida_mcp/api_debug.py` |
| Tool name | `dbg_regs_named_remote` -> `dbg_regs_named_remote` |
| Original location | `Other_Tools_and_Integrations/mrexodia-ida-pro-mcp_c133c38_python/mrexodia-ida-pro-mcp-c133c38/src/ida_pro_mcp/ida_mcp/api_debug.py:835` |
| Mutation location | `Remote Listener Attack/mrexodia-ida-pro-mcp/mrexodia-ida-pro-mcp-c133c38/src/ida_pro_mcp/ida_mcp/api_debug.py:848--849` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `thread_id` |
| Canary | `9100a696d9` |

#### Original Source Context

Lines 838--850 from the reference file:

~~~python
    thread_id: Annotated[int, "Thread ID"],
    register_names: Annotated[
        str, "Comma-separated register names (e.g., 'RAX, RBX, RCX')"
    ],
) -> ThreadRegisters:
    """Return selected registers for a specific thread ID."""
    dbg = dbg_ensure_suspended()
    if thread_id not in [
        ida_dbg.getn_thread(i) for i in range(ida_dbg.get_thread_qty())
    ]:
        raise IDAError(f"Thread with ID {thread_id} not found")
    names = [name.strip() for name in register_names.split(",")]
    return _get_registers_specific_for_thread(dbg, thread_id, names)
~~~

### MV-RL-4f2c11e8f62f `mrexodia-ida-pro-mcp` / `dbg_read`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-4f2c11e8f62f` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/mrexodia-ida-pro-mcp_c133c38_python/mrexodia-ida-pro-mcp-c133c38/src/ida_pro_mcp/ida_mcp/api_debug.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/mrexodia-ida-pro-mcp/mrexodia-ida-pro-mcp-c133c38/src/ida_pro_mcp/ida_mcp/api_debug.py` |
| Tool name | `dbg_read` -> `dbg_read` |
| Original location | `Other_Tools_and_Integrations/mrexodia-ida-pro-mcp_c133c38_python/mrexodia-ida-pro-mcp-c133c38/src/ida_pro_mcp/ida_mcp/api_debug.py:928` |
| Mutation location | `Remote Listener Attack/mrexodia-ida-pro-mcp/mrexodia-ida-pro-mcp-c133c38/src/ida_pro_mcp/ida_mcp/api_debug.py:941--942` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `regions` |
| Canary | `c188b3d281` |

#### Original Source Context

Lines 929--941 from the reference file:

~~~python
@idasync
def dbg_read(
    regions: list[MemoryRead] | MemoryRead,
) -> list[DebugMemoryReadResult]:
    """Read debuggee memory from one or more regions."""

    regions = normalize_dict_list(regions)
    dbg_ensure_active()
    results = []

    for region in regions:
        try:
            addr = parse_address(region["addr"])
~~~

### MV-RL-170a669b6586 `mrexodia-ida-pro-mcp` / `idb_open`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-170a669b6586` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/mrexodia-ida-pro-mcp_c133c38_python/mrexodia-ida-pro-mcp-c133c38/src/ida_pro_mcp/idalib_server.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/mrexodia-ida-pro-mcp/mrexodia-ida-pro-mcp-c133c38/src/ida_pro_mcp/idalib_server.py` |
| Tool name | `idb_open` -> `idb_open` |
| Original location | `Other_Tools_and_Integrations/mrexodia-ida-pro-mcp_c133c38_python/mrexodia-ida-pro-mcp-c133c38/src/ida_pro_mcp/idalib_server.py:102` |
| Mutation location | `Remote Listener Attack/mrexodia-ida-pro-mcp/mrexodia-ida-pro-mcp-c133c38/src/ida_pro_mcp/idalib_server.py:119--120` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `input_path` |
| Canary | `de73949fd4` |

#### Original Source Context

Lines 113--125 from the reference file:

~~~python
        str,
        "Preferred session ID (auto-generated if empty). Ignored if the file is already open.",
    ] = "",
) -> IdalibOpenResult:
    """Open a binary, activate it, and warm up subsystems in one call."""

    if _PUMP.active and not _PUMP.on_main_thread():
        # open_database and everything after it must run on the IDA thread.
        return _PUMP.submit(
            lambda: idb_open(
                input_path,
                run_auto_analysis,
                build_caches,
~~~

### MV-RL-dd7a6d1d83a4 `skysqlinc_skysql-mcp` / `launch_serverless_db`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-dd7a6d1d83a4` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/developer-tools/skysqlinc_skysql-mcp_f8f4f76_python/src/mcp-server/server.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/skysqlinc_skysql-mcp/src/mcp-server/server.py` |
| Tool name | `launch_serverless_db` -> `launch_serverless_db` |
| Original location | `developer-tools/skysqlinc_skysql-mcp_f8f4f76_python/src/mcp-server/server.py:121` |
| Mutation location | `Remote Listener Attack/skysqlinc_skysql-mcp/src/mcp-server/server.py:124--125` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `name` |
| Canary | `539d498f36` |

#### Original Source Context

Lines 118--130 from the reference file:

~~~python

# Tool for launching a serverless DB
@mcp.tool()
async def launch_serverless_db(name: str, region: str = "eastus", provider: str = "azure") -> str:
    """Launch a new Serverless DB instance in SkySQL"""
    # Convert name to lowercase
    name = name.lower()

    async with await get_skysql_client() as client:
        try:
            payload = {
                "topology": "serverless-standalone",
                "provider": provider,
~~~

### MV-RL-111fa65181aa `skysqlinc_skysql-mcp` / `delete_db`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-111fa65181aa` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/developer-tools/skysqlinc_skysql-mcp_f8f4f76_python/src/mcp-server/server.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/skysqlinc_skysql-mcp/src/mcp-server/server.py` |
| Tool name | `delete_db` -> `delete_db` |
| Original location | `developer-tools/skysqlinc_skysql-mcp_f8f4f76_python/src/mcp-server/server.py:153` |
| Mutation location | `Remote Listener Attack/skysqlinc_skysql-mcp/src/mcp-server/server.py:157--158` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `service_id` |
| Canary | `03a77eb669` |

#### Original Source Context

Lines 149--161 from the reference file:

~~~python
            return f"Failed to launch DB: {str(e)}"

# Tool for deleting a DB
@mcp.tool()
async def delete_db(service_id: str) -> str:
    """Delete a DB instance from SkySQL"""
    async with await get_skysql_client() as client:
        try:
            logger.debug(f"Attempting to delete DB with ID: {service_id}")
            response = await client.delete(f"/provisioning/v1/services/{service_id}")
            logger.debug(f"Delete response status: {response.status_code}")
            logger.debug(f"Delete response body: {response.text}")
            
~~~

### MV-RL-f3e44d232a48 `skysqlinc_skysql-mcp` / `ask_agent`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-f3e44d232a48` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/developer-tools/skysqlinc_skysql-mcp_f8f4f76_python/src/mcp-server/server.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/skysqlinc_skysql-mcp/src/mcp-server/server.py` |
| Tool name | `ask_agent` -> `ask_agent` |
| Original location | `developer-tools/skysqlinc_skysql-mcp_f8f4f76_python/src/mcp-server/server.py:172` |
| Mutation location | `Remote Listener Attack/skysqlinc_skysql-mcp/src/mcp-server/server.py:178--179` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `agent_id` |
| Canary | `2cb508cdb1` |

#### Original Source Context

Lines 168--180 from the reference file:

~~~python
            return f"Failed to delete DB: {str(e)}"

# Tool for asking questions to DB agents
@mcp.tool()
async def ask_agent(agent_id: str, question: str) -> str:
    """Ask a question to a specific DB agent"""
    async with await get_skysql_client() as client:
        try:
            # Get agent info from cache
            if agent_id not in _agent_cache:
                # If agent not in cache, refresh the cache
                await list_agents()
                if agent_id not in _agent_cache:
~~~

### MV-RL-fdc0df553537 `skysqlinc_skysql-mcp` / `get_db_credentials`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-fdc0df553537` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/developer-tools/skysqlinc_skysql-mcp_f8f4f76_python/src/mcp-server/server.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/skysqlinc_skysql-mcp/src/mcp-server/server.py` |
| Tool name | `get_db_credentials` -> `get_db_credentials` |
| Original location | `developer-tools/skysqlinc_skysql-mcp_f8f4f76_python/src/mcp-server/server.py:258` |
| Mutation location | `Remote Listener Attack/skysqlinc_skysql-mcp/src/mcp-server/server.py:266--267` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `service_id` |
| Canary | `709843581b` |

#### Original Source Context

Lines 254--266 from the reference file:

~~~python
2. Your question about database management
"""

@mcp.tool()
async def get_db_credentials(service_id: str) -> str:
    """Get the credentials for a SkySQL database instance"""
    async with await get_skysql_client() as client:
        try:
            # First get the service details to get hostname and port
            logger.debug(f"Fetching service details for ID: {service_id}")
            services_response = await client.get("/provisioning/v1/services")
            services_response.raise_for_status()
            services = services_response.json()
~~~

### MV-RL-ccef8c065414 `skysqlinc_skysql-mcp` / `update_ip_allowlist`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-ccef8c065414` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/developer-tools/skysqlinc_skysql-mcp_f8f4f76_python/src/mcp-server/server.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/skysqlinc_skysql-mcp/src/mcp-server/server.py` |
| Tool name | `update_ip_allowlist` -> `update_ip_allowlist` |
| Original location | `developer-tools/skysqlinc_skysql-mcp_f8f4f76_python/src/mcp-server/server.py:298` |
| Mutation location | `Remote Listener Attack/skysqlinc_skysql-mcp/src/mcp-server/server.py:308--309` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `service_id` |
| Canary | `39360f1441` |

#### Original Source Context

Lines 294--306 from the reference file:

~~~python
                logger.error(f"Error response body: {e.response.text}")
            return f"Failed to fetch credentials: {str(e)}"

@mcp.tool()
async def update_ip_allowlist(service_id: str) -> str:
    """Update the IP allowlist for a SkySQL database instance with the current IP"""
    async with await get_skysql_client() as client:
        try:
            # First get the current IP
            ip_response = await client.get("https://checkip.amazonaws.com")
            ip_response.raise_for_status()
            current_ip = ip_response.text.strip()

~~~

### MV-RL-b3cd2a641ac9 `skysqlinc_skysql-mcp` / `execute_sql`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-b3cd2a641ac9` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/developer-tools/skysqlinc_skysql-mcp_f8f4f76_python/src/mcp-server/server.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/skysqlinc_skysql-mcp/src/mcp-server/server.py` |
| Tool name | `execute_sql` -> `execute_sql` |
| Original location | `developer-tools/skysqlinc_skysql-mcp_f8f4f76_python/src/mcp-server/server.py:371` |
| Mutation location | `Remote Listener Attack/skysqlinc_skysql-mcp/src/mcp-server/server.py:383--384` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `service_id` |
| Canary | `f4e292abd0` |

#### Original Source Context

Lines 367--379 from the reference file:

~~~python
            return f"Failed to list services: {str(e)}"

# Add the new execute_sql tool
@mcp.tool()
async def execute_sql(service_id: str, sql_query: str) -> str:
    """Execute SQL query on a SkySQL database instance and return the results"""
    try:
        # Get credentials using existing tool
        creds_str = await get_db_credentials(service_id)
        if "Failed to fetch credentials" in creds_str:
            return creds_str

        # Parse the credentials string
~~~

### MV-RL-40b02dfaef06 `sooperset-mcp-atlassian` / `get_issue`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-40b02dfaef06` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/developer-tools/sooperset-mcp-atlassian_0a5d242_python/sooperset-mcp-atlassian-0a5d242/src/mcp_atlassian/servers/jira.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/sooperset-mcp-atlassian/sooperset-mcp-atlassian-0a5d242/src/mcp_atlassian/servers/jira.py` |
| Tool name | `get_issue` -> `get_issue` |
| Original location | `developer-tools/sooperset-mcp-atlassian_0a5d242_python/sooperset-mcp-atlassian-0a5d242/src/mcp_atlassian/servers/jira.py:653` |
| Mutation location | `Remote Listener Attack/sooperset-mcp-atlassian/sooperset-mcp-atlassian-0a5d242/src/mcp_atlassian/servers/jira.py:757--758` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `issue_key` |
| Canary | `78b65e2fdb` |

#### Original Source Context

Lines 751--763 from the reference file:

~~~python
    Returns:
        JSON string representing the Jira issue object.

    Raises:
        ValueError: If the Jira client is not configured.
    """
    jira = await get_jira_fetcher(ctx)
    fields_list: str | list[str] | None = fields
    if fields and fields != "*all":
        fields_list = [f.strip() for f in fields.split(",") if f.strip()]

    include_sections = _parse_get_issue_include(include)
    if "comments" in include_sections and fields_list != "*all":
~~~

### MV-RL-0ddba30d40e5 `sooperset-mcp-atlassian` / `get_project_issues`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-0ddba30d40e5` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/developer-tools/sooperset-mcp-atlassian_0a5d242_python/sooperset-mcp-atlassian-0a5d242/src/mcp_atlassian/servers/jira.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/sooperset-mcp-atlassian/sooperset-mcp-atlassian-0a5d242/src/mcp_atlassian/servers/jira.py` |
| Tool name | `get_project_issues` -> `get_project_issues` |
| Original location | `developer-tools/sooperset-mcp-atlassian_0a5d242_python/sooperset-mcp-atlassian-0a5d242/src/mcp_atlassian/servers/jira.py:1173` |
| Mutation location | `Remote Listener Attack/sooperset-mcp-atlassian/sooperset-mcp-atlassian-0a5d242/src/mcp_atlassian/servers/jira.py:1204--1205` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `project_key` |
| Canary | `75e43b84fa` |

#### Original Source Context

Lines 1196--1208 from the reference file:

~~~python
        limit: Maximum number of results.
        start_at: Starting index for pagination.

    Returns:
        JSON string representing the search results including pagination info.
    """
    jira = await get_jira_fetcher(ctx)
    search_result = jira.get_project_issues(
        project_key=project_key, start=start_at, limit=limit
    )
    result = search_result.to_simplified_dict()
    return json.dumps(result, indent=2, ensure_ascii=False)

~~~

### MV-RL-ea500348b270 `sooperset-mcp-atlassian` / `move_issue`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-ea500348b270` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/developer-tools/sooperset-mcp-atlassian_0a5d242_python/sooperset-mcp-atlassian-0a5d242/src/mcp_atlassian/servers/jira.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/sooperset-mcp-atlassian/sooperset-mcp-atlassian-0a5d242/src/mcp_atlassian/servers/jira.py` |
| Tool name | `move_issue` -> `move_issue` |
| Original location | `developer-tools/sooperset-mcp-atlassian_0a5d242_python/sooperset-mcp-atlassian-0a5d242/src/mcp_atlassian/servers/jira.py:2515` |
| Mutation location | `Remote Listener Attack/sooperset-mcp-atlassian/sooperset-mcp-atlassian-0a5d242/src/mcp_atlassian/servers/jira.py:2561--2562` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `issue_key` |
| Canary | `c91f84320d` |

#### Original Source Context

Lines 2551--2563 from the reference file:

~~~python
        JSON string representing the moved issue with its new key and project.

    Raises:
        ValueError: If in read-only mode, Jira client unavailable, or the move fails.
        NotImplementedError: If not running on Jira Cloud.
    """
    jira = await get_jira_fetcher(ctx)

    try:
        result = await asyncio.to_thread(jira.move_issue, issue_key, target_project_key)
        return json.dumps(
            {
                "message": (
~~~

### MV-RL-3143f408bd4b `sooperset-mcp-atlassian` / `create_remote_issue_link`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-3143f408bd4b` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/developer-tools/sooperset-mcp-atlassian_0a5d242_python/sooperset-mcp-atlassian-0a5d242/src/mcp_atlassian/servers/jira.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/sooperset-mcp-atlassian/sooperset-mcp-atlassian-0a5d242/src/mcp_atlassian/servers/jira.py` |
| Tool name | `create_remote_issue_link` -> `create_remote_issue_link` |
| Original location | `developer-tools/sooperset-mcp-atlassian_0a5d242_python/sooperset-mcp-atlassian-0a5d242/src/mcp_atlassian/servers/jira.py:2940` |
| Mutation location | `Remote Listener Attack/sooperset-mcp-atlassian/sooperset-mcp-atlassian-0a5d242/src/mcp_atlassian/servers/jira.py:3000--3001` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `issue_key` |
| Canary | `7bc48dbca9` |

#### Original Source Context

Lines 2988--3000 from the reference file:

~~~python
    Returns:
        JSON string indicating success or failure.

    Raises:
        ValueError: If required fields are missing, invalid input, in read-only mode, or Jira client unavailable.
    """
    jira = await get_jira_fetcher(ctx)
    if not issue_key:
        raise ValueError("issue_key is required.")
    if not url:
        raise ValueError("url is required.")
    if not title:
        raise ValueError("title is required.")
~~~

### MV-RL-f04e9bee4a3d `sooperset-mcp-atlassian` / `get_project_components`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-f04e9bee4a3d` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/developer-tools/sooperset-mcp-atlassian_0a5d242_python/sooperset-mcp-atlassian-0a5d242/src/mcp_atlassian/servers/jira.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/sooperset-mcp-atlassian/sooperset-mcp-atlassian-0a5d242/src/mcp_atlassian/servers/jira.py` |
| Tool name | `get_project_components` -> `get_project_components` |
| Original location | `developer-tools/sooperset-mcp-atlassian_0a5d242_python/sooperset-mcp-atlassian-0a5d242/src/mcp_atlassian/servers/jira.py:3444` |
| Mutation location | `Remote Listener Attack/sooperset-mcp-atlassian/sooperset-mcp-atlassian-0a5d242/src/mcp_atlassian/servers/jira.py:3463--3464` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `project_key` |
| Canary | `d66bfa4ed5` |

#### Original Source Context

Lines 3449--3461 from the reference file:

~~~python
            description="Jira project key (e.g., 'PROJ', 'ACV2')",
            pattern=PROJECT_KEY_PATTERN,
        ),
    ],
) -> str:
    """Get all components for a specific Jira project."""
    jira = await get_jira_fetcher(ctx)
    components = jira.get_project_components(project_key)
    return json.dumps(components, indent=2, ensure_ascii=False)


@jira_mcp.tool(
    tags={"jira", "read", "toolset:jira_projects"},
~~~

### MV-RL-4e09fb8753f0 `sooperset-mcp-atlassian` / `get_service_desk_for_project`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-4e09fb8753f0` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/developer-tools/sooperset-mcp-atlassian_0a5d242_python/sooperset-mcp-atlassian-0a5d242/src/mcp_atlassian/servers/jira.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/sooperset-mcp-atlassian/sooperset-mcp-atlassian-0a5d242/src/mcp_atlassian/servers/jira.py` |
| Tool name | `get_service_desk_for_project` -> `get_service_desk_for_project` |
| Original location | `developer-tools/sooperset-mcp-atlassian_0a5d242_python/sooperset-mcp-atlassian-0a5d242/src/mcp_atlassian/servers/jira.py:3669` |
| Mutation location | `Remote Listener Attack/sooperset-mcp-atlassian/sooperset-mcp-atlassian-0a5d242/src/mcp_atlassian/servers/jira.py:3704--3705` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `project_key` |
| Canary | `00dee3117e` |

#### Original Source Context

Lines 3688--3700 from the reference file:

~~~python
    Returns:
        JSON string with project key and service desk data (or null if not found).

    Raises:
        NotImplementedError: If connected to Jira Cloud (Server/DC only).
    """
    jira = await get_jira_fetcher(ctx)
    service_desk = jira.get_service_desk_for_project(project_key=project_key)
    result = {
        "project_key": project_key.upper(),
        "service_desk": service_desk.to_simplified_dict() if service_desk else None,
    }
    return json.dumps(result, indent=2, ensure_ascii=False)
~~~

### MV-RL-3e51bda23ce5 `sooperset-mcp-atlassian` / `get_service_desk_queues`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-3e51bda23ce5` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/developer-tools/sooperset-mcp-atlassian_0a5d242_python/sooperset-mcp-atlassian-0a5d242/src/mcp_atlassian/servers/jira.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/sooperset-mcp-atlassian/sooperset-mcp-atlassian-0a5d242/src/mcp_atlassian/servers/jira.py` |
| Tool name | `get_service_desk_queues` -> `get_service_desk_queues` |
| Original location | `developer-tools/sooperset-mcp-atlassian_0a5d242_python/sooperset-mcp-atlassian-0a5d242/src/mcp_atlassian/servers/jira.py:3707` |
| Mutation location | `Remote Listener Attack/sooperset-mcp-atlassian/sooperset-mcp-atlassian-0a5d242/src/mcp_atlassian/servers/jira.py:3751--3752` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `service_desk_id` |
| Canary | `8436e1ba6b` |

#### Original Source Context

Lines 3733--3745 from the reference file:

~~~python
    Returns:
        JSON string with queue list and pagination metadata.

    Raises:
        NotImplementedError: If connected to Jira Cloud (Server/DC only).
    """
    jira = await get_jira_fetcher(ctx)
    result = jira.get_service_desk_queues(
        service_desk_id=service_desk_id,
        start_at=start_at,
        limit=limit,
        include_count=True,
    )
~~~

### MV-RL-c00481c1c3e9 `stuzero-pg-mcp-server` / `connect`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-c00481c1c3e9` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/databases/stuzero-pg-mcp-server_d693c43_python/stuzero-pg-mcp-server-d693c43/server/tools/connection.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/stuzero-pg-mcp-server/stuzero-pg-mcp-server-d693c43/server/tools/connection.py` |
| Tool name | `connect` -> `connect` |
| Original location | `databases/stuzero-pg-mcp-server_d693c43_python/stuzero-pg-mcp-server-d693c43/server/tools/connection.py:13` |
| Mutation location | `Remote Listener Attack/stuzero-pg-mcp-server/stuzero-pg-mcp-server-d693c43/server/tools/connection.py:26--27` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `connection_string` |
| Canary | `c3ca280eb2` |

#### Original Source Context

Lines 20--32 from the reference file:

~~~python
            
        Returns:
            Dictionary containing the connection ID
        """
        # Get database from context
        # db = ctx.request_context.lifespan_context.get("db")
        db = mcp.state["db"]
        
        # Register the connection to get a connection ID
        conn_id = db.register_connection(connection_string)
        
        # Return the connection ID
        logger.info(f"Registered database connection with ID: {conn_id}")
~~~

### MV-RL-cc8d0416e658 `stuzero-pg-mcp-server` / `disconnect`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-cc8d0416e658` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/databases/stuzero-pg-mcp-server_d693c43_python/stuzero-pg-mcp-server-d693c43/server/tools/connection.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/stuzero-pg-mcp-server/stuzero-pg-mcp-server-d693c43/server/tools/connection.py` |
| Tool name | `disconnect` -> `disconnect` |
| Original location | `databases/stuzero-pg-mcp-server_d693c43_python/stuzero-pg-mcp-server-d693c43/server/tools/connection.py:36` |
| Mutation location | `Remote Listener Attack/stuzero-pg-mcp-server/stuzero-pg-mcp-server-d693c43/server/tools/connection.py:51--52` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `conn_id` |
| Canary | `4c5a3188ed` |

#### Original Source Context

Lines 43--55 from the reference file:

~~~python
            
        Returns:
            Dictionary indicating success status
        """
        # Get database from context
        # db = ctx.request_context.lifespan_context.get("db")
        db = mcp.state["db"]
        
        # Check if the connection exists
        if conn_id not in db._connection_map:
            logger.warning(f"Attempted to disconnect unknown connection ID: {conn_id}")
            return {"success": False, "error": "Unknown connection ID"}
        
~~~

### MV-RL-a96cdb20d63e `stuzero-pg-mcp-server` / `pg_query`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-a96cdb20d63e` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/databases/stuzero-pg-mcp-server_d693c43_python/stuzero-pg-mcp-server-d693c43/server/tools/query.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/stuzero-pg-mcp-server/stuzero-pg-mcp-server-d693c43/server/tools/query.py` |
| Tool name | `pg_query` -> `pg_query` |
| Original location | `databases/stuzero-pg-mcp-server_d693c43_python/stuzero-pg-mcp-server-d693c43/server/tools/query.py:52` |
| Mutation location | `Remote Listener Attack/stuzero-pg-mcp-server/stuzero-pg-mcp-server-d693c43/server/tools/query.py:65--66` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `query` |
| Canary | `78254b7de9` |

#### Original Source Context

Lines 59--71 from the reference file:

~~~python
            params: Parameters for the query (optional)
            
        Returns:
            Query results as a list of dictionaries
        """
        # Execute the query using the connection ID 
        return await execute_query(query, conn_id, params)
        
    @mcp.tool()
    async def pg_explain(query: str, conn_id: str, params=None):
        """
        Execute an EXPLAIN (FORMAT JSON) query to get PostgreSQL execution plan.
        
~~~

### MV-RL-c9a2b530c372 `stuzero-pg-mcp-server` / `pg_explain`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-c9a2b530c372` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/databases/stuzero-pg-mcp-server_d693c43_python/stuzero-pg-mcp-server-d693c43/server/tools/query.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/stuzero-pg-mcp-server/stuzero-pg-mcp-server-d693c43/server/tools/query.py` |
| Tool name | `pg_explain` -> `pg_explain` |
| Original location | `databases/stuzero-pg-mcp-server_d693c43_python/stuzero-pg-mcp-server-d693c43/server/tools/query.py:68` |
| Mutation location | `Remote Listener Attack/stuzero-pg-mcp-server/stuzero-pg-mcp-server-d693c43/server/tools/query.py:83--84` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `query` |
| Canary | `b02b34d0d1` |

#### Original Source Context

Lines 75--87 from the reference file:

~~~python
            params: Parameters for the query (optional)
            
        Returns:
            Complete JSON-formatted execution plan
        """
        # Prepend EXPLAIN to the query
        explain_query = f"EXPLAIN (FORMAT JSON) {query}"
        
        # Execute the explain query
        result = await execute_query(explain_query, conn_id, params)
        
        # Return the complete result
        return result
~~~

### MV-RL-241eac72cc0b `stuzero-pg-mcp-server` / `pg_metadata`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-241eac72cc0b` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/databases/stuzero-pg-mcp-server_d693c43_python/stuzero-pg-mcp-server-d693c43/server/tools/viz.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/stuzero-pg-mcp-server/stuzero-pg-mcp-server-d693c43/server/tools/viz.py` |
| Tool name | `pg_metadata` -> `pg_metadata` |
| Original location | `databases/stuzero-pg-mcp-server_d693c43_python/stuzero-pg-mcp-server-d693c43/server/tools/viz.py:106` |
| Mutation location | `Remote Listener Attack/stuzero-pg-mcp-server/stuzero-pg-mcp-server-d693c43/server/tools/viz.py:118--119` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `conn_id` |
| Canary | `78f1377be0` |

#### Original Source Context

Lines 112--118 from the reference file:

~~~python
            sql_query: The SQL query to analyze
            
        Returns:
            JSON metadata about the query results structure
        """
        # Call the function to get query metadata
        return await get_query_metadata(conn_id, sql_query)
~~~

### MV-RL-5b52f8e356a7 `systemcraftsman-strimzi-kafka-cli` / `create_connect`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-5b52f8e356a7` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/developer-tools/systemcraftsman-strimzi-kafka-cli_1727572_python/SystemCraftsman-strimzi-kafka-cli-1727572/kfk/mcp_server.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/systemcraftsman-strimzi-kafka-cli/SystemCraftsman-strimzi-kafka-cli-1727572/kfk/mcp_server.py` |
| Tool name | `create_connect` -> `create_connect` |
| Original location | `developer-tools/systemcraftsman-strimzi-kafka-cli_1727572_python/SystemCraftsman-strimzi-kafka-cli-1727572/kfk/mcp_server.py:246` |
| Mutation location | `Remote Listener Attack/systemcraftsman-strimzi-kafka-cli/SystemCraftsman-strimzi-kafka-cli-1727572/kfk/mcp_server.py:256--257` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `cluster` |
| Canary | `3a219d60f5` |

#### Original Source Context

Lines 250--262 from the reference file:

~~~python
    replicas: int = None,
    registry_username: str = None,
    registry_password: str = None,
    connector_config_files: list[str] = None,
) -> str:
    """Create a KafkaConnect cluster."""
    return connect_clusters.create(
        cluster,
        replicas,
        registry_username,
        registry_password,
        config_file,
        _to_tuple(connector_config_files),
~~~

### MV-RL-25ddbaa2c44d `systemcraftsman-strimzi-kafka-cli` / `list_connectors`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-25ddbaa2c44d` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/developer-tools/systemcraftsman-strimzi-kafka-cli_1727572_python/SystemCraftsman-strimzi-kafka-cli-1727572/kfk/mcp_server.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/systemcraftsman-strimzi-kafka-cli/SystemCraftsman-strimzi-kafka-cli-1727572/kfk/mcp_server.py` |
| Tool name | `list_connectors` -> `list_connectors` |
| Original location | `developer-tools/systemcraftsman-strimzi-kafka-cli_1727572_python/SystemCraftsman-strimzi-kafka-cli-1727572/kfk/mcp_server.py:289` |
| Mutation location | `Remote Listener Attack/systemcraftsman-strimzi-kafka-cli/SystemCraftsman-strimzi-kafka-cli-1727572/kfk/mcp_server.py:293--294` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `cluster` |
| Canary | `d8a053694e` |

#### Original Source Context

Lines 285--297 from the reference file:

~~~python
# Connectors


@mcp.tool()
def list_connectors(cluster: str, namespace: str) -> str:
    """List KafkaConnectors."""
    return connectors.list(cluster, namespace)


@mcp.tool()
def get_connector(connector: str, namespace: str, output: str = "yaml") -> str:
    """Get a KafkaConnector resource."""
    return connectors.describe(connector, output, namespace)
~~~

### MV-RL-b93553d95495 `systemcraftsman-strimzi-kafka-cli` / `get_connector`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-b93553d95495` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/developer-tools/systemcraftsman-strimzi-kafka-cli_1727572_python/SystemCraftsman-strimzi-kafka-cli-1727572/kfk/mcp_server.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/systemcraftsman-strimzi-kafka-cli/SystemCraftsman-strimzi-kafka-cli-1727572/kfk/mcp_server.py` |
| Tool name | `get_connector` -> `get_connector` |
| Original location | `developer-tools/systemcraftsman-strimzi-kafka-cli_1727572_python/SystemCraftsman-strimzi-kafka-cli-1727572/kfk/mcp_server.py:295` |
| Mutation location | `Remote Listener Attack/systemcraftsman-strimzi-kafka-cli/SystemCraftsman-strimzi-kafka-cli-1727572/kfk/mcp_server.py:301--302` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `connector` |
| Canary | `f8bb8c5f86` |

#### Original Source Context

Lines 291--303 from the reference file:

~~~python
    return connectors.list(cluster, namespace)


@mcp.tool()
def get_connector(connector: str, namespace: str, output: str = "yaml") -> str:
    """Get a KafkaConnector resource."""
    return connectors.describe(connector, output, namespace)


@mcp.tool()
def create_connector(config_file: str, cluster: str, namespace: str) -> str:
    """Create a KafkaConnector."""
    return connectors.create(config_file, cluster, namespace)
~~~

### MV-RL-54284139f027 `systemcraftsman-strimzi-kafka-cli` / `alter_connector`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-54284139f027` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/developer-tools/systemcraftsman-strimzi-kafka-cli_1727572_python/SystemCraftsman-strimzi-kafka-cli-1727572/kfk/mcp_server.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/systemcraftsman-strimzi-kafka-cli/SystemCraftsman-strimzi-kafka-cli-1727572/kfk/mcp_server.py` |
| Tool name | `alter_connector` -> `alter_connector` |
| Original location | `developer-tools/systemcraftsman-strimzi-kafka-cli_1727572_python/SystemCraftsman-strimzi-kafka-cli-1727572/kfk/mcp_server.py:313` |
| Mutation location | `Remote Listener Attack/systemcraftsman-strimzi-kafka-cli/SystemCraftsman-strimzi-kafka-cli-1727572/kfk/mcp_server.py:321--322` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `config_file` |
| Canary | `2d769856bf` |

#### Original Source Context

Lines 309--321 from the reference file:

~~~python
    return connectors.delete(connector, cluster, namespace)


@mcp.tool()
def alter_connector(config_file: str, cluster: str, namespace: str) -> str:
    """Alter a KafkaConnector."""
    return connectors.alter(config_file, cluster, namespace)


# ACLs


@mcp.tool()
~~~

### MV-RL-2b98c1dc2071 `tiianhk-maxmsp-mcp-server` / `connect_max_objects`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-2b98c1dc2071` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/tiianhk-maxmsp-mcp-server_6d7b716_python/tiianhk-MaxMSP-MCP-Server-6d7b716/server.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/tiianhk-maxmsp-mcp-server/tiianhk-MaxMSP-MCP-Server-6d7b716/server.py` |
| Tool name | `connect_max_objects` -> `connect_max_objects` |
| Original location | `Other_Tools_and_Integrations/tiianhk-maxmsp-mcp-server_6d7b716_python/tiianhk-MaxMSP-MCP-Server-6d7b716/server.py:173` |
| Mutation location | `Remote Listener Attack/tiianhk-maxmsp-mcp-server/tiianhk-MaxMSP-MCP-Server-6d7b716/server.py:188--189` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `src_varname` |
| Canary | `6344b61c5a` |

#### Original Source Context

Lines 182--194 from the reference file:

~~~python
    Args:
        src_varname (str): Variable name of the source object.
        outlet_idx (int): Outlet index on the source object.
        dst_varname (str): Variable name of the destination object.
        inlet_idx (int): Inlet index on the destination object.
    """
    maxmsp = ctx.request_context.lifespan_context.get("maxmsp")
    cmd = {"action": "connect_objects"}
    kwargs = {
        "src_varname": src_varname,
        "outlet_idx": outlet_idx,
        "dst_varname": dst_varname,
        "inlet_idx": inlet_idx,
~~~

### MV-RL-15dee994aad4 `tiianhk-maxmsp-mcp-server` / `disconnect_max_objects`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-15dee994aad4` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/tiianhk-maxmsp-mcp-server_6d7b716_python/tiianhk-MaxMSP-MCP-Server-6d7b716/server.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/tiianhk-maxmsp-mcp-server/tiianhk-MaxMSP-MCP-Server-6d7b716/server.py` |
| Tool name | `disconnect_max_objects` -> `disconnect_max_objects` |
| Original location | `Other_Tools_and_Integrations/tiianhk-maxmsp-mcp-server_6d7b716_python/tiianhk-MaxMSP-MCP-Server-6d7b716/server.py:201` |
| Mutation location | `Remote Listener Attack/tiianhk-maxmsp-mcp-server/tiianhk-MaxMSP-MCP-Server-6d7b716/server.py:218--219` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `src_varname` |
| Canary | `dae1325a90` |

#### Original Source Context

Lines 210--222 from the reference file:

~~~python
    Args:
        src_varname (str): Variable name of the source object.
        outlet_idx (int): Outlet index on the source object.
        dst_varname (str): Variable name of the destination object.
        inlet_idx (int): Inlet index on the destination object.
    """
    maxmsp = ctx.request_context.lifespan_context.get("maxmsp")
    cmd = {"action": "disconnect_objects"}
    kwargs = {
        "src_varname": src_varname,
        "outlet_idx": outlet_idx,
        "dst_varname": dst_varname,
        "inlet_idx": inlet_idx,
~~~

### MV-RL-c0d58ae3bac2 `tiianhk-maxmsp-mcp-server` / `set_object_attribute`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-c0d58ae3bac2` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/tiianhk-maxmsp-mcp-server_6d7b716_python/tiianhk-MaxMSP-MCP-Server-6d7b716/server.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/tiianhk-maxmsp-mcp-server/tiianhk-MaxMSP-MCP-Server-6d7b716/server.py` |
| Tool name | `set_object_attribute` -> `set_object_attribute` |
| Original location | `Other_Tools_and_Integrations/tiianhk-maxmsp-mcp-server_6d7b716_python/tiianhk-MaxMSP-MCP-Server-6d7b716/server.py:229` |
| Mutation location | `Remote Listener Attack/tiianhk-maxmsp-mcp-server/tiianhk-MaxMSP-MCP-Server-6d7b716/server.py:246--247` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `varname` |
| Canary | `c4631b0e14` |

#### Original Source Context

Lines 236--248 from the reference file:

~~~python

    Args:
        varname (str): Variable name of the object.
        attr_name (str): Name of the attribute to be set.
        attr_value (list): Values of the attribute to be set.
    """
    maxmsp = ctx.request_context.lifespan_context.get("maxmsp")
    cmd = {"action": "set_object_attribute"}
    kwargs = {"varname": varname, "attr_name": attr_name, "attr_value": attr_value}
    cmd.update(kwargs)
    await maxmsp.send_command(cmd)


~~~

### MV-RL-ef28e15113a0 `tiianhk-maxmsp-mcp-server` / `set_message_text`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-ef28e15113a0` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/tiianhk-maxmsp-mcp-server_6d7b716_python/tiianhk-MaxMSP-MCP-Server-6d7b716/server.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/tiianhk-maxmsp-mcp-server/tiianhk-MaxMSP-MCP-Server-6d7b716/server.py` |
| Tool name | `set_message_text` -> `set_message_text` |
| Original location | `Other_Tools_and_Integrations/tiianhk-maxmsp-mcp-server_6d7b716_python/tiianhk-MaxMSP-MCP-Server-6d7b716/server.py:250` |
| Mutation location | `Remote Listener Attack/tiianhk-maxmsp-mcp-server/tiianhk-MaxMSP-MCP-Server-6d7b716/server.py:267--268` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `varname` |
| Canary | `dcdcb1b54b` |

#### Original Source Context

Lines 255--267 from the reference file:

~~~python
    """Set the text of a message object in MaxMSP.

    Args:
        varname (str): Variable name of the message object.
        text_list (list): A list of arguments to be set to the message object.
    """
    maxmsp = ctx.request_context.lifespan_context.get("maxmsp")
    cmd = {"action": "set_message_text"}
    kwargs = {"varname": varname, "new_text": text_list}
    cmd.update(kwargs)
    await maxmsp.send_command(cmd)


~~~

### MV-RL-812339bfbe6b `tiianhk-maxmsp-mcp-server` / `send_bang_to_object`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-812339bfbe6b` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/tiianhk-maxmsp-mcp-server_6d7b716_python/tiianhk-MaxMSP-MCP-Server-6d7b716/server.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/tiianhk-maxmsp-mcp-server/tiianhk-MaxMSP-MCP-Server-6d7b716/server.py` |
| Tool name | `send_bang_to_object` -> `send_bang_to_object` |
| Original location | `Other_Tools_and_Integrations/tiianhk-maxmsp-mcp-server_6d7b716_python/tiianhk-MaxMSP-MCP-Server-6d7b716/server.py:269` |
| Mutation location | `Remote Listener Attack/tiianhk-maxmsp-mcp-server/tiianhk-MaxMSP-MCP-Server-6d7b716/server.py:283--284` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `varname` |
| Canary | `efaca95fc5` |

#### Original Source Context

Lines 269--281 from the reference file:

~~~python
async def send_bang_to_object(ctx: Context, varname: str):
    """Send a bang to an object in MaxMSP.

    Args:
        varname (str): Variable name of the object to be banged.
    """
    maxmsp = ctx.request_context.lifespan_context.get("maxmsp")
    cmd = {"action": "send_bang_to_object"}
    kwargs = {"varname": varname}
    cmd.update(kwargs)
    await maxmsp.send_command(cmd)


~~~

### MV-RL-4c209bf60c86 `tiianhk-maxmsp-mcp-server` / `send_messages_to_object`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-4c209bf60c86` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/tiianhk-maxmsp-mcp-server_6d7b716_python/tiianhk-MaxMSP-MCP-Server-6d7b716/server.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/tiianhk-maxmsp-mcp-server/tiianhk-MaxMSP-MCP-Server-6d7b716/server.py` |
| Tool name | `send_messages_to_object` -> `send_messages_to_object` |
| Original location | `Other_Tools_and_Integrations/tiianhk-maxmsp-mcp-server_6d7b716_python/tiianhk-MaxMSP-MCP-Server-6d7b716/server.py:283` |
| Mutation location | `Remote Listener Attack/tiianhk-maxmsp-mcp-server/tiianhk-MaxMSP-MCP-Server-6d7b716/server.py:311--312` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `varname` |
| Canary | `5c23bb1ffd` |

#### Original Source Context

Lines 295--307 from the reference file:

~~~python
    send_messages_to_object("button1", ["color", 0, 0, 0])

    Args:
        varname (str): Variable name of the object to be messaged.
        message (list): A list of messages to be sent to the object.
    """
    maxmsp = ctx.request_context.lifespan_context.get("maxmsp")
    cmd = {"action": "send_message_to_object"}
    kwargs = {"varname": varname, "message": message}
    cmd.update(kwargs)
    await maxmsp.send_command(cmd)


~~~

### MV-RL-d79e2993d971 `tiianhk-maxmsp-mcp-server` / `set_number`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-d79e2993d971` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/tiianhk-maxmsp-mcp-server_6d7b716_python/tiianhk-MaxMSP-MCP-Server-6d7b716/server.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/tiianhk-maxmsp-mcp-server/tiianhk-MaxMSP-MCP-Server-6d7b716/server.py` |
| Tool name | `set_number` -> `set_number` |
| Original location | `Other_Tools_and_Integrations/tiianhk-maxmsp-mcp-server_6d7b716_python/tiianhk-MaxMSP-MCP-Server-6d7b716/server.py:309` |
| Mutation location | `Remote Listener Attack/tiianhk-maxmsp-mcp-server/tiianhk-MaxMSP-MCP-Server-6d7b716/server.py:334--335` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `varname` |
| Canary | `99f9f0a4c0` |

#### Original Source Context

Lines 316--328 from the reference file:

~~~python

    Args:
        varname (str): Variable name of the comment object.
        num (float): Value to be set for the object.
    """

    maxmsp = ctx.request_context.lifespan_context.get("maxmsp")
    cmd = {"action": "set_number"}
    kwargs = {"varname": varname, "num": num}
    cmd.update(kwargs)
    await maxmsp.send_command(cmd)


~~~

### MV-RL-9e5681ee59ce `tiianhk-maxmsp-mcp-server` / `get_object_doc`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-9e5681ee59ce` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/tiianhk-maxmsp-mcp-server_6d7b716_python/tiianhk-MaxMSP-MCP-Server-6d7b716/server.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/tiianhk-maxmsp-mcp-server/tiianhk-MaxMSP-MCP-Server-6d7b716/server.py` |
| Tool name | `get_object_doc` -> `get_object_doc` |
| Original location | `Other_Tools_and_Integrations/tiianhk-maxmsp-mcp-server_6d7b716_python/tiianhk-MaxMSP-MCP-Server-6d7b716/server.py:337` |
| Mutation location | `Remote Listener Attack/tiianhk-maxmsp-mcp-server/tiianhk-MaxMSP-MCP-Server-6d7b716/server.py:362--363` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `object_name` |
| Canary | `59a88cfde5` |

#### Original Source Context

Lines 342--354 from the reference file:

~~~python
    Args:
        object_name (str): Name of the object to look up.

    Returns:
        dict: Official documentations for the specified object.
    """
    try:
        return flattened_docs[object_name]
    except KeyError:
        return {
            "success": False,
            "error": "Invalid object name",
            "suggestion": "Make sure the object name is a valid Max object name.",
~~~

### MV-RL-fdaf6aa15b90 `tiianhk-maxmsp-mcp-server` / `get_object_attributes`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-fdaf6aa15b90` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/tiianhk-maxmsp-mcp-server_6d7b716_python/tiianhk-MaxMSP-MCP-Server-6d7b716/server.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/tiianhk-maxmsp-mcp-server/tiianhk-MaxMSP-MCP-Server-6d7b716/server.py` |
| Tool name | `get_object_attributes` -> `get_object_attributes` |
| Original location | `Other_Tools_and_Integrations/tiianhk-maxmsp-mcp-server_6d7b716_python/tiianhk-MaxMSP-MCP-Server-6d7b716/server.py:399` |
| Mutation location | `Remote Listener Attack/tiianhk-maxmsp-mcp-server/tiianhk-MaxMSP-MCP-Server-6d7b716/server.py:423--424` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `varname` |
| Canary | `d694c971c5` |

#### Original Source Context

Lines 401--413 from the reference file:

~~~python

    Use this to understand the state of an object.

    Returns:
        list: A list of attributes name and attributes values.
    """
    maxmsp = ctx.request_context.lifespan_context.get("maxmsp")
    payload = {"action": "get_object_attributes"}
    kwargs = {"varname": varname}
    payload.update(kwargs)
    response = await maxmsp.send_request(payload)

    return [response]
~~~

### MV-RL-cd60b786b928 `vladimir-tutin-plex-mcp-server` / `server_get_plex_logs`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-cd60b786b928` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/vladimir-tutin-plex-mcp-server_c28e261_python/vladimir-tutin-plex-mcp-server-c28e261/modules/server.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/vladimir-tutin-plex-mcp-server/vladimir-tutin-plex-mcp-server-c28e261/modules/server.py` |
| Tool name | `server_get_plex_logs` -> `server_get_plex_logs` |
| Original location | `Other_Tools_and_Integrations/vladimir-tutin-plex-mcp-server_c28e261_python/vladimir-tutin-plex-mcp-server-c28e261/modules/server.py:9` |
| Mutation location | `Remote Listener Attack/vladimir-tutin-plex-mcp-server/vladimir-tutin-plex-mcp-server-c28e261/modules/server.py:22--23` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `num_lines` |
| Canary | `9b44c5aa58` |

#### Original Source Context

Lines 16--28 from the reference file:

~~~python
        list_files: If True, lists all available log files instead of content.
        search_term: Text to search for in the logs. If provided, returns matching lines with line numbers.
        
    Returns:
        String containing log lines, search results, or file list.
    """
    try:
        import zipfile
        import io
        import tempfile
        import os
        import shutil
        import traceback
~~~

### MV-RL-c3b85b915741 `vladimir-tutin-plex-mcp-server` / `server_get_bandwidth`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-c3b85b915741` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/vladimir-tutin-plex-mcp-server_c28e261_python/vladimir-tutin-plex-mcp-server-c28e261/modules/server.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/vladimir-tutin-plex-mcp-server/vladimir-tutin-plex-mcp-server-c28e261/modules/server.py` |
| Tool name | `server_get_bandwidth` -> `server_get_bandwidth` |
| Original location | `Other_Tools_and_Integrations/vladimir-tutin-plex-mcp-server_c28e261_python/vladimir-tutin-plex-mcp-server-c28e261/modules/server.py:217` |
| Mutation location | `Remote Listener Attack/vladimir-tutin-plex-mcp-server/vladimir-tutin-plex-mcp-server-c28e261/modules/server.py:229--230` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `timespan` |
| Canary | `aca01cf77c` |

#### Original Source Context

Lines 221--233 from the reference file:

~~~python
        timespan: Time span for bandwidth data (months, weeks, days, hours, seconds)
        lan: Filter by local network (true/false)
    
    Returns:
        Dictionary containing bandwidth statistics
    """
    try:
        plex = connect_to_plex()
        
        # Get bandwidth information
        bandwidth_stats = []
        
        if hasattr(plex, 'bandwidth'):
~~~

### MV-RL-666aa0e2fe42 `vladimir-tutin-plex-mcp-server` / `server_get_alerts`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-666aa0e2fe42` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/vladimir-tutin-plex-mcp-server_c28e261_python/vladimir-tutin-plex-mcp-server-c28e261/modules/server.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/vladimir-tutin-plex-mcp-server/vladimir-tutin-plex-mcp-server-c28e261/modules/server.py` |
| Tool name | `server_get_alerts` -> `server_get_alerts` |
| Original location | `Other_Tools_and_Integrations/vladimir-tutin-plex-mcp-server_c28e261_python/vladimir-tutin-plex-mcp-server-c28e261/modules/server.py:378` |
| Mutation location | `Remote Listener Attack/vladimir-tutin-plex-mcp-server/vladimir-tutin-plex-mcp-server-c28e261/modules/server.py:391--392` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `timeout` |
| Canary | `969c4a3676` |

#### Original Source Context

Lines 381--393 from the reference file:

~~~python
    Args:
        timeout: Number of seconds to listen for alerts (default: 15)
    
    Returns:
        Dictionary containing server alerts and their details
    """
    try:
        plex = connect_to_plex()
        
        # Collection for alerts
        alerts_data = []
        
        # Define callback function to process alerts
~~~

### MV-RL-9f9d86de3354 `vladimir-tutin-plex-mcp-server` / `server_run_butler_task`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-9f9d86de3354` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/vladimir-tutin-plex-mcp-server_c28e261_python/vladimir-tutin-plex-mcp-server-c28e261/modules/server.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/vladimir-tutin-plex-mcp-server/vladimir-tutin-plex-mcp-server-c28e261/modules/server.py` |
| Tool name | `server_run_butler_task` -> `server_run_butler_task` |
| Original location | `Other_Tools_and_Integrations/vladimir-tutin-plex-mcp-server_c28e261_python/vladimir-tutin-plex-mcp-server-c28e261/modules/server.py:447` |
| Mutation location | `Remote Listener Attack/vladimir-tutin-plex-mcp-server/vladimir-tutin-plex-mcp-server-c28e261/modules/server.py:462--463` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `task_name` |
| Canary | `f7d4b1730a` |

#### Original Source Context

Lines 450--462 from the reference file:

~~~python
    Args:
        task_name: Name of the butler task to run
    
    Returns:
        Success or error message
    """
    try:
        plex = connect_to_plex()
        
        # Call the runButlerTask method directly on the PlexServer object
        # Valid task names: 'BackupDatabase', 'CheckForUpdates', 'CleanOldBundles', 
        # 'DeepMediaAnalysis', 'GarbageCollection', 'GenerateAutoTags', 
        # 'OptimizeDatabase', 'RefreshLocalMedia', 'RefreshPeriodicMetadata', 
~~~

### MV-RL-907b952785f5 `vladimir-tutin-plex-mcp-server` / `server_empty_trash`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-RL-907b952785f5` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/vladimir-tutin-plex-mcp-server_c28e261_python/vladimir-tutin-plex-mcp-server-c28e261/modules/server.py` |
| Malicious variant tool | `malicious-variant-tools/Remote Listener Attack/vladimir-tutin-plex-mcp-server/vladimir-tutin-plex-mcp-server-c28e261/modules/server.py` |
| Tool name | `server_empty_trash` -> `server_empty_trash` |
| Original location | `Other_Tools_and_Integrations/vladimir-tutin-plex-mcp-server_c28e261_python/vladimir-tutin-plex-mcp-server-c28e261/modules/server.py:516` |
| Mutation location | `Remote Listener Attack/vladimir-tutin-plex-mcp-server/vladimir-tutin-plex-mcp-server-c28e261/modules/server.py:535--536` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `library_name` |
| Canary | `a93df86fcb` |

#### Original Source Context

Lines 521--533 from the reference file:

~~~python
    Args:
        library_name: Optional name of the library to empty trash for. If not provided, empties trash for all libraries.
    
    Returns:
        Success or error message
    """
    try:
        plex = connect_to_plex()
        
        if library_name:
            # Find the specific library
            all_sections = plex.library.sections()
            target_section = None
~~~

## Tool Index

| ID | Server | Tool | Language | Reference location | Variant location | Mutation form |
|---|---|---|---|---|---|---|
| `MV-RL-2dcb814a944d` | PhungXuanAnh_selenium-mcp-server | `click_to_element` | Python | `browser-automation/PhungXuanAnh_selenium-mcp-server_f9b1770_python/src/mcp_server_selenium/tools/element_interaction.py:749` | `Remote Listener Attack/PhungXuanAnh_selenium-mcp-server/src/mcp_server_selenium/tools/element_interaction.py:770` | safe behavior branch insertion |
| `MV-RL-437d5b98de0c` | PhungXuanAnh_selenium-mcp-server | `local_storage_add` | Python | `browser-automation/PhungXuanAnh_selenium-mcp-server_f9b1770_python/src/mcp_server_selenium/tools/local_storage.py:9` | `Remote Listener Attack/PhungXuanAnh_selenium-mcp-server/src/mcp_server_selenium/tools/local_storage.py:26` | safe behavior branch insertion |
| `MV-RL-a14e9f71bc64` | PhungXuanAnh_selenium-mcp-server | `local_storage_remove` | Python | `browser-automation/PhungXuanAnh_selenium-mcp-server_f9b1770_python/src/mcp_server_selenium/tools/local_storage.py:102` | `Remote Listener Attack/PhungXuanAnh_selenium-mcp-server/src/mcp_server_selenium/tools/local_storage.py:116` | safe behavior branch insertion |
| `MV-RL-5403efd67beb` | PhungXuanAnh_selenium-mcp-server | `get_network_logs` | Python | `browser-automation/PhungXuanAnh_selenium-mcp-server_f9b1770_python/src/mcp_server_selenium/tools/logs.py:264` | `Remote Listener Attack/PhungXuanAnh_selenium-mcp-server/src/mcp_server_selenium/tools/logs.py:316` | safe behavior branch insertion |
| `MV-RL-fdd15af487e5` | PhungXuanAnh_selenium-mcp-server | `run_javascript_in_console` | Python | `browser-automation/PhungXuanAnh_selenium-mcp-server_f9b1770_python/src/mcp_server_selenium/tools/script.py:9` | `Remote Listener Attack/PhungXuanAnh_selenium-mcp-server/src/mcp_server_selenium/tools/script.py:29` | safe behavior branch insertion |
| `MV-RL-d37942824050` | PhungXuanAnh_selenium-mcp-server | `get_style_an_element` | Python | `browser-automation/PhungXuanAnh_selenium-mcp-server_f9b1770_python/src/mcp_server_selenium/tools/style.py:19` | `Remote Listener Attack/PhungXuanAnh_selenium-mcp-server/src/mcp_server_selenium/tools/style.py:43` | safe behavior branch insertion |
| `MV-RL-0eaded50858a` | antonio-mello-ai_mcp-proxmox | `list_storage_content` | Python | `Cloud_Platforms/antonio-mello-ai_mcp-proxmox_fe7fbe0_python/src/mcp_proxmox/server.py:208` | `Remote Listener Attack/antonio-mello-ai_mcp-proxmox/src/mcp_proxmox/server.py:216` | safe behavior branch insertion |
| `MV-RL-7fa02e0a0b65` | antonio-mello-ai_mcp-proxmox | `exec_command` | Python | `Cloud_Platforms/antonio-mello-ai_mcp-proxmox_fe7fbe0_python/src/mcp_proxmox/server.py:437` | `Remote Listener Attack/antonio-mello-ai_mcp-proxmox/src/mcp_proxmox/server.py:450` | safe behavior branch insertion |
| `MV-RL-637875173c48` | antonio-mello-ai_mcp-proxmox | `list_networks` | Python | `Cloud_Platforms/antonio-mello-ai_mcp-proxmox_fe7fbe0_python/src/mcp_proxmox/server.py:481` | `Remote Listener Attack/antonio-mello-ai_mcp-proxmox/src/mcp_proxmox/server.py:491` | safe behavior branch insertion |
| `MV-RL-1a1c81a662a2` | aptro-superset-mcp | `superset_chart_create` | Python | `ai/aptro-superset-mcp_b3dd425_python/aptro-superset-mcp-b3dd425/main.py:662` | `Remote Listener Attack/aptro-superset-mcp/aptro-superset-mcp-b3dd425/main.py:685` | safe behavior branch insertion |
| `MV-RL-107cbe01353b` | aptro-superset-mcp | `superset_database_test_connection` | Python | `ai/aptro-superset-mcp_b3dd425_python/aptro-superset-mcp-b3dd425/main.py:880` | `Remote Listener Attack/aptro-superset-mcp/aptro-superset-mcp-b3dd425/main.py:897` | safe behavior branch insertion |
| `MV-RL-935233ed1fed` | aptro-superset-mcp | `superset_database_get_connection` | Python | `ai/aptro-superset-mcp_b3dd425_python/aptro-superset-mcp-b3dd425/main.py:974` | `Remote Listener Attack/aptro-superset-mcp/aptro-superset-mcp-b3dd425/main.py:993` | safe behavior branch insertion |
| `MV-RL-a919e48c0da6` | aptro-superset-mcp | `superset_saved_query_create` | Python | `ai/aptro-superset-mcp_b3dd425_python/aptro-superset-mcp-b3dd425/main.py:1369` | `Remote Listener Attack/aptro-superset-mcp/aptro-superset-mcp-b3dd425/main.py:1395` | safe behavior branch insertion |
| `MV-RL-22576fbb0057` | aptro-superset-mcp | `superset_tag_object_remove` | Python | `ai/aptro-superset-mcp_b3dd425_python/aptro-superset-mcp-b3dd425/main.py:1633` | `Remote Listener Attack/aptro-superset-mcp/aptro-superset-mcp-b3dd425/main.py:1657` | safe behavior branch insertion |
| `MV-RL-21d9fa2f8841` | aptro-superset-mcp | `superset_explore_form_data_create` | Python | `ai/aptro-superset-mcp_b3dd425_python/aptro-superset-mcp-b3dd425/main.py:1670` | `Remote Listener Attack/aptro-superset-mcp/aptro-superset-mcp-b3dd425/main.py:1695` | safe behavior branch insertion |
| `MV-RL-94ef102c7f21` | benhaotang_mcp-serverman | `enable_server` | Python | `developer-tools/benhaotang_mcp-serverman_cadff57_python/mcp_serverman/data/servers/mcp_tool_server.py:18` | `Remote Listener Attack/benhaotang_mcp-serverman/mcp_serverman/data/servers/mcp_tool_server.py:24` | safe behavior branch insertion |
| `MV-RL-0069f8f4bcfe` | benhaotang_mcp-serverman | `save_server` | Python | `developer-tools/benhaotang_mcp-serverman_cadff57_python/mcp_serverman/data/servers/mcp_tool_server.py:55` | `Remote Listener Attack/benhaotang_mcp-serverman/mcp_serverman/data/servers/mcp_tool_server.py:62` | safe behavior branch insertion |
| `MV-RL-4d4848454e0d` | benhaotang_mcp-serverman | `disable_servers` | Python | `developer-tools/benhaotang_mcp-serverman_cadff57_python/mcp_serverman/data/servers/mcp_tool_server.py:113` | `Remote Listener Attack/benhaotang_mcp-serverman/mcp_serverman/data/servers/mcp_tool_server.py:122` | safe behavior branch insertion |
| `MV-RL-5b71a43fd368` | chongdashu-unreal-mcp | `spawn_blueprint_actor` | Python | `ai/chongdashu-unreal-mcp_4e5f00d_cpp/chongdashu-unreal-mcp-4e5f00d/Python/tools/editor_tools.py:310` | `Remote Listener Attack/chongdashu-unreal-mcp/chongdashu-unreal-mcp-4e5f00d/Python/tools/editor_tools.py:329` | safe behavior branch insertion |
| `MV-RL-eca404edc2bb` | chongdashu-unreal-mcp | `add_blueprint_input_action_node` | Python | `ai/chongdashu-unreal-mcp_4e5f00d_cpp/chongdashu-unreal-mcp-4e5f00d/Python/tools/node_tools.py:72` | `Remote Listener Attack/chongdashu-unreal-mcp/chongdashu-unreal-mcp-4e5f00d/Python/tools/node_tools.py:89` | safe behavior branch insertion |
| `MV-RL-3e897a202328` | chongdashu-unreal-mcp | `connect_blueprint_nodes` | Python | `ai/chongdashu-unreal-mcp_4e5f00d_cpp/chongdashu-unreal-mcp-4e5f00d/Python/tools/node_tools.py:182` | `Remote Listener Attack/chongdashu-unreal-mcp/chongdashu-unreal-mcp-4e5f00d/Python/tools/node_tools.py:205` | safe behavior branch insertion |
| `MV-RL-764b97dff58f` | chongdashu-unreal-mcp | `bind_widget_event` | Python | `ai/chongdashu-unreal-mcp_4e5f00d_cpp/chongdashu-unreal-mcp-4e5f00d/Python/tools/umg_tools.py:186` | `Remote Listener Attack/chongdashu-unreal-mcp/chongdashu-unreal-mcp-4e5f00d/Python/tools/umg_tools.py:205` | safe behavior branch insertion |
| `MV-RL-b6c821f8290e` | chongdashu-unreal-mcp | `add_widget_to_viewport` | Python | `ai/chongdashu-unreal-mcp_4e5f00d_cpp/chongdashu-unreal-mcp-4e5f00d/Python/tools/umg_tools.py:240` | `Remote Listener Attack/chongdashu-unreal-mcp/chongdashu-unreal-mcp-4e5f00d/Python/tools/umg_tools.py:257` | safe behavior branch insertion |
| `MV-RL-fc65ca61bb5e` | cisco-open-network-sketcher | `create_empty_master` | Python | `Other_Tools_and_Integrations/cisco-open-network-sketcher_85e5262_python/cisco-open-network-sketcher-85e5262/network-sketcher_local_mcp/ns_mcp_server.py:923` | `Remote Listener Attack/cisco-open-network-sketcher/cisco-open-network-sketcher-85e5262/network-sketcher_local_mcp/ns_mcp_server.py:939` | safe behavior branch insertion |
| `MV-RL-bab33b08d64b` | cisco-open-network-sketcher | `get_network_state` | Python | `Other_Tools_and_Integrations/cisco-open-network-sketcher_85e5262_python/cisco-open-network-sketcher-85e5262/network-sketcher_local_mcp/ns_mcp_server.py:1007` | `Remote Listener Attack/cisco-open-network-sketcher/cisco-open-network-sketcher-85e5262/network-sketcher_local_mcp/ns_mcp_server.py:1025` | safe behavior branch insertion |
| `MV-RL-96e9e2fc6d7f` | cisco-open-network-sketcher | `get_ai_context` | Python | `Other_Tools_and_Integrations/cisco-open-network-sketcher_85e5262_python/cisco-open-network-sketcher-85e5262/network-sketcher_local_mcp/ns_mcp_server.py:1097` | `Remote Listener Attack/cisco-open-network-sketcher/cisco-open-network-sketcher-85e5262/network-sketcher_local_mcp/ns_mcp_server.py:1117` | safe behavior branch insertion |
| `MV-RL-3c9e8e223409` | cisco-open-network-sketcher | `import_master` | Python | `Other_Tools_and_Integrations/cisco-open-network-sketcher_85e5262_python/cisco-open-network-sketcher-85e5262/network-sketcher_local_mcp/ns_mcp_server.py:1256` | `Remote Listener Attack/cisco-open-network-sketcher/cisco-open-network-sketcher-85e5262/network-sketcher_local_mcp/ns_mcp_server.py:1280` | safe behavior branch insertion |
| `MV-RL-f4a138434d54` | cisco-open-network-sketcher | `export_device_table_html` | Python | `Other_Tools_and_Integrations/cisco-open-network-sketcher_85e5262_python/cisco-open-network-sketcher-85e5262/network-sketcher_local_mcp/ns_mcp_server.py:1565` | `Remote Listener Attack/cisco-open-network-sketcher/cisco-open-network-sketcher-85e5262/network-sketcher_local_mcp/ns_mcp_server.py:1598` | safe behavior branch insertion |
| `MV-RL-bbe33bd64240` | ckreiling-mcp-server-docker | `fetch_container_logs` | Python | `Cloud_Platforms/ckreiling-mcp-server-docker_57a7df2_python/ckreiling-mcp-server-docker-57a7df2/src/mcp_server_docker/server.py:430` | `Remote Listener Attack/ckreiling-mcp-server-docker/ckreiling-mcp-server-docker-57a7df2/src/mcp_server_docker/server.py:438` | safe behavior branch insertion |
| `MV-RL-ee981f718678` | ckreiling-mcp-server-docker | `list_networks` | Python | `Cloud_Platforms/ckreiling-mcp-server-docker_57a7df2_python/ckreiling-mcp-server-docker-57a7df2/src/mcp_server_docker/server.py:569` | `Remote Listener Attack/ckreiling-mcp-server-docker/ckreiling-mcp-server-docker-57a7df2/src/mcp_server_docker/server.py:577` | safe behavior branch insertion |
| `MV-RL-d5d1c194399c` | ckreiling-mcp-server-docker | `create_network` | Python | `Cloud_Platforms/ckreiling-mcp-server-docker_57a7df2_python/ckreiling-mcp-server-docker-57a7df2/src/mcp_server_docker/server.py:589` | `Remote Listener Attack/ckreiling-mcp-server-docker/ckreiling-mcp-server-docker-57a7df2/src/mcp_server_docker/server.py:602` | safe behavior branch insertion |
| `MV-RL-e3f12d928907` | ckreiling-mcp-server-docker | `remove_network` | Python | `Cloud_Platforms/ckreiling-mcp-server-docker_57a7df2_python/ckreiling-mcp-server-docker-57a7df2/src/mcp_server_docker/server.py:611` | `Remote Listener Attack/ckreiling-mcp-server-docker/ckreiling-mcp-server-docker-57a7df2/src/mcp_server_docker/server.py:621` | safe behavior branch insertion |
| `MV-RL-53493a208251` | diivi-aseprite-mcp | `set_onion_skin` | Python | `Other_Tools_and_Integrations/diivi-aseprite-mcp_a89b205_python/diivi-aseprite-mcp-a89b205/aseprite_mcp/tools/animation.py:811` | `Remote Listener Attack/diivi-aseprite-mcp/diivi-aseprite-mcp-a89b205/aseprite_mcp/tools/animation.py:819` | safe behavior branch insertion |
| `MV-RL-4514c290882e` | diivi-aseprite-mcp | `draw_line` | Python | `Other_Tools_and_Integrations/diivi-aseprite-mcp_a89b205_python/diivi-aseprite-mcp-a89b205/aseprite_mcp/tools/drawing.py:78` | `Remote Listener Attack/diivi-aseprite-mcp/diivi-aseprite-mcp-a89b205/aseprite_mcp/tools/drawing.py:90` | safe behavior branch insertion |
| `MV-RL-2c36749e4a69` | diivi-aseprite-mcp | `quantize_to_palette` | Python | `Other_Tools_and_Integrations/diivi-aseprite-mcp_a89b205_python/diivi-aseprite-mcp-a89b205/aseprite_mcp/tools/palette.py:317` | `Remote Listener Attack/diivi-aseprite-mcp/diivi-aseprite-mcp-a89b205/aseprite_mcp/tools/palette.py:335` | safe behavior branch insertion |
| `MV-RL-c6187be25e20` | diivi-aseprite-mcp | `start_preview_server` | Python | `Other_Tools_and_Integrations/diivi-aseprite-mcp_a89b205_python/diivi-aseprite-mcp-a89b205/aseprite_mcp/tools/preview.py:27` | `Remote Listener Attack/diivi-aseprite-mcp/diivi-aseprite-mcp-a89b205/aseprite_mcp/tools/preview.py:34` | safe behavior branch insertion |
| `MV-RL-6662d1641b1b` | diivi-aseprite-mcp | `stop_preview_server` | Python | `Other_Tools_and_Integrations/diivi-aseprite-mcp_a89b205_python/diivi-aseprite-mcp-a89b205/aseprite_mcp/tools/preview.py:61` | `Remote Listener Attack/diivi-aseprite-mcp/diivi-aseprite-mcp-a89b205/aseprite_mcp/tools/preview.py:69` | safe behavior branch insertion |
| `MV-RL-e7079df5e318` | ffpy_my-mcp-ssh | `connect` | Python | `llm-integration/ffpy_my-mcp-ssh_bbf6df7_python/src/main.py:87` | `Remote Listener Attack/ffpy_my-mcp-ssh/src/main.py:109` | safe behavior branch insertion |
| `MV-RL-76337ff800b3` | ffpy_my-mcp-ssh | `disconnect` | Python | `llm-integration/ffpy_my-mcp-ssh_bbf6df7_python/src/main.py:166` | `Remote Listener Attack/ffpy_my-mcp-ssh/src/main.py:177` | safe behavior branch insertion |
| `MV-RL-c04ef64d97be` | ffpy_my-mcp-ssh | `execute` | Python | `llm-integration/ffpy_my-mcp-ssh_bbf6df7_python/src/main.py:204` | `Remote Listener Attack/ffpy_my-mcp-ssh/src/main.py:220` | safe behavior branch insertion |
| `MV-RL-069f71004992` | ffpy_my-mcp-ssh | `upload` | Python | `llm-integration/ffpy_my-mcp-ssh_bbf6df7_python/src/main.py:248` | `Remote Listener Attack/ffpy_my-mcp-ssh/src/main.py:265` | safe behavior branch insertion |
| `MV-RL-e7bd2f3b0dbb` | ffpy_my-mcp-ssh | `download` | Python | `llm-integration/ffpy_my-mcp-ssh_bbf6df7_python/src/main.py:283` | `Remote Listener Attack/ffpy_my-mcp-ssh/src/main.py:302` | safe behavior branch insertion |
| `MV-RL-22cffefef096` | lpigeon-ros_mcp_server | `send_action_goal` | Python | `Other_Tools_and_Integrations/lpigeon-ros_mcp_server_476591a_python/robotmcp-ros-mcp-server-476591a/ros_mcp/tools/actions.py:319` | `Remote Listener Attack/lpigeon-ros_mcp_server/robotmcp-ros-mcp-server-476591a/ros_mcp/tools/actions.py:338` | safe behavior branch insertion |
| `MV-RL-b48d10c4e5bc` | lpigeon-ros_mcp_server | `connect_to_robot` | Python | `Other_Tools_and_Integrations/lpigeon-ros_mcp_server_476591a_python/robotmcp-ros-mcp-server-476591a/ros_mcp/tools/connection.py:31` | `Remote Listener Attack/lpigeon-ros_mcp_server/robotmcp-ros-mcp-server-476591a/ros_mcp/tools/connection.py:50` | safe behavior branch insertion |
| `MV-RL-9ce93ed26b92` | lpigeon-ros_mcp_server | `get_service_type` | Python | `Other_Tools_and_Integrations/lpigeon-ros_mcp_server_476591a_python/robotmcp-ros-mcp-server-476591a/ros_mcp/tools/services.py:62` | `Remote Listener Attack/lpigeon-ros_mcp_server/robotmcp-ros-mcp-server-476591a/ros_mcp/tools/services.py:73` | safe behavior branch insertion |
| `MV-RL-ea0fc36af507` | lpigeon-ros_mcp_server | `get_service_details` | Python | `Other_Tools_and_Integrations/lpigeon-ros_mcp_server_476591a_python/robotmcp-ros-mcp-server-476591a/ros_mcp/tools/services.py:110` | `Remote Listener Attack/lpigeon-ros_mcp_server/robotmcp-ros-mcp-server-476591a/ros_mcp/tools/services.py:124` | safe behavior branch insertion |
| `MV-RL-ffa4a210845a` | lpigeon-ros_mcp_server | `call_service` | Python | `Other_Tools_and_Integrations/lpigeon-ros_mcp_server_476591a_python/robotmcp-ros-mcp-server-476591a/ros_mcp/tools/services.py:260` | `Remote Listener Attack/lpigeon-ros_mcp_server/robotmcp-ros-mcp-server-476591a/ros_mcp/tools/services.py:283` | safe behavior branch insertion |
| `MV-RL-7ecb29c29054` | lpigeon-ros_mcp_server | `subscribe_once` | Python | `Other_Tools_and_Integrations/lpigeon-ros_mcp_server_476591a_python/robotmcp-ros-mcp-server-476591a/ros_mcp/tools/topics.py:283` | `Remote Listener Attack/lpigeon-ros_mcp_server/robotmcp-ros-mcp-server-476591a/ros_mcp/tools/topics.py:311` | safe behavior branch insertion |
| `MV-RL-5c618d7a9383` | lpigeon-ros_mcp_server | `publish_once` | Python | `Other_Tools_and_Integrations/lpigeon-ros_mcp_server_476591a_python/robotmcp-ros-mcp-server-476591a/ros_mcp/tools/topics.py:738` | `Remote Listener Attack/lpigeon-ros_mcp_server/robotmcp-ros-mcp-server-476591a/ros_mcp/tools/topics.py:755` | safe behavior branch insertion |
| `MV-RL-df615705e612` | mrexodia-ida-pro-mcp | `callgraph` | Python | `Other_Tools_and_Integrations/mrexodia-ida-pro-mcp_c133c38_python/mrexodia-ida-pro-mcp-c133c38/src/ida_pro_mcp/ida_mcp/api_analysis.py:2469` | `Remote Listener Attack/mrexodia-ida-pro-mcp/mrexodia-ida-pro-mcp-c133c38/src/ida_pro_mcp/ida_mcp/api_analysis.py:2487` | safe behavior branch insertion |
| `MV-RL-3ec6dbc07b9b` | mrexodia-ida-pro-mcp | `dbg_regs_remote` | Python | `Other_Tools_and_Integrations/mrexodia-ida-pro-mcp_c133c38_python/mrexodia-ida-pro-mcp-c133c38/src/ida_pro_mcp/ida_mcp/api_debug.py:753` | `Remote Listener Attack/mrexodia-ida-pro-mcp/mrexodia-ida-pro-mcp-c133c38/src/ida_pro_mcp/ida_mcp/api_debug.py:759` | safe behavior branch insertion |
| `MV-RL-bcc95c805a9c` | mrexodia-ida-pro-mcp | `dbg_gpregs_remote` | Python | `Other_Tools_and_Integrations/mrexodia-ida-pro-mcp_c133c38_python/mrexodia-ida-pro-mcp-c133c38/src/ida_pro_mcp/ida_mcp/api_debug.py:794` | `Remote Listener Attack/mrexodia-ida-pro-mcp/mrexodia-ida-pro-mcp-c133c38/src/ida_pro_mcp/ida_mcp/api_debug.py:802` | safe behavior branch insertion |
| `MV-RL-0ef4cd621f05` | mrexodia-ida-pro-mcp | `dbg_regs_named_remote` | Python | `Other_Tools_and_Integrations/mrexodia-ida-pro-mcp_c133c38_python/mrexodia-ida-pro-mcp-c133c38/src/ida_pro_mcp/ida_mcp/api_debug.py:835` | `Remote Listener Attack/mrexodia-ida-pro-mcp/mrexodia-ida-pro-mcp-c133c38/src/ida_pro_mcp/ida_mcp/api_debug.py:848` | safe behavior branch insertion |
| `MV-RL-4f2c11e8f62f` | mrexodia-ida-pro-mcp | `dbg_read` | Python | `Other_Tools_and_Integrations/mrexodia-ida-pro-mcp_c133c38_python/mrexodia-ida-pro-mcp-c133c38/src/ida_pro_mcp/ida_mcp/api_debug.py:928` | `Remote Listener Attack/mrexodia-ida-pro-mcp/mrexodia-ida-pro-mcp-c133c38/src/ida_pro_mcp/ida_mcp/api_debug.py:941` | safe behavior branch insertion |
| `MV-RL-170a669b6586` | mrexodia-ida-pro-mcp | `idb_open` | Python | `Other_Tools_and_Integrations/mrexodia-ida-pro-mcp_c133c38_python/mrexodia-ida-pro-mcp-c133c38/src/ida_pro_mcp/idalib_server.py:102` | `Remote Listener Attack/mrexodia-ida-pro-mcp/mrexodia-ida-pro-mcp-c133c38/src/ida_pro_mcp/idalib_server.py:119` | safe behavior branch insertion |
| `MV-RL-dd7a6d1d83a4` | skysqlinc_skysql-mcp | `launch_serverless_db` | Python | `developer-tools/skysqlinc_skysql-mcp_f8f4f76_python/src/mcp-server/server.py:121` | `Remote Listener Attack/skysqlinc_skysql-mcp/src/mcp-server/server.py:124` | safe behavior branch insertion |
| `MV-RL-111fa65181aa` | skysqlinc_skysql-mcp | `delete_db` | Python | `developer-tools/skysqlinc_skysql-mcp_f8f4f76_python/src/mcp-server/server.py:153` | `Remote Listener Attack/skysqlinc_skysql-mcp/src/mcp-server/server.py:157` | safe behavior branch insertion |
| `MV-RL-f3e44d232a48` | skysqlinc_skysql-mcp | `ask_agent` | Python | `developer-tools/skysqlinc_skysql-mcp_f8f4f76_python/src/mcp-server/server.py:172` | `Remote Listener Attack/skysqlinc_skysql-mcp/src/mcp-server/server.py:178` | safe behavior branch insertion |
| `MV-RL-fdc0df553537` | skysqlinc_skysql-mcp | `get_db_credentials` | Python | `developer-tools/skysqlinc_skysql-mcp_f8f4f76_python/src/mcp-server/server.py:258` | `Remote Listener Attack/skysqlinc_skysql-mcp/src/mcp-server/server.py:266` | safe behavior branch insertion |
| `MV-RL-ccef8c065414` | skysqlinc_skysql-mcp | `update_ip_allowlist` | Python | `developer-tools/skysqlinc_skysql-mcp_f8f4f76_python/src/mcp-server/server.py:298` | `Remote Listener Attack/skysqlinc_skysql-mcp/src/mcp-server/server.py:308` | safe behavior branch insertion |
| `MV-RL-b3cd2a641ac9` | skysqlinc_skysql-mcp | `execute_sql` | Python | `developer-tools/skysqlinc_skysql-mcp_f8f4f76_python/src/mcp-server/server.py:371` | `Remote Listener Attack/skysqlinc_skysql-mcp/src/mcp-server/server.py:383` | safe behavior branch insertion |
| `MV-RL-40b02dfaef06` | sooperset-mcp-atlassian | `get_issue` | Python | `developer-tools/sooperset-mcp-atlassian_0a5d242_python/sooperset-mcp-atlassian-0a5d242/src/mcp_atlassian/servers/jira.py:653` | `Remote Listener Attack/sooperset-mcp-atlassian/sooperset-mcp-atlassian-0a5d242/src/mcp_atlassian/servers/jira.py:757` | safe behavior branch insertion |
| `MV-RL-0ddba30d40e5` | sooperset-mcp-atlassian | `get_project_issues` | Python | `developer-tools/sooperset-mcp-atlassian_0a5d242_python/sooperset-mcp-atlassian-0a5d242/src/mcp_atlassian/servers/jira.py:1173` | `Remote Listener Attack/sooperset-mcp-atlassian/sooperset-mcp-atlassian-0a5d242/src/mcp_atlassian/servers/jira.py:1204` | safe behavior branch insertion |
| `MV-RL-ea500348b270` | sooperset-mcp-atlassian | `move_issue` | Python | `developer-tools/sooperset-mcp-atlassian_0a5d242_python/sooperset-mcp-atlassian-0a5d242/src/mcp_atlassian/servers/jira.py:2515` | `Remote Listener Attack/sooperset-mcp-atlassian/sooperset-mcp-atlassian-0a5d242/src/mcp_atlassian/servers/jira.py:2561` | safe behavior branch insertion |
| `MV-RL-3143f408bd4b` | sooperset-mcp-atlassian | `create_remote_issue_link` | Python | `developer-tools/sooperset-mcp-atlassian_0a5d242_python/sooperset-mcp-atlassian-0a5d242/src/mcp_atlassian/servers/jira.py:2940` | `Remote Listener Attack/sooperset-mcp-atlassian/sooperset-mcp-atlassian-0a5d242/src/mcp_atlassian/servers/jira.py:3000` | safe behavior branch insertion |
| `MV-RL-f04e9bee4a3d` | sooperset-mcp-atlassian | `get_project_components` | Python | `developer-tools/sooperset-mcp-atlassian_0a5d242_python/sooperset-mcp-atlassian-0a5d242/src/mcp_atlassian/servers/jira.py:3444` | `Remote Listener Attack/sooperset-mcp-atlassian/sooperset-mcp-atlassian-0a5d242/src/mcp_atlassian/servers/jira.py:3463` | safe behavior branch insertion |
| `MV-RL-4e09fb8753f0` | sooperset-mcp-atlassian | `get_service_desk_for_project` | Python | `developer-tools/sooperset-mcp-atlassian_0a5d242_python/sooperset-mcp-atlassian-0a5d242/src/mcp_atlassian/servers/jira.py:3669` | `Remote Listener Attack/sooperset-mcp-atlassian/sooperset-mcp-atlassian-0a5d242/src/mcp_atlassian/servers/jira.py:3704` | safe behavior branch insertion |
| `MV-RL-3e51bda23ce5` | sooperset-mcp-atlassian | `get_service_desk_queues` | Python | `developer-tools/sooperset-mcp-atlassian_0a5d242_python/sooperset-mcp-atlassian-0a5d242/src/mcp_atlassian/servers/jira.py:3707` | `Remote Listener Attack/sooperset-mcp-atlassian/sooperset-mcp-atlassian-0a5d242/src/mcp_atlassian/servers/jira.py:3751` | safe behavior branch insertion |
| `MV-RL-c00481c1c3e9` | stuzero-pg-mcp-server | `connect` | Python | `databases/stuzero-pg-mcp-server_d693c43_python/stuzero-pg-mcp-server-d693c43/server/tools/connection.py:13` | `Remote Listener Attack/stuzero-pg-mcp-server/stuzero-pg-mcp-server-d693c43/server/tools/connection.py:26` | safe behavior branch insertion |
| `MV-RL-cc8d0416e658` | stuzero-pg-mcp-server | `disconnect` | Python | `databases/stuzero-pg-mcp-server_d693c43_python/stuzero-pg-mcp-server-d693c43/server/tools/connection.py:36` | `Remote Listener Attack/stuzero-pg-mcp-server/stuzero-pg-mcp-server-d693c43/server/tools/connection.py:51` | safe behavior branch insertion |
| `MV-RL-a96cdb20d63e` | stuzero-pg-mcp-server | `pg_query` | Python | `databases/stuzero-pg-mcp-server_d693c43_python/stuzero-pg-mcp-server-d693c43/server/tools/query.py:52` | `Remote Listener Attack/stuzero-pg-mcp-server/stuzero-pg-mcp-server-d693c43/server/tools/query.py:65` | safe behavior branch insertion |
| `MV-RL-c9a2b530c372` | stuzero-pg-mcp-server | `pg_explain` | Python | `databases/stuzero-pg-mcp-server_d693c43_python/stuzero-pg-mcp-server-d693c43/server/tools/query.py:68` | `Remote Listener Attack/stuzero-pg-mcp-server/stuzero-pg-mcp-server-d693c43/server/tools/query.py:83` | safe behavior branch insertion |
| `MV-RL-241eac72cc0b` | stuzero-pg-mcp-server | `pg_metadata` | Python | `databases/stuzero-pg-mcp-server_d693c43_python/stuzero-pg-mcp-server-d693c43/server/tools/viz.py:106` | `Remote Listener Attack/stuzero-pg-mcp-server/stuzero-pg-mcp-server-d693c43/server/tools/viz.py:118` | safe behavior branch insertion |
| `MV-RL-5b52f8e356a7` | systemcraftsman-strimzi-kafka-cli | `create_connect` | Python | `developer-tools/systemcraftsman-strimzi-kafka-cli_1727572_python/SystemCraftsman-strimzi-kafka-cli-1727572/kfk/mcp_server.py:246` | `Remote Listener Attack/systemcraftsman-strimzi-kafka-cli/SystemCraftsman-strimzi-kafka-cli-1727572/kfk/mcp_server.py:256` | safe behavior branch insertion |
| `MV-RL-25ddbaa2c44d` | systemcraftsman-strimzi-kafka-cli | `list_connectors` | Python | `developer-tools/systemcraftsman-strimzi-kafka-cli_1727572_python/SystemCraftsman-strimzi-kafka-cli-1727572/kfk/mcp_server.py:289` | `Remote Listener Attack/systemcraftsman-strimzi-kafka-cli/SystemCraftsman-strimzi-kafka-cli-1727572/kfk/mcp_server.py:293` | safe behavior branch insertion |
| `MV-RL-b93553d95495` | systemcraftsman-strimzi-kafka-cli | `get_connector` | Python | `developer-tools/systemcraftsman-strimzi-kafka-cli_1727572_python/SystemCraftsman-strimzi-kafka-cli-1727572/kfk/mcp_server.py:295` | `Remote Listener Attack/systemcraftsman-strimzi-kafka-cli/SystemCraftsman-strimzi-kafka-cli-1727572/kfk/mcp_server.py:301` | safe behavior branch insertion |
| `MV-RL-54284139f027` | systemcraftsman-strimzi-kafka-cli | `alter_connector` | Python | `developer-tools/systemcraftsman-strimzi-kafka-cli_1727572_python/SystemCraftsman-strimzi-kafka-cli-1727572/kfk/mcp_server.py:313` | `Remote Listener Attack/systemcraftsman-strimzi-kafka-cli/SystemCraftsman-strimzi-kafka-cli-1727572/kfk/mcp_server.py:321` | safe behavior branch insertion |
| `MV-RL-2b98c1dc2071` | tiianhk-maxmsp-mcp-server | `connect_max_objects` | Python | `Other_Tools_and_Integrations/tiianhk-maxmsp-mcp-server_6d7b716_python/tiianhk-MaxMSP-MCP-Server-6d7b716/server.py:173` | `Remote Listener Attack/tiianhk-maxmsp-mcp-server/tiianhk-MaxMSP-MCP-Server-6d7b716/server.py:188` | safe behavior branch insertion |
| `MV-RL-15dee994aad4` | tiianhk-maxmsp-mcp-server | `disconnect_max_objects` | Python | `Other_Tools_and_Integrations/tiianhk-maxmsp-mcp-server_6d7b716_python/tiianhk-MaxMSP-MCP-Server-6d7b716/server.py:201` | `Remote Listener Attack/tiianhk-maxmsp-mcp-server/tiianhk-MaxMSP-MCP-Server-6d7b716/server.py:218` | safe behavior branch insertion |
| `MV-RL-c0d58ae3bac2` | tiianhk-maxmsp-mcp-server | `set_object_attribute` | Python | `Other_Tools_and_Integrations/tiianhk-maxmsp-mcp-server_6d7b716_python/tiianhk-MaxMSP-MCP-Server-6d7b716/server.py:229` | `Remote Listener Attack/tiianhk-maxmsp-mcp-server/tiianhk-MaxMSP-MCP-Server-6d7b716/server.py:246` | safe behavior branch insertion |
| `MV-RL-ef28e15113a0` | tiianhk-maxmsp-mcp-server | `set_message_text` | Python | `Other_Tools_and_Integrations/tiianhk-maxmsp-mcp-server_6d7b716_python/tiianhk-MaxMSP-MCP-Server-6d7b716/server.py:250` | `Remote Listener Attack/tiianhk-maxmsp-mcp-server/tiianhk-MaxMSP-MCP-Server-6d7b716/server.py:267` | safe behavior branch insertion |
| `MV-RL-812339bfbe6b` | tiianhk-maxmsp-mcp-server | `send_bang_to_object` | Python | `Other_Tools_and_Integrations/tiianhk-maxmsp-mcp-server_6d7b716_python/tiianhk-MaxMSP-MCP-Server-6d7b716/server.py:269` | `Remote Listener Attack/tiianhk-maxmsp-mcp-server/tiianhk-MaxMSP-MCP-Server-6d7b716/server.py:283` | safe behavior branch insertion |
| `MV-RL-4c209bf60c86` | tiianhk-maxmsp-mcp-server | `send_messages_to_object` | Python | `Other_Tools_and_Integrations/tiianhk-maxmsp-mcp-server_6d7b716_python/tiianhk-MaxMSP-MCP-Server-6d7b716/server.py:283` | `Remote Listener Attack/tiianhk-maxmsp-mcp-server/tiianhk-MaxMSP-MCP-Server-6d7b716/server.py:311` | safe behavior branch insertion |
| `MV-RL-d79e2993d971` | tiianhk-maxmsp-mcp-server | `set_number` | Python | `Other_Tools_and_Integrations/tiianhk-maxmsp-mcp-server_6d7b716_python/tiianhk-MaxMSP-MCP-Server-6d7b716/server.py:309` | `Remote Listener Attack/tiianhk-maxmsp-mcp-server/tiianhk-MaxMSP-MCP-Server-6d7b716/server.py:334` | safe behavior branch insertion |
| `MV-RL-9e5681ee59ce` | tiianhk-maxmsp-mcp-server | `get_object_doc` | Python | `Other_Tools_and_Integrations/tiianhk-maxmsp-mcp-server_6d7b716_python/tiianhk-MaxMSP-MCP-Server-6d7b716/server.py:337` | `Remote Listener Attack/tiianhk-maxmsp-mcp-server/tiianhk-MaxMSP-MCP-Server-6d7b716/server.py:362` | safe behavior branch insertion |
| `MV-RL-fdaf6aa15b90` | tiianhk-maxmsp-mcp-server | `get_object_attributes` | Python | `Other_Tools_and_Integrations/tiianhk-maxmsp-mcp-server_6d7b716_python/tiianhk-MaxMSP-MCP-Server-6d7b716/server.py:399` | `Remote Listener Attack/tiianhk-maxmsp-mcp-server/tiianhk-MaxMSP-MCP-Server-6d7b716/server.py:423` | safe behavior branch insertion |
| `MV-RL-cd60b786b928` | vladimir-tutin-plex-mcp-server | `server_get_plex_logs` | Python | `Other_Tools_and_Integrations/vladimir-tutin-plex-mcp-server_c28e261_python/vladimir-tutin-plex-mcp-server-c28e261/modules/server.py:9` | `Remote Listener Attack/vladimir-tutin-plex-mcp-server/vladimir-tutin-plex-mcp-server-c28e261/modules/server.py:22` | safe behavior branch insertion |
| `MV-RL-c3b85b915741` | vladimir-tutin-plex-mcp-server | `server_get_bandwidth` | Python | `Other_Tools_and_Integrations/vladimir-tutin-plex-mcp-server_c28e261_python/vladimir-tutin-plex-mcp-server-c28e261/modules/server.py:217` | `Remote Listener Attack/vladimir-tutin-plex-mcp-server/vladimir-tutin-plex-mcp-server-c28e261/modules/server.py:229` | safe behavior branch insertion |
| `MV-RL-666aa0e2fe42` | vladimir-tutin-plex-mcp-server | `server_get_alerts` | Python | `Other_Tools_and_Integrations/vladimir-tutin-plex-mcp-server_c28e261_python/vladimir-tutin-plex-mcp-server-c28e261/modules/server.py:378` | `Remote Listener Attack/vladimir-tutin-plex-mcp-server/vladimir-tutin-plex-mcp-server-c28e261/modules/server.py:391` | safe behavior branch insertion |
| `MV-RL-9f9d86de3354` | vladimir-tutin-plex-mcp-server | `server_run_butler_task` | Python | `Other_Tools_and_Integrations/vladimir-tutin-plex-mcp-server_c28e261_python/vladimir-tutin-plex-mcp-server-c28e261/modules/server.py:447` | `Remote Listener Attack/vladimir-tutin-plex-mcp-server/vladimir-tutin-plex-mcp-server-c28e261/modules/server.py:462` | safe behavior branch insertion |
| `MV-RL-907b952785f5` | vladimir-tutin-plex-mcp-server | `server_empty_trash` | Python | `Other_Tools_and_Integrations/vladimir-tutin-plex-mcp-server_c28e261_python/vladimir-tutin-plex-mcp-server-c28e261/modules/server.py:516` | `Remote Listener Attack/vladimir-tutin-plex-mcp-server/vladimir-tutin-plex-mcp-server-c28e261/modules/server.py:535` | safe behavior branch insertion |
