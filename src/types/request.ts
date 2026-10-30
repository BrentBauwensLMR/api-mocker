import type { HttpMethod } from "./http-method.js";

/** Transport-independent request accepted by a mock server. */
export interface Request {
    /** Uppercase HTTP method used for route matching. */
    method: HttpMethod;
    /** Absolute URL or path, resolved against `http://localhost` when relative. */
    url: string;
}
