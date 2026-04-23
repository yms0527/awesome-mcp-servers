export const tools = [
  {
    name: "list_receipts",
    description: "List receipts with optional filtering. Use this to find receipts by vendor name, date range, or match status.",
    inputSchema: {
      type: "object",
      properties: {
        search: {
          type: "string",
          description: "Search by vendor name",
        },
        status: {
          type: "string",
          enum: ["all", "matched", "unmatched", "hidden"],
          description: "Filter by match status",
        },
        limit: {
          type: "number",
          description: "Max results to return (default 20)",
        },
      },
    },
  },
  {
    name: "get_receipt",
    description: "Get detailed information about a specific receipt including line items and matched transaction.",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "Receipt ID (e.g., rcpt_01abc123)",
        },
      },
      required: ["id"],
    },
  },
  {
    name: "list_transactions",
    description: "List bank transactions with optional filtering. Use this to find transactions by description or match status.",
    inputSchema: {
      type: "object",
      properties: {
        search: {
          type: "string",
          description: "Search by transaction description",
        },
        status: {
          type: "string",
          enum: ["all", "matched", "unmatched", "hidden"],
          description: "Filter by match status",
        },
        statementId: {
          type: "string",
          description: "Filter by bank statement ID",
        },
        limit: {
          type: "number",
          description: "Max results to return (default 20)",
        },
      },
    },
  },
  {
    name: "get_transaction",
    description: "Get detailed information about a specific bank transaction.",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "Transaction ID (e.g., btxn_01abc123)",
        },
      },
      required: ["id"],
    },
  },
  {
    name: "list_statements",
    description: "List uploaded bank statements.",
    inputSchema: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "Max results to return (default 20)",
        },
      },
    },
  },
  {
    name: "list_matches",
    description: "List proposed matches between receipts and transactions. Use this to review matches that need confirmation.",
    inputSchema: {
      type: "object",
      properties: {
        status: {
          type: "string",
          enum: ["proposed", "confirmed", "rejected"],
          description: "Filter by match status (default: proposed)",
        },
        limit: {
          type: "number",
          description: "Max results to return (default 20)",
        },
      },
    },
  },
  {
    name: "confirm_match",
    description: "Confirm a proposed match between a receipt and transaction. This links them together permanently.",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "Match ID to confirm",
        },
      },
      required: ["id"],
    },
  },
  {
    name: "reject_match",
    description: "Reject a proposed match. The receipt and transaction will not be suggested as a match again.",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "Match ID to reject",
        },
        reason: {
          type: "string",
          description: "Optional reason for rejection",
        },
      },
      required: ["id"],
    },
  },
  {
    name: "spending_summary",
    description: "Get spending summary with flexible grouping. Use this to answer questions like 'How much did I spend this month?' or 'What are my expenses by vendor?'",
    inputSchema: {
      type: "object",
      properties: {
        groupBy: {
          type: "string",
          enum: ["total", "vendor", "month", "week", "day"],
          description: "How to group the spending data (default: total)",
        },
        dateFrom: {
          type: "string",
          description: "Start date (YYYY-MM-DD)",
        },
        dateTo: {
          type: "string",
          description: "End date (YYYY-MM-DD)",
        },
        vendorId: {
          type: "string",
          description: "Filter by specific vendor ID",
        },
        limit: {
          type: "number",
          description: "Max results for grouped queries (default 20)",
        },
      },
    },
  },
  {
    name: "top_vendors",
    description: "Get top vendors ranked by total spending. Use this to answer 'Who are my biggest vendors?' or 'Where do I spend the most?'",
    inputSchema: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "Number of vendors to return (default 10)",
        },
      },
    },
  },
  {
    name: "spending_trends",
    description: "Get monthly spending trends over time. Use this to answer 'How has my spending changed?' or 'Show me spending trends'",
    inputSchema: {
      type: "object",
      properties: {
        months: {
          type: "number",
          description: "Number of months to include (default 6)",
        },
      },
    },
  },
  {
    name: "unmatched_summary",
    description: "Get a summary of items needing attention: unmatched receipts, transactions without receipts, and proposed matches to review. Use this for 'What needs my attention?' or 'Do I have unmatched expenses?'",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
];

export async function handleTool(client, name, args) {
  switch (name) {
    case "list_receipts": {
      const result = await client.listReceipts({
        search: args.search,
        status: args.status,
        limit: args.limit || 20,
      });
      return formatReceipts(result.data);
    }

    case "get_receipt": {
      const result = await client.getReceipt(args.id);
      return formatReceiptDetail(result.data);
    }

    case "list_transactions": {
      const result = await client.listTransactions({
        search: args.search,
        status: args.status,
        statementId: args.statementId,
        limit: args.limit || 20,
      });
      return formatTransactions(result.data);
    }

    case "get_transaction": {
      const result = await client.getTransaction(args.id);
      return formatTransaction(result.data);
    }

    case "list_statements": {
      const result = await client.listStatements({
        limit: args.limit || 20,
      });
      return formatStatements(result.data);
    }

    case "list_matches": {
      const result = await client.listMatches({
        status: args.status || "proposed",
        limit: args.limit || 20,
      });
      return formatMatches(result.data);
    }

    case "confirm_match": {
      await client.confirmMatch(args.id);
      return `Match ${args.id} confirmed successfully.`;
    }

    case "reject_match": {
      await client.rejectMatch(args.id, args.reason);
      return `Match ${args.id} rejected.${args.reason ? ` Reason: ${args.reason}` : ""}`;
    }

    case "spending_summary": {
      const result = await client.getSpendingSummary({
        groupBy: args.groupBy || "total",
        dateFrom: args.dateFrom,
        dateTo: args.dateTo,
        vendorId: args.vendorId,
        limit: args.limit || 20,
      });
      return formatSpendingSummary(result.data, args.groupBy || "total");
    }

    case "top_vendors": {
      const result = await client.getTopVendors({
        limit: args.limit || 10,
      });
      return formatTopVendors(result.data.vendors);
    }

    case "spending_trends": {
      const result = await client.getSpendingTrends({
        months: args.months || 6,
      });
      return formatSpendingTrends(result.data.trends);
    }

    case "unmatched_summary": {
      const result = await client.getUnmatchedSummary();
      return formatUnmatchedSummary(result.data);
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

function formatReceipts(receipts) {
  if (!receipts?.length) return "No receipts found.";

  return receipts.map((r) =>
    `• ${r.id}: ${r.vendor?.name || r.vendorName || "Unknown"} - ${r.totalAmount || "?"} ${r.currency || ""} (${r.purchaseDate ? new Date(r.purchaseDate).toLocaleDateString() : "no date"})`
  ).join("\n");
}

function formatReceiptDetail(r) {
  let text = `Receipt: ${r.id}\n`;
  text += `Vendor: ${r.vendor?.name || r.vendorName || "Unknown"}\n`;
  text += `Date: ${r.purchaseDate ? new Date(r.purchaseDate).toLocaleDateString() : "N/A"}\n`;
  text += `Total: ${r.totalAmount || "?"} ${r.currency || ""}\n`;

  if (r.items?.length) {
    text += `\nLine Items:\n`;
    r.items.forEach((item) => {
      text += `  • ${item.description}: ${item.totalPrice}\n`;
    });
  }

  if (r.matchedTransaction) {
    text += `\nMatched to: ${r.matchedTransaction.id} - ${r.matchedTransaction.description}`;
  }

  return text;
}

function formatTransactions(transactions) {
  if (!transactions?.length) return "No transactions found.";

  return transactions.map((t) =>
    `• ${t.id}: ${t.description} - ${t.amount} ${t.currency || ""} (${t.transactionDate ? new Date(t.transactionDate).toLocaleDateString() : "no date"})`
  ).join("\n");
}

function formatTransaction(t) {
  let text = `Transaction: ${t.id}\n`;
  text += `Description: ${t.description}\n`;
  text += `Amount: ${t.amount} ${t.currency || ""}\n`;
  text += `Date: ${t.transactionDate ? new Date(t.transactionDate).toLocaleDateString() : "N/A"}\n`;
  text += `Type: ${t.transactionType || "N/A"}`;
  return text;
}

function formatStatements(statements) {
  if (!statements?.length) return "No statements found.";

  return statements.map((s) =>
    `• ${s.id}: ${s.institutionName} - ${s.statementDate ? new Date(s.statementDate).toLocaleDateString() : "no date"} (${s.transactionCount || 0} transactions)`
  ).join("\n");
}

function formatMatches(matches) {
  if (!matches?.length) return "No matches found.";

  return matches.map((m) =>
    `• ${m.id}: Receipt ${m.receiptId} ↔ Transaction ${m.transactionId} (${Math.round(m.confidenceScore * 100)}% confidence) [${m.status}]`
  ).join("\n");
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function formatSpendingSummary(data, groupBy) {
  if (groupBy === "total" && data.summary) {
    const s = data.summary;
    let text = `Spending Summary (${data.period.from} to ${data.period.to})\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `Total Spent: ${formatCurrency(s.totalAmount)}\n`;
    text += `Receipt Count: ${s.receiptCount}\n`;
    text += `Average: ${formatCurrency(s.averageAmount)}\n`;
    text += `Min: ${formatCurrency(s.minAmount)} | Max: ${formatCurrency(s.maxAmount)}`;
    return text;
  }

  if (!data.data?.length) return "No spending data found for this period.";

  let text = `Spending by ${groupBy} (${data.period.from} to ${data.period.to})\n`;
  text += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;

  if (groupBy === "vendor") {
    data.data.forEach((item, i) => {
      text += `${i + 1}. ${item.vendorName}: ${formatCurrency(item.totalAmount)} (${item.receiptCount} receipts)\n`;
    });
  } else {
    data.data.forEach((item) => {
      text += `• ${item.period}: ${formatCurrency(item.totalAmount)} (${item.receiptCount} receipts)\n`;
    });
  }

  return text;
}

function formatTopVendors(vendors) {
  if (!vendors?.length) return "No vendor data found.";

  let text = `Top Vendors by Spending\n`;
  text += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;

  vendors.forEach((v, i) => {
    text += `${i + 1}. ${v.name}: ${formatCurrency(v.total)} (${v.count} receipts)\n`;
  });

  return text;
}

function formatSpendingTrends(trends) {
  if (!trends?.length) return "No trend data found.";

  let text = `Monthly Spending Trends\n`;
  text += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;

  trends.forEach((t) => {
    const bar = "█".repeat(Math.min(20, Math.round(t.total / 100)));
    text += `${t.month}: ${formatCurrency(t.total)} ${bar}\n`;
  });

  return text;
}

function formatUnmatchedSummary(data) {
  let text = `Action Items Summary\n`;
  text += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

  text += `📋 Proposed Matches to Review: ${data.proposedMatches.count}\n`;
  text += `📄 Unmatched Receipts: ${data.unmatchedReceipts.count} (${formatCurrency(data.unmatchedReceipts.totalAmount)})\n`;
  text += `💳 Unmatched Transactions: ${data.unmatchedTransactions.count} (${formatCurrency(data.unmatchedTransactions.totalAmount)})\n`;
  text += `⚠️  Large Transactions (>${formatCurrency(data.largeUnmatchedTransactions.threshold)}) without receipts: ${data.largeUnmatchedTransactions.count}\n\n`;

  text += `${data.actionItems.message}`;

  return text;
}
