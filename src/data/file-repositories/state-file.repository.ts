import { IStateRepository } from "../../domain/repository-interfaces/state-repository.interface";
import { IFileReader } from "./file-reader.interface";

export class StateFileRepository implements IStateRepository {

    reader: IFileReader;
    constructor(reader: IFileReader) {
        this.reader = reader
    }
    async read(): Promise<any> {
        return this.reader.read()
    }
}