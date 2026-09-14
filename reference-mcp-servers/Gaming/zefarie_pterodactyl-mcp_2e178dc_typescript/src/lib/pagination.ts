import type { PteroPagination } from "../client/types.js";

interface PaginatedResult<T> {
  data: T[];
  pagination: {
    current_page: number;
    total_pages: number;
    total: number;
    per_page: number;
    has_next: boolean;
    has_previous: boolean;
  };
}

export function formatPagination(raw: PteroPagination): PaginatedResult<never>["pagination"] {
  return {
    current_page: raw.current_page,
    total_pages: raw.total_pages,
    total: raw.total,
    per_page: raw.per_page,
    has_next: raw.current_page < raw.total_pages,
    has_previous: raw.current_page > 1,
  };
}
