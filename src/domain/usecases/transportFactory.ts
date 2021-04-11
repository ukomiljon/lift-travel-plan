import { stat } from "node:fs";
import { create } from "ts-node";
import { transform } from "typescript";

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

export class NearestNeighborAlgorithm implements IRouteOptimizer {

    protected matrix = new Array()
    protected maxLevel: number
    protected points: any[]
    protected waitersAtLevel: number[]
    protected transports: any[]
    protected routes = []

    public optimizeRoute(data: any, transports: any): any {
        this.points = data
        this.maxLevel = this.getMaxLevel(data, transports)
        this.transports = transports
        this.populateMap(data)

        transports.forEach(element => {
            this.routes[element.id] = []
        });

        return this.matrix
    }

    public getRoutes() {
        return this.routes
    }

    private setRoute(transport: any, route: any) {
        this.routes[transport.id].push(route);
    }

    public getRoute(transport: any): any {

        if (transport.direction && transport.direction == State.DOWN) {
            const route = this.findNearestDown(transport)
            this.update(transport, route)

            if (transport.direction && transport.point.at_level > 1)
                this.setRoute(transport, `LIFT ${transport.id}: GO ${State.DOWN}`);

            if (transport.direction === State.UP && transport.point.at_level < this.maxLevel)
                this.setRoute(transport, `LIFT ${transport.id}: GO ${State.UP}`);
            return

        }

        if (transport.direction && transport.direction == State.UP) {
            const route = this.findNearestUp(transport)
            this.update(transport, route)

            if (transport.direction) {
                if (transport.direction === State.UP) this.setRoute(transport, `LIFT ${transport.id}: GO ${State.UP}`);
                if (transport.direction === State.DOWN) this.setRoute(transport, `LIFT ${transport.id}: GO ${State.DOWN}`);
            }

            return
        }

        this.defineDirection(transport)
    }

    private defineDirection(transport: any) {

        const downRoute = this.findNearestDown(transport)
        const upRoute = this.findNearestUp(transport)

        if (downRoute && !upRoute) {
            transport.direction = State.DOWN

            const logs = this.collectItems(transport)
            this.printOnConsole(transport, logs)

            transport.point.at_level = downRoute

            if (downRoute == 1) transport.direction = null

            this.setRoute(transport, `LIFT ${transport.id}: GO ${State.DOWN}`);
            return
        }

        if (!downRoute && upRoute) {
            transport.direction = State.UP
            const logs = this.collectItems(transport)
            this.printOnConsole(transport, logs)
            this.setRoute(transport, `LIFT ${transport.id}: GO ${State.UP}`);
            return
        }

        if (!downRoute && !upRoute) {

            const logs = this.collectItems(transport)

            if (logs && logs.length > 0)
                this.setRoute(transport, `LIFT ${transport.id}: ${State.STOP} ${transport.point.at_level}`);

            this.printOnConsole(transport, logs)

            if (transport.direction === State.DOWN) this.setRoute(transport, `LIFT ${transport.id}: GO ${State.DOWN}`)
            if (transport.direction === State.UP) this.setRoute(transport, `LIFT ${transport.id}: GO ${State.UP}`)
            return
        }

        if (transport.point.at_level - downRoute < upRoute - transport.point.at_level) {
            transport.direction = State.DOWN
            const logs = this.collectItems(transport)
            if (logs && logs.length > 0)
                this.setRoute(transport, `LIFT ${transport.id}: ${State.STOP} ${transport.point.at_level}`);
            this.printOnConsole(transport, logs)
            this.setRoute(transport, `LIFT ${transport.id}: GO ${State.DOWN}`);
        }
        else {

            transport.direction = State.UP
            const logs = this.collectItems(transport)

            if (logs && logs.length > 0)
                this.setRoute(transport, `LIFT ${transport.id}: ${State.STOP} ${transport.point.at_level}`);

            this.printOnConsole(transport, logs)
            this.setRoute(transport, `LIFT ${transport.id}: GO ${State.UP}`);
        }
    }

    private printOnConsole(transport: any, logs: any) {
        if (logs && logs.length > 0) {
            logs.forEach(log => this.setRoute(transport, log));
        }
    }
    private update(transport: any, level: number) {
        transport.point.at_level = level

        let alightedLogs;
        let collectedLogs;
        if (transport.itemsIn) alightedLogs = this.alightItems(transport)
        if (transport.direction) collectedLogs = this.collectItems(transport)

        if (transport.capacity == 0) transport.direction = null

        if (alightedLogs && alightedLogs.length > 0) {

            this.setRoute(transport, `LIFT ${transport.id}: ${State.STOP} ${transport.point.at_level}`);

            this.printOnConsole(transport, alightedLogs)
            if (collectedLogs && collectedLogs.length > 0) {
                collectedLogs.forEach(log => this.setRoute(transport, log));
            }
            return
        }

        if (collectedLogs && collectedLogs.length > 0) {
            this.setRoute(transport, `LIFT ${transport.id}: ${State.STOP} ${transport.point.at_level}`);
            this.printOnConsole(transport, collectedLogs)
        }
    }

    private updateMatrix(point: any) {
        if (!this.matrix[point.at_level - 1][point.goto_level - 1]) return
        const items = this.matrix[point.at_level - 1][point.goto_level - 1].filter(item => item.id !== item.id)
        if (items.length === 0) this.matrix[point.at_level - 1][point.goto_level - 1] = null
        else
            this.matrix[point.at_level - 1][point.goto_level - 1] = items

        this.updateWaiters()
    }

    private alightItems(transport: any) {
        let logs = new Array()
        if (!transport.itemsIn) return null

        const itemsOut = transport.itemsIn.filter(item => item.goto_level === transport.point.at_level)

        for (const item of itemsOut) {
            item.state = State.LEAVE
            logs.push(`LIFT ${transport.id}: PASSENGER ${item.id} ${State.LEAVE}`);
            this.updateMatrix(item)
        }

        transport.itemsIn = transport.itemsIn.filter(item => item.goto_level !== transport.point.at_level)
        transport.capacity = !transport.itemsIn ? 0 : transport.itemsIn.length

        return logs
    }

    private collectItems(transport: any) {
        let logs = new Array()
        const row = this.matrix[transport.point.at_level - 1]
        const at_level = transport.point.at_level - 1
        if (!row) return

        for (let j = 0; j < row.length; j++) {
            if (!row) continue

            const items = row[j]

            if (!items) continue
            for (let i = 0; i < items.length; i++) {

                const item = items[i]

                if (item.state && (item.state === State.ENTER || item.state === State.LEAVE)) continue

                if (!transport.isValid()) return logs;

                if (!transport.itemsIn) transport.itemsIn = []
                if (transport.direction === State.DOWN && item.goto_level < at_level) {
                    transport.itemsIn.push(item)
                    item.state = State.ENTER
                    transport.capacity = transport.itemsIn.length;
                    logs.push(`LIFT ${transport.id}: PASSENGER ${item.id} ${State.ENTER}`);

                    continue
                }

                if (transport.direction === State.DOWN && item.goto_level > at_level) {
                    if (transport.itemsIn.length == 0) {
                        item.state = State.ENTER
                        transport.itemsIn.push(item)
                        transport.capacity = transport.itemsIn.length;
                        logs.push(`LIFT ${transport.id}: PASSENGER ${item.id} ${State.ENTER}`);
                        transport.direction = State.UP
                        continue
                    }
                }

                if (transport.direction === State.UP && item.goto_level > at_level) {
                    item.state = State.ENTER
                    transport.itemsIn.push(item)
                    transport.capacity = transport.itemsIn.length;
                    logs.push(`LIFT ${transport.id}: PASSENGER ${item.id} ${State.ENTER}`);

                    continue
                }

                if (transport.direction === State.UP && item.goto_level < at_level) {
                    if (transport.itemsIn.length == 0) {
                        item.state = State.ENTER
                        transport.itemsIn.push(item)
                        transport.capacity = transport.itemsIn.length;
                        logs.push(`LIFT ${transport.id}: PASSENGER ${item.id} ${State.ENTER}`);
                        transport.direction = State.DOWN
                        continue
                    }
                }

                if (!transport.direction) {
                    item.goto_level > at_level ?
                        transport.direction = State.UP
                        : transport.direction = State.DOWN
                    transport.itemsIn.push(item)
                    transport.capacity = transport.itemsIn.length;
                    item.state = State.ENTER
                    logs.push(`LIFT ${transport.id}: PASSENGER ${item.id} ${State.ENTER}`);
                }
            }
        }

        return logs
    }

    private findNearestDown(transport: any) {

        if (!transport.itemsIn || transport.itemsIn.length === 0) {
            const at_level = transport.point.at_level - 1
            for (let i = at_level - 1; i >= 0; i--) {
                if (this.waitersAtLevel[i] == 0) continue
                if (!transport.isValid()) continue
                return i + 1
            }
            return null
        }

        const itemsIn = transport.itemsIn
        let nearestDown = itemsIn[0]
        for (let i = 0; i < itemsIn.length; i++) {
            const element = itemsIn[i];
            if (element.goto_level > nearestDown.goto_level) nearestDown = element
        }

        return nearestDown.goto_level
    }

    private findNearestUp(transport: any) {
        if (!transport.itemsIn || transport.itemsIn.length === 0) {
            for (let i = transport.point.at_level; i < this.matrix.length; i++) {
                if (this.waitersAtLevel[i] == 0) continue
                if (!transport.isValid()) continue
                return i + 1
            }
            return null
        }

        const itemsIn = transport.itemsIn
        let nearestUp = itemsIn[0]
        for (let i = 0; i < itemsIn.length; i++) {
            const element = itemsIn[i];
            if (element.goto_level < nearestUp.goto_level) nearestUp = element
        }

        return nearestUp.goto_level
    }

    public isMissionCompleted(): boolean {
        for (const element of this.waitersAtLevel) {
            if (element > 0) return false
        }

        return true
    }

    private populateMap(data: any[]) {
        this.initMatrix()

        for (const state of data) {
            if (this.matrix[state.at_level - 1][state.goto_level - 1] == null) {
                this.matrix[state.at_level - 1][state.goto_level - 1] = [state]
            }
            else {

                this.matrix[state.at_level - 1][state.goto_level - 1].push(state)
            }
        }

        this.updateWaiters()
    }

    private updateWaiters() {
        for (let i = 0; i < this.maxLevel; i++) {
            let row = new Array()
            let count = 0
            for (let j = 0; j < this.maxLevel; j++) {
                count += this.matrix[i][j] && this.matrix[i][j].length
            }
            this.waitersAtLevel[i] = count
        }
    }

    private initMatrix() {

        this.matrix = new Array();
        this.waitersAtLevel = []

        for (let i = 0; i < this.maxLevel; i++) {
            let row = new Array()
            for (let j = 0; j < this.maxLevel; j++) {
                row.push(null)
            }

            this.matrix.push(row)
            this.waitersAtLevel.push(0)
        }
    }

    private getMaxLevel(data: any[], transports: any[]) {

        let maxLevel = 0
        for (const item of data) {
            if (item.at_level > maxLevel) maxLevel = item.at_level;
            if (item.goto_level > maxLevel) maxLevel = item.goto_level;
        }

        const max = this.getMaxLevelTransports(transports)
        return maxLevel > max ? maxLevel : max
    }

    private getMaxLevelTransports(transports: any[]) {
        let maxLevel = 0
        for (const item of transports) {
            if (item.point.at_level > maxLevel) maxLevel = item.point.at_level;
        }
        return maxLevel
    }
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





