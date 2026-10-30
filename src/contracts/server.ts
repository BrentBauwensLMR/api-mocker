import type { RouteBuilderInterface } from "@/contracts/route-builder.js";

export interface ServerInterface {
    get: (path: string) => RouteBuilderInterface
    post: (path: string) => RouteBuilderInterface
    put: (path: string) => RouteBuilderInterface
    delete: (path: string) => RouteBuilderInterface
}
