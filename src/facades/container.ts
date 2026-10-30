import { DefaultContainer } from "@littlemissrobot/highfive";
import type { Dependencies } from "@/types/dependencies.js";
import { MockEngine } from "@/core/MockEngine.js";
import { MockServer } from "@/core/MockServer.js";

/** Creates a fresh dependency scope; singletons are shared only within this scope. */
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
