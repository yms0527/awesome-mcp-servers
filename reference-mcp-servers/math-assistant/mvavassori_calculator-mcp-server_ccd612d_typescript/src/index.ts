import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// --- Server Initialization ---
const server = new McpServer({
    name: "basic-calculator",
    version: "1.0.0",
    capabilities: {
        tools: {}, // Declare that we provide tools
    },
});

console.error("Calculator MCP Server starting..."); // Log to stderr

// --- Helper Functions ---
function calculateFactorial(n: number): number {
    if (n < 0 || !Number.isInteger(n)) {
        throw new Error("Factorial is only defined for non-negative integers.");
    }
    if (n > 170) {
        // Avoid exceeding MAX_SAFE_INTEGER or performance issues
        throw new Error("Input too large for factorial calculation.");
    }
    if (n === 0 || n === 1) {
        return 1;
    }
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

// --- Tool Definitions ---

// Basic Arithmetic
server.tool(
    "calculate_add",
    "Adds two numbers.",
    {
        a: z.number().describe("The first number to add."),
        b: z.number().describe("The second number to add."),
    },
    async ({ a, b }) => ({
        content: [{ type: "text", text: String(a + b) }],
    }),
);

server.tool(
    "calculate_subtract",
    "Subtracts the second number from the first.",
    {
        a: z.number().describe("The number to subtract from."),
        b: z.number().describe("The number to subtract."),
    },
    async ({ a, b }) => ({
        content: [{ type: "text", text: String(a - b) }],
    }),
);

server.tool(
    "calculate_multiply",
    "Multiplies two numbers.",
    {
        a: z.number().describe("The first number to multiply."),
        b: z.number().describe("The second number to multiply."),
    },
    async ({ a, b }) => ({
        content: [{ type: "text", text: String(a * b) }],
    }),
);

server.tool(
    "calculate_divide",
    "Divides the first number by the second.",
    {
        a: z.number().describe("The dividend (number being divided)."),
        b: z
            .number()
            .describe("The divisor (number to divide by). Cannot be zero."),
    },
    async ({ a, b }) => {
        if (b === 0) {
            return {
                content: [{ type: "text", text: "Error: Division by zero." }],
                isError: true,
            };
        }
        return {
            content: [{ type: "text", text: String(a / b) }],
        };
    },
);

// Exponents & Roots
server.tool(
    "calculate_power",
    "Calculates the base raised to the power of the exponent (base^exponent).",
    {
        base: z.number().describe("The base number."),
        exponent: z.number().describe("The exponent."),
    },
    async ({ base, exponent }) => ({
        content: [{ type: "text", text: String(Math.pow(base, exponent)) }],
    }),
);

server.tool(
    "calculate_sqrt",
    "Calculates the square root of a non-negative number.",
    {
        number: z
            .number()
            .describe(
                "The number to find the square root of. Must be non-negative.",
            ),
    },
    async ({ number }) => {
        if (number < 0) {
            return {
                content: [
                    {
                        type: "text",
                        text: "Error: Cannot calculate square root of a negative number.",
                    },
                ],
                isError: true,
            };
        }
        return {
            content: [{ type: "text", text: String(Math.sqrt(number)) }],
        };
    },
);

// Trigonometry (using Radians)
server.tool(
    "calculate_sine",
    "Calculates the sine of an angle given in radians.",
    {
        angle_radians: z.number().describe("The angle in radians."),
    },
    async ({ angle_radians }) => ({
        content: [{ type: "text", text: String(Math.sin(angle_radians)) }],
    }),
);

server.tool(
    "calculate_cosine",
    "Calculates the cosine of an angle given in radians.",
    {
        angle_radians: z.number().describe("The angle in radians."),
    },
    async ({ angle_radians }) => ({
        content: [{ type: "text", text: String(Math.cos(angle_radians)) }],
    }),
);

server.tool(
    "calculate_tangent",
    "Calculates the tangent of an angle given in radians.",
    {
        angle_radians: z.number().describe("The angle in radians."),
    },
    async ({ angle_radians }) => ({
        content: [{ type: "text", text: String(Math.tan(angle_radians)) }],
    }),
);

// Logarithms
server.tool(
    "calculate_natural_log",
    "Calculates the natural logarithm (base e) of a positive number.",
    {
        number: z
            .number()
            .describe(
                "The number to find the natural log of. Must be positive.",
            ),
    },
    async ({ number }) => {
        if (number <= 0) {
            return {
                content: [
                    {
                        type: "text",
                        text: "Error: Logarithm is only defined for positive numbers.",
                    },
                ],
                isError: true,
            };
        }
        return {
            content: [{ type: "text", text: String(Math.log(number)) }],
        };
    },
);

server.tool(
    "calculate_log10",
    "Calculates the base-10 logarithm of a positive number.",
    {
        number: z
            .number()
            .describe(
                "The number to find the base-10 log of. Must be positive.",
            ),
    },
    async ({ number }) => {
        if (number <= 0) {
            return {
                content: [
                    {
                        type: "text",
                        text: "Error: Logarithm is only defined for positive numbers.",
                    },
                ],
                isError: true,
            };
        }
        return {
            content: [{ type: "text", text: String(Math.log10(number)) }],
        };
    },
);

// Constants
server.tool(
    "get_pi",
    "Returns the value of the mathematical constant Pi (π).",
    {}, // No input schema needed
    async () => ({
        content: [{ type: "text", text: String(Math.PI) }],
    }),
);

server.tool(
    "get_e",
    "Returns the value of Euler's number (e), the base of natural logarithms.",
    {}, // No input schema needed
    async () => ({
        content: [{ type: "text", text: String(Math.E) }],
    }),
);

// Factorial
server.tool(
    "calculate_factorial",
    "Calculates the factorial of a non-negative integer (n!).",
    {
        number: z
            .number()
            .int()
            .nonnegative()
            .describe(
                "The non-negative integer to calculate the factorial of.",
            ),
    },
    async ({ number }) => {
        try {
            const result = calculateFactorial(number);
            return {
                content: [{ type: "text", text: String(result) }],
            };
        } catch (error: unknown) {
            const message =
                error instanceof Error
                    ? error.message
                    : "An unknown error occurred during factorial calculation.";
            return {
                content: [{ type: "text", text: `Error: ${message}` }],
                isError: true,
            };
        }
    },
);

// Percentage
server.tool(
    "calculate_percentage_of",
    "Calculates a specified percentage of a given number (e.g., 20% of 150).",
    {
        percentage: z
            .number()
            .describe("The percentage value (e.g., 20 for 20%)."),
        number: z
            .number()
            .describe("The number to calculate the percentage of."),
    },
    async ({ percentage, number }) => ({
        content: [{ type: "text", text: String((percentage / 100) * number) }],
    }),
);

// --- Main Execution Logic ---
async function main() {
    try {
        // Connect using stdio transport
        const transport = new StdioServerTransport();
        await server.connect(transport);
        console.error("Calculator MCP Server connected via stdio and ready.");
    } catch (error) {
        console.error("Failed to start or connect the server:", error);
        process.exit(1); // Exit with error code
    }
}

// Graceful shutdown handling
process.on("SIGINT", async () => {
    console.error("\nCaught interrupt signal (Ctrl+C). Shutting down...");
    await server.close(); // Close the server gracefully
    process.exit(0);
});

process.on("SIGTERM", async () => {
    console.error("Caught termination signal. Shutting down...");
    await server.close();
    process.exit(0);
});

main();
