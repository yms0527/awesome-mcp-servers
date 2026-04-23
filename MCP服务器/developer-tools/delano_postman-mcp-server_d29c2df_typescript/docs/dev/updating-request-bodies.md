# Request Body Update Locations

When updating the request body JSON schemas that are sent to the Postman API, the following files need to be updated:

## Files to Update
1. types.ts

 - Type definitions and validation
2. src/tools/{resource}.ts

 - Tool implementation and schemas
3. src/api/{resource}.ts

 - API client implementation

## Implementation Details

### 1. Type Definitions
```typescript
interface UpdateEnvironmentArgs {
  environmentId: string;
  environment: {
    name?: string;
    values?: EnvironmentValue[];
  };
}

function isUpdateEnvironmentArgs(obj: unknown): obj is UpdateEnvironmentArgs {
  if (typeof obj !== 'object' || obj === null) return false;
  const args = obj as UpdateEnvironmentArgs;
  return (
    typeof args.environmentId === 'string' &&
    isValidUid(args.environmentId) &&
    typeof args.environment === 'object' &&
    args.environment !== null &&
    (args.environment.name === undefined || typeof args.environment.name === 'string') &&
    (args.environment.values === undefined ||
      (Array.isArray(args.environment.values) &&
       args.environment.values.every(isEnvironmentValue)))
  );
}
```

### 2. Tool Implementation
```typescript
inputSchema: {
  type: 'object',
  properties: {
    environmentId: {
      type: 'string',
      description: '...',
    },
    environment: {
      type: 'object',
      description: 'Environment details to update',
      properties: {
        name: {
          type: 'string',
          description: '...',
        },
        values: {
          type: 'array',
          items: { ... }
        }
      }
    }
  },
  required: ['environmentId', 'environment']
}

// Implementation
const { environmentId, environment } = args;
requestBody.environment = environment;
```

### 3. API Implementation
```typescript
// Update request construction
async function updateEnvironment(args: UpdateEnvironmentArgs) {
  const response = await client.put(`/environments/${args.environmentId}`, {
    body: args.environment
  });
  // ...existing code...
}

// Update tests
describe('updateEnvironment', () => {
  it('should construct valid request', async () => {
    // ...existing code...
    expect(mockClient.put).toHaveBeenCalledWith(
      '/environments/123',
      expect.objectContaining({
        body: {
          name: 'test',
          values: []
        }
      })
    );
  });
});
```
