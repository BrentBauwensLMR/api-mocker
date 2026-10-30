import type { PathParams } from "@/types/path-params.js";
import type { Request } from "@/types/request.js";
import type { Response } from "@/types/response.js";

export type ReplyResponse = Omit<Response, "type">;

export interface ReplyContext<Path extends string> {
    request: Request & {
        params: PathParams<Path>;
    };
}

export type ReplyHandler<Path extends string> = (context: ReplyContext<Path>) => ReplyResponse | Promise<ReplyResponse>;

export type ReplyDefinition<Path extends string> = ReplyResponse | ReplyHandler<Path>;
