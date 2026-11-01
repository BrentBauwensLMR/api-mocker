import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import type { AdapterInterface } from "@/contracts/adapter.js";
import type { ServerInterface } from "@/contracts/server.js";
import type { NodeHttpContext, NodeListenOptions, RunningNodeServer } from "@/types/node.js";
import type { Response } from "@/types/response.js";
import type { Serializer } from "@littlemissrobot/highfive";
import { isHttpMethod } from "@/typeguards/isHttpMethod.js";

export class NodeHttpAdapter implements AdapterInterface<NodeHttpContext> {
    private server: Pick<ServerInterface, "handle">;
    private serializer: Serializer;

    constructor(server: Pick<ServerInterface, "handle">, serializer: Serializer) {
        this.server = server;
        this.serializer = serializer;
    }

    public async handle({ request, response }: NodeHttpContext): Promise<void> {
        // Resume the request stream to ensure that the request body can be read if needed.
        request.resume();

        try {
            if (!isHttpMethod(request.method)) {
                response.statusCode = 501;
                response.end();

                return;
            }

            const result = await this.server.handle({
                method: request.method,
                url: request.url ?? "/",
            });

            if (!response.destroyed && !response.writableEnded) {
                this.writeResponse(request, response, result);
            }
        } catch {
            this.writeError(request, response);
        }
    }

    public async listen(options: NodeListenOptions = {}): Promise<RunningNodeServer> {
        const port = options.port ?? 3000;
        const host = options.host ?? "127.0.0.1";

        const server = createServer((request, response) => {
            void this.handle({ request, response });
        });

        await new Promise<void>((resolve, reject) => {
            server.once("error", reject);

            server.listen(port, host, () => {
                server.off("error", reject);
                resolve();
            });
        });

        const address = server.address();

        if (address === null || typeof address === "string") {
            server.close();

            throw new Error("Unable to determine the HTTP server address");
        }

        const clientHost = host === "0.0.0.0" ? "127.0.0.1" : host === "::" ? "::1" : host;
        const hostname = clientHost.includes(":") ? `[${clientHost}]` : clientHost;

        let closing: Promise<void> | undefined;

        return {
            url: `http://${hostname}:${address.port}`,

            close() {
                if(closing === null || closing === undefined) {
                    closing = new Promise<void>((resolve, reject) => {
                        server.close((error) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve();
                            }
                        });
                    });
                }

                return closing;
            }
        };
    }

    private writeError(request: IncomingMessage, response: ServerResponse): void {
        if (response.destroyed || response.writableEnded) {
            return;
        }

        if (response.headersSent) {
            response.destroy();

            return;
        }

        for (const name of response.getHeaderNames()) {
            response.removeHeader(name);
        }

        response.statusCode = 500;
        response.setHeader("content-type", "application/json; charset=utf-8");

        response.end(request.method === "HEAD" ? undefined : '{"error":"Mock request failed"}');
    }

    private writeResponse(request: IncomingMessage, response: ServerResponse, result: Response): void {
        if (
            !Number.isInteger(result.status)
            || result.status < 200
            || result.status > 599
        ) {
            throw new Error(
                `Unsupported final HTTP status: ${result.status}`,
            );
        }

        const omitBody = request.method === "HEAD"
            || result.status === 204
            || result.status === 205
            || result.status === 304;

        // Serialize before setting headers so serialization failures can
        // still be returned as a clean 500 response.
        const { body, contentType } = omitBody
            ? {}
            : this.encodeBody(result.body);

        response.statusCode = result.status;

        for (const [name, value] of Object.entries(result.headers ?? {})) {
            response.setHeader(name, value);
        }

        if (omitBody) {
            response.removeHeader("content-length");
            response.removeHeader("transfer-encoding");

            if (result.status === 205) {
                response.setHeader("content-length", "0");
            }
        }

        if (contentType && !response.hasHeader("content-type")) {
            response.setHeader("content-type", contentType);
        }

        response.end(body);
    }

    private encodeBody(body: unknown): {
        body?: string | Uint8Array;
        contentType?: string;
    } {
        if (body === undefined) {
            return {};
        }

        if (typeof body === "string") {
            return {
                body,
                contentType: "text/plain; charset=utf-8",
            };
        }

        if (body instanceof Uint8Array) {
            return {
                body,
                contentType: "application/octet-stream",
            };
        }

        return {
            body: this.serializer.serialize(body),
            contentType: "application/json; charset=utf-8",
        };
    }
}
