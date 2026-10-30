import { createMockServer } from "./index.js";

const mock = createMockServer();

mock
    .get("/users/:id")
    .replyOnce(503, {
        error: "Even niet beschikbaar",
    })
    .replySequence([
        {
            status: 202,
            body: { status: "loading" },
        },
        ({ request }) => ({
            status: 200,
            body: {
                id: request.params.id,
                name: "Alice",
            },
        }),
    ]);

for (let call = 1; call <= 4; call++) {
    const response = await mock.handle({
        method: "GET",
        url: "/users/123",
    });

    console.log(`Call ${call}:`, response);
}

