import type { EngineInterface } from "@/contracts/engine.js";
import type { RouteBuilderInterface } from "@/contracts/route-builder.js";
import type { ServerInterface } from "@/contracts/server.js";
import type { HttpMethod } from "@/types/http-method.js";
import { MockRoute } from "./MockRoute.js";
import { RouteBuilder } from "./RouteBuilder.js";
import type { Request } from "@/types/request.js";
import type { Response } from "@/types/response.js";

export class MockServer implements ServerInterface {
    private engine: EngineInterface;

    constructor(engine: EngineInterface) {
        this.engine = engine;
    }

    /**
     * Get a route builder for the given path.
     * @param path
     * @returns
     */
    get<Path extends string>(path: Path): RouteBuilderInterface<Path> {
        return this.addRoute("GET", path);
    }

    /**
     * Post a route builder for the given path.
     * @param path
     * @returns
     */
    post<Path extends string>(path: Path): RouteBuilderInterface<Path> {
        return this.addRoute("POST", path);
    }

    /**
     * Put a route builder for the given path.
     * @param path
     * @returns
     */
    put<Path extends string>(path: Path): RouteBuilderInterface<Path> {
        return this.addRoute("PUT", path);
    }

    /**
     * Delete a route builder for the given path.
     * @param path
     * @returns
     */
    delete<Path extends string>(path: Path): RouteBuilderInterface<Path> {
        return this.addRoute("DELETE", path);
    }

    /**
     * Handle a request and return a response.
     * @param request
     * @returns
     */
    handle(request: Request): Promise<Response> {
        return this.engine.handle(request);
    }

    private addRoute<Path extends string>(method: HttpMethod, path: Path): RouteBuilderInterface<Path> {
        const route = new MockRoute<Path>(method, path);

        this.engine.register(route)

        return new RouteBuilder<Path>(route)
    }
}
