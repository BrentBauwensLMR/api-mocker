import type { HttpMethod } from "@/types/http-method.js";

const supportedMethods = new Set<string>([
    "GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS",
] satisfies HttpMethod[]);

export const isHttpMethod = (method: string | undefined): method is HttpMethod => {
    return method !== undefined && supportedMethods.has(method);
}
