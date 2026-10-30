type SegmentParam<Segment extends string> =
    Segment extends `:${infer Name}` ? Name : never;

type ParamNames<Path extends string> =
    Path extends `${infer Segment}/${infer Rest}`
        ? SegmentParam<Segment> | ParamNames<Rest>
        : SegmentParam<Path>;

export type PathParams<Path extends string> =
    string extends Path
        ? Record<string, string>
        : {
            [Name in ParamNames<Path>]: string;
        };
