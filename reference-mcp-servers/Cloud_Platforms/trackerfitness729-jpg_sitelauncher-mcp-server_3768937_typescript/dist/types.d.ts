export interface DeployRequest {
    service: string;
    txHash: string;
    subdomain?: string;
    parent_domain?: string;
    custom_domain?: string;
    token_name?: string;
    description?: string;
    ticker?: string;
    chain?: string;
    contract_address?: string;
    logo_url?: string;
    twitter_url?: string;
    telegram_url?: string;
    discord_url?: string;
    primary_color?: string;
    secondary_color?: string;
}
export interface DeployResponse {
    success: boolean;
    url?: string;
    admin_token?: string;
    message?: string;
    domain?: string;
    error?: string;
    warnings?: string[];
    tx_hash?: string;
}
export interface CheckDomainResponse {
    available: boolean;
    premium: boolean;
    error?: string;
}
export interface OrderStatusResponse {
    error?: string;
    stage?: string;
    completed?: boolean;
    [key: string]: unknown;
}
export interface MySitesResponse {
    sites: Array<Record<string, unknown>>;
    count: number;
}
export interface ParentDomainsResponse {
    domains: string[];
}
export interface DomainCapacityResponse {
    available: boolean;
    remaining: number;
    limit: number;
    resets_in: string;
}
export interface HealthResponse {
    status: string;
    parent_domain: string;
    dry_run: boolean;
    services: string[];
}
