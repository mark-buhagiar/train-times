/**
 * Base API client for making HTTP requests
 */

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface FetchOptions extends RequestInit {
  timeout?: number;
}

/**
 * Fetch with timeout support
 */
async function fetchWithTimeout(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const { timeout = 10000, ...fetchOptions } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(id);
  }
}

/**
 * Generic API request handler
 */
export async function apiRequest<T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  try {
    const response = await fetchWithTimeout(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new ApiError(
        `HTTP error ${response.status}`,
        response.status,
        await response.json().catch(() => null)
      );
    }

    return response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    if (error instanceof Error && error.name === "AbortError") {
      throw new ApiError("Request timeout", 408);
    }
    throw new ApiError(
      error instanceof Error ? error.message : "Unknown error",
      500
    );
  }
}
