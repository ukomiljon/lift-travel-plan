import { State } from "../entities/state";

export interface IStateService {
    read(): Promise<State>;   
  }