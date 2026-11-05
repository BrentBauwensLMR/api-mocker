import type { MockServer } from "./core/MockServer.js";
import { container } from "./facades/core.js";

export { createFetch } from "./fetch.js";

export type { MockServer };
export type { ServerInterface } from "@/contracts/server.js";
export type { RouteBuilderInterface } from "@/contracts/route-builder.js";
export type { HttpMethod } from "@/types/http-method.js";
export type { HttpStatusCode } from "@/types/http-status-code.js";
export type { PathParams } from "@/types/path-params.js";
export type { Request } from "@/types/request.js";
export type { Response } from "@/types/response.js";
export type {
    ReplyContext,
    ReplyBodyHandler,
    ReplyDefinition,
    ReplyHandler,
    ReplyResponse,
} from "@/types/reply.js";

/**
 * Creates an independent mock server with its own routes and reply positions.
 *
 * @remarks
 * Requests are executed through `handle()`. Creating a server does not open a
 * network port or intercept requests made with `fetch()`.
 *
 * @example
 * ```ts
 * const mock = createMockServer();
 * mock.get("/users/:id").reply(({ request }) => ({
 *     status: 200,
 *     body: { id: request.params.id },
 * }));
 * const response = await mock.handle({ method: "GET", url: "/users/123" });
 * ```
 */
export function createMockServer(): MockServer {
    return container().make("server");
}
