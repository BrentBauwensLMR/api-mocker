import { createMockServer } from "api-mocker";
import { createNodeAdapter } from "api-mocker/node";

const mock = createMockServer();

mock.get("/users/:id/qddqd")
    .replyOnce(503, { error: "Even niet beschikbaar" })
    .replySequence([
        { status: 202, body: { status: "loading" } },
        { status: 200, body: { status: "ready" } },
        { status: 200, body: { status: "complete" } },
        ({ request }) => ({
            status: 200,
            body: { id: request.params.id, name: "Alice" },
        }),
    ]);

const server = await createNodeAdapter(mock).listen({ port: 3000 });

console.log(`Mock API: ${server.url}`);
console.log(`Try: curl -i ${server.url}/users/123`);

function shutdown(): void {
    void server.close().catch((error: unknown) => {
        console.error("Could not close the mock server:", error);
        process.exitCode = 1;
    });
}

process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);
