import type { Plugin } from "vite";
import type { MockServer } from "@/core/MockServer.js";
import type { ViteAdapter } from "@/adapters/ViteAdapter.js";
import type { ViteAdapterOptions } from "@/types/vite.js";
import { container } from "@/facades/vite.js";

export { ViteAdapter } from "@/adapters/ViteAdapter.js";

export type { ViteAdapterContext, ViteAdapterOptions} from "@/types/vite.js";

export function createViteAdapter(mock: MockServer, options?: ViteAdapterOptions): ViteAdapter {
    return container().make("adapter", mock, options);
}

export function apiMockerPlugin( mock: MockServer, options?: ViteAdapterOptions): Plugin {
    return createViteAdapter(mock, options).plugin();
}
