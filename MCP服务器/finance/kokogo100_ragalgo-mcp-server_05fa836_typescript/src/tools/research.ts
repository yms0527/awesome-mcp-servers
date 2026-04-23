/**
 * Research (보고서) 관련 MCP Tools
 */

import { z } from 'zod';
import { callApi } from '../utils/api.js';

// Research 파라미터 스키마
export const ResearchParamsSchema = z.object({
    tag_code: z.string().optional().describe('Tag code filter (e.g., STK005930, USTK_AAPL)'),
    source: z.string().optional().describe('Source filter (e.g., mckinsey, bcg, ls)'),
    limit: z.number().min(1).max(50).default(10).describe('Result count (default: 10)'),
    offset: z.number().min(0).default(0).describe('Pagination offset'),
});

export type ResearchParams = z.infer<typeof ResearchParamsSchema>;

// Research 보고서 조회
export async function getResearch(params: ResearchParams) {
    const endpoint = 'research';

    const result = await callApi<{
        success: boolean;
        data: Array<{
            id: number;
            title: string;
            summary: string;
            tag_codes: string[];
            created_at: string;
            processed_at: string;
            source: string;
            market_outlook?: string;
        }>;
        meta: { count: number; limit: number; offset: number };
    }>(endpoint, params);

    return result;
}
