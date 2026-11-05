import {
    DefaultContainer,
    type Serializer,
} from "@littlemissrobot/highfive";

import type { MockServer } from "@/core/MockServer.js";
import { FetchAdapter } from "@/adapters/FetchAdapter.js";

type FetchDependencies = {
    serializer: () => Serializer;
    adapter: (mock: MockServer) => FetchAdapter;
};

export function container(): DefaultContainer<FetchDependencies> {
    const container = new DefaultContainer<FetchDependencies>();

    container.bind("adapter", (mock) => {
        return new FetchAdapter(mock);
    });

    return container;
}
