import type { EngineInterface } from "@/contracts/engine.js";
import type { RouteBuilderInterface } from "@/contracts/route-builder.js";
import type { ServerInterface } from "@/contracts/server.js";
import type { HttpMethod } from "@/types/http-method.js";
import { MockRoute } from "./MockRoute.js";
import { RouteBuilder } from "./RouteBuilder.js";
import type { Request } from "@/types/request.js";
import type { Response } from "@/types/response.js";

/**
 * Registers routes and delegates request execution to an engine.
 * Create instances with {@link createMockServer}.
 */
export class MockServer implements ServerInterface {
    private engine: EngineInterface;

    /** @internal Instances are assembled by the server factory. */
    constructor(engine: EngineInterface) {
        this.engine = engine;
    }

    /**
     * Registers a GET route with inferred path parameters.
     *
     * @param path - An exact pathname or pattern such as `/users/:id`.
     * @returns A builder for configuring this route's replies.
     */
    get<Path extends string>(path: Path): RouteBuilderInterface<Path> {
        return this.addRoute("GET", path);
    }

    /**
     * Registers a POST route with inferred path parameters.
     *
     * @param path - An exact pathname or pattern such as `/users/:id`.
     * @returns A builder for configuring this route's replies.
     */
    post<Path extends string>(path: Path): RouteBuilderInterface<Path> {
        return this.addRoute("POST", path);
    }

    /**
     * Registers a PUT route with inferred path parameters.
     *
     * @param path - An exact pathname or pattern such as `/users/:id`.
     * @returns A builder for configuring this route's replies.
     */
    put<Path extends string>(path: Path): RouteBuilderInterface<Path> {
        return this.addRoute("PUT", path);
    }

    /**
     * Registers a DELETE route with inferred path parameters.
     *
     * @param path - An exact pathname or pattern such as `/users/:id`.
     * @returns A builder for configuring this route's replies.
     */
    delete<Path extends string>(path: Path): RouteBuilderInterface<Path> {
        return this.addRoute("DELETE", path);
    }

    /**
     * Executes a request against the first route matching its method and pathname.
     *
     * @remarks
     * Accepts absolute URLs and paths resolved against `http://localhost`.
     * Query parameters and the URL origin do not affect matching.
     * No HTTP request is sent and the response body is not serialized.
     *
     * @param request - The HTTP method and URL to simulate.
     * @returns The selected response, or a 404 response when no route matches.
     * @throws If no reply remains, a callback fails, or the URL or parameters
     * cannot be parsed.
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
