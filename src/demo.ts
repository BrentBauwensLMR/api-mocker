import { createMockServer } from "./index.js";

const mock = createMockServer();

mock.get("/users").reply(200, {
    users: [
        { id: "1", name: "Alice" },
        { id: "2", name: "Bob" },
    ],
});

mock.post("/users").reply(201, {
    id: "3",
    name: "Charlie",
});

console.log(
    "GET:",
    await mock.handle({
        method: "GET",
        url: "/users",
    }),
);

console.log(
    "POST:",
    await mock.handle({
        method: "POST",
        url: "/users",
    }),
);

console.log(
    "Onbekend:",
    await mock.handle({
        method: "GET",
        url: "/unknown",
    }),
);
