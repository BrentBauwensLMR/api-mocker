export interface Response {
    type: "http";
    status: number;
    body?: unknown;
    headers?: Record<string, string>;
}
