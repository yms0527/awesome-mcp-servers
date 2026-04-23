/**
 * 뉴스 관련 MCP Tools
 */

import { z } from 'zod';
import { callApi } from '../utils/api.js';

// 뉴스 파라미터 스키마
export const NewsParamsSchema = z.object({
    tag_code: z.string().optional().describe('태그 코드 (search_tags 결과값, 예: STK005930, THM001)'),
    source: z.string().optional().describe('소스 필터 (예: 한경, 매경, WSJ, Bloomberg)'),
    search: z.string().optional().describe('제목 검색어'),
    from_date: z.string().optional().describe('시작일 (YYYY-MM-DD)'),
    to_date: z.string().optional().describe('종료일 (YYYY-MM-DD)'),
    start_date: z.string().optional().describe('시작일 (from_date의 별칭)'), // [FIX] LLM Alias support
    end_date: z.string().optional().describe('종료일 (to_date의 별칭)'),     // [FIX] LLM Alias support
    limit: z.number().min(1).max(100).default(20).describe('결과 수 (기본: 20, 최대: 100)'),
    offset: z.number().min(0).default(0).describe('페이지네이션 오프셋'),
}); // [MOD] Removed .strict()

// 점수 포함 뉴스 파라미터 스키마
export const NewsScoredParamsSchema = NewsParamsSchema.extend({
    min_score: z.number().min(-10).max(10).optional().describe('최소 감정 점수 (-10~10)'),
    max_score: z.number().min(-10).max(10).optional().describe('최대 감정 점수 (-10~10)'),
    verdict: z.enum(['bullish', 'bearish', 'neutral']).optional().describe('판정 필터'),
    market: z.string().optional().describe('시장 필터 (KR, US 등) - 호환성 유지용'), // [FIX] LLM Compatibility
}); // [MOD] Removed .strict()

export type NewsParams = z.infer<typeof NewsParamsSchema>;
export type NewsScoredParams = z.infer<typeof NewsScoredParamsSchema>;

// 뉴스 조회 (점수 제외)
export async function getNews(params: NewsParams) {
    console.error(`[getNews] Params: ${JSON.stringify(params)}`); // [DEBUG]
    const { tag_code, start_date, end_date, ...rest } = params;

    // [FIX] Handle Aliases
    const apiParams: any = { ...rest, tag: tag_code };
    if (start_date && !apiParams.from_date) apiParams.from_date = start_date;
    if (end_date && !apiParams.to_date) apiParams.to_date = end_date;

    const result = await callApi<{
        success: boolean;
        data: Array<{
            id: number;
            title: string;
            summary: string;
            tags: string[];
            url: string;
            source: string;
            created_at: string;
        }>;
        meta: { count: number; tier: string };
    }>('news', apiParams);

    return result;
}

// 뉴스 조회 (점수 포함)
export async function getNewsScored(params: NewsScoredParams) {
    console.error(`[getNewsScored] Params: ${JSON.stringify(params)}`); // [DEBUG]
    const { tag_code, start_date, end_date, ...rest } = params; // [FIXED] Include 'market' in API call by not destructuring it from rest (it's inside rest now or handled by type)

    // [FIX] Handle Aliases
    const apiParams: any = { ...rest, tag: tag_code };
    if (start_date && !apiParams.from_date) apiParams.from_date = start_date;
    if (end_date && !apiParams.to_date) apiParams.to_date = end_date;

    const result = await callApi<{
        success: boolean;
        data: Array<{
            id: number;
            title: string;
            summary: string;
            tags: string[];
            sentiment_score: number;
            verdict: string;
            url: string;
            source: string;
            created_at: string;
        }>;
        meta: { count: number; tier: string };
    }>('news-scored', apiParams);

    return result;
}
