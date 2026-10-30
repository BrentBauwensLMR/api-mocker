import type { EngineInterface } from "@/contracts/engine.js";
import type { ExecutableRouteInterface, RouteInterface } from "@/contracts/route.js";
import type { Request } from "@/types/request.js";
import type { Response } from "@/types/response.js";

export class MockEngine<Path extends string> implements EngineInterface {
    private routes: ExecutableRouteInterface[] = [];

    public register(route: RouteInterface<Path>): void {
        this.routes.push(route);
    }

    public async handle(request: Request): Promise<Response> {
        const url = new URL(request.url, "http://localhost");

        const route = this.routes.find((candidate) => candidate.matches(request.method, url.pathname));

        if (!route) {
            return {
                type: "http",
                status: 404,
                body: {
                    error: "No matching mock route",
                },
            };
        }

        return await route.resolve(request);
    }
}
