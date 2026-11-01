export interface AdapterInterface<Input, Output = void> {
    handle(input: Input): Promise<Output>;
}
