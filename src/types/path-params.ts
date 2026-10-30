/** @inline */
type SegmentParam<Segment extends string> =
    Segment extends `:${infer Name}` ? Name : never;

/** @inline */
type ParamNames<Path extends string> =
    Path extends `${infer Segment}/${infer Rest}`
        ? SegmentParam<Segment> | ParamNames<Rest>
        : SegmentParam<Path>;

/**
 * Infers string-valued parameters from required `:name` path segments.
 * A general `string` path falls back to a string-keyed parameter record.
 *
 * @example
 * ```ts
 * type Params = PathParams<"/users/:id/posts/:postId">;
 * // { id: string; postId: string }
 * ```
 */
export type PathParams<Path extends string> =
    string extends Path
        ? Record<string, string>
        : {
            [Name in ParamNames<Path>]: string;
        };
