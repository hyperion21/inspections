import { API_BASE_URL } from "../config";

export const baseFetch = async (
  url: string,
  options: RequestInit = {},
  token?: string | null,
) => {
  let body: BodyInit | undefined;

  if (options.body !== null && options.body !== undefined) {
    if (
      typeof options.body === "object" &&
      !(options.body instanceof FormData)
    ) {
      body = JSON.stringify(options.body);
    } else {
      body = options.body as BodyInit;
    }
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    body,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Request failed");
  }

  return response.json();
};
