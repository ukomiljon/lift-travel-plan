
/**
 * this is abtract interface of repository for sate entity
 * it helps loosely coupled  design between Business logic and repository
 */
export interface IStateRepository {
  
    read(): Promise<any>
}