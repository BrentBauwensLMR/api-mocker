import type { RouteBuilderInterface } from "@/contracts/route-builder.js";
import type { Request } from "@/types/request.js";
import type { Response } from "@/types/response.js";

export interface ServerInterface {
    get<Path extends string>(path: Path): RouteBuilderInterface<Path>;
    post<Path extends string>(path: Path): RouteBuilderInterface<Path>;
    put<Path extends string>(path: Path): RouteBuilderInterface<Path>;
    delete<Path extends string>(path: Path): RouteBuilderInterface<Path>;

    handle(request: Request): Promise<Response>;
}
