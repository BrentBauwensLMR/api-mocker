import type { HttpStatusCode } from "@/types/http-status-code.js";
import type {
    ReplyDefinition,
    ReplyHandler,
} from "@/types/reply.js";

export interface RouteBuilderInterface<Path extends string> {
    reply(status: HttpStatusCode, body?: unknown): this;
    reply(handler: ReplyHandler<Path>): this;

    replyOnce(status: HttpStatusCode, body?: unknown): this;
    replyOnce(handler: ReplyHandler<Path>): this;

    replySequence(
        replies: readonly [
            ReplyDefinition<Path>,
            ...ReplyDefinition<Path>[],
        ],
    ): this;
}
