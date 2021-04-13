 

import { ITransportService } from "./transportFactory";

export abstract class Notifier {
    protected centralHub: CentralHub;

    constructor(centralHub: CentralHub = null) {
        this.centralHub = centralHub;
    }

    public setCentralHub(centralHub: CentralHub): void {
        this.centralHub = centralHub;
    }
}

export interface CentralHub {
    notify(notifier: any, notification: any): void;
}

export abstract class CentralHubFactory implements CentralHub {
    notify(notifier: any, notification: any): void {
    }
}

export class PassengerNotifier extends Notifier {

    constructor(centralHub: CentralHub = null) {
        super(centralHub);
    }

    public async pressButton(notifier: any): Promise<void> {
        this.centralHub.notify(notifier, 'A');
    }

}

export class LiftNotifier extends Notifier {
    protected notifiers = []
    constructor(centralHub: CentralHub = null) {
        super(centralHub);
    }

    public perform(transportService: ITransportService): void {
        transportService.perform(this.notifiers)
    }

    public notify(notifier: any): void {
        if (this.isDuplicated(notifier)) return

        this.notifiers.push(notifier)
    }

    private isDuplicated(notifier: any) {
        if (this.notifiers.find(item => item.id === notifier.id))
            return true

        return false
    }    
}

export class LiftCentralHub implements CentralHubFactory {
 
    protected passengerNotifier: PassengerNotifier
    protected liftNotifier: LiftNotifier
    protected notifiers = []

    constructor(passengerComponent: PassengerNotifier, liftComponent: LiftNotifier) {
        this.passengerNotifier = passengerComponent;
        this.liftNotifier = liftComponent;

        this.passengerNotifier.setCentralHub(this);
        this.liftNotifier.setCentralHub(this);
    }
    notify(notifier: any, notification: any): void {
        this.liftNotifier.notify(notifier)
    }
 
}

