import type { HttpMethod } from "./http-method.js";

export interface Request {
    method: HttpMethod;
    url: string;
}
