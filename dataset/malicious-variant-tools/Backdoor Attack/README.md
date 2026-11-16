# Backdoor Attack Malicious Variant Tools

## Category Overview

| Field | Value |
|---|---|
| Attack type | Backdoor Attack |
| DTPE stage | Execution |
| Source server directories | 17 |
| Modified tools | 99 |
| Languages | Python: 99 |
| Mutation forms | safe behavior branch insertion: 99 |

## Modified Tool Records

### MV-BD-f5ee68af4806 `MatiousCorp_google-ad-manager-mcp` / `update_line_item`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-f5ee68af4806` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Marketing/MatiousCorp_google-ad-manager-mcp_05cea48_python/src/gam_mcp/server.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/MatiousCorp_google-ad-manager-mcp/src/gam_mcp/server.py` |
| Tool name | `update_line_item` -> `update_line_item` |
| Original location | `Marketing/MatiousCorp_google-ad-manager-mcp_05cea48_python/src/gam_mcp/server.py:300` |
| Mutation location | `Backdoor Attack/MatiousCorp_google-ad-manager-mcp/src/gam_mcp/server.py:347--348` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `line_item_id` |
| Canary | `d23638be23` |

#### Original Source Context

Lines 341--353 from the reference file:

~~~python

    Note: At least one field must be provided to update.
    End date requires all three components (year, month, day).

    Returns the updated line item details with a list of changes made.
    """
    init_client()
    result = line_items.update_line_item(
        line_item_id=line_item_id,
        name=name,
        line_item_type=line_item_type,
        delivery_rate_type=delivery_rate_type,
        priority=priority,
~~~

### MV-BD-aef853d40d2e `MatiousCorp_google-ad-manager-mcp` / `upload_creative`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-aef853d40d2e` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Marketing/MatiousCorp_google-ad-manager-mcp_05cea48_python/src/gam_mcp/server.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/MatiousCorp_google-ad-manager-mcp/src/gam_mcp/server.py` |
| Tool name | `upload_creative` -> `upload_creative` |
| Original location | `Marketing/MatiousCorp_google-ad-manager-mcp_05cea48_python/src/gam_mcp/server.py:463` |
| Mutation location | `Backdoor Attack/MatiousCorp_google-ad-manager-mcp/src/gam_mcp/server.py:492--493` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `file_path` |
| Canary | `e6e3d0a01f` |

#### Original Source Context

Lines 484--496 from the reference file:

~~~python
    The creative size is extracted from the filename (e.g., '300x250' in 'banner_300x250.png').
    Use override_size_width and override_size_height together to serve a creative into a different sized placement
    (e.g., serve a 970x250 image into a 1000x250 slot).

    Returns the created creative details.
    """
    init_client()
    result = creatives.upload_creative(
        file_path=file_path,
        advertiser_id=advertiser_id,
        click_through_url=click_through_url,
        creative_name=creative_name,
        override_size_width=override_size_width,
~~~

### MV-BD-1ed76ca89be2 `MatiousCorp_google-ad-manager-mcp` / `upload_and_associate_creative`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-1ed76ca89be2` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Marketing/MatiousCorp_google-ad-manager-mcp_05cea48_python/src/gam_mcp/server.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/MatiousCorp_google-ad-manager-mcp/src/gam_mcp/server.py` |
| Tool name | `upload_and_associate_creative` -> `upload_and_associate_creative` |
| Original location | `Marketing/MatiousCorp_google-ad-manager-mcp_05cea48_python/src/gam_mcp/server.py:535` |
| Mutation location | `Backdoor Attack/MatiousCorp_google-ad-manager-mcp/src/gam_mcp/server.py:560--561` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `file_path` |
| Canary | `89d4387e41` |

#### Original Source Context

Lines 550--562 from the reference file:

~~~python
        creative_name: Optional name for the creative
        network_code: Optional GAM network code to target a specific network.
            If not provided, uses the default network.

    Returns the creative and association details.
    """
    init_client()
    result = creatives.upload_and_associate_creative(
        file_path=file_path,
        advertiser_id=advertiser_id,
        line_item_id=line_item_id,
        click_through_url=click_through_url,
        creative_name=creative_name,
~~~

### MV-BD-176dbb98b085 `MatiousCorp_google-ad-manager-mcp` / `bulk_upload_creatives`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-176dbb98b085` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Marketing/MatiousCorp_google-ad-manager-mcp_05cea48_python/src/gam_mcp/server.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/MatiousCorp_google-ad-manager-mcp/src/gam_mcp/server.py` |
| Tool name | `bulk_upload_creatives` -> `bulk_upload_creatives` |
| Original location | `Marketing/MatiousCorp_google-ad-manager-mcp_05cea48_python/src/gam_mcp/server.py:569` |
| Mutation location | `Backdoor Attack/MatiousCorp_google-ad-manager-mcp/src/gam_mcp/server.py:597--598` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `folder_path` |
| Canary | `601877d28b` |

#### Original Source Context

Lines 585--597 from the reference file:

~~~python
        network_code: Optional GAM network code to target a specific network.
            If not provided, uses the default network.

    Supported formats: jpg, jpeg, png, gif.
    Returns results for all uploads.
    """
    init_client()
    result = creatives.bulk_upload_creatives(
        folder_path=folder_path,
        advertiser_id=advertiser_id,
        line_item_id=line_item_id,
        click_through_url=click_through_url,
        name_prefix=name_prefix,
~~~

### MV-BD-1ce492141d00 `MatiousCorp_google-ad-manager-mcp` / `get_creative`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-1ce492141d00` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Marketing/MatiousCorp_google-ad-manager-mcp_05cea48_python/src/gam_mcp/server.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/MatiousCorp_google-ad-manager-mcp/src/gam_mcp/server.py` |
| Tool name | `get_creative` -> `get_creative` |
| Original location | `Marketing/MatiousCorp_google-ad-manager-mcp_05cea48_python/src/gam_mcp/server.py:604` |
| Mutation location | `Backdoor Attack/MatiousCorp_google-ad-manager-mcp/src/gam_mcp/server.py:622--623` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `creative_id` |
| Canary | `8753a60e41` |

#### Original Source Context

Lines 608--620 from the reference file:

~~~python
        creative_id: The creative ID
        network_code: Optional GAM network code to target a specific network.
            If not provided, uses the default network.

    Returns creative details including size and destination URL.
    """
    init_client()
    result = creatives.get_creative(creative_id=creative_id, network_code=network_code)
    return json.dumps(result, indent=2)


@mcp.tool()
def list_creatives_by_advertiser(
~~~

### MV-BD-b11b82864985 `MatiousCorp_google-ad-manager-mcp` / `create_advertiser`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-b11b82864985` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Marketing/MatiousCorp_google-ad-manager-mcp_05cea48_python/src/gam_mcp/server.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/MatiousCorp_google-ad-manager-mcp/src/gam_mcp/server.py` |
| Tool name | `create_advertiser` -> `create_advertiser` |
| Original location | `Marketing/MatiousCorp_google-ad-manager-mcp_05cea48_python/src/gam_mcp/server.py:827` |
| Mutation location | `Backdoor Attack/MatiousCorp_google-ad-manager-mcp/src/gam_mcp/server.py:854--855` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `name` |
| Canary | `2f0a576804` |

#### Original Source Context

Lines 838--850 from the reference file:

~~~python
        address: Optional address
        network_code: Optional GAM network code to target a specific network.
            If not provided, uses the default network.

    Returns the created advertiser details.
    """
    init_client()
    result = advertisers.create_advertiser(
        name=name,
        email=email,
        address=address,
        network_code=network_code
    )
~~~

### MV-BD-96ed2591dc69 `MatiousCorp_google-ad-manager-mcp` / `check_line_item_delivery_status`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-96ed2591dc69` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Marketing/MatiousCorp_google-ad-manager-mcp_05cea48_python/src/gam_mcp/server.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/MatiousCorp_google-ad-manager-mcp/src/gam_mcp/server.py` |
| Tool name | `check_line_item_delivery_status` -> `check_line_item_delivery_status` |
| Original location | `Marketing/MatiousCorp_google-ad-manager-mcp_05cea48_python/src/gam_mcp/server.py:901` |
| Mutation location | `Backdoor Attack/MatiousCorp_google-ad-manager-mcp/src/gam_mcp/server.py:923--924` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `line_item_id` |
| Canary | `1a3dc490d7` |

#### Original Source Context

Lines 905--917 from the reference file:

~~~python
        line_item_id: The line item ID to check
        network_code: Optional GAM network code to target a specific network.
            If not provided, uses the default network.

    Returns delivery progress including impressions, clicks, and goal progress.
    """
    init_client()
    result = verification.check_line_item_delivery_status(line_item_id=line_item_id, network_code=network_code)
    return json.dumps(result, indent=2)


@mcp.tool()
def verify_order_setup(order_id: int, network_code: Optional[str] = None) -> str:
~~~

### MV-BD-5a397d949be9 `ahujasid_blender-mcp` / `search_polyhaven_assets`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-5a397d949be9` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/ai/ahujasid_blender-mcp_7636d13_python/src/blender_mcp/server.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/ahujasid_blender-mcp/src/blender_mcp/server.py` |
| Tool name | `search_polyhaven_assets` -> `search_polyhaven_assets` |
| Original location | `ai/ahujasid_blender-mcp_7636d13_python/src/blender_mcp/server.py:384` |
| Mutation location | `Backdoor Attack/ahujasid_blender-mcp/src/blender_mcp/server.py:398--399` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `asset_type` |
| Canary | `37750b6834` |

#### Original Source Context

Lines 392--404 from the reference file:

~~~python
    Parameters:
    - asset_type: Type of assets to search for (hdris, textures, models, all)
    - categories: Optional comma-separated list of categories to filter by
    
    Returns a list of matching assets with basic information.
    """
    try:
        blender = get_blender_connection()
        result = blender.send_command("search_polyhaven_assets", {
            "asset_type": asset_type,
            "categories": categories
        })
        
~~~

### MV-BD-82fe207043f0 `ahujasid_blender-mcp` / `poll_rodin_job_status`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-82fe207043f0` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/ai/ahujasid_blender-mcp_7636d13_python/src/blender_mcp/server.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/ahujasid_blender-mcp/src/blender_mcp/server.py` |
| Tool name | `poll_rodin_job_status` -> `poll_rodin_job_status` |
| Original location | `ai/ahujasid_blender-mcp_7636d13_python/src/blender_mcp/server.py:901` |
| Mutation location | `Backdoor Attack/ahujasid_blender-mcp/src/blender_mcp/server.py:928--929` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `subscription_key` |
| Canary | `63782c160b` |

#### Original Source Context

Lines 920--932 from the reference file:

~~~python

        Returns the generation task status. The task is done if status is "COMPLETED".
        The task is in progress if status is "IN_PROGRESS".
        If status other than "COMPLETED", "IN_PROGRESS", "IN_QUEUE" showed up, the generating process might be failed.
        This is a polling API, so only proceed if the status are finally determined ("COMPLETED" or some failed state).
    """
    try:
        blender = get_blender_connection()
        kwargs = {}
        if subscription_key:
            kwargs = {
                "subscription_key": subscription_key,
            }
~~~

### MV-BD-af04e83e1b8f `ahujasid_blender-mcp` / `generate_hunyuan3d_model`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-af04e83e1b8f` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/ai/ahujasid_blender-mcp_7636d13_python/src/blender_mcp/server.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/ahujasid_blender-mcp/src/blender_mcp/server.py` |
| Tool name | `generate_hunyuan3d_model` -> `generate_hunyuan3d_model` |
| Original location | `ai/ahujasid_blender-mcp_7636d13_python/src/blender_mcp/server.py:995` |
| Mutation location | `Backdoor Attack/ahujasid_blender-mcp/src/blender_mcp/server.py:1018--1019` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `text_prompt` |
| Canary | `438d828e0a` |

#### Original Source Context

Lines 1008--1020 from the reference file:

~~~python

    Returns: 
    - When successful, returns a JSON with job_id (format: "job_xxx") indicating the task is in progress
    - When the job completes, the status will change to "DONE" indicating the model has been imported
    - Returns error message if the operation fails
    """
    try:
        blender = get_blender_connection()
        result = blender.send_command("create_hunyuan_job", {
            "text_prompt": text_prompt,
            "image": input_image_url,
        })
        if "JobId" in result.get("Response", {}):
~~~

### MV-BD-64a449b83694 `ahujasid_blender-mcp` / `poll_hunyuan_job_status`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-64a449b83694` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/ai/ahujasid_blender-mcp_7636d13_python/src/blender_mcp/server.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/ahujasid_blender-mcp/src/blender_mcp/server.py` |
| Tool name | `poll_hunyuan_job_status` -> `poll_hunyuan_job_status` |
| Original location | `ai/ahujasid_blender-mcp_7636d13_python/src/blender_mcp/server.py:1032` |
| Mutation location | `Backdoor Attack/ahujasid_blender-mcp/src/blender_mcp/server.py:1055--1056` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `job_id` |
| Canary | `797a8948e5` |

#### Original Source Context

Lines 1043--1055 from the reference file:

~~~python
        Returns the generation task status. The task is done if status is "DONE".
        The task is in progress if status is "RUN".
        If status is "DONE", returns ResultFile3Ds, which is the generated ZIP model path
        When the status is "DONE", the response includes a field named ResultFile3Ds that contains the generated ZIP file path of the 3D model in OBJ format.
        This is a polling API, so only proceed if the status are finally determined ("DONE" or some failed state).
    """
    try:
        blender = get_blender_connection()
        kwargs = {
            "job_id": job_id,
        }
        result = blender.send_command("poll_hunyuan_job_status", kwargs)
        return result
~~~

### MV-BD-39525046fa26 `alphavantage-alpha_vantage_mcp` / `congress_trades`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-39525046fa26` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/alphavantage-alpha_vantage_mcp_3ed9b05_python/alphavantage-alpha_vantage_mcp-3ed9b05/api/src/av_api/tools/congress.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/alphavantage-alpha_vantage_mcp/alphavantage-alpha_vantage_mcp-3ed9b05/api/src/av_api/tools/congress.py` |
| Tool name | `congress_trades` -> `congress_trades` |
| Original location | `Other_Tools_and_Integrations/alphavantage-alpha_vantage_mcp_3ed9b05_python/alphavantage-alpha_vantage_mcp-3ed9b05/api/src/av_api/tools/congress.py:5` |
| Mutation location | `Backdoor Attack/alphavantage-alpha_vantage_mcp/alphavantage-alpha_vantage_mcp-3ed9b05/api/src/av_api/tools/congress.py:19--20` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `symbol` |
| Canary | `71b8693a66` |

#### Original Source Context

Lines 13--25 from the reference file:

~~~python
        bioguide_id: BioGuide ID of the politician to filter trades. Example: "S000510". Use POLITICIAN_METADATA for the complete mapping. Required unless a stock symbol is given.
        datatype: By default, json. Strings json and csv are accepted.

    Returns:
        Congressional stock trade records matching the given symbol and/or bioguide_id.
    """
    symbol = (symbol or "").strip()
    bioguide_id = (bioguide_id or "").strip()
    if not symbol and not bioguide_id:
        raise ValueError("At least one of symbol or bioguide_id is required.")

    normalized_datatype = (datatype or "").strip().lower()
    if normalized_datatype not in ("json", "csv"):
~~~

### MV-BD-848d34c046a9 `alphavantage-alpha_vantage_mcp` / `digital_currency_weekly`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-848d34c046a9` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/alphavantage-alpha_vantage_mcp_3ed9b05_python/alphavantage-alpha_vantage_mcp-3ed9b05/api/src/av_api/tools/cryptocurrencies.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/alphavantage-alpha_vantage_mcp/alphavantage-alpha_vantage_mcp-3ed9b05/api/src/av_api/tools/cryptocurrencies.py` |
| Tool name | `digital_currency_weekly` -> `digital_currency_weekly` |
| Original location | `Other_Tools_and_Integrations/alphavantage-alpha_vantage_mcp_3ed9b05_python/alphavantage-alpha_vantage_mcp-3ed9b05/api/src/av_api/tools/cryptocurrencies.py:91` |
| Mutation location | `Backdoor Attack/alphavantage-alpha_vantage_mcp/alphavantage-alpha_vantage_mcp-3ed9b05/api/src/av_api/tools/cryptocurrencies.py:109--110` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `symbol` |
| Canary | `2fa290d87a` |

#### Original Source Context

Lines 103--115 from the reference file:

~~~python
        datatype: By default, datatype=csv. Strings json and csv are accepted with the following specifications: json returns the weekly time series in JSON format; csv returns the data as a CSV (comma separated value) file.

    Returns:
        The weekly time series data in the specified format.
    """

    params = {
        "symbol": symbol,
        "market": market,
        "datatype": datatype,
    }
    
    return _make_api_request("DIGITAL_CURRENCY_WEEKLY", params)
~~~

### MV-BD-f487689802d3 `alphavantage-alpha_vantage_mcp` / `listing_status`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-f487689802d3` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/alphavantage-alpha_vantage_mcp_3ed9b05_python/alphavantage-alpha_vantage_mcp-3ed9b05/api/src/av_api/tools/fundamental_data.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/alphavantage-alpha_vantage_mcp/alphavantage-alpha_vantage_mcp-3ed9b05/api/src/av_api/tools/fundamental_data.py` |
| Tool name | `listing_status` -> `listing_status` |
| Original location | `Other_Tools_and_Integrations/alphavantage-alpha_vantage_mcp_3ed9b05_python/alphavantage-alpha_vantage_mcp-3ed9b05/api/src/av_api/tools/fundamental_data.py:229` |
| Mutation location | `Backdoor Attack/alphavantage-alpha_vantage_mcp/alphavantage-alpha_vantage_mcp-3ed9b05/api/src/av_api/tools/fundamental_data.py:250--251` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `date` |
| Canary | `6b7a2534f9` |

#### Original Source Context

Lines 244--256 from the reference file:

~~~python
              Set state=delisted to query delisted assets.

    Returns:
        Listing status data in CSV format or error message.
    """

    params = {
        "state": state,
    }
    if date:
        params["date"] = date
    
    return _make_api_request("LISTING_STATUS", params)
~~~

### MV-BD-9ac97ab101f1 `alphavantage-alpha_vantage_mcp` / `realtime_put_call_ratio`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-9ac97ab101f1` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/alphavantage-alpha_vantage_mcp_3ed9b05_python/alphavantage-alpha_vantage_mcp-3ed9b05/api/src/av_api/tools/options_data_apis.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/alphavantage-alpha_vantage_mcp/alphavantage-alpha_vantage_mcp-3ed9b05/api/src/av_api/tools/options_data_apis.py` |
| Tool name | `realtime_put_call_ratio` -> `realtime_put_call_ratio` |
| Original location | `Other_Tools_and_Integrations/alphavantage-alpha_vantage_mcp_3ed9b05_python/alphavantage-alpha_vantage_mcp-3ed9b05/api/src/av_api/tools/options_data_apis.py:89` |
| Mutation location | `Backdoor Attack/alphavantage-alpha_vantage_mcp/alphavantage-alpha_vantage_mcp-3ed9b05/api/src/av_api/tools/options_data_apis.py:106--107` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `symbol` |
| Canary | `36c138143b` |

#### Original Source Context

Lines 100--112 from the reference file:

~~~python
        symbol: The name of the equity of your choice. For example: symbol=IBM

    Returns:
        Realtime put-call ratio data in JSON format.
    """

    params = {
        "symbol": symbol,
    }

    return _make_api_request("REALTIME_PUT_CALL_RATIO", params)


~~~

### MV-BD-c446f8002201 `alphavantage-alpha_vantage_mcp` / `wma`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-c446f8002201` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/alphavantage-alpha_vantage_mcp_3ed9b05_python/alphavantage-alpha_vantage_mcp-3ed9b05/api/src/av_api/tools/technical_indicators_part1.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/alphavantage-alpha_vantage_mcp/alphavantage-alpha_vantage_mcp-3ed9b05/api/src/av_api/tools/technical_indicators_part1.py` |
| Tool name | `wma` -> `wma` |
| Original location | `Other_Tools_and_Integrations/alphavantage-alpha_vantage_mcp_3ed9b05_python/alphavantage-alpha_vantage_mcp-3ed9b05/api/src/av_api/tools/technical_indicators_part1.py:92` |
| Mutation location | `Backdoor Attack/alphavantage-alpha_vantage_mcp/alphavantage-alpha_vantage_mcp-3ed9b05/api/src/av_api/tools/technical_indicators_part1.py:123--124` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `symbol` |
| Canary | `c0a285e98d` |

#### Original Source Context

Lines 117--129 from the reference file:

~~~python
                 json returns the daily time series in JSON format; csv returns the time series as a CSV file.

    Returns:
        The WMA values in JSON or CSV format.
    """

    params = {
        "symbol": symbol,
        "interval": interval,
        "time_period": str(time_period),
        "series_type": series_type,
        "datatype": datatype,
    }
~~~

### MV-BD-8091922f79eb `alphavantage-alpha_vantage_mcp` / `mom`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-8091922f79eb` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/alphavantage-alpha_vantage_mcp_3ed9b05_python/alphavantage-alpha_vantage_mcp-3ed9b05/api/src/av_api/tools/technical_indicators_part2.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/alphavantage-alpha_vantage_mcp/alphavantage-alpha_vantage_mcp-3ed9b05/api/src/av_api/tools/technical_indicators_part2.py` |
| Tool name | `mom` -> `mom` |
| Original location | `Other_Tools_and_Integrations/alphavantage-alpha_vantage_mcp_3ed9b05_python/alphavantage-alpha_vantage_mcp-3ed9b05/api/src/av_api/tools/technical_indicators_part2.py:325` |
| Mutation location | `Backdoor Attack/alphavantage-alpha_vantage_mcp/alphavantage-alpha_vantage_mcp-3ed9b05/api/src/av_api/tools/technical_indicators_part2.py:353--354` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `symbol` |
| Canary | `6359d62f75` |

#### Original Source Context

Lines 347--359 from the reference file:

~~~python
                 json returns the daily time series in JSON format; csv returns the time series as a CSV (comma separated value) file.

    Returns:
        Momentum values in the specified format (dict or str).
    """

    params = {
        "symbol": symbol,
        "interval": interval,
        "time_period": str(time_period),
        "series_type": series_type,
        "datatype": datatype,
    }
~~~

### MV-BD-ea52c73479bf `alphavantage-alpha_vantage_mcp` / `cci`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-ea52c73479bf` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/alphavantage-alpha_vantage_mcp_3ed9b05_python/alphavantage-alpha_vantage_mcp-3ed9b05/api/src/av_api/tools/technical_indicators_part2.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/alphavantage-alpha_vantage_mcp/alphavantage-alpha_vantage_mcp-3ed9b05/api/src/av_api/tools/technical_indicators_part2.py` |
| Tool name | `cci` -> `cci` |
| Original location | `Other_Tools_and_Integrations/alphavantage-alpha_vantage_mcp_3ed9b05_python/alphavantage-alpha_vantage_mcp-3ed9b05/api/src/av_api/tools/technical_indicators_part2.py:401` |
| Mutation location | `Backdoor Attack/alphavantage-alpha_vantage_mcp/alphavantage-alpha_vantage_mcp-3ed9b05/api/src/av_api/tools/technical_indicators_part2.py:429--430` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `symbol` |
| Canary | `e9532ee2d1` |

#### Original Source Context

Lines 421--433 from the reference file:

~~~python
                 json returns the daily time series in JSON format; csv returns the time series as a CSV (comma separated value) file.

    Returns:
        Commodity channel index values in the specified format (dict or str).
    """

    params = {
        "symbol": symbol,
        "interval": interval,
        "time_period": str(time_period),
        "datatype": datatype,
    }
    if month:
~~~

### MV-BD-d13e5af3415e `aparajithn_agent-deploy-dashboard-mcp` / `tool_get_deploy_status`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-d13e5af3415e` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Cloud_Platforms/aparajithn_agent-deploy-dashboard-mcp_be8e9be_python/src/main.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/aparajithn_agent-deploy-dashboard-mcp/src/main.py` |
| Tool name | `tool_get_deploy_status` -> `tool_get_deploy_status` |
| Original location | `Cloud_Platforms/aparajithn_agent-deploy-dashboard-mcp_be8e9be_python/src/main.py:54` |
| Mutation location | `Backdoor Attack/aparajithn_agent-deploy-dashboard-mcp/src/main.py:65--66` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `platform` |
| Canary | `b5b472d301` |

#### Original Source Context

Lines 59--71 from the reference file:

~~~python
        platform: Platform name (vercel|render|railway|fly)
        service_id: Service/project ID
    
    Returns:
        JSON with deployment status
    """
    result = await get_deploy_status(platform, service_id)
    return json.dumps(result)

@mcp.tool()
async def tool_tail_logs(platform: str, service_id: str, lines: int = 100) -> str:
    """
    Stream recent logs from a service.
~~~

### MV-BD-75d52ca1f6a6 `aparajithn_agent-deploy-dashboard-mcp` / `tool_tail_logs`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-75d52ca1f6a6` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Cloud_Platforms/aparajithn_agent-deploy-dashboard-mcp_be8e9be_python/src/main.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/aparajithn_agent-deploy-dashboard-mcp/src/main.py` |
| Tool name | `tool_tail_logs` -> `tool_tail_logs` |
| Original location | `Cloud_Platforms/aparajithn_agent-deploy-dashboard-mcp_be8e9be_python/src/main.py:69` |
| Mutation location | `Backdoor Attack/aparajithn_agent-deploy-dashboard-mcp/src/main.py:83--84` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `platform` |
| Canary | `a9784fb42f` |

#### Original Source Context

Lines 75--87 from the reference file:

~~~python
        service_id: Service/project ID
        lines: Number of log lines to fetch (default 100)
    
    Returns:
        JSON with recent logs
    """
    result = await tail_logs(platform, service_id, lines)
    return json.dumps(result)

@mcp.tool()
async def tool_get_env_vars(platform: str, service_id: str) -> str:
    """
    List environment variables for a service.
~~~

### MV-BD-480306a407f8 `aparajithn_agent-deploy-dashboard-mcp` / `tool_get_env_vars`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-480306a407f8` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Cloud_Platforms/aparajithn_agent-deploy-dashboard-mcp_be8e9be_python/src/main.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/aparajithn_agent-deploy-dashboard-mcp/src/main.py` |
| Tool name | `tool_get_env_vars` -> `tool_get_env_vars` |
| Original location | `Cloud_Platforms/aparajithn_agent-deploy-dashboard-mcp_be8e9be_python/src/main.py:85` |
| Mutation location | `Backdoor Attack/aparajithn_agent-deploy-dashboard-mcp/src/main.py:100--101` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `platform` |
| Canary | `8c460d683f` |

#### Original Source Context

Lines 90--102 from the reference file:

~~~python
        platform: Platform name (vercel|render|railway|fly)
        service_id: Service/project ID
    
    Returns:
        JSON with environment variables
    """
    result = await get_env_vars(platform, service_id)
    return json.dumps(result)

@mcp.tool()
async def tool_set_env_var(platform: str, service_id: str, key: str, value: str) -> str:
    """
    Update an environment variable for a service.
~~~

### MV-BD-e0b4f7777aa4 `aparajithn_agent-deploy-dashboard-mcp` / `tool_set_env_var`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-e0b4f7777aa4` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Cloud_Platforms/aparajithn_agent-deploy-dashboard-mcp_be8e9be_python/src/main.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/aparajithn_agent-deploy-dashboard-mcp/src/main.py` |
| Tool name | `tool_set_env_var` -> `tool_set_env_var` |
| Original location | `Cloud_Platforms/aparajithn_agent-deploy-dashboard-mcp_be8e9be_python/src/main.py:100` |
| Mutation location | `Backdoor Attack/aparajithn_agent-deploy-dashboard-mcp/src/main.py:119--120` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `platform` |
| Canary | `9da7ebc188` |

#### Original Source Context

Lines 107--119 from the reference file:

~~~python
        key: Environment variable name
        value: Environment variable value
    
    Returns:
        JSON with operation status
    """
    result = await set_env_var(platform, service_id, key, value)
    return json.dumps(result)

@mcp.tool()
async def tool_trigger_redeploy(platform: str, service_id: str) -> str:
    """
    Force redeploy a service.
~~~

### MV-BD-05670768c2c0 `aparajithn_agent-deploy-dashboard-mcp` / `tool_trigger_redeploy`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-05670768c2c0` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Cloud_Platforms/aparajithn_agent-deploy-dashboard-mcp_be8e9be_python/src/main.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/aparajithn_agent-deploy-dashboard-mcp/src/main.py` |
| Tool name | `tool_trigger_redeploy` -> `tool_trigger_redeploy` |
| Original location | `Cloud_Platforms/aparajithn_agent-deploy-dashboard-mcp_be8e9be_python/src/main.py:117` |
| Mutation location | `Backdoor Attack/aparajithn_agent-deploy-dashboard-mcp/src/main.py:136--137` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `platform` |
| Canary | `18424a794c` |

#### Original Source Context

Lines 122--134 from the reference file:

~~~python
        platform: Platform name (vercel|render|railway|fly)
        service_id: Service/project ID
    
    Returns:
        JSON with redeploy status
    """
    result = await trigger_redeploy(platform, service_id)
    return json.dumps(result)

@mcp.tool()
async def tool_get_build_logs(platform: str, deploy_id: str) -> str:
    """
    Fetch build logs for a specific deployment.
~~~

### MV-BD-bc5e487d7135 `aparajithn_agent-deploy-dashboard-mcp` / `tool_rollback_deploy`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-bc5e487d7135` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Cloud_Platforms/aparajithn_agent-deploy-dashboard-mcp_be8e9be_python/src/main.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/aparajithn_agent-deploy-dashboard-mcp/src/main.py` |
| Tool name | `tool_rollback_deploy` -> `tool_rollback_deploy` |
| Original location | `Cloud_Platforms/aparajithn_agent-deploy-dashboard-mcp_be8e9be_python/src/main.py:161` |
| Mutation location | `Backdoor Attack/aparajithn_agent-deploy-dashboard-mcp/src/main.py:183--184` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `platform` |
| Canary | `e3f5e532f2` |

#### Original Source Context

Lines 167--179 from the reference file:

~~~python
        service_id: Service/project ID
        version: Version/deployment ID to rollback to
    
    Returns:
        JSON with rollback status
    """
    result = await rollback_deploy(platform, service_id, version)
    return json.dumps(result)


# ---------------------------------------------------------------------------
# REST-only FastAPI app — mounted UNDER the MCP Starlette app
# ---------------------------------------------------------------------------
~~~

### MV-BD-163f6219d1a5 `azure-samples-ai-gateway` / `get_weather`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-163f6219d1a5` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/azure-samples-ai-gateway_1679e31_python/Azure-Samples-AI-Gateway-1679e31/labs/ai-foundry-hosted-agents-custom-framework/src/frameworks/strands/main.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/azure-samples-ai-gateway/Azure-Samples-AI-Gateway-1679e31/labs/ai-foundry-hosted-agents-custom-framework/src/frameworks/strands/main.py` |
| Tool name | `get_weather` -> `get_weather` |
| Original location | `Other_Tools_and_Integrations/azure-samples-ai-gateway_1679e31_python/Azure-Samples-AI-Gateway-1679e31/labs/ai-foundry-hosted-agents-custom-framework/src/frameworks/strands/main.py:89` |
| Mutation location | `Backdoor Attack/azure-samples-ai-gateway/Azure-Samples-AI-Gateway-1679e31/labs/ai-foundry-hosted-agents-custom-framework/src/frameworks/strands/main.py:96--97` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `city` |
| Canary | `fe60400e4c` |

#### Original Source Context

Lines 90--102 from the reference file:

~~~python
def get_weather(city: str) -> str:
    """Get the current weather (temperature) for the given city.

    Args:
        city: The city to look up the weather for.
    """
    temperature_c = random.randint(-5, 35)
    logger.info("tool_call=get_weather city=%s result_c=%s", city, temperature_c)
    return f"The current temperature in {city} is {temperature_c}\u00b0C."


_MODEL: OpenAIModel | None = None

~~~

### MV-BD-4eee549e9469 `azure-samples-ai-gateway` / `check_claim_status`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-4eee549e9469` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/azure-samples-ai-gateway_1679e31_python/Azure-Samples-AI-Gateway-1679e31/labs/ai-foundry-toolbox/mcp-servers/pet-insurance/function_app.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/azure-samples-ai-gateway/Azure-Samples-AI-Gateway-1679e31/labs/ai-foundry-toolbox/mcp-servers/pet-insurance/function_app.py` |
| Tool name | `check_claim_status` -> `check_claim_status` |
| Original location | `Other_Tools_and_Integrations/azure-samples-ai-gateway_1679e31_python/Azure-Samples-AI-Gateway-1679e31/labs/ai-foundry-toolbox/mcp-servers/pet-insurance/function_app.py:192` |
| Mutation location | `Backdoor Attack/azure-samples-ai-gateway/Azure-Samples-AI-Gateway-1679e31/labs/ai-foundry-toolbox/mcp-servers/pet-insurance/function_app.py:194--195` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `claim_number` |
| Canary | `3709b68330` |

#### Original Source Context

Lines 188--200 from the reference file:

~~~python
# ---------------------------------------------------------------------------

@app.mcp_tool()
@app.mcp_tool_property(arg_name="claim_number", description="The pet insurance claim number.", is_required=True)
def check_claim_status(claim_number: str) -> dict:
    """Return a simulated status for an existing claim."""
    logging.info(f"check_claim_status called for claim={claim_number}")

    status = random.choice(_CLAIM_STATUSES)
    submitted_at = _random_past_datetime(max_days_back=90)
    last_updated = submitted_at + timedelta(days=random.randint(0, 14))
    amount_claimed = round(random.uniform(75, 4500), 2)
    amount_paid = round(amount_claimed * random.uniform(0.0, 1.0), 2) if status in {"approved", "paid"} else 0.0
~~~

### MV-BD-b247a7636e0e `azure-samples-ai-gateway` / `schedule_appointment`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-b247a7636e0e` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/azure-samples-ai-gateway_1679e31_python/Azure-Samples-AI-Gateway-1679e31/labs/ai-foundry-toolbox/mcp-servers/vet-clinic/function_app.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/azure-samples-ai-gateway/Azure-Samples-AI-Gateway-1679e31/labs/ai-foundry-toolbox/mcp-servers/vet-clinic/function_app.py` |
| Tool name | `schedule_appointment` -> `schedule_appointment` |
| Original location | `Other_Tools_and_Integrations/azure-samples-ai-gateway_1679e31_python/Azure-Samples-AI-Gateway-1679e31/labs/ai-foundry-toolbox/mcp-servers/vet-clinic/function_app.py:246` |
| Mutation location | `Backdoor Attack/azure-samples-ai-gateway/Azure-Samples-AI-Gateway-1679e31/labs/ai-foundry-toolbox/mcp-servers/vet-clinic/function_app.py:255--256` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `patient_name` |
| Canary | `564c1fd761` |

#### Original Source Context

Lines 249--261 from the reference file:

~~~python
    species: str,
    reason: str,
    preferred_date: str = None,
    location: str = None,
) -> dict:
    """Book a (simulated) veterinary appointment for a patient and return a confirmation."""
    logging.info(
        f"schedule_appointment called for {patient_name} ({species}), client {client_name}, "
        f"reason={reason}, preferred_date={preferred_date}, location={location}"
    )

    resolved_location = location or random.choice(_CLINIC_LOCATIONS)

~~~

### MV-BD-e2907c10d38f `beever-ai-beever-atlas` / `search_channel_knowledge_deprecated`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-e2907c10d38f` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/knowledge-and-memory/beever-ai-beever-atlas_7d791af_python/Beever-AI-beever-atlas-7d791af/src/beever_atlas/api/mcp_server/__init__.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/beever-ai-beever-atlas/Beever-AI-beever-atlas-7d791af/src/beever_atlas/api/mcp_server/__init__.py` |
| Tool name | `search_channel_knowledge_deprecated` -> `search_channel_knowledge_deprecated` |
| Original location | `knowledge-and-memory/beever-ai-beever-atlas_7d791af_python/Beever-AI-beever-atlas-7d791af/src/beever_atlas/api/mcp_server/__init__.py:271` |
| Mutation location | `Backdoor Attack/beever-ai-beever-atlas/Beever-AI-beever-atlas-7d791af/src/beever_atlas/api/mcp_server/__init__.py:275--276` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `channel_id` |
| Canary | `c3e8769e7d` |

#### Original Source Context

Lines 269--281 from the reference file:

~~~python
        ),
    )
    async def search_channel_knowledge_deprecated(
        channel_id: str = "",
        query: str = "",
    ) -> dict:
        return {
            "error": "tool_renamed",
            "detail": (
                "search_channel_knowledge was replaced by ask_channel "
                "(streamed, cited answers) and search_channel_facts "
                "(structured fact search)."
            ),
~~~

### MV-BD-735d2ad95016 `beever-ai-beever-atlas` / `list_channels`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-735d2ad95016` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/knowledge-and-memory/beever-ai-beever-atlas_7d791af_python/Beever-AI-beever-atlas-7d791af/src/beever_atlas/api/mcp_server/_tools_discovery.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/beever-ai-beever-atlas/Beever-AI-beever-atlas-7d791af/src/beever_atlas/api/mcp_server/_tools_discovery.py` |
| Tool name | `list_channels` -> `list_channels` |
| Original location | `knowledge-and-memory/beever-ai-beever-atlas_7d791af_python/Beever-AI-beever-atlas-7d791af/src/beever_atlas/api/mcp_server/_tools_discovery.py:113` |
| Mutation location | `Backdoor Attack/beever-ai-beever-atlas/Beever-AI-beever-atlas-7d791af/src/beever_atlas/api/mcp_server/_tools_discovery.py:158--159` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `connection_id` |
| Canary | `56118c7bfd` |

#### Original Source Context

Lines 152--164 from the reference file:

~~~python

        Error modes: ``{"error": "connection_access_denied", "connection_id": ...}``
        if you do not own the connection (existence is not leaked);
        ``{"error": "invalid_parameter", "parameter": "connection_id"}`` for a
        malformed id; ``{"error": "authentication_missing"}`` if no principal.
        """
        principal_id = _get_principal_id(ctx)
        if not principal_id:
            logger.warning("event=mcp_tool_missing_principal tool=list_channels")
            return {"error": "authentication_missing"}

        err = _validate_id(connection_id, "connection_id")
        if err:
~~~

### MV-BD-328419089520 `beever-ai-beever-atlas` / `trigger_sync`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-328419089520` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/knowledge-and-memory/beever-ai-beever-atlas_7d791af_python/Beever-AI-beever-atlas-7d791af/src/beever_atlas/api/mcp_server/_tools_orchestration.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/beever-ai-beever-atlas/Beever-AI-beever-atlas-7d791af/src/beever_atlas/api/mcp_server/_tools_orchestration.py` |
| Tool name | `trigger_sync` -> `trigger_sync` |
| Original location | `knowledge-and-memory/beever-ai-beever-atlas_7d791af_python/Beever-AI-beever-atlas-7d791af/src/beever_atlas/api/mcp_server/_tools_orchestration.py:58` |
| Mutation location | `Backdoor Attack/beever-ai-beever-atlas/Beever-AI-beever-atlas-7d791af/src/beever_atlas/api/mcp_server/_tools_orchestration.py:81--82` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `channel_id` |
| Canary | `64ff966605` |

#### Original Source Context

Lines 75--87 from the reference file:

~~~python
            "STRONGLY RECOMMENDED when multiple same-platform connections exist (e.g. "
            "two Slack workspaces): without it the server matches the channel against "
            "each connection's selected_channels pick-list and may mis-route the sync "
            "if the channel was never added to a pick-list.",
        ] = None,
    ) -> dict:
        principal_id = _get_principal_id(ctx)
        if not principal_id:
            return {"error": "authentication_missing"}

        err = _validate_id(channel_id, "channel_id")
        if err:
            return err
~~~

### MV-BD-744bed8f8efe `beever-ai-beever-atlas` / `get_job_status`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-744bed8f8efe` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/knowledge-and-memory/beever-ai-beever-atlas_7d791af_python/Beever-AI-beever-atlas-7d791af/src/beever_atlas/api/mcp_server/_tools_orchestration.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/beever-ai-beever-atlas/Beever-AI-beever-atlas-7d791af/src/beever_atlas/api/mcp_server/_tools_orchestration.py` |
| Tool name | `get_job_status` -> `get_job_status` |
| Original location | `knowledge-and-memory/beever-ai-beever-atlas_7d791af_python/Beever-AI-beever-atlas-7d791af/src/beever_atlas/api/mcp_server/_tools_orchestration.py:234` |
| Mutation location | `Backdoor Attack/beever-ai-beever-atlas/Beever-AI-beever-atlas-7d791af/src/beever_atlas/api/mcp_server/_tools_orchestration.py:244--245` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `job_id` |
| Canary | `985004c5c9` |

#### Original Source Context

Lines 236--248 from the reference file:

~~~python
            str,
            "Job to inspect, e.g. 'job_abc123'. This is the job_id returned by "
            "trigger_sync or refresh_wiki. Required.",
        ],
        ctx: Context,
    ) -> dict:
        principal_id = _get_principal_id(ctx)
        if not principal_id:
            return {"error": "authentication_missing"}

        err = _validate_id(job_id, "job_id")
        if err:
            return err
~~~

### MV-BD-f48d8301892d `beever-ai-beever-atlas` / `search_media_references`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-f48d8301892d` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/knowledge-and-memory/beever-ai-beever-atlas_7d791af_python/Beever-AI-beever-atlas-7d791af/src/beever_atlas/api/mcp_server/_tools_retrieval.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/beever-ai-beever-atlas/Beever-AI-beever-atlas-7d791af/src/beever_atlas/api/mcp_server/_tools_retrieval.py` |
| Tool name | `search_media_references` -> `search_media_references` |
| Original location | `knowledge-and-memory/beever-ai-beever-atlas_7d791af_python/Beever-AI-beever-atlas-7d791af/src/beever_atlas/api/mcp_server/_tools_retrieval.py:373` |
| Mutation location | `Backdoor Attack/beever-ai-beever-atlas/Beever-AI-beever-atlas-7d791af/src/beever_atlas/api/mcp_server/_tools_retrieval.py:413--414` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `channel_id` |
| Canary | `819f23d47f` |

#### Original Source Context

Lines 407--419 from the reference file:

~~~python
        effects.

        Error modes (returned as dicts): 'authentication_missing' (no principal);
        'channel_access_denied' (token lacks access to channel_id). Other internal
        failures return an empty ``{media: []}``.
        """
        principal_id = _get_principal_id(ctx)
        if not principal_id:
            return {"error": "authentication_missing"}

        err = _validate_id(channel_id, "channel_id")
        if err:
            return err
~~~

### MV-BD-8315a8b15a4d `beever-ai-beever-atlas` / `get_extraction_status`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-8315a8b15a4d` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/knowledge-and-memory/beever-ai-beever-atlas_7d791af_python/Beever-AI-beever-atlas-7d791af/src/beever_atlas/api/mcp_server/_tools_retrieval.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/beever-ai-beever-atlas/Beever-AI-beever-atlas-7d791af/src/beever_atlas/api/mcp_server/_tools_retrieval.py` |
| Tool name | `get_extraction_status` -> `get_extraction_status` |
| Original location | `knowledge-and-memory/beever-ai-beever-atlas_7d791af_python/Beever-AI-beever-atlas-7d791af/src/beever_atlas/api/mcp_server/_tools_retrieval.py:690` |
| Mutation location | `Backdoor Attack/beever-ai-beever-atlas/Beever-AI-beever-atlas-7d791af/src/beever_atlas/api/mcp_server/_tools_retrieval.py:724--725` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `channel_id` |
| Canary | `f0c169c7b1` |

#### Original Source Context

Lines 716--728 from the reference file:

~~~python
        messages in that state and ``total`` is their sum. No side effects.

        Error modes (returned as dicts): 'authentication_missing' (no principal);
        'channel_access_denied' (token lacks access to channel_id);
        'extraction_status_failed' (internal error reading the queue).
        """
        principal_id = _get_principal_id(ctx)
        if not principal_id:
            return {"error": "authentication_missing"}

        err = _validate_id(channel_id, "channel_id")
        if err:
            return err
~~~

### MV-BD-fc10672a8bbb `beever-ai-beever-atlas` / `read_provenance`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-fc10672a8bbb` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/knowledge-and-memory/beever-ai-beever-atlas_7d791af_python/Beever-AI-beever-atlas-7d791af/src/beever_atlas/api/mcp_server/_tools_retrieval.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/beever-ai-beever-atlas/Beever-AI-beever-atlas-7d791af/src/beever_atlas/api/mcp_server/_tools_retrieval.py` |
| Tool name | `read_provenance` -> `read_provenance` |
| Original location | `knowledge-and-memory/beever-ai-beever-atlas_7d791af_python/Beever-AI-beever-atlas-7d791af/src/beever_atlas/api/mcp_server/_tools_retrieval.py:1647` |
| Mutation location | `Backdoor Attack/beever-ai-beever-atlas/Beever-AI-beever-atlas-7d791af/src/beever_atlas/api/mcp_server/_tools_retrieval.py:1681--1682` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `fact_id` |
| Canary | `67f36e32c8` |

#### Original Source Context

Lines 1671--1683 from the reference file:

~~~python

        Error modes (returned as dicts): 'authentication_missing' (no principal);
        'fact_not_found' (unknown fact_id — also returned, deliberately, when the
        caller lacks access to the fact's channel, so cross-tenant existence is
        never leaked); 'provenance_read_failed' (internal error).
        """
        principal_id = _get_principal_id(ctx)
        if not principal_id:
            return {"error": "authentication_missing"}
        err = _validate_id(fact_id, "fact_id")
        if err:
            return err

~~~

### MV-BD-9386d350c1a7 `espressif_esp-rainmaker-mcp` / `get_node_status`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-9386d350c1a7` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Cloud_Platforms/espressif_esp-rainmaker-mcp_afb272e_python/server.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/espressif_esp-rainmaker-mcp/server.py` |
| Tool name | `get_node_status` -> `get_node_status` |
| Original location | `Cloud_Platforms/espressif_esp-rainmaker-mcp_afb272e_python/server.py:183` |
| Mutation location | `Backdoor Attack/espressif_esp-rainmaker-mcp/server.py:193--194` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `node_id` |
| Canary | `72e2ddc4dc` |

#### Original Source Context

Lines 187--199 from the reference file:

~~~python
    Use this tool only when:
    - User specifically asks about "status", "online", "offline" of a particular device
    - You already have other info and need just the status

    For comprehensive device information, use get_node_details instead.
    """
    log.info(f"Fetching status for node: {node_id}")
    try:
        s = await ensure_login_session()
        n = await asyncio.to_thread(rainmaker_node.Node, node_id, s)
        status_data = await asyncio.to_thread(n.get_node_status)
        log.info(f"Successfully fetched status for node: {node_id}")
        return status_data
~~~

### MV-BD-c6707c4d2aa4 `espressif_esp-rainmaker-mcp` / `set_params`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-c6707c4d2aa4` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Cloud_Platforms/espressif_esp-rainmaker-mcp_afb272e_python/server.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/espressif_esp-rainmaker-mcp/server.py` |
| Tool name | `set_params` -> `set_params` |
| Original location | `Cloud_Platforms/espressif_esp-rainmaker-mcp_afb272e_python/server.py:242` |
| Mutation location | `Backdoor Attack/espressif_esp-rainmaker-mcp/server.py:258--259` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `node_id` |
| Canary | `3c0118829d` |

#### Original Source Context

Lines 250--262 from the reference file:

~~~python
    Example params_dict value:
    {'Thermostat': {'Power': False}}

    When multiple node IDs are provided, the same parameters will be applied to all specified nodes.
    This is useful for bulk operations like turning off multiple devices or setting common configurations.
    """
    node_ids = [nid.strip() for nid in node_id.split(',')]
    if len(node_ids) == 1:
        log.info(f"Attempting to set parameters for node: {node_ids[0]}")
    else:
        log.info(f"Attempting to set parameters for {len(node_ids)} nodes: {', '.join(node_ids)}")
    log.debug(f"Received params dictionary: {params_dict}")

~~~

### MV-BD-d7f4f261836b `espressif_esp-rainmaker-mcp` / `get_node_details`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-d7f4f261836b` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Cloud_Platforms/espressif_esp-rainmaker-mcp_afb272e_python/server.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/espressif_esp-rainmaker-mcp/server.py` |
| Tool name | `get_node_details` -> `get_node_details` |
| Original location | `Cloud_Platforms/espressif_esp-rainmaker-mcp_afb272e_python/server.py:297` |
| Mutation location | `Backdoor Attack/espressif_esp-rainmaker-mcp/server.py:340--341` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `node_id` |
| Canary | `d78cc33eb4` |

#### Original Source Context

Lines 330--342 from the reference file:

~~~python
        get_node_details(ctx, fields="node_id,name")
    - Get a single node by ID:
        get_node_details(ctx, node_id="30EDA0E0AF48", fields="node_id,name,config")
    - Get all nodes of type 'lightbulb':
        get_node_details(ctx, type_="lightbulb", fields="node_id,name,type")
    """
    import copy
    log.info(f"Fetching detailed information for node: {node_id}")
    try:
        s = await ensure_login_session()

        # Fetch node(s) - always extract node_details array
        if node_id:
~~~

### MV-BD-c65d42a4bc44 `espressif_esp-rainmaker-mcp` / `get_schedules`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-c65d42a4bc44` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Cloud_Platforms/espressif_esp-rainmaker-mcp_afb272e_python/server.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/espressif_esp-rainmaker-mcp/server.py` |
| Tool name | `get_schedules` -> `get_schedules` |
| Original location | `Cloud_Platforms/espressif_esp-rainmaker-mcp_afb272e_python/server.py:455` |
| Mutation location | `Backdoor Attack/espressif_esp-rainmaker-mcp/server.py:496--497` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `node_id` |
| Canary | `4bd19f5172` |

#### Original Source Context

Lines 484--496 from the reference file:

~~~python

    Example: {"m": 1110, "d": 31} means "6:30 PM on weekdays"

    NOTE: Schedule actions use device type names (like "Light") not display names.
    See get_node_details for the mapping between device types and their display names.
    """
    log.info(f"Fetching schedules for node: {node_id}")

    try:
        s = await ensure_login_session()

        # Get node details for the specific node
        node_details = await asyncio.to_thread(s.get_node_details_by_id, node_id)
~~~

### MV-BD-417d4c04ccac `espressif_esp-rainmaker-mcp` / `update_group`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-417d4c04ccac` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Cloud_Platforms/espressif_esp-rainmaker-mcp_afb272e_python/server.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/espressif_esp-rainmaker-mcp/server.py` |
| Tool name | `update_group` -> `update_group` |
| Original location | `Cloud_Platforms/espressif_esp-rainmaker-mcp_afb272e_python/server.py:880` |
| Mutation location | `Backdoor Attack/espressif_esp-rainmaker-mcp/server.py:903--904` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `group_id` |
| Canary | `358d8b453d` |

#### Original Source Context

Lines 889--901 from the reference file:

~~~python
    - custom_data: New custom data as JSON string (optional)
    - add_nodes: Comma-separated list of node IDs to add to the group (optional)
    - remove_nodes: Comma-separated list of node IDs to remove from the group (optional)

    At least one parameter must be provided.
    """
    log.info(f"Updating group: {group_id}")

    if not any([name, description, custom_data, add_nodes, remove_nodes]):
        return "Error: At least one of name, description, custom_data, add_nodes, or remove_nodes must be provided."

    results = []

~~~

### MV-BD-15a733686452 `lastmile-ai-mcp-agent` / `finder_agent`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-15a733686452` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/ai/lastmile-ai-mcp-agent_f62d849_python/lastmile-ai-mcp-agent-f62d849/src/mcp_agent/data/templates/basic_agent.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/lastmile-ai-mcp-agent/lastmile-ai-mcp-agent-f62d849/src/mcp_agent/data/templates/basic_agent.py` |
| Tool name | `finder_agent` -> `finder_agent` |
| Original location | `ai/lastmile-ai-mcp-agent_f62d849_python/lastmile-ai-mcp-agent-f62d849/src/mcp_agent/data/templates/basic_agent.py:39` |
| Mutation location | `Backdoor Attack/lastmile-ai-mcp-agent/lastmile-ai-mcp-agent-f62d849/src/mcp_agent/data/templates/basic_agent.py:51--52` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `app_ctx` |
| Canary | `fde4bcafbc` |

#### Original Source Context

Lines 45--57 from the reference file:

~~~python
      - runs the function as a long-running workflow tool when deployed as an MCP server
      - no-op when running this locally as a script
    - app_ctx:
      - MCPApp Context (configuration, logger, upstream session, etc.)
    """

    logger = app_ctx.app.logger
    # Logger requests are forwarded as notifications/message to the client over MCP.
    logger.info(f"finder_tool called with request: {request}")

    agent = Agent(
        name="finder",
        instruction=(
~~~

### MV-BD-d6e19612903b `lastmile-ai-mcp-agent` / `grade_story`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-d6e19612903b` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/ai/lastmile-ai-mcp-agent_f62d849_python/lastmile-ai-mcp-agent-f62d849/src/mcp_agent/data/templates/basic_agent_server.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/lastmile-ai-mcp-agent/lastmile-ai-mcp-agent-f62d849/src/mcp_agent/data/templates/basic_agent_server.py` |
| Tool name | `grade_story` -> `grade_story` |
| Original location | `ai/lastmile-ai-mcp-agent_f62d849_python/lastmile-ai-mcp-agent-f62d849/src/mcp_agent/data/templates/basic_agent_server.py:112` |
| Mutation location | `Backdoor Attack/lastmile-ai-mcp-agent/lastmile-ai-mcp-agent-f62d849/src/mcp_agent/data/templates/basic_agent_server.py:126--127` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `story` |
| Canary | `9d5db6b46d` |

#### Original Source Context

Lines 120--132 from the reference file:

~~~python
    - Grader: Compiles the feedback from the other agents into a structured report.

    Args:
        story: The student's short story to grade
        app_ctx: Optional MCPApp context for accessing app resources and logging
    """
    context = app_ctx or app.context
    logger = context.logger
    logger.info(f"grade_story: Received input: {story}")

    proofreader = Agent(
        name="proofreader",
        instruction=""""Review the short story for grammar, spelling, and punctuation errors.
~~~

### MV-BD-b5b6395e3589 `lastmile-ai-mcp-agent` / `get_workflow_status`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-b5b6395e3589` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/ai/lastmile-ai-mcp-agent_f62d849_python/lastmile-ai-mcp-agent-f62d849/src/mcp_agent/server/app_server.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/lastmile-ai-mcp-agent/lastmile-ai-mcp-agent-f62d849/src/mcp_agent/server/app_server.py` |
| Tool name | `get_workflow_status` -> `get_workflow_status` |
| Original location | `ai/lastmile-ai-mcp-agent_f62d849_python/lastmile-ai-mcp-agent-f62d849/src/mcp_agent/server/app_server.py:2049` |
| Mutation location | `Backdoor Attack/lastmile-ai-mcp-agent/lastmile-ai-mcp-agent-f62d849/src/mcp_agent/server/app_server.py:2071--2072` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `run_id` |
| Canary | `5c15ac98cc` |

#### Original Source Context

Lines 2065--2077 from the reference file:

~~~python
                If omitted, the server will infer it from the run metadata when possible.
                Received from workflows/run or workflows/runs/list.

        Returns:
            A dictionary with comprehensive information about the workflow status.
        """
        bound_ctx, token = _enter_request_context(ctx)
        try:
            try:
                sess = getattr(ctx, "session", None)
                if sess and run_id:
                    exec_id = _RUN_EXECUTION_ID_REGISTRY.get(run_id, run_id)
                    app_obj = _get_attached_app(ctx.fastmcp)
~~~

### MV-BD-238c04446269 `lastmile-ai-mcp-agent` / `resume_workflow`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-238c04446269` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/ai/lastmile-ai-mcp-agent_f62d849_python/lastmile-ai-mcp-agent-f62d849/src/mcp_agent/server/app_server.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/lastmile-ai-mcp-agent/lastmile-ai-mcp-agent-f62d849/src/mcp_agent/server/app_server.py` |
| Tool name | `resume_workflow` -> `resume_workflow` |
| Original location | `ai/lastmile-ai-mcp-agent_f62d849_python/lastmile-ai-mcp-agent-f62d849/src/mcp_agent/server/app_server.py:2100` |
| Mutation location | `Backdoor Attack/lastmile-ai-mcp-agent/lastmile-ai-mcp-agent-f62d849/src/mcp_agent/server/app_server.py:2128--2129` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `run_id` |
| Canary | `4d222dd585` |

#### Original Source Context

Lines 2120--2132 from the reference file:

~~~python
                For example, if a workflow is waiting for human input,
                this can be the human input.

        Returns:
            True if the workflow was resumed, False otherwise.
        """
        bound_ctx, token = _enter_request_context(ctx)
        try:
            try:
                sess = getattr(ctx, "session", None)
                if sess and run_id:
                    exec_id = _RUN_EXECUTION_ID_REGISTRY.get(run_id, run_id)
                    app_obj = _get_attached_app(ctx.fastmcp)
~~~

### MV-BD-de8c03053c14 `lastmile-ai-mcp-agent` / `workflow_store_credentials`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-de8c03053c14` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/ai/lastmile-ai-mcp-agent_f62d849_python/lastmile-ai-mcp-agent-f62d849/src/mcp_agent/server/app_server.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/lastmile-ai-mcp-agent/lastmile-ai-mcp-agent-f62d849/src/mcp_agent/server/app_server.py` |
| Tool name | `workflow_store_credentials` -> `workflow_store_credentials` |
| Original location | `ai/lastmile-ai-mcp-agent_f62d849_python/lastmile-ai-mcp-agent-f62d849/src/mcp_agent/server/app_server.py:2246` |
| Mutation location | `Backdoor Attack/lastmile-ai-mcp-agent/lastmile-ai-mcp-agent-f62d849/src/mcp_agent/server/app_server.py:2272--2273` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `workflow_name` |
| Canary | `780fda9f6a` |

#### Original Source Context

Lines 2262--2274 from the reference file:

~~~python
                - expires_at (float, optional): Token expiration timestamp
                - authorization_server (str, optional): Authorization server URL

        Returns:
            Dictionary with success status and count of stored tokens.
        """
        bound_ctx, token = _enter_request_context(ctx)
        try:
            workflows_dict, app_context = _resolve_workflows_and_context_safe(
                ctx, bound_ctx
            )
            if not workflows_dict or not app_context:
                raise ToolError("Server context not available for MCPApp Server.")
~~~

### MV-BD-546cec6410c9 `lastmile-ai-mcp-agent` / `run`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-546cec6410c9` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/ai/lastmile-ai-mcp-agent_f62d849_python/lastmile-ai-mcp-agent-f62d849/src/mcp_agent/server/app_server.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/lastmile-ai-mcp-agent/lastmile-ai-mcp-agent-f62d849/src/mcp_agent/server/app_server.py` |
| Tool name | `run` -> `run` |
| Original location | `ai/lastmile-ai-mcp-agent_f62d849_python/lastmile-ai-mcp-agent-f62d849/src/mcp_agent/server/app_server.py:2828` |
| Mutation location | `Backdoor Attack/lastmile-ai-mcp-agent/lastmile-ai-mcp-agent-f62d849/src/mcp_agent/server/app_server.py:2838--2839` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `run_parameters` |
| Canary | `9849102e04` |

#### Original Source Context

Lines 2826--2838 from the reference file:

~~~python
        """,
    )
    async def run(
        ctx: MCPContext,
        run_parameters: Dict[str, Any] | None = None,
    ) -> Dict[str, str]:
        bound_ctx, token = _enter_request_context(ctx)
        try:
            return await _workflow_run(
                ctx, workflow_name, run_parameters, bound_context=bound_ctx
            )
        finally:
            _exit_request_context(bound_ctx, token)
~~~

### MV-BD-6d468b51364c `mangooer-mysql-mcp-server-sse` / `mysql_show_status`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-6d468b51364c` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/databases/mangooer-mysql-mcp-server-sse_adf5c73_python/mangooer-mysql-mcp-server-sse-adf5c73/src/tools/mysql_info_tool.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/mangooer-mysql-mcp-server-sse/mangooer-mysql-mcp-server-sse-adf5c73/src/tools/mysql_info_tool.py` |
| Tool name | `mysql_show_status` -> `mysql_show_status` |
| Original location | `databases/mangooer-mysql-mcp-server-sse_adf5c73_python/mangooer-mysql-mcp-server-sse-adf5c73/src/tools/mysql_info_tool.py:284` |
| Mutation location | `Backdoor Attack/mangooer-mysql-mcp-server-sse/mangooer-mysql-mcp-server-sse-adf5c73/src/tools/mysql_info_tool.py:296--297` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `pattern` |
| Canary | `c19e5ab353` |

#### Original Source Context

Lines 290--302 from the reference file:

~~~python
            global_scope: 是否查询全局状态 (默认为会话状态)
            
        Returns:
            服务器状态的JSON字符串
        """
        # 获取当前环境类型
        from src.security.sql_analyzer import sql_analyzer
        env_type = sql_analyzer.env_type
        
        # 检查环境权限
        if not check_environment_permission(env_type, 'status'):
            raise SecurityError("当前环境不允许查询系统状态")
            
~~~

### MV-BD-2a548511c3fe `mangooer-mysql-mcp-server-sse` / `mysql_show_indexes`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-2a548511c3fe` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/databases/mangooer-mysql-mcp-server-sse_adf5c73_python/mangooer-mysql-mcp-server-sse-adf5c73/src/tools/mysql_schema_tool.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/mangooer-mysql-mcp-server-sse/mangooer-mysql-mcp-server-sse-adf5c73/src/tools/mysql_schema_tool.py` |
| Tool name | `mysql_show_indexes` -> `mysql_show_indexes` |
| Original location | `databases/mangooer-mysql-mcp-server-sse_adf5c73_python/mangooer-mysql-mcp-server-sse-adf5c73/src/tools/mysql_schema_tool.py:59` |
| Mutation location | `Backdoor Attack/mangooer-mysql-mcp-server-sse/mangooer-mysql-mcp-server-sse-adf5c73/src/tools/mysql_schema_tool.py:71--72` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `table` |
| Canary | `142b39a80a` |

#### Original Source Context

Lines 65--77 from the reference file:

~~~python
            database: 数据库名称 (可选，默认使用当前连接的数据库)
            
        Returns:
            表索引信息的JSON字符串
        """
        # 参数验证
        MetadataToolBase.validate_parameter(
            "table", table,
            SQLValidators.validate_table_name,
            "表名只能包含字母、数字和下划线"
        )
        
        if database:
~~~

### MV-BD-077c4669947f `mangooer-mysql-mcp-server-sse` / `mysql_show_table_status`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-077c4669947f` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/databases/mangooer-mysql-mcp-server-sse_adf5c73_python/mangooer-mysql-mcp-server-sse-adf5c73/src/tools/mysql_schema_tool.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/mangooer-mysql-mcp-server-sse/mangooer-mysql-mcp-server-sse-adf5c73/src/tools/mysql_schema_tool.py` |
| Tool name | `mysql_show_table_status` -> `mysql_show_table_status` |
| Original location | `databases/mangooer-mysql-mcp-server-sse_adf5c73_python/mangooer-mysql-mcp-server-sse-adf5c73/src/tools/mysql_schema_tool.py:94` |
| Mutation location | `Backdoor Attack/mangooer-mysql-mcp-server-sse/mangooer-mysql-mcp-server-sse-adf5c73/src/tools/mysql_schema_tool.py:108--109` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `database` |
| Canary | `8309d1886d` |

#### Original Source Context

Lines 100--112 from the reference file:

~~~python
            like_pattern: 表名匹配模式 (可选，例如 '%user%')
            
        Returns:
            表状态信息的JSON字符串
        """
        # 参数验证
        if database:
            MetadataToolBase.validate_parameter(
                "database", database,
                SQLValidators.validate_database_name,
                "数据库名称只能包含字母、数字和下划线"
            )
            
~~~

### MV-BD-eef8aa5578db `mangooer-mysql-mcp-server-sse` / `mysql_show_foreign_keys`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-eef8aa5578db` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/databases/mangooer-mysql-mcp-server-sse_adf5c73_python/mangooer-mysql-mcp-server-sse-adf5c73/src/tools/mysql_schema_tool.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/mangooer-mysql-mcp-server-sse/mangooer-mysql-mcp-server-sse-adf5c73/src/tools/mysql_schema_tool.py` |
| Tool name | `mysql_show_foreign_keys` -> `mysql_show_foreign_keys` |
| Original location | `databases/mangooer-mysql-mcp-server-sse_adf5c73_python/mangooer-mysql-mcp-server-sse-adf5c73/src/tools/mysql_schema_tool.py:136` |
| Mutation location | `Backdoor Attack/mangooer-mysql-mcp-server-sse/mangooer-mysql-mcp-server-sse-adf5c73/src/tools/mysql_schema_tool.py:152--153` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `table` |
| Canary | `d8cc2330d2` |

#### Original Source Context

Lines 142--154 from the reference file:

~~~python
            database: 数据库名称 (可选，默认使用当前连接的数据库)
            
        Returns:
            表外键约束信息的JSON字符串
        """
        # 参数验证
        MetadataToolBase.validate_parameter(
            "table", table,
            SQLValidators.validate_table_name,
            "表名只能包含字母、数字和下划线"
        )
        
        if database:
~~~

### MV-BD-698c13f15649 `mangooer-mysql-mcp-server-sse` / `mysql_query`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-698c13f15649` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/databases/mangooer-mysql-mcp-server-sse_adf5c73_python/mangooer-mysql-mcp-server-sse-adf5c73/src/tools/mysql_tool.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/mangooer-mysql-mcp-server-sse/mangooer-mysql-mcp-server-sse-adf5c73/src/tools/mysql_tool.py` |
| Tool name | `mysql_query` -> `mysql_query` |
| Original location | `databases/mangooer-mysql-mcp-server-sse_adf5c73_python/mangooer-mysql-mcp-server-sse-adf5c73/src/tools/mysql_tool.py:36` |
| Mutation location | `Backdoor Attack/mangooer-mysql-mcp-server-sse/mangooer-mysql-mcp-server-sse-adf5c73/src/tools/mysql_tool.py:47--48` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `query` |
| Canary | `245374aa2a` |

#### Original Source Context

Lines 41--53 from the reference file:

~~~python
            query: SQL查询语句
            params: 查询参数 (可选)
            
        Returns:
            查询结果的JSON字符串
        """
        logger.debug(f"执行MySQL查询: {query}, 参数: {params}")
        
        # 检查数据库隔离限制
        if database_checker:
            is_allowed, violations = database_checker.check_query(query)
            if not is_allowed:
                violation_details = "; ".join(violations)
~~~

### MV-BD-08d88a83cea4 `mattjoyce_mcp-persona-sessions` / `conduct_session`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-08d88a83cea4` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/ai/mattjoyce_mcp-persona-sessions_37d18d8_python/mcp-persona-sessions.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/mattjoyce_mcp-persona-sessions/mcp-persona-sessions.py` |
| Tool name | `conduct_session` -> `conduct_session` |
| Original location | `ai/mattjoyce_mcp-persona-sessions_37d18d8_python/mcp-persona-sessions.py:108` |
| Mutation location | `Backdoor Attack/mattjoyce_mcp-persona-sessions/mcp-persona-sessions.py:111--112` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `prerequisites` |
| Canary | `7ff889dad8` |

#### Original Source Context

Lines 105--117 from the reference file:

~~~python
    name="initialize_session",
    description="Initialize a structured session with a specific persona and context. This sets up the formal session environment and should be used after gathering prerequisites and persona details. The session begins after this setup."
)
async def conduct_session(prerequisites :str, persona_content :str) -> str:
    """Loads and returns the content of the specified persona file."""
    # concatenate persona, then prerequisites, then final instructions
    try:
        stats.tool_calls += 1
        # Combine persona content with prerequisites
        combined_content = (
            f"<SESSION_LEADER>\n{persona_content}\n</SESSION_LEADER>\n\n"
            f"---\n\n"
            f"<PREREQUISITES>\n{prerequisites}\n</PREREQUISITES>\n\n"
~~~

### MV-BD-2ca0789cb03e `mattjoyce_mcp-persona-sessions` / `load_persona_file`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-2ca0789cb03e` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/ai/mattjoyce_mcp-persona-sessions_37d18d8_python/mcp-persona-sessions.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/mattjoyce_mcp-persona-sessions/mcp-persona-sessions.py` |
| Tool name | `load_persona_file` -> `load_persona_file` |
| Original location | `ai/mattjoyce_mcp-persona-sessions_37d18d8_python/mcp-persona-sessions.py:136` |
| Mutation location | `Backdoor Attack/mattjoyce_mcp-persona-sessions/mcp-persona-sessions.py:140--141` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `persona_file` |
| Canary | `b7900c1c68` |

#### Original Source Context

Lines 132--144 from the reference file:

~~~python
@mcp.tool(
    name="get_persona_details",
    description="Retrieve detailed information about a specific session leader persona. Use this when you need the full background, communication style, and characteristics of a persona before conducting a session."
)
async def load_persona_file(persona_file: str) -> str:
    """Loads and returns the contents of the specified persona file.  Or uses default."""
    try:
        stats.tool_calls += 1
        return get_persona_file(persona_file)
    except Exception as e:
        stats.errors += 1
        logger.error(f"Error loading persona file: {e}")
        default_file = config.get("default_persona_file", "Role-Interviewer-mcp.md")
~~~

### MV-BD-e9c9557d1771 `mattjoyce_mcp-persona-sessions` / `start_timer`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-e9c9557d1771` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/ai/mattjoyce_mcp-persona-sessions_37d18d8_python/mcp-persona-sessions.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/mattjoyce_mcp-persona-sessions/mcp-persona-sessions.py` |
| Tool name | `start_timer` -> `start_timer` |
| Original location | `ai/mattjoyce_mcp-persona-sessions_37d18d8_python/mcp-persona-sessions.py:162` |
| Mutation location | `Backdoor Attack/mattjoyce_mcp-persona-sessions/mcp-persona-sessions.py:168--169` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `duration_minutes` |
| Canary | `848c971d90` |

#### Original Source Context

Lines 158--170 from the reference file:

~~~python
              Otherwise ask user for more information."""


@mcp.tool(name="start_timer", description="Start a session timer with optional target duration.")
async def start_timer(duration_minutes: int = 0, name: str = "default") -> str:
    """Start a timer with optional target duration."""
    try:
        stats.tool_calls += 1
        result = timer_manager.start(name=name, minutes=duration_minutes)
        logger.info(f"Timer '{name}' started with duration {duration_minutes} minutes")
        return f"🕒 {result} MUST check timer status often."
    except Exception as e:
        stats.errors += 1
~~~

### MV-BD-83ea6e9e42ba `mattjoyce_mcp-persona-sessions` / `stop_timer`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-83ea6e9e42ba` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/ai/mattjoyce_mcp-persona-sessions_37d18d8_python/mcp-persona-sessions.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/mattjoyce_mcp-persona-sessions/mcp-persona-sessions.py` |
| Tool name | `stop_timer` -> `stop_timer` |
| Original location | `ai/mattjoyce_mcp-persona-sessions_37d18d8_python/mcp-persona-sessions.py:175` |
| Mutation location | `Backdoor Attack/mattjoyce_mcp-persona-sessions/mcp-persona-sessions.py:183--184` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `name` |
| Canary | `3da161fdfe` |

#### Original Source Context

Lines 171--183 from the reference file:

~~~python
        logger.error(f"Error starting timer: {e}")
        return f"❌ Error starting timer: {str(e)}"

@mcp.tool(name="stop_timer", description="Stop the session timer.")
async def stop_timer(name: str = "default") -> str:
    """Stop a timer and return final status."""
    try:
        stats.tool_calls += 1
        result = timer_manager.stop(name=name)
        logger.info(f"Timer '{name}' stopped")
        return f"🛑 {result} Now offer feedback and evaluation."
    except Exception as e:
        stats.errors += 1
~~~

### MV-BD-a3595d4263f8 `mattjoyce_mcp-persona-sessions` / `check_timer_status`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-a3595d4263f8` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/ai/mattjoyce_mcp-persona-sessions_37d18d8_python/mcp-persona-sessions.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/mattjoyce_mcp-persona-sessions/mcp-persona-sessions.py` |
| Tool name | `check_timer_status` -> `check_timer_status` |
| Original location | `ai/mattjoyce_mcp-persona-sessions_37d18d8_python/mcp-persona-sessions.py:188` |
| Mutation location | `Backdoor Attack/mattjoyce_mcp-persona-sessions/mcp-persona-sessions.py:198--199` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `name` |
| Canary | `ed0526e579` |

#### Original Source Context

Lines 184--196 from the reference file:

~~~python
        logger.error(f"Error stopping timer: {e}")
        return f"❌ Error stopping timer: {str(e)}"

@mcp.tool(name="check_timer_status", description="Check the current status of a running timer.")
async def check_timer_status(name: str = "default") -> str:
    """Check the status of a timer including elapsed time and progress."""
    try:
        stats.tool_calls += 1
        result = timer_manager.check(name=name)
        logger.info(f"Timer status checked for '{name}'")
        return f"⏱️ {result}"
    except Exception as e:
        stats.errors += 1
~~~

### MV-BD-9aef78ed7ab6 `mattjoyce_mcp-persona-sessions` / `evaluate_session`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-9aef78ed7ab6` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/ai/mattjoyce_mcp-persona-sessions_37d18d8_python/mcp-persona-sessions.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/mattjoyce_mcp-persona-sessions/mcp-persona-sessions.py` |
| Tool name | `evaluate_session` -> `evaluate_session` |
| Original location | `ai/mattjoyce_mcp-persona-sessions_37d18d8_python/mcp-persona-sessions.py:218` |
| Mutation location | `Backdoor Attack/mattjoyce_mcp-persona-sessions/mcp-persona-sessions.py:230--231` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `transcript` |
| Canary | `b15fbc44c6` |

#### Original Source Context

Lines 214--226 from the reference file:

~~~python
@mcp.tool(
    name="get_session_feedback",
    description="Analyze a session transcript and receive detailed feedback on performance. The evaluator persona will assess response quality, communication effectiveness, and provide actionable improvement suggestions."
)
async def evaluate_session(transcript: str) -> str:
    """Combines the evaluator persona with the provided transcript and returns the content."""
    evaluator_file = config.get("evaluator_persona_file", "Role-Interview-Evaluator.md")
    persona_path = config.get("persona_path", "roles")
    persona_file_path = Path(__file__).parent / persona_path / evaluator_file
    try:
        stats.tool_calls += 1
        persona_content = persona_file_path.read_text(encoding="utf-8")
        
~~~

### MV-BD-127b19739c05 `nikolasdehor-mcp-fiscal-brasil` / `tool_consultar_status_mei`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-127b19739c05` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/nikolasdehor-mcp-fiscal-brasil_dcd89e7_python/DeHor-Labs-mcp-fiscal-brasil-dcd89e7/src/mcp_fiscal_brasil/mei/_tools.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/nikolasdehor-mcp-fiscal-brasil/DeHor-Labs-mcp-fiscal-brasil-dcd89e7/src/mcp_fiscal_brasil/mei/_tools.py` |
| Tool name | `tool_consultar_status_mei` -> `tool_consultar_status_mei` |
| Original location | `Other_Tools_and_Integrations/nikolasdehor-mcp-fiscal-brasil_dcd89e7_python/DeHor-Labs-mcp-fiscal-brasil-dcd89e7/src/mcp_fiscal_brasil/mei/_tools.py:25` |
| Mutation location | `Backdoor Attack/nikolasdehor-mcp-fiscal-brasil/DeHor-Labs-mcp-fiscal-brasil-dcd89e7/src/mcp_fiscal_brasil/mei/_tools.py:41--42` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `cnpj` |
| Canary | `f14adb6a3d` |

#### Original Source Context

Lines 35--42 from the reference file:

~~~python
                (ex: '11.222.333/0001-81', '11222333000181' ou '12ABC34501DE35').

        Returns:
            dict com 'cnpj', 'mei' (bool), 'simples_nacional' (bool),
            'data_opcao_mei' e 'data_exclusao_mei' (quando disponiveis).
        """
        result = await consultar_status_mei(cnpj)
        return result.model_dump(mode="json", exclude_none=True)
~~~

### MV-BD-b03756c7d971 `nikolasdehor-mcp-fiscal-brasil` / `tool_consultar_status_sefaz`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-b03756c7d971` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/nikolasdehor-mcp-fiscal-brasil_dcd89e7_python/DeHor-Labs-mcp-fiscal-brasil-dcd89e7/src/mcp_fiscal_brasil/server.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/nikolasdehor-mcp-fiscal-brasil/DeHor-Labs-mcp-fiscal-brasil-dcd89e7/src/mcp_fiscal_brasil/server.py` |
| Tool name | `tool_consultar_status_sefaz` -> `tool_consultar_status_sefaz` |
| Original location | `Other_Tools_and_Integrations/nikolasdehor-mcp-fiscal-brasil_dcd89e7_python/DeHor-Labs-mcp-fiscal-brasil-dcd89e7/src/mcp_fiscal_brasil/server.py:306` |
| Mutation location | `Backdoor Attack/nikolasdehor-mcp-fiscal-brasil/DeHor-Labs-mcp-fiscal-brasil-dcd89e7/src/mcp_fiscal_brasil/server.py:326--327` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `uf` |
| Canary | `15fa962f23` |

#### Original Source Context

Lines 320--332 from the reference file:

~~~python
    Returns:
        dict com o status atual do servico e a descricao correspondente.

    Raises:
        FiscalConfigurationError: certificado digital A1 nao configurado no servidor.
    """
    resultado = await consultar_status_sefaz(uf)
    return resultado.model_dump(mode="json", exclude_none=True)


@app.tool(
    name="parse_nfe_xml",
    description=(
~~~

### MV-BD-59c848bfa5cf `nikolasdehor-mcp-fiscal-brasil` / `tool_manifestar_nfe`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-59c848bfa5cf` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/nikolasdehor-mcp-fiscal-brasil_dcd89e7_python/DeHor-Labs-mcp-fiscal-brasil-dcd89e7/src/mcp_fiscal_brasil/server.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/nikolasdehor-mcp-fiscal-brasil/DeHor-Labs-mcp-fiscal-brasil-dcd89e7/src/mcp_fiscal_brasil/server.py` |
| Tool name | `tool_manifestar_nfe` -> `tool_manifestar_nfe` |
| Original location | `Other_Tools_and_Integrations/nikolasdehor-mcp-fiscal-brasil_dcd89e7_python/DeHor-Labs-mcp-fiscal-brasil-dcd89e7/src/mcp_fiscal_brasil/server.py:544` |
| Mutation location | `Backdoor Attack/nikolasdehor-mcp-fiscal-brasil/DeHor-Labs-mcp-fiscal-brasil-dcd89e7/src/mcp_fiscal_brasil/server.py:586--587` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `chave` |
| Canary | `a42dc42324` |

#### Original Source Context

Lines 578--590 from the reference file:

~~~python
        timeout: Timeout HTTP em segundos (default 30.0).

    Returns:
        dict com sucesso (bool), chave, tipo_evento, numero_protocolo,
        codigo_retorno e motivo retornados pela SEFAZ.
    """
    resultado: ManifestacaoResult = await manifestar_nfe(
        chave=chave,
        tipo_evento=tipo_evento,
        caminho_certificado=caminho_certificado,
        senha=senha,
        cnpj_cpf=cnpj_cpf,
        uf=uf,
~~~

### MV-BD-937d6223fb25 `nikolasdehor-mcp-fiscal-brasil` / `tool_listar_eventos_esocial`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-937d6223fb25` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/nikolasdehor-mcp-fiscal-brasil_dcd89e7_python/DeHor-Labs-mcp-fiscal-brasil-dcd89e7/src/mcp_fiscal_brasil/server.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/nikolasdehor-mcp-fiscal-brasil/DeHor-Labs-mcp-fiscal-brasil-dcd89e7/src/mcp_fiscal_brasil/server.py` |
| Tool name | `tool_listar_eventos_esocial` -> `tool_listar_eventos_esocial` |
| Original location | `Other_Tools_and_Integrations/nikolasdehor-mcp-fiscal-brasil_dcd89e7_python/DeHor-Labs-mcp-fiscal-brasil-dcd89e7/src/mcp_fiscal_brasil/server.py:738` |
| Mutation location | `Backdoor Attack/nikolasdehor-mcp-fiscal-brasil/DeHor-Labs-mcp-fiscal-brasil-dcd89e7/src/mcp_fiscal_brasil/server.py:755--756` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `grupo` |
| Canary | `cce0ce43f4` |

#### Original Source Context

Lines 745--757 from the reference file:

~~~python
            (ex.: "Tabelas", "Nao Periodicos", "Periodicos", "Exclusao", "Totalizadores").
            Se None, retorna todos os eventos ordenados por codigo.

    Returns:
        list de dicts com codigo, nome, grupo e descricao de cada evento.
    """
    eventos = await listar_eventos_esocial(grupo)
    return [e.model_dump() for e in eventos]


@app.tool(
    name="validar_evento_esocial",
    description=(
~~~

### MV-BD-fd4755f8f1dc `nikolasdehor-mcp-fiscal-brasil` / `tool_validate_nfe_full`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-fd4755f8f1dc` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/nikolasdehor-mcp-fiscal-brasil_dcd89e7_python/DeHor-Labs-mcp-fiscal-brasil-dcd89e7/src/mcp_fiscal_brasil/server.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/nikolasdehor-mcp-fiscal-brasil/DeHor-Labs-mcp-fiscal-brasil-dcd89e7/src/mcp_fiscal_brasil/server.py` |
| Tool name | `tool_validate_nfe_full` -> `tool_validate_nfe_full` |
| Original location | `Other_Tools_and_Integrations/nikolasdehor-mcp-fiscal-brasil_dcd89e7_python/DeHor-Labs-mcp-fiscal-brasil-dcd89e7/src/mcp_fiscal_brasil/server.py:1071` |
| Mutation location | `Backdoor Attack/nikolasdehor-mcp-fiscal-brasil/DeHor-Labs-mcp-fiscal-brasil-dcd89e7/src/mcp_fiscal_brasil/server.py:1079--1080` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `xml_path` |
| Canary | `ad2a175816` |

#### Original Source Context

Lines 1067--1079 from the reference file:

~~~python
        "Recebe caminho de arquivo XML local. Retorna relatório com chave, validade, "
        "issues e resumo."
    ),
)
async def tool_validate_nfe_full(xml_path: str) -> dict[str, Any]:
    """Validacao consolidada de NFe."""
    resultado = await validate_nfe_full(xml_path)
    return resultado.model_dump(mode="json", exclude_none=True)


@app.tool(
    name="summarize_sped",
    description=(
~~~

### MV-BD-db8085a667c4 `rishijatia_fantasy-pl-mcp` / `get_blank_gameweeks`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-db8085a667c4` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Gaming/rishijatia_fantasy-pl-mcp_3d7e765_python/src/fpl_mcp/__main__.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/rishijatia_fantasy-pl-mcp/src/fpl_mcp/__main__.py` |
| Tool name | `get_blank_gameweeks` -> `get_blank_gameweeks` |
| Original location | `Gaming/rishijatia_fantasy-pl-mcp_3d7e765_python/src/fpl_mcp/__main__.py:285` |
| Mutation location | `Backdoor Attack/rishijatia_fantasy-pl-mcp/src/fpl_mcp/__main__.py:294--295` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `num_gameweeks` |
| Canary | `404ca0b61d` |

#### Original Source Context

Lines 288--300 from the reference file:

~~~python
    Args:
        num_gameweeks: Number of upcoming gameweeks to check (default: 5)
    
    Returns:
        Information about blank gameweeks and affected teams
    """
    logger.info(f"Tool called: get_blank_gameweeks({num_gameweeks})")
    
    # Handle case when num_gameweeks is a dictionary
    if isinstance(num_gameweeks, dict):
        if 'num_gameweeks' in num_gameweeks:
            num_gameweeks = num_gameweeks['num_gameweeks']
        else:
~~~

### MV-BD-891f19e5c3ec `rishijatia_fantasy-pl-mcp` / `get_double_gameweeks`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-891f19e5c3ec` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Gaming/rishijatia_fantasy-pl-mcp_3d7e765_python/src/fpl_mcp/__main__.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/rishijatia_fantasy-pl-mcp/src/fpl_mcp/__main__.py` |
| Tool name | `get_double_gameweeks` -> `get_double_gameweeks` |
| Original location | `Gaming/rishijatia_fantasy-pl-mcp_3d7e765_python/src/fpl_mcp/__main__.py:318` |
| Mutation location | `Backdoor Attack/rishijatia_fantasy-pl-mcp/src/fpl_mcp/__main__.py:329--330` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `num_gameweeks` |
| Canary | `75f6efaeb4` |

#### Original Source Context

Lines 321--333 from the reference file:

~~~python
    Args:
        num_gameweeks: Number of upcoming gameweeks to check (default: 5)
    
    Returns:
        Information about double gameweeks and affected teams
    """
    logger.info(f"Tool called: get_double_gameweeks({num_gameweeks})")
    
    # Handle case when num_gameweeks is a dictionary
    if isinstance(num_gameweeks, dict):
        if 'num_gameweeks' in num_gameweeks:
            num_gameweeks = num_gameweeks['num_gameweeks']
        else:
~~~

### MV-BD-4f2254e1690b `rishijatia_fantasy-pl-mcp` / `analyze_fixtures`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-4f2254e1690b` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Gaming/rishijatia_fantasy-pl-mcp_3d7e765_python/src/fpl_mcp/__main__.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/rishijatia_fantasy-pl-mcp/src/fpl_mcp/__main__.py` |
| Tool name | `analyze_fixtures` -> `analyze_fixtures` |
| Original location | `Gaming/rishijatia_fantasy-pl-mcp_3d7e765_python/src/fpl_mcp/__main__.py:675` |
| Mutation location | `Backdoor Attack/rishijatia_fantasy-pl-mcp/src/fpl_mcp/__main__.py:698--699` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `entity_type` |
| Canary | `d2e8f2ce80` |

#### Original Source Context

Lines 688--700 from the reference file:

~~~python
        include_blanks: Whether to include blank gameweek info
        include_doubles: Whether to include double gameweek info
        
    Returns:
        Fixture analysis with difficulty ratings and summary
    """
    logger.info(f"Tool called: analyze_fixtures({entity_type}, {entity_name}, ...)")
    
    # Handle case when parameters are dictionaries
    if isinstance(entity_type, dict):
        if 'entity_type' in entity_type:
            entity_type = entity_type['entity_type']
        else:
~~~

### MV-BD-1795a639fd48 `rishijatia_fantasy-pl-mcp` / `compare_players`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-1795a639fd48` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Gaming/rishijatia_fantasy-pl-mcp_3d7e765_python/src/fpl_mcp/__main__.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/rishijatia_fantasy-pl-mcp/src/fpl_mcp/__main__.py` |
| Tool name | `compare_players` -> `compare_players` |
| Original location | `Gaming/rishijatia_fantasy-pl-mcp_3d7e765_python/src/fpl_mcp/__main__.py:965` |
| Mutation location | `Backdoor Attack/rishijatia_fantasy-pl-mcp/src/fpl_mcp/__main__.py:990--991` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `player_names` |
| Canary | `63be8c298d` |

#### Original Source Context

Lines 978--990 from the reference file:

~~~python
        num_gameweeks: Number of recent gameweeks to include in comparison
        include_fixture_analysis: Whether to include fixture analysis including blanks and doubles
        
    Returns:
        Detailed comparison of players across the specified metrics
    """
    logger.info(f"Tool called: compare_players({player_names}, ...)")
    
    # Handle case when parameters are dictionaries
    if isinstance(player_names, dict):
        # Try to extract player names from the dictionary
        if 'player_names' in player_names:
            player_names = player_names['player_names']
~~~

### MV-BD-42eb9bdc4095 `rishijatia_fantasy-pl-mcp` / `get_manager_info`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-42eb9bdc4095` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Gaming/rishijatia_fantasy-pl-mcp_3d7e765_python/src/fpl_mcp/fpl/tools/managers.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/rishijatia_fantasy-pl-mcp/src/fpl_mcp/fpl/tools/managers.py` |
| Tool name | `get_manager_info` -> `get_manager_info` |
| Original location | `Gaming/rishijatia_fantasy-pl-mcp_3d7e765_python/src/fpl_mcp/fpl/tools/managers.py:177` |
| Mutation location | `Backdoor Attack/rishijatia_fantasy-pl-mcp/src/fpl_mcp/fpl/tools/managers.py:188--189` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `team_id` |
| Canary | `0330ffcc78` |

#### Original Source Context

Lines 182--188 from the reference file:

~~~python
        Args:
            team_id: FPL team ID (defaults to authenticated user)

        Returns:
            Manager info with leagues and performance stats
        """
        return await _get_manager_info(team_id)
~~~

### MV-BD-e139c26cad91 `rishijatia_fantasy-pl-mcp` / `get_manager`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-e139c26cad91` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Gaming/rishijatia_fantasy-pl-mcp_3d7e765_python/src/fpl_mcp/fpl/tools/team.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/rishijatia_fantasy-pl-mcp/src/fpl_mcp/fpl/tools/team.py` |
| Tool name | `get_manager` -> `get_manager` |
| Original location | `Gaming/rishijatia_fantasy-pl-mcp_3d7e765_python/src/fpl_mcp/fpl/tools/team.py:305` |
| Mutation location | `Backdoor Attack/rishijatia_fantasy-pl-mcp/src/fpl_mcp/fpl/tools/team.py:314--315` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `team_id` |
| Canary | `e2fce3cbd7` |

#### Original Source Context

Lines 308--318 from the reference file:

~~~python
        Args:
            team_id: FPL team ID to look up
            
        Returns:
            Manager information including history, name, team details, and leagues
        """
        try:
            return await get_manager_info(team_id)
        except Exception as e:
            logger.error(f"Error in get_manager: {e}")
            return {"error": str(e)}
~~~

### MV-BD-296ecbf207b0 `sipyourdrink-ltd-bernstein` / `bernstein_scenario`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-296ecbf207b0` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/sipyourdrink-ltd-bernstein_246e841_python/sipyourdrink-ltd-bernstein-246e841/src/bernstein/mcp/routine_tools.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/sipyourdrink-ltd-bernstein/sipyourdrink-ltd-bernstein-246e841/src/bernstein/mcp/routine_tools.py` |
| Tool name | `bernstein_scenario` -> `bernstein_scenario` |
| Original location | `Other_Tools_and_Integrations/sipyourdrink-ltd-bernstein_246e841_python/sipyourdrink-ltd-bernstein-246e841/src/bernstein/mcp/routine_tools.py:295` |
| Mutation location | `Backdoor Attack/sipyourdrink-ltd-bernstein/sipyourdrink-ltd-bernstein-246e841/src/bernstein/mcp/routine_tools.py:328--329` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `action` |
| Canary | `17146a5378` |

#### Original Source Context

Lines 322--334 from the reference file:

~~~python
            handle shape ``bernstein_run`` returns (``task_id``, ``run_id``,
            ``poll_after_ms``) plus ``orchestration_id`` and the per-task
            ``tasks`` list, so the run is polled with
            ``bernstein_run_status``. ``status``: per-status counts and task
            details.
        """
        args: dict[str, Any] = {"action": action}
        if scenario_id is not None:
            args["scenario_id"] = scenario_id
        if context:
            args["context"] = context
        if pr_number is not None:
            args["pr_number"] = pr_number
~~~

### MV-BD-15c22dc900ef `sipyourdrink-ltd-bernstein` / `bernstein_status`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-15c22dc900ef` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/sipyourdrink-ltd-bernstein_246e841_python/sipyourdrink-ltd-bernstein-246e841/src/bernstein/mcp/server.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/sipyourdrink-ltd-bernstein/sipyourdrink-ltd-bernstein-246e841/src/bernstein/mcp/server.py` |
| Tool name | `bernstein_status` -> `bernstein_status` |
| Original location | `Other_Tools_and_Integrations/sipyourdrink-ltd-bernstein_246e841_python/sipyourdrink-ltd-bernstein-246e841/src/bernstein/mcp/server.py:667` |
| Mutation location | `Backdoor Attack/sipyourdrink-ltd-bernstein/sipyourdrink-ltd-bernstein-246e841/src/bernstein/mcp/server.py:691--692` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `status` |
| Canary | `34094d67fe` |

#### Original Source Context

Lines 685--697 from the reference file:

~~~python

        Returns:
            JSON with ``live``, ``counts``, ``cost``, and optionally
            ``per_role`` / ``status_filter`` / ``tasks``. A task-server
            outage still answers with ``live: true`` plus an ``error``.
        """
        args: dict[str, Any] = {"detail": detail}
        if status is not None:
            args["status"] = status
        err = _validate_or_error("bernstein_status", args)
        if err is not None:
            return _validation_error_response(err)
        return await _status_impl(server_url, status=status, detail=detail)
~~~

### MV-BD-1b0c16f9fffe `sipyourdrink-ltd-bernstein` / `bernstein_run_status`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-1b0c16f9fffe` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/sipyourdrink-ltd-bernstein_246e841_python/sipyourdrink-ltd-bernstein-246e841/src/bernstein/mcp/server.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/sipyourdrink-ltd-bernstein/sipyourdrink-ltd-bernstein-246e841/src/bernstein/mcp/server.py` |
| Tool name | `bernstein_run_status` -> `bernstein_run_status` |
| Original location | `Other_Tools_and_Integrations/sipyourdrink-ltd-bernstein_246e841_python/sipyourdrink-ltd-bernstein-246e841/src/bernstein/mcp/server.py:851` |
| Mutation location | `Backdoor Attack/sipyourdrink-ltd-bernstein/sipyourdrink-ltd-bernstein-246e841/src/bernstein/mcp/server.py:883--884` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `run_id` |
| Canary | `f0d26caf25` |

#### Original Source Context

Lines 875--887 from the reference file:

~~~python

        Returns:
            JSON of the Tasks-extension task-handle body (``taskId``,
            ``runId``, ``status``, ``journalHead``, ``chainHead``,
            ``receiptHash``, ``pollToken``, ...).
        """
        err = _validate_or_error("bernstein_run_status", {"run_id": run_id, "workdir": workdir})
        if err is not None:
            return _validation_error_response(err)
        return await _run_status_impl(run_id, workdir, ctx)


async def _task_capsule_impl(task_id: str, workdir: str = ".", verify: bool = False) -> str:
~~~

### MV-BD-57060cd568dc `sipyourdrink-ltd-bernstein` / `bernstein_claim`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-57060cd568dc` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/sipyourdrink-ltd-bernstein_246e841_python/sipyourdrink-ltd-bernstein-246e841/src/bernstein/mcp/server.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/sipyourdrink-ltd-bernstein/sipyourdrink-ltd-bernstein-246e841/src/bernstein/mcp/server.py` |
| Tool name | `bernstein_claim` -> `bernstein_claim` |
| Original location | `Other_Tools_and_Integrations/sipyourdrink-ltd-bernstein_246e841_python/sipyourdrink-ltd-bernstein-246e841/src/bernstein/mcp/server.py:1046` |
| Mutation location | `Backdoor Attack/sipyourdrink-ltd-bernstein/sipyourdrink-ltd-bernstein-246e841/src/bernstein/mcp/server.py:1085--1086` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `claimer_id` |
| Canary | `a29662597c` |

#### Original Source Context

Lines 1075--1087 from the reference file:

~~~python

        Returns:
            JSON of the signed claim receipt (``taskId``, ``granted``,
            ``backlogHead``, ``filterDigest``, ``chainHead``, ``receiptHash``,
            ``signature``, ``pollToken``, ...).
        """
        completed = completed_ids or []
        err = _validate_or_error(
            "bernstein_claim",
            {
                "claimer_id": claimer_id,
                "role": role,
                "project": project,
~~~

### MV-BD-4fe3cd00e4ff `sipyourdrink-ltd-bernstein` / `bernstein_post_artifact`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-4fe3cd00e4ff` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/sipyourdrink-ltd-bernstein_246e841_python/sipyourdrink-ltd-bernstein-246e841/src/bernstein/mcp/server.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/sipyourdrink-ltd-bernstein/sipyourdrink-ltd-bernstein-246e841/src/bernstein/mcp/server.py` |
| Tool name | `bernstein_post_artifact` -> `bernstein_post_artifact` |
| Original location | `Other_Tools_and_Integrations/sipyourdrink-ltd-bernstein_246e841_python/sipyourdrink-ltd-bernstein-246e841/src/bernstein/mcp/server.py:1233` |
| Mutation location | `Backdoor Attack/sipyourdrink-ltd-bernstein/sipyourdrink-ltd-bernstein-246e841/src/bernstein/mcp/server.py:1298--1299` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `task_id` |
| Canary | `e9bf68da11` |

#### Original Source Context

Lines 1286--1298 from the reference file:

~~~python
        # An argument left at its empty-string default means "not supplied for
        # this artifact type", so it must not reach the validator: the schema
        # constrains ``body`` / ``url`` / ``link_kind`` to the values a caller
        # that actually supplies them would send. Validate exactly the fields
        # that get posted, so the conditional shape advertised to the caller is
        # the shape the call is judged against.
        args: dict[str, Any] = {
            "task_id": task_id,
            "key": key,
            "artifact_type": artifact_type,
            "poster": poster,
        }
        if body:
~~~

### MV-BD-0fef86929c80 `sipyourdrink-ltd-bernstein` / `bernstein_cancel`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-0fef86929c80` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/sipyourdrink-ltd-bernstein_246e841_python/sipyourdrink-ltd-bernstein-246e841/src/bernstein/mcp/server.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/sipyourdrink-ltd-bernstein/sipyourdrink-ltd-bernstein-246e841/src/bernstein/mcp/server.py` |
| Tool name | `bernstein_cancel` -> `bernstein_cancel` |
| Original location | `Other_Tools_and_Integrations/sipyourdrink-ltd-bernstein_246e841_python/sipyourdrink-ltd-bernstein-246e841/src/bernstein/mcp/server.py:1342` |
| Mutation location | `Backdoor Attack/sipyourdrink-ltd-bernstein/sipyourdrink-ltd-bernstein-246e841/src/bernstein/mcp/server.py:1375--1376` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `task_id` |
| Canary | `7765976553` |

#### Original Source Context

Lines 1361--1373 from the reference file:

~~~python

        Returns:
            JSON with the cancelled root task, its status, and the count of
            cascaded descendants - or the task's current state when it was
            already terminal.
        """
        args: dict[str, Any] = {"task_id": task_id}
        if reason:
            args["reason"] = reason
        err = _validate_or_error("bernstein_cancel", args)
        if err is not None:
            return _validation_error_response(err)
        try:
~~~

### MV-BD-979785cf93ee `sipyourdrink-ltd-bernstein` / `bernstein_approve`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-979785cf93ee` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/sipyourdrink-ltd-bernstein_246e841_python/sipyourdrink-ltd-bernstein-246e841/src/bernstein/mcp/server.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/sipyourdrink-ltd-bernstein/sipyourdrink-ltd-bernstein-246e841/src/bernstein/mcp/server.py` |
| Tool name | `bernstein_approve` -> `bernstein_approve` |
| Original location | `Other_Tools_and_Integrations/sipyourdrink-ltd-bernstein_246e841_python/sipyourdrink-ltd-bernstein-246e841/src/bernstein/mcp/server.py:1471` |
| Mutation location | `Backdoor Attack/sipyourdrink-ltd-bernstein/sipyourdrink-ltd-bernstein-246e841/src/bernstein/mcp/server.py:1512--1513` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `task_id` |
| Canary | `258095751f` |

#### Original Source Context

Lines 1496--1508 from the reference file:

~~~python
            note: Approval note recorded as the result summary.

        Returns:
            JSON with the task id, its new status, and which approval was
            granted - or a structured refusal naming the current status.
        """
        err = _validate_or_error("bernstein_approve", {"task_id": task_id, "note": note})
        if err is not None:
            return _validation_error_response(err)
        try:
            async with httpx.AsyncClient(timeout=_HTTP_TIMEOUT) as client:
                read = await client.get(f"{server_url}/tasks/{task_id}", headers=_auth_headers())
                read.raise_for_status()
~~~

### MV-BD-c73526ba6401 `sipyourdrink-ltd-bernstein` / `bernstein_complete`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-c73526ba6401` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/sipyourdrink-ltd-bernstein_246e841_python/sipyourdrink-ltd-bernstein-246e841/src/bernstein/mcp/server.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/sipyourdrink-ltd-bernstein/sipyourdrink-ltd-bernstein-246e841/src/bernstein/mcp/server.py` |
| Tool name | `bernstein_complete` -> `bernstein_complete` |
| Original location | `Other_Tools_and_Integrations/sipyourdrink-ltd-bernstein_246e841_python/sipyourdrink-ltd-bernstein-246e841/src/bernstein/mcp/server.py:1533` |
| Mutation location | `Backdoor Attack/sipyourdrink-ltd-bernstein/sipyourdrink-ltd-bernstein-246e841/src/bernstein/mcp/server.py:1573--1574` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `task_id` |
| Canary | `f7822f2764` |

#### Original Source Context

Lines 1555--1567 from the reference file:

~~~python
                an empty summary and fails the task instead.

        Returns:
            JSON with the task id, its new status, and the recorded summary -
            or a structured refusal naming the current status.
        """
        err = _validate_or_error(
            "bernstein_complete",
            {"task_id": task_id, "result_summary": result_summary},
        )
        if err is not None:
            return _validation_error_response(err)
        try:
~~~

### MV-BD-9cbc8b4837df `spre-sre_lumino-mcp-server` / `list_taskruns`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-9cbc8b4837df` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Cloud_Platforms/spre-sre_lumino-mcp-server_43feeb3_python/src/server-mcp.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/spre-sre_lumino-mcp-server/src/server-mcp.py` |
| Tool name | `list_taskruns` -> `list_taskruns` |
| Original location | `Cloud_Platforms/spre-sre_lumino-mcp-server_43feeb3_python/src/server-mcp.py:877` |
| Mutation location | `Backdoor Attack/spre-sre_lumino-mcp-server/src/server-mcp.py:888--889` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `namespace` |
| Canary | `5b21f7ab6f` |

#### Original Source Context

Lines 882--894 from the reference file:

~~~python
        namespace: Kubernetes namespace to query.
        pipeline_run: Optional PipelineRun name to filter by.

    Returns:
        List[Dict]: TaskRuns with keys: name, task, pipeline_run, status, started_at, completed_at, duration.
    """
    try:
        logger.info(f"Retrieving TaskRuns from namespace: {namespace}" +
                   (f" (filtered by PipelineRun: {pipeline_run})" if pipeline_run else ""))

        label_selector = f"tekton.dev/pipelineRun={pipeline_run}" if pipeline_run else None

        # When filtering by pipeline_run, the label_selector narrows the result set
~~~

### MV-BD-f20b3ea2eb38 `spre-sre_lumino-mcp-server` / `get_tekton_pipeline_runs_status`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-f20b3ea2eb38` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Cloud_Platforms/spre-sre_lumino-mcp-server_43feeb3_python/src/server-mcp.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/spre-sre_lumino-mcp-server/src/server-mcp.py` |
| Tool name | `get_tekton_pipeline_runs_status` -> `get_tekton_pipeline_runs_status` |
| Original location | `Cloud_Platforms/spre-sre_lumino-mcp-server_43feeb3_python/src/server-mcp.py:3350` |
| Mutation location | `Backdoor Attack/spre-sre_lumino-mcp-server/src/server-mcp.py:3377--3378` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `pipeline_runs_limit` |
| Canary | `e196c45dc7` |

#### Original Source Context

Lines 3369--3381 from the reference file:

~~~python
    Returns:
        Dict[str, Any]: Keys: timestamp, sampling_info, pipeline_runs (total, by_status,
                        recent_failures [top N], failures_by_namespace, long_running [top N]),
                        task_runs (total, by_status, recent_failures [top N], failures_by_namespace),
                        insights.
    """
    try:
        logger.info("Fetching cluster-wide Tekton PipelineRuns and TaskRuns status")

        # Cap the limit to avoid massive responses that cause IncompleteRead errors.
        # Cluster-wide LIST on pipelineruns can return multi-MB responses.
        safe_pr_limit = min(pipeline_runs_limit, 200)

~~~

### MV-BD-74a73f3d2179 `spre-sre_lumino-mcp-server` / `get_machine_config_pool_status`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-74a73f3d2179` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Cloud_Platforms/spre-sre_lumino-mcp-server_43feeb3_python/src/server-mcp.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/spre-sre_lumino-mcp-server/src/server-mcp.py` |
| Tool name | `get_machine_config_pool_status` -> `get_machine_config_pool_status` |
| Original location | `Cloud_Platforms/spre-sre_lumino-mcp-server_43feeb3_python/src/server-mcp.py:9272` |
| Mutation location | `Backdoor Attack/spre-sre_lumino-mcp-server/src/server-mcp.py:9297--9298` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `pool_names` |
| Canary | `b234d32bef` |

#### Original Source Context

Lines 9287--9299 from the reference file:

~~~python
        filter_updating: Only show updating pools (default: False).

    Returns:
        Dict: Keys: pools_overview, machine_config_pools, recent_config_changes, issues,
              update_recommendations.
    """
    logger.info("Starting machine config pool status analysis")

    try:
        # Query MachineConfigPool resources using Kubernetes Custom Resource API
        logger.info("Querying MachineConfigPool resources from OpenShift Machine Config Operator")

        pools_response = k8s_custom_api.list_cluster_custom_object(
~~~

### MV-BD-121ce2e1c512 `spre-sre_lumino-mcp-server` / `get_openshift_cluster_operator_status`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-121ce2e1c512` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Cloud_Platforms/spre-sre_lumino-mcp-server_43feeb3_python/src/server-mcp.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/spre-sre_lumino-mcp-server/src/server-mcp.py` |
| Tool name | `get_openshift_cluster_operator_status` -> `get_openshift_cluster_operator_status` |
| Original location | `Cloud_Platforms/spre-sre_lumino-mcp-server_43feeb3_python/src/server-mcp.py:9729` |
| Mutation location | `Backdoor Attack/spre-sre_lumino-mcp-server/src/server-mcp.py:9757--9758` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `operator_names` |
| Canary | `c7c8946601` |

#### Original Source Context

Lines 9745--9757 from the reference file:

~~~python
        filter_degraded: Only show operators with issues (default: False).
        include_dependencies: Show operator dependencies (default: False).

    Returns:
        Dict: Keys: cluster_info, operator_status, health_summary, critical_issues, dependencies.
    """
    logger.info("Starting OpenShift cluster operator status analysis")

    try:
        # Query ClusterOperator resources from OpenShift Config API
        logger.info("Querying ClusterOperator resources from OpenShift Config API")

        operators_response = k8s_custom_api.list_cluster_custom_object(
~~~

### MV-BD-bf728923a81a `spre-sre_lumino-mcp-server` / `manage_prediction_training_data`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-bf728923a81a` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Cloud_Platforms/spre-sre_lumino-mcp-server_43feeb3_python/src/server-mcp.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/spre-sre_lumino-mcp-server/src/server-mcp.py` |
| Tool name | `manage_prediction_training_data` -> `manage_prediction_training_data` |
| Original location | `Cloud_Platforms/spre-sre_lumino-mcp-server_43feeb3_python/src/server-mcp.py:11131` |
| Mutation location | `Backdoor Attack/spre-sre_lumino-mcp-server/src/server-mcp.py:11171--11172` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `action` |
| Canary | `c476a91402` |

#### Original Source Context

Lines 11157--11169 from the reference file:

~~~python
        collect_from_namespaces: For collect - specific namespaces to collect from
        max_namespaces: For collect - maximum namespaces when auto-detecting

    Returns:
        Dict with action results: statistics, failure list, or operation status.
    """
    try:
        from helpers.ml_persistence import (
            TrainingDataStore,
            FailureEventCollector,
            ModelPersistenceManager
        )

~~~

### MV-BD-7db6694f25aa `szeider-mcp-solver` / `select_backend`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-7db6694f25aa` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/szeider-mcp-solver_24b7d6f_python/szeider-mcp-solver-24b7d6f/src/mcp_solver/agent/mcp_server.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/szeider-mcp-solver/szeider-mcp-solver-24b7d6f/src/mcp_solver/agent/mcp_server.py` |
| Tool name | `select_backend` -> `select_backend` |
| Original location | `Other_Tools_and_Integrations/szeider-mcp-solver_24b7d6f_python/szeider-mcp-solver-24b7d6f/src/mcp_solver/agent/mcp_server.py:325` |
| Mutation location | `Backdoor Attack/szeider-mcp-solver/szeider-mcp-solver-24b7d6f/src/mcp_solver/agent/mcp_server.py:326--327` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `solver` |
| Canary | `0781e47a39` |

#### Original Source Context

Lines 320--332 from the reference file:

~~~python
        raise ValueError(f"unknown submission {submission_id!r}")
    return code


@mcp.tool(description=SELECT_BACKEND_DESCRIPTION, structured_output=False)
async def select_backend(solver: str) -> str:
    global _kernel_id
    if solver not in SOLVERS:
        raise ToolError(f"unknown solver {solver!r}; expected one of {SOLVERS}")

    dev = _dev_path()
    if dev is None and _is_unpublishable(mcp_solver.__version__):
        raise ToolError(
~~~

### MV-BD-953df9828468 `szeider-mcp-solver` / `python_reset`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-953df9828468` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/szeider-mcp-solver_24b7d6f_python/szeider-mcp-solver-24b7d6f/src/mcp_solver/agent/mcp_server.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/szeider-mcp-solver/szeider-mcp-solver-24b7d6f/src/mcp_solver/agent/mcp_server.py` |
| Tool name | `python_reset` -> `python_reset` |
| Original location | `Other_Tools_and_Integrations/szeider-mcp-solver_24b7d6f_python/szeider-mcp-solver-24b7d6f/src/mcp_solver/agent/mcp_server.py:406` |
| Mutation location | `Backdoor Attack/szeider-mcp-solver/szeider-mcp-solver-24b7d6f/src/mcp_solver/agent/mcp_server.py:417--418` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `packages` |
| Canary | `006f1df678` |

#### Original Source Context

Lines 409--421 from the reference file:

~~~python
    """Create a new kernel (no kernel_id) or reset one (with kernel_id).

    Prefer select_backend, which installs the right solver packages for you.
    The kernel created or reset here becomes the target of bare python_exec
    calls.
    """
    global _kernel_id
    _episode_count("python_reset")
    args = {"packages": packages or []}
    if kernel_id:
        args["kernel_id"] = kernel_id
    async with _kernel_lock:
        text = await _engine_call("python_reset", args)
~~~

### MV-BD-a3573c431393 `szeider-mcp-solver` / `python_status`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-a3573c431393` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/szeider-mcp-solver_24b7d6f_python/szeider-mcp-solver-24b7d6f/src/mcp_solver/agent/mcp_server.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/szeider-mcp-solver/szeider-mcp-solver-24b7d6f/src/mcp_solver/agent/mcp_server.py` |
| Tool name | `python_status` -> `python_status` |
| Original location | `Other_Tools_and_Integrations/szeider-mcp-solver_24b7d6f_python/szeider-mcp-solver-24b7d6f/src/mcp_solver/agent/mcp_server.py:429` |
| Mutation location | `Backdoor Attack/szeider-mcp-solver/szeider-mcp-solver-24b7d6f/src/mcp_solver/agent/mcp_server.py:435--436` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `kernel_id` |
| Canary | `12d5e23569` |

#### Original Source Context

Lines 425--437 from the reference file:

~~~python
    return text


@mcp.tool(structured_output=False)
async def python_status(kernel_id: str | None = None) -> str:
    """Check kernel state: active kernels, defined variables, packages."""
    _episode_count("python_status")
    args: dict = {}
    if kernel_id:
        args["kernel_id"] = kernel_id
    return await _engine_call("python_status", args)


~~~

### MV-BD-95d2704f1eaa `szeider-mcp-solver` / `python_interrupt`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-95d2704f1eaa` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/szeider-mcp-solver_24b7d6f_python/szeider-mcp-solver-24b7d6f/src/mcp_solver/agent/mcp_server.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/szeider-mcp-solver/szeider-mcp-solver-24b7d6f/src/mcp_solver/agent/mcp_server.py` |
| Tool name | `python_interrupt` -> `python_interrupt` |
| Original location | `Other_Tools_and_Integrations/szeider-mcp-solver_24b7d6f_python/szeider-mcp-solver-24b7d6f/src/mcp_solver/agent/mcp_server.py:439` |
| Mutation location | `Backdoor Attack/szeider-mcp-solver/szeider-mcp-solver-24b7d6f/src/mcp_solver/agent/mcp_server.py:447--448` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `kernel_id` |
| Canary | `3095bb256a` |

#### Original Source Context

Lines 435--447 from the reference file:

~~~python
    return await _engine_call("python_status", args)


@mcp.tool(structured_output=False)
async def python_interrupt(kernel_id: str | None = None) -> str:
    """Interrupt running code in the solving kernel (state is preserved)."""
    _episode_count("python_interrupt")
    args: dict = {}
    target = kernel_id or _kernel_id
    if target:
        args["kernel_id"] = target
    return await _engine_call("python_interrupt", args)

~~~

### MV-BD-527d13dfc4e9 `szeider-mcp-solver` / `submit_code`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-527d13dfc4e9` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/szeider-mcp-solver_24b7d6f_python/szeider-mcp-solver-24b7d6f/src/mcp_solver/agent/mcp_server.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/szeider-mcp-solver/szeider-mcp-solver-24b7d6f/src/mcp_solver/agent/mcp_server.py` |
| Tool name | `submit_code` -> `submit_code` |
| Original location | `Other_Tools_and_Integrations/szeider-mcp-solver_24b7d6f_python/szeider-mcp-solver-24b7d6f/src/mcp_solver/agent/mcp_server.py:450` |
| Mutation location | `Backdoor Attack/szeider-mcp-solver/szeider-mcp-solver-24b7d6f/src/mcp_solver/agent/mcp_server.py:467--468` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `code` |
| Canary | `f0c7c8c191` |

#### Original Source Context

Lines 453--465 from the reference file:

~~~python
    Call ONCE at the end, only after executing the program via python_exec
    and passing your verification. The code is syntax-checked; on success it
    is stored and linked as a resource (the server keeps the last 50).
    """
    # Count the attempt BEFORE _episode_count syncs the .open snapshot, so a
    # failed submission (which never syncs again) is not lost on a host kill.
    if _episode is not None:
        _episode["submit_attempts"] += 1
    _episode_count("submit_code")
    result_text = await _engine_call("submit_code", {"code": code})
    verdict = _parse_engine_json(result_text)

    content: list = [TextContent(type="text", text=result_text)]
~~~

### MV-BD-3686522dc1ed `voska-hass-mcp` / `search_entities_tool`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-3686522dc1ed` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/ai/voska-hass-mcp_18d0977_python/voska-hass-mcp-18d0977/app/server.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/voska-hass-mcp/voska-hass-mcp-18d0977/app/server.py` |
| Tool name | `search_entities_tool` -> `search_entities_tool` |
| Original location | `ai/voska-hass-mcp_18d0977_python/voska-hass-mcp-18d0977/app/server.py:426` |
| Mutation location | `Backdoor Attack/voska-hass-mcp/voska-hass-mcp-18d0977/app/server.py:447--448` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `query` |
| Canary | `521a09243e` |

#### Original Source Context

Lines 441--453 from the reference file:

~~~python
    Examples:
        query="temperature" - find temperature entities
        query="living room", limit=10 - find living room entities
        query="", limit=500 - list all entity types
        
    """
    logger.info(f"Searching for entities matching: '{query}' with limit: {limit}")
    
    # Special case - treat "*" as empty query to just return entities without filtering
    if query == "*":
        query = ""
        logger.info("Converting '*' to empty query (retrieving all entities up to limit)")
    
~~~

### MV-BD-801589002d6d `voska-hass-mcp` / `call_service_tool`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-801589002d6d` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/ai/voska-hass-mcp_18d0977_python/voska-hass-mcp-18d0977/app/server.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/voska-hass-mcp/voska-hass-mcp-18d0977/app/server.py` |
| Tool name | `call_service_tool` -> `call_service_tool` |
| Original location | `ai/voska-hass-mcp_18d0977_python/voska-hass-mcp-18d0977/app/server.py:946` |
| Mutation location | `Backdoor Attack/voska-hass-mcp/voska-hass-mcp-18d0977/app/server.py:967--968` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `domain` |
| Canary | `0ed3c536b0` |

#### Original Source Context

Lines 959--971 from the reference file:

~~~python
    Examples:
        domain='light', service='turn_on', data={'entity_id': 'light.x', 'brightness': 255}
        domain='automation', service='reload'
        domain='fan', service='set_percentage', data={'entity_id': 'fan.x', 'percentage': 50}

    """
    logger.info(f"Calling Home Assistant service: {domain}.{service} with data: {data}")
    affected_entities = await call_service(domain, service, data or {})
    return {
        "success": True,
        "domain": domain,
        "service": service,
        "affected_entities": affected_entities,
~~~

### MV-BD-6c73cb07f632 `voska-hass-mcp` / `get_dashboard_config`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-6c73cb07f632` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/ai/voska-hass-mcp_18d0977_python/voska-hass-mcp-18d0977/app/server.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/voska-hass-mcp/voska-hass-mcp-18d0977/app/server.py` |
| Tool name | `get_dashboard_config` -> `get_dashboard_config` |
| Original location | `ai/voska-hass-mcp_18d0977_python/voska-hass-mcp-18d0977/app/server.py:999` |
| Mutation location | `Backdoor Attack/voska-hass-mcp/voska-hass-mcp-18d0977/app/server.py:1016--1017` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `url_path` |
| Canary | `73939de452` |

#### Original Source Context

Lines 1006--1018 from the reference file:

~~~python

    Returns:
        The dashboard config dict (a top-level `views` list of cards). If the
        dashboard has no stored config yet, returns an empty `{"views": []}`
        scaffold with a `note`.
    """
    return await lovelace.get_dashboard_config(url_path)

@mcp.tool()
@async_handler("set_dashboard_config")
async def set_dashboard_config(
    url_path: Optional[str] = None,
    config: Optional[Dict[str, Any]] = None,
~~~

### MV-BD-fe3bdacb55bd `voska-hass-mcp` / `add_card`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-fe3bdacb55bd` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/ai/voska-hass-mcp_18d0977_python/voska-hass-mcp-18d0977/app/server.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/voska-hass-mcp/voska-hass-mcp-18d0977/app/server.py` |
| Tool name | `add_card` -> `add_card` |
| Original location | `ai/voska-hass-mcp_18d0977_python/voska-hass-mcp-18d0977/app/server.py:1042` |
| Mutation location | `Backdoor Attack/voska-hass-mcp/voska-hass-mcp-18d0977/app/server.py:1075--1076` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `url_path` |
| Canary | `339ca46661` |

#### Original Source Context

Lines 1063--1075 from the reference file:

~~~python
                 views.
        dry_run: Preview without saving.

    Returns:
        Save result with a `backup_id`, or a dry-run preview.
    """
    return await lovelace.add_card(url_path, view=view, card=card, position=position, section=section, dry_run=dry_run)

@mcp.tool()
@async_handler("update_card")
async def update_card(
    url_path: Optional[str] = None,
    view: Union[int, str] = 0,
~~~

### MV-BD-88ce9d57955a `voska-hass-mcp` / `remove_view`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-88ce9d57955a` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/ai/voska-hass-mcp_18d0977_python/voska-hass-mcp-18d0977/app/server.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/voska-hass-mcp/voska-hass-mcp-18d0977/app/server.py` |
| Tool name | `remove_view` -> `remove_view` |
| Original location | `ai/voska-hass-mcp_18d0977_python/voska-hass-mcp-18d0977/app/server.py:1197` |
| Mutation location | `Backdoor Attack/voska-hass-mcp/voska-hass-mcp-18d0977/app/server.py:1223--1224` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `url_path` |
| Canary | `f0847620fc` |

#### Original Source Context

Lines 1209--1221 from the reference file:

~~~python
        view: Target view (index, or matching `path`/`title`).
        dry_run: Preview without saving.

    Returns:
        Save result with a `backup_id`, or a dry-run preview.
    """
    return await lovelace.remove_view(url_path, view=view, dry_run=dry_run)

@mcp.tool()
@async_handler("update_view")
async def update_view(
    url_path: Optional[str] = None,
    view: Union[int, str] = 0,
~~~

### MV-BD-27dab78f477b `voska-hass-mcp` / `update_view`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-27dab78f477b` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/ai/voska-hass-mcp_18d0977_python/voska-hass-mcp-18d0977/app/server.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/voska-hass-mcp/voska-hass-mcp-18d0977/app/server.py` |
| Tool name | `update_view` -> `update_view` |
| Original location | `ai/voska-hass-mcp_18d0977_python/voska-hass-mcp-18d0977/app/server.py:1219` |
| Mutation location | `Backdoor Attack/voska-hass-mcp/voska-hass-mcp-18d0977/app/server.py:1249--1250` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `url_path` |
| Canary | `2f5a5db8b1` |

#### Original Source Context

Lines 1233--1245 from the reference file:

~~~python
        changes: Dict of view properties to merge in, e.g. {"title": "New Title"}.
        dry_run: Preview without saving.

    Returns:
        Save result with a `backup_id`, or a dry-run preview.
    """
    return await lovelace.update_view(url_path, view=view, changes=changes, dry_run=dry_run)

@mcp.tool()
@async_handler("list_dashboard_backups")
async def list_dashboard_backups(url_path: Optional[str] = None) -> List[Dict[str, str]]:
    """
    List on-disk backups of a dashboard's config
~~~

### MV-BD-5ef8fd090f92 `voska-hass-mcp` / `list_dashboard_backups`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-5ef8fd090f92` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/ai/voska-hass-mcp_18d0977_python/voska-hass-mcp-18d0977/app/server.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/voska-hass-mcp/voska-hass-mcp-18d0977/app/server.py` |
| Tool name | `list_dashboard_backups` -> `list_dashboard_backups` |
| Original location | `ai/voska-hass-mcp_18d0977_python/voska-hass-mcp-18d0977/app/server.py:1243` |
| Mutation location | `Backdoor Attack/voska-hass-mcp/voska-hass-mcp-18d0977/app/server.py:1268--1269` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `url_path` |
| Canary | `00a21c1f92` |

#### Original Source Context

Lines 1250--1262 from the reference file:

~~~python
    Args:
        url_path: Dashboard URL path, or None for the default dashboard.

    Returns:
        A list of {backup_id, path}, oldest first.
    """
    return lovelace.list_dashboard_backups(url_path)

@mcp.tool()
@async_handler("restore_dashboard")
async def restore_dashboard(
    url_path: Optional[str] = None,
    backup_id: Optional[str] = None,
~~~

### MV-BD-80a9110b0196 `zhkzly_mcp_leanring` / `execute_blender_code`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-80a9110b0196` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/developer-tools/zhkzly_mcp_leanring_b173d05_python/src/blender_mcp.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/zhkzly_mcp_leanring/src/blender_mcp.py` |
| Tool name | `execute_blender_code` -> `execute_blender_code` |
| Original location | `developer-tools/zhkzly_mcp_leanring_b173d05_python/src/blender_mcp.py:273` |
| Mutation location | `Backdoor Attack/zhkzly_mcp_leanring/src/blender_mcp.py:280--281` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `code` |
| Canary | `9abad3b217` |

#### Original Source Context

Lines 274--286 from the reference file:

~~~python
    """
    Execute arbitrary Python code in Blender. Make sure to do it step-by-step by breaking it into smaller chunks.
    
    Parameters:
    - code: The Python code to execute
    """
    try:
        # Get the global connection
        blender = get_blender_connection()
        
        result = blender.send_command("execute_code", {"code": code})
        return f"Code executed successfully: {result.get('result', '')}"
    except Exception as e:
~~~

### MV-BD-77538c06113e `zhkzly_mcp_leanring` / `get_polyhaven_categories`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-77538c06113e` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/developer-tools/zhkzly_mcp_leanring_b173d05_python/src/blender_mcp.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/zhkzly_mcp_leanring/src/blender_mcp.py` |
| Tool name | `get_polyhaven_categories` -> `get_polyhaven_categories` |
| Original location | `developer-tools/zhkzly_mcp_leanring_b173d05_python/src/blender_mcp.py:291` |
| Mutation location | `Backdoor Attack/zhkzly_mcp_leanring/src/blender_mcp.py:300--301` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `asset_type` |
| Canary | `79317bb065` |

#### Original Source Context

Lines 292--304 from the reference file:

~~~python
    """
    Get a list of categories for a specific asset type on Polyhaven.
    
    Parameters:
    - asset_type: The type of asset to get categories for (hdris, textures, models, all)
    """
    try:
        blender = get_blender_connection()
        if not _polyhaven_enabled:
            return "PolyHaven integration is disabled. Select it in the sidebar in BlenderMCP, then run it again."
        result = blender.send_command("get_polyhaven_categories", {"asset_type": asset_type})
        
        if "error" in result:
~~~

### MV-BD-c8f073ae11a7 `zhkzly_mcp_leanring` / `download_polyhaven_asset`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-c8f073ae11a7` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/developer-tools/zhkzly_mcp_leanring_b173d05_python/src/blender_mcp.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/zhkzly_mcp_leanring/src/blender_mcp.py` |
| Tool name | `download_polyhaven_asset` -> `download_polyhaven_asset` |
| Original location | `developer-tools/zhkzly_mcp_leanring_b173d05_python/src/blender_mcp.py:372` |
| Mutation location | `Backdoor Attack/zhkzly_mcp_leanring/src/blender_mcp.py:394--395` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `asset_id` |
| Canary | `b6c1437efc` |

#### Original Source Context

Lines 384--396 from the reference file:

~~~python
    - asset_type: The type of asset (hdris, textures, models)
    - resolution: The resolution to download (e.g., 1k, 2k, 4k)
    - file_format: Optional file format (e.g., hdr, exr for HDRIs; jpg, png for textures; gltf, fbx for models)
    
    Returns a message indicating success or failure.
    """
    try:
        blender = get_blender_connection()
        result = blender.send_command("download_polyhaven_asset", {
            "asset_id": asset_id,
            "asset_type": asset_type,
            "resolution": resolution,
            "file_format": file_format
~~~

### MV-BD-1bdde6b2dcf7 `zhkzly_mcp_leanring` / `set_texture`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-1bdde6b2dcf7` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/developer-tools/zhkzly_mcp_leanring_b173d05_python/src/blender_mcp.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/zhkzly_mcp_leanring/src/blender_mcp.py` |
| Tool name | `set_texture` -> `set_texture` |
| Original location | `developer-tools/zhkzly_mcp_leanring_b173d05_python/src/blender_mcp.py:423` |
| Mutation location | `Backdoor Attack/zhkzly_mcp_leanring/src/blender_mcp.py:443--444` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `object_name` |
| Canary | `399205dd9f` |

#### Original Source Context

Lines 431--443 from the reference file:

~~~python
    Parameters:
    - object_name: Name of the object to apply the texture to
    - texture_id: ID of the Polyhaven texture to apply (must be downloaded first)
    
    Returns a message indicating success or failure.
    """
    try:
        # Get the global connection
        blender = get_blender_connection()
        
        result = blender.send_command("set_texture", {
            "object_name": object_name,
            "texture_id": texture_id
~~~

### MV-BD-88edebc1a656 `zhkzly_mcp_leanring` / `generate_hyper3d_model_via_images`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-88edebc1a656` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/developer-tools/zhkzly_mcp_leanring_b173d05_python/src/blender_mcp.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/zhkzly_mcp_leanring/src/blender_mcp.py` |
| Tool name | `generate_hyper3d_model_via_images` -> `generate_hyper3d_model_via_images` |
| Original location | `developer-tools/zhkzly_mcp_leanring_b173d05_python/src/blender_mcp.py:565` |
| Mutation location | `Backdoor Attack/zhkzly_mcp_leanring/src/blender_mcp.py:592--593` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `input_image_paths` |
| Canary | `e60e597e1b` |

#### Original Source Context

Lines 578--590 from the reference file:

~~~python
    - input_image_urls: The URLs of input images. Even if only one image is provided, wrap it into a list. Required if Hyper3D Rodin in FAL_AI mode.
    - bbox_condition: Optional. If given, it has to be a list of ints of length 3. Controls the ratio between [Length, Width, Height] of the model.

    Only one of {input_image_paths, input_image_urls} should be given at a time, depending on the Hyper3D Rodin's current mode.
    Returns a message indicating success or failure.
    """
    if input_image_paths is not None and input_image_urls is not None:
        return f"Error: Conflict parameters given!"
    if input_image_paths is None and input_image_urls is None:
        return f"Error: No image given!"
    if input_image_paths is not None:
        if not all(os.path.exists(i) for i in input_image_paths):
            return "Error: not all image paths are valid!"
~~~

### MV-BD-ef1552133d92 `zhkzly_mcp_leanring` / `poll_rodin_job_status`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-ef1552133d92` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/developer-tools/zhkzly_mcp_leanring_b173d05_python/src/blender_mcp.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/zhkzly_mcp_leanring/src/blender_mcp.py` |
| Tool name | `poll_rodin_job_status` -> `poll_rodin_job_status` |
| Original location | `developer-tools/zhkzly_mcp_leanring_b173d05_python/src/blender_mcp.py:621` |
| Mutation location | `Backdoor Attack/zhkzly_mcp_leanring/src/blender_mcp.py:656--657` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `subscription_key` |
| Canary | `f8bb1b945d` |

#### Original Source Context

Lines 640--652 from the reference file:

~~~python

        Returns the generation task status. The task is done if status is "COMPLETED".
        The task is in progress if status is "IN_PROGRESS".
        If status other than "COMPLETED", "IN_PROGRESS", "IN_QUEUE" showed up, the generating process might be failed.
        This is a polling API, so only proceed if the status are finally determined ("COMPLETED" or some failed state).
    """
    try:
        blender = get_blender_connection()
        kwargs = {}
        if subscription_key:
            kwargs = {
                "subscription_key": subscription_key,
            }
~~~

### MV-BD-f576ed44978c `zhkzly_mcp_leanring` / `import_generated_asset`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-BD-f576ed44978c` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/developer-tools/zhkzly_mcp_leanring_b173d05_python/src/blender_mcp.py` |
| Malicious variant tool | `malicious-variant-tools/Backdoor Attack/zhkzly_mcp_leanring/src/blender_mcp.py` |
| Tool name | `import_generated_asset` -> `import_generated_asset` |
| Original location | `developer-tools/zhkzly_mcp_leanring_b173d05_python/src/blender_mcp.py:664` |
| Mutation location | `Backdoor Attack/zhkzly_mcp_leanring/src/blender_mcp.py:693--694` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `name` |
| Canary | `4a9b359752` |

#### Original Source Context

Lines 675--687 from the reference file:

~~~python
    - task_uuid: For Hyper3D Rodin mode MAIN_SITE: The task_uuid given in the generate model step.
    - request_id: For Hyper3D Rodin mode FAL_AI: The request_id given in the generate model step.

    Only give one of {task_uuid, request_id} based on the Hyper3D Rodin Mode!
    Return if the asset has been imported successfully.
    """
    try:
        blender = get_blender_connection()
        kwargs = {
            "name": name
        }
        if task_uuid:
            kwargs["task_uuid"] = task_uuid
~~~

## Tool Index

| ID | Server | Tool | Language | Reference location | Variant location | Mutation form |
|---|---|---|---|---|---|---|
| `MV-BD-f5ee68af4806` | MatiousCorp_google-ad-manager-mcp | `update_line_item` | Python | `Marketing/MatiousCorp_google-ad-manager-mcp_05cea48_python/src/gam_mcp/server.py:300` | `Backdoor Attack/MatiousCorp_google-ad-manager-mcp/src/gam_mcp/server.py:347` | safe behavior branch insertion |
| `MV-BD-aef853d40d2e` | MatiousCorp_google-ad-manager-mcp | `upload_creative` | Python | `Marketing/MatiousCorp_google-ad-manager-mcp_05cea48_python/src/gam_mcp/server.py:463` | `Backdoor Attack/MatiousCorp_google-ad-manager-mcp/src/gam_mcp/server.py:492` | safe behavior branch insertion |
| `MV-BD-1ed76ca89be2` | MatiousCorp_google-ad-manager-mcp | `upload_and_associate_creative` | Python | `Marketing/MatiousCorp_google-ad-manager-mcp_05cea48_python/src/gam_mcp/server.py:535` | `Backdoor Attack/MatiousCorp_google-ad-manager-mcp/src/gam_mcp/server.py:560` | safe behavior branch insertion |
| `MV-BD-176dbb98b085` | MatiousCorp_google-ad-manager-mcp | `bulk_upload_creatives` | Python | `Marketing/MatiousCorp_google-ad-manager-mcp_05cea48_python/src/gam_mcp/server.py:569` | `Backdoor Attack/MatiousCorp_google-ad-manager-mcp/src/gam_mcp/server.py:597` | safe behavior branch insertion |
| `MV-BD-1ce492141d00` | MatiousCorp_google-ad-manager-mcp | `get_creative` | Python | `Marketing/MatiousCorp_google-ad-manager-mcp_05cea48_python/src/gam_mcp/server.py:604` | `Backdoor Attack/MatiousCorp_google-ad-manager-mcp/src/gam_mcp/server.py:622` | safe behavior branch insertion |
| `MV-BD-b11b82864985` | MatiousCorp_google-ad-manager-mcp | `create_advertiser` | Python | `Marketing/MatiousCorp_google-ad-manager-mcp_05cea48_python/src/gam_mcp/server.py:827` | `Backdoor Attack/MatiousCorp_google-ad-manager-mcp/src/gam_mcp/server.py:854` | safe behavior branch insertion |
| `MV-BD-96ed2591dc69` | MatiousCorp_google-ad-manager-mcp | `check_line_item_delivery_status` | Python | `Marketing/MatiousCorp_google-ad-manager-mcp_05cea48_python/src/gam_mcp/server.py:901` | `Backdoor Attack/MatiousCorp_google-ad-manager-mcp/src/gam_mcp/server.py:923` | safe behavior branch insertion |
| `MV-BD-5a397d949be9` | ahujasid_blender-mcp | `search_polyhaven_assets` | Python | `ai/ahujasid_blender-mcp_7636d13_python/src/blender_mcp/server.py:384` | `Backdoor Attack/ahujasid_blender-mcp/src/blender_mcp/server.py:398` | safe behavior branch insertion |
| `MV-BD-82fe207043f0` | ahujasid_blender-mcp | `poll_rodin_job_status` | Python | `ai/ahujasid_blender-mcp_7636d13_python/src/blender_mcp/server.py:901` | `Backdoor Attack/ahujasid_blender-mcp/src/blender_mcp/server.py:928` | safe behavior branch insertion |
| `MV-BD-af04e83e1b8f` | ahujasid_blender-mcp | `generate_hunyuan3d_model` | Python | `ai/ahujasid_blender-mcp_7636d13_python/src/blender_mcp/server.py:995` | `Backdoor Attack/ahujasid_blender-mcp/src/blender_mcp/server.py:1018` | safe behavior branch insertion |
| `MV-BD-64a449b83694` | ahujasid_blender-mcp | `poll_hunyuan_job_status` | Python | `ai/ahujasid_blender-mcp_7636d13_python/src/blender_mcp/server.py:1032` | `Backdoor Attack/ahujasid_blender-mcp/src/blender_mcp/server.py:1055` | safe behavior branch insertion |
| `MV-BD-39525046fa26` | alphavantage-alpha_vantage_mcp | `congress_trades` | Python | `Other_Tools_and_Integrations/alphavantage-alpha_vantage_mcp_3ed9b05_python/alphavantage-alpha_vantage_mcp-3ed9b05/api/src/av_api/tools/congress.py:5` | `Backdoor Attack/alphavantage-alpha_vantage_mcp/alphavantage-alpha_vantage_mcp-3ed9b05/api/src/av_api/tools/congress.py:19` | safe behavior branch insertion |
| `MV-BD-848d34c046a9` | alphavantage-alpha_vantage_mcp | `digital_currency_weekly` | Python | `Other_Tools_and_Integrations/alphavantage-alpha_vantage_mcp_3ed9b05_python/alphavantage-alpha_vantage_mcp-3ed9b05/api/src/av_api/tools/cryptocurrencies.py:91` | `Backdoor Attack/alphavantage-alpha_vantage_mcp/alphavantage-alpha_vantage_mcp-3ed9b05/api/src/av_api/tools/cryptocurrencies.py:109` | safe behavior branch insertion |
| `MV-BD-f487689802d3` | alphavantage-alpha_vantage_mcp | `listing_status` | Python | `Other_Tools_and_Integrations/alphavantage-alpha_vantage_mcp_3ed9b05_python/alphavantage-alpha_vantage_mcp-3ed9b05/api/src/av_api/tools/fundamental_data.py:229` | `Backdoor Attack/alphavantage-alpha_vantage_mcp/alphavantage-alpha_vantage_mcp-3ed9b05/api/src/av_api/tools/fundamental_data.py:250` | safe behavior branch insertion |
| `MV-BD-9ac97ab101f1` | alphavantage-alpha_vantage_mcp | `realtime_put_call_ratio` | Python | `Other_Tools_and_Integrations/alphavantage-alpha_vantage_mcp_3ed9b05_python/alphavantage-alpha_vantage_mcp-3ed9b05/api/src/av_api/tools/options_data_apis.py:89` | `Backdoor Attack/alphavantage-alpha_vantage_mcp/alphavantage-alpha_vantage_mcp-3ed9b05/api/src/av_api/tools/options_data_apis.py:106` | safe behavior branch insertion |
| `MV-BD-c446f8002201` | alphavantage-alpha_vantage_mcp | `wma` | Python | `Other_Tools_and_Integrations/alphavantage-alpha_vantage_mcp_3ed9b05_python/alphavantage-alpha_vantage_mcp-3ed9b05/api/src/av_api/tools/technical_indicators_part1.py:92` | `Backdoor Attack/alphavantage-alpha_vantage_mcp/alphavantage-alpha_vantage_mcp-3ed9b05/api/src/av_api/tools/technical_indicators_part1.py:123` | safe behavior branch insertion |
| `MV-BD-8091922f79eb` | alphavantage-alpha_vantage_mcp | `mom` | Python | `Other_Tools_and_Integrations/alphavantage-alpha_vantage_mcp_3ed9b05_python/alphavantage-alpha_vantage_mcp-3ed9b05/api/src/av_api/tools/technical_indicators_part2.py:325` | `Backdoor Attack/alphavantage-alpha_vantage_mcp/alphavantage-alpha_vantage_mcp-3ed9b05/api/src/av_api/tools/technical_indicators_part2.py:353` | safe behavior branch insertion |
| `MV-BD-ea52c73479bf` | alphavantage-alpha_vantage_mcp | `cci` | Python | `Other_Tools_and_Integrations/alphavantage-alpha_vantage_mcp_3ed9b05_python/alphavantage-alpha_vantage_mcp-3ed9b05/api/src/av_api/tools/technical_indicators_part2.py:401` | `Backdoor Attack/alphavantage-alpha_vantage_mcp/alphavantage-alpha_vantage_mcp-3ed9b05/api/src/av_api/tools/technical_indicators_part2.py:429` | safe behavior branch insertion |
| `MV-BD-d13e5af3415e` | aparajithn_agent-deploy-dashboard-mcp | `tool_get_deploy_status` | Python | `Cloud_Platforms/aparajithn_agent-deploy-dashboard-mcp_be8e9be_python/src/main.py:54` | `Backdoor Attack/aparajithn_agent-deploy-dashboard-mcp/src/main.py:65` | safe behavior branch insertion |
| `MV-BD-75d52ca1f6a6` | aparajithn_agent-deploy-dashboard-mcp | `tool_tail_logs` | Python | `Cloud_Platforms/aparajithn_agent-deploy-dashboard-mcp_be8e9be_python/src/main.py:69` | `Backdoor Attack/aparajithn_agent-deploy-dashboard-mcp/src/main.py:83` | safe behavior branch insertion |
| `MV-BD-480306a407f8` | aparajithn_agent-deploy-dashboard-mcp | `tool_get_env_vars` | Python | `Cloud_Platforms/aparajithn_agent-deploy-dashboard-mcp_be8e9be_python/src/main.py:85` | `Backdoor Attack/aparajithn_agent-deploy-dashboard-mcp/src/main.py:100` | safe behavior branch insertion |
| `MV-BD-e0b4f7777aa4` | aparajithn_agent-deploy-dashboard-mcp | `tool_set_env_var` | Python | `Cloud_Platforms/aparajithn_agent-deploy-dashboard-mcp_be8e9be_python/src/main.py:100` | `Backdoor Attack/aparajithn_agent-deploy-dashboard-mcp/src/main.py:119` | safe behavior branch insertion |
| `MV-BD-05670768c2c0` | aparajithn_agent-deploy-dashboard-mcp | `tool_trigger_redeploy` | Python | `Cloud_Platforms/aparajithn_agent-deploy-dashboard-mcp_be8e9be_python/src/main.py:117` | `Backdoor Attack/aparajithn_agent-deploy-dashboard-mcp/src/main.py:136` | safe behavior branch insertion |
| `MV-BD-bc5e487d7135` | aparajithn_agent-deploy-dashboard-mcp | `tool_rollback_deploy` | Python | `Cloud_Platforms/aparajithn_agent-deploy-dashboard-mcp_be8e9be_python/src/main.py:161` | `Backdoor Attack/aparajithn_agent-deploy-dashboard-mcp/src/main.py:183` | safe behavior branch insertion |
| `MV-BD-163f6219d1a5` | azure-samples-ai-gateway | `get_weather` | Python | `Other_Tools_and_Integrations/azure-samples-ai-gateway_1679e31_python/Azure-Samples-AI-Gateway-1679e31/labs/ai-foundry-hosted-agents-custom-framework/src/frameworks/strands/main.py:89` | `Backdoor Attack/azure-samples-ai-gateway/Azure-Samples-AI-Gateway-1679e31/labs/ai-foundry-hosted-agents-custom-framework/src/frameworks/strands/main.py:96` | safe behavior branch insertion |
| `MV-BD-4eee549e9469` | azure-samples-ai-gateway | `check_claim_status` | Python | `Other_Tools_and_Integrations/azure-samples-ai-gateway_1679e31_python/Azure-Samples-AI-Gateway-1679e31/labs/ai-foundry-toolbox/mcp-servers/pet-insurance/function_app.py:192` | `Backdoor Attack/azure-samples-ai-gateway/Azure-Samples-AI-Gateway-1679e31/labs/ai-foundry-toolbox/mcp-servers/pet-insurance/function_app.py:194` | safe behavior branch insertion |
| `MV-BD-b247a7636e0e` | azure-samples-ai-gateway | `schedule_appointment` | Python | `Other_Tools_and_Integrations/azure-samples-ai-gateway_1679e31_python/Azure-Samples-AI-Gateway-1679e31/labs/ai-foundry-toolbox/mcp-servers/vet-clinic/function_app.py:246` | `Backdoor Attack/azure-samples-ai-gateway/Azure-Samples-AI-Gateway-1679e31/labs/ai-foundry-toolbox/mcp-servers/vet-clinic/function_app.py:255` | safe behavior branch insertion |
| `MV-BD-e2907c10d38f` | beever-ai-beever-atlas | `search_channel_knowledge_deprecated` | Python | `knowledge-and-memory/beever-ai-beever-atlas_7d791af_python/Beever-AI-beever-atlas-7d791af/src/beever_atlas/api/mcp_server/__init__.py:271` | `Backdoor Attack/beever-ai-beever-atlas/Beever-AI-beever-atlas-7d791af/src/beever_atlas/api/mcp_server/__init__.py:275` | safe behavior branch insertion |
| `MV-BD-735d2ad95016` | beever-ai-beever-atlas | `list_channels` | Python | `knowledge-and-memory/beever-ai-beever-atlas_7d791af_python/Beever-AI-beever-atlas-7d791af/src/beever_atlas/api/mcp_server/_tools_discovery.py:113` | `Backdoor Attack/beever-ai-beever-atlas/Beever-AI-beever-atlas-7d791af/src/beever_atlas/api/mcp_server/_tools_discovery.py:158` | safe behavior branch insertion |
| `MV-BD-328419089520` | beever-ai-beever-atlas | `trigger_sync` | Python | `knowledge-and-memory/beever-ai-beever-atlas_7d791af_python/Beever-AI-beever-atlas-7d791af/src/beever_atlas/api/mcp_server/_tools_orchestration.py:58` | `Backdoor Attack/beever-ai-beever-atlas/Beever-AI-beever-atlas-7d791af/src/beever_atlas/api/mcp_server/_tools_orchestration.py:81` | safe behavior branch insertion |
| `MV-BD-744bed8f8efe` | beever-ai-beever-atlas | `get_job_status` | Python | `knowledge-and-memory/beever-ai-beever-atlas_7d791af_python/Beever-AI-beever-atlas-7d791af/src/beever_atlas/api/mcp_server/_tools_orchestration.py:234` | `Backdoor Attack/beever-ai-beever-atlas/Beever-AI-beever-atlas-7d791af/src/beever_atlas/api/mcp_server/_tools_orchestration.py:244` | safe behavior branch insertion |
| `MV-BD-f48d8301892d` | beever-ai-beever-atlas | `search_media_references` | Python | `knowledge-and-memory/beever-ai-beever-atlas_7d791af_python/Beever-AI-beever-atlas-7d791af/src/beever_atlas/api/mcp_server/_tools_retrieval.py:373` | `Backdoor Attack/beever-ai-beever-atlas/Beever-AI-beever-atlas-7d791af/src/beever_atlas/api/mcp_server/_tools_retrieval.py:413` | safe behavior branch insertion |
| `MV-BD-8315a8b15a4d` | beever-ai-beever-atlas | `get_extraction_status` | Python | `knowledge-and-memory/beever-ai-beever-atlas_7d791af_python/Beever-AI-beever-atlas-7d791af/src/beever_atlas/api/mcp_server/_tools_retrieval.py:690` | `Backdoor Attack/beever-ai-beever-atlas/Beever-AI-beever-atlas-7d791af/src/beever_atlas/api/mcp_server/_tools_retrieval.py:724` | safe behavior branch insertion |
| `MV-BD-fc10672a8bbb` | beever-ai-beever-atlas | `read_provenance` | Python | `knowledge-and-memory/beever-ai-beever-atlas_7d791af_python/Beever-AI-beever-atlas-7d791af/src/beever_atlas/api/mcp_server/_tools_retrieval.py:1647` | `Backdoor Attack/beever-ai-beever-atlas/Beever-AI-beever-atlas-7d791af/src/beever_atlas/api/mcp_server/_tools_retrieval.py:1681` | safe behavior branch insertion |
| `MV-BD-9386d350c1a7` | espressif_esp-rainmaker-mcp | `get_node_status` | Python | `Cloud_Platforms/espressif_esp-rainmaker-mcp_afb272e_python/server.py:183` | `Backdoor Attack/espressif_esp-rainmaker-mcp/server.py:193` | safe behavior branch insertion |
| `MV-BD-c6707c4d2aa4` | espressif_esp-rainmaker-mcp | `set_params` | Python | `Cloud_Platforms/espressif_esp-rainmaker-mcp_afb272e_python/server.py:242` | `Backdoor Attack/espressif_esp-rainmaker-mcp/server.py:258` | safe behavior branch insertion |
| `MV-BD-d7f4f261836b` | espressif_esp-rainmaker-mcp | `get_node_details` | Python | `Cloud_Platforms/espressif_esp-rainmaker-mcp_afb272e_python/server.py:297` | `Backdoor Attack/espressif_esp-rainmaker-mcp/server.py:340` | safe behavior branch insertion |
| `MV-BD-c65d42a4bc44` | espressif_esp-rainmaker-mcp | `get_schedules` | Python | `Cloud_Platforms/espressif_esp-rainmaker-mcp_afb272e_python/server.py:455` | `Backdoor Attack/espressif_esp-rainmaker-mcp/server.py:496` | safe behavior branch insertion |
| `MV-BD-417d4c04ccac` | espressif_esp-rainmaker-mcp | `update_group` | Python | `Cloud_Platforms/espressif_esp-rainmaker-mcp_afb272e_python/server.py:880` | `Backdoor Attack/espressif_esp-rainmaker-mcp/server.py:903` | safe behavior branch insertion |
| `MV-BD-15a733686452` | lastmile-ai-mcp-agent | `finder_agent` | Python | `ai/lastmile-ai-mcp-agent_f62d849_python/lastmile-ai-mcp-agent-f62d849/src/mcp_agent/data/templates/basic_agent.py:39` | `Backdoor Attack/lastmile-ai-mcp-agent/lastmile-ai-mcp-agent-f62d849/src/mcp_agent/data/templates/basic_agent.py:51` | safe behavior branch insertion |
| `MV-BD-d6e19612903b` | lastmile-ai-mcp-agent | `grade_story` | Python | `ai/lastmile-ai-mcp-agent_f62d849_python/lastmile-ai-mcp-agent-f62d849/src/mcp_agent/data/templates/basic_agent_server.py:112` | `Backdoor Attack/lastmile-ai-mcp-agent/lastmile-ai-mcp-agent-f62d849/src/mcp_agent/data/templates/basic_agent_server.py:126` | safe behavior branch insertion |
| `MV-BD-b5b6395e3589` | lastmile-ai-mcp-agent | `get_workflow_status` | Python | `ai/lastmile-ai-mcp-agent_f62d849_python/lastmile-ai-mcp-agent-f62d849/src/mcp_agent/server/app_server.py:2049` | `Backdoor Attack/lastmile-ai-mcp-agent/lastmile-ai-mcp-agent-f62d849/src/mcp_agent/server/app_server.py:2071` | safe behavior branch insertion |
| `MV-BD-238c04446269` | lastmile-ai-mcp-agent | `resume_workflow` | Python | `ai/lastmile-ai-mcp-agent_f62d849_python/lastmile-ai-mcp-agent-f62d849/src/mcp_agent/server/app_server.py:2100` | `Backdoor Attack/lastmile-ai-mcp-agent/lastmile-ai-mcp-agent-f62d849/src/mcp_agent/server/app_server.py:2128` | safe behavior branch insertion |
| `MV-BD-de8c03053c14` | lastmile-ai-mcp-agent | `workflow_store_credentials` | Python | `ai/lastmile-ai-mcp-agent_f62d849_python/lastmile-ai-mcp-agent-f62d849/src/mcp_agent/server/app_server.py:2246` | `Backdoor Attack/lastmile-ai-mcp-agent/lastmile-ai-mcp-agent-f62d849/src/mcp_agent/server/app_server.py:2272` | safe behavior branch insertion |
| `MV-BD-546cec6410c9` | lastmile-ai-mcp-agent | `run` | Python | `ai/lastmile-ai-mcp-agent_f62d849_python/lastmile-ai-mcp-agent-f62d849/src/mcp_agent/server/app_server.py:2828` | `Backdoor Attack/lastmile-ai-mcp-agent/lastmile-ai-mcp-agent-f62d849/src/mcp_agent/server/app_server.py:2838` | safe behavior branch insertion |
| `MV-BD-6d468b51364c` | mangooer-mysql-mcp-server-sse | `mysql_show_status` | Python | `databases/mangooer-mysql-mcp-server-sse_adf5c73_python/mangooer-mysql-mcp-server-sse-adf5c73/src/tools/mysql_info_tool.py:284` | `Backdoor Attack/mangooer-mysql-mcp-server-sse/mangooer-mysql-mcp-server-sse-adf5c73/src/tools/mysql_info_tool.py:296` | safe behavior branch insertion |
| `MV-BD-2a548511c3fe` | mangooer-mysql-mcp-server-sse | `mysql_show_indexes` | Python | `databases/mangooer-mysql-mcp-server-sse_adf5c73_python/mangooer-mysql-mcp-server-sse-adf5c73/src/tools/mysql_schema_tool.py:59` | `Backdoor Attack/mangooer-mysql-mcp-server-sse/mangooer-mysql-mcp-server-sse-adf5c73/src/tools/mysql_schema_tool.py:71` | safe behavior branch insertion |
| `MV-BD-077c4669947f` | mangooer-mysql-mcp-server-sse | `mysql_show_table_status` | Python | `databases/mangooer-mysql-mcp-server-sse_adf5c73_python/mangooer-mysql-mcp-server-sse-adf5c73/src/tools/mysql_schema_tool.py:94` | `Backdoor Attack/mangooer-mysql-mcp-server-sse/mangooer-mysql-mcp-server-sse-adf5c73/src/tools/mysql_schema_tool.py:108` | safe behavior branch insertion |
| `MV-BD-eef8aa5578db` | mangooer-mysql-mcp-server-sse | `mysql_show_foreign_keys` | Python | `databases/mangooer-mysql-mcp-server-sse_adf5c73_python/mangooer-mysql-mcp-server-sse-adf5c73/src/tools/mysql_schema_tool.py:136` | `Backdoor Attack/mangooer-mysql-mcp-server-sse/mangooer-mysql-mcp-server-sse-adf5c73/src/tools/mysql_schema_tool.py:152` | safe behavior branch insertion |
| `MV-BD-698c13f15649` | mangooer-mysql-mcp-server-sse | `mysql_query` | Python | `databases/mangooer-mysql-mcp-server-sse_adf5c73_python/mangooer-mysql-mcp-server-sse-adf5c73/src/tools/mysql_tool.py:36` | `Backdoor Attack/mangooer-mysql-mcp-server-sse/mangooer-mysql-mcp-server-sse-adf5c73/src/tools/mysql_tool.py:47` | safe behavior branch insertion |
| `MV-BD-08d88a83cea4` | mattjoyce_mcp-persona-sessions | `conduct_session` | Python | `ai/mattjoyce_mcp-persona-sessions_37d18d8_python/mcp-persona-sessions.py:108` | `Backdoor Attack/mattjoyce_mcp-persona-sessions/mcp-persona-sessions.py:111` | safe behavior branch insertion |
| `MV-BD-2ca0789cb03e` | mattjoyce_mcp-persona-sessions | `load_persona_file` | Python | `ai/mattjoyce_mcp-persona-sessions_37d18d8_python/mcp-persona-sessions.py:136` | `Backdoor Attack/mattjoyce_mcp-persona-sessions/mcp-persona-sessions.py:140` | safe behavior branch insertion |
| `MV-BD-e9c9557d1771` | mattjoyce_mcp-persona-sessions | `start_timer` | Python | `ai/mattjoyce_mcp-persona-sessions_37d18d8_python/mcp-persona-sessions.py:162` | `Backdoor Attack/mattjoyce_mcp-persona-sessions/mcp-persona-sessions.py:168` | safe behavior branch insertion |
| `MV-BD-83ea6e9e42ba` | mattjoyce_mcp-persona-sessions | `stop_timer` | Python | `ai/mattjoyce_mcp-persona-sessions_37d18d8_python/mcp-persona-sessions.py:175` | `Backdoor Attack/mattjoyce_mcp-persona-sessions/mcp-persona-sessions.py:183` | safe behavior branch insertion |
| `MV-BD-a3595d4263f8` | mattjoyce_mcp-persona-sessions | `check_timer_status` | Python | `ai/mattjoyce_mcp-persona-sessions_37d18d8_python/mcp-persona-sessions.py:188` | `Backdoor Attack/mattjoyce_mcp-persona-sessions/mcp-persona-sessions.py:198` | safe behavior branch insertion |
| `MV-BD-9aef78ed7ab6` | mattjoyce_mcp-persona-sessions | `evaluate_session` | Python | `ai/mattjoyce_mcp-persona-sessions_37d18d8_python/mcp-persona-sessions.py:218` | `Backdoor Attack/mattjoyce_mcp-persona-sessions/mcp-persona-sessions.py:230` | safe behavior branch insertion |
| `MV-BD-127b19739c05` | nikolasdehor-mcp-fiscal-brasil | `tool_consultar_status_mei` | Python | `Other_Tools_and_Integrations/nikolasdehor-mcp-fiscal-brasil_dcd89e7_python/DeHor-Labs-mcp-fiscal-brasil-dcd89e7/src/mcp_fiscal_brasil/mei/_tools.py:25` | `Backdoor Attack/nikolasdehor-mcp-fiscal-brasil/DeHor-Labs-mcp-fiscal-brasil-dcd89e7/src/mcp_fiscal_brasil/mei/_tools.py:41` | safe behavior branch insertion |
| `MV-BD-b03756c7d971` | nikolasdehor-mcp-fiscal-brasil | `tool_consultar_status_sefaz` | Python | `Other_Tools_and_Integrations/nikolasdehor-mcp-fiscal-brasil_dcd89e7_python/DeHor-Labs-mcp-fiscal-brasil-dcd89e7/src/mcp_fiscal_brasil/server.py:306` | `Backdoor Attack/nikolasdehor-mcp-fiscal-brasil/DeHor-Labs-mcp-fiscal-brasil-dcd89e7/src/mcp_fiscal_brasil/server.py:326` | safe behavior branch insertion |
| `MV-BD-59c848bfa5cf` | nikolasdehor-mcp-fiscal-brasil | `tool_manifestar_nfe` | Python | `Other_Tools_and_Integrations/nikolasdehor-mcp-fiscal-brasil_dcd89e7_python/DeHor-Labs-mcp-fiscal-brasil-dcd89e7/src/mcp_fiscal_brasil/server.py:544` | `Backdoor Attack/nikolasdehor-mcp-fiscal-brasil/DeHor-Labs-mcp-fiscal-brasil-dcd89e7/src/mcp_fiscal_brasil/server.py:586` | safe behavior branch insertion |
| `MV-BD-937d6223fb25` | nikolasdehor-mcp-fiscal-brasil | `tool_listar_eventos_esocial` | Python | `Other_Tools_and_Integrations/nikolasdehor-mcp-fiscal-brasil_dcd89e7_python/DeHor-Labs-mcp-fiscal-brasil-dcd89e7/src/mcp_fiscal_brasil/server.py:738` | `Backdoor Attack/nikolasdehor-mcp-fiscal-brasil/DeHor-Labs-mcp-fiscal-brasil-dcd89e7/src/mcp_fiscal_brasil/server.py:755` | safe behavior branch insertion |
| `MV-BD-fd4755f8f1dc` | nikolasdehor-mcp-fiscal-brasil | `tool_validate_nfe_full` | Python | `Other_Tools_and_Integrations/nikolasdehor-mcp-fiscal-brasil_dcd89e7_python/DeHor-Labs-mcp-fiscal-brasil-dcd89e7/src/mcp_fiscal_brasil/server.py:1071` | `Backdoor Attack/nikolasdehor-mcp-fiscal-brasil/DeHor-Labs-mcp-fiscal-brasil-dcd89e7/src/mcp_fiscal_brasil/server.py:1079` | safe behavior branch insertion |
| `MV-BD-db8085a667c4` | rishijatia_fantasy-pl-mcp | `get_blank_gameweeks` | Python | `Gaming/rishijatia_fantasy-pl-mcp_3d7e765_python/src/fpl_mcp/__main__.py:285` | `Backdoor Attack/rishijatia_fantasy-pl-mcp/src/fpl_mcp/__main__.py:294` | safe behavior branch insertion |
| `MV-BD-891f19e5c3ec` | rishijatia_fantasy-pl-mcp | `get_double_gameweeks` | Python | `Gaming/rishijatia_fantasy-pl-mcp_3d7e765_python/src/fpl_mcp/__main__.py:318` | `Backdoor Attack/rishijatia_fantasy-pl-mcp/src/fpl_mcp/__main__.py:329` | safe behavior branch insertion |
| `MV-BD-4f2254e1690b` | rishijatia_fantasy-pl-mcp | `analyze_fixtures` | Python | `Gaming/rishijatia_fantasy-pl-mcp_3d7e765_python/src/fpl_mcp/__main__.py:675` | `Backdoor Attack/rishijatia_fantasy-pl-mcp/src/fpl_mcp/__main__.py:698` | safe behavior branch insertion |
| `MV-BD-1795a639fd48` | rishijatia_fantasy-pl-mcp | `compare_players` | Python | `Gaming/rishijatia_fantasy-pl-mcp_3d7e765_python/src/fpl_mcp/__main__.py:965` | `Backdoor Attack/rishijatia_fantasy-pl-mcp/src/fpl_mcp/__main__.py:990` | safe behavior branch insertion |
| `MV-BD-42eb9bdc4095` | rishijatia_fantasy-pl-mcp | `get_manager_info` | Python | `Gaming/rishijatia_fantasy-pl-mcp_3d7e765_python/src/fpl_mcp/fpl/tools/managers.py:177` | `Backdoor Attack/rishijatia_fantasy-pl-mcp/src/fpl_mcp/fpl/tools/managers.py:188` | safe behavior branch insertion |
| `MV-BD-e139c26cad91` | rishijatia_fantasy-pl-mcp | `get_manager` | Python | `Gaming/rishijatia_fantasy-pl-mcp_3d7e765_python/src/fpl_mcp/fpl/tools/team.py:305` | `Backdoor Attack/rishijatia_fantasy-pl-mcp/src/fpl_mcp/fpl/tools/team.py:314` | safe behavior branch insertion |
| `MV-BD-296ecbf207b0` | sipyourdrink-ltd-bernstein | `bernstein_scenario` | Python | `Other_Tools_and_Integrations/sipyourdrink-ltd-bernstein_246e841_python/sipyourdrink-ltd-bernstein-246e841/src/bernstein/mcp/routine_tools.py:295` | `Backdoor Attack/sipyourdrink-ltd-bernstein/sipyourdrink-ltd-bernstein-246e841/src/bernstein/mcp/routine_tools.py:328` | safe behavior branch insertion |
| `MV-BD-15c22dc900ef` | sipyourdrink-ltd-bernstein | `bernstein_status` | Python | `Other_Tools_and_Integrations/sipyourdrink-ltd-bernstein_246e841_python/sipyourdrink-ltd-bernstein-246e841/src/bernstein/mcp/server.py:667` | `Backdoor Attack/sipyourdrink-ltd-bernstein/sipyourdrink-ltd-bernstein-246e841/src/bernstein/mcp/server.py:691` | safe behavior branch insertion |
| `MV-BD-1b0c16f9fffe` | sipyourdrink-ltd-bernstein | `bernstein_run_status` | Python | `Other_Tools_and_Integrations/sipyourdrink-ltd-bernstein_246e841_python/sipyourdrink-ltd-bernstein-246e841/src/bernstein/mcp/server.py:851` | `Backdoor Attack/sipyourdrink-ltd-bernstein/sipyourdrink-ltd-bernstein-246e841/src/bernstein/mcp/server.py:883` | safe behavior branch insertion |
| `MV-BD-57060cd568dc` | sipyourdrink-ltd-bernstein | `bernstein_claim` | Python | `Other_Tools_and_Integrations/sipyourdrink-ltd-bernstein_246e841_python/sipyourdrink-ltd-bernstein-246e841/src/bernstein/mcp/server.py:1046` | `Backdoor Attack/sipyourdrink-ltd-bernstein/sipyourdrink-ltd-bernstein-246e841/src/bernstein/mcp/server.py:1085` | safe behavior branch insertion |
| `MV-BD-4fe3cd00e4ff` | sipyourdrink-ltd-bernstein | `bernstein_post_artifact` | Python | `Other_Tools_and_Integrations/sipyourdrink-ltd-bernstein_246e841_python/sipyourdrink-ltd-bernstein-246e841/src/bernstein/mcp/server.py:1233` | `Backdoor Attack/sipyourdrink-ltd-bernstein/sipyourdrink-ltd-bernstein-246e841/src/bernstein/mcp/server.py:1298` | safe behavior branch insertion |
| `MV-BD-0fef86929c80` | sipyourdrink-ltd-bernstein | `bernstein_cancel` | Python | `Other_Tools_and_Integrations/sipyourdrink-ltd-bernstein_246e841_python/sipyourdrink-ltd-bernstein-246e841/src/bernstein/mcp/server.py:1342` | `Backdoor Attack/sipyourdrink-ltd-bernstein/sipyourdrink-ltd-bernstein-246e841/src/bernstein/mcp/server.py:1375` | safe behavior branch insertion |
| `MV-BD-979785cf93ee` | sipyourdrink-ltd-bernstein | `bernstein_approve` | Python | `Other_Tools_and_Integrations/sipyourdrink-ltd-bernstein_246e841_python/sipyourdrink-ltd-bernstein-246e841/src/bernstein/mcp/server.py:1471` | `Backdoor Attack/sipyourdrink-ltd-bernstein/sipyourdrink-ltd-bernstein-246e841/src/bernstein/mcp/server.py:1512` | safe behavior branch insertion |
| `MV-BD-c73526ba6401` | sipyourdrink-ltd-bernstein | `bernstein_complete` | Python | `Other_Tools_and_Integrations/sipyourdrink-ltd-bernstein_246e841_python/sipyourdrink-ltd-bernstein-246e841/src/bernstein/mcp/server.py:1533` | `Backdoor Attack/sipyourdrink-ltd-bernstein/sipyourdrink-ltd-bernstein-246e841/src/bernstein/mcp/server.py:1573` | safe behavior branch insertion |
| `MV-BD-9cbc8b4837df` | spre-sre_lumino-mcp-server | `list_taskruns` | Python | `Cloud_Platforms/spre-sre_lumino-mcp-server_43feeb3_python/src/server-mcp.py:877` | `Backdoor Attack/spre-sre_lumino-mcp-server/src/server-mcp.py:888` | safe behavior branch insertion |
| `MV-BD-f20b3ea2eb38` | spre-sre_lumino-mcp-server | `get_tekton_pipeline_runs_status` | Python | `Cloud_Platforms/spre-sre_lumino-mcp-server_43feeb3_python/src/server-mcp.py:3350` | `Backdoor Attack/spre-sre_lumino-mcp-server/src/server-mcp.py:3377` | safe behavior branch insertion |
| `MV-BD-74a73f3d2179` | spre-sre_lumino-mcp-server | `get_machine_config_pool_status` | Python | `Cloud_Platforms/spre-sre_lumino-mcp-server_43feeb3_python/src/server-mcp.py:9272` | `Backdoor Attack/spre-sre_lumino-mcp-server/src/server-mcp.py:9297` | safe behavior branch insertion |
| `MV-BD-121ce2e1c512` | spre-sre_lumino-mcp-server | `get_openshift_cluster_operator_status` | Python | `Cloud_Platforms/spre-sre_lumino-mcp-server_43feeb3_python/src/server-mcp.py:9729` | `Backdoor Attack/spre-sre_lumino-mcp-server/src/server-mcp.py:9757` | safe behavior branch insertion |
| `MV-BD-bf728923a81a` | spre-sre_lumino-mcp-server | `manage_prediction_training_data` | Python | `Cloud_Platforms/spre-sre_lumino-mcp-server_43feeb3_python/src/server-mcp.py:11131` | `Backdoor Attack/spre-sre_lumino-mcp-server/src/server-mcp.py:11171` | safe behavior branch insertion |
| `MV-BD-7db6694f25aa` | szeider-mcp-solver | `select_backend` | Python | `Other_Tools_and_Integrations/szeider-mcp-solver_24b7d6f_python/szeider-mcp-solver-24b7d6f/src/mcp_solver/agent/mcp_server.py:325` | `Backdoor Attack/szeider-mcp-solver/szeider-mcp-solver-24b7d6f/src/mcp_solver/agent/mcp_server.py:326` | safe behavior branch insertion |
| `MV-BD-953df9828468` | szeider-mcp-solver | `python_reset` | Python | `Other_Tools_and_Integrations/szeider-mcp-solver_24b7d6f_python/szeider-mcp-solver-24b7d6f/src/mcp_solver/agent/mcp_server.py:406` | `Backdoor Attack/szeider-mcp-solver/szeider-mcp-solver-24b7d6f/src/mcp_solver/agent/mcp_server.py:417` | safe behavior branch insertion |
| `MV-BD-a3573c431393` | szeider-mcp-solver | `python_status` | Python | `Other_Tools_and_Integrations/szeider-mcp-solver_24b7d6f_python/szeider-mcp-solver-24b7d6f/src/mcp_solver/agent/mcp_server.py:429` | `Backdoor Attack/szeider-mcp-solver/szeider-mcp-solver-24b7d6f/src/mcp_solver/agent/mcp_server.py:435` | safe behavior branch insertion |
| `MV-BD-95d2704f1eaa` | szeider-mcp-solver | `python_interrupt` | Python | `Other_Tools_and_Integrations/szeider-mcp-solver_24b7d6f_python/szeider-mcp-solver-24b7d6f/src/mcp_solver/agent/mcp_server.py:439` | `Backdoor Attack/szeider-mcp-solver/szeider-mcp-solver-24b7d6f/src/mcp_solver/agent/mcp_server.py:447` | safe behavior branch insertion |
| `MV-BD-527d13dfc4e9` | szeider-mcp-solver | `submit_code` | Python | `Other_Tools_and_Integrations/szeider-mcp-solver_24b7d6f_python/szeider-mcp-solver-24b7d6f/src/mcp_solver/agent/mcp_server.py:450` | `Backdoor Attack/szeider-mcp-solver/szeider-mcp-solver-24b7d6f/src/mcp_solver/agent/mcp_server.py:467` | safe behavior branch insertion |
| `MV-BD-3686522dc1ed` | voska-hass-mcp | `search_entities_tool` | Python | `ai/voska-hass-mcp_18d0977_python/voska-hass-mcp-18d0977/app/server.py:426` | `Backdoor Attack/voska-hass-mcp/voska-hass-mcp-18d0977/app/server.py:447` | safe behavior branch insertion |
| `MV-BD-801589002d6d` | voska-hass-mcp | `call_service_tool` | Python | `ai/voska-hass-mcp_18d0977_python/voska-hass-mcp-18d0977/app/server.py:946` | `Backdoor Attack/voska-hass-mcp/voska-hass-mcp-18d0977/app/server.py:967` | safe behavior branch insertion |
| `MV-BD-6c73cb07f632` | voska-hass-mcp | `get_dashboard_config` | Python | `ai/voska-hass-mcp_18d0977_python/voska-hass-mcp-18d0977/app/server.py:999` | `Backdoor Attack/voska-hass-mcp/voska-hass-mcp-18d0977/app/server.py:1016` | safe behavior branch insertion |
| `MV-BD-fe3bdacb55bd` | voska-hass-mcp | `add_card` | Python | `ai/voska-hass-mcp_18d0977_python/voska-hass-mcp-18d0977/app/server.py:1042` | `Backdoor Attack/voska-hass-mcp/voska-hass-mcp-18d0977/app/server.py:1075` | safe behavior branch insertion |
| `MV-BD-88ce9d57955a` | voska-hass-mcp | `remove_view` | Python | `ai/voska-hass-mcp_18d0977_python/voska-hass-mcp-18d0977/app/server.py:1197` | `Backdoor Attack/voska-hass-mcp/voska-hass-mcp-18d0977/app/server.py:1223` | safe behavior branch insertion |
| `MV-BD-27dab78f477b` | voska-hass-mcp | `update_view` | Python | `ai/voska-hass-mcp_18d0977_python/voska-hass-mcp-18d0977/app/server.py:1219` | `Backdoor Attack/voska-hass-mcp/voska-hass-mcp-18d0977/app/server.py:1249` | safe behavior branch insertion |
| `MV-BD-5ef8fd090f92` | voska-hass-mcp | `list_dashboard_backups` | Python | `ai/voska-hass-mcp_18d0977_python/voska-hass-mcp-18d0977/app/server.py:1243` | `Backdoor Attack/voska-hass-mcp/voska-hass-mcp-18d0977/app/server.py:1268` | safe behavior branch insertion |
| `MV-BD-80a9110b0196` | zhkzly_mcp_leanring | `execute_blender_code` | Python | `developer-tools/zhkzly_mcp_leanring_b173d05_python/src/blender_mcp.py:273` | `Backdoor Attack/zhkzly_mcp_leanring/src/blender_mcp.py:280` | safe behavior branch insertion |
| `MV-BD-77538c06113e` | zhkzly_mcp_leanring | `get_polyhaven_categories` | Python | `developer-tools/zhkzly_mcp_leanring_b173d05_python/src/blender_mcp.py:291` | `Backdoor Attack/zhkzly_mcp_leanring/src/blender_mcp.py:300` | safe behavior branch insertion |
| `MV-BD-c8f073ae11a7` | zhkzly_mcp_leanring | `download_polyhaven_asset` | Python | `developer-tools/zhkzly_mcp_leanring_b173d05_python/src/blender_mcp.py:372` | `Backdoor Attack/zhkzly_mcp_leanring/src/blender_mcp.py:394` | safe behavior branch insertion |
| `MV-BD-1bdde6b2dcf7` | zhkzly_mcp_leanring | `set_texture` | Python | `developer-tools/zhkzly_mcp_leanring_b173d05_python/src/blender_mcp.py:423` | `Backdoor Attack/zhkzly_mcp_leanring/src/blender_mcp.py:443` | safe behavior branch insertion |
| `MV-BD-88edebc1a656` | zhkzly_mcp_leanring | `generate_hyper3d_model_via_images` | Python | `developer-tools/zhkzly_mcp_leanring_b173d05_python/src/blender_mcp.py:565` | `Backdoor Attack/zhkzly_mcp_leanring/src/blender_mcp.py:592` | safe behavior branch insertion |
| `MV-BD-ef1552133d92` | zhkzly_mcp_leanring | `poll_rodin_job_status` | Python | `developer-tools/zhkzly_mcp_leanring_b173d05_python/src/blender_mcp.py:621` | `Backdoor Attack/zhkzly_mcp_leanring/src/blender_mcp.py:656` | safe behavior branch insertion |
| `MV-BD-f576ed44978c` | zhkzly_mcp_leanring | `import_generated_asset` | Python | `developer-tools/zhkzly_mcp_leanring_b173d05_python/src/blender_mcp.py:664` | `Backdoor Attack/zhkzly_mcp_leanring/src/blender_mcp.py:693` | safe behavior branch insertion |
