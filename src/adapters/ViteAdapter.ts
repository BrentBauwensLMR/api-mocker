import type { Plugin } from "vite";
import type { AdapterInterface } from "@/contracts/adapter.js";
import type { NodeHttpContext } from "@/types/node.js";
import type { ViteAdapterContext, ViteAdapterOptions} from "@/types/vite.js";

export class ViteAdapter implements AdapterInterface<ViteAdapterContext> {
    private prefix: string;
    private adapter: AdapterInterface<NodeHttpContext>;

    constructor(adapter: AdapterInterface<NodeHttpContext>, options: ViteAdapterOptions = {}) {
        this.adapter = adapter;
        this.prefix = (options.prefix ?? "/api").replace(/\/+$/, "");

        if (!this.prefix.startsWith("/")) {
            throw new Error("The mock prefix must be a non-root path such as /api");
        }
    }

    public async handle({ request, response, next }: ViteAdapterContext): Promise<void> {
        const url = new URL(request.url ?? "/", "http://localhost");

        const matchesPrefix = url.pathname === this.prefix || url.pathname.startsWith(`${this.prefix}/`);

        if (!matchesPrefix) {
            next();

            return;
        }

        await this.adapter.handle({ request, response });
    }

    public plugin(): Plugin {
        return {
            name: "api-mocker",
            apply: "serve",

            configureServer: (server) => {
                server.middlewares.use((request, response, next) => {
                    void this.handle({
                        request,
                        response,
                        next,
                    }).catch(next);
                });
            },
        };
    }
}
