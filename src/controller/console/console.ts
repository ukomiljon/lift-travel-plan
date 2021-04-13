import { CsvReader, HclReader } from "../../data/file-repositories/file-reader.interface";
import { PassengerFileRepository } from "../../data/file-repositories/passenger-file.repository";
import { StateFileRepository } from "../../data/file-repositories/state-file.repository";
import { StateService } from "../../domain/services/implementations/state.service";
import { NearestNeighborAlgorithm } from "../../domain/usecases/algorithms/nearest-neighbor.method";
import { CentralHubFactory, LiftCentralHub, LiftNotifier, PassengerNotifier } from "../../domain/usecases/centralHub";
import { LiftCapacity, LiftRange } from "../../domain/usecases/rules";
import { Lift, LiftTransport, Transport } from "../../domain/usecases/transportFactory";

export class ConsoleUI {
    async run(...paths) {

        //passengers. C:/Users/Komil/source/repos/lift-plan/files/passengers.csv
        //state. C:/Users/Komil/source/repos/lift-plan/files/states/state_9.hcl
        // npm run plan C:/Users/Komil/source/repos/interview/lift-travel-plan/files/states/state_9.hcl

        // TODO! it needs to create Delivery Factory Pattern to cover all of this bottom.

        const stateRepository = new StateFileRepository(new HclReader(paths[0]))
        const stateService = new StateService(stateRepository)

        const passengerRepository = paths[1] && new PassengerFileRepository(new CsvReader(paths[1]))
        const passengers = passengerRepository && await passengerRepository.read();

        const statesData = await stateService.read()
        const transports = this.populateTransports(statesData.lift)
        const liftTransport = new LiftTransport(transports).create()
        liftTransport.setRouteOptimizer(new NearestNeighborAlgorithm())

        const passengerNotifier = new PassengerNotifier()
        const liftNotifier = new LiftNotifier();
        new LiftCentralHub(passengerNotifier, liftNotifier)

        console.log(statesData);

        statesData.passenger.forEach(element => {
            passengerNotifier.pressButton(element)
        });

        liftNotifier.perform(liftTransport)
    }

    populateTransports(data: any[]): Transport[] {

        const transports = []

        for (const item of data) {
            const lift = new Lift({
                id: item.id,
                point: {
                    at_level: item.at_level,
                    goto_level: item.goto_level
                },
                rules: [
                    new LiftRange(1, 100),
                    new LiftCapacity(3)
                ],
            })

            transports.push(lift)
        }

        return transports
    }


}
