import { IPassengerRepository } from "../../domain/repository-interfaces/passenger-repository.interface";
import { IFileReader } from "./file-reader.interface";


/**
 * Concrete PassengerFile Repository provides implementations of the IPassengerFileRepository implements IPassengerRepository {
 interface.
 */
export class PassengerFileRepository implements IPassengerRepository {

    /**
     * @property to set concrete class of object
     */
    reader: IFileReader;

    /**
     * 
     * @param reader the object of concrete file reader class
     */
    constructor(reader: IFileReader) {
        this.reader = reader
    }

    /**
     * @method read from file
     * @returns returning data from file
     */
    async read(): Promise<any> {       
        return  this.reader.read()
    }
}
