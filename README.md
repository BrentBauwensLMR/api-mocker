# api-mocker

A TypeScript library for defining mock API responses with inferred path parameters, and deterministic reply sequences.

The project currently implements a transport-independent core. Requests are passed directly to `mock.handle()`, which returns a plain response description. Creating a mock server does not start an HTTP server or intercept `fetch()` requests.

## Run locally

Use Node.js 24 and install the project dependencies:

```bash
npm install
npm run demo
```

The examples below can be used in `src/demo.ts`. They import the local source entry point; package publishing and consumer installation are not configured yet.

## Quick start

```ts
import { createMockServer } from "./index.js";

const mock = createMockServer();

mock.get("/users/:id").reply(({ request }) => ({
    status: 200,
    body: {
        id: request.params.id,
        name: "Alice",
    },
}));

const response = await mock.handle({
    method: "GET",
    url: "/users/123",
});

console.log(response);
// {
//     type: "http",
//     status: 200,
//     body: { id: "123", name: "Alice" },
// }
```

Each call to `createMockServer()` creates an independent server with its own routes and reply positions.

## Static replies

Use `.reply(status, body)` to configure a default response:

```ts
mock.get("/users").reply(200, {
    users: [],
});

mock.post("/users").reply(201, {
    id: "123",
    name: "Alice",
});
```

The current route helpers are `.get()`, `.post()`, `.put()`, and `.delete()`. Calling `.reply()` again on the same builder replaces that route's default response.

## Dynamic replies and typed parameters

Required parameters use `:name` segments. Keep the path as a literal so TypeScript can infer parameter names:

```ts
mock.get("/users/:id/actions/:actionId").reply(({ request }) => ({
    status: 200,
    body: {
        userId: request.params.id,
        actionId: request.params.actionId,
    },
}));
```

Both parameters are typed as `string`. Accessing an undeclared parameter, such as `request.params.unknown`, is a TypeScript error. A path typed only as `string` falls back to a string-keyed parameter record.

Callbacks can return a response directly or return a promise. They receive the input request with decoded `params`. Return `status`, an optional `body`, and optional `headers`; the core adds `type: "http"`.

```ts
mock.get("/profile/:id").reply(async ({ request }) => {
    const profile = await Promise.resolve({
        id: request.params.id,
        name: "Alice",
    });

    return {
        status: 200,
        headers: { "x-mock": "true" },
        body: profile,
    };
});
```

## One-time replies

Use `.replyOnce()` to consume one reply per matching request:

```ts
mock.get("/retry-users")
    .replyOnce(500, { error: "Server unavailable" })
    .replyOnce(429, { error: "Too many requests" })
    .reply(200, { users: [] });
```

The first request returns `500`, the second returns `429`, and all subsequent requests return `200`.

`.replyOnce()` also accepts a synchronous or asynchronous callback. Requests that do not match the route do not consume its replies. Once selected, a one-time reply is consumed even if its callback fails.

## Reply sequences

Use `.replySequence()` with a non-empty array of responses or callbacks:

```ts
mock.get("/jobs/:id").replySequence([
    { status: 202, body: { status: "pending" } },
    { status: 202, body: { status: "processing" } },
    ({ request }) => ({
        status: 200,
        body: {
            id: request.params.id,
            status: "completed",
        },
    }),
]);
```

After the sequence is exhausted, its last item repeats. A repeated callback executes again with the current request.

If `.reply()` is also configured, that default takes over after the last sequence item has been consumed:

```ts
mock.get("/status")
    .replySequence([
        { status: 202, body: { ready: false } },
        { status: 202, body: { ready: false } },
    ])
    .reply(200, { ready: true });
```

This returns `202`, `202`, then `200` for all later requests.

### Selection rules

| Priority | Available reply | Behavior |
| --- | --- | --- |
| 1 | One-time replies | Consume in registration order. |
| 2 | Sequence items | Consume in array order. |
| 3 | Default reply | Use the response or callback configured by `.reply()`. |
| 4 | Last sequence item | Repeat it when no default is configured. |

The priority is independent of the order in which `.reply()`, `.replyOnce()`, and `.replySequence()` appear in the chain. Calling `.replySequence()` again replaces the sequence and restarts its position.

Positions belong to the registered route. Requests to `/jobs/1` and `/jobs/2` share the same sequence when both match `/jobs/:id`; positions are not tracked per parameter value.

If no reply is available, `handle()` rejects with an error. For example, a route configured only with `.replyOnce()` has no reply left after that item is consumed.

## Request matching and responses

- Routes are checked in registration order. The first matching route wins, so register specific routes before overlapping parameter routes.
- Matching uses the HTTP method and pathname. Named parameters match one non-empty path segment.
- Pathnames are case-sensitive, and trailing slashes are significant.
- Query parameters and the URL origin do not affect matching.
- Relative paths are resolved against `http://localhost`; absolute URLs are also accepted.
- A route miss returns `{ type: "http", status: 404, body: { error: "No matching mock route" } }`.
- Callback errors and malformed URL or parameter parsing errors reject `handle()`.

Responses are plain objects, not Fetch API `Response` instances. Bodies are not serialized or cloned. Avoid mutating a static response body if it will be reused, or use a callback to construct a fresh body for each request.

## Current scope

Implemented: route registration, required path parameters, static and asynchronous callback replies, one-time replies, reply sequences, and server instance isolation.

Not implemented yet: query/header/body predicates, request bodies in callback context, call counters and stores, delays, history, resets, snapshots, events, SSE, and transport adapters. Additional route helpers such as `.patch()`, `.head()`, `.options()`, and `.any()` are also planned.

## API documentation

Public API comments use TSDoc-style syntax. TypeDoc generates the reference from the exports in `src/index.ts`:

```bash
npm run docs
```

Open `docs/api/index.html` to browse the generated reference. While editing comments, rebuild automatically with:

```bash
npm run docs:watch
```

Update this README for usage guides and scenarios. Document method behavior, parameters, and examples beside the public declarations. The generated `docs/api/` directory is ignored by Git.

## Development

| Command | Purpose |
| --- | --- |
| `npm run demo` | Build and execute `src/demo.ts`. |
| `npm run build` | Compile TypeScript and rewrite import aliases for Node. |
| `npm run typecheck` | Check TypeScript without emitting files. |
| `npm run lint` | Check code with ESLint. |
| `npm run lint:fix` | Apply automatic ESLint fixes, including unused imports and indentation. |
| `npm run docs` | Generate the API reference. |
| `npm run docs:watch` | Regenerate the reference as its sources change. |

The core uses [Highfive](https://github.com/Little-Miss-Robot/highfive) for dependency injection. Each server factory call creates a fresh container scope.
