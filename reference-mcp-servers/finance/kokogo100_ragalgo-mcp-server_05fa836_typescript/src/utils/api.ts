/**
 * RagAlgo API 유틸리티
 * Supabase Edge Functions 호출
 */


// ============================================================================
// [CACHE] 5분 메모리 캐시 - Supabase 비용 절감
// ============================================================================
interface CacheEntry<T> {
    data: T;
    timestamp: number;
}

const CACHE_TTL_MS = 5 * 60 * 1000; // 5분
const cache = new Map<string, CacheEntry<unknown>>();

function getCacheKey(endpoint: string, params?: Record<string, string | number | undefined>): string {
    const sortedParams = params
        ? Object.entries(params)
            .filter(([, v]) => v !== undefined)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([k, v]) => `${k}=${v}`)
            .join('&')
        : '';
    return `${endpoint}?${sortedParams}`;
}

function getFromCache<T>(key: string): T | null {
    const entry = cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > CACHE_TTL_MS) {
        cache.delete(key);
        return null;
    }

    return entry.data as T;
}

function setCache<T>(key: string, data: T): void {
    // 캐시 크기 제한 (최대 100개)
    if (cache.size > 100) {
        const oldestKey = cache.keys().next().value;
        if (oldestKey) cache.delete(oldestKey);
    }

    cache.set(key, {
        data,
        timestamp: Date.now()
    });
}

// 캐시 통계 (디버그용)
let cacheHits = 0;
let cacheMisses = 0;

// ============================================================================

// [CHANGED] Dynamic URL Support
// If SUPABASE_URL is injected (from Desktop .env), use it. Otherwise fallback to hardcoded (Public default).
const DEFAULT_URL = 'https://xunrsikkybgxkybjzrgz.supabase.co/functions/v1';
const SUPABASE_URL = (process.env.SUPABASE_URL ? `${process.env.SUPABASE_URL}/functions/v1` : DEFAULT_URL).replace(/\/+$/, ''); // Remove trailing slash if double

// [DEBUG] Log active configuration
console.error(`[API Init] Target URL: ${SUPABASE_URL}`);
console.error(`[API Init] Env Override: ${!!process.env.SUPABASE_URL}`);

// [CHANGED] Get Keys from Environment (Injected by mcp_manager.py)
const getKeys = () => {
    const apiKey = process.env.RAGALGO_API_KEY;
    const anonKey = process.env.SUPABASE_ANON_KEY;

    if (!apiKey) {
        throw new Error('RAGALGO_API_KEY environment variable is missing.');
    }
    if (!anonKey) {
        // Fallback for local testing if not injected, but log warning
        console.error('[API] Warning: SUPABASE_ANON_KEY not found in env. Calls may fail.');
    }
    // [FALLBACK] Hardcoded Anon Key for reliability
    const fallbackAnon = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1bnJzaWtreWJneGt5Ymp6cmd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0NTExNTgsImV4cCI6MjA4MDAyNzE1OH0.SsXri828-Rf0gHlu4Bls-pewhfMNNII4mbiuLnc9ACs";
    return { apiKey, anonKey: anonKey || fallbackAnon };
};

// API 호출 기본 함수 (5분 캐시 적용)
export async function callApi<T>(
    endpoint: string,
    params?: Record<string, string | number | undefined>
): Promise<T> {
    // [CACHE] 캐시 확인
    const cacheKey = getCacheKey(endpoint, params);
    const cachedData = getFromCache<T>(cacheKey);

    if (cachedData !== null) {
        cacheHits++;
        console.error(`[CACHE HIT] ${endpoint} (hits: ${cacheHits}, misses: ${cacheMisses})`);
        return cachedData;
    }

    cacheMisses++;
    console.error(`[CACHE MISS] ${endpoint} (hits: ${cacheHits}, misses: ${cacheMisses})`);

    const { apiKey, anonKey } = getKeys();

    const url = new URL(`${SUPABASE_URL}/${endpoint}`);
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) {
                url.searchParams.append(key, String(value));
            }
        });
    }

    const headers: Record<string, string> = {
        'Authorization': `Bearer ${anonKey.trim()}`,
        'apikey': anonKey.trim(),
        'x-api-key': apiKey.trim(),
        'Content-Type': 'application/json',
    };

    const response = await fetch(url.toString(), {
        method: 'GET',
        headers: headers,
    });

    if (!response.ok) {
        const error = await response.text();
        const debugInfo = `[DEBUG] keys_present=${!!anonKey}, URL: ${url.toString()}`;

        if (response.status === 429) {
            throw new Error(`[RATE LIMIT EXCEEDED] API 요청 제한에 도달했습니다. 잠시 후 다시 시도하거나 요청량을 줄여주세요. (Plan Quota Exceeded) | ${debugInfo}`);
        }
        throw new Error(`API 호출 실패: ${response.status} - ${error} | ${debugInfo}`);
    }

    const data = await response.json() as T;

    // [CACHE] 성공 시 캐시에 저장
    setCache(cacheKey, data);

    return data;
}

// POST API 호출 (POST는 캐시하지 않음 - 데이터 변경 가능성)
export async function callApiPost<T>(
    endpoint: string,
    body: Record<string, unknown>
): Promise<T> {
    const { apiKey, anonKey } = getKeys();
    const url = `${SUPABASE_URL}/${endpoint}`;

    const headers: Record<string, string> = {
        'Authorization': `Bearer ${anonKey.trim()}`,
        'apikey': anonKey.trim(),
        'x-api-key': apiKey.trim(), // [FIX] anonKey → apiKey 수정
        'Content-Type': 'application/json',
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const error = await response.text();
        if (response.status === 429) {
            throw new Error(`[RATE LIMIT EXCEEDED] API 요청 제한에 도달했습니다. 잠시 후 다시 시도하거나 요청량을 줄여주세요. (Plan Quota Exceeded)`);
        }
        throw new Error(`API 호출 실패: ${response.status} - ${error}`);
    }

    return response.json();
}
