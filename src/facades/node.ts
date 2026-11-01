import {
    DefaultContainer,
    type Serializer,
} from "@littlemissrobot/highfive";

import type { MockServer } from "@/core/MockServer.js";
import { NodeHttpAdapter } from "@/adapters/NodeHttpAdapter.js";
import { JsonSerializer } from "@/serialization/JsonSerializer.js";

type NodeDependencies = {
    serializer: () => Serializer;
    adapter: (mock: MockServer) => NodeHttpAdapter;
};

export function container(): DefaultContainer<NodeDependencies> {
    const container = new DefaultContainer<NodeDependencies>();

    container.singleton("serializer", () => {
        return new JsonSerializer();
    });

    container.bind("adapter", (mock) => {
        return new NodeHttpAdapter(
            mock,
            container.make("serializer"),
        );
    });

    return container;
}
