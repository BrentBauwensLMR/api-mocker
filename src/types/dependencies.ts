import type { NodeHttpAdapter } from "@/adapters/NodeHttpAdapter.js";
import type { EngineInterface } from "@/contracts/engine.js";
import type { MockServer } from "@/core/MockServer.js";
import type { Dependencies as HighFiveDependencies } from "@littlemissrobot/highfive";

export interface Dependencies extends HighFiveDependencies {
    server: () => MockServer;
    engine: () => EngineInterface
    adapter: () => NodeHttpAdapter;
};
