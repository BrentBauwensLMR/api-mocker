# api-mocker

**Build your frontend. Mock your backend. Test every scenario.**

A lightweight, type-safe API mocking library for TypeScript. Create realistic HTTP responses, simulate failures, and test your frontend without waiting for a backend.

Define your mocks once. Run them directly, through a standalone Node.js server, or inside your Vite development server.

```bash
npm install api-mocker
```

## Why api-mocker?

Building a frontend shouldn't depend on whether the backend is ready.

With `api-mocker`, you can:

- **Develop independently** — Mock endpoints while the real API is still being built.
- **Test failure scenarios** — Simulate unavailable services, rate limits, and retries.
- **Create realistic API behavior** — Return different responses across successive requests.
- **Write type-safe mocks** — Route parameters are automatically inferred from your paths.
- **Integrate with Vite** — Mock API requests directly inside your existing development server.
- **Use the same mocks in tests** — Execute requests without starting an HTTP server.

No separate backend project required.

## Quick start

Create your first mock server:

```ts
import { createMockServer } from "api-mocker";

const mock = createMockServer();

mock.get("/api/users").reply(200, {
  users: [
    { id: "1", name: "Alice" },
    { id: "2", name: "Bob" },
  ],
});
```

That's it. You've defined your first mocked endpoint.

### Dynamic responses

Need to respond differently depending on the request?

```ts
mock.get("/api/users/:id").reply(200, ({ request }) => ({
  id: request.params.id,
  name: "Alice",
}));
```

TypeScript automatically knows that `request.params.id` is a string.

No manual parameter types required.

### Simulate failures and retries

Real APIs don't always succeed. Your mocks shouldn't have to either.

```ts
mock
  .get("/api/users")
  .replyOnce(503, { error: "Service unavailable" })
  .replyOnce(429, { error: "Too many requests" })
  .reply(200, {
    users: [{ id: "1", name: "Alice" }],
  });
```

Requests return:

**503 → 429 → 200 → 200 → ...**

Perfect for testing retry logic, loading states, and error handling.

## Works with Vite

Already building a React or Vue application with Vite?

Integrate your mocks directly into the development server.

```ts
// vite.config.ts
import { defineConfig } from "vite";
import { createMockServer } from "api-mocker";
import { apiMockerPlugin } from "api-mocker/vite";

const mock = createMockServer();

mock.get("/api/users").reply(200, {
  users: [
    { id: "1", name: "Alice" },
    { id: "2", name: "Bob" },
  ],
});

export default defineConfig({
  plugins: [
    apiMockerPlugin(mock, {
      prefix: "/api",
    }),
  ],
});
```

Now make requests as usual:

```ts
const response = await fetch("/api/users");
const data = await response.json();

console.log(data.users);
```

The Vite plugin handles matching `/api` requests during development.

**No additional mock server process. No separate project.**

Other paths continue through Vite.

## Run a standalone mock server

Not using Vite? Start a real HTTP server using the Node adapter.

```ts
import { createMockServer } from "api-mocker";
import { createNodeAdapter } from "api-mocker/node";

const mock = createMockServer();

mock.get("/api/health").reply(200, {
  status: "ok",
});

const server = await createNodeAdapter(mock).listen({
  port: 3000,
  host: "127.0.0.1",
});

console.log(`Mock API running at ${server.url}`);
```

Your mocked API is now available at `http://127.0.0.1:3000`.

The adapter also provides `server.close()` for cleanup.

## Test without starting a server

Use the core engine directly in your tests.

```ts
import { createMockServer } from "api-mocker";

const mock = createMockServer();

mock
  .get("/api/users/:id")
  .reply(200, ({ request }) => ({
    id: request.params.id,
  }));

const response = await mock.handle({
  method: "GET",
  url: "/api/users/123",
});

console.log(response.status); // 200
console.log(response.body);   // { id: "123" }
```

No HTTP server, network port, or frontend framework required.

## API reference

### HTTP methods

Register routes using the HTTP method you need.

| Method | Description |
|---|---|
| `.get(path)` | GET requests |
| `.post(path)` | POST requests |
| `.put(path)` | PUT requests |
| `.delete(path)` | DELETE requests |

Each method returns a route builder that lets you configure the response.

### `.reply(status, body?)`

Return a static response.

```ts
mock.get("/users").reply(200, {
  users: [],
});

mock.delete("/users/1").reply(204);
```

The body can be an object, array, string, `null`, or omitted.

### `.reply(status, bodyHandler)`

Compute a response body dynamically while keeping the HTTP status fixed.

```ts
mock.get("/users/:id").reply(200, ({ request }) => ({
  id: request.params.id,
  name: "Alice",
}));
```

Asynchronous callbacks are supported:

```ts
mock.get("/profiles/:id").reply(200, async ({ request }) => ({
  id: request.params.id,
  createdAt: new Date().toISOString(),
}));
```

The callback returns the **response body**, not the full HTTP response.

### `.reply(handler)`

Control the complete response, including status, body, and headers.

```ts
mock.get("/users/:id").reply(({ request }) => ({
  status: request.params.id === "1" ? 200 : 404,
  body: {
    id: request.params.id,
  },
  headers: {
    "x-mock": "true",
  },
}));
```

Synchronous and asynchronous handlers are supported.

### `.replyOnce(status, body?)`

Return a response for one matching request.

```ts
mock
  .get("/users")
  .replyOnce(503, {
    error: "Service unavailable",
  })
  .reply(200, {
    users: [],
  });
```

The first request returns `503`. All subsequent requests return `200`.

### `.replyOnce(status, bodyHandler)`

Generate a one-time response body dynamically.

```ts
mock
  .get("/users/:id")
  .replyOnce(503, async ({ request }) => ({
    error: `User ${request.params.id} is temporarily unavailable`,
  }))
  .reply(200, ({ request }) => ({
    id: request.params.id,
  }));
```

### `.replyOnce(handler)`

Generate a complete one-time response.

```ts
mock
  .get("/users/:id")
  .replyOnce(({ request }) => ({
    status: 429,
    headers: {
      "retry-after": "1",
    },
    body: {
      error: `Try user ${request.params.id} again later`,
    },
  }))
  .reply(200, ({ request }) => ({
    id: request.params.id,
  }));
```

### `.replySequence(replies)`

Return a sequence of responses in order.

Useful for polling, background jobs, retries, and changing API states.

```ts
mock.get("/jobs/:id").replySequence([
  {
    status: 202,
    body: { status: "pending" },
  },
  {
    status: 202,
    body: { status: "processing" },
  },
  ({ request }) => ({
    status: 200,
    body: {
      id: request.params.id,
      status: "completed",
    },
  }),
]);
```

Sequence items can be response objects or synchronous/asynchronous full-response callbacks.

When the sequence is exhausted:

- If a default `.reply()` exists, use it.
- Otherwise, repeat the final sequence item.

### Combining response strategies

Mix one-time responses, sequences, and defaults.

```ts
mock
  .get("/jobs/:id")
  .replyOnce(503, {
    error: "Unavailable",
  })
  .replySequence([
    {
      status: 202,
      body: { status: "pending" },
    },
    {
      status: 202,
      body: { status: "processing" },
    },
  ])
  .reply(200, ({ request }) => ({
    id: request.params.id,
    status: "completed",
  }));
```

Result:

**503 → 202 → 202 → 200 → 200 → ...**

Response priority is always:

1. One-time replies.
2. Reply sequences.
3. Default reply.

Reply positions are shared by all requests matching the same registered route, even when path parameter values differ.

## Local demos

Explore the included examples:

```bash
npm install

npm run demo:core
npm run demo:node
npm run demo:vite
```

## Philosophy

**Mocking an API should be easier than building one.**

`api-mocker` is designed around a few simple principles:

- A fluent, readable API.
- Strong TypeScript inference.
- Predictable response behavior.
- Framework-independent core.
- Minimal setup for frontend development.
- Flexible scenarios for automated testing.

Define the behavior you need and keep building.

---

**Build your frontend. Mock your backend.**