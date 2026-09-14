
import { z } from 'zod';

const SUPABASE_PROJECT_URL = 'https://xunrsikkybgxkybjzrgz.supabase.co';
const SUPABASE_REST_URL = `${SUPABASE_PROJECT_URL}/rest/v1`;
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1bnJzaWtreWJneGt5Ymp6cmd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0NTExNTgsImV4cCI6MjA4MDAyNzE1OH0.SsXri828-Rf0gHlu4Bls-pewhfMNNII4mbiuLnc9ACs';

export const RoomsParamsSchema = z.object({
    search: z.string().optional().describe('Search term for rooms (e.g., "Samsung", "Semiconductor")'),
    type: z.enum(['tag', 'ticker', 'keyword']).optional().describe('Filter by room type'),
    limit: z.number().min(1).max(100).default(20).describe('Result count'),
});

export type RoomsParams = z.infer<typeof RoomsParamsSchema>;
export const GetAvailableRoomsSchema = RoomsParamsSchema;

export async function getAvailableRooms(params: RoomsParams) {
    const url = new URL(`${SUPABASE_REST_URL}/available_websocket_rooms`);

    // Select specific columns
    url.searchParams.append('select', 'room_id,type,description');

    // Add filters
    if (params.search) {
        // Search in both description and room_id
        url.searchParams.append('or', `(description.ilike.*${params.search}*,room_id.ilike.*${params.search}*)`);
    }

    if (params.type) {
        url.searchParams.append('type', `eq.${params.type}`);
    }

    // Limit
    url.searchParams.append('limit', String(params.limit));

    const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'apikey': SUPABASE_ANON_KEY,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to fetch rooms: ${response.status} - ${error}`);
    }

    const data = await response.json();

    return {
        rooms: data,
        count: data.length,
        help: "Use these room_ids to subscribe via WebSocket. Example: socket.emit('subscribe', 'tag:STK005930')"
    };
}
