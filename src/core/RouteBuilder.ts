import type { RouteBuilderInterface } from "@/contracts/route-builder.js";
import type { RouteInterface } from "@/contracts/route.js";
import type { HttpStatusCode } from "@/types/http-status-code.js";
import type { ReplyBodyHandler, ReplyDefinition, ReplyHandler } from "@/types/reply.js";

/** Translates fluent reply configuration into route definitions. */
export class RouteBuilder<Path extends string> implements RouteBuilderInterface<Path> {
    private route: RouteInterface<Path>;

    constructor(route: RouteInterface<Path>) {
        this.route = route;
    }

    /** {@inheritDoc RouteBuilderInterface.reply} */
    reply(status: HttpStatusCode, handler: ReplyBodyHandler<Path>): this;
    /** {@inheritDoc RouteBuilderInterface.reply} */
    reply(status: HttpStatusCode, body?: unknown): this;
    /** {@inheritDoc RouteBuilderInterface.reply} */
    reply(handler: ReplyHandler<Path>): this;
    reply(statusOrHandler: HttpStatusCode | ReplyHandler<Path>, body?: unknown): this {
        this.route.setReply(
            this.createReply(statusOrHandler, body),
        );

        return this;
    }

    /** {@inheritDoc RouteBuilderInterface.replyOnce} */
    replyOnce(status: HttpStatusCode, handler: ReplyBodyHandler<Path>): this;
    /** {@inheritDoc RouteBuilderInterface.replyOnce} */
    replyOnce(status: HttpStatusCode, body?: unknown): this;
    /** {@inheritDoc RouteBuilderInterface.replyOnce} */
    replyOnce(handler: ReplyHandler<Path>): this;
    replyOnce(statusOrHandler: HttpStatusCode | ReplyHandler<Path>, body?: unknown): this {
        this.route.addReplyOnce(
            this.createReply(statusOrHandler, body),
        );

        return this;
    }

    /** {@inheritDoc RouteBuilderInterface.replySequence} */
    replySequence(replies: [ReplyDefinition<Path>, ...ReplyDefinition<Path>[]]): this {
        this.route.setReplySequence(replies);

        return this;
    }

    private createReply(statusOrHandler: HttpStatusCode | ReplyHandler<Path>, body?: unknown): ReplyDefinition<Path> {
        if (typeof statusOrHandler === "function") {
            return statusOrHandler;
        }

        if (typeof body === "function") {
            const handler = body as ReplyBodyHandler<Path>;

            return async (context) => ({
                status: statusOrHandler,
                body: await handler(context),
            });
        }

        return {
            status: statusOrHandler,
            body,
        };
    }
}
