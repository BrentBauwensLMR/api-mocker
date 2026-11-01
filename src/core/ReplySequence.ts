/** Selects one-time replies, then sequence items, then a default or repeated last item. */
export class ReplySequence<T> {
    private onceReplies: T[] = [];
    private oncePosition = 0;

    private sequence: T[] = [];
    private sequencePosition = 0;

    private fallback: T | undefined;

    /** Replaces the default without changing once or sequence positions. */
    setFallback(reply: T): void {
        this.fallback = reply;
    }

    /** Appends an item consumed before any sequence or default reply. */
    addOnce(reply: T): void {
        this.onceReplies.push(reply);
    }

    /** Replaces the sequence and restarts its position; rejects empty input. */
    setSequence(replies: [T, ...T[]]): void {
        if (replies.length === 0) {
            throw new Error("A reply sequence must not be empty");
        }

        this.sequence = [...replies];
        this.sequencePosition = 0;
    }

    /**
     * Reserves the next item synchronously, before a caller awaits its execution.
     * Returns undefined when no one-time item, sequence item, or default remains.
     */
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
