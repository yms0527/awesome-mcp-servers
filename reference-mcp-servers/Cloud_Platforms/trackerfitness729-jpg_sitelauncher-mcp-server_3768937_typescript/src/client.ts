import type {
  DeployRequest,
  DeployResponse,
  CheckDomainResponse,
  OrderStatusResponse,
  MySitesResponse,
  ParentDomainsResponse,
  DomainCapacityResponse,
  HealthResponse,
} from "./types.js";

const API_BASE = process.env.SITELAUNCHER_API_URL || "https://sitelauncher.xyz/api";

async function apiGet<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${API_BASE}${path}`);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      url.searchParams.set(k, v);
    }
  }
  const resp = await fetch(url.toString(), {
    headers: { "Accept": "application/json" },
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`API error ${resp.status}: ${text}`);
  }
  return resp.json() as Promise<T>;
}

async function apiPost<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const resp = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`API error ${resp.status}: ${text}`);
  }
  return resp.json() as Promise<T>;
}

export async function deploySite(req: DeployRequest): Promise<DeployResponse> {
  return apiPost<DeployResponse>("/order", req as unknown as Record<string, unknown>);
}

export async function checkDomain(name: string): Promise<CheckDomainResponse> {
  return apiGet<CheckDomainResponse>("/check-domain", { name });
}

export async function orderStatus(txHash: string): Promise<OrderStatusResponse> {
  return apiGet<OrderStatusResponse>("/order-status", { tx: txHash });
}

export async function mySites(wallet: string): Promise<MySitesResponse> {
  return apiGet<MySitesResponse>("/my-sites", { wallet });
}

export async function parentDomains(): Promise<ParentDomainsResponse> {
  return apiGet<ParentDomainsResponse>("/parent-domains");
}

export async function domainCapacity(): Promise<DomainCapacityResponse> {
  return apiGet<DomainCapacityResponse>("/domain-capacity");
}

export async function health(): Promise<HealthResponse> {
  return apiGet<HealthResponse>("/health");
}
