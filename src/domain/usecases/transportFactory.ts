 
export abstract class TransportFactory {
    public abstract create(): ITransportService;
}

export class LiftTransport extends TransportFactory {

    protected transports: Transport[];
    protected maxLevel: number;

    constructor(transports: Transport[]) {
        super();
        this.transports = transports
    }

    public create(): ITransportService {
        return new SmartLift(this.transports);
    }
}

export abstract class Transport {
    id: number;
    point: any;
    rules: IRule[];
    capacity: number;
    itemsIn: []

    constructor(payload: Partial<Transport>) {
        this.id = payload.id || 0
        this.point = payload.point || null
        this.rules = payload.rules || []
        this.capacity = payload.capacity || 0
    }

    public abstract addRule(rule: IRule): any;
    public abstract perform(point: any): void;
    public abstract isValid(): boolean
}

export abstract class ITransportService {
    protected transports: Transport[];
    protected routeOptimizer: IRouteOptimizer;
    protected points: any;

    constructor(transports: Transport[]) {
        this.transports = transports
    }

    public abstract perform(points: any): void;
    public abstract setRouteOptimizer(routeOptimizer: IRouteOptimizer): void
}

export abstract class IRule {
    protected component: Transport;
    abstract isValid(transport: Transport)
}

export interface IRouteOptimizer {
    optimizeRoute(data: any, transports: any): any
    getRoute(data: any): any
    getRoutes(): any
    isMissionCompleted(): boolean
}


export class Lift extends Transport {
    public isValid(): boolean {
        for (const rule of this.rules) {

            if (!rule.isValid(this)) return false
        }

        return true
    }
    public addRule(rule: IRule) {
        this.rules.push(rule)
    }
    public perform(points: any): void {

    }
}

export enum State { UP = 'UP', DOWN = 'DOWN', STOP = 'STOP', ENTER = 'ENTER', LEAVE = 'LEAVE' }

export class SmartLift extends ITransportService {

    public perform(points: any): void {
        this.points = points
        this.routeOptimizer.optimizeRoute(this.points, this.transports)
        this.performTransports()
    }

    private performTransports() {
        while (!this.routeOptimizer.isMissionCompleted()) {
            for (const transport of this.transports) {
                this.routeOptimizer.getRoute(transport)
            }
        }

        this.printOutRoutes(this.routeOptimizer.getRoutes())
    }

    public printOutRoutes(routes: any[]) {
        routes.forEach(item => {
            console.log()
            item.forEach(log => {
                console.log(log);
            });
        });
    }

    public setRouteOptimizer(routeOptimizer: IRouteOptimizer): void {
        this.routeOptimizer = routeOptimizer
    }
}






