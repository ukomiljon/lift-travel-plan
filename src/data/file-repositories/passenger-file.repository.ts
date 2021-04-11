import { IPassengerRepository } from "../../domain/repository-interfaces/passenger-repository.interface";
import { IFileReader } from "./file-reader.interface";

export class PassengerFileRepository implements IPassengerRepository {

    reader: IFileReader;
    constructor(reader: IFileReader) {
        this.reader = reader
    }
    async read(): Promise<any> {       
        return  this.reader.read()
    }
}
