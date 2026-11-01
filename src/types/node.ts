import type { IncomingMessage, ServerResponse } from "node:http";

export interface NodeHttpContext {
    request: IncomingMessage;
    response: ServerResponse;
}

export interface NodeListenOptions {
    port?: number;
    host?: string;
}

export interface RunningNodeServer {
    url: string;
    close(): Promise<void>;
}
