import { State } from "../entities/state";


/**
 * this is abtract interface of service for state entity
 * the job of this is to communiate between controller and abtract repository
 * here client doesnt know what is behavior of serivice
 */
export interface IStateService {
    read(): Promise<State>;   
  }