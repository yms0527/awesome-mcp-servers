/**
 * 차트 관련 MCP Tools
 */

import { z } from 'zod';
import { callApi } from '../utils/api.js';

// 주식 차트 파라미터 스키마
export const ChartStockParamsSchema = z.object({
    ticker: z.string().optional().describe('종목 코드 (예: 005930)'),
    market: z.enum(['KOSPI', 'KOSDAQ', 'US', 'JP', 'UK']).optional().describe('시장 구분 (KOSPI/KOSDAQ/US/JP/UK)'),
    zone: z.enum(['STRONG_UP', 'UP_ZONE', 'NEUTRAL', 'DOWN_ZONE', 'STRONG_DOWN']).optional().describe('차트 구간'),
    limit: z.number().min(1).max(100).default(20).describe('결과 수'),
});

// 코인 차트 파라미터 스키마
export const ChartCoinParamsSchema = z.object({
    ticker: z.string().optional().describe('코인 코드 (예: KRW-BTC)'),
    zone: z.enum(['STRONG_UP', 'UP_ZONE', 'NEUTRAL', 'DOWN_ZONE', 'STRONG_DOWN']).optional().describe('차트 구간'),
    limit: z.number().min(1).max(100).default(20).describe('결과 수'),
});

export type ChartStockParams = z.infer<typeof ChartStockParamsSchema>;
export type ChartCoinParams = z.infer<typeof ChartCoinParamsSchema>;

// 주식 차트 조회
export async function getChartStock(params: ChartStockParams) {
    const endpoint = 'chart-stock';
    // params passes through directly as query params
    const result = await callApi<{
        success: boolean;
        data: {
            ticker: string;
            name: string;
            market: string;
            scores: number[];
            zone: string;
            oscillator_state: string;
            analysis?: {          // Added specific analysis fields
                weekly_zone: string;
                daily_momentum: string;
                daily_signal: string;
            };
            outlook?: string;     // Added outlook field
            chart_history?: any;  // Added for AI Context
            last_price: number;
            updated_at: string;
        } | Array<{
            ticker: string;
            name: string;
            market: string;
            zone: string;
            last_price: number;
        }>;
    }>(endpoint, params);

    return result;
}

// 코인 차트 조회
export async function getChartCoin(params: ChartCoinParams) {
    const endpoint = 'chart-coin';

    const result = await callApi<{
        success: boolean;
        data: {
            ticker: string;
            name: string;
            scores: number[];
            zone: string;
            oscillator_state: string;
            analysis?: {          // Added specific analysis fields
                weekly_zone: string;
                daily_momentum: string;
                daily_signal: string;
            };
            outlook?: string;     // Added outlook field
            chart_history?: any;  // Added for AI Context
            last_price: number;
            updated_at: string;
        } | Array<{
            ticker: string;
            name: string;
            zone: string;
            last_price: number;
        }>;
    }>(endpoint, params);

    return result;
}
