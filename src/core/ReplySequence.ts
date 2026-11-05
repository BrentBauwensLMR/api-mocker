export class ReplySequence<T> {
    private onceReplies: T[] = [];
    private oncePosition = 0;

    private sequence: T[] = [];
    private sequencePosition = 0;

    private fallback: T | undefined;

    setFallback(reply: T): void {
        this.fallback = reply;
    }

    addOnce(reply: T): void {
        this.onceReplies.push(reply);
    }

    setSequence(replies: [T, ...T[]]): void {
        if (replies.length === 0) {
            throw new Error("A reply sequence must not be empty");
        }

        this.sequence = [...replies];
        this.sequencePosition = 0;
    }

    next(): T | undefined {
        if (this.oncePosition < this.onceReplies.length) {
            return this.onceReplies[this.oncePosition++];
        }

        if (this.sequencePosition < this.sequence.length) {
            return this.sequence[this.sequencePosition++];
        }

        return this.fallback ?? this.sequence.at(-1);
    }
}
