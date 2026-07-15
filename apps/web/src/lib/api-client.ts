const API_VERSION = "v1";

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
  }
  return process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
};

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${getBaseUrl()}/api/${API_VERSION}`;
  }

  private buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>): string {
    const url = new URL(`${this.baseUrl}${path}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.set(key, String(value));
        }
      });
    }
    return url.toString();
  }

  async get<T>(path: string, options?: FetchOptions): Promise<T> {
    const { params, ...fetchOptions } = options ?? {};
    const response = await fetch(this.buildUrl(path, params), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...fetchOptions.headers,
      },
      ...fetchOptions,
    });

    if (!response.ok) {
      throw new ApiError(response.status, await response.text());
    }

    return response.json() as Promise<T>;
  }

  async post<T>(path: string, data?: unknown, options?: FetchOptions): Promise<T> {
    const { params, ...fetchOptions } = options ?? {};
    const response = await fetch(this.buildUrl(path, params), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...fetchOptions.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      ...fetchOptions,
    });

    if (!response.ok) {
      throw new ApiError(response.status, await response.text());
    }

    return response.json() as Promise<T>;
  }

  async patch<T>(path: string, data?: unknown, options?: FetchOptions): Promise<T> {
    const { params, ...fetchOptions } = options ?? {};
    const response = await fetch(this.buildUrl(path, params), {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...fetchOptions.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      ...fetchOptions,
    });

    if (!response.ok) {
      throw new ApiError(response.status, await response.text());
    }

    return response.json() as Promise<T>;
  }

  async delete<T>(path: string, options?: FetchOptions): Promise<T> {
    const { params, ...fetchOptions } = options ?? {};
    const response = await fetch(this.buildUrl(path, params), {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...fetchOptions.headers,
      },
      ...fetchOptions,
    });

    if (!response.ok) {
      throw new ApiError(response.status, await response.text());
    }

    return response.json() as Promise<T>;
  }
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public body: string
  ) {
    super(`API Error ${status}: ${body}`);
    this.name = "ApiError";
  }
}

export const apiClient = new ApiClient();
