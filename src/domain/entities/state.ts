import { IState } from "./interfaces/iState";
import { Passenger } from "./passenger";

export class State implements IState {
    id: number;
    at_level: number;
    goto_level: number;

    constructor(payload: Partial<LiftPassenger>) {
        this.id = payload.id || 0
        this.at_level = payload.at_level || 0
        this.goto_level = payload.goto_level || 0
    }
}

export class LiftPassenger extends Passenger {
    at_level: number;
    goto_level: number;
    constructor(payload: Partial<LiftPassenger>) {
        super(payload);
        this.at_level = payload.at_level || 0
        this.goto_level = payload.goto_level || 0
    }
}

// interface LiftPassenger extends Passenger {
//     distance: number;
//     roadDistance: number;
// }

// interface Distance {
//     distance: number;
//     roadDistance: number;
// }

// interface LocationWithDistance extends Passenger, Distance {

// }