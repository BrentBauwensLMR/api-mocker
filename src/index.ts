import container from "./dependencies/container.js";
import type { MockServer } from "./core/MockServer.js";

export function createMockServer(): MockServer {
    return container.make("server");
}
