export class AshraError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly response: unknown
  ) {
    super(message);
    this.name = "AshraError";
  }
}

export function isAshraError(error: unknown): error is AshraError {
  return error instanceof AshraError;
}

export function createAshraError(status: number, response: any): AshraError {
  return new AshraError(
    response?.message || "Ashra API error",
    status,
    response
  );
}
