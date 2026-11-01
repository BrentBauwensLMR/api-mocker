import { NodeHttpAdapter } from "@/adapters/NodeHttpAdapter.js";
import type { MockServer } from "@/core/MockServer.js";
import { container } from "@/facades/node.js";

export { NodeHttpAdapter };
export type { AdapterInterface } from "@/contracts/adapter.js";
export type { NodeHttpContext, NodeListenOptions, RunningNodeServer} from "@/types/node.js";

export function createNodeAdapter(mock: MockServer): NodeHttpAdapter {
    return container().make('adapter', mock);
}
