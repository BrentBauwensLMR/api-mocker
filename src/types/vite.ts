import type { NodeHttpContext } from "@/types/node.js";

export interface ViteAdapterContext extends NodeHttpContext {
    next(error?: unknown): void;
}

export interface ViteAdapterOptions {
    prefix?: string;
}
