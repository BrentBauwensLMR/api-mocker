import type { RouteBuilderInterface } from "@/contracts/route-builder.js";
import type { Request } from "@/types/request.js";
import type { Response } from "@/types/response.js";

/** Public operations for registering routes and executing mock requests. */
export interface ServerInterface {
    /** Registers a GET route and preserves its literal path for reply typing. */
    get<Path extends string>(path: Path): RouteBuilderInterface<Path>;
    /** Registers a POST route and preserves its literal path for reply typing. */
    post<Path extends string>(path: Path): RouteBuilderInterface<Path>;
    /** Registers a PUT route and preserves its literal path for reply typing. */
    put<Path extends string>(path: Path): RouteBuilderInterface<Path>;
    /** Registers a DELETE route and preserves its literal path for reply typing. */
    delete<Path extends string>(path: Path): RouteBuilderInterface<Path>;

    /** Executes the first matching route; returns a 404 response on a miss. */
    handle(request: Request): Promise<Response>;
}
