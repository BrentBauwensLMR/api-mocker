import type { Serializer } from "@littlemissrobot/highfive";

export class JsonSerializer implements Serializer {
    serialize(value: unknown): string {
        const serialized = JSON.stringify(value);

        if (serialized === undefined) {
            throw new TypeError("Value cannot be serialized as JSON");
        }

        return serialized;
    }

    deserialize<T = unknown>(serialized: string): T {
        return JSON.parse(serialized) as T;
    }
}
