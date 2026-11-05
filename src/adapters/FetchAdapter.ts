import type { AdapterInterface } from "@/contracts/adapter.js";
import type { ServerInterface } from "@/contracts/server.js";
import { isHttpMethod } from "@/typeguards/isHttpMethod.js";
import type { FetchInput, FetchOutput } from "@/types/fetch.js";
import type { Response as MockResponse } from "@/types/response.js";

export class FetchAdapter implements AdapterInterface<FetchInput, FetchOutput> {
    private server: ServerInterface;

    constructor(server: ServerInterface) {
        this.server = server;
    }

    async handle(input: FetchInput): Promise<FetchOutput> {
        const [url, init] = input;

        const normalizedInput =
            typeof url === "string" || url instanceof URL
                ? new URL(url, "http://localhost")
                : url;

        const request = new Request(normalizedInput, init);

        if (!isHttpMethod(request.method)) {
            return new Response(null, { status: 501 });
        }

        const serverResponse = await this.server.handle({
            method: request.method,
            url: request.url,
        });

        return this.convertMockResponseToFetchResponse(serverResponse, request.method);
    }

    private convertMockResponseToFetchResponse(mockResponse: MockResponse, method: string): Response {
        const headers = new Headers(mockResponse.headers);

        const omitBody = method === "HEAD"
            || mockResponse.status === 204
            || mockResponse.status === 205
            || mockResponse.status === 304;

        const { body, contentType } = omitBody
            ? {}
            : this.encodeBody(mockResponse.body);

        if (contentType && !headers.has("content-type")) {
            headers.set("content-type", contentType);
        }

        return new Response(body ?? null, {
            status: mockResponse.status,
            headers,
        });
    }

    private encodeBody(body: unknown): { body?: BodyInit; contentType?: string } {
        if (body === undefined) {
            return {};
        }

        if (typeof body === "string") {
            return { body, contentType: "text/plain; charset=utf-8" };
        }

        if (body instanceof Uint8Array) {
            return {
                body: new Uint8Array(body),
                contentType: "application/octet-stream",
            };
        }

        const serialized = JSON.stringify(body);

        if (serialized === undefined) {
            throw new TypeError("Response body cannot be serialized as JSON");
        }

        return {
            body: serialized,
            contentType: "application/json; charset=utf-8",
        };
    }

}
