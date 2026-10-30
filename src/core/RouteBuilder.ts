import type { RouteBuilderInterface } from "@/contracts/route-builder.js";
import type { RouteInterface } from "@/contracts/route.js";
import type { HttpStatusCode } from "@/types/http-status-code.js";
import type { ReplyDefinition, ReplyHandler} from "@/types/reply.js";

export class RouteBuilder<Path extends string> implements RouteBuilderInterface<Path> {
    private route: RouteInterface<Path>;

    constructor(route: RouteInterface<Path>) {
        this.route = route;
    }

    reply(status: HttpStatusCode, body?: unknown): this;
    reply(handler: ReplyHandler<Path>): this;
    reply(statusOrHandler: HttpStatusCode | ReplyHandler<Path>, body?: unknown): this {
        this.route.setReply(
            this.createDefinition(statusOrHandler, body),
        );

        return this;
    }

    replyOnce(status: HttpStatusCode, body?: unknown): this;
    replyOnce(handler: ReplyHandler<Path>): this;
    replyOnce(statusOrHandler: HttpStatusCode | ReplyHandler<Path>, body?: unknown): this {
        this.route.addReplyOnce(
            this.createDefinition(statusOrHandler, body),
        );

        return this;
    }

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
