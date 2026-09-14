import { z } from "zod";

/**
 * Custom error class for validation errors
 */
export class ValidationError extends Error {
    constructor(
        message: string,
        public field?: string,
        public code?: string,
    ) {
        super(message);
        this.name = "ValidationError";
    }
}

/**
 * Validates data against a Zod schema and throws a ValidationError if invalid
 */
export function validateSchema<T>(
    schema: z.ZodSchema<T>,
    data: unknown,
    context?: string,
): T {
    try {
        return schema.parse(data);
    } catch (error) {
        if (error instanceof z.ZodError) {
            const firstError = error.issues[0];
            const field = firstError.path.join(".");
            const message = context
                ? `${context}: ${firstError.message}`
                : firstError.message;

            throw new ValidationError(message, field, firstError.code);
        }
        throw error;
    }
}

/**
 * Safely validates data and returns either the parsed result or null
 */
export function safeValidate<T>(
    schema: z.ZodSchema<T>,
    data: unknown,
): { success: true; data: T } | { success: false; error: z.ZodError } {
    const result = schema.safeParse(data);
    if (result.success) {
        return { success: true, data: result.data };
    }
    return { success: false, error: result.error };
}

/**
 * Validates and sanitizes tool arguments
 */
export function validateToolArguments<T>(
    schema: z.ZodSchema<T>,
    args: unknown,
    toolName: string,
): T {
    return validateSchema(
        schema,
        args,
        `Invalid arguments for tool '${toolName}'`,
    );
}

/**
 * Validates environment configuration
 */
export function validateConfig<T>(
    schema: z.ZodSchema<T>,
    config: unknown,
    configName: string = "configuration",
): T {
    return validateSchema(schema, config, `Invalid ${configName}`);
}

/**
 * Formats Zod errors into user-friendly messages
 */
export function formatZodError(error: z.ZodError): string {
    return error.issues
        .map((err: z.ZodIssue) => {
            const path = err.path.length > 0 ? `${err.path.join(".")}: ` : "";
            return `${path}${err.message}`;
        })
        .join(", ");
}

/**
 * Creates a validation middleware for MCP tool handlers
 */
export function createValidationMiddleware<T>(schema: z.ZodSchema<T>) {
    return (args: unknown, toolName: string): T => {
        return validateToolArguments(schema, args, toolName);
    };
}

/**
 * Validates multiple fields with custom error messages
 */
export function validateFields(
    validations: Array<{
        schema: z.ZodSchema<unknown>;
        data: unknown;
        field: string;
    }>,
): void {
    const errors: string[] = [];

    for (const validation of validations) {
        const result = safeValidate(validation.schema, validation.data);
        if (!result.success) {
            errors.push(`${validation.field}: ${formatZodError(result.error)}`);
        }
    }

    if (errors.length > 0) {
        throw new ValidationError(`Validation failed: ${errors.join(", ")}`);
    }
}

/**
 * Sanitizes and normalizes common input types
 */
export const sanitizers = {
    email: (email: string): string => email.toLowerCase().trim(),
    domain: (domain: string): string => domain.toLowerCase().trim(),
    name: (name: string): string => name.trim().replace(/\s+/g, " "),
    phone: (phone: string): string => phone.replace(/\s+/g, ""),
    url: (url: string): string => url.trim(),
};

/**
 * Common validation patterns
 */
export const patterns = {
    domain: /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^\+?[1-9]\d{1,14}$/,
    countryCode: /^[A-Z]{2}$/,
    linkedin: /linkedin\.com/,
    name: /^[a-zA-Z\s-']+$/,
} as const;
