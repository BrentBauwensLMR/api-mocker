import { DefaultContainer } from "@littlemissrobot/highfive";
import type { MockServer } from "@/core/MockServer.js";
import type { ViteAdapterOptions } from "@/types/vite.js";
import { ViteAdapter } from "@/adapters/ViteAdapter.js";
import { createNodeAdapter } from "@/node.js";

type ViteDependencies = {
    adapter: (mock: MockServer, options?: ViteAdapterOptions) => ViteAdapter;
};

export function container(): DefaultContainer<ViteDependencies> {
    const container = new DefaultContainer<ViteDependencies>();

    container.bind("adapter", (mock, options) => {
        return new ViteAdapter(createNodeAdapter(mock), options);
    });

    return container;
}
