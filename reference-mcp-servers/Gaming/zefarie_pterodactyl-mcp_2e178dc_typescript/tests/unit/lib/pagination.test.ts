import { formatPagination } from "../../../src/lib/pagination.js";
import { createPagination } from "../../fixtures/server.fixture.js";

describe("formatPagination", () => {
  it("should format single page pagination", () => {
    const raw = createPagination({
      current_page: 1,
      total_pages: 1,
      total: 5,
      per_page: 50,
    });

    const result = formatPagination(raw);
    expect(result.current_page).toBe(1);
    expect(result.total_pages).toBe(1);
    expect(result.total).toBe(5);
    expect(result.per_page).toBe(50);
    expect(result.has_next).toBe(false);
    expect(result.has_previous).toBe(false);
  });

  it("should set has_next to true when not on last page", () => {
    const raw = createPagination({
      current_page: 1,
      total_pages: 3,
    });

    const result = formatPagination(raw);
    expect(result.has_next).toBe(true);
    expect(result.has_previous).toBe(false);
  });

  it("should set has_previous to true when not on first page", () => {
    const raw = createPagination({
      current_page: 2,
      total_pages: 3,
    });

    const result = formatPagination(raw);
    expect(result.has_next).toBe(true);
    expect(result.has_previous).toBe(true);
  });

  it("should set has_next to false on last page", () => {
    const raw = createPagination({
      current_page: 3,
      total_pages: 3,
    });

    const result = formatPagination(raw);
    expect(result.has_next).toBe(false);
    expect(result.has_previous).toBe(true);
  });

  it("should handle page 1 of 1", () => {
    const raw = createPagination({
      current_page: 1,
      total_pages: 1,
      total: 0,
    });

    const result = formatPagination(raw);
    expect(result.has_next).toBe(false);
    expect(result.has_previous).toBe(false);
    expect(result.total).toBe(0);
  });
});
