import type { DeployRequest, DeployResponse, CheckDomainResponse, OrderStatusResponse, MySitesResponse, ParentDomainsResponse, DomainCapacityResponse, HealthResponse } from "./types.js";
export declare function deploySite(req: DeployRequest): Promise<DeployResponse>;
export declare function checkDomain(name: string): Promise<CheckDomainResponse>;
export declare function orderStatus(txHash: string): Promise<OrderStatusResponse>;
export declare function mySites(wallet: string): Promise<MySitesResponse>;
export declare function parentDomains(): Promise<ParentDomainsResponse>;
export declare function domainCapacity(): Promise<DomainCapacityResponse>;
export declare function health(): Promise<HealthResponse>;
