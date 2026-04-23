const API_BASE = process.env.SITELAUNCHER_API_URL || "https://sitelauncher.xyz/api";
async function apiGet(path, params) {
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
    return resp.json();
}
async function apiPost(path, body) {
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
    return resp.json();
}
export async function deploySite(req) {
    return apiPost("/order", req);
}
export async function checkDomain(name) {
    return apiGet("/check-domain", { name });
}
export async function orderStatus(txHash) {
    return apiGet("/order-status", { tx: txHash });
}
export async function mySites(wallet) {
    return apiGet("/my-sites", { wallet });
}
export async function parentDomains() {
    return apiGet("/parent-domains");
}
export async function domainCapacity() {
    return apiGet("/domain-capacity");
}
export async function health() {
    return apiGet("/health");
}
