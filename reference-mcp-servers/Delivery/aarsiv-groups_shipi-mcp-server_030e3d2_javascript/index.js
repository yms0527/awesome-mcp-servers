#!/usr/bin/env node
/**
 * Shipi MCP Server — AI-powered multi-carrier shipping management
 *
 * 18 tools for complete shipping workflow:
 *   Shipments: list, get, search, create, cancel
 *   Rates: get_shipping_rates
 *   Pickup: schedule_pickup
 *   Tracking: track_shipment
 *   Labels: fetch_labels
 *   Addresses: list, get, add, edit, delete
 *   Carriers: list, get
 *   Account: get_account_info, get_shipping_stats
 *
 * Transport: stdio (standard MCP protocol)
 * Auth: integration_key passed per-tool or via env SHIPI_INTEGRATION_KEY
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// ─── Configuration ──────────────────────────────────────────────────
const BASE_URL = process.env.SHIPI_BASE_URL || "https://app.myshipi.com";
const DEFAULT_KEY = process.env.SHIPI_INTEGRATION_KEY || "";

// ─── HTTP Helper ────────────────────────────────────────────────────
async function shipiRequest(endpoint, params = {}, method = "POST") {
  const url = `${BASE_URL}/${endpoint}`;
  const key = params.integration_key || DEFAULT_KEY;

  try {
    let response;
    if (method === "GET") {
      const qs = new URLSearchParams();
      if (key) qs.set("integration_key", key);
      for (const [k, v] of Object.entries(params)) {
        if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
      }
      const fetchModule = await import("node-fetch");
      response = await fetchModule.default(`${url}?${qs.toString()}`, {
        method: "GET",
        headers: { "Accept": "application/json" },
      });
    } else {
      const body = { ...params };
      if (key && !body.integration_key) body.integration_key = key;
      const fetchModule = await import("node-fetch");
      response = await fetchModule.default(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(body),
      });
    }

    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch {
      return { status: "error", message: "Invalid JSON response", raw: text.substring(0, 500) };
    }
  } catch (err) {
    return { status: "error", message: `Request failed: ${err.message}` };
  }
}

/** Format API result for MCP text content */
function toText(data) {
  return JSON.stringify(data, null, 2);
}

// ─── Create MCP Server ─────────────────────────────────────────────
const server = new McpServer({
  name: "shipi-shipping",
  version: "1.0.2",
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TOOL 1: list_shipments
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
server.tool(
  "list_shipments",
  "List shipments with pagination and filters. Filter by status (new/created/delivered), carrier, or date range.",
  {
    integration_key: z.string().optional().describe("Shipi integration key (uses env default if omitted)"),
    page: z.number().optional().default(1).describe("Page number"),
    per_page: z.number().optional().default(20).describe("Items per page (max 100)"),
    status: z.string().optional().describe("Filter by status: new, created, delivered, cancelled"),
    carrier: z.string().optional().describe("Filter by carrier: fedex, ups, dhl, usps, etc."),
    date_from: z.string().optional().describe("Start date (YYYY-MM-DD)"),
    date_to: z.string().optional().describe("End date (YYYY-MM-DD)"),
  },
  async (params) => {
    const data = await shipiRequest("api/v1/shipments.php", {
      action: "list",
      ...params,
    }, "GET");
    return { content: [{ type: "text", text: toText(data) }] };
  }
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TOOL 2: get_shipment
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
server.tool(
  "get_shipment",
  "Get detailed information about a specific shipment by ID or order ID. Includes shipper, recipient, products, tracking, and label URLs.",
  {
    integration_key: z.string().optional().describe("Shipi integration key"),
    id: z.string().optional().describe("Shipment ID"),
    order_id: z.string().optional().describe("Order ID"),
  },
  async (params) => {
    const data = await shipiRequest("api/v1/shipments.php", {
      action: "get",
      ...params,
    }, "GET");
    return { content: [{ type: "text", text: toText(data) }] };
  }
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TOOL 3: search_shipments
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
server.tool(
  "search_shipments",
  "Search shipments by order ID or tracking number. Returns matching shipments.",
  {
    integration_key: z.string().optional().describe("Shipi integration key"),
    q: z.string().describe("Search query (order ID or tracking number)"),
    limit: z.number().optional().default(20).describe("Max results (max 50)"),
  },
  async (params) => {
    const data = await shipiRequest("api/v1/shipments.php", {
      action: "search",
      ...params,
    }, "GET");
    return { content: [{ type: "text", text: toText(data) }] };
  }
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TOOL 4: create_shipment
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
server.tool(
  "create_shipment",
  "Create a shipping label. Requires carrier account, shipper/recipient addresses, and product details. Returns tracking number and label URL.",
  {
    integration_key: z.string().optional().describe("Shipi integration key"),
    carrier_id: z.number().describe("Shipping account ID (get from list_carriers)"),
    service_code: z.string().optional().default("").describe("Carrier service code (leave empty for default)"),
    shipper: z.object({
      name: z.string().describe("Shipper name"),
      company: z.string().optional().default(""),
      address1: z.string().describe("Street address line 1"),
      address2: z.string().optional().default(""),
      city: z.string().describe("City"),
      state: z.string().describe("State/province code"),
      postal: z.string().describe("Postal/ZIP code"),
      country: z.string().describe("Country code (US, CA, IN, etc.)"),
      phone: z.string().optional().default(""),
      email: z.string().optional().default(""),
    }).describe("Shipper (from) address"),
    recipient: z.object({
      name: z.string().describe("Recipient name"),
      company: z.string().optional().default(""),
      address1: z.string().describe("Street address line 1"),
      address2: z.string().optional().default(""),
      city: z.string().describe("City"),
      state: z.string().describe("State/province code"),
      postal: z.string().describe("Postal/ZIP code"),
      country: z.string().describe("Country code"),
      phone: z.string().optional().default(""),
      email: z.string().optional().default(""),
    }).describe("Recipient (to) address"),
    products: z.array(z.object({
      name: z.string().optional().default("Package"),
      weight: z.number().describe("Weight in lbs/kg"),
      quantity: z.number().optional().default(1),
      price: z.number().optional().default(0),
      length: z.number().optional().default(1),
      width: z.number().optional().default(1),
      height: z.number().optional().default(1),
    })).describe("Products/packages to ship"),
  },
  async (params) => {
    const { integration_key, carrier_id, service_code, shipper, recipient, products } = params;
    const key = integration_key || DEFAULT_KEY;

    // Build the meta object that create_shipment.php expects
    const meta = {
      label: "d",
      s_name: shipper.name,
      s_company: shipper.company || "",
      s_address1: shipper.address1,
      s_address2: shipper.address2 || "",
      s_city: shipper.city,
      s_state: shipper.state,
      s_postal: shipper.postal,
      s_country: shipper.country,
      s_phone: shipper.phone || "",
      s_email: shipper.email || "",
      t_name: recipient.name,
      t_company: recipient.company || "",
      t_address1: recipient.address1,
      t_address2: recipient.address2 || "",
      t_city: recipient.city,
      t_state: recipient.state,
      t_postal: recipient.postal,
      t_country: recipient.country,
      t_phone: recipient.phone || "",
      t_email: recipient.email || "",
      service_code: service_code || "",
      carrier_id: carrier_id,
      products: products.map((p) => ({
        prod_name: p.name || "Package",
        prod_weight: p.weight,
        prod_quantity: p.quantity || 1,
        prod_price: p.price || 0,
        prod_depth: p.length || 1,
        prod_width: p.width || 1,
        prod_height: p.height || 1,
      })),
    };

    const data = await shipiRequest("label_api/create_shipment.php", {
      integrated_key: key,
      meta,
    });
    return { content: [{ type: "text", text: toText(data) }] };
  }
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TOOL 5: cancel_shipment
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
server.tool(
  "cancel_shipment",
  "Cancel a shipment and void its label. Requires the shipment ID (del_ref).",
  {
    integration_key: z.string().optional().describe("Shipi integration key"),
    shipment_id: z.number().describe("Shipment ID to cancel"),
  },
  async (params) => {
    const key = params.integration_key || DEFAULT_KEY;
    const data = await shipiRequest("cancel_api/delete_shipment.php", {
      integrated_key: key,
      del_ref: params.shipment_id,
    });
    return { content: [{ type: "text", text: toText(data) }] };
  }
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TOOL 6: get_shipping_rates
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
server.tool(
  "get_shipping_rates",
  "Get live shipping rates from all configured carriers. Provide recipient address and package details to compare prices across FedEx, UPS, DHL, USPS, etc.",
  {
    integration_key: z.string().optional().describe("Shipi integration key"),
    receiver_address: z.object({
      name: z.string().optional().default(""),
      address1: z.string().describe("Street address"),
      address2: z.string().optional().default(""),
      city: z.string().describe("City"),
      state: z.string().describe("State/province code"),
      postal: z.string().describe("Postal/ZIP code"),
      country: z.string().describe("Country code (US, CA, IN, etc.)"),
    }).describe("Recipient address for rate calculation"),
    products: z.array(z.object({
      name: z.string().optional().default("Package"),
      weight: z.number().describe("Weight in lbs/kg"),
      quantity: z.number().optional().default(1),
      price: z.number().optional().default(0),
      length: z.number().optional().default(1),
      width: z.number().optional().default(1),
      height: z.number().optional().default(1),
    })).describe("Packages to get rates for"),
    account_id: z.number().optional().describe("Specific shipping account ID (optional, gets rates from all if omitted)"),
  },
  async (params) => {
    const key = params.integration_key || DEFAULT_KEY;
    const data = await shipiRequest("rates_api/shipi_rates.php", {
      integration_key: key,
      receiver_address: params.receiver_address,
      products: params.products.map((p) => ({
        prod_name: p.name || "Package",
        prod_weight: p.weight,
        prod_quantity: p.quantity || 1,
        prod_price: p.price || 0,
        prod_depth: p.length || 1,
        prod_width: p.width || 1,
        prod_height: p.height || 1,
      })),
      account_id: params.account_id,
    });
    return { content: [{ type: "text", text: toText(data) }] };
  }
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TOOL 7: schedule_pickup
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
server.tool(
  "schedule_pickup",
  "Schedule a carrier pickup for a shipment. The carrier will come to the shipper address to collect the package.",
  {
    integration_key: z.string().optional().describe("Shipi integration key"),
    order_id: z.string().describe("Order ID for the shipment"),
    carrier_type: z.string().describe("Carrier type: fedex, ups, dhl, etc."),
    pickup_date: z.string().optional().describe("Requested pickup date (YYYY-MM-DD)"),
    pickup_time: z.string().optional().describe("Preferred pickup time"),
  },
  async (params) => {
    const key = params.integration_key || DEFAULT_KEY;
    const meta = {};
    if (params.pickup_date) meta.pickup_date = params.pickup_date;
    if (params.pickup_time) meta.pickup_time = params.pickup_time;

    const data = await shipiRequest("pickup_api/create_pickup.php", {
      integrated_key: key,
      order_id: params.order_id,
      carrier_type: params.carrier_type,
      label: "d",
      meta,
    });
    return { content: [{ type: "text", text: toText(data) }] };
  }
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TOOL 8: track_shipment
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
server.tool(
  "track_shipment",
  "Get a tracking URL for a shipment. Supports auto-detection of carrier from tracking number format.",
  {
    tracking_number: z.string().describe("Tracking number"),
    carrier: z.string().optional().default("").describe("Carrier code: fedex, ups, dhl, usps, etc. (auto-detected if omitted)"),
  },
  async (params) => {
    const data = await shipiRequest("api/v1/tracking_url.php", {
      tracking_number: params.tracking_number,
      carrier: params.carrier || "",
    }, "GET");
    return { content: [{ type: "text", text: toText(data) }] };
  }
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TOOL 9: fetch_labels
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
server.tool(
  "fetch_labels",
  "Fetch shipping labels for printing. Filter by printed/unprinted status. Returns label URLs.",
  {
    integration_key: z.string().optional().describe("Shipi integration key"),
    page: z.number().optional().default(1).describe("Page number"),
    limit: z.number().optional().default(50).describe("Items per page (max 100)"),
    printed: z.string().optional().default("all").describe("Filter: 'printed', 'not_printed', or 'all'"),
  },
  async (params) => {
    const key = params.integration_key || DEFAULT_KEY;
    const data = await shipiRequest("label_api/fetch_labels.php", {
      integration_key: key,
      page: params.page,
      limit: params.limit,
      printed: params.printed,
    }, "GET");
    return { content: [{ type: "text", text: toText(data) }] };
  }
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TOOL 10: list_addresses
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
server.tool(
  "list_addresses",
  "List all saved addresses from the address book. Filter by type (shipper/receiver).",
  {
    integration_key: z.string().optional().describe("Shipi integration key"),
    type: z.string().optional().describe("Filter by type: 'shipper' or 'receiver'"),
  },
  async (params) => {
    const data = await shipiRequest("api/v1/addresses.php", {
      action: "list",
      ...params,
    }, "GET");
    return { content: [{ type: "text", text: toText(data) }] };
  }
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TOOL 11: get_address
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
server.tool(
  "get_address",
  "Get a specific address by ID from the address book.",
  {
    integration_key: z.string().optional().describe("Shipi integration key"),
    id: z.number().describe("Address ID"),
  },
  async (params) => {
    const data = await shipiRequest("api/v1/addresses.php", {
      action: "get",
      id: params.id,
      integration_key: params.integration_key,
    }, "GET");
    return { content: [{ type: "text", text: toText(data) }] };
  }
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TOOL 12: add_address
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
server.tool(
  "add_address",
  "Add a new address to the address book. Used for saving shipper or receiver addresses for reuse.",
  {
    integration_key: z.string().optional().describe("Shipi integration key"),
    type: z.string().optional().default("shipper").describe("Address type: 'shipper' or 'receiver'"),
    name: z.string().describe("Contact name"),
    company: z.string().optional().default("").describe("Company name"),
    mobile: z.string().optional().default("").describe("Phone number"),
    email: z.string().optional().default("").describe("Email address"),
    address1: z.string().describe("Street address line 1"),
    address2: z.string().optional().default("").describe("Street address line 2"),
    city: z.string().describe("City"),
    state: z.string().optional().default("").describe("State/province"),
    country: z.string().describe("Country code (US, CA, IN, etc.)"),
    postal: z.string().describe("Postal/ZIP code"),
    tax_id: z.string().optional().default("").describe("Tax ID / GSTIN / VAT number"),
  },
  async (params) => {
    const data = await shipiRequest("api/v1/addresses.php", {
      action: "add",
      ...params,
    });
    return { content: [{ type: "text", text: toText(data) }] };
  }
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TOOL 13: edit_address
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
server.tool(
  "edit_address",
  "Update an existing address in the address book. Only changed fields need to be provided.",
  {
    integration_key: z.string().optional().describe("Shipi integration key"),
    id: z.number().describe("Address ID to update"),
    type: z.string().optional().describe("Address type: 'shipper' or 'receiver'"),
    name: z.string().optional().describe("Contact name"),
    company: z.string().optional().describe("Company name"),
    mobile: z.string().optional().describe("Phone number"),
    email: z.string().optional().describe("Email address"),
    address1: z.string().optional().describe("Street address line 1"),
    address2: z.string().optional().describe("Street address line 2"),
    city: z.string().optional().describe("City"),
    state: z.string().optional().describe("State/province"),
    country: z.string().optional().describe("Country code"),
    postal: z.string().optional().describe("Postal/ZIP code"),
  },
  async (params) => {
    const data = await shipiRequest("api/v1/addresses.php", {
      action: "edit",
      ...params,
    });
    return { content: [{ type: "text", text: toText(data) }] };
  }
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TOOL 14: delete_address
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
server.tool(
  "delete_address",
  "Delete an address from the address book by ID.",
  {
    integration_key: z.string().optional().describe("Shipi integration key"),
    id: z.number().describe("Address ID to delete"),
  },
  async (params) => {
    const data = await shipiRequest("api/v1/addresses.php", {
      action: "delete",
      id: params.id,
      integration_key: params.integration_key,
    });
    return { content: [{ type: "text", text: toText(data) }] };
  }
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TOOL 15: list_carriers
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
server.tool(
  "list_carriers",
  "List all configured shipping carrier accounts. Shows carrier type, primary status, and shipper address. Credentials are never exposed.",
  {
    integration_key: z.string().optional().describe("Shipi integration key"),
  },
  async (params) => {
    const data = await shipiRequest("api/v1/carriers.php", {
      action: "list",
      ...params,
    }, "GET");
    return { content: [{ type: "text", text: toText(data) }] };
  }
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TOOL 16: get_carrier
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
server.tool(
  "get_carrier",
  "Get details of a specific carrier account by ID. Returns carrier type and shipper address info.",
  {
    integration_key: z.string().optional().describe("Shipi integration key"),
    id: z.number().describe("Carrier account ID"),
  },
  async (params) => {
    const data = await shipiRequest("api/v1/carriers.php", {
      action: "get",
      id: params.id,
      integration_key: params.integration_key,
    }, "GET");
    return { content: [{ type: "text", text: toText(data) }] };
  }
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TOOL 17: get_account_info
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
server.tool(
  "get_account_info",
  "Get Shipi account information including user details, store info, billing/balance, plan, and feature flags.",
  {
    integration_key: z.string().optional().describe("Shipi integration key"),
  },
  async (params) => {
    const data = await shipiRequest("api/v1/account.php", {
      ...params,
    }, "GET");
    return { content: [{ type: "text", text: toText(data) }] };
  }
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TOOL 18: get_shipping_stats
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
server.tool(
  "get_shipping_stats",
  "Get shipping statistics and analytics. View shipment counts, cost breakdowns, carrier usage, tracking status, and daily trends.",
  {
    integration_key: z.string().optional().describe("Shipi integration key"),
    period: z.string().optional().default("month").describe("Period: today, week, month, year, all"),
    date_from: z.string().optional().describe("Custom start date (YYYY-MM-DD)"),
    date_to: z.string().optional().describe("Custom end date (YYYY-MM-DD)"),
  },
  async (params) => {
    const data = await shipiRequest("api/v1/stats.php", {
      ...params,
    }, "GET");
    return { content: [{ type: "text", text: toText(data) }] };
  }
);

// ─── Start Server ───────────────────────────────────────────────────
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Shipi MCP Server running (stdio transport)");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
