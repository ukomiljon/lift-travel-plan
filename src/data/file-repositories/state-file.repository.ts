import { IStateRepository } from "../../domain/repository-interfaces/state-repository.interface";
import { IFileReader } from "./file-reader.interface";


/**
 * Concrete StateFile Repository provides implementations of the IStateFileRepository implements IStateRepository {
 interface.
 */
export class StateFileRepository implements IStateRepository {
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
        return this.reader.read()
    }
}