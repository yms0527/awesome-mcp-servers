/**
 * 트렌드 관련 MCP Tools
 */

import { z } from 'zod';
import { callApi } from '../utils/api.js';

// 트렌드 파라미터 스키마
export const TrendsParamsSchema = z.object({
    tag_code: z.string().describe('태그 코드 (예: STK005930)'),
    days: z.number().min(1).max(30).default(7).describe('최근 N일 (기본: 7)'),
});

export type TrendsParams = z.infer<typeof TrendsParamsSchema>;

// 트렌드 조회
export async function getTrends(params: TrendsParams) {
    const result = await callApi<{
        success: boolean;
        tag: {
            code: string;
            name: string;
            type: string;
            name_en?: string;
        };
        trend: Array<{
            date: string;
            count: number;
            avg_score: number;
        }>;
        meta: { days: number; total_news: number };
    }>('trends', params);

    return result;
}
