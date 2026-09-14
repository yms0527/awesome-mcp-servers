export function isError(result: unknown): result is Error {
  return result instanceof Error;
}
