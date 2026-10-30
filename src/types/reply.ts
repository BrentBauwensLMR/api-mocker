import type { PathParams } from "@/types/path-params.js";
import type { Request } from "@/types/request.js";
import type { Response } from "@/types/response.js";

/** Response supplied by a user; the core adds the HTTP discriminator. */
export type ReplyResponse = Omit<Response, "type">;

/** Context for one callback execution, with parameters inferred from its path. */
export interface ReplyContext<Path extends string> {
    /** The input request plus decoded named path parameters. */
    request: Request & {
        params: PathParams<Path>;
    };
}

/** Computes a reply synchronously or asynchronously for the selected request. */
export type ReplyHandler<Path extends string> = (context: ReplyContext<Path>) => ReplyResponse | Promise<ReplyResponse>;

/** A static response or a callback that produces one. */
export type ReplyDefinition<Path extends string> = ReplyResponse | ReplyHandler<Path>;
