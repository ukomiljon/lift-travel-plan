import { Passenger } from "../entities/passenger";

/**
 * this is abtract interface of service for passenger entity
 * the job of this is to communiate between controller and abtract repository
 * here client doesnt know what is behavior of serivice
 */
export interface IPassengerService {
    read(): Promise<Passenger>;   
  }