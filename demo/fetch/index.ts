import { createMockServer, createFetch } from "api-mocker";

const mock = createMockServer();

mock.get("/users/:id")
    .replyOnce(503, { error: "Server unavailable" })
    .replySequence([
        { status: 202, body: { status: "loading" } },
        ({ request }) => ({
            status: 200,
            body: { id: request.params.id, name: "Alice" },
        }),
    ]);

mock.get("/profiles/:id").reply(200, async ({ request }) => ({
    id: request.params.id,
    name: "Bob",
}));

mock.get("/hello").reply(200, "Hello from api-mocker!");

const fetch = createFetch(mock);

for (let call = 1; call <= 4; call++) {
    const response = await fetch("/users/123");
    const body: unknown = await response.json();

    console.log(`Call ${call}:`, {
        status: response.status,
        ok: response.ok,
        body,
    });
}

const profile = await fetch(new Request("http://localhost/profiles/456"));
console.log("Request input + async reply:", await profile.json());

const greeting = await fetch("/hello");
console.log("Text reply:", await greeting.text());
