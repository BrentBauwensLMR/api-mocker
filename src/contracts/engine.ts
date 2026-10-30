import type { ExecutableRouteInterface } from "@/contracts/route.js";
import type { Request } from "@/types/request.js";
import type { Response } from "@/types/response.js";

export interface EngineInterface {
    register(route: ExecutableRouteInterface): void;
    handle(request: Request): Promise<Response>;
}
