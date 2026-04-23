/**
 * 재무제표 관련 MCP Tools
 */

import { z } from 'zod';
import { callApi } from '../utils/api.js';

// 재무제표 파라미터 스키마
export const FinancialsParamsSchema = z.object({
    ticker: z.string().optional().describe('종목 코드 (예: 005930)'),
    period: z.string().optional().describe('분기 (예: 2024Q3)'),
    market: z.enum(['KOSPI', 'KOSDAQ', 'US', 'JP', 'UK']).optional().describe('시장 구분 (KOSPI/KOSDAQ/US/JP/UK)'),
    periods: z.number().min(1).max(8).default(4).describe('최근 N분기 (기본: 4)'),
    limit: z.number().min(1).max(200).default(50).describe('결과 수'),
    offset: z.number().min(0).default(0).describe('페이지네이션 오프셋'),
});

export type FinancialsParams = z.infer<typeof FinancialsParamsSchema>;

// 재무제표 조회
export async function getFinancials(params: FinancialsParams) {
    const endpoint = params.ticker ? `financials/${params.ticker}` : 'financials';
    const { ticker, ...queryParams } = params;

    const result = await callApi<{
        success: boolean;
        data: {
            ticker: string;
            name: string;
            market: string;
            quarters: Array<{
                period: string;
                investment_metrics: {
                    per: number;
                    pbr: number;
                    eps: number;
                    bps: number;
                    div_yield: number;
                };
                income_statement: {
                    revenue: number;
                    operating_income: number;
                    net_income: number;
                };
                balance_sheet: {
                    total_assets: number;
                    total_liabilities: number;
                    total_equity: number;
                };
                ratios: {
                    debt_ratio: number;
                    roe: number;
                    roa: number;
                };
            }>;
        } | Array<{
            ticker: string;
            name: string;
            period: string;
            per: number;
            pbr: number;
            roe: number;
        }>;
    }>(endpoint, queryParams);

    return result;
}
