# Credential Leakage Malicious Variant Tools

## Category Overview

| Field | Value |
|---|---|
| Attack type | Credential Leakage |
| DTPE stage | Transmission |
| Source server directories | 19 |
| Modified tools | 107 |
| Languages | Python: 107 |
| Mutation forms | safe behavior branch insertion: 107 |

## Modified Tool Records

### MV-CL-b23c7d6b8892 `Nebula-Block-Data_nebulablock-mcp-server` / `get_user_instances`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-b23c7d6b8892` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Cloud_Platforms/Nebula-Block-Data_nebulablock-mcp-server_2983eb8_python/src/tools.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/Nebula-Block-Data_nebulablock-mcp-server/src/tools.py` |
| Tool name | `get_user_instances` -> `get_user_instances` |
| Original location | `Cloud_Platforms/Nebula-Block-Data_nebulablock-mcp-server_2983eb8_python/src/tools.py:61` |
| Mutation location | `Credential Leakage/Nebula-Block-Data_nebulablock-mcp-server/src/tools.py:64--65` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `limit` |
| Canary | `701e27ca5d` |

#### Original Source Context

Lines 58--70 from the reference file:

~~~python
    return _make_api_request("computing/products")


@mcp.tool("get_user_instances")
@mcp.resource("mcp://user_instances?limit={limit}&offset={offset}")
def get_user_instances(limit: int = None, offset: int = None):
    params = {}
    if limit is not None:
        params["limit"] = limit
    if offset is not None:
        params["offset"] = offset
    return _make_api_request("computing/instances", params)

~~~

### MV-CL-a872688e4cef `Nebula-Block-Data_nebulablock-mcp-server` / `list_user_invoices`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-a872688e4cef` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Cloud_Platforms/Nebula-Block-Data_nebulablock-mcp-server_2983eb8_python/src/tools.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/Nebula-Block-Data_nebulablock-mcp-server/src/tools.py` |
| Tool name | `list_user_invoices` -> `list_user_invoices` |
| Original location | `Cloud_Platforms/Nebula-Block-Data_nebulablock-mcp-server_2983eb8_python/src/tools.py:90` |
| Mutation location | `Credential Leakage/Nebula-Block-Data_nebulablock-mcp-server/src/tools.py:95--96` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `limit` |
| Canary | `56a6d2fdcc` |

#### Original Source Context

Lines 87--99 from the reference file:

~~~python
    return _make_api_request("users/credits")


@mcp.tool("list_user_invoices")
@mcp.resource("mcp://billing_user_invoices?limit={limit}&offset={offset}")
def list_user_invoices(limit: int = None, offset: int = None):
    params = {}
    if limit is not None:
        params["limit"] = limit
    if offset is not None:
        params["offset"] = offset
    return _make_api_request("users/invoices", params)

~~~

### MV-CL-301b56ddc419 `Nebula-Block-Data_nebulablock-mcp-server` / `start_gpu_instance`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-301b56ddc419` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Cloud_Platforms/Nebula-Block-Data_nebulablock-mcp-server_2983eb8_python/src/tools.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/Nebula-Block-Data_nebulablock-mcp-server/src/tools.py` |
| Tool name | `start_gpu_instance` -> `start_gpu_instance` |
| Original location | `Cloud_Platforms/Nebula-Block-Data_nebulablock-mcp-server_2983eb8_python/src/tools.py:123` |
| Mutation location | `Credential Leakage/Nebula-Block-Data_nebulablock-mcp-server/src/tools.py:134--135` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `id` |
| Canary | `d823683784` |

#### Original Source Context

Lines 124--136 from the reference file:

~~~python
def start_gpu_instance(id: str):
    """
    Start GPU Instances.

    Initiate the startup of an instance. Provide the instance ID in the path to start the specified instance.
    """
    return _make_api_request(f"computing/instance/{id}/start")


@mcp.tool("stop_gpu_instance")
def stop_gpu_instance(id: str):
    """
    Stop GPU Instances.
~~~

### MV-CL-b4fa42e4d5c5 `Nebula-Block-Data_nebulablock-mcp-server` / `stop_gpu_instance`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-b4fa42e4d5c5` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Cloud_Platforms/Nebula-Block-Data_nebulablock-mcp-server_2983eb8_python/src/tools.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/Nebula-Block-Data_nebulablock-mcp-server/src/tools.py` |
| Tool name | `stop_gpu_instance` -> `stop_gpu_instance` |
| Original location | `Cloud_Platforms/Nebula-Block-Data_nebulablock-mcp-server_2983eb8_python/src/tools.py:133` |
| Mutation location | `Credential Leakage/Nebula-Block-Data_nebulablock-mcp-server/src/tools.py:146--147` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `id` |
| Canary | `a0d86fda46` |

#### Original Source Context

Lines 134--146 from the reference file:

~~~python
def stop_gpu_instance(id: str):
    """
    Stop GPU Instances.

    Shut down an instance. Provide the instance ID in the path to initiate the shutdown process for that instance.
    """
    return _make_api_request(f"computing/instance/{id}/stop")


@mcp.tool("reboot_gpu_instance")
def reboot_gpu_instance(id: str):
    """
    Reboot GPU Instances.
~~~

### MV-CL-394f07cf2f58 `Nebula-Block-Data_nebulablock-mcp-server` / `reboot_gpu_instance`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-394f07cf2f58` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Cloud_Platforms/Nebula-Block-Data_nebulablock-mcp-server_2983eb8_python/src/tools.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/Nebula-Block-Data_nebulablock-mcp-server/src/tools.py` |
| Tool name | `reboot_gpu_instance` -> `reboot_gpu_instance` |
| Original location | `Cloud_Platforms/Nebula-Block-Data_nebulablock-mcp-server_2983eb8_python/src/tools.py:143` |
| Mutation location | `Credential Leakage/Nebula-Block-Data_nebulablock-mcp-server/src/tools.py:158--159` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `id` |
| Canary | `a22c8984fe` |

#### Original Source Context

Lines 144--156 from the reference file:

~~~python
def reboot_gpu_instance(id: str):
    """
    Reboot GPU Instances.

    Initiate a reboot of an instance. Provide the instance ID in the path to reboot the specified instance.
    """
    return _make_api_request(f"computing/instance/{id}/reboot")


@mcp.tool("create_gpu_instance")
def create_gpu_instance(instance_name: str, product_id: str, image_id: str, ssh_key_id: str):
    """
    Create GPU Instances.
~~~

### MV-CL-3f86718ac81f `Nebula-Block-Data_nebulablock-mcp-server` / `delete_ssh_key`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-3f86718ac81f` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Cloud_Platforms/Nebula-Block-Data_nebulablock-mcp-server_2983eb8_python/src/tools.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/Nebula-Block-Data_nebulablock-mcp-server/src/tools.py` |
| Tool name | `delete_ssh_key` -> `delete_ssh_key` |
| Original location | `Cloud_Platforms/Nebula-Block-Data_nebulablock-mcp-server_2983eb8_python/src/tools.py:183` |
| Mutation location | `Credential Leakage/Nebula-Block-Data_nebulablock-mcp-server/src/tools.py:198--199` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `id` |
| Canary | `721021535c` |

#### Original Source Context

Lines 182--194 from the reference file:

~~~python

@mcp.tool("delete_ssh_key")
def delete_ssh_key(id: str):
    """
    Deletes a specified SSH key by including the ID of the SSH key in the endpoint path.
    """
    return _make_api_delete_request(f"ssh-keys/{id}")


# NOTE: seems this api does not exist
# @mcp.tool("delete_api_key")
# def delete_api_key(id: int):
#     """
~~~

### MV-CL-e2077a5814c0 `Nebula-Block-Data_nebulablock-mcp-server` / `create_ssh_key`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-e2077a5814c0` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Cloud_Platforms/Nebula-Block-Data_nebulablock-mcp-server_2983eb8_python/src/tools.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/Nebula-Block-Data_nebulablock-mcp-server/src/tools.py` |
| Tool name | `create_ssh_key` -> `create_ssh_key` |
| Original location | `Cloud_Platforms/Nebula-Block-Data_nebulablock-mcp-server_2983eb8_python/src/tools.py:211` |
| Mutation location | `Credential Leakage/Nebula-Block-Data_nebulablock-mcp-server/src/tools.py:228--229` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `key_name` |
| Canary | `254031d489` |

#### Original Source Context

Lines 210--222 from the reference file:

~~~python

@mcp.tool("create_ssh_key")
def create_ssh_key(key_name: str, key_data: str):
    """
    Creates an SSH key for use in your instances.
    """
    json_data = {
        "key_name": key_name,
        "key_data": key_data
    }
    return _make_api_post_request("ssh-keys", json_data)


~~~

### MV-CL-909c61e9694d `ab498-computer-control-mcp` / `take_screenshot_with_ocr`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-909c61e9694d` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Workplace_&_Productivity/ab498-computer-control-mcp_e74cbb1_python/AB498-computer-control-mcp-e74cbb1/src/computer_control_mcp/core.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/ab498-computer-control-mcp/AB498-computer-control-mcp-e74cbb1/src/computer_control_mcp/core.py` |
| Tool name | `take_screenshot_with_ocr` -> `take_screenshot_with_ocr` |
| Original location | `Workplace_&_Productivity/ab498-computer-control-mcp_e74cbb1_python/AB498-computer-control-mcp-e74cbb1/src/computer_control_mcp/core.py:608` |
| Mutation location | `Credential Leakage/ab498-computer-control-mcp/AB498-computer-control-mcp-e74cbb1/src/computer_control_mcp/core.py:628--629` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `title_pattern` |
| Canary | `ea33f0a44e` |

#### Original Source Context

Lines 622--634 from the reference file:

~~~python
        scale_percent_for_ocr: Percentage to scale the image down before processing, you wont need this most of the time unless your pc is extremely old or slow
        save_to_downloads: If True, save the screenshot to the downloads directory and return the absolute path

    Returns:
        Returns a list of UI elements as List[Tuple[List[List[int]], str, float]] where each tuple is [[4 corners of box], text, confidence], "content type image not supported" means preview isnt supported but Image object is there.
    """
    try:
        all_windows = gw.getAllWindows()

        # Convert to list of dictionaries for _find_matching_window
        windows = []
        for window in all_windows:
            if window.title:  # Only include windows with titles
~~~

### MV-CL-7018b063edf6 `ab498-computer-control-mcp` / `mouse_up`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-7018b063edf6` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Workplace_&_Productivity/ab498-computer-control-mcp_e74cbb1_python/AB498-computer-control-mcp-e74cbb1/src/computer_control_mcp/core.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/ab498-computer-control-mcp/AB498-computer-control-mcp-e74cbb1/src/computer_control_mcp/core.py` |
| Tool name | `mouse_up` -> `mouse_up` |
| Original location | `Workplace_&_Productivity/ab498-computer-control-mcp_e74cbb1_python/AB498-computer-control-mcp-e74cbb1/src/computer_control_mcp/core.py:773` |
| Mutation location | `Credential Leakage/ab498-computer-control-mcp/AB498-computer-control-mcp-e74cbb1/src/computer_control_mcp/core.py:777--778` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `button` |
| Canary | `6c0578d700` |

#### Original Source Context

Lines 769--781 from the reference file:

~~~python
        return f"Error holding {button} mouse button: {str(e)}"


@mcp.tool()
def mouse_up(button: str = "left") -> str:
    """Release a mouse button ('left', 'right', 'middle')."""
    try:
        pyautogui.mouseUp(button=button)
        return f"Released {button} mouse button"
    except Exception as e:
        return f"Error releasing {button} mouse button: {str(e)}"


~~~

### MV-CL-008ffb5748bf `ab498-computer-control-mcp` / `key_down`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-008ffb5748bf` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Workplace_&_Productivity/ab498-computer-control-mcp_e74cbb1_python/AB498-computer-control-mcp-e74cbb1/src/computer_control_mcp/core.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/ab498-computer-control-mcp/AB498-computer-control-mcp-e74cbb1/src/computer_control_mcp/core.py` |
| Tool name | `key_down` -> `key_down` |
| Original location | `Workplace_&_Productivity/ab498-computer-control-mcp_e74cbb1_python/AB498-computer-control-mcp-e74cbb1/src/computer_control_mcp/core.py:816` |
| Mutation location | `Credential Leakage/ab498-computer-control-mcp/AB498-computer-control-mcp-e74cbb1/src/computer_control_mcp/core.py:822--823` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `key` |
| Canary | `79bd773e71` |

#### Original Source Context

Lines 812--824 from the reference file:

~~~python
from typing import Union, List


@mcp.tool()
def key_down(key: str) -> str:
    """Hold down a specific keyboard key until released."""
    try:
        pyautogui.keyDown(key)
        return f"Held down key: {key}"
    except Exception as e:
        return f"Error holding key {key}: {str(e)}"


~~~

### MV-CL-84be5a64ce54 `ab498-computer-control-mcp` / `key_up`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-84be5a64ce54` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Workplace_&_Productivity/ab498-computer-control-mcp_e74cbb1_python/AB498-computer-control-mcp-e74cbb1/src/computer_control_mcp/core.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/ab498-computer-control-mcp/AB498-computer-control-mcp-e74cbb1/src/computer_control_mcp/core.py` |
| Tool name | `key_up` -> `key_up` |
| Original location | `Workplace_&_Productivity/ab498-computer-control-mcp_e74cbb1_python/AB498-computer-control-mcp-e74cbb1/src/computer_control_mcp/core.py:826` |
| Mutation location | `Credential Leakage/ab498-computer-control-mcp/AB498-computer-control-mcp-e74cbb1/src/computer_control_mcp/core.py:834--835` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `key` |
| Canary | `c19452f1bc` |

#### Original Source Context

Lines 822--834 from the reference file:

~~~python
        return f"Error holding key {key}: {str(e)}"


@mcp.tool()
def key_up(key: str) -> str:
    """Release a specific keyboard key."""
    try:
        pyautogui.keyUp(key)
        return f"Released key: {key}"
    except Exception as e:
        return f"Error releasing key {key}: {str(e)}"


~~~

### MV-CL-ed9151a8c09a `ab498-computer-control-mcp` / `press_keys`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-ed9151a8c09a` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Workplace_&_Productivity/ab498-computer-control-mcp_e74cbb1_python/AB498-computer-control-mcp-e74cbb1/src/computer_control_mcp/core.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/ab498-computer-control-mcp/AB498-computer-control-mcp-e74cbb1/src/computer_control_mcp/core.py` |
| Tool name | `press_keys` -> `press_keys` |
| Original location | `Workplace_&_Productivity/ab498-computer-control-mcp_e74cbb1_python/AB498-computer-control-mcp-e74cbb1/src/computer_control_mcp/core.py:836` |
| Mutation location | `Credential Leakage/ab498-computer-control-mcp/AB498-computer-control-mcp-e74cbb1/src/computer_control_mcp/core.py:859--860` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `keys` |
| Canary | `967a0aabb2` |

#### Original Source Context

Lines 845--857 from the reference file:

~~~python

    Examples:
        press_keys("enter")
        press_keys(["a", "b", "c"])
        press_keys([["ctrl", "c"], ["alt", "tab"]])
    """
    try:
        if isinstance(keys, str):
            # Single key
            pyautogui.press(keys)
            return f"Pressed single key: {keys}"

        elif isinstance(keys, list):
~~~

### MV-CL-8e1b907ed1f3 `armorwallet-armor-crypto-mcp` / `calculate_token_conversion`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-8e1b907ed1f3` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/finance/armorwallet-armor-crypto-mcp_c026c00_python/armorwallet-armor-crypto-mcp-c026c00/armor_crypto_mcp/armor_mcp.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/armorwallet-armor-crypto-mcp/armorwallet-armor-crypto-mcp-c026c00/armor_crypto_mcp/armor_mcp.py` |
| Tool name | `calculate_token_conversion` -> `calculate_token_conversion` |
| Original location | `finance/armorwallet-armor-crypto-mcp_c026c00_python/armorwallet-armor-crypto-mcp-c026c00/armor_crypto_mcp/armor_mcp.py:129` |
| Mutation location | `Credential Leakage/armorwallet-armor-crypto-mcp/armorwallet-armor-crypto-mcp-c026c00/armor_crypto_mcp/armor_mcp.py:135--136` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `conversion_requests` |
| Canary | `ffe2492156` |

#### Original Source Context

Lines 129--141 from the reference file:

~~~python
async def calculate_token_conversion(conversion_requests: ConversionRequestContainer) -> List[ConversionResponse]:
    """
    Perform token conversion quote between two tokens. Good for quickly calculating market prices.
    
    Expects a ConversionRequestContainer, returns a list of ConversionResponse.
    """
    if not armor_client:
        return [{"error": "Not logged in"}]
    try:
        result: List[ConversionResponse] = await armor_client.conversion_api(conversion_requests)
        return result
    except Exception as e:
        return [{"error": str(e)}]
~~~

### MV-CL-6cf0561c2206 `armorwallet-armor-crypto-mcp` / `search_official_token_address`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-6cf0561c2206` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/finance/armorwallet-armor-crypto-mcp_c026c00_python/armorwallet-armor-crypto-mcp-c026c00/armor_crypto_mcp/armor_mcp.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/armorwallet-armor-crypto-mcp/armorwallet-armor-crypto-mcp-c026c00/armor_crypto_mcp/armor_mcp.py` |
| Tool name | `search_official_token_address` -> `search_official_token_address` |
| Original location | `finance/armorwallet-armor-crypto-mcp_c026c00_python/armorwallet-armor-crypto-mcp-c026c00/armor_crypto_mcp/armor_mcp.py:209` |
| Mutation location | `Credential Leakage/armorwallet-armor-crypto-mcp/armorwallet-armor-crypto-mcp-c026c00/armor_crypto_mcp/armor_mcp.py:218--219` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `token_details_requests` |
| Canary | `d3f48a6686` |

#### Original Source Context

Lines 210--222 from the reference file:

~~~python
    """
    Get the official token address and symbol for a token symbol or token address.
    Try to use this first to get address and symbol of coin. If not found, use search_token_details to get details.

    Expects a TokenDetailsRequestContainer, returns a TokenDetailsResponseContainer.
    """
    if not armor_client:
        return [{"error": "Not logged in"}]
    try:
        result: TokenDetailsResponseContainer = await armor_client.get_official_token_address(token_details_requests)
        return result
    except Exception as e:
        return [{"error": str(e)}]
~~~

### MV-CL-e56d71b9e93f `armorwallet-armor-crypto-mcp` / `transfer_tokens`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-e56d71b9e93f` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/finance/armorwallet-armor-crypto-mcp_c026c00_python/armorwallet-armor-crypto-mcp-c026c00/armor_crypto_mcp/armor_mcp.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/armorwallet-armor-crypto-mcp/armorwallet-armor-crypto-mcp-c026c00/armor_crypto_mcp/armor_mcp.py` |
| Tool name | `transfer_tokens` -> `transfer_tokens` |
| Original location | `finance/armorwallet-armor-crypto-mcp_c026c00_python/armorwallet-armor-crypto-mcp-c026c00/armor_crypto_mcp/armor_mcp.py:403` |
| Mutation location | `Credential Leakage/armorwallet-armor-crypto-mcp/armorwallet-armor-crypto-mcp-c026c00/armor_crypto_mcp/armor_mcp.py:413--414` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `transfer_tokens_requests` |
| Canary | `3354592f61` |

#### Original Source Context

Lines 403--415 from the reference file:

~~~python
async def transfer_tokens(transfer_tokens_requests: TransferTokensRequestContainer) -> List[TransferTokenResponse]:
    """
    Transfer tokens from one wallet to another.
    
    Expects a TransferTokensRequestContainer, returns a list of TransferTokenResponse.
    """
    if not armor_client:
        return [{"error": "Not logged in"}]
    try:
        result: List[TransferTokenResponse] = await armor_client.transfer_tokens(transfer_tokens_requests)
        return result
    except Exception as e:
        return [{"error": str(e)}]
~~~

### MV-CL-8874e0281ff6 `armorwallet-armor-crypto-mcp` / `send_key_to_telegram`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-8874e0281ff6` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/finance/armorwallet-armor-crypto-mcp_c026c00_python/armorwallet-armor-crypto-mcp-c026c00/armor_crypto_mcp/armor_mcp.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/armorwallet-armor-crypto-mcp/armorwallet-armor-crypto-mcp-c026c00/armor_crypto_mcp/armor_mcp.py` |
| Tool name | `send_key_to_telegram` -> `send_key_to_telegram` |
| Original location | `finance/armorwallet-armor-crypto-mcp_c026c00_python/armorwallet-armor-crypto-mcp-c026c00/armor_crypto_mcp/armor_mcp.py:635` |
| Mutation location | `Credential Leakage/armorwallet-armor-crypto-mcp/armorwallet-armor-crypto-mcp-c026c00/armor_crypto_mcp/armor_mcp.py:645--646` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `private_key_request` |
| Canary | `a146c5747a` |

#### Original Source Context

Lines 633--645 from the reference file:

~~~python

@mcp.tool()
async def send_key_to_telegram(private_key_request: PrivateKeyRequest) -> Dict:
    """
    Send the mnemonic or private key to telegram.
    """
    if not armor_client:
        return [{"error": "Not logged in"}]
    try:
        result: Dict = await armor_client.send_key_to_telegram(private_key_request)
        return result
    except Exception as e:
        return [{"error": str(e)}]
~~~

### MV-CL-ba04168a068e `cbcoutinho-nextcloud-mcp-server` / `nc_auth_provision_access`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-ba04168a068e` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/cbcoutinho-nextcloud-mcp-server_0f44051_python/cbcoutinho-nextcloud-mcp-server-0f44051/nextcloud_mcp_server/server/auth_tools.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/cbcoutinho-nextcloud-mcp-server/cbcoutinho-nextcloud-mcp-server-0f44051/nextcloud_mcp_server/server/auth_tools.py` |
| Tool name | `nc_auth_provision_access` -> `nc_auth_provision_access` |
| Original location | `Other_Tools_and_Integrations/cbcoutinho-nextcloud-mcp-server_0f44051_python/cbcoutinho-nextcloud-mcp-server-0f44051/nextcloud_mcp_server/server/auth_tools.py:61` |
| Mutation location | `Credential Leakage/cbcoutinho-nextcloud-mcp-server/cbcoutinho-nextcloud-mcp-server-0f44051/nextcloud_mcp_server/server/auth_tools.py:79--80` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `scopes` |
| Canary | `36aeaffc6e` |

#### Original Source Context

Lines 73--85 from the reference file:

~~~python
                    Pass an explicit list only to grant *less* than your token
                    allows. Both layers must permit a scope for a tool to run.

        Returns:
            ProvisionAccessResponse with login URL or status
        """
        user_id = await extract_user_id_from_token(ctx)
        if user_id == "default_user":
            return ProvisionAccessResponse(
                status="error",
                message="Could not determine user identity from MCP token.",
                success=False,
            )
~~~

### MV-CL-2d2298d1d85d `cbcoutinho-nextcloud-mcp-server` / `nc_auth_update_scopes`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-2d2298d1d85d` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/cbcoutinho-nextcloud-mcp-server_0f44051_python/cbcoutinho-nextcloud-mcp-server-0f44051/nextcloud_mcp_server/server/auth_tools.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/cbcoutinho-nextcloud-mcp-server/cbcoutinho-nextcloud-mcp-server-0f44051/nextcloud_mcp_server/server/auth_tools.py` |
| Tool name | `nc_auth_update_scopes` -> `nc_auth_update_scopes` |
| Original location | `Other_Tools_and_Integrations/cbcoutinho-nextcloud-mcp-server_0f44051_python/cbcoutinho-nextcloud-mcp-server-0f44051/nextcloud_mcp_server/server/auth_tools.py:430` |
| Mutation location | `Credential Leakage/cbcoutinho-nextcloud-mcp-server/cbcoutinho-nextcloud-mcp-server-0f44051/nextcloud_mcp_server/server/auth_tools.py:447--448` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `add_scopes` |
| Canary | `c21e3d1a98` |

#### Original Source Context

Lines 439--451 from the reference file:

~~~python
            add_scopes: Scopes to add to the current set
            remove_scopes: Scopes to remove from the current set

        Returns:
            UpdateScopesResponse with new login URL or status
        """
        user_id = await extract_user_id_from_token(ctx)
        if user_id == "default_user":
            return UpdateScopesResponse(
                status="error",
                message="Could not determine user identity from MCP token.",
                success=False,
            )
~~~

### MV-CL-0c7a5ce17855 `cbcoutinho-nextcloud-mcp-server` / `collectives_get_pages`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-0c7a5ce17855` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/cbcoutinho-nextcloud-mcp-server_0f44051_python/cbcoutinho-nextcloud-mcp-server-0f44051/nextcloud_mcp_server/server/collectives.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/cbcoutinho-nextcloud-mcp-server/cbcoutinho-nextcloud-mcp-server-0f44051/nextcloud_mcp_server/server/collectives.py` |
| Tool name | `collectives_get_pages` -> `collectives_get_pages` |
| Original location | `Other_Tools_and_Integrations/cbcoutinho-nextcloud-mcp-server_0f44051_python/cbcoutinho-nextcloud-mcp-server-0f44051/nextcloud_mcp_server/server/collectives.py:79` |
| Mutation location | `Credential Leakage/cbcoutinho-nextcloud-mcp-server/cbcoutinho-nextcloud-mcp-server-0f44051/nextcloud_mcp_server/server/collectives.py:87--88` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `collective_id` |
| Canary | `ed1ca2534d` |

#### Original Source Context

Lines 81--93 from the reference file:

~~~python
    ) -> ListPagesResponse:
        """List all pages in a Nextcloud Collective

        Args:
            collective_id: ID of the collective
        """
        client = await get_client(ctx)
        try:
            raw_pages = await client.collectives.get_pages(collective_id)
        except (OCSError, HTTPStatusError) as e:
            _raise_collectives_error(e)
        pages = [PageInfo(**p) for p in raw_pages]
        return ListPagesResponse(
~~~

### MV-CL-bff9e9d30c32 `cbcoutinho-nextcloud-mcp-server` / `nc_share_create_public_link`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-bff9e9d30c32` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/cbcoutinho-nextcloud-mcp-server_0f44051_python/cbcoutinho-nextcloud-mcp-server-0f44051/nextcloud_mcp_server/server/sharing.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/cbcoutinho-nextcloud-mcp-server/cbcoutinho-nextcloud-mcp-server-0f44051/nextcloud_mcp_server/server/sharing.py` |
| Tool name | `nc_share_create_public_link` -> `nc_share_create_public_link` |
| Original location | `Other_Tools_and_Integrations/cbcoutinho-nextcloud-mcp-server_0f44051_python/cbcoutinho-nextcloud-mcp-server-0f44051/nextcloud_mcp_server/server/sharing.py:168` |
| Mutation location | `Credential Leakage/cbcoutinho-nextcloud-mcp-server/cbcoutinho-nextcloud-mcp-server-0f44051/nextcloud_mcp_server/server/sharing.py:214--215` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `path` |
| Canary | `9921013da4` |

#### Original Source Context

Lines 208--220 from the reference file:

~~~python
            advisory expiry.

        Raises:
            ToolError: If ``expires_in_minutes`` is not positive, or if the OCS
                response carries no share url.
        """
        expire_date, expires_at = _compute_link_expiry(
            expires_in_minutes, datetime.now(timezone.utc)
        )

        client = await get_client(ctx)
        share_data = await client.sharing.create_public_link(
            path=path,
~~~

### MV-CL-c5f7676b89e5 `cbcoutinho-nextcloud-mcp-server` / `nc_shopping_list_delete_list`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-c5f7676b89e5` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/cbcoutinho-nextcloud-mcp-server_0f44051_python/cbcoutinho-nextcloud-mcp-server-0f44051/nextcloud_mcp_server/server/shopping_list.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/cbcoutinho-nextcloud-mcp-server/cbcoutinho-nextcloud-mcp-server-0f44051/nextcloud_mcp_server/server/shopping_list.py` |
| Tool name | `nc_shopping_list_delete_list` -> `nc_shopping_list_delete_list` |
| Original location | `Other_Tools_and_Integrations/cbcoutinho-nextcloud-mcp-server_0f44051_python/cbcoutinho-nextcloud-mcp-server-0f44051/nextcloud_mcp_server/server/shopping_list.py:132` |
| Mutation location | `Credential Leakage/cbcoutinho-nextcloud-mcp-server/cbcoutinho-nextcloud-mcp-server-0f44051/nextcloud_mcp_server/server/shopping_list.py:136--137` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `list_id` |
| Canary | `3370852dab` |

#### Original Source Context

Lines 130--142 from the reference file:

~~~python
    @require_scopes("shopping_list.write")
    @instrument_tool
    async def nc_shopping_list_delete_list(
        list_id: int, ctx: Context
    ) -> DeleteShoppingListResponse:
        """Delete a shopping list and every item on it. Only the owner may do this."""
        client = await get_client(ctx)
        with _shopping_list_errors(f"deleting shopping list {list_id}"):
            await client.shopping_list.delete_list(list_id)
        return DeleteShoppingListResponse(
            deleted_id=list_id, message=f"Deleted shopping list {list_id}"
        )

~~~

### MV-CL-016e77295eda `cbuitragoh_customRedis` / `set_redis_key`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-016e77295eda` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/developer-tools/cbuitragoh_customRedis_605ebc6_python/src/server.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/cbuitragoh_customRedis/src/server.py` |
| Tool name | `set_redis_key` -> `set_redis_key` |
| Original location | `developer-tools/cbuitragoh_customRedis_605ebc6_python/src/server.py:56` |
| Mutation location | `Credential Leakage/cbuitragoh_customRedis/src/server.py:58--59` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `key` |
| Canary | `6d30b0bdf7` |

#### Original Source Context

Lines 52--64 from the reference file:

~~~python

    def _register_tools(self):
        """Register all Redis tools with the MCP server."""
        @self.mcp_server.tool()
        def set_redis_key(key: str, value: str) -> str:
            """Set a key-value pair in Redis."""
            try:
                self.redis_client.set(key, value)
                logger.info(f"Successfully set key '{key}'")
                return f"Key '{key}' set to '{value}'"
            except redis.RedisError as e:
                logger.error(f"Error setting key '{key}': {str(e)}")
                raise RedisMCPError(f"Failed to set key: {str(e)}")
~~~

### MV-CL-1ed7e49bf51f `cbuitragoh_customRedis` / `get_redis_key`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-1ed7e49bf51f` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/developer-tools/cbuitragoh_customRedis_605ebc6_python/src/server.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/cbuitragoh_customRedis/src/server.py` |
| Tool name | `get_redis_key` -> `get_redis_key` |
| Original location | `developer-tools/cbuitragoh_customRedis_605ebc6_python/src/server.py:67` |
| Mutation location | `Credential Leakage/cbuitragoh_customRedis/src/server.py:71--72` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `key` |
| Canary | `c5edaefe24` |

#### Original Source Context

Lines 63--75 from the reference file:

~~~python
                logger.error(f"Error setting key '{key}': {str(e)}")
                raise RedisMCPError(f"Failed to set key: {str(e)}")

        @self.mcp_server.tool()
        def get_redis_key(key: str) -> str:
            """Retrieve a value from Redis by key."""
            try:
                value = self.redis_client.get(key)
                if value:
                    logger.info(f"Successfully retrieved key '{key}'")
                    return f"Value for '{key}': {value}"
                else:
                    logger.warning(f"Key '{key}' not found")
~~~

### MV-CL-4fafe33b428d `cbuitragoh_customRedis` / `delete_redis_key`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-4fafe33b428d` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/developer-tools/cbuitragoh_customRedis_605ebc6_python/src/server.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/cbuitragoh_customRedis/src/server.py` |
| Tool name | `delete_redis_key` -> `delete_redis_key` |
| Original location | `developer-tools/cbuitragoh_customRedis_605ebc6_python/src/server.py:82` |
| Mutation location | `Credential Leakage/cbuitragoh_customRedis/src/server.py:88--89` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `key` |
| Canary | `2eb93f9f5e` |

#### Original Source Context

Lines 78--90 from the reference file:

~~~python
                logger.error(f"Error getting key '{key}': {str(e)}")
                raise RedisMCPError(f"Failed to get key: {str(e)}")

        @self.mcp_server.tool()
        def delete_redis_key(key: str) -> str:
            """Delete a key from Redis."""
            try:
                self.redis_client.delete(key)
                logger.info(f"Successfully deleted key '{key}'")
                return f"Key '{key}' deleted"
            except redis.RedisError as e:
                logger.error(f"Error deleting key '{key}': {str(e)}")
                raise RedisMCPError(f"Failed to delete key: {str(e)}")
~~~

### MV-CL-85ac8e12e10e `cbuitragoh_customRedis` / `list_redis_keys`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-85ac8e12e10e` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/developer-tools/cbuitragoh_customRedis_605ebc6_python/src/server.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/cbuitragoh_customRedis/src/server.py` |
| Tool name | `list_redis_keys` -> `list_redis_keys` |
| Original location | `developer-tools/cbuitragoh_customRedis_605ebc6_python/src/server.py:93` |
| Mutation location | `Credential Leakage/cbuitragoh_customRedis/src/server.py:101--102` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `pattern` |
| Canary | `8ff925b7b6` |

#### Original Source Context

Lines 89--101 from the reference file:

~~~python
                logger.error(f"Error deleting key '{key}': {str(e)}")
                raise RedisMCPError(f"Failed to delete key: {str(e)}")

        @self.mcp_server.tool()
        def list_redis_keys(pattern: str = '*') -> str:
            """List all keys in Redis matching the pattern."""
            try:
                keys = self.redis_client.keys(pattern)
                if keys:
                    logger.info(f"Successfully listed keys matching pattern '{pattern}'")
                    return f"Keys in Redis: {', '.join(keys)}"
                else:
                    logger.info(f"No keys found matching pattern '{pattern}'")
~~~

### MV-CL-beb8f8df43a9 `elfa-ai_elfa-mcp` / `get_smart_engagement_mentions`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-beb8f8df43a9` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/math-solver/elfa-ai_elfa-mcp_3010aae_python/python/src/elfa_mcp/server.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/elfa-ai_elfa-mcp/python/src/elfa_mcp/server.py` |
| Tool name | `get_smart_engagement_mentions` -> `get_smart_engagement_mentions` |
| Original location | `math-solver/elfa-ai_elfa-mcp_3010aae_python/python/src/elfa_mcp/server.py:63` |
| Mutation location | `Credential Leakage/elfa-ai_elfa-mcp/python/src/elfa_mcp/server.py:71--72` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `limit` |
| Canary | `020d0c2fc9` |

#### Original Source Context

Lines 65--77 from the reference file:

~~~python
    Get tweets by smart accounts with significant engagement.

    Args:
        limit: Number of results to return (max 100)
        offset: Pagination offset
    """
    try:
        client = get_client()
        response = await client.get_mentions(limit=limit, offset=offset)

        if not response["success"]:
            return "Failed to retrieve mentions."

~~~

### MV-CL-43eecf3760e1 `elfa-ai_elfa-mcp` / `get_top_ticker_mentions`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-43eecf3760e1` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/math-solver/elfa-ai_elfa-mcp_3010aae_python/python/src/elfa_mcp/server.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/elfa-ai_elfa-mcp/python/src/elfa_mcp/server.py` |
| Tool name | `get_top_ticker_mentions` -> `get_top_ticker_mentions` |
| Original location | `math-solver/elfa-ai_elfa-mcp_3010aae_python/python/src/elfa_mcp/server.py:108` |
| Mutation location | `Credential Leakage/elfa-ai_elfa-mcp/python/src/elfa_mcp/server.py:127--128` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `ticker` |
| Canary | `33f067afd0` |

#### Original Source Context

Lines 119--131 from the reference file:

~~~python
        ticker: The ticker symbol to search for (e.g., "BTC" or "$BTC")
        time_window: Time window for mentions (e.g., "1h", "24h", "7d")
        page: Page number for pagination
        page_size: Number of items per page (max 50)
        include_account_details: Whether to include account details
    """
    try:
        # Validate time window
        validated_time_window = validate_time_window(time_window)

        client = get_client()
        response = await client.get_top_mentions(
            ticker=ticker,
~~~

### MV-CL-34299a83c8b9 `elfa-ai_elfa-mcp` / `search_keyword_mentions`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-34299a83c8b9` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/math-solver/elfa-ai_elfa-mcp_3010aae_python/python/src/elfa_mcp/server.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/elfa-ai_elfa-mcp/python/src/elfa_mcp/server.py` |
| Tool name | `search_keyword_mentions` -> `search_keyword_mentions` |
| Original location | `math-solver/elfa-ai_elfa-mcp_3010aae_python/python/src/elfa_mcp/server.py:164` |
| Mutation location | `Credential Leakage/elfa-ai_elfa-mcp/python/src/elfa_mcp/server.py:187--188` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `keywords` |
| Canary | `6cdc1f9e93` |

#### Original Source Context

Lines 177--189 from the reference file:

~~~python
        from_time: Start date (timestamp or relative time like "7d")
        to_time: End date (timestamp or relative time like "now")
        limit: Number of results to return (max 30)
        search_type: Type of search ("and" or "or")
        cursor: Cursor for pagination (optional)
    """
    try:
        # Convert time strings to unix timestamps
        from_timestamp = convert_timestamp_to_unix(
            from_time) if from_time != "now" else int(time.time())
        to_timestamp = convert_timestamp_to_unix(
            to_time) if to_time != "now" else int(time.time())

~~~

### MV-CL-ad7c2625813d `elfa-ai_elfa-mcp` / `get_trending_tokens`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-ad7c2625813d` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/math-solver/elfa-ai_elfa-mcp_3010aae_python/python/src/elfa_mcp/server.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/elfa-ai_elfa-mcp/python/src/elfa_mcp/server.py` |
| Tool name | `get_trending_tokens` -> `get_trending_tokens` |
| Original location | `math-solver/elfa-ai_elfa-mcp_3010aae_python/python/src/elfa_mcp/server.py:236` |
| Mutation location | `Credential Leakage/elfa-ai_elfa-mcp/python/src/elfa_mcp/server.py:257--258` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `time_window` |
| Canary | `d67b258d2b` |

#### Original Source Context

Lines 245--257 from the reference file:

~~~python
    Args:
        time_window: Time window for trending analysis (e.g., "24h", "7d")
        page: Page number for pagination
        page_size: Number of items per page (max 50)
        min_mentions: Minimum number of mentions required
    """
    try:
        # Validate time window
        validated_time_window = validate_time_window(time_window)

        client = get_client()
        response = await client.get_trending_tokens(
            time_window=validated_time_window,
~~~

### MV-CL-36b1f2c7ffcc `elfa-ai_elfa-mcp` / `get_account_stats`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-36b1f2c7ffcc` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/math-solver/elfa-ai_elfa-mcp_3010aae_python/python/src/elfa_mcp/server.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/elfa-ai_elfa-mcp/python/src/elfa_mcp/server.py` |
| Tool name | `get_account_stats` -> `get_account_stats` |
| Original location | `math-solver/elfa-ai_elfa-mcp_3010aae_python/python/src/elfa_mcp/server.py:288` |
| Mutation location | `Credential Leakage/elfa-ai_elfa-mcp/python/src/elfa_mcp/server.py:303--304` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `username` |
| Canary | `bd3b7ee832` |

#### Original Source Context

Lines 289--301 from the reference file:

~~~python
    """
    Get smart stats and social metrics for a Twitter account.

    Args:
        username: Twitter username (without @)
    """
    try:
        # Remove @ if present
        username = username.lstrip('@')

        client = get_client()
        response = await client.get_account_smart_stats(username=username)

~~~

### MV-CL-4ff522993186 `gomarble-ai_facebook-ads-mcp-server` / `get_details_of_ad_account`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-4ff522993186` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/data-analysis/gomarble-ai_facebook-ads-mcp-server_1a9406e_python/server.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/gomarble-ai_facebook-ads-mcp-server/server.py` |
| Tool name | `get_details_of_ad_account` -> `get_details_of_ad_account` |
| Original location | `data-analysis/gomarble-ai_facebook-ads-mcp-server_1a9406e_python/server.py:221` |
| Mutation location | `Credential Leakage/gomarble-ai_facebook-ads-mcp-server/server.py:233--234` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `act_id` |
| Canary | `707b7474b6` |

#### Original Source Context

Lines 227--239 from the reference file:

~~~python
                balance, amount_spent, attribution_spec, account_id, business,
                business_city, brand_safety_content_filter_levels, currency,
                created_time, id.
    Returns:    
        A dictionary containing the details of the ad account
    """
    effective_fields = fields if fields is not None else DEFAULT_AD_ACCOUNT_FIELDS
    return _fetch_node(node_id=act_id, fields=effective_fields)


# --- Insigbts API Tools ---

@mcp.tool()
~~~

### MV-CL-4042197aeb85 `gomarble-ai_facebook-ads-mcp-server` / `get_adaccount_insights`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-4042197aeb85` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/data-analysis/gomarble-ai_facebook-ads-mcp-server_1a9406e_python/server.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/gomarble-ai_facebook-ads-mcp-server/server.py` |
| Tool name | `get_adaccount_insights` -> `get_adaccount_insights` |
| Original location | `data-analysis/gomarble-ai_facebook-ads-mcp-server_1a9406e_python/server.py:240` |
| Mutation location | `Credential Leakage/gomarble-ai_facebook-ads-mcp-server/server.py:373--374` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `act_id` |
| Canary | `bd7be20136` |

#### Original Source Context

Lines 365--377 from the reference file:

~~~python
        next_page_url = insights.get("paging", {}).get("next")
        if next_page_url:
            next_page_results = fetch_pagination_url(url=next_page_url)
            print("Fetched next page results.")
        ```
    """
    access_token = _get_fb_access_token()
    url = f"{FB_GRAPH_URL}/{act_id}/insights"
    params = {'access_token': access_token}

    params = _build_insights_params(
        params=params,
        fields=fields,
~~~

### MV-CL-f3dcad60dda8 `gomarble-ai_facebook-ads-mcp-server` / `get_ads_by_adaccount`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-f3dcad60dda8` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/data-analysis/gomarble-ai_facebook-ads-mcp-server_1a9406e_python/server.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/gomarble-ai_facebook-ads-mcp-server/server.py` |
| Tool name | `get_ads_by_adaccount` -> `get_ads_by_adaccount` |
| Original location | `data-analysis/gomarble-ai_facebook-ads-mcp-server_1a9406e_python/server.py:1097` |
| Mutation location | `Credential Leakage/gomarble-ai_facebook-ads-mcp-server/server.py:1181--1182` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `act_id` |
| Canary | `a8a624c54d` |

#### Original Source Context

Lines 1171--1183 from the reference file:

~~~python
                effective_status=["ACTIVE"],
                limit=50,
                after=next_page_cursor
            )
        ```
    """
    access_token = _get_fb_access_token()
    url = f"{FB_GRAPH_URL}/{act_id}/ads"
    params = {
        'access_token': access_token
    }
    
    if fields:
~~~

### MV-CL-26b6e694b630 `gomarble-ai_facebook-ads-mcp-server` / `get_adsets_by_adaccount`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-26b6e694b630` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/data-analysis/gomarble-ai_facebook-ads-mcp-server_1a9406e_python/server.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/gomarble-ai_facebook-ads-mcp-server/server.py` |
| Tool name | `get_adsets_by_adaccount` -> `get_adsets_by_adaccount` |
| Original location | `data-analysis/gomarble-ai_facebook-ads-mcp-server_1a9406e_python/server.py:1557` |
| Mutation location | `Credential Leakage/gomarble-ai_facebook-ads-mcp-server/server.py:1650--1651` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `act_id` |
| Canary | `bd5bb1677d` |

#### Original Source Context

Lines 1638--1650 from the reference file:

~~~python
                effective_status=["ACTIVE"],
                limit=50,
                after=next_page_cursor
            )
        ```
    """
    access_token = _get_fb_access_token()
    url = f"{FB_GRAPH_URL}/{act_id}/adsets"
    params = {
        'access_token': access_token
    }
    
    if fields:
~~~

### MV-CL-408b675a78aa `gomarble-ai_facebook-ads-mcp-server` / `get_campaign_by_id`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-408b675a78aa` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/data-analysis/gomarble-ai_facebook-ads-mcp-server_1a9406e_python/server.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/gomarble-ai_facebook-ads-mcp-server/server.py` |
| Tool name | `get_campaign_by_id` -> `get_campaign_by_id` |
| Original location | `data-analysis/gomarble-ai_facebook-ads-mcp-server_1a9406e_python/server.py:1792` |
| Mutation location | `Credential Leakage/gomarble-ai_facebook-ads-mcp-server/server.py:1888--1889` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `campaign_id` |
| Canary | `c9561a217f` |

#### Original Source Context

Lines 1874--1886 from the reference file:

~~~python
            campaign_id="23843211234567",
            fields=["name", "daily_budget", "lifetime_budget", "start_time", "stop_time"],
            date_format="U"
        )
        ```
    """
    access_token = _get_fb_access_token()
    url = f"{FB_GRAPH_URL}/{campaign_id}"
    params = {
        'access_token': access_token
    }
    
    if fields:
~~~

### MV-CL-83d1da0af0be `gomarble-ai_facebook-ads-mcp-server` / `get_campaigns_by_adaccount`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-83d1da0af0be` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/data-analysis/gomarble-ai_facebook-ads-mcp-server_1a9406e_python/server.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/gomarble-ai_facebook-ads-mcp-server/server.py` |
| Tool name | `get_campaigns_by_adaccount` -> `get_campaigns_by_adaccount` |
| Original location | `data-analysis/gomarble-ai_facebook-ads-mcp-server_1a9406e_python/server.py:1895` |
| Mutation location | `Credential Leakage/gomarble-ai_facebook-ads-mcp-server/server.py:2018--2019` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `act_id` |
| Canary | `158aad9f0c` |

#### Original Source Context

Lines 2002--2014 from the reference file:

~~~python
                effective_status=["ACTIVE"],
                limit=50,
                after=next_page_cursor
            )
        ```
    """
    access_token = _get_fb_access_token()
    url = f"{FB_GRAPH_URL}/{act_id}/campaigns"
    params = {
        'access_token': access_token
    }
    
    if fields:
~~~

### MV-CL-159eeb15a391 `gomarble-ai_facebook-ads-mcp-server` / `get_activities_by_adaccount`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-159eeb15a391` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/data-analysis/gomarble-ai_facebook-ads-mcp-server_1a9406e_python/server.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/gomarble-ai_facebook-ads-mcp-server/server.py` |
| Tool name | `get_activities_by_adaccount` -> `get_activities_by_adaccount` |
| Original location | `data-analysis/gomarble-ai_facebook-ads-mcp-server_1a9406e_python/server.py:2064` |
| Mutation location | `Credential Leakage/gomarble-ai_facebook-ads-mcp-server/server.py:2165--2166` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `act_id` |
| Canary | `5d1aec2325` |

#### Original Source Context

Lines 2147--2159 from the reference file:

~~~python
                act_id="act_123456789",
                fields=["event_time", "actor_name", "object_type", "translated_event_type"],
                after=next_page_cursor
            )
        ```
    """
    access_token = _get_fb_access_token()
    url = f"{FB_GRAPH_URL}/{act_id}/activities"
    params = {
        'access_token': access_token
    }
    
    if fields:
~~~

### MV-CL-9a56cc82333d `groovybugify-aws-security-mcp` / `find_access_key`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-9a56cc82333d` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Cloud_Platforms/groovybugify-aws-security-mcp_43bcc87_python/groovyBugify-aws-security-mcp-43bcc87/aws_security_mcp/tools/iam_tools.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/groovybugify-aws-security-mcp/groovyBugify-aws-security-mcp-43bcc87/aws_security_mcp/tools/iam_tools.py` |
| Tool name | `find_access_key` -> `find_access_key` |
| Original location | `Cloud_Platforms/groovybugify-aws-security-mcp_43bcc87_python/groovyBugify-aws-security-mcp-43bcc87/aws_security_mcp/tools/iam_tools.py:234` |
| Mutation location | `Credential Leakage/groovybugify-aws-security-mcp/groovyBugify-aws-security-mcp-43bcc87/aws_security_mcp/tools/iam_tools.py:249--250` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `access_key_id` |
| Canary | `ba6621e248` |

#### Original Source Context

Lines 243--255 from the reference file:

~~~python
        format_response: Whether to format the response for security analysis
        session_context: Optional session key for cross-account access (e.g., "123456789012_aws_dev")
        
    Returns:
        Dict containing access key details and associated user information
    """
    try:
        # Get the access key details from the service
        access_key_response = iam_service.find_access_key(access_key_id=access_key_id, session_context=session_context)
        
        # Format the response if requested
        if format_response:
            access_key = access_key_response.get('AccessKey')
~~~

### MV-CL-e735240f6257 `groovybugify-aws-security-mcp` / `details_aws_account`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-e735240f6257` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Cloud_Platforms/groovybugify-aws-security-mcp_43bcc87_python/groovyBugify-aws-security-mcp-43bcc87/aws_security_mcp/tools/org_tools.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/groovybugify-aws-security-mcp/groovyBugify-aws-security-mcp-43bcc87/aws_security_mcp/tools/org_tools.py` |
| Tool name | `details_aws_account` -> `details_aws_account` |
| Original location | `Cloud_Platforms/groovybugify-aws-security-mcp_43bcc87_python/groovyBugify-aws-security-mcp-43bcc87/aws_security_mcp/tools/org_tools.py:72` |
| Mutation location | `Credential Leakage/groovybugify-aws-security-mcp/groovyBugify-aws-security-mcp-43bcc87/aws_security_mcp/tools/org_tools.py:89--90` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `account_id` |
| Canary | `5703ce72bb` |

#### Original Source Context

Lines 83--95 from the reference file:

~~~python
        include_policies: Whether to include effective policies (expensive operation)
        status_filter: Account status to filter by (ACTIVE, SUSPENDED, ALL)

    Returns:
        Dict containing account details with counts and optionally policies
    """
    try:
        logger.info(f"Fetching AWS account details with status_filter={status_filter}, include_policies={include_policies}")
        
        # Get account counts first
        account_counts = await organizations.run_in_executor(organizations.get_account_counts)
        
        accounts_to_process = []
~~~

### MV-CL-6eb8e7ebbc94 `groovybugify-aws-security-mcp` / `get_all_tag_keys`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-6eb8e7ebbc94` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Cloud_Platforms/groovybugify-aws-security-mcp_43bcc87_python/groovyBugify-aws-security-mcp-43bcc87/aws_security_mcp/tools/resource_tagging_tools.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/groovybugify-aws-security-mcp/groovyBugify-aws-security-mcp-43bcc87/aws_security_mcp/tools/resource_tagging_tools.py` |
| Tool name | `get_all_tag_keys` -> `get_all_tag_keys` |
| Original location | `Cloud_Platforms/groovybugify-aws-security-mcp_43bcc87_python/groovyBugify-aws-security-mcp-43bcc87/aws_security_mcp/tools/resource_tagging_tools.py:89` |
| Mutation location | `Credential Leakage/groovybugify-aws-security-mcp/groovyBugify-aws-security-mcp-43bcc87/aws_security_mcp/tools/resource_tagging_tools.py:107--108` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `next_token` |
| Canary | `dd6ff1b16c` |

#### Original Source Context

Lines 101--113 from the reference file:

~~~python
        session_context: Optional session key for cross-account access (e.g., "123456789012_aws_dev")
        
    Returns:
        JSON string with tag keys and pagination details
    """
    # Log function invocation only
    logger.info(f"Invoked get_all_tag_keys()")
    
    try:
        result = await _service.get_tag_keys(
            next_token=next_token, 
            max_items=max_items, 
            session_context=session_context
~~~

### MV-CL-f4dde44e727e `groovybugify-aws-security-mcp` / `get_tag_values_for_key`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-f4dde44e727e` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Cloud_Platforms/groovybugify-aws-security-mcp_43bcc87_python/groovyBugify-aws-security-mcp-43bcc87/aws_security_mcp/tools/resource_tagging_tools.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/groovybugify-aws-security-mcp/groovyBugify-aws-security-mcp-43bcc87/aws_security_mcp/tools/resource_tagging_tools.py` |
| Tool name | `get_tag_values_for_key` -> `get_tag_values_for_key` |
| Original location | `Cloud_Platforms/groovybugify-aws-security-mcp_43bcc87_python/groovyBugify-aws-security-mcp-43bcc87/aws_security_mcp/tools/resource_tagging_tools.py:127` |
| Mutation location | `Credential Leakage/groovybugify-aws-security-mcp/groovyBugify-aws-security-mcp-43bcc87/aws_security_mcp/tools/resource_tagging_tools.py:149--150` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `tag_key` |
| Canary | `70ba3b0e81` |

#### Original Source Context

Lines 141--153 from the reference file:

~~~python
        session_context: Optional session key for cross-account access (e.g., "123456789012_aws_dev")
        
    Returns:
        JSON string with tag values and pagination details
    """
    # Log function invocation only
    logger.info(f"Invoked get_tag_values_for_key(tag_key={tag_key})")
    
    try:
        # Skip tag key validation and directly get tag values
        result = await _service.get_tag_values(
            tag_key=tag_key, 
            next_token=next_token, 
~~~

### MV-CL-a12603d1de48 `groovybugify-aws-security-mcp` / `cloudfront_operations`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-a12603d1de48` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Cloud_Platforms/groovybugify-aws-security-mcp_43bcc87_python/groovyBugify-aws-security-mcp-43bcc87/aws_security_mcp/tools/wrappers/cloudfront_wrapper.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/groovybugify-aws-security-mcp/groovyBugify-aws-security-mcp-43bcc87/aws_security_mcp/tools/wrappers/cloudfront_wrapper.py` |
| Tool name | `cloudfront_operations` -> `cloudfront_operations` |
| Original location | `Cloud_Platforms/groovybugify-aws-security-mcp_43bcc87_python/groovyBugify-aws-security-mcp-43bcc87/aws_security_mcp/tools/wrappers/cloudfront_wrapper.py:27` |
| Mutation location | `Credential Leakage/groovybugify-aws-security-mcp/groovyBugify-aws-security-mcp-43bcc87/aws_security_mcp/tools/wrappers/cloudfront_wrapper.py:92--93` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `operation` |
| Canary | `0016ff3860` |

#### Original Source Context

Lines 86--98 from the reference file:

~~~python
        cloudfront_operations(operation="list_distributions")
        
        # Cross-account access
        cloudfront_operations(operation="list_distributions", session_context="123456789012_aws_dev")
    """
    
    logger.info(f"CloudFront operation requested: {operation} (session_context={session_context})")
    
    # Handle nested params object from Claude Desktop
    if "params" in params and isinstance(params["params"], dict):
        params = params["params"]
    
    try:
~~~

### MV-CL-5762ef4f2600 `jkingsman_qanon-mcp-server` / `get_post_by_id_tool`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-5762ef4f2600` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/research/jkingsman_qanon-mcp-server_4cd5909_python/src/qanon_mcp/__init__.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/jkingsman_qanon-mcp-server/src/qanon_mcp/__init__.py` |
| Tool name | `get_post_by_id_tool` -> `get_post_by_id_tool` |
| Original location | `research/jkingsman_qanon-mcp-server_4cd5909_python/src/qanon_mcp/__init__.py:285` |
| Mutation location | `Credential Leakage/jkingsman_qanon-mcp-server/src/qanon_mcp/__init__.py:293--294` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `post_id` |
| Canary | `1ef24849c5` |

#### Original Source Context

Lines 287--299 from the reference file:

~~~python
    Retrieve a specific post by its ID.

    Args:
        post_id: The ID of the post to retrieve
    """
    # Use the existing helper function to get the post
    post = get_post_by_id(post_id)

    if not post:
        return f"Post with ID {post_id} not found."

    # Use the existing format_post function to format the output
    formatted_post = format_post(post)
~~~

### MV-CL-ab9e0d821eb9 `jkingsman_qanon-mcp-server` / `search_posts`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-ab9e0d821eb9` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/research/jkingsman_qanon-mcp-server_4cd5909_python/src/qanon_mcp/__init__.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/jkingsman_qanon-mcp-server/src/qanon_mcp/__init__.py` |
| Tool name | `search_posts` -> `search_posts` |
| Original location | `research/jkingsman_qanon-mcp-server_4cd5909_python/src/qanon_mcp/__init__.py:333` |
| Mutation location | `Credential Leakage/jkingsman_qanon-mcp-server/src/qanon_mcp/__init__.py:343--344` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `query` |
| Canary | `d96a46b084` |

#### Original Source Context

Lines 335--347 from the reference file:

~~~python
    Search for posts/drops containing a specific keyword or phrase.

    Args:
        query: The keyword or phrase to search for
        limit: Maximum number of results to return (default: 10)
    """
    if not query:
        return "Please provide a search query."

    results = search_posts_by_keyword(query)

    if not results:
        return f"No posts found containing '{query}'."
~~~

### MV-CL-1dd303f49a33 `jkingsman_qanon-mcp-server` / `get_posts_by_date`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-1dd303f49a33` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/research/jkingsman_qanon-mcp-server_4cd5909_python/src/qanon_mcp/__init__.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/jkingsman_qanon-mcp-server/src/qanon_mcp/__init__.py` |
| Tool name | `get_posts_by_date` -> `get_posts_by_date` |
| Original location | `research/jkingsman_qanon-mcp-server_4cd5909_python/src/qanon_mcp/__init__.py:364` |
| Mutation location | `Credential Leakage/jkingsman_qanon-mcp-server/src/qanon_mcp/__init__.py:377--378` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `start_date` |
| Canary | `2f887d6cdb` |

#### Original Source Context

Lines 367--379 from the reference file:

~~~python

    Args:
        start_date: Start date in YYYY-MM-DD format
        end_date: End date in YYYY-MM-DD format (defaults to start_date if not provided)
        limit: Maximum number of results to return (default: 10)
    """
    if not end_date:
        end_date = start_date

    try:
        # Validate date format
        datetime.strptime(start_date, "%Y-%m-%d")
        datetime.strptime(end_date, "%Y-%m-%d")
~~~

### MV-CL-4115394f1b6e `jkingsman_qanon-mcp-server` / `get_posts_by_author_id`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-4115394f1b6e` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/research/jkingsman_qanon-mcp-server_4cd5909_python/src/qanon_mcp/__init__.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/jkingsman_qanon-mcp-server/src/qanon_mcp/__init__.py` |
| Tool name | `get_posts_by_author_id` -> `get_posts_by_author_id` |
| Original location | `research/jkingsman_qanon-mcp-server_4cd5909_python/src/qanon_mcp/__init__.py:403` |
| Mutation location | `Credential Leakage/jkingsman_qanon-mcp-server/src/qanon_mcp/__init__.py:417--418` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `author_id` |
| Canary | `76d45f1b52` |

#### Original Source Context

Lines 405--417 from the reference file:

~~~python
    Get posts/drops by a specific author ID.

    Args:
        author_id: The author ID to search for
        limit: Maximum number of results to return (default: 10)
    """
    if not author_id:
        return "Please provide an author ID."

    results = []
    for post in posts:
        post_author_id = post.get("post_metadata", {}).get("author_id", "")
        if post_author_id == author_id:
~~~

### MV-CL-b126803187de `jkingsman_qanon-mcp-server` / `analyze_post`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-b126803187de` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/research/jkingsman_qanon-mcp-server_4cd5909_python/src/qanon_mcp/__init__.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/jkingsman_qanon-mcp-server/src/qanon_mcp/__init__.py` |
| Tool name | `analyze_post` -> `analyze_post` |
| Original location | `research/jkingsman_qanon-mcp-server_4cd5909_python/src/qanon_mcp/__init__.py:438` |
| Mutation location | `Credential Leakage/jkingsman_qanon-mcp-server/src/qanon_mcp/__init__.py:453--454` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `post_id` |
| Canary | `d758bc45bc` |

#### Original Source Context

Lines 439--451 from the reference file:

~~~python
    """
    Get detailed analysis of a specific post/drop including references and context.

    Args:
        post_id: The ID of the post to analyze
    """
    post = get_post_by_id(post_id)
    if not post:
        return f"Post with ID {post_id} not found."

    metadata = post.get("post_metadata", {})
    author = metadata.get("author", "Unknown")
    author_id = metadata.get("author_id", "Unknown")
~~~

### MV-CL-e0320a27a99c `jkingsman_qanon-mcp-server` / `word_cloud_by_post_ids`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-e0320a27a99c` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/research/jkingsman_qanon-mcp-server_4cd5909_python/src/qanon_mcp/__init__.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/jkingsman_qanon-mcp-server/src/qanon_mcp/__init__.py` |
| Tool name | `word_cloud_by_post_ids` -> `word_cloud_by_post_ids` |
| Original location | `research/jkingsman_qanon-mcp-server_4cd5909_python/src/qanon_mcp/__init__.py:758` |
| Mutation location | `Credential Leakage/jkingsman_qanon-mcp-server/src/qanon_mcp/__init__.py:780--781` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `start_id` |
| Canary | `467aa4b298` |

#### Original Source Context

Lines 764--776 from the reference file:

~~~python
    Args:
        start_id: Starting post ID
        end_id: Ending post ID
        min_word_length: Minimum length of words to include (default: 3)
        max_words: Maximum number of words to return (default: 100)
    """
    if start_id > end_id:
        return "Error: start_id must be less than or equal to end_id."

    # Collect posts within the ID range
    selected_posts = []
    for post in posts:
        post_id = post.get("post_metadata", {}).get("id", 0)
~~~

### MV-CL-e3041adff7e5 `jkingsman_qanon-mcp-server` / `word_cloud_by_date_range`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-e3041adff7e5` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/research/jkingsman_qanon-mcp-server_4cd5909_python/src/qanon_mcp/__init__.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/jkingsman_qanon-mcp-server/src/qanon_mcp/__init__.py` |
| Tool name | `word_cloud_by_date_range` -> `word_cloud_by_date_range` |
| Original location | `research/jkingsman_qanon-mcp-server_4cd5909_python/src/qanon_mcp/__init__.py:824` |
| Mutation location | `Credential Leakage/jkingsman_qanon-mcp-server/src/qanon_mcp/__init__.py:848--849` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `start_date` |
| Canary | `2507a71159` |

#### Original Source Context

Lines 830--842 from the reference file:

~~~python
    Args:
        start_date: Start date in YYYY-MM-DD format
        end_date: End date in YYYY-MM-DD format
        min_word_length: Minimum length of words to include (default: 3)
        max_words: Maximum number of words to return (default: 100)
    """
    try:
        # Validate date format
        start_timestamp = int(datetime.strptime(start_date, "%Y-%m-%d").timestamp())
        end_timestamp = (
            int(datetime.strptime(end_date, "%Y-%m-%d").timestamp()) + 86400
        )  # Add a day in seconds
    except ValueError:
~~~

### MV-CL-3d1ef90b65ce `kyanitelabs-kinocut` / `video_luma_key`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-3d1ef90b65ce` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/kyanitelabs-kinocut_8b36f61_python/KyaniteLabs-kinocut-8b36f61/kinocut/server_tools_advanced.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/kyanitelabs-kinocut/KyaniteLabs-kinocut-8b36f61/kinocut/server_tools_advanced.py` |
| Tool name | `video_luma_key` -> `video_luma_key` |
| Original location | `Other_Tools_and_Integrations/kyanitelabs-kinocut_8b36f61_python/KyaniteLabs-kinocut-8b36f61/kinocut/server_tools_advanced.py:117` |
| Mutation location | `Credential Leakage/kyanitelabs-kinocut/KyaniteLabs-kinocut-8b36f61/kinocut/server_tools_advanced.py:130--131` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `input_path` |
| Canary | `d864f5a1d8` |

#### Original Source Context

Lines 124--136 from the reference file:

~~~python
    Args:
        input_path: Absolute path to the input video.
        threshold: Luminance threshold (0.0-1.0). Pixels darker than this
            become transparent.
        output_path: Where to save the output. Auto-generated if omitted.
    """
    input_path = _validate_input_path(input_path)
    return _result(luma_key(input_path, threshold=threshold, output_path=output_path))


@mcp.tool()
@_safe_tool
def video_shape_mask(
~~~

### MV-CL-94b91c014273 `kyanitelabs-kinocut` / `video_chroma_key`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-94b91c014273` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/kyanitelabs-kinocut_8b36f61_python/KyaniteLabs-kinocut-8b36f61/kinocut/server_tools_advanced.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/kyanitelabs-kinocut/KyaniteLabs-kinocut-8b36f61/kinocut/server_tools_advanced.py` |
| Tool name | `video_chroma_key` -> `video_chroma_key` |
| Original location | `Other_Tools_and_Integrations/kyanitelabs-kinocut_8b36f61_python/KyaniteLabs-kinocut-8b36f61/kinocut/server_tools_advanced.py:209` |
| Mutation location | `Credential Leakage/kyanitelabs-kinocut/KyaniteLabs-kinocut-8b36f61/kinocut/server_tools_advanced.py:227--228` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `input_path` |
| Canary | `8743fd92d3` |

#### Original Source Context

Lines 219--231 from the reference file:

~~~python
        input_path: Absolute path to the input video.
        color: Color to make transparent in hex format (default green: 0x00FF00).
        similarity: How similar colors need to be to be keyed out (0.0-1.0, default 0.01).
        blend: How much to blend the keyed color (default 0.0).
        output_path: Where to save the output. Auto-generated if omitted.
    """
    input_path = _validate_input_path(input_path)
    _validate_chroma_color(color)
    if not 0 <= similarity <= 1:
        return _validation_error(f"similarity must be between 0 and 1, got {similarity}")
    if not 0 <= blend <= 1:
        return _validation_error(f"blend must be between 0 and 1, got {blend}")
    return _result(chroma_key(input_path, color=color, similarity=similarity, blend=blend, output_path=output_path))
~~~

### MV-CL-93bbc09914ab `kyanitelabs-kinocut` / `glitch_point_cloud`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-93bbc09914ab` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/kyanitelabs-kinocut_8b36f61_python/KyaniteLabs-kinocut-8b36f61/kinocut/server_tools_glitch_shader.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/kyanitelabs-kinocut/KyaniteLabs-kinocut-8b36f61/kinocut/server_tools_glitch_shader.py` |
| Tool name | `glitch_point_cloud` -> `glitch_point_cloud` |
| Original location | `Other_Tools_and_Integrations/kyanitelabs-kinocut_8b36f61_python/KyaniteLabs-kinocut-8b36f61/kinocut/server_tools_glitch_shader.py:150` |
| Mutation location | `Credential Leakage/kyanitelabs-kinocut/KyaniteLabs-kinocut-8b36f61/kinocut/server_tools_glitch_shader.py:174--175` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `input_path` |
| Canary | `6ad9f2c605` |

#### Original Source Context

Lines 168--180 from the reference file:

~~~python
        rotation: 3D rotation angle in degrees. Default 0.0.
        depth: Depth displacement intensity. Default 1.0.

    Returns:
        Dict with success status and output_path.
    """
    input_path = _validate_input_path(input_path)
    if not (0.0 <= density <= 1.0):
        raise MCPVideoError(
            f"density must be between 0.0 and 1.0, got {density}",
            error_type="validation_error",
            code="invalid_parameter",
        )
~~~

### MV-CL-81de285dfdc0 `kyanitelabs-kinocut` / `hyperframes_remove_background`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-81de285dfdc0` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/kyanitelabs-kinocut_8b36f61_python/KyaniteLabs-kinocut-8b36f61/kinocut/server_tools_hyperframes.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/kyanitelabs-kinocut/KyaniteLabs-kinocut-8b36f61/kinocut/server_tools_hyperframes.py` |
| Tool name | `hyperframes_remove_background` -> `hyperframes_remove_background` |
| Original location | `Other_Tools_and_Integrations/kyanitelabs-kinocut_8b36f61_python/KyaniteLabs-kinocut-8b36f61/kinocut/server_tools_hyperframes.py:342` |
| Mutation location | `Credential Leakage/kyanitelabs-kinocut/KyaniteLabs-kinocut-8b36f61/kinocut/server_tools_hyperframes.py:363--364` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `input_path` |
| Canary | `1e6b603370` |

#### Original Source Context

Lines 357--369 from the reference file:

~~~python
    For products, packaging, jewelry, bottles, ceramics, or any non-person
    object, pass ``model="birefnet-general"`` (requires
    ``pip install "kinocut[object-matte]"``). Never falls through to the
    people model. Call ``info=True`` with no input to list models and cache
    without downloading. Guide: docs/PRODUCT_MATTE.md.
    """
    if device not in {"auto", "cpu", "coreml", "cuda"}:
        return _validation_error("device must be one of auto, cpu, coreml, cuda")
    if quality not in {"fast", "balanced", "best"}:
        return _validation_error("quality must be one of fast, balanced, best")
    from .hyperframes_engine import remove_background

    return _result(
~~~

### MV-CL-fb69cf8d0db2 `kyanitelabs-kinocut` / `video_recipe_capture`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-fb69cf8d0db2` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/kyanitelabs-kinocut_8b36f61_python/KyaniteLabs-kinocut-8b36f61/kinocut/server_tools_release.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/kyanitelabs-kinocut/KyaniteLabs-kinocut-8b36f61/kinocut/server_tools_release.py` |
| Tool name | `video_recipe_capture` -> `video_recipe_capture` |
| Original location | `Other_Tools_and_Integrations/kyanitelabs-kinocut_8b36f61_python/KyaniteLabs-kinocut-8b36f61/kinocut/server_tools_release.py:76` |
| Mutation location | `Credential Leakage/kyanitelabs-kinocut/KyaniteLabs-kinocut-8b36f61/kinocut/server_tools_release.py:79--80` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `project_dir` |
| Canary | `c4850a5519` |

#### Original Source Context

Lines 73--85 from the reference file:

~~~python

@mcp.tool()
@_safe_tool
def video_recipe_capture(project_dir: str, recipe: dict[str, Any]) -> dict[str, Any]:
    """Capture a workflow recipe (writer); idempotent by canonical digest."""

    return _run("recipe_capture", project_dir=project_dir, recipe=recipe)


@mcp.tool()
@_safe_tool
def video_capabilities() -> dict[str, Any]:
    """Probe host capabilities (ffmpeg, whisper, c2pa) and return a capability report."""
~~~

### MV-CL-2cfd803c0eb9 `meilisearch-meilisearch-mcp` / `get_documents`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-2cfd803c0eb9` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/databases/meilisearch-meilisearch-mcp_b764c9f_python/meilisearch-meilisearch-mcp-b764c9f/src/meilisearch_mcp/server.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/meilisearch-meilisearch-mcp/meilisearch-meilisearch-mcp-b764c9f/src/meilisearch_mcp/server.py` |
| Tool name | `get_documents` -> `get_documents` |
| Original location | `databases/meilisearch-meilisearch-mcp_b764c9f_python/meilisearch-meilisearch-mcp-b764c9f/src/meilisearch_mcp/server.py:145` |
| Mutation location | `Credential Leakage/meilisearch-meilisearch-mcp/meilisearch-meilisearch-mcp-b764c9f/src/meilisearch_mcp/server.py:149--150` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `indexUid` |
| Canary | `7b26c9b131` |

#### Original Source Context

Lines 143--155 from the reference file:

~~~python

        @mcp.tool(name="get-documents", annotations=READ_ONLY)
        def get_documents(
            indexUid: str, offset: int = 0, limit: int = 20
        ) -> CallToolResult:
            """Get documents from an index"""
            documents = self.meili_client.documents.get_documents(
                indexUid, offset, limit
            )
            formatted_json = json.dumps(documents, indent=2, default=json_serializer)
            return _result(f"Documents:\n{formatted_json}", documents)

        @mcp.tool(name="add-documents", annotations=WRITE)
~~~

### MV-CL-8f80d74f4fb4 `meilisearch-meilisearch-mcp` / `get_tasks`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-8f80d74f4fb4` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/databases/meilisearch-meilisearch-mcp_b764c9f_python/meilisearch-meilisearch-mcp-b764c9f/src/meilisearch_mcp/server.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/meilisearch-meilisearch-mcp/meilisearch-meilisearch-mcp-b764c9f/src/meilisearch_mcp/server.py` |
| Tool name | `get_tasks` -> `get_tasks` |
| Original location | `databases/meilisearch-meilisearch-mcp_b764c9f_python/meilisearch-meilisearch-mcp-b764c9f/src/meilisearch_mcp/server.py:213` |
| Mutation location | `Credential Leakage/meilisearch-meilisearch-mcp/meilisearch-meilisearch-mcp-b764c9f/src/meilisearch_mcp/server.py:233--234` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `limit` |
| Canary | `b223092946` |

#### Original Source Context

Lines 225--237 from the reference file:

~~~python
            afterStartedAt: Optional[str] = None,
            beforeStartedAt: Optional[str] = None,
            afterFinishedAt: Optional[str] = None,
            beforeFinishedAt: Optional[str] = None,
        ) -> CallToolResult:
            """Get list of tasks with optional filters"""
            params = {
                "limit": limit,
                "from": from_,
                "reverse": reverse,
                "batchUids": batchUids,
                "uids": uids,
                "canceledBy": canceledBy,
~~~

### MV-CL-27c4d08c8567 `meilisearch-meilisearch-mcp` / `get_keys`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-27c4d08c8567` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/databases/meilisearch-meilisearch-mcp_b764c9f_python/meilisearch-meilisearch-mcp-b764c9f/src/meilisearch_mcp/server.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/meilisearch-meilisearch-mcp/meilisearch-meilisearch-mcp-b764c9f/src/meilisearch_mcp/server.py` |
| Tool name | `get_keys` -> `get_keys` |
| Original location | `databases/meilisearch-meilisearch-mcp_b764c9f_python/meilisearch-meilisearch-mcp-b764c9f/src/meilisearch_mcp/server.py:271` |
| Mutation location | `Credential Leakage/meilisearch-meilisearch-mcp/meilisearch-meilisearch-mcp-b764c9f/src/meilisearch_mcp/server.py:279--280` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `offset` |
| Canary | `f356a0db5e` |

#### Original Source Context

Lines 269--281 from the reference file:

~~~python

        @mcp.tool(name="get-keys", annotations=READ_ONLY)
        def get_keys(
            offset: Optional[int] = None, limit: Optional[int] = None
        ) -> CallToolResult:
            """Get list of API keys"""
            params = {"offset": offset, "limit": limit}
            filtered = {k: v for k, v in params.items() if v is not None}
            keys = self.meili_client.keys.get_keys(filtered)
            return _result(f"API keys: {keys}", keys)

        @mcp.tool(name="create-key", annotations=WRITE)
        def create_key(
~~~

### MV-CL-cda91f8a427f `meilisearch-meilisearch-mcp` / `create_key`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-cda91f8a427f` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/databases/meilisearch-meilisearch-mcp_b764c9f_python/meilisearch-meilisearch-mcp-b764c9f/src/meilisearch_mcp/server.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/meilisearch-meilisearch-mcp/meilisearch-meilisearch-mcp-b764c9f/src/meilisearch_mcp/server.py` |
| Tool name | `create_key` -> `create_key` |
| Original location | `databases/meilisearch-meilisearch-mcp_b764c9f_python/meilisearch-meilisearch-mcp-b764c9f/src/meilisearch_mcp/server.py:281` |
| Mutation location | `Credential Leakage/meilisearch-meilisearch-mcp/meilisearch-meilisearch-mcp-b764c9f/src/meilisearch_mcp/server.py:294--295` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `actions` |
| Canary | `d7d9665296` |

#### Original Source Context

Lines 282--294 from the reference file:

~~~python
            actions: List[str],
            indexes: List[str],
            description: Optional[str] = None,
            expiresAt: Optional[str] = None,
        ) -> CallToolResult:
            """Create a new API key"""
            key = self.meili_client.keys.create_key(
                {
                    "description": description,
                    "actions": actions,
                    "indexes": indexes,
                    "expiresAt": expiresAt,
                }
~~~

### MV-CL-51d81e0f7b28 `meilisearch-meilisearch-mcp` / `delete_key`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-51d81e0f7b28` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/databases/meilisearch-meilisearch-mcp_b764c9f_python/meilisearch-meilisearch-mcp-b764c9f/src/meilisearch_mcp/server.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/meilisearch-meilisearch-mcp/meilisearch-meilisearch-mcp-b764c9f/src/meilisearch_mcp/server.py` |
| Tool name | `delete_key` -> `delete_key` |
| Original location | `databases/meilisearch-meilisearch-mcp_b764c9f_python/meilisearch-meilisearch-mcp-b764c9f/src/meilisearch_mcp/server.py:299` |
| Mutation location | `Credential Leakage/meilisearch-meilisearch-mcp/meilisearch-meilisearch-mcp-b764c9f/src/meilisearch_mcp/server.py:309--310` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `key` |
| Canary | `881a436e52` |

#### Original Source Context

Lines 295--307 from the reference file:

~~~python
            )
            return _result(f"Created API key: {key}", key)

        @mcp.tool(name="delete-key", annotations=DESTRUCTIVE)
        def delete_key(key: str) -> CallToolResult:
            """Delete an API key"""
            self.meili_client.keys.delete_key(key)
            return _result(f"Successfully deleted API key: {key}")

        @mcp.tool(name="get-health-status", annotations=READ_ONLY)
        def get_health_status() -> CallToolResult:
            """Get comprehensive health status of Meilisearch"""
            status = self.meili_client.monitoring.get_health_status()
~~~

### MV-CL-b59fa22e006a `meilisearch-meilisearch-mcp` / `update_chat_workspace_settings`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-b59fa22e006a` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/databases/meilisearch-meilisearch-mcp_b764c9f_python/meilisearch-meilisearch-mcp-b764c9f/src/meilisearch_mcp/server.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/meilisearch-meilisearch-mcp/meilisearch-meilisearch-mcp-b764c9f/src/meilisearch_mcp/server.py` |
| Tool name | `update_chat_workspace_settings` -> `update_chat_workspace_settings` |
| Original location | `databases/meilisearch-meilisearch-mcp_b764c9f_python/meilisearch-meilisearch-mcp-b764c9f/src/meilisearch_mcp/server.py:385` |
| Mutation location | `Credential Leakage/meilisearch-meilisearch-mcp/meilisearch-meilisearch-mcp-b764c9f/src/meilisearch_mcp/server.py:404--405` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `workspace_uid` |
| Canary | `f8c0ecf015` |

#### Original Source Context

Lines 388--400 from the reference file:

~~~python
            ),
            settings: Dict[str, Any] = Field(
                description="Settings to update for the workspace"
            ),
        ) -> CallToolResult:
            """Update settings for a specific chat workspace"""
            updated_settings = await self.chat_manager.update_chat_workspace_settings(
                workspace_uid=workspace_uid, settings=settings
            )
            formatted_json = json.dumps(
                updated_settings, indent=2, default=json_serializer
            )
            return _result(
~~~

### MV-CL-269ddf8fe10a `nictuku-meta-ads-mcp` / `get_ad_accounts`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-269ddf8fe10a` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/nictuku-meta-ads-mcp_63d0e5e_python/pipeboard-co-meta-ads-mcp-63d0e5e/meta_ads_mcp/core/accounts.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/nictuku-meta-ads-mcp/pipeboard-co-meta-ads-mcp-63d0e5e/meta_ads_mcp/core/accounts.py` |
| Tool name | `get_ad_accounts` -> `get_ad_accounts` |
| Original location | `Other_Tools_and_Integrations/nictuku-meta-ads-mcp_63d0e5e_python/pipeboard-co-meta-ads-mcp-63d0e5e/meta_ads_mcp/core/accounts.py:44` |
| Mutation location | `Credential Leakage/nictuku-meta-ads-mcp/pipeboard-co-meta-ads-mcp-63d0e5e/meta_ads_mcp/core/accounts.py:56--57` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `access_token` |
| Canary | `a9b8afd97e` |

#### Original Source Context

Lines 50--62 from the reference file:

~~~python

    Args:
        access_token: Meta API access token (optional - will use cached token if not provided)
        user_id: Meta user ID or "me" for the current user
        limit: Maximum number of accounts to return (default: 200)
    """
    endpoint = f"{user_id}/adaccounts"
    params = {
        "fields": "id,name,account_id,account_status,amount_spent,balance,currency,age,business_city,business_country_code",
        "limit": limit
    }

    data = await make_api_request(endpoint, access_token, params)
~~~

### MV-CL-0115356736e6 `nictuku-meta-ads-mcp` / `get_account_info`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-0115356736e6` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/nictuku-meta-ads-mcp_63d0e5e_python/pipeboard-co-meta-ads-mcp-63d0e5e/meta_ads_mcp/core/accounts.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/nictuku-meta-ads-mcp/pipeboard-co-meta-ads-mcp-63d0e5e/meta_ads_mcp/core/accounts.py` |
| Tool name | `get_account_info` -> `get_account_info` |
| Original location | `Other_Tools_and_Integrations/nictuku-meta-ads-mcp_63d0e5e_python/pipeboard-co-meta-ads-mcp-63d0e5e/meta_ads_mcp/core/accounts.py:78` |
| Mutation location | `Credential Leakage/nictuku-meta-ads-mcp/pipeboard-co-meta-ads-mcp-63d0e5e/meta_ads_mcp/core/accounts.py:99--100` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `account_id` |
| Canary | `5745561ada` |

#### Original Source Context

Lines 91--103 from the reference file:

~~~python
                age, business_city, business_country_code, timezone_name.
                For prepaid accounts (is_prepay_account=true, common in Brazil), the
                Business Manager "available balance" is the sum of funding_source_details
                STORED_BALANCE entries plus coupons — the `balance` field alone is the
                amount due to be billed, not the available pre-paid funds.
    """
    if not account_id:
        return {
            "error": {
                "message": "Account ID is required",
                "details": "Please specify an account_id parameter",
                "example": "Use account_id='act_123456789' or account_id='123456789'"
            }
~~~

### MV-CL-f2982842672a `nictuku-meta-ads-mcp` / `save_ad_image_locally`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-f2982842672a` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/nictuku-meta-ads-mcp_63d0e5e_python/pipeboard-co-meta-ads-mcp-63d0e5e/meta_ads_mcp/core/ads.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/nictuku-meta-ads-mcp/pipeboard-co-meta-ads-mcp-63d0e5e/meta_ads_mcp/core/ads.py` |
| Tool name | `save_ad_image_locally` -> `save_ad_image_locally` |
| Original location | `Other_Tools_and_Integrations/nictuku-meta-ads-mcp_63d0e5e_python/pipeboard-co-meta-ads-mcp-63d0e5e/meta_ads_mcp/core/ads.py:1156` |
| Mutation location | `Credential Leakage/nictuku-meta-ads-mcp/pipeboard-co-meta-ads-mcp-63d0e5e/meta_ads_mcp/core/ads.py:1168--1169` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `ad_id` |
| Canary | `9175b1728c` |

#### Original Source Context

Lines 1162--1174 from the reference file:

~~~python
            access_token: Meta API access token (optional - will use cached token if not provided)
            output_dir: Directory to save the image file (default: 'ad_images')
        
        Returns:
            The file path to the saved image, or an error message string.
        """
        if not ad_id:
            return json.dumps({"error": "No ad ID provided"}, indent=2)
            
        print(f"Attempting to get and save creative image for ad {ad_id}")
        
        # First, get creative and account IDs
        ad_endpoint = f"{ad_id}"
~~~

### MV-CL-08833f6ae515 `nictuku-meta-ads-mcp` / `get_account_pages`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-08833f6ae515` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/nictuku-meta-ads-mcp_63d0e5e_python/pipeboard-co-meta-ads-mcp-63d0e5e/meta_ads_mcp/core/ads.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/nictuku-meta-ads-mcp/pipeboard-co-meta-ads-mcp-63d0e5e/meta_ads_mcp/core/ads.py` |
| Tool name | `get_account_pages` -> `get_account_pages` |
| Original location | `Other_Tools_and_Integrations/nictuku-meta-ads-mcp_63d0e5e_python/pipeboard-co-meta-ads-mcp-63d0e5e/meta_ads_mcp/core/ads.py:3376` |
| Mutation location | `Credential Leakage/nictuku-meta-ads-mcp/pipeboard-co-meta-ads-mcp-63d0e5e/meta_ads_mcp/core/ads.py:3390--3391` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `account_id` |
| Canary | `7996f03e9f` |

#### Original Source Context

Lines 3382--3394 from the reference file:

~~~python
        access_token: Meta API access token (optional - will use cached token if not provided)
    
    Returns:
        JSON response with pages associated with the account
    """
    # Check required parameters
    if not account_id:
        return json.dumps({"error": "No account ID provided"}, indent=2)
    
    # Handle special case for 'me'
    if account_id == "me":
        try:
            endpoint = "me/accounts"
~~~

### MV-CL-fa62de072ce6 `nictuku-meta-ads-mcp` / `get_adset_details`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-fa62de072ce6` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/nictuku-meta-ads-mcp_63d0e5e_python/pipeboard-co-meta-ads-mcp-63d0e5e/meta_ads_mcp/core/adsets.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/nictuku-meta-ads-mcp/pipeboard-co-meta-ads-mcp-63d0e5e/meta_ads_mcp/core/adsets.py` |
| Tool name | `get_adset_details` -> `get_adset_details` |
| Original location | `Other_Tools_and_Integrations/nictuku-meta-ads-mcp_63d0e5e_python/pipeboard-co-meta-ads-mcp-63d0e5e/meta_ads_mcp/core/adsets.py:52` |
| Mutation location | `Credential Leakage/nictuku-meta-ads-mcp/pipeboard-co-meta-ads-mcp-63d0e5e/meta_ads_mcp/core/adsets.py:66--67` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `adset_id` |
| Canary | `df96f97d37` |

#### Original Source Context

Lines 60--72 from the reference file:

~~~python
    Example:
        To call this function through MCP, pass the adset_id as the first argument:
        {
            "args": "YOUR_ADSET_ID"
        }
    """
    if not adset_id:
        return json.dumps({"error": "No ad set ID provided"}, indent=2)
    
    endpoint = f"{adset_id}"
    # Explicitly prioritize frequency_control_specs in the fields request
    params = {
        "fields": "id,name,campaign_id,status,frequency_control_specs{event,interval_days,max_frequency},daily_budget,lifetime_budget,targeting,bid_amount,bid_adjustments,bid_strategy,bid_constraints,optimization_goal,billing_event,start_time,end_time,created_time,updated_time,attribution_spec,destination_type,promoted_object,pacing_type,budget_remaining,dsa_beneficiary,dsa_payor,is_dynamic_creative,regional_regulated_categories,regional_regulation_identities"
~~~

### MV-CL-85f305565071 `nictuku-meta-ads-mcp` / `create_adset`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-85f305565071` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/nictuku-meta-ads-mcp_63d0e5e_python/pipeboard-co-meta-ads-mcp-63d0e5e/meta_ads_mcp/core/adsets.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/nictuku-meta-ads-mcp/pipeboard-co-meta-ads-mcp-63d0e5e/meta_ads_mcp/core/adsets.py` |
| Tool name | `create_adset` -> `create_adset` |
| Original location | `Other_Tools_and_Integrations/nictuku-meta-ads-mcp_63d0e5e_python/pipeboard-co-meta-ads-mcp-63d0e5e/meta_ads_mcp/core/adsets.py:88` |
| Mutation location | `Credential Leakage/nictuku-meta-ads-mcp/pipeboard-co-meta-ads-mcp-63d0e5e/meta_ads_mcp/core/adsets.py:225--226` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `account_id` |
| Canary | `31266958ca` |

#### Original Source Context

Lines 217--229 from the reference file:

~~~python
                         Example for 1-day click + 1-day view: [{"event_type": "CLICK_THROUGH", "window_days": 1}, {"event_type": "VIEW_THROUGH", "window_days": 1}]
                         Valid event_type values: CLICK_THROUGH, VIEW_THROUGH.
                         Valid window_days values: 1, 7, 28 (depends on event_type and optimization_goal).
        access_token: Meta API access token (optional - will use cached token if not provided)
    """
    # Check required parameters
    if not account_id:
        return json.dumps({"error": "No account ID provided"}, indent=2)

    account_id = ensure_act_prefix(account_id)

    if not campaign_id:
        return json.dumps({"error": "No campaign ID provided"}, indent=2)
~~~

### MV-CL-72ba7cf58e52 `nictuku-meta-ads-mcp` / `search_demographics`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-72ba7cf58e52` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/nictuku-meta-ads-mcp_63d0e5e_python/pipeboard-co-meta-ads-mcp-63d0e5e/meta_ads_mcp/core/targeting.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/nictuku-meta-ads-mcp/pipeboard-co-meta-ads-mcp-63d0e5e/meta_ads_mcp/core/targeting.py` |
| Tool name | `search_demographics` -> `search_demographics` |
| Original location | `Other_Tools_and_Integrations/nictuku-meta-ads-mcp_63d0e5e_python/pipeboard-co-meta-ads-mcp-63d0e5e/meta_ads_mcp/core/targeting.py:488` |
| Mutation location | `Credential Leakage/nictuku-meta-ads-mcp/pipeboard-co-meta-ads-mcp-63d0e5e/meta_ads_mcp/core/targeting.py:501--502` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `access_token` |
| Canary | `3ae9154ab8` |

#### Original Source Context

Lines 495--507 from the reference file:

~~~python
                          'industries', 'income', 'family_statuses', 'user_device', 'user_os' (default: 'demographics')
        limit: Maximum number of results to return (default: 50)
    
    Returns:
        JSON string containing demographic targeting options with id, name, audience_size bounds, path, and description
    """
    endpoint = "search"
    params = {
        "type": "adTargetingCategory",
        "class": demographic_class,
        "limit": limit
    }
    
~~~

### MV-CL-a222d7e089fb `pipeboard-co_meta-ads-mcp` / `get_ad_accounts`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-a222d7e089fb` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Marketing/pipeboard-co_meta-ads-mcp_1cfc606_python/meta_ads_mcp/core/accounts.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/pipeboard-co_meta-ads-mcp/meta_ads_mcp/core/accounts.py` |
| Tool name | `get_ad_accounts` -> `get_ad_accounts` |
| Original location | `Marketing/pipeboard-co_meta-ads-mcp_1cfc606_python/meta_ads_mcp/core/accounts.py:44` |
| Mutation location | `Credential Leakage/pipeboard-co_meta-ads-mcp/meta_ads_mcp/core/accounts.py:56--57` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `access_token` |
| Canary | `448b99ad3f` |

#### Original Source Context

Lines 50--62 from the reference file:

~~~python

    Args:
        access_token: Meta API access token (optional - will use cached token if not provided)
        user_id: Meta user ID or "me" for the current user
        limit: Maximum number of accounts to return (default: 200)
    """
    endpoint = f"{user_id}/adaccounts"
    params = {
        "fields": "id,name,account_id,account_status,amount_spent,balance,currency,age,business_city,business_country_code",
        "limit": limit
    }

    data = await make_api_request(endpoint, access_token, params)
~~~

### MV-CL-008728ee1aaf `pipeboard-co_meta-ads-mcp` / `get_account_info`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-008728ee1aaf` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Marketing/pipeboard-co_meta-ads-mcp_1cfc606_python/meta_ads_mcp/core/accounts.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/pipeboard-co_meta-ads-mcp/meta_ads_mcp/core/accounts.py` |
| Tool name | `get_account_info` -> `get_account_info` |
| Original location | `Marketing/pipeboard-co_meta-ads-mcp_1cfc606_python/meta_ads_mcp/core/accounts.py:72` |
| Mutation location | `Credential Leakage/pipeboard-co_meta-ads-mcp/meta_ads_mcp/core/accounts.py:82--83` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `account_id` |
| Canary | `fe362ee5d2` |

#### Original Source Context

Lines 74--86 from the reference file:

~~~python
    Get detailed information about a specific ad account.
    
    Args:
        account_id: Meta Ads account ID (format: act_XXXXXXXXX)
        access_token: Meta API access token (optional - will use cached token if not provided)
    """
    if not account_id:
        return {
            "error": {
                "message": "Account ID is required",
                "details": "Please specify an account_id parameter",
                "example": "Use account_id='act_123456789' or account_id='123456789'"
            }
~~~

### MV-CL-e3de7f39f7bd `pipeboard-co_meta-ads-mcp` / `get_account_pages`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-e3de7f39f7bd` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Marketing/pipeboard-co_meta-ads-mcp_1cfc606_python/meta_ads_mcp/core/ads.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/pipeboard-co_meta-ads-mcp/meta_ads_mcp/core/ads.py` |
| Tool name | `get_account_pages` -> `get_account_pages` |
| Original location | `Marketing/pipeboard-co_meta-ads-mcp_1cfc606_python/meta_ads_mcp/core/ads.py:2106` |
| Mutation location | `Credential Leakage/pipeboard-co_meta-ads-mcp/meta_ads_mcp/core/ads.py:2118--2119` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `account_id` |
| Canary | `1fd4110fb5` |

#### Original Source Context

Lines 2112--2124 from the reference file:

~~~python
        access_token: Meta API access token (optional - will use cached token if not provided)
    
    Returns:
        JSON response with pages associated with the account
    """
    # Check required parameters
    if not account_id:
        return json.dumps({"error": "No account ID provided"}, indent=2)
    
    # Handle special case for 'me'
    if account_id == "me":
        try:
            endpoint = "me/accounts"
~~~

### MV-CL-0eb8e478c33d `pipeboard-co_meta-ads-mcp` / `get_campaigns`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-0eb8e478c33d` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Marketing/pipeboard-co_meta-ads-mcp_1cfc606_python/meta_ads_mcp/core/campaigns.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/pipeboard-co_meta-ads-mcp/meta_ads_mcp/core/campaigns.py` |
| Tool name | `get_campaigns` -> `get_campaigns` |
| Original location | `Marketing/pipeboard-co_meta-ads-mcp_1cfc606_python/meta_ads_mcp/core/campaigns.py:12` |
| Mutation location | `Credential Leakage/pipeboard-co_meta-ads-mcp/meta_ads_mcp/core/campaigns.py:44--45` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `account_id` |
| Canary | `28f9db1bf2` |

#### Original Source Context

Lines 38--50 from the reference file:

~~~python
                         'OUTCOME_LEADS', 'OUTCOME_SALES', 'OUTCOME_APP_PROMOTION'.
                         Examples: 'OUTCOME_LEADS' or ['OUTCOME_LEADS', 'OUTCOME_SALES'].
                         Leave empty for all objectives.
        after: Pagination cursor to get the next set of results
    """
    # Require explicit account_id
    if not account_id:
        return json.dumps({"error": "No account ID specified"}, indent=2)
    
    endpoint = f"{account_id}/campaigns"
    params = {
        "fields": "id,name,objective,status,daily_budget,lifetime_budget,buying_type,start_time,stop_time,created_time,updated_time,bid_strategy,special_ad_categories",
        "limit": limit
~~~

### MV-CL-fd442695bff3 `pipeboard-co_meta-ads-mcp` / `duplicate_creative`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-fd442695bff3` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Marketing/pipeboard-co_meta-ads-mcp_1cfc606_python/meta_ads_mcp/core/duplication.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/pipeboard-co_meta-ads-mcp/meta_ads_mcp/core/duplication.py` |
| Tool name | `duplicate_creative` -> `duplicate_creative` |
| Original location | `Marketing/pipeboard-co_meta-ads-mcp_1cfc606_python/meta_ads_mcp/core/duplication.py:179` |
| Mutation location | `Credential Leakage/pipeboard-co_meta-ads-mcp/meta_ads_mcp/core/duplication.py:204--205` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `creative_id` |
| Canary | `2afd72c1f4` |

#### Original Source Context

Lines 198--210 from the reference file:

~~~python
            new_primary_text: Override the primary text for the new creative
            new_headline: Override the headline for the new creative
            new_description: Override the description for the new creative
            new_cta_type: Override the call-to-action type for the new creative
            new_destination_url: Override the destination URL for the new creative
        """
        return await _forward_duplication_request(
            "creative",
            creative_id,
            access_token,
            {
                "name_suffix": name_suffix,
                "new_primary_text": new_primary_text,
~~~

### MV-CL-7d6edf025b54 `redis-mcp-redis` / `hexists`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-7d6edf025b54` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/databases/redis-mcp-redis_b814c36_python/redis-mcp-redis-b814c36/src/tools/hash.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/redis-mcp-redis/redis-mcp-redis-b814c36/src/tools/hash.py` |
| Tool name | `hexists` -> `hexists` |
| Original location | `databases/redis-mcp-redis_b814c36_python/redis-mcp-redis-b814c36/src/tools/hash.py:104` |
| Mutation location | `Credential Leakage/redis-mcp-redis/redis-mcp-redis-b814c36/src/tools/hash.py:114--115` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `name` |
| Canary | `bc1c56c85b` |

#### Original Source Context

Lines 108--120 from the reference file:

~~~python
        name: The Redis hash key.
        key: The field name inside the hash.

    Returns:
        True if the field exists, False otherwise.
    """
    try:
        r = RedisConnectionManager.get_connection()
        return r.hexists(name, key)
    except RedisError as e:
        return f"Error checking existence of field '{key}' in hash '{name}': {str(e)}"


~~~

### MV-CL-6cfaeb2a9589 `redis-mcp-redis` / `set_vector_in_hash`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-6cfaeb2a9589` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/databases/redis-mcp-redis_b814c36_python/redis-mcp-redis-b814c36/src/tools/hash.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/redis-mcp-redis/redis-mcp-redis-b814c36/src/tools/hash.py` |
| Tool name | `set_vector_in_hash` -> `set_vector_in_hash` |
| Original location | `databases/redis-mcp-redis_b814c36_python/redis-mcp-redis-b814c36/src/tools/hash.py:122` |
| Mutation location | `Credential Leakage/redis-mcp-redis/redis-mcp-redis-b814c36/src/tools/hash.py:137--138` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `name` |
| Canary | `75cc54586a` |

#### Original Source Context

Lines 129--141 from the reference file:

~~~python
        vector_field: The field name inside the hash. Unless specifically required, use the default field name
        vector: The vector (list of numbers) to store in the hash.

    Returns:
        True if the vector was successfully stored, False otherwise.
    """
    try:
        r = RedisConnectionManager.get_connection()

        # Convert the vector to a NumPy array, then to a binary blob using np.float32
        vector_array = np.array(vector, dtype=np.float32)
        binary_blob = vector_array.tobytes()

~~~

### MV-CL-3542e99fd136 `redis-mcp-redis` / `scan_keys`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-3542e99fd136` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/databases/redis-mcp-redis_b814c36_python/redis-mcp-redis-b814c36/src/tools/misc.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/redis-mcp-redis/redis-mcp-redis-b814c36/src/tools/misc.py` |
| Tool name | `scan_keys` -> `scan_keys` |
| Original location | `databases/redis-mcp-redis_b814c36_python/redis-mcp-redis-b814c36/src/tools/misc.py:109` |
| Mutation location | `Credential Leakage/redis-mcp-redis/redis-mcp-redis-b814c36/src/tools/misc.py:143--144` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `pattern` |
| Canary | `c31035f441` |

#### Original Source Context

Lines 137--149 from the reference file:

~~~python

    Example usage:
        First call: scan_keys("user:*") -> returns cursor=1234, keys=[...], scan_complete=False
        Next call: scan_keys("user:*", cursor=1234) -> continues from where it left off
        Final call: returns cursor=0, scan_complete=True when done
    """
    try:
        r = RedisConnectionManager.get_connection()
        cursor, keys = r.scan(cursor=cursor, match=pattern, count=count)

        # Convert bytes to strings if needed
        decoded_keys = [
            key.decode("utf-8") if isinstance(key, bytes) else key for key in keys
~~~

### MV-CL-7d8accc64bff `redis-mcp-redis` / `scan_all_keys`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-7d8accc64bff` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/databases/redis-mcp-redis_b814c36_python/redis-mcp-redis-b814c36/src/tools/misc.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/redis-mcp-redis/redis-mcp-redis-b814c36/src/tools/misc.py` |
| Tool name | `scan_all_keys` -> `scan_all_keys` |
| Original location | `databases/redis-mcp-redis_b814c36_python/redis-mcp-redis-b814c36/src/tools/misc.py:163` |
| Mutation location | `Credential Leakage/redis-mcp-redis/redis-mcp-redis-b814c36/src/tools/misc.py:184--185` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `pattern` |
| Canary | `770dd5e2e2` |

#### Original Source Context

Lines 176--188 from the reference file:

~~~python
        pattern: Pattern to match keys against (default is "*" for all keys).
        batch_size: Number of keys to scan per iteration (default 100).

    Returns:
        A list of all keys matching the pattern or an error message.
    """
    try:
        r = RedisConnectionManager.get_connection()
        all_keys = []
        cursor = 0

        while True:
            cursor, keys = r.scan(cursor=cursor, match=pattern, count=batch_size)
~~~

### MV-CL-6cedaf2759e7 `redis-mcp-redis` / `get_indexed_keys_number`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-6cedaf2759e7` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/databases/redis-mcp-redis_b814c36_python/redis-mcp-redis-b814c36/src/tools/redis_query_engine.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/redis-mcp-redis/redis-mcp-redis-b814c36/src/tools/redis_query_engine.py` |
| Tool name | `get_indexed_keys_number` -> `get_indexed_keys_number` |
| Original location | `databases/redis-mcp-redis_b814c36_python/redis-mcp-redis-b814c36/src/tools/redis_query_engine.py:47` |
| Mutation location | `Credential Leakage/redis-mcp-redis/redis-mcp-redis-b814c36/src/tools/redis_query_engine.py:56--57` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `index_name` |
| Canary | `028c542c85` |

#### Original Source Context

Lines 50--62 from the reference file:

~~~python
    Args:
        index_name (str): The name of the index to retrieve information about.

    Returns:
        str: Number of indexed keys as a string
    """
    try:
        r = RedisConnectionManager.get_connection()
        total = r.ft(index_name).search(Query("*")).total
        return str(total)
    except RedisError as e:
        return f"Error retrieving number of keys: {str(e)}"

~~~

### MV-CL-6c0d3752e102 `redis-mcp-redis` / `hybrid_search`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-6c0d3752e102` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/databases/redis-mcp-redis_b814c36_python/redis-mcp-redis-b814c36/src/tools/redis_query_engine.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/redis-mcp-redis/redis-mcp-redis-b814c36/src/tools/redis_query_engine.py` |
| Tool name | `hybrid_search` -> `hybrid_search` |
| Original location | `databases/redis-mcp-redis_b814c36_python/redis-mcp-redis-b814c36/src/tools/redis_query_engine.py:153` |
| Mutation location | `Credential Leakage/redis-mcp-redis/redis-mcp-redis-b814c36/src/tools/redis_query_engine.py:190--191` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `query_vector` |
| Canary | `2672bf338b` |

#### Original Source Context

Lines 182--194 from the reference file:

~~~python
        k:                  Number of nearest neighbors to return.
        return_fields:      Additional fields to include in results (optional).

    Returns:
        A list of matched documents with their similarity score, or an error message.
    """
    try:
        r = RedisConnectionManager.get_connection()

        vector_blob = np.array(query_vector, dtype=np.float32).tobytes()

        base_query = (
            f"({filter_expression})=>[KNN {k} @{vector_field} $vec_param AS score]"
~~~

### MV-CL-c8eddb1324af `redis-mcp-redis` / `xrange`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-c8eddb1324af` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/databases/redis-mcp-redis_b814c36_python/redis-mcp-redis-b814c36/src/tools/stream.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/redis-mcp-redis/redis-mcp-redis-b814c36/src/tools/stream.py` |
| Tool name | `xrange` -> `xrange` |
| Original location | `databases/redis-mcp-redis_b814c36_python/redis-mcp-redis-b814c36/src/tools/stream.py:36` |
| Mutation location | `Credential Leakage/redis-mcp-redis/redis-mcp-redis-b814c36/src/tools/stream.py:46--47` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `key` |
| Canary | `dbafb8c3d7` |

#### Original Source Context

Lines 40--52 from the reference file:

~~~python
        key (str): The stream key.
        count (int, optional): Number of entries to retrieve.

    Returns:
        str: The retrieved stream entries or an error message.
    """
    try:
        r = RedisConnectionManager.get_connection()
        entries = r.xrange(key, count=count)
        return str(entries) if entries else f"Stream {key} is empty or does not exist"
    except RedisError as e:
        return f"Error reading from stream {key}: {str(e)}"

~~~

### MV-CL-597093ee8790 `rohitg00_kubectl-mcp-server` / `browser_open_cloud_console`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-597093ee8790` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Cloud_Platforms/rohitg00_kubectl-mcp-server_0b7f773_python/kubectl_mcp_tool/tools/browser.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/rohitg00_kubectl-mcp-server/kubectl_mcp_tool/tools/browser.py` |
| Tool name | `browser_open_cloud_console` -> `browser_open_cloud_console` |
| Original location | `Cloud_Platforms/rohitg00_kubectl-mcp-server_0b7f773_python/kubectl_mcp_tool/tools/browser.py:626` |
| Mutation location | `Credential Leakage/rohitg00_kubectl-mcp-server/kubectl_mcp_tool/tools/browser.py:633--634` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `provider` |
| Canary | `27577c2a8c` |

#### Original Source Context

Lines 627--639 from the reference file:

~~~python
        provider: str,
        resource_type: str = "clusters",
        region: Optional[str] = None,
        project: Optional[str] = None
    ) -> Dict[str, Any]:
        """Open cloud provider Kubernetes console (eks, gke, aks)."""
        urls = {
            "eks": f"https://{region or 'us-east-1'}.console.aws.amazon.com/eks/home?region={region or 'us-east-1'}#/{resource_type}",
            "gke": f"https://console.cloud.google.com/kubernetes/{resource_type}?project={project or '_'}",
            "aks": "https://portal.azure.com/#browse/Microsoft.ContainerService%2FmanagedClusters",
            "do": "https://cloud.digitalocean.com/kubernetes/clusters",
        }
        url = urls.get(provider.lower())
~~~

### MV-CL-d13849280433 `rohitg00_kubectl-mcp-server` / `get_service_accounts`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-d13849280433` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Cloud_Platforms/rohitg00_kubectl-mcp-server_0b7f773_python/kubectl_mcp_tool/tools/core.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/rohitg00_kubectl-mcp-server/kubectl_mcp_tool/tools/core.py` |
| Tool name | `get_service_accounts` -> `get_service_accounts` |
| Original location | `Cloud_Platforms/rohitg00_kubectl-mcp-server_0b7f773_python/kubectl_mcp_tool/tools/core.py:302` |
| Mutation location | `Credential Leakage/rohitg00_kubectl-mcp-server/kubectl_mcp_tool/tools/core.py:312--313` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `namespace` |
| Canary | `4bc2fb66d7` |

#### Original Source Context

Lines 306--318 from the reference file:

~~~python
        """Get service accounts in a namespace or cluster-wide.

        Args:
            namespace: Namespace to list service accounts from (all namespaces if not specified)
            context: Kubernetes context to use (uses current context if not specified)
        """
        try:
            v1 = get_k8s_client(context)

            if namespace:
                sas = v1.list_namespaced_service_account(namespace)
            else:
                sas = v1.list_service_account_for_all_namespaces()
~~~

### MV-CL-9c8017db3318 `rohitg00_kubectl-mcp-server` / `keda_triggerauths_list_tool`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-9c8017db3318` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Cloud_Platforms/rohitg00_kubectl-mcp-server_0b7f773_python/kubectl_mcp_tool/tools/keda.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/rohitg00_kubectl-mcp-server/kubectl_mcp_tool/tools/keda.py` |
| Tool name | `keda_triggerauths_list_tool` -> `keda_triggerauths_list_tool` |
| Original location | `Cloud_Platforms/rohitg00_kubectl-mcp-server_0b7f773_python/kubectl_mcp_tool/tools/keda.py:396` |
| Mutation location | `Credential Leakage/rohitg00_kubectl-mcp-server/kubectl_mcp_tool/tools/keda.py:402--403` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `namespace` |
| Canary | `64f25d7187` |

#### Original Source Context

Lines 396--408 from the reference file:

~~~python
    def keda_triggerauths_list_tool(
        namespace: str = "",
        context: str = "",
        include_cluster: bool = True
    ) -> str:
        """List KEDA TriggerAuthentications and ClusterTriggerAuthentications."""
        return json.dumps(keda_triggerauths_list(namespace, context, include_cluster), indent=2)

    @mcp.tool(annotations=ToolAnnotations(readOnlyHint=True))
    def keda_triggerauth_get_tool(
        name: str,
        namespace: str = "",
        kind: str = "TriggerAuthentication",
~~~

### MV-CL-26d375496e11 `rohitg00_kubectl-mcp-server` / `keda_triggerauth_get_tool`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-26d375496e11` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Cloud_Platforms/rohitg00_kubectl-mcp-server_0b7f773_python/kubectl_mcp_tool/tools/keda.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/rohitg00_kubectl-mcp-server/kubectl_mcp_tool/tools/keda.py` |
| Tool name | `keda_triggerauth_get_tool` -> `keda_triggerauth_get_tool` |
| Original location | `Cloud_Platforms/rohitg00_kubectl-mcp-server_0b7f773_python/kubectl_mcp_tool/tools/keda.py:405` |
| Mutation location | `Credential Leakage/rohitg00_kubectl-mcp-server/kubectl_mcp_tool/tools/keda.py:414--415` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `name` |
| Canary | `8f4aaaf953` |

#### Original Source Context

Lines 406--418 from the reference file:

~~~python
        name: str,
        namespace: str = "",
        kind: str = "TriggerAuthentication",
        context: str = ""
    ) -> str:
        """Get detailed information about a TriggerAuthentication."""
        return json.dumps(keda_triggerauth_get(name, namespace, kind, context), indent=2)

    @mcp.tool(annotations=ToolAnnotations(readOnlyHint=True))
    def keda_hpa_list_tool(
        namespace: str = "",
        context: str = "",
        label_selector: str = ""
~~~

### MV-CL-0c0b3f935971 `rohitg00_kubectl-mcp-server` / `istio_peerauthentications_list_tool`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-0c0b3f935971` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Cloud_Platforms/rohitg00_kubectl-mcp-server_0b7f773_python/kubectl_mcp_tool/tools/kiali.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/rohitg00_kubectl-mcp-server/kubectl_mcp_tool/tools/kiali.py` |
| Tool name | `istio_peerauthentications_list_tool` -> `istio_peerauthentications_list_tool` |
| Original location | `Cloud_Platforms/rohitg00_kubectl-mcp-server_0b7f773_python/kubectl_mcp_tool/tools/kiali.py:571` |
| Mutation location | `Credential Leakage/rohitg00_kubectl-mcp-server/kubectl_mcp_tool/tools/kiali.py:577--578` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `namespace` |
| Canary | `f5b62cd057` |

#### Original Source Context

Lines 571--583 from the reference file:

~~~python
    def istio_peerauthentications_list_tool(
        namespace: str = "",
        context: str = "",
        label_selector: str = ""
    ) -> str:
        """List Istio PeerAuthentication policies."""
        return json.dumps(istio_peerauthentications_list(namespace, context, label_selector), indent=2)

    @mcp.tool(annotations=ToolAnnotations(readOnlyHint=True))
    def istio_authorizationpolicies_list_tool(
        namespace: str = "",
        context: str = "",
        label_selector: str = ""
~~~

### MV-CL-ec8ef940c4ea `rohitg00_kubectl-mcp-server` / `istio_authorizationpolicies_list_tool`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-ec8ef940c4ea` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Cloud_Platforms/rohitg00_kubectl-mcp-server_0b7f773_python/kubectl_mcp_tool/tools/kiali.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/rohitg00_kubectl-mcp-server/kubectl_mcp_tool/tools/kiali.py` |
| Tool name | `istio_authorizationpolicies_list_tool` -> `istio_authorizationpolicies_list_tool` |
| Original location | `Cloud_Platforms/rohitg00_kubectl-mcp-server_0b7f773_python/kubectl_mcp_tool/tools/kiali.py:580` |
| Mutation location | `Credential Leakage/rohitg00_kubectl-mcp-server/kubectl_mcp_tool/tools/kiali.py:588--589` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `namespace` |
| Canary | `47c219e3de` |

#### Original Source Context

Lines 580--592 from the reference file:

~~~python
    def istio_authorizationpolicies_list_tool(
        namespace: str = "",
        context: str = "",
        label_selector: str = ""
    ) -> str:
        """List Istio AuthorizationPolicies."""
        return json.dumps(istio_authorizationpolicies_list(namespace, context, label_selector), indent=2)

    @mcp.tool(annotations=ToolAnnotations(readOnlyHint=True))
    def istio_proxy_status_tool(context: str = "") -> str:
        """Get Istio proxy synchronization status."""
        return json.dumps(istio_proxy_status(context), indent=2)

~~~

### MV-CL-fd8ba9ff8cc8 `tuanle96-mcp-odoo` / `accounting_health_summary`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-fd8ba9ff8cc8` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/tuanle96-mcp-odoo_76ec136_python/erpipe-org-mcp-odoo-76ec136/src/odoo_mcp/tools_accounting.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/tuanle96-mcp-odoo/erpipe-org-mcp-odoo-76ec136/src/odoo_mcp/tools_accounting.py` |
| Tool name | `accounting_health_summary` -> `accounting_health_summary` |
| Original location | `Other_Tools_and_Integrations/tuanle96-mcp-odoo_76ec136_python/erpipe-org-mcp-odoo-76ec136/src/odoo_mcp/tools_accounting.py:108` |
| Mutation location | `Credential Leakage/tuanle96-mcp-odoo/erpipe-org-mcp-odoo-76ec136/src/odoo_mcp/tools_accounting.py:113--114` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `instance` |
| Canary | `74a16e7521` |

#### Original Source Context

Lines 107--119 from the reference file:

~~~python
)
def accounting_health_summary(
    ctx: Context,
    instance: Optional[str] = None,
) -> AccountingHealthSummaryResponse:
    """Quick accounting posture: open AR/AP item counts plus draft invoices."""
    try:
        _, odoo = _resolve_odoo(ctx, instance)
        summary = build_unreconciled_summary(odoo)
        return {"success": True, "tool": "accounting_health_summary", **summary}
    except Exception as e:
        return {
            "success": False,
~~~

### MV-CL-c1f756a824c2 `tuanle96-mcp-odoo` / `search_across_instances`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-c1f756a824c2` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/tuanle96-mcp-odoo_76ec136_python/erpipe-org-mcp-odoo-76ec136/src/odoo_mcp/tools_cross_instance.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/tuanle96-mcp-odoo/erpipe-org-mcp-odoo-76ec136/src/odoo_mcp/tools_cross_instance.py` |
| Tool name | `search_across_instances` -> `search_across_instances` |
| Original location | `Other_Tools_and_Integrations/tuanle96-mcp-odoo_76ec136_python/erpipe-org-mcp-odoo-76ec136/src/odoo_mcp/tools_cross_instance.py:228` |
| Mutation location | `Credential Leakage/tuanle96-mcp-odoo/erpipe-org-mcp-odoo-76ec136/src/odoo_mcp/tools_cross_instance.py:244--245` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `model` |
| Canary | `e478f45d2b` |

#### Original Source Context

Lines 238--250 from the reference file:

~~~python
    `instances`: omit or "all" for every opted-in instance, a list of names,
    or {"tags": ["..."]}. Each instance is queried under its own field ACL;
    one instance being down yields a partial result + `errors` map, never a
    total failure. Read-only. For very large fleets, wrap with
    submit_async_task(operation="search_across_instances").
    """
    try:
        app_context = _app_context(ctx)
        return {
            "tool": "search_across_instances",
            **run_search_across(
                app_context,
                {
~~~

### MV-CL-04c30f52e5a6 `tuanle96-mcp-odoo` / `accounting_health_across_instances`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-04c30f52e5a6` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/tuanle96-mcp-odoo_76ec136_python/erpipe-org-mcp-odoo-76ec136/src/odoo_mcp/tools_cross_instance.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/tuanle96-mcp-odoo/erpipe-org-mcp-odoo-76ec136/src/odoo_mcp/tools_cross_instance.py` |
| Tool name | `accounting_health_across_instances` -> `accounting_health_across_instances` |
| Original location | `Other_Tools_and_Integrations/tuanle96-mcp-odoo_76ec136_python/erpipe-org-mcp-odoo-76ec136/src/odoo_mcp/tools_cross_instance.py:310` |
| Mutation location | `Credential Leakage/tuanle96-mcp-odoo/erpipe-org-mcp-odoo-76ec136/src/odoo_mcp/tools_cross_instance.py:340--341` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `direction` |
| Canary | `905cdf7c48` |

#### Original Source Context

Lines 332--344 from the reference file:

~~~python
    """Aged receivable/payable across every client DB, with combined buckets.

    The anti-Peliqan flagship: ask "which clients have AR over 90 days?" once
    and get per-instance aging plus summed buckets. Read-only; partial
    results on per-instance failure.
    """
    try:
        app_context = _app_context(ctx)
        return {
            "tool": "accounting_health_across_instances",
            **run_accounting_health_across(
                app_context,
                {
~~~

### MV-CL-2771c0b6b556 `tuanle96-mcp-odoo` / `business_pack_report`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-2771c0b6b556` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/tuanle96-mcp-odoo_76ec136_python/erpipe-org-mcp-odoo-76ec136/src/odoo_mcp/tools_diagnostics.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/tuanle96-mcp-odoo/erpipe-org-mcp-odoo-76ec136/src/odoo_mcp/tools_diagnostics.py` |
| Tool name | `business_pack_report` -> `business_pack_report` |
| Original location | `Other_Tools_and_Integrations/tuanle96-mcp-odoo_76ec136_python/erpipe-org-mcp-odoo-76ec136/src/odoo_mcp/tools_diagnostics.py:690` |
| Mutation location | `Credential Leakage/tuanle96-mcp-odoo/erpipe-org-mcp-odoo-76ec136/src/odoo_mcp/tools_diagnostics.py:708--709` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `pack` |
| Canary | `8273e0ed9b` |

#### Original Source Context

Lines 702--714 from the reference file:

~~~python
    instance: Annotated[
        Optional[str],
        Field(description="Optional configured Odoo instance name; uses the default if omitted."),
    ] = None,
) -> Dict[str, Any]:
    """Summarize a domain pack such as sales, crm, inventory, accounting, or hr."""
    try:
        available_models: List[str] | None = None
        installed_modules: List[str] | None = None
        if use_live_metadata:
            _, odoo = _resolve_odoo(ctx, instance)
            models_report = odoo.get_models()
            if "error" not in models_report:
~~~

### MV-CL-156c8fb8a250 `tuanle96-mcp-odoo` / `list_models`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-156c8fb8a250` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/tuanle96-mcp-odoo_76ec136_python/erpipe-org-mcp-odoo-76ec136/src/odoo_mcp/tools_read.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/tuanle96-mcp-odoo/erpipe-org-mcp-odoo-76ec136/src/odoo_mcp/tools_read.py` |
| Tool name | `list_models` -> `list_models` |
| Original location | `Other_Tools_and_Integrations/tuanle96-mcp-odoo_76ec136_python/erpipe-org-mcp-odoo-76ec136/src/odoo_mcp/tools_read.py:279` |
| Mutation location | `Credential Leakage/tuanle96-mcp-odoo/erpipe-org-mcp-odoo-76ec136/src/odoo_mcp/tools_read.py:290--291` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `query` |
| Canary | `38cb98753c` |

#### Original Source Context

Lines 284--296 from the reference file:

~~~python
) -> ListModelsResponse:
    """
    List available Odoo model technical names and display names.

    Prefer this read-only tool over execute_method when discovering models.
    """
    try:
        _, odoo = _resolve_odoo(ctx, instance)
        limit = clamp_limit(limit, maximum=500)
        models = odoo.get_models()
        if "error" in models:
            return {"success": False, "error": models["error"]}

~~~

### MV-CL-4967595427bd `tuanle96-mcp-odoo` / `preview_write`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-4967595427bd` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/tuanle96-mcp-odoo_76ec136_python/erpipe-org-mcp-odoo-76ec136/src/odoo_mcp/tools_write.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/tuanle96-mcp-odoo/erpipe-org-mcp-odoo-76ec136/src/odoo_mcp/tools_write.py` |
| Tool name | `preview_write` -> `preview_write` |
| Original location | `Other_Tools_and_Integrations/tuanle96-mcp-odoo_76ec136_python/erpipe-org-mcp-odoo-76ec136/src/odoo_mcp/tools_write.py:206` |
| Mutation location | `Credential Leakage/tuanle96-mcp-odoo/erpipe-org-mcp-odoo-76ec136/src/odoo_mcp/tools_write.py:220--221` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `model` |
| Canary | `8b8bc8f83e` |

#### Original Source Context

Lines 214--226 from the reference file:

~~~python
) -> Dict[str, Any]:
    """Build a canonical approval token for a later approved write.

    Batch create: pass ``values_list`` (one dict per record, max 100) —
    executes as a single atomic Odoo ``create(vals_list)`` call.
    """
    try:
        validate_model_name(model)
        report = build_write_preview_report(
            model=model,
            operation=operation,
            values=values,
            values_list=values_list,
~~~

### MV-CL-4a35b7bb01ae `tuanle96-mcp-odoo` / `execute_approved_write_tool`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-4a35b7bb01ae` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/tuanle96-mcp-odoo_76ec136_python/erpipe-org-mcp-odoo-76ec136/src/odoo_mcp/tools_write.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/tuanle96-mcp-odoo/erpipe-org-mcp-odoo-76ec136/src/odoo_mcp/tools_write.py` |
| Tool name | `execute_approved_write_tool` -> `execute_approved_write_tool` |
| Original location | `Other_Tools_and_Integrations/tuanle96-mcp-odoo_76ec136_python/erpipe-org-mcp-odoo-76ec136/src/odoo_mcp/tools_write.py:364` |
| Mutation location | `Credential Leakage/tuanle96-mcp-odoo/erpipe-org-mcp-odoo-76ec136/src/odoo_mcp/tools_write.py:375--376` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `approval` |
| Canary | `d1f12dc858` |

#### Original Source Context

Lines 367--379 from the reference file:

~~~python
    confirm: bool = False,
    review: Annotated[
        ElicitationResult[WriteConfirmation], Resolve(_resolve_write_confirmation)
    ] = _DIRECT_CALL_REVIEW,  # type: ignore[assignment]
) -> Dict[str, Any]:
    """Tool entry point: era-portable human confirmation, then the sync gates."""
    if review is _DIRECT_CALL_REVIEW:
        # Direct Python callers bypass MCP dependency resolution.
        decision, detail = await _elicit_write_confirmation(ctx, approval)
    else:
        data = getattr(review, "data", None)
        approved = (
            getattr(review, "action", None) == "accept"
~~~

### MV-CL-24a016aae26d `volcengine-mcp-server` / `describe_hot_keys`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-24a016aae26d` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/volcengine-mcp-server_f07458e_python/volcengine-mcp-server-f07458e/server/mcp_server_redis/src/mcp_server_redis/server.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/volcengine-mcp-server/volcengine-mcp-server-f07458e/server/mcp_server_redis/src/mcp_server_redis/server.py` |
| Tool name | `describe_hot_keys` -> `describe_hot_keys` |
| Original location | `Other_Tools_and_Integrations/volcengine-mcp-server_f07458e_python/volcengine-mcp-server-f07458e/server/mcp_server_redis/src/mcp_server_redis/server.py:571` |
| Mutation location | `Credential Leakage/volcengine-mcp-server/volcengine-mcp-server-f07458e/server/mcp_server_redis/src/mcp_server_redis/server.py:599--600` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `instance_id` |
| Canary | `1893c68756` |

#### Original Source Context

Lines 593--605 from the reference file:

~~~python
                                   If not specified, no filtering by data type.
           shard_ids (list[str], optional): The list of shard IDs to filter results.
                                          Maximum 40 shard IDs, separated by commas.
                                          If not specified, no filtering by shard ID.
                                          You can call describe_db_instanceshards to query shard details.
    """
    req = {
        "instance_id": instance_id,
        "page_size": page_size,
        "query_start_time": query_start_time,
        "query_end_time": query_end_time,
        "key_type": key_type,
        "shard_ids": shard_ids
~~~

### MV-CL-1ada0211ee4a `volcengine-mcp-server` / `describe_big_keys`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-1ada0211ee4a` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/volcengine-mcp-server_f07458e_python/volcengine-mcp-server-f07458e/server/mcp_server_redis/src/mcp_server_redis/server.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/volcengine-mcp-server/volcengine-mcp-server-f07458e/server/mcp_server_redis/src/mcp_server_redis/server.py` |
| Tool name | `describe_big_keys` -> `describe_big_keys` |
| Original location | `Other_Tools_and_Integrations/volcengine-mcp-server_f07458e_python/volcengine-mcp-server-f07458e/server/mcp_server_redis/src/mcp_server_redis/server.py:616` |
| Mutation location | `Credential Leakage/volcengine-mcp-server/volcengine-mcp-server-f07458e/server/mcp_server_redis/src/mcp_server_redis/server.py:646--647` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `instance_id` |
| Canary | `df3eebea95` |

#### Original Source Context

Lines 638--650 from the reference file:

~~~python
                                   Values: 'string', 'list', 'set', 'zset', 'hash'
                                   If not specified, no filtering by data type.
           order_by (str, optional): The sorting condition for query results.
                                   Values: 'ValueSize' (sort by memory usage, default),
                                          'ValueLen' (sort by number of elements)
    """
    req = {
        "instance_id": instance_id,
        "page_size": page_size,
        "query_start_time": query_start_time,
        "query_end_time": query_end_time,
        "key_type": key_type,
        "order_by": order_by
~~~

### MV-CL-d9c7f05c5f31 `volcengine-mcp-server` / `list_db_account`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-d9c7f05c5f31` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/volcengine-mcp-server_f07458e_python/volcengine-mcp-server-f07458e/server/mcp_server_redis/src/mcp_server_redis/server.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/volcengine-mcp-server/volcengine-mcp-server-f07458e/server/mcp_server_redis/src/mcp_server_redis/server.py` |
| Tool name | `list_db_account` -> `list_db_account` |
| Original location | `Other_Tools_and_Integrations/volcengine-mcp-server_f07458e_python/volcengine-mcp-server-f07458e/server/mcp_server_redis/src/mcp_server_redis/server.py:861` |
| Mutation location | `Credential Leakage/volcengine-mcp-server/volcengine-mcp-server-f07458e/server/mcp_server_redis/src/mcp_server_redis/server.py:874--875` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `instance_id` |
| Canary | `d1f9d6edcb` |

#### Original Source Context

Lines 864--876 from the reference file:

~~~python
           instance_id (str): The instance ID.
                             You can call describe_db_instances to query basic information
                             of all Redis instances.
           account_name (str, optional): The account name.
                                       If not specified, no filtering by account name.
    """
    req = {
        "instance_id": instance_id,
        "account_name": account_name
    }
    req = {k: v for k, v in req.items() if v is not None}
    resp = redis_resource.list_db_account(req)
    return resp.to_dict()
~~~

### MV-CL-f84a27e1fbd7 `volcengine-mcp-server` / `create_db_account`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-f84a27e1fbd7` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/volcengine-mcp-server_f07458e_python/volcengine-mcp-server-f07458e/server/mcp_server_redis/src/mcp_server_redis/server.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/volcengine-mcp-server/volcengine-mcp-server-f07458e/server/mcp_server_redis/src/mcp_server_redis/server.py` |
| Tool name | `create_db_account` -> `create_db_account` |
| Original location | `Other_Tools_and_Integrations/volcengine-mcp-server_f07458e_python/volcengine-mcp-server-f07458e/server/mcp_server_redis/src/mcp_server_redis/server.py:1129` |
| Mutation location | `Credential Leakage/volcengine-mcp-server/volcengine-mcp-server-f07458e/server/mcp_server_redis/src/mcp_server_redis/server.py:1171--1172` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `instance_id` |
| Canary | `347f598597` |

#### Original Source Context

Lines 1159--1171 from the reference file:

~~~python
                            lowercase letters, numbers, special characters
                          - Supported special characters: ()`~!@#$%^&*-+=_{}[];,.?
           description (str, optional): Account description, max 256 characters.
           client_token (str, optional): Idempotency token, max 127 ASCII chars.
                                       Must be unique between different requests.
    """
    req = {
        "instance_id": instance_id,
        "account_name": account_name,
        "role_name": role_name,
        "password": password,
        "description": description,
        "client_token": client_token
~~~

### MV-CL-a06ad311162e `volcengine-mcp-server` / `describe_key_scan_jobs`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-a06ad311162e` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/Other_Tools_and_Integrations/volcengine-mcp-server_f07458e_python/volcengine-mcp-server-f07458e/server/mcp_server_redis/src/mcp_server_redis/server.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/volcengine-mcp-server/volcengine-mcp-server-f07458e/server/mcp_server_redis/src/mcp_server_redis/server.py` |
| Tool name | `describe_key_scan_jobs` -> `describe_key_scan_jobs` |
| Original location | `Other_Tools_and_Integrations/volcengine-mcp-server_f07458e_python/volcengine-mcp-server-f07458e/server/mcp_server_redis/src/mcp_server_redis/server.py:1812` |
| Mutation location | `Credential Leakage/volcengine-mcp-server/volcengine-mcp-server-f07458e/server/mcp_server_redis/src/mcp_server_redis/server.py:1839--1840` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `instance_id` |
| Canary | `902fcdb01a` |

#### Original Source Context

Lines 1825--1837 from the reference file:

~~~python
           query_end_time (str, optional): End time of the query. Format: yyyy-MM-ddTHH:mm:ssZ (UTC time).
       Note:
           - This API is used to query the key scan jobs of Redis instances.
           - If query_start_time is left empty, it means not filtering by start time.
           - If query_end_time is left empty, it means not filtering by end time.
    """
    req = {
        "instance_id": instance_id,
        "page_size": page_size,
        "page_number": page_number,
        "query_start_time": query_start_time,
        "query_end_time": query_end_time
    }
~~~

### MV-CL-6e4622287d4e `walnashgit_EAGS4-MCP-Server-Client` / `subtract`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-6e4622287d4e` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/math-solver/walnashgit_EAGS4-MCP-Server-Client_61a74c7_python/mcp_server.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/walnashgit_EAGS4-MCP-Server-Client/mcp_server.py` |
| Tool name | `subtract` -> `subtract` |
| Original location | `math-solver/walnashgit_EAGS4-MCP-Server-Client_61a74c7_python/mcp_server.py:36` |
| Mutation location | `Credential Leakage/walnashgit_EAGS4-MCP-Server-Client/mcp_server.py:38--39` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `a` |
| Canary | `47cc97536e` |

#### Original Source Context

Lines 32--44 from the reference file:

~~~python
    return sum(l)

# subtraction tool
@mcp.tool()
def subtract(a: int, b: int) -> int:
    """Subtract two numbers"""
    print("CALLED: subtract(a: int, b: int) -> int:")
    return int(a - b)

# multiplication tool
@mcp.tool()
def multiply(a: int, b: int) -> int:
    """Multiply two numbers"""
~~~

### MV-CL-3dc647040ce4 `walnashgit_EAGS4-MCP-Server-Client` / `tan`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-3dc647040ce4` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/math-solver/walnashgit_EAGS4-MCP-Server-Client_61a74c7_python/mcp_server.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/walnashgit_EAGS4-MCP-Server-Client/mcp_server.py` |
| Tool name | `tan` -> `tan` |
| Original location | `math-solver/walnashgit_EAGS4-MCP-Server-Client_61a74c7_python/mcp_server.py:113` |
| Mutation location | `Credential Leakage/walnashgit_EAGS4-MCP-Server-Client/mcp_server.py:117--118` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `a` |
| Canary | `87dad80225` |

#### Original Source Context

Lines 109--121 from the reference file:

~~~python
    return float(math.cos(a))

# tan tool
@mcp.tool()
def tan(a: int) -> float:
    """tan of a number"""
    print("CALLED: tan(a: int) -> float:")
    return float(math.tan(a))

# mine tool
@mcp.tool()
def mine(a: int, b: int) -> int:
    """special mining tool"""
~~~

### MV-CL-02da1972916d `walnashgit_EAGS4-MCP-Server-Client` / `create_thumbnail`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-02da1972916d` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/math-solver/walnashgit_EAGS4-MCP-Server-Client_61a74c7_python/mcp_server.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/walnashgit_EAGS4-MCP-Server-Client/mcp_server.py` |
| Tool name | `create_thumbnail` -> `create_thumbnail` |
| Original location | `math-solver/walnashgit_EAGS4-MCP-Server-Client_61a74c7_python/mcp_server.py:126` |
| Mutation location | `Credential Leakage/walnashgit_EAGS4-MCP-Server-Client/mcp_server.py:132--133` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `image_path` |
| Canary | `e5a2c39f58` |

#### Original Source Context

Lines 122--134 from the reference file:

~~~python
    print("CALLED: mine(a: int, b: int) -> int:")
    return int(a - b - b)

@mcp.tool()
def create_thumbnail(image_path: str) -> Image:
    """Create a thumbnail from an image"""
    print("CALLED: create_thumbnail(image_path: str) -> Image:")
    img = PILImage.open(image_path)
    img.thumbnail((100, 100))
    return Image(data=img.tobytes(), format="png")

@mcp.tool()
def strings_to_chars_to_int(string: str) -> list[int]:
~~~

### MV-CL-732e16a41463 `walnashgit_EAGS4-MCP-Server-Client` / `draw_rectangle_in_keynote`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-732e16a41463` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/math-solver/walnashgit_EAGS4-MCP-Server-Client_61a74c7_python/mcp_server.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/walnashgit_EAGS4-MCP-Server-Client/mcp_server.py` |
| Tool name | `draw_rectangle_in_keynote` -> `draw_rectangle_in_keynote` |
| Original location | `math-solver/walnashgit_EAGS4-MCP-Server-Client_61a74c7_python/mcp_server.py:178` |
| Mutation location | `Credential Leakage/walnashgit_EAGS4-MCP-Server-Client/mcp_server.py:186--187` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `shapeWidth` |
| Canary | `f9c6f20b68` |

#### Original Source Context

Lines 174--186 from the reference file:

~~~python
    print("Keynote opened and new document created.")
    return True

@mcp.tool()
def draw_rectangle_in_keynote(shapeWidth: int, shapeHeight: int) -> bool:
    """Draws a rectangle in keynote app of the privided size. Returns True if rectangle is drawn successfully, False otherwise."""
    print("CALLED: draw_rectangle_in_keynote(shapeWidth: int, shapeHeight: int) -> bool")
    apple_script = f'''
    tell application "Keynote"
        tell document 1
            set docWidth to its width
            set docHeight to its height
            set x to (docWidth - {{{shapeWidth}}}) div 2
~~~

### MV-CL-c3ee826365a8 `walnashgit_EAGS4-MCP-Server-Client` / `add_text_to_keynote_shape`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-c3ee826365a8` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/math-solver/walnashgit_EAGS4-MCP-Server-Client_61a74c7_python/mcp_server.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/walnashgit_EAGS4-MCP-Server-Client/mcp_server.py` |
| Tool name | `add_text_to_keynote_shape` -> `add_text_to_keynote_shape` |
| Original location | `math-solver/walnashgit_EAGS4-MCP-Server-Client_61a74c7_python/mcp_server.py:203` |
| Mutation location | `Credential Leakage/walnashgit_EAGS4-MCP-Server-Client/mcp_server.py:213--214` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `text` |
| Canary | `da28ad6f01` |

#### Original Source Context

Lines 199--211 from the reference file:

~~~python
    print("Step 2 completed: Rectangle drawn on the slide.")
    return True

@mcp.tool()
def add_text_to_keynote_shape(text: str) -> bool:
    """Adds a text to the shape drawn in keynote. Return True if text was added successfully, False otherwise."""
    print("CALLED: add_text_to_keynote_shape(text: str) -> bool")
    apple_script = f'''
    tell application "Keynote"
        tell document 1
            tell slide 1
                set the object text of the shape 1 to "{text}"
            end tell
~~~

### MV-CL-a36dd3df6e3c `yuzongmin-semantic-scholar-fastmcp-mcp-server` / `author_search`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-a36dd3df6e3c` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/knowledge-and-memory/yuzongmin-semantic-scholar-fastmcp-mcp-server_68e7b06_python/zongmin-yu-semantic-scholar-fastmcp-mcp-server-68e7b06/semantic_scholar/api/authors.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/yuzongmin-semantic-scholar-fastmcp-mcp-server/zongmin-yu-semantic-scholar-fastmcp-mcp-server-68e7b06/semantic_scholar/api/authors.py` |
| Tool name | `author_search` -> `author_search` |
| Original location | `knowledge-and-memory/yuzongmin-semantic-scholar-fastmcp-mcp-server_68e7b06_python/zongmin-yu-semantic-scholar-fastmcp-mcp-server-68e7b06/semantic_scholar/api/authors.py:28` |
| Mutation location | `Credential Leakage/yuzongmin-semantic-scholar-fastmcp-mcp-server/zongmin-yu-semantic-scholar-fastmcp-mcp-server-68e7b06/semantic_scholar/api/authors.py:35--36` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `query` |
| Canary | `7575c592c2` |

#### Original Source Context

Lines 29--41 from the reference file:

~~~python
    context: Context,
    query: str,
    fields: Optional[List[str]] = None,
    offset: int = 0,
    limit: int = 100,
) -> Dict:
    try:
        request = AuthorSearchRequest(
            query=query,
            fields=fields,
            offset=offset,
            limit=limit,
        )
~~~

### MV-CL-264e240379ff `yuzongmin-semantic-scholar-fastmcp-mcp-server` / `author_details`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-264e240379ff` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/knowledge-and-memory/yuzongmin-semantic-scholar-fastmcp-mcp-server_68e7b06_python/zongmin-yu-semantic-scholar-fastmcp-mcp-server-68e7b06/semantic_scholar/api/authors.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/yuzongmin-semantic-scholar-fastmcp-mcp-server/zongmin-yu-semantic-scholar-fastmcp-mcp-server-68e7b06/semantic_scholar/api/authors.py` |
| Tool name | `author_details` -> `author_details` |
| Original location | `knowledge-and-memory/yuzongmin-semantic-scholar-fastmcp-mcp-server_68e7b06_python/zongmin-yu-semantic-scholar-fastmcp-mcp-server-68e7b06/semantic_scholar/api/authors.py:50` |
| Mutation location | `Credential Leakage/yuzongmin-semantic-scholar-fastmcp-mcp-server/zongmin-yu-semantic-scholar-fastmcp-mcp-server-68e7b06/semantic_scholar/api/authors.py:57--58` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `author_id` |
| Canary | `9589955dc2` |

#### Original Source Context

Lines 49--61 from the reference file:

~~~python
@mcp.tool()
async def author_details(
    context: Context,
    author_id: str,
    fields: Optional[List[str]] = None,
) -> Dict:
    try:
        request = AuthorDetailsRequest(author_id=author_id, fields=fields)
        return await _client().get_author(request)
    except S2ValidationError as exc:
        return s2_exception_to_error_response(exc)
    except S2ApiError as exc:
        if "404" in exc.message:
~~~

### MV-CL-b53b252a0713 `yuzongmin-semantic-scholar-fastmcp-mcp-server` / `author_papers`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-b53b252a0713` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/knowledge-and-memory/yuzongmin-semantic-scholar-fastmcp-mcp-server_68e7b06_python/zongmin-yu-semantic-scholar-fastmcp-mcp-server-68e7b06/semantic_scholar/api/authors.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/yuzongmin-semantic-scholar-fastmcp-mcp-server/zongmin-yu-semantic-scholar-fastmcp-mcp-server-68e7b06/semantic_scholar/api/authors.py` |
| Tool name | `author_papers` -> `author_papers` |
| Original location | `knowledge-and-memory/yuzongmin-semantic-scholar-fastmcp-mcp-server_68e7b06_python/zongmin-yu-semantic-scholar-fastmcp-mcp-server-68e7b06/semantic_scholar/api/authors.py:73` |
| Mutation location | `Credential Leakage/yuzongmin-semantic-scholar-fastmcp-mcp-server/zongmin-yu-semantic-scholar-fastmcp-mcp-server-68e7b06/semantic_scholar/api/authors.py:84--85` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `author_id` |
| Canary | `1ca0028986` |

#### Original Source Context

Lines 74--86 from the reference file:

~~~python
    context: Context,
    author_id: str,
    fields: Optional[List[str]] = None,
    offset: int = 0,
    limit: int = 100,
) -> Dict:
    try:
        request = AuthorPapersRequest(
            author_id=author_id,
            fields=fields,
            offset=offset,
            limit=limit,
        )
~~~

### MV-CL-361b6a77c0ba `yuzongmin-semantic-scholar-fastmcp-mcp-server` / `author_batch_details`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-361b6a77c0ba` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/knowledge-and-memory/yuzongmin-semantic-scholar-fastmcp-mcp-server_68e7b06_python/zongmin-yu-semantic-scholar-fastmcp-mcp-server-68e7b06/semantic_scholar/api/authors.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/yuzongmin-semantic-scholar-fastmcp-mcp-server/zongmin-yu-semantic-scholar-fastmcp-mcp-server-68e7b06/semantic_scholar/api/authors.py` |
| Tool name | `author_batch_details` -> `author_batch_details` |
| Original location | `knowledge-and-memory/yuzongmin-semantic-scholar-fastmcp-mcp-server_68e7b06_python/zongmin-yu-semantic-scholar-fastmcp-mcp-server-68e7b06/semantic_scholar/api/authors.py:103` |
| Mutation location | `Credential Leakage/yuzongmin-semantic-scholar-fastmcp-mcp-server/zongmin-yu-semantic-scholar-fastmcp-mcp-server-68e7b06/semantic_scholar/api/authors.py:114--115` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `author_ids` |
| Canary | `cf1deebe48` |

#### Original Source Context

Lines 102--114 from the reference file:

~~~python
@mcp.tool()
async def author_batch_details(
    context: Context,
    author_ids: List[str],
    fields: Optional[str] = None,
) -> Dict:
    try:
        request = AuthorBatchDetailsRequest(author_ids=author_ids, fields=fields)
        return await _client().batch_authors(request)
    except S2ValidationError as exc:
        return s2_exception_to_error_response(exc)
    except S2Error as exc:
        return s2_exception_to_error_response(exc)
~~~

### MV-CL-9fb969e4c98a `yuzongmin-semantic-scholar-fastmcp-mcp-server` / `paper_authors`

#### Basic Information

| Field | Value |
|---|---|
| Record ID | `MV-CL-9fb969e4c98a` |
| Subtype | N/A |
| Language | Python |
| Reference tool | `reference-tools/knowledge-and-memory/yuzongmin-semantic-scholar-fastmcp-mcp-server_68e7b06_python/zongmin-yu-semantic-scholar-fastmcp-mcp-server-68e7b06/semantic_scholar/api/papers.py` |
| Malicious variant tool | `malicious-variant-tools/Credential Leakage/yuzongmin-semantic-scholar-fastmcp-mcp-server/zongmin-yu-semantic-scholar-fastmcp-mcp-server-68e7b06/semantic_scholar/api/papers.py` |
| Tool name | `paper_authors` -> `paper_authors` |
| Original location | `knowledge-and-memory/yuzongmin-semantic-scholar-fastmcp-mcp-server_68e7b06_python/zongmin-yu-semantic-scholar-fastmcp-mcp-server-68e7b06/semantic_scholar/api/papers.py:180` |
| Mutation location | `Credential Leakage/yuzongmin-semantic-scholar-fastmcp-mcp-server/zongmin-yu-semantic-scholar-fastmcp-mcp-server-68e7b06/semantic_scholar/api/papers.py:187--188` |
| Mutation form | safe behavior branch insertion |

| Trigger argument | `paper_id` |
| Canary | `f912422013` |

#### Original Source Context

Lines 181--193 from the reference file:

~~~python
    context: Context,
    paper_id: str,
    fields: Optional[List[str]] = None,
    offset: int = 0,
    limit: int = 100,
) -> Dict:
    try:
        request = PaperAuthorsRequest(
            paper_id=paper_id,
            fields=fields,
            offset=offset,
            limit=limit,
        )
~~~

## Tool Index

| ID | Server | Tool | Language | Reference location | Variant location | Mutation form |
|---|---|---|---|---|---|---|
| `MV-CL-b23c7d6b8892` | Nebula-Block-Data_nebulablock-mcp-server | `get_user_instances` | Python | `Cloud_Platforms/Nebula-Block-Data_nebulablock-mcp-server_2983eb8_python/src/tools.py:61` | `Credential Leakage/Nebula-Block-Data_nebulablock-mcp-server/src/tools.py:64` | safe behavior branch insertion |
| `MV-CL-a872688e4cef` | Nebula-Block-Data_nebulablock-mcp-server | `list_user_invoices` | Python | `Cloud_Platforms/Nebula-Block-Data_nebulablock-mcp-server_2983eb8_python/src/tools.py:90` | `Credential Leakage/Nebula-Block-Data_nebulablock-mcp-server/src/tools.py:95` | safe behavior branch insertion |
| `MV-CL-301b56ddc419` | Nebula-Block-Data_nebulablock-mcp-server | `start_gpu_instance` | Python | `Cloud_Platforms/Nebula-Block-Data_nebulablock-mcp-server_2983eb8_python/src/tools.py:123` | `Credential Leakage/Nebula-Block-Data_nebulablock-mcp-server/src/tools.py:134` | safe behavior branch insertion |
| `MV-CL-b4fa42e4d5c5` | Nebula-Block-Data_nebulablock-mcp-server | `stop_gpu_instance` | Python | `Cloud_Platforms/Nebula-Block-Data_nebulablock-mcp-server_2983eb8_python/src/tools.py:133` | `Credential Leakage/Nebula-Block-Data_nebulablock-mcp-server/src/tools.py:146` | safe behavior branch insertion |
| `MV-CL-394f07cf2f58` | Nebula-Block-Data_nebulablock-mcp-server | `reboot_gpu_instance` | Python | `Cloud_Platforms/Nebula-Block-Data_nebulablock-mcp-server_2983eb8_python/src/tools.py:143` | `Credential Leakage/Nebula-Block-Data_nebulablock-mcp-server/src/tools.py:158` | safe behavior branch insertion |
| `MV-CL-3f86718ac81f` | Nebula-Block-Data_nebulablock-mcp-server | `delete_ssh_key` | Python | `Cloud_Platforms/Nebula-Block-Data_nebulablock-mcp-server_2983eb8_python/src/tools.py:183` | `Credential Leakage/Nebula-Block-Data_nebulablock-mcp-server/src/tools.py:198` | safe behavior branch insertion |
| `MV-CL-e2077a5814c0` | Nebula-Block-Data_nebulablock-mcp-server | `create_ssh_key` | Python | `Cloud_Platforms/Nebula-Block-Data_nebulablock-mcp-server_2983eb8_python/src/tools.py:211` | `Credential Leakage/Nebula-Block-Data_nebulablock-mcp-server/src/tools.py:228` | safe behavior branch insertion |
| `MV-CL-909c61e9694d` | ab498-computer-control-mcp | `take_screenshot_with_ocr` | Python | `Workplace_&_Productivity/ab498-computer-control-mcp_e74cbb1_python/AB498-computer-control-mcp-e74cbb1/src/computer_control_mcp/core.py:608` | `Credential Leakage/ab498-computer-control-mcp/AB498-computer-control-mcp-e74cbb1/src/computer_control_mcp/core.py:628` | safe behavior branch insertion |
| `MV-CL-7018b063edf6` | ab498-computer-control-mcp | `mouse_up` | Python | `Workplace_&_Productivity/ab498-computer-control-mcp_e74cbb1_python/AB498-computer-control-mcp-e74cbb1/src/computer_control_mcp/core.py:773` | `Credential Leakage/ab498-computer-control-mcp/AB498-computer-control-mcp-e74cbb1/src/computer_control_mcp/core.py:777` | safe behavior branch insertion |
| `MV-CL-008ffb5748bf` | ab498-computer-control-mcp | `key_down` | Python | `Workplace_&_Productivity/ab498-computer-control-mcp_e74cbb1_python/AB498-computer-control-mcp-e74cbb1/src/computer_control_mcp/core.py:816` | `Credential Leakage/ab498-computer-control-mcp/AB498-computer-control-mcp-e74cbb1/src/computer_control_mcp/core.py:822` | safe behavior branch insertion |
| `MV-CL-84be5a64ce54` | ab498-computer-control-mcp | `key_up` | Python | `Workplace_&_Productivity/ab498-computer-control-mcp_e74cbb1_python/AB498-computer-control-mcp-e74cbb1/src/computer_control_mcp/core.py:826` | `Credential Leakage/ab498-computer-control-mcp/AB498-computer-control-mcp-e74cbb1/src/computer_control_mcp/core.py:834` | safe behavior branch insertion |
| `MV-CL-ed9151a8c09a` | ab498-computer-control-mcp | `press_keys` | Python | `Workplace_&_Productivity/ab498-computer-control-mcp_e74cbb1_python/AB498-computer-control-mcp-e74cbb1/src/computer_control_mcp/core.py:836` | `Credential Leakage/ab498-computer-control-mcp/AB498-computer-control-mcp-e74cbb1/src/computer_control_mcp/core.py:859` | safe behavior branch insertion |
| `MV-CL-8e1b907ed1f3` | armorwallet-armor-crypto-mcp | `calculate_token_conversion` | Python | `finance/armorwallet-armor-crypto-mcp_c026c00_python/armorwallet-armor-crypto-mcp-c026c00/armor_crypto_mcp/armor_mcp.py:129` | `Credential Leakage/armorwallet-armor-crypto-mcp/armorwallet-armor-crypto-mcp-c026c00/armor_crypto_mcp/armor_mcp.py:135` | safe behavior branch insertion |
| `MV-CL-6cf0561c2206` | armorwallet-armor-crypto-mcp | `search_official_token_address` | Python | `finance/armorwallet-armor-crypto-mcp_c026c00_python/armorwallet-armor-crypto-mcp-c026c00/armor_crypto_mcp/armor_mcp.py:209` | `Credential Leakage/armorwallet-armor-crypto-mcp/armorwallet-armor-crypto-mcp-c026c00/armor_crypto_mcp/armor_mcp.py:218` | safe behavior branch insertion |
| `MV-CL-e56d71b9e93f` | armorwallet-armor-crypto-mcp | `transfer_tokens` | Python | `finance/armorwallet-armor-crypto-mcp_c026c00_python/armorwallet-armor-crypto-mcp-c026c00/armor_crypto_mcp/armor_mcp.py:403` | `Credential Leakage/armorwallet-armor-crypto-mcp/armorwallet-armor-crypto-mcp-c026c00/armor_crypto_mcp/armor_mcp.py:413` | safe behavior branch insertion |
| `MV-CL-8874e0281ff6` | armorwallet-armor-crypto-mcp | `send_key_to_telegram` | Python | `finance/armorwallet-armor-crypto-mcp_c026c00_python/armorwallet-armor-crypto-mcp-c026c00/armor_crypto_mcp/armor_mcp.py:635` | `Credential Leakage/armorwallet-armor-crypto-mcp/armorwallet-armor-crypto-mcp-c026c00/armor_crypto_mcp/armor_mcp.py:645` | safe behavior branch insertion |
| `MV-CL-ba04168a068e` | cbcoutinho-nextcloud-mcp-server | `nc_auth_provision_access` | Python | `Other_Tools_and_Integrations/cbcoutinho-nextcloud-mcp-server_0f44051_python/cbcoutinho-nextcloud-mcp-server-0f44051/nextcloud_mcp_server/server/auth_tools.py:61` | `Credential Leakage/cbcoutinho-nextcloud-mcp-server/cbcoutinho-nextcloud-mcp-server-0f44051/nextcloud_mcp_server/server/auth_tools.py:79` | safe behavior branch insertion |
| `MV-CL-2d2298d1d85d` | cbcoutinho-nextcloud-mcp-server | `nc_auth_update_scopes` | Python | `Other_Tools_and_Integrations/cbcoutinho-nextcloud-mcp-server_0f44051_python/cbcoutinho-nextcloud-mcp-server-0f44051/nextcloud_mcp_server/server/auth_tools.py:430` | `Credential Leakage/cbcoutinho-nextcloud-mcp-server/cbcoutinho-nextcloud-mcp-server-0f44051/nextcloud_mcp_server/server/auth_tools.py:447` | safe behavior branch insertion |
| `MV-CL-0c7a5ce17855` | cbcoutinho-nextcloud-mcp-server | `collectives_get_pages` | Python | `Other_Tools_and_Integrations/cbcoutinho-nextcloud-mcp-server_0f44051_python/cbcoutinho-nextcloud-mcp-server-0f44051/nextcloud_mcp_server/server/collectives.py:79` | `Credential Leakage/cbcoutinho-nextcloud-mcp-server/cbcoutinho-nextcloud-mcp-server-0f44051/nextcloud_mcp_server/server/collectives.py:87` | safe behavior branch insertion |
| `MV-CL-bff9e9d30c32` | cbcoutinho-nextcloud-mcp-server | `nc_share_create_public_link` | Python | `Other_Tools_and_Integrations/cbcoutinho-nextcloud-mcp-server_0f44051_python/cbcoutinho-nextcloud-mcp-server-0f44051/nextcloud_mcp_server/server/sharing.py:168` | `Credential Leakage/cbcoutinho-nextcloud-mcp-server/cbcoutinho-nextcloud-mcp-server-0f44051/nextcloud_mcp_server/server/sharing.py:214` | safe behavior branch insertion |
| `MV-CL-c5f7676b89e5` | cbcoutinho-nextcloud-mcp-server | `nc_shopping_list_delete_list` | Python | `Other_Tools_and_Integrations/cbcoutinho-nextcloud-mcp-server_0f44051_python/cbcoutinho-nextcloud-mcp-server-0f44051/nextcloud_mcp_server/server/shopping_list.py:132` | `Credential Leakage/cbcoutinho-nextcloud-mcp-server/cbcoutinho-nextcloud-mcp-server-0f44051/nextcloud_mcp_server/server/shopping_list.py:136` | safe behavior branch insertion |
| `MV-CL-016e77295eda` | cbuitragoh_customRedis | `set_redis_key` | Python | `developer-tools/cbuitragoh_customRedis_605ebc6_python/src/server.py:56` | `Credential Leakage/cbuitragoh_customRedis/src/server.py:58` | safe behavior branch insertion |
| `MV-CL-1ed7e49bf51f` | cbuitragoh_customRedis | `get_redis_key` | Python | `developer-tools/cbuitragoh_customRedis_605ebc6_python/src/server.py:67` | `Credential Leakage/cbuitragoh_customRedis/src/server.py:71` | safe behavior branch insertion |
| `MV-CL-4fafe33b428d` | cbuitragoh_customRedis | `delete_redis_key` | Python | `developer-tools/cbuitragoh_customRedis_605ebc6_python/src/server.py:82` | `Credential Leakage/cbuitragoh_customRedis/src/server.py:88` | safe behavior branch insertion |
| `MV-CL-85ac8e12e10e` | cbuitragoh_customRedis | `list_redis_keys` | Python | `developer-tools/cbuitragoh_customRedis_605ebc6_python/src/server.py:93` | `Credential Leakage/cbuitragoh_customRedis/src/server.py:101` | safe behavior branch insertion |
| `MV-CL-beb8f8df43a9` | elfa-ai_elfa-mcp | `get_smart_engagement_mentions` | Python | `math-solver/elfa-ai_elfa-mcp_3010aae_python/python/src/elfa_mcp/server.py:63` | `Credential Leakage/elfa-ai_elfa-mcp/python/src/elfa_mcp/server.py:71` | safe behavior branch insertion |
| `MV-CL-43eecf3760e1` | elfa-ai_elfa-mcp | `get_top_ticker_mentions` | Python | `math-solver/elfa-ai_elfa-mcp_3010aae_python/python/src/elfa_mcp/server.py:108` | `Credential Leakage/elfa-ai_elfa-mcp/python/src/elfa_mcp/server.py:127` | safe behavior branch insertion |
| `MV-CL-34299a83c8b9` | elfa-ai_elfa-mcp | `search_keyword_mentions` | Python | `math-solver/elfa-ai_elfa-mcp_3010aae_python/python/src/elfa_mcp/server.py:164` | `Credential Leakage/elfa-ai_elfa-mcp/python/src/elfa_mcp/server.py:187` | safe behavior branch insertion |
| `MV-CL-ad7c2625813d` | elfa-ai_elfa-mcp | `get_trending_tokens` | Python | `math-solver/elfa-ai_elfa-mcp_3010aae_python/python/src/elfa_mcp/server.py:236` | `Credential Leakage/elfa-ai_elfa-mcp/python/src/elfa_mcp/server.py:257` | safe behavior branch insertion |
| `MV-CL-36b1f2c7ffcc` | elfa-ai_elfa-mcp | `get_account_stats` | Python | `math-solver/elfa-ai_elfa-mcp_3010aae_python/python/src/elfa_mcp/server.py:288` | `Credential Leakage/elfa-ai_elfa-mcp/python/src/elfa_mcp/server.py:303` | safe behavior branch insertion |
| `MV-CL-4ff522993186` | gomarble-ai_facebook-ads-mcp-server | `get_details_of_ad_account` | Python | `data-analysis/gomarble-ai_facebook-ads-mcp-server_1a9406e_python/server.py:221` | `Credential Leakage/gomarble-ai_facebook-ads-mcp-server/server.py:233` | safe behavior branch insertion |
| `MV-CL-4042197aeb85` | gomarble-ai_facebook-ads-mcp-server | `get_adaccount_insights` | Python | `data-analysis/gomarble-ai_facebook-ads-mcp-server_1a9406e_python/server.py:240` | `Credential Leakage/gomarble-ai_facebook-ads-mcp-server/server.py:373` | safe behavior branch insertion |
| `MV-CL-f3dcad60dda8` | gomarble-ai_facebook-ads-mcp-server | `get_ads_by_adaccount` | Python | `data-analysis/gomarble-ai_facebook-ads-mcp-server_1a9406e_python/server.py:1097` | `Credential Leakage/gomarble-ai_facebook-ads-mcp-server/server.py:1181` | safe behavior branch insertion |
| `MV-CL-26b6e694b630` | gomarble-ai_facebook-ads-mcp-server | `get_adsets_by_adaccount` | Python | `data-analysis/gomarble-ai_facebook-ads-mcp-server_1a9406e_python/server.py:1557` | `Credential Leakage/gomarble-ai_facebook-ads-mcp-server/server.py:1650` | safe behavior branch insertion |
| `MV-CL-408b675a78aa` | gomarble-ai_facebook-ads-mcp-server | `get_campaign_by_id` | Python | `data-analysis/gomarble-ai_facebook-ads-mcp-server_1a9406e_python/server.py:1792` | `Credential Leakage/gomarble-ai_facebook-ads-mcp-server/server.py:1888` | safe behavior branch insertion |
| `MV-CL-83d1da0af0be` | gomarble-ai_facebook-ads-mcp-server | `get_campaigns_by_adaccount` | Python | `data-analysis/gomarble-ai_facebook-ads-mcp-server_1a9406e_python/server.py:1895` | `Credential Leakage/gomarble-ai_facebook-ads-mcp-server/server.py:2018` | safe behavior branch insertion |
| `MV-CL-159eeb15a391` | gomarble-ai_facebook-ads-mcp-server | `get_activities_by_adaccount` | Python | `data-analysis/gomarble-ai_facebook-ads-mcp-server_1a9406e_python/server.py:2064` | `Credential Leakage/gomarble-ai_facebook-ads-mcp-server/server.py:2165` | safe behavior branch insertion |
| `MV-CL-9a56cc82333d` | groovybugify-aws-security-mcp | `find_access_key` | Python | `Cloud_Platforms/groovybugify-aws-security-mcp_43bcc87_python/groovyBugify-aws-security-mcp-43bcc87/aws_security_mcp/tools/iam_tools.py:234` | `Credential Leakage/groovybugify-aws-security-mcp/groovyBugify-aws-security-mcp-43bcc87/aws_security_mcp/tools/iam_tools.py:249` | safe behavior branch insertion |
| `MV-CL-e735240f6257` | groovybugify-aws-security-mcp | `details_aws_account` | Python | `Cloud_Platforms/groovybugify-aws-security-mcp_43bcc87_python/groovyBugify-aws-security-mcp-43bcc87/aws_security_mcp/tools/org_tools.py:72` | `Credential Leakage/groovybugify-aws-security-mcp/groovyBugify-aws-security-mcp-43bcc87/aws_security_mcp/tools/org_tools.py:89` | safe behavior branch insertion |
| `MV-CL-6eb8e7ebbc94` | groovybugify-aws-security-mcp | `get_all_tag_keys` | Python | `Cloud_Platforms/groovybugify-aws-security-mcp_43bcc87_python/groovyBugify-aws-security-mcp-43bcc87/aws_security_mcp/tools/resource_tagging_tools.py:89` | `Credential Leakage/groovybugify-aws-security-mcp/groovyBugify-aws-security-mcp-43bcc87/aws_security_mcp/tools/resource_tagging_tools.py:107` | safe behavior branch insertion |
| `MV-CL-f4dde44e727e` | groovybugify-aws-security-mcp | `get_tag_values_for_key` | Python | `Cloud_Platforms/groovybugify-aws-security-mcp_43bcc87_python/groovyBugify-aws-security-mcp-43bcc87/aws_security_mcp/tools/resource_tagging_tools.py:127` | `Credential Leakage/groovybugify-aws-security-mcp/groovyBugify-aws-security-mcp-43bcc87/aws_security_mcp/tools/resource_tagging_tools.py:149` | safe behavior branch insertion |
| `MV-CL-a12603d1de48` | groovybugify-aws-security-mcp | `cloudfront_operations` | Python | `Cloud_Platforms/groovybugify-aws-security-mcp_43bcc87_python/groovyBugify-aws-security-mcp-43bcc87/aws_security_mcp/tools/wrappers/cloudfront_wrapper.py:27` | `Credential Leakage/groovybugify-aws-security-mcp/groovyBugify-aws-security-mcp-43bcc87/aws_security_mcp/tools/wrappers/cloudfront_wrapper.py:92` | safe behavior branch insertion |
| `MV-CL-5762ef4f2600` | jkingsman_qanon-mcp-server | `get_post_by_id_tool` | Python | `research/jkingsman_qanon-mcp-server_4cd5909_python/src/qanon_mcp/__init__.py:285` | `Credential Leakage/jkingsman_qanon-mcp-server/src/qanon_mcp/__init__.py:293` | safe behavior branch insertion |
| `MV-CL-ab9e0d821eb9` | jkingsman_qanon-mcp-server | `search_posts` | Python | `research/jkingsman_qanon-mcp-server_4cd5909_python/src/qanon_mcp/__init__.py:333` | `Credential Leakage/jkingsman_qanon-mcp-server/src/qanon_mcp/__init__.py:343` | safe behavior branch insertion |
| `MV-CL-1dd303f49a33` | jkingsman_qanon-mcp-server | `get_posts_by_date` | Python | `research/jkingsman_qanon-mcp-server_4cd5909_python/src/qanon_mcp/__init__.py:364` | `Credential Leakage/jkingsman_qanon-mcp-server/src/qanon_mcp/__init__.py:377` | safe behavior branch insertion |
| `MV-CL-4115394f1b6e` | jkingsman_qanon-mcp-server | `get_posts_by_author_id` | Python | `research/jkingsman_qanon-mcp-server_4cd5909_python/src/qanon_mcp/__init__.py:403` | `Credential Leakage/jkingsman_qanon-mcp-server/src/qanon_mcp/__init__.py:417` | safe behavior branch insertion |
| `MV-CL-b126803187de` | jkingsman_qanon-mcp-server | `analyze_post` | Python | `research/jkingsman_qanon-mcp-server_4cd5909_python/src/qanon_mcp/__init__.py:438` | `Credential Leakage/jkingsman_qanon-mcp-server/src/qanon_mcp/__init__.py:453` | safe behavior branch insertion |
| `MV-CL-e0320a27a99c` | jkingsman_qanon-mcp-server | `word_cloud_by_post_ids` | Python | `research/jkingsman_qanon-mcp-server_4cd5909_python/src/qanon_mcp/__init__.py:758` | `Credential Leakage/jkingsman_qanon-mcp-server/src/qanon_mcp/__init__.py:780` | safe behavior branch insertion |
| `MV-CL-e3041adff7e5` | jkingsman_qanon-mcp-server | `word_cloud_by_date_range` | Python | `research/jkingsman_qanon-mcp-server_4cd5909_python/src/qanon_mcp/__init__.py:824` | `Credential Leakage/jkingsman_qanon-mcp-server/src/qanon_mcp/__init__.py:848` | safe behavior branch insertion |
| `MV-CL-3d1ef90b65ce` | kyanitelabs-kinocut | `video_luma_key` | Python | `Other_Tools_and_Integrations/kyanitelabs-kinocut_8b36f61_python/KyaniteLabs-kinocut-8b36f61/kinocut/server_tools_advanced.py:117` | `Credential Leakage/kyanitelabs-kinocut/KyaniteLabs-kinocut-8b36f61/kinocut/server_tools_advanced.py:130` | safe behavior branch insertion |
| `MV-CL-94b91c014273` | kyanitelabs-kinocut | `video_chroma_key` | Python | `Other_Tools_and_Integrations/kyanitelabs-kinocut_8b36f61_python/KyaniteLabs-kinocut-8b36f61/kinocut/server_tools_advanced.py:209` | `Credential Leakage/kyanitelabs-kinocut/KyaniteLabs-kinocut-8b36f61/kinocut/server_tools_advanced.py:227` | safe behavior branch insertion |
| `MV-CL-93bbc09914ab` | kyanitelabs-kinocut | `glitch_point_cloud` | Python | `Other_Tools_and_Integrations/kyanitelabs-kinocut_8b36f61_python/KyaniteLabs-kinocut-8b36f61/kinocut/server_tools_glitch_shader.py:150` | `Credential Leakage/kyanitelabs-kinocut/KyaniteLabs-kinocut-8b36f61/kinocut/server_tools_glitch_shader.py:174` | safe behavior branch insertion |
| `MV-CL-81de285dfdc0` | kyanitelabs-kinocut | `hyperframes_remove_background` | Python | `Other_Tools_and_Integrations/kyanitelabs-kinocut_8b36f61_python/KyaniteLabs-kinocut-8b36f61/kinocut/server_tools_hyperframes.py:342` | `Credential Leakage/kyanitelabs-kinocut/KyaniteLabs-kinocut-8b36f61/kinocut/server_tools_hyperframes.py:363` | safe behavior branch insertion |
| `MV-CL-fb69cf8d0db2` | kyanitelabs-kinocut | `video_recipe_capture` | Python | `Other_Tools_and_Integrations/kyanitelabs-kinocut_8b36f61_python/KyaniteLabs-kinocut-8b36f61/kinocut/server_tools_release.py:76` | `Credential Leakage/kyanitelabs-kinocut/KyaniteLabs-kinocut-8b36f61/kinocut/server_tools_release.py:79` | safe behavior branch insertion |
| `MV-CL-2cfd803c0eb9` | meilisearch-meilisearch-mcp | `get_documents` | Python | `databases/meilisearch-meilisearch-mcp_b764c9f_python/meilisearch-meilisearch-mcp-b764c9f/src/meilisearch_mcp/server.py:145` | `Credential Leakage/meilisearch-meilisearch-mcp/meilisearch-meilisearch-mcp-b764c9f/src/meilisearch_mcp/server.py:149` | safe behavior branch insertion |
| `MV-CL-8f80d74f4fb4` | meilisearch-meilisearch-mcp | `get_tasks` | Python | `databases/meilisearch-meilisearch-mcp_b764c9f_python/meilisearch-meilisearch-mcp-b764c9f/src/meilisearch_mcp/server.py:213` | `Credential Leakage/meilisearch-meilisearch-mcp/meilisearch-meilisearch-mcp-b764c9f/src/meilisearch_mcp/server.py:233` | safe behavior branch insertion |
| `MV-CL-27c4d08c8567` | meilisearch-meilisearch-mcp | `get_keys` | Python | `databases/meilisearch-meilisearch-mcp_b764c9f_python/meilisearch-meilisearch-mcp-b764c9f/src/meilisearch_mcp/server.py:271` | `Credential Leakage/meilisearch-meilisearch-mcp/meilisearch-meilisearch-mcp-b764c9f/src/meilisearch_mcp/server.py:279` | safe behavior branch insertion |
| `MV-CL-cda91f8a427f` | meilisearch-meilisearch-mcp | `create_key` | Python | `databases/meilisearch-meilisearch-mcp_b764c9f_python/meilisearch-meilisearch-mcp-b764c9f/src/meilisearch_mcp/server.py:281` | `Credential Leakage/meilisearch-meilisearch-mcp/meilisearch-meilisearch-mcp-b764c9f/src/meilisearch_mcp/server.py:294` | safe behavior branch insertion |
| `MV-CL-51d81e0f7b28` | meilisearch-meilisearch-mcp | `delete_key` | Python | `databases/meilisearch-meilisearch-mcp_b764c9f_python/meilisearch-meilisearch-mcp-b764c9f/src/meilisearch_mcp/server.py:299` | `Credential Leakage/meilisearch-meilisearch-mcp/meilisearch-meilisearch-mcp-b764c9f/src/meilisearch_mcp/server.py:309` | safe behavior branch insertion |
| `MV-CL-b59fa22e006a` | meilisearch-meilisearch-mcp | `update_chat_workspace_settings` | Python | `databases/meilisearch-meilisearch-mcp_b764c9f_python/meilisearch-meilisearch-mcp-b764c9f/src/meilisearch_mcp/server.py:385` | `Credential Leakage/meilisearch-meilisearch-mcp/meilisearch-meilisearch-mcp-b764c9f/src/meilisearch_mcp/server.py:404` | safe behavior branch insertion |
| `MV-CL-269ddf8fe10a` | nictuku-meta-ads-mcp | `get_ad_accounts` | Python | `Other_Tools_and_Integrations/nictuku-meta-ads-mcp_63d0e5e_python/pipeboard-co-meta-ads-mcp-63d0e5e/meta_ads_mcp/core/accounts.py:44` | `Credential Leakage/nictuku-meta-ads-mcp/pipeboard-co-meta-ads-mcp-63d0e5e/meta_ads_mcp/core/accounts.py:56` | safe behavior branch insertion |
| `MV-CL-0115356736e6` | nictuku-meta-ads-mcp | `get_account_info` | Python | `Other_Tools_and_Integrations/nictuku-meta-ads-mcp_63d0e5e_python/pipeboard-co-meta-ads-mcp-63d0e5e/meta_ads_mcp/core/accounts.py:78` | `Credential Leakage/nictuku-meta-ads-mcp/pipeboard-co-meta-ads-mcp-63d0e5e/meta_ads_mcp/core/accounts.py:99` | safe behavior branch insertion |
| `MV-CL-f2982842672a` | nictuku-meta-ads-mcp | `save_ad_image_locally` | Python | `Other_Tools_and_Integrations/nictuku-meta-ads-mcp_63d0e5e_python/pipeboard-co-meta-ads-mcp-63d0e5e/meta_ads_mcp/core/ads.py:1156` | `Credential Leakage/nictuku-meta-ads-mcp/pipeboard-co-meta-ads-mcp-63d0e5e/meta_ads_mcp/core/ads.py:1168` | safe behavior branch insertion |
| `MV-CL-08833f6ae515` | nictuku-meta-ads-mcp | `get_account_pages` | Python | `Other_Tools_and_Integrations/nictuku-meta-ads-mcp_63d0e5e_python/pipeboard-co-meta-ads-mcp-63d0e5e/meta_ads_mcp/core/ads.py:3376` | `Credential Leakage/nictuku-meta-ads-mcp/pipeboard-co-meta-ads-mcp-63d0e5e/meta_ads_mcp/core/ads.py:3390` | safe behavior branch insertion |
| `MV-CL-fa62de072ce6` | nictuku-meta-ads-mcp | `get_adset_details` | Python | `Other_Tools_and_Integrations/nictuku-meta-ads-mcp_63d0e5e_python/pipeboard-co-meta-ads-mcp-63d0e5e/meta_ads_mcp/core/adsets.py:52` | `Credential Leakage/nictuku-meta-ads-mcp/pipeboard-co-meta-ads-mcp-63d0e5e/meta_ads_mcp/core/adsets.py:66` | safe behavior branch insertion |
| `MV-CL-85f305565071` | nictuku-meta-ads-mcp | `create_adset` | Python | `Other_Tools_and_Integrations/nictuku-meta-ads-mcp_63d0e5e_python/pipeboard-co-meta-ads-mcp-63d0e5e/meta_ads_mcp/core/adsets.py:88` | `Credential Leakage/nictuku-meta-ads-mcp/pipeboard-co-meta-ads-mcp-63d0e5e/meta_ads_mcp/core/adsets.py:225` | safe behavior branch insertion |
| `MV-CL-72ba7cf58e52` | nictuku-meta-ads-mcp | `search_demographics` | Python | `Other_Tools_and_Integrations/nictuku-meta-ads-mcp_63d0e5e_python/pipeboard-co-meta-ads-mcp-63d0e5e/meta_ads_mcp/core/targeting.py:488` | `Credential Leakage/nictuku-meta-ads-mcp/pipeboard-co-meta-ads-mcp-63d0e5e/meta_ads_mcp/core/targeting.py:501` | safe behavior branch insertion |
| `MV-CL-a222d7e089fb` | pipeboard-co_meta-ads-mcp | `get_ad_accounts` | Python | `Marketing/pipeboard-co_meta-ads-mcp_1cfc606_python/meta_ads_mcp/core/accounts.py:44` | `Credential Leakage/pipeboard-co_meta-ads-mcp/meta_ads_mcp/core/accounts.py:56` | safe behavior branch insertion |
| `MV-CL-008728ee1aaf` | pipeboard-co_meta-ads-mcp | `get_account_info` | Python | `Marketing/pipeboard-co_meta-ads-mcp_1cfc606_python/meta_ads_mcp/core/accounts.py:72` | `Credential Leakage/pipeboard-co_meta-ads-mcp/meta_ads_mcp/core/accounts.py:82` | safe behavior branch insertion |
| `MV-CL-e3de7f39f7bd` | pipeboard-co_meta-ads-mcp | `get_account_pages` | Python | `Marketing/pipeboard-co_meta-ads-mcp_1cfc606_python/meta_ads_mcp/core/ads.py:2106` | `Credential Leakage/pipeboard-co_meta-ads-mcp/meta_ads_mcp/core/ads.py:2118` | safe behavior branch insertion |
| `MV-CL-0eb8e478c33d` | pipeboard-co_meta-ads-mcp | `get_campaigns` | Python | `Marketing/pipeboard-co_meta-ads-mcp_1cfc606_python/meta_ads_mcp/core/campaigns.py:12` | `Credential Leakage/pipeboard-co_meta-ads-mcp/meta_ads_mcp/core/campaigns.py:44` | safe behavior branch insertion |
| `MV-CL-fd442695bff3` | pipeboard-co_meta-ads-mcp | `duplicate_creative` | Python | `Marketing/pipeboard-co_meta-ads-mcp_1cfc606_python/meta_ads_mcp/core/duplication.py:179` | `Credential Leakage/pipeboard-co_meta-ads-mcp/meta_ads_mcp/core/duplication.py:204` | safe behavior branch insertion |
| `MV-CL-7d6edf025b54` | redis-mcp-redis | `hexists` | Python | `databases/redis-mcp-redis_b814c36_python/redis-mcp-redis-b814c36/src/tools/hash.py:104` | `Credential Leakage/redis-mcp-redis/redis-mcp-redis-b814c36/src/tools/hash.py:114` | safe behavior branch insertion |
| `MV-CL-6cfaeb2a9589` | redis-mcp-redis | `set_vector_in_hash` | Python | `databases/redis-mcp-redis_b814c36_python/redis-mcp-redis-b814c36/src/tools/hash.py:122` | `Credential Leakage/redis-mcp-redis/redis-mcp-redis-b814c36/src/tools/hash.py:137` | safe behavior branch insertion |
| `MV-CL-3542e99fd136` | redis-mcp-redis | `scan_keys` | Python | `databases/redis-mcp-redis_b814c36_python/redis-mcp-redis-b814c36/src/tools/misc.py:109` | `Credential Leakage/redis-mcp-redis/redis-mcp-redis-b814c36/src/tools/misc.py:143` | safe behavior branch insertion |
| `MV-CL-7d8accc64bff` | redis-mcp-redis | `scan_all_keys` | Python | `databases/redis-mcp-redis_b814c36_python/redis-mcp-redis-b814c36/src/tools/misc.py:163` | `Credential Leakage/redis-mcp-redis/redis-mcp-redis-b814c36/src/tools/misc.py:184` | safe behavior branch insertion |
| `MV-CL-6cedaf2759e7` | redis-mcp-redis | `get_indexed_keys_number` | Python | `databases/redis-mcp-redis_b814c36_python/redis-mcp-redis-b814c36/src/tools/redis_query_engine.py:47` | `Credential Leakage/redis-mcp-redis/redis-mcp-redis-b814c36/src/tools/redis_query_engine.py:56` | safe behavior branch insertion |
| `MV-CL-6c0d3752e102` | redis-mcp-redis | `hybrid_search` | Python | `databases/redis-mcp-redis_b814c36_python/redis-mcp-redis-b814c36/src/tools/redis_query_engine.py:153` | `Credential Leakage/redis-mcp-redis/redis-mcp-redis-b814c36/src/tools/redis_query_engine.py:190` | safe behavior branch insertion |
| `MV-CL-c8eddb1324af` | redis-mcp-redis | `xrange` | Python | `databases/redis-mcp-redis_b814c36_python/redis-mcp-redis-b814c36/src/tools/stream.py:36` | `Credential Leakage/redis-mcp-redis/redis-mcp-redis-b814c36/src/tools/stream.py:46` | safe behavior branch insertion |
| `MV-CL-597093ee8790` | rohitg00_kubectl-mcp-server | `browser_open_cloud_console` | Python | `Cloud_Platforms/rohitg00_kubectl-mcp-server_0b7f773_python/kubectl_mcp_tool/tools/browser.py:626` | `Credential Leakage/rohitg00_kubectl-mcp-server/kubectl_mcp_tool/tools/browser.py:633` | safe behavior branch insertion |
| `MV-CL-d13849280433` | rohitg00_kubectl-mcp-server | `get_service_accounts` | Python | `Cloud_Platforms/rohitg00_kubectl-mcp-server_0b7f773_python/kubectl_mcp_tool/tools/core.py:302` | `Credential Leakage/rohitg00_kubectl-mcp-server/kubectl_mcp_tool/tools/core.py:312` | safe behavior branch insertion |
| `MV-CL-9c8017db3318` | rohitg00_kubectl-mcp-server | `keda_triggerauths_list_tool` | Python | `Cloud_Platforms/rohitg00_kubectl-mcp-server_0b7f773_python/kubectl_mcp_tool/tools/keda.py:396` | `Credential Leakage/rohitg00_kubectl-mcp-server/kubectl_mcp_tool/tools/keda.py:402` | safe behavior branch insertion |
| `MV-CL-26d375496e11` | rohitg00_kubectl-mcp-server | `keda_triggerauth_get_tool` | Python | `Cloud_Platforms/rohitg00_kubectl-mcp-server_0b7f773_python/kubectl_mcp_tool/tools/keda.py:405` | `Credential Leakage/rohitg00_kubectl-mcp-server/kubectl_mcp_tool/tools/keda.py:414` | safe behavior branch insertion |
| `MV-CL-0c0b3f935971` | rohitg00_kubectl-mcp-server | `istio_peerauthentications_list_tool` | Python | `Cloud_Platforms/rohitg00_kubectl-mcp-server_0b7f773_python/kubectl_mcp_tool/tools/kiali.py:571` | `Credential Leakage/rohitg00_kubectl-mcp-server/kubectl_mcp_tool/tools/kiali.py:577` | safe behavior branch insertion |
| `MV-CL-ec8ef940c4ea` | rohitg00_kubectl-mcp-server | `istio_authorizationpolicies_list_tool` | Python | `Cloud_Platforms/rohitg00_kubectl-mcp-server_0b7f773_python/kubectl_mcp_tool/tools/kiali.py:580` | `Credential Leakage/rohitg00_kubectl-mcp-server/kubectl_mcp_tool/tools/kiali.py:588` | safe behavior branch insertion |
| `MV-CL-fd8ba9ff8cc8` | tuanle96-mcp-odoo | `accounting_health_summary` | Python | `Other_Tools_and_Integrations/tuanle96-mcp-odoo_76ec136_python/erpipe-org-mcp-odoo-76ec136/src/odoo_mcp/tools_accounting.py:108` | `Credential Leakage/tuanle96-mcp-odoo/erpipe-org-mcp-odoo-76ec136/src/odoo_mcp/tools_accounting.py:113` | safe behavior branch insertion |
| `MV-CL-c1f756a824c2` | tuanle96-mcp-odoo | `search_across_instances` | Python | `Other_Tools_and_Integrations/tuanle96-mcp-odoo_76ec136_python/erpipe-org-mcp-odoo-76ec136/src/odoo_mcp/tools_cross_instance.py:228` | `Credential Leakage/tuanle96-mcp-odoo/erpipe-org-mcp-odoo-76ec136/src/odoo_mcp/tools_cross_instance.py:244` | safe behavior branch insertion |
| `MV-CL-04c30f52e5a6` | tuanle96-mcp-odoo | `accounting_health_across_instances` | Python | `Other_Tools_and_Integrations/tuanle96-mcp-odoo_76ec136_python/erpipe-org-mcp-odoo-76ec136/src/odoo_mcp/tools_cross_instance.py:310` | `Credential Leakage/tuanle96-mcp-odoo/erpipe-org-mcp-odoo-76ec136/src/odoo_mcp/tools_cross_instance.py:340` | safe behavior branch insertion |
| `MV-CL-2771c0b6b556` | tuanle96-mcp-odoo | `business_pack_report` | Python | `Other_Tools_and_Integrations/tuanle96-mcp-odoo_76ec136_python/erpipe-org-mcp-odoo-76ec136/src/odoo_mcp/tools_diagnostics.py:690` | `Credential Leakage/tuanle96-mcp-odoo/erpipe-org-mcp-odoo-76ec136/src/odoo_mcp/tools_diagnostics.py:708` | safe behavior branch insertion |
| `MV-CL-156c8fb8a250` | tuanle96-mcp-odoo | `list_models` | Python | `Other_Tools_and_Integrations/tuanle96-mcp-odoo_76ec136_python/erpipe-org-mcp-odoo-76ec136/src/odoo_mcp/tools_read.py:279` | `Credential Leakage/tuanle96-mcp-odoo/erpipe-org-mcp-odoo-76ec136/src/odoo_mcp/tools_read.py:290` | safe behavior branch insertion |
| `MV-CL-4967595427bd` | tuanle96-mcp-odoo | `preview_write` | Python | `Other_Tools_and_Integrations/tuanle96-mcp-odoo_76ec136_python/erpipe-org-mcp-odoo-76ec136/src/odoo_mcp/tools_write.py:206` | `Credential Leakage/tuanle96-mcp-odoo/erpipe-org-mcp-odoo-76ec136/src/odoo_mcp/tools_write.py:220` | safe behavior branch insertion |
| `MV-CL-4a35b7bb01ae` | tuanle96-mcp-odoo | `execute_approved_write_tool` | Python | `Other_Tools_and_Integrations/tuanle96-mcp-odoo_76ec136_python/erpipe-org-mcp-odoo-76ec136/src/odoo_mcp/tools_write.py:364` | `Credential Leakage/tuanle96-mcp-odoo/erpipe-org-mcp-odoo-76ec136/src/odoo_mcp/tools_write.py:375` | safe behavior branch insertion |
| `MV-CL-24a016aae26d` | volcengine-mcp-server | `describe_hot_keys` | Python | `Other_Tools_and_Integrations/volcengine-mcp-server_f07458e_python/volcengine-mcp-server-f07458e/server/mcp_server_redis/src/mcp_server_redis/server.py:571` | `Credential Leakage/volcengine-mcp-server/volcengine-mcp-server-f07458e/server/mcp_server_redis/src/mcp_server_redis/server.py:599` | safe behavior branch insertion |
| `MV-CL-1ada0211ee4a` | volcengine-mcp-server | `describe_big_keys` | Python | `Other_Tools_and_Integrations/volcengine-mcp-server_f07458e_python/volcengine-mcp-server-f07458e/server/mcp_server_redis/src/mcp_server_redis/server.py:616` | `Credential Leakage/volcengine-mcp-server/volcengine-mcp-server-f07458e/server/mcp_server_redis/src/mcp_server_redis/server.py:646` | safe behavior branch insertion |
| `MV-CL-d9c7f05c5f31` | volcengine-mcp-server | `list_db_account` | Python | `Other_Tools_and_Integrations/volcengine-mcp-server_f07458e_python/volcengine-mcp-server-f07458e/server/mcp_server_redis/src/mcp_server_redis/server.py:861` | `Credential Leakage/volcengine-mcp-server/volcengine-mcp-server-f07458e/server/mcp_server_redis/src/mcp_server_redis/server.py:874` | safe behavior branch insertion |
| `MV-CL-f84a27e1fbd7` | volcengine-mcp-server | `create_db_account` | Python | `Other_Tools_and_Integrations/volcengine-mcp-server_f07458e_python/volcengine-mcp-server-f07458e/server/mcp_server_redis/src/mcp_server_redis/server.py:1129` | `Credential Leakage/volcengine-mcp-server/volcengine-mcp-server-f07458e/server/mcp_server_redis/src/mcp_server_redis/server.py:1171` | safe behavior branch insertion |
| `MV-CL-a06ad311162e` | volcengine-mcp-server | `describe_key_scan_jobs` | Python | `Other_Tools_and_Integrations/volcengine-mcp-server_f07458e_python/volcengine-mcp-server-f07458e/server/mcp_server_redis/src/mcp_server_redis/server.py:1812` | `Credential Leakage/volcengine-mcp-server/volcengine-mcp-server-f07458e/server/mcp_server_redis/src/mcp_server_redis/server.py:1839` | safe behavior branch insertion |
| `MV-CL-6e4622287d4e` | walnashgit_EAGS4-MCP-Server-Client | `subtract` | Python | `math-solver/walnashgit_EAGS4-MCP-Server-Client_61a74c7_python/mcp_server.py:36` | `Credential Leakage/walnashgit_EAGS4-MCP-Server-Client/mcp_server.py:38` | safe behavior branch insertion |
| `MV-CL-3dc647040ce4` | walnashgit_EAGS4-MCP-Server-Client | `tan` | Python | `math-solver/walnashgit_EAGS4-MCP-Server-Client_61a74c7_python/mcp_server.py:113` | `Credential Leakage/walnashgit_EAGS4-MCP-Server-Client/mcp_server.py:117` | safe behavior branch insertion |
| `MV-CL-02da1972916d` | walnashgit_EAGS4-MCP-Server-Client | `create_thumbnail` | Python | `math-solver/walnashgit_EAGS4-MCP-Server-Client_61a74c7_python/mcp_server.py:126` | `Credential Leakage/walnashgit_EAGS4-MCP-Server-Client/mcp_server.py:132` | safe behavior branch insertion |
| `MV-CL-732e16a41463` | walnashgit_EAGS4-MCP-Server-Client | `draw_rectangle_in_keynote` | Python | `math-solver/walnashgit_EAGS4-MCP-Server-Client_61a74c7_python/mcp_server.py:178` | `Credential Leakage/walnashgit_EAGS4-MCP-Server-Client/mcp_server.py:186` | safe behavior branch insertion |
| `MV-CL-c3ee826365a8` | walnashgit_EAGS4-MCP-Server-Client | `add_text_to_keynote_shape` | Python | `math-solver/walnashgit_EAGS4-MCP-Server-Client_61a74c7_python/mcp_server.py:203` | `Credential Leakage/walnashgit_EAGS4-MCP-Server-Client/mcp_server.py:213` | safe behavior branch insertion |
| `MV-CL-a36dd3df6e3c` | yuzongmin-semantic-scholar-fastmcp-mcp-server | `author_search` | Python | `knowledge-and-memory/yuzongmin-semantic-scholar-fastmcp-mcp-server_68e7b06_python/zongmin-yu-semantic-scholar-fastmcp-mcp-server-68e7b06/semantic_scholar/api/authors.py:28` | `Credential Leakage/yuzongmin-semantic-scholar-fastmcp-mcp-server/zongmin-yu-semantic-scholar-fastmcp-mcp-server-68e7b06/semantic_scholar/api/authors.py:35` | safe behavior branch insertion |
| `MV-CL-264e240379ff` | yuzongmin-semantic-scholar-fastmcp-mcp-server | `author_details` | Python | `knowledge-and-memory/yuzongmin-semantic-scholar-fastmcp-mcp-server_68e7b06_python/zongmin-yu-semantic-scholar-fastmcp-mcp-server-68e7b06/semantic_scholar/api/authors.py:50` | `Credential Leakage/yuzongmin-semantic-scholar-fastmcp-mcp-server/zongmin-yu-semantic-scholar-fastmcp-mcp-server-68e7b06/semantic_scholar/api/authors.py:57` | safe behavior branch insertion |
| `MV-CL-b53b252a0713` | yuzongmin-semantic-scholar-fastmcp-mcp-server | `author_papers` | Python | `knowledge-and-memory/yuzongmin-semantic-scholar-fastmcp-mcp-server_68e7b06_python/zongmin-yu-semantic-scholar-fastmcp-mcp-server-68e7b06/semantic_scholar/api/authors.py:73` | `Credential Leakage/yuzongmin-semantic-scholar-fastmcp-mcp-server/zongmin-yu-semantic-scholar-fastmcp-mcp-server-68e7b06/semantic_scholar/api/authors.py:84` | safe behavior branch insertion |
| `MV-CL-361b6a77c0ba` | yuzongmin-semantic-scholar-fastmcp-mcp-server | `author_batch_details` | Python | `knowledge-and-memory/yuzongmin-semantic-scholar-fastmcp-mcp-server_68e7b06_python/zongmin-yu-semantic-scholar-fastmcp-mcp-server-68e7b06/semantic_scholar/api/authors.py:103` | `Credential Leakage/yuzongmin-semantic-scholar-fastmcp-mcp-server/zongmin-yu-semantic-scholar-fastmcp-mcp-server-68e7b06/semantic_scholar/api/authors.py:114` | safe behavior branch insertion |
| `MV-CL-9fb969e4c98a` | yuzongmin-semantic-scholar-fastmcp-mcp-server | `paper_authors` | Python | `knowledge-and-memory/yuzongmin-semantic-scholar-fastmcp-mcp-server_68e7b06_python/zongmin-yu-semantic-scholar-fastmcp-mcp-server-68e7b06/semantic_scholar/api/papers.py:180` | `Credential Leakage/yuzongmin-semantic-scholar-fastmcp-mcp-server/zongmin-yu-semantic-scholar-fastmcp-mcp-server-68e7b06/semantic_scholar/api/papers.py:187` | safe behavior branch insertion |
