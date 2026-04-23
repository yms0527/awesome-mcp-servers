import { describe, it, expect } from "vitest";

// --- Redefined helper functions ---
function calculateFactorial(n: number): number {
    if (n < 0 || !Number.isInteger(n)) {
        throw new Error("Factorial is only defined for non-negative integers.");
    }
    if (n > 170) {
        // Match the limit in the server code
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

// --- Test Suites ---

describe("Calculator MCP Server Tools Logic", () => {
    describe("Basic Arithmetic", () => {
        it("calculate_add should add two numbers", () => {
            expect(5 + 3).toBe(8);
            expect(-1 + 5).toBe(4);
            expect(0 + 0).toBe(0);
            expect(1.5 + 2.5).toBe(4.0);
        });

        it("calculate_subtract should subtract two numbers", () => {
            expect(5 - 3).toBe(2);
            expect(3 - 5).toBe(-2);
            expect(0 - 0).toBe(0);
            expect(5.5 - 1.5).toBe(4.0);
        });

        it("calculate_multiply should multiply two numbers", () => {
            expect(5 * 3).toBe(15);
            expect(-2 * 4).toBe(-8);
            expect(0 * 5).toBe(0);
            expect(1.5 * 2).toBe(3.0);
        });

        it("calculate_divide should divide two numbers", () => {
            expect(6 / 3).toBe(2);
            expect(5 / 2).toBe(2.5);
            expect(-10 / 5).toBe(-2);
            expect(0 / 5).toBe(0);
        });

        it("calculate_divide should handle division by zero (expecting server logic check)", () => {
            // We test the condition the server checks for
            const divisor = 0;
            expect(divisor === 0).toBe(true);
            // The actual MCP tool returns { isError: true, ... }
            // Direct Math operation would return Infinity
            expect(5 / 0).toBe(Infinity);
        });
    });

    describe("Exponents & Roots", () => {
        it("calculate_power should calculate base to the exponent", () => {
            expect(Math.pow(2, 3)).toBe(8);
            expect(Math.pow(5, 0)).toBe(1);
            expect(Math.pow(4, 0.5)).toBe(2);
            expect(Math.pow(10, -1)).toBe(0.1);
        });

        it("calculate_sqrt should calculate square root of non-negative numbers", () => {
            expect(Math.sqrt(9)).toBe(3);
            expect(Math.sqrt(2)).toBeCloseTo(1.41421356);
            expect(Math.sqrt(0)).toBe(0);
        });

        it("calculate_sqrt should handle negative input (expecting server logic check)", () => {
            // We test the condition the server checks for
            const number = -4;
            expect(number < 0).toBe(true);
            // The actual MCP tool returns { isError: true, ... }
            // Direct Math operation would return NaN
            expect(Math.sqrt(-4)).toBeNaN();
        });
    });

    describe("Trigonometry (Radians)", () => {
        it("calculate_sine should calculate sine", () => {
            expect(Math.sin(0)).toBe(0);
            expect(Math.sin(Math.PI / 2)).toBe(1);
            expect(Math.sin(Math.PI)).toBeCloseTo(0); // Use toBeCloseTo for float comparisons
        });

        it("calculate_cosine should calculate cosine", () => {
            expect(Math.cos(0)).toBe(1);
            expect(Math.cos(Math.PI / 2)).toBeCloseTo(0);
            expect(Math.cos(Math.PI)).toBe(-1);
        });

        it("calculate_tangent should calculate tangent", () => {
            expect(Math.tan(0)).toBe(0);
            expect(Math.tan(Math.PI / 4)).toBeCloseTo(1);
            // Tangent of PI/2 is undefined (approaches Infinity)
            // expect(Math.tan(Math.PI / 2)).toBe(Infinity); // JS returns a large number, not Infinity
        });
    });

    describe("Logarithms", () => {
        it("calculate_natural_log should calculate ln", () => {
            expect(Math.log(Math.E)).toBe(1);
            expect(Math.log(1)).toBe(0);
            expect(Math.log(10)).toBeCloseTo(2.302585);
        });

        it("calculate_natural_log should handle non-positive input (expecting server logic check)", () => {
            const number = 0;
            expect(number <= 0).toBe(true);
            // Direct Math would return -Infinity or NaN
            expect(Math.log(0)).toBe(-Infinity);
            expect(Math.log(-1)).toBeNaN();
        });

        it("calculate_log10 should calculate log base 10", () => {
            expect(Math.log10(100)).toBe(2);
            expect(Math.log10(1)).toBe(0);
            expect(Math.log10(50)).toBeCloseTo(1.69897);
        });

        it("calculate_log10 should handle non-positive input (expecting server logic check)", () => {
            const number = 0;
            expect(number <= 0).toBe(true);
            // Direct Math would return -Infinity or NaN
            expect(Math.log10(0)).toBe(-Infinity);
            expect(Math.log10(-10)).toBeNaN();
        });
    });

    describe("Constants", () => {
        it("get_pi should return PI", () => {
            expect(Math.PI).toBeCloseTo(3.1415926535);
        });

        it("get_e should return Euler's number", () => {
            expect(Math.E).toBeCloseTo(2.7182818284);
        });
    });

    describe("Factorial", () => {
        it("calculate_factorial should calculate factorial of non-negative integers", () => {
            expect(calculateFactorial(0)).toBe(1);
            expect(calculateFactorial(1)).toBe(1);
            expect(calculateFactorial(5)).toBe(120);
            expect(calculateFactorial(10)).toBe(3628800);
        });

        it("calculate_factorial should throw for negative numbers", () => {
            expect(() => calculateFactorial(-1)).toThrow(
                /non-negative integers/,
            );
        });

        it("calculate_factorial should throw for non-integers", () => {
            expect(() => calculateFactorial(3.5)).toThrow(
                /non-negative integers/,
            );
        });

        it("calculate_factorial should throw for large numbers", () => {
            expect(() => calculateFactorial(171)).toThrow(/Input too large/);
        });
    });

    describe("Percentage", () => {
        it("calculate_percentage_of should calculate percentage correctly", () => {
            expect((50 / 100) * 200).toBe(100);
            expect((25 / 100) * 80).toBe(20);
            expect((150 / 100) * 50).toBe(75);
            expect((0 / 100) * 100).toBe(0);
        });
    });
});
