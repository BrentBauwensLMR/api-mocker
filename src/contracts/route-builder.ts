import type { HttpStatusCode } from "@/types/http-status-code.js";

export interface RouteBuilderInterface {
    reply: (statusCode: HttpStatusCode, body: any) => RouteBuilderInterface
}
