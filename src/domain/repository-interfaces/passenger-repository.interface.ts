
/**
 * this is abtract interface of repository for passenger entity
 * it helps loosely coupled  design between Business logic and repository
 */
export interface IPassengerRepository {
  
    read(): Promise<any>
}