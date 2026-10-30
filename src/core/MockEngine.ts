import type { EngineInterface } from "@/contracts/engine.js";
import type { RouteInterface } from "@/contracts/route.js";
import type { Request } from "@/types/request.js";
import type { Response } from "@/types/response.js";

export class MockEngine implements EngineInterface {
    private routes: RouteInterface[] = [];

    public register(route: RouteInterface): void {
        this.routes.push(route);
    }

    public async handle(request: Request): Promise<Response> {
        const url = new URL(request.url, "http://localhost");

        const route = this.routes.find((candidate) =>
            candidate.matches(request.method, url.pathname),
        );

        if (!route) {
            return {
                type: "http",
                status: 404,
                body: {
                    error: "No matching mock route",
                },
            };
        }

        return route.resolve();
    }
}
