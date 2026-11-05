import type { RouteInterface } from "@/contracts/route.js";
import type { HttpMethod } from "@/types/http-method.js";
import type { Response } from "@/types/response.js";
import { ReplySequence } from "./ReplySequence.js";
import type { ReplyContext, ReplyDefinition } from "@/types/reply.js";
import type { PathParams } from "@/types/path-params.js";
import { extractParams } from "@/utils/extract-params.js";
import type { Request } from "@/types/request.js";

export class MockRoute<Path extends string> implements RouteInterface<Path> {
    /**
     * The HTTP method for this route
     * example: GET, POST, ...
     */
    private method: HttpMethod;

    /**
     * The path for this route
     * example: /users, /posts/:id, ...
     */
    private path: string;

    private replies = new ReplySequence<ReplyDefinition<Path>>();

    constructor(method: HttpMethod, path: Path) {
        this.method = method;
        this.path = path;
    }

    public matches(method: HttpMethod, path: string): boolean {
        return this.method === method && this.extractParams(path) !== null;
    }

    public setReply(reply: ReplyDefinition<Path>): void {
        this.replies.setFallback(reply);
    }

    public addReplyOnce(reply: ReplyDefinition<Path>): void {
        this.replies.addOnce(reply);
    }

    public setReplySequence(
        replies: [
            ReplyDefinition<Path>,
            ...ReplyDefinition<Path>[],
        ],
    ): void {
        this.replies.setSequence(replies);
    }

    async resolve(request: Request): Promise<Response> {
        const url = new URL(request.url, "http://localhost");
        const params = this.extractParams(url.pathname);

        if (params === null) {
            throw new Error(`Request does not match ${this.method} ${this.path}`);
        }

        const definition = this.replies.next();

        if (definition === undefined) {
            throw new Error(`No reply available for ${this.method} ${this.path}`);
        }

        const context: ReplyContext<Path> = {
            request: {
                ...request,
                params,
            },
        };

        const response = typeof definition === "function"
            ? await definition(context)
            : definition;

        return {
            ...response,
            type: "http",
        };
    }

    private extractParams(path: string): PathParams<Path> | null {
        const params = extractParams<Path>(path, this.path);

        return params;
    }
}
