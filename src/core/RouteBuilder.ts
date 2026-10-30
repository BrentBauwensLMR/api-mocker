import type { RouteBuilderInterface } from "@/contracts/route-builder.js";
import type { RouteInterface } from "@/contracts/route.js";
import type { Response } from "@/types/response.js";

export class RouteBuilder implements RouteBuilderInterface {
    private route: RouteInterface;

    constructor(route: RouteInterface) {
        this.route = route;
    }

    public reply(status: number, body?: unknown): this {
        const response: Response = {
            type: "http",
            status,
            body,
        };

        this.route.setResponse(response);

        return this;
    }
}
