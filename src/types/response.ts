/** Plain response description; this is not a Fetch API `Response` instance. */
export interface Response {
    /** Identifies the HTTP response model. Added automatically by the core. */
    type: "http";
    /** HTTP response status. */
    status: number;
    /** Unserialized response value. Static bodies are not cloned between calls. */
    body?: unknown;
    /** Optional response headers for a future transport adapter to send. */
    headers?: Record<string, string>;
}
