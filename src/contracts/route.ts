import type { HttpMethod } from "@/types/http-method.js";
import type { Request } from "@/types/request.js";
import type { Response } from "@/types/response.js";
import type { ReplyDefinition } from "@/types/reply.js";

export interface ExecutableRouteInterface {
    matches(method: HttpMethod, path: string): boolean;
    resolve(request: Request): Promise<Response>;
}

export interface RouteInterface<Path extends string> extends ExecutableRouteInterface {
    setReply(reply: ReplyDefinition<Path>): void;
    addReplyOnce(reply: ReplyDefinition<Path>): void;
    setReplySequence(
        replies: [
            ReplyDefinition<Path>,
            ...ReplyDefinition<Path>[],
        ],
    ): void;
}
