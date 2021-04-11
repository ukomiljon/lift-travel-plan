import { Passenger } from "../entities/passenger";

export interface IPassengerService {
    read(): Promise<Passenger>;   
  }