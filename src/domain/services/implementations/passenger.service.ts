import { Passenger } from "../../entities/passenger";
import { IPassengerRepository } from "../../repository-interfaces/passenger-repository.interface";
import { IPassengerService } from "../passenger-service.interface";

/**
 * this is implimentation of IPassengerService for passenger entity  
 */
export class PassengerService implements IPassengerService {
    private readonly passengerRepository: IPassengerRepository;
    constructor(passengerRepository: IPassengerRepository) {
        this.passengerRepository = passengerRepository
    }
    async read(): Promise<any> {
        return await this.passengerRepository.read()
    }

}