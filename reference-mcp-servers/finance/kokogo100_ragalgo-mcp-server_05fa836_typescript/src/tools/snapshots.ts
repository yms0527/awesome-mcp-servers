/**
 * 스냅샷 관련 MCP Tools
 */

import { z } from 'zod';
import { callApi } from '../utils/api.js';

// 스냅샷 파라미터 스키마
export const SnapshotsParamsSchema = z.object({
    tag_code: z.string().optional().describe('태그 코드 (예: STK005930)'),
    market: z.enum(['KR', 'US', 'JP', 'UK', 'UNIFIED', 'CRY', 'FUTURES']).optional().describe('시장 구분 (KR/US/JP/UK/UNIFIED/CRY/FUTURES)'),
    date: z.string().optional().describe('날짜 (YYYY-MM-DD)'),
    days: z.number().min(1).default(7).describe('최근 N일 (기본: 7, 무제한)'),
    limit: z.number().min(1).default(50).describe('결과 수 (기본: 50, 무제한)'),
    offset: z.number().min(0).default(0).describe('페이지네이션 오프셋'),
});

export type SnapshotsParams = z.infer<typeof SnapshotsParamsSchema>;

// 스냅샷 조회
// [IMPORTANT] Snapshots are generated daily at 17:00 KST (market close).
// If you request 'today' and get no results (because it's morning in KST),
// you MUST:
// 1. Fetch 'yesterday's snapshot for context.
// 2. Call 'get_news_scored' to get REAL-TIME news for the current day.
export async function getSnapshots(params: SnapshotsParams) {
    const endpoint = 'snapshots';
    const { tag_code, ...queryParams } = params;
    // 태그 코드가 있으면 쿼리 파라미터에 추가
    if (tag_code) {
        (queryParams as any).tag_code = tag_code;
    }
    if (params.market) {
        (queryParams as any).market = params.market;
    }

    const result = await callApi<{
        success: boolean;
        data: Array<{
            tag_code: string;
            snapshot_date: string;
            news_count: number;
            news_avg_score: number;
            news_max_score: number;
            news_min_score: number;
            news_bullish_count: number;
            news_bearish_count: number;
            news_neutral_count: number;
            research_count?: number;        // Added
            research_outlook?: string;      // Added
            chart_score: number;
            chart_zone: string;
            last_price: number;
        }>;
        meta: { count: number; date?: string; days?: number };
    }>(endpoint, queryParams);

    return result;
}
