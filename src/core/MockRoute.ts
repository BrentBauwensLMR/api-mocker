import type { RouteInterface } from "@/contracts/route.js";
import type { HttpMethod } from "@/types/http-method.js";
import type { Response } from "@/types/response.js";

export class MockRoute implements RouteInterface {
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

    /**
     * The response for this route
     * example: { status: 200, body: { message: "OK" } }
     */
    private response: Response | null = null;

    constructor(method: HttpMethod, path: string) {
        this.method = method;
        this.path = path;
    }

    public matches(method: string, path: string): boolean {
        return this.method === method && this.path === path;
    }

    public setResponse(response: Response): void {
        this.response = response;
    }

    public resolve(): Response {
        if (!this.response) {
            throw new Error(`No response set for route ${this.method} ${this.path}`);
        }

        return this.response;
    }
}
