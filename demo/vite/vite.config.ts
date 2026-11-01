import { defineConfig } from "vite";
import { createMockServer } from "api-mocker";
import { apiMockerPlugin } from "api-mocker/vite";

const mock = createMockServer();

mock.get("/api/users/:id")
    .replyOnce(503, { error: "Server unavailable" })
    .replySequence([
        { status: 202, body: { status: "loading" } },
        ({ request }) => ({
            status: 200,
            body: { id: request.params.id, name: "Alice" },
        }),
    ])
    .reply(200, async ({ request }) => {
        const response = {
            id: request.params.id,
            name: "Alice",
            createdAt: new Date().toISOString(),
            frequentItems: ["apple", "banana", "orange"],
        };

        return response;
    });

export default defineConfig({
    plugins: [apiMockerPlugin(mock)],
});
