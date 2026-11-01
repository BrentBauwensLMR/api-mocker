import { DefaultContainer } from "@littlemissrobot/highfive";
import type { Dependencies } from "@/types/dependencies.js";
import { MockEngine } from "@/core/MockEngine.js";
import { MockServer } from "@/core/MockServer.js";

export function container(): DefaultContainer<Dependencies> {
    const container = new DefaultContainer<Dependencies>();

    container.singleton("engine", () => {
        return new MockEngine();
    });

    container.singleton("server", () => {
        const engine = container.make("engine");

        return new MockServer(engine);
    });

    return container;
}
