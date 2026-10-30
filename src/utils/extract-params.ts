import type { PathParams } from "@/types/path-params.js";

export const extractParams = <T extends string>(path: string, routePath: string): PathParams<T> | null => {
    const expectedSegments = routePath.split("/");
    const actualSegments = path.split("/");

    if (expectedSegments.length !== actualSegments.length) {
        return null;
    }

    const entries: [string, string][] = [];

    for (const [index, expected] of expectedSegments.entries()) {
        const actual = actualSegments[index];

        if (actual === undefined) {
            return null;
        }

        if (expected.startsWith(":") && expected.length > 1) {
            if (actual.length === 0) {
                return null;
            }

            entries.push([
                expected.slice(1),
                decodeURIComponent(actual),
            ]);
        } else if (expected !== actual) {
            return null;
        }
    }

    return Object.fromEntries(entries) as PathParams<T>;
}
