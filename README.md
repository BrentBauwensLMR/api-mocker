# api-mocker

Typed API mocks with dynamic replies, one-time responses, and reply sequences.

```bash
npm install api-mocker
```

## Quick start

```ts
import { createMockServer } from "api-mocker";

const mock = createMockServer();

mock.get("/users/:id").reply(200, ({ request }) => ({
    id: request.params.id,
    name: "Alice",
}));

const response = await mock.handle({ method: "GET", url: "/users/123" });
```

Route parameters are inferred as strings. Body callbacks can be synchronous or asynchronous:

```ts
mock.get("/profiles/:id").reply(200, async ({ request }) => ({
    id: request.params.id,
    name: "Alice",
}));
```

## Routes and replies

```ts
mock.get(path);
mock.post(path);
mock.put(path);
mock.delete(path);

route.reply(status, body?);
route.reply(status, bodyHandler);
route.reply(handler);
route.replyOnce(status, body?);
route.replyOnce(status, bodyHandler);
route.replyOnce(handler);
route.replySequence([responseOrHandler, ...]);
```

```ts
mock.get("/users")
    .replyOnce(503, { error: "Unavailable" })
    .reply(200, { users: [] });

mock.get("/jobs/:id").replySequence([
    { status: 202, body: { status: "pending" } },
    { status: 200, body: { status: "completed" } },
]);
```

One-time replies run first, followed by the sequence, then the default reply. Without a default, the last sequence item repeats.

With a status argument, callbacks return only the body. With `.reply(handler)` or `.replyOnce(handler)`, callbacks return the full `{ status, body?, headers? }` response.

## Node HTTP

```ts
import { createNodeAdapter } from "api-mocker/node";

const server = await createNodeAdapter(mock).listen({
    port: 3000,
    host: "127.0.0.1",
});

console.log(server.url);
await server.close();
```

## Vite

```ts
import { defineConfig } from "vite";
import { createMockServer } from "api-mocker";
import { apiMockerPlugin } from "api-mocker/vite";

const mock = createMockServer();

mock.get("/api/users").reply(200, { users: [] });

export default defineConfig({
    plugins: [apiMockerPlugin(mock, { prefix: "/api" })],
});
```

Call `fetch("/api/users")` from your frontend. The plugin handles `/api` routes on the Vite development server; other paths continue through Vite.

## Local demos

Requires Node.js 24. Run `npm install`, then:

```bash
npm run demo:core
npm run demo:node
npm run demo:vite
```

Generate the API reference with `npm run docs`.
