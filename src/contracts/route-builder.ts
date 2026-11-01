import type { HttpStatusCode } from "@/types/http-status-code.js";
import type {
    ReplyDefinition,
    ReplyHandler,
} from "@/types/reply.js";

/** Configures replies while preserving the route's literal path type. */
export interface RouteBuilderInterface<Path extends string> {
    /**
     * Sets the default reply used after one-time replies and sequence items.
     * Calling this again replaces the previous default.
     *
     * @param status - The HTTP response status.
     * @param body - The response body; no JSON serialization is performed.
     * @returns This builder for chaining.
     */
    reply(status: HttpStatusCode, body?: unknown): this;
    /**
     * Sets a default callback, evaluated again for each request that selects it.
     * The callback may return a response directly or through a promise.
     *
     * @param handler - Receives the request and inferred path parameters.
     * @returns This builder for chaining.
     */
    reply(handler: ReplyHandler<Path>): this;

    /**
     * Appends a reply consumed by one matching request.
     * One-time replies run in registration order, before sequences and defaults.
     *
     * @param status - The HTTP response status.
     * @param body - The response body.
     * @returns This builder for chaining.
     *
     * @example
     * ```ts
     * mock.get("/users")
     *     .replyOnce(503, { error: "Unavailable" })
     *     .reply(200, { users: [] });
     * ```
     */
    replyOnce(status: HttpStatusCode, body?: unknown): this;
    /**
     * Appends a callback consumed by one matching request.
     * Selection consumes the reply even if the callback later throws or rejects.
     *
     * @returns This builder for chaining.
     */
    replyOnce(handler: ReplyHandler<Path>): this;

    /**
     * Sets a non-empty sequence of static replies or callbacks.
     *
     * @remarks
     * After exhaustion, the default reply is used if configured. Otherwise the
     * last item repeats; a repeated callback runs with the current request.
     * Positions belong to the registered route, across all parameter values.
     * Calling this again replaces the sequence and restarts its position.
     *
     * @returns This builder for chaining.
     * @throws If the supplied sequence is empty at runtime.
     */
    replySequence(
        replies: [
            ReplyDefinition<Path>,
            ...ReplyDefinition<Path>[],
        ],
    ): this;
}
