import { zodToJsonSchema } from 'zod-to-json-schema';
import { z } from 'zod';

const TestSchema = z.object({
    q: z.string().optional().describe('test query'),
    limit: z.number().min(1).max(50).default(20).describe('limit'),
});

console.log('--- zodToJsonSchema(TestSchema) ---');
const result = zodToJsonSchema(TestSchema);
console.log(JSON.stringify(result, null, 2));
