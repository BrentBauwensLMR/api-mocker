export type FetchInput = Parameters<typeof globalThis.fetch>;
export type FetchOutput = Awaited<ReturnType<typeof globalThis.fetch>>; // = Response
