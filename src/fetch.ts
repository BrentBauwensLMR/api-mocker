import type { MockServer } from "@/core/MockServer.js";
import { container } from "@/facades/fetch.js";

export { FetchAdapter } from "@/adapters/FetchAdapter.js";

export function createFetch(mock: MockServer): typeof globalThis.fetch {
    const adapter = container().make("adapter", mock);

    return (...args) => adapter.handle(args);
}
