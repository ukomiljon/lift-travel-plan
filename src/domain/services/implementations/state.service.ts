import { IState } from "../../entities/interfaces/iState";
import { State } from "../../entities/state";
import { IStateRepository } from "../../repository-interfaces/state-repository.interface";
import { IStateService } from "../state-service.interface";


/**
 * this is implimentation of IStateService for state entity 
 */
export class StateService implements IStateService {
    private readonly stateRepository: IStateRepository;
    constructor(stateRepository:IStateRepository) {
        this.stateRepository = stateRepository
    }
    async read(): Promise<any> {
        return await this.stateRepository.read()
    }

}