/**
 * API RESPONSE HELPERS
 * Format standard untuk semua API routes
 * Benefit: frontend handle 1 pattern, consistent, type-safe
 */

import { NextResponse } from 'next/server';

// Pagination metadata (dipakai di list endpoints)
export interface PaginationMeta {
  total: number;        // Total records di DB
  page: number;         // Current page (1-based)
  perPage: number;      // Records per page
  totalPages: number;   // Math.ceil(total / perPage)
}

// Success response type (generic)
export interface ApiSuccess<T> {
  success: true;
  data: T;
  meta?: PaginationMeta;
}

// Error response type
export interface ApiError {
  success: false;
  error: string;        // Human-readable message
  details?: unknown;    // Optional debug info (misal Zod errors)
  code?: string;        // Error code (misal 'NOT_FOUND', 'UNAUTHORIZED')
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

/**
 * Return success response dengan data (+ optional meta)
 */
export function apiSuccess<T>(
  data: T,
  meta?: PaginationMeta,
  status: number = 200
) {
  const body: ApiSuccess<T> = { success: true, data };
  if (meta) body.meta = meta;
  return NextResponse.json(body, { status });
}

/**
 * Return error response dengan message + optional code
 */
export function apiError(
  error: string,
  status: number = 500,
  code?: string,
  details?: unknown
) {
  const body: ApiError = { success: false, error };
  if (code) body.code = code;
  if (details) body.details = details;
  return NextResponse.json(body, { status });
}

/**
 * Build pagination metadata object
 */
export function paginationMeta(
  total: number,
  page: number,
  perPage: number
): PaginationMeta {
  return {
    total,
    page,
    perPage,
    totalPages: Math.ceil(total / perPage),
  };
}
