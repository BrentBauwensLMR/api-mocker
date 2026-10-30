import type { RouteBuilderInterface } from "@/contracts/route-builder.js";
import type { RouteInterface } from "@/contracts/route.js";
import type { HttpStatusCode } from "@/types/http-status-code.js";
import type { ReplyDefinition, ReplyHandler} from "@/types/reply.js";

/** Translates fluent reply configuration into route definitions. */
export class RouteBuilder<Path extends string> implements RouteBuilderInterface<Path> {
    private route: RouteInterface<Path>;

    constructor(route: RouteInterface<Path>) {
        this.route = route;
    }

    /** {@inheritDoc RouteBuilderInterface.reply} */
    reply(status: HttpStatusCode, body?: unknown): this;
    /** {@inheritDoc RouteBuilderInterface.reply} */
    reply(handler: ReplyHandler<Path>): this;
    reply(statusOrHandler: HttpStatusCode | ReplyHandler<Path>, body?: unknown): this {
        this.route.setReply(
            this.createDefinition(statusOrHandler, body),
        );

        return this;
    }

    /** {@inheritDoc RouteBuilderInterface.replyOnce} */
    replyOnce(status: HttpStatusCode, body?: unknown): this;
    /** {@inheritDoc RouteBuilderInterface.replyOnce} */
    replyOnce(handler: ReplyHandler<Path>): this;
    replyOnce(statusOrHandler: HttpStatusCode | ReplyHandler<Path>, body?: unknown): this {
        this.route.addReplyOnce(
            this.createDefinition(statusOrHandler, body),
        );

        return this;
    }

    /** {@inheritDoc RouteBuilderInterface.replySequence} */
    replySequence(replies: [ReplyDefinition<Path>, ...ReplyDefinition<Path>[]]): this {
        this.route.setReplySequence(replies);

        return this;
    }

    private createDefinition(statusOrHandler: HttpStatusCode | ReplyHandler<Path>, body?: unknown): ReplyDefinition<Path> {
        if (typeof statusOrHandler === "function") {
            return statusOrHandler;
        }

        return {
            status: statusOrHandler,
            body,
        };
    }
}
