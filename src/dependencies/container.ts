import type { EngineInterface } from "@/contracts/engine.js";
import { MockEngine } from "@/core/MockEngine.js";
import { MockServer } from "@/core/MockServer.js";
import type { Dependencies } from "@littlemissrobot/highfive";
import { DefaultContainer } from "@littlemissrobot/highfive";

interface AppDependencies extends Dependencies {
    server: () => MockServer;
    engine: () => EngineInterface
};

const container = new DefaultContainer<AppDependencies>();

container.singleton("engine", () => {
    return new MockEngine();
});

container.singleton('server', () => {
    const engine = container.make("engine");

    return new MockServer(engine);
})

export default container;
