import type { MockServer } from "./core/MockServer.js";
import { container } from "./facades/container.js";

export function createMockServer(): MockServer {
    return container().make("server");
}
