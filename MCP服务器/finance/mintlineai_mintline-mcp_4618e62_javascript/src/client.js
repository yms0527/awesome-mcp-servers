const BASE_URL = process.env.MINTLINE_API_URL || "https://api.mintline.ai";

export function createClient(apiKey) {
  if (!apiKey) {
    throw new Error("MINTLINE_API_KEY is required");
  }

  async function request(method, path, body) {
    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    let data;
    try {
      data = await res.json();
    } catch {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    if (!data.success) {
      const errorMsg = data.error?.message || data.message || `Request failed (${res.status})`;
      throw new Error(errorMsg);
    }

    return data;
  }

  return {
    // Receipts
    async listReceipts(params = {}) {
      const query = new URLSearchParams();
      if (params.limit) query.set("limit", params.limit);
      if (params.offset) query.set("offset", params.offset);
      if (params.search) query.set("q", params.search);
      if (params.status) query.set("status", params.status);
      const qs = query.toString();
      return request("GET", `/api/receipts${qs ? `?${qs}` : ""}`);
    },

    async getReceipt(id) {
      return request("GET", `/api/receipts/${id}`);
    },

    // Transactions
    async listTransactions(params = {}) {
      const query = new URLSearchParams();
      if (params.limit) query.set("limit", params.limit);
      if (params.offset) query.set("offset", params.offset);
      if (params.search) query.set("q", params.search);
      if (params.status) query.set("status", params.status);
      if (params.statementId) query.set("statementId", params.statementId);
      const qs = query.toString();
      return request("GET", `/api/transactions${qs ? `?${qs}` : ""}`);
    },

    async getTransaction(id) {
      return request("GET", `/api/transactions/${id}`);
    },

    // Statements
    async listStatements(params = {}) {
      const query = new URLSearchParams();
      if (params.limit) query.set("limit", params.limit);
      if (params.offset) query.set("offset", params.offset);
      const qs = query.toString();
      return request("GET", `/api/statements${qs ? `?${qs}` : ""}`);
    },

    // Matches
    async listMatches(params = {}) {
      const query = new URLSearchParams();
      if (params.limit) query.set("limit", params.limit);
      if (params.offset) query.set("offset", params.offset);
      if (params.status) query.set("status", params.status);
      const qs = query.toString();
      return request("GET", `/api/matches${qs ? `?${qs}` : ""}`);
    },

    async confirmMatch(id) {
      return request("POST", `/api/matches/${id}/confirm`);
    },

    async rejectMatch(id, reason) {
      return request("POST", `/api/matches/${id}/reject`, { reason });
    },

    // Analytics
    async getSpendingSummary(params = {}) {
      const query = new URLSearchParams();
      if (params.groupBy) query.set("groupBy", params.groupBy);
      if (params.dateFrom) query.set("dateFrom", params.dateFrom);
      if (params.dateTo) query.set("dateTo", params.dateTo);
      if (params.vendorId) query.set("vendorId", params.vendorId);
      if (params.limit) query.set("limit", params.limit);
      const qs = query.toString();
      return request("GET", `/api/analytics/spending${qs ? `?${qs}` : ""}`);
    },

    async getTopVendors(params = {}) {
      const query = new URLSearchParams();
      if (params.limit) query.set("limit", params.limit);
      const qs = query.toString();
      return request("GET", `/api/analytics/top-vendors${qs ? `?${qs}` : ""}`);
    },

    async getSpendingTrends(params = {}) {
      const query = new URLSearchParams();
      if (params.months) query.set("months", params.months);
      const qs = query.toString();
      return request("GET", `/api/analytics/trends${qs ? `?${qs}` : ""}`);
    },

    async getUnmatchedSummary() {
      return request("GET", `/api/analytics/unmatched`);
    },
  };
}
