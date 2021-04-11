import { IRule, Transport } from "./transportFactory";

export class LiftRange extends IRule {
    private min: number;
    private max: number;
    constructor(min: number, max: number) {
        super();
        this.min = min;
        this.max = max
    }
    isValid(transport: Transport) {
        if (transport.point.x < this.min) return false
        if (transport.point.y > this.max) return false
        return true
    }
}

export class LiftCapacity extends IRule {
    private capacity: number;

    constructor(capacity: number) {
        super();
        this.capacity = capacity;
    }
    isValid(transport: Transport) {
        if (transport.capacity < this.capacity) return true
        return false
    }
}
