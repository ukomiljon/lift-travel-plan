
import csvParser from 'csv-parser';
import fs from 'fs';
var hclParser = require("hcl-parser")

/**
 * Represented interface of File Reader
 * @constructor
 * @param {string} path - the location of the file where to be read
 */ 
export abstract class IFileReader {
    protected path: string
    constructor(path: string) {
        this.path = path
    }
    /**
     * abstract method (factory method) to change logic of reading from different type of file
     * @returns returning result from reading of file 
     */
    abstract read(): any;
}


/**
 * csv reader implimentation based in 
 */
export class CsvReader extends IFileReader {

   
    async read() {
        const results = [];
        try {
            return new Promise((resolve, reject) => {
                fs.createReadStream(this.path)
                    .on('error', error => {
                        reject(error);
                    })
                    .pipe(csvParser())
                    .on('data', (row) => {
                        results.push(row)
                    })
                    .on('end', () => {
                        resolve(results);
                    });
            });

        } catch (error) {
            console.log(error);
        }

    }
}

export class HclReader extends IFileReader {

    read() {

        try {
            const [data, err] = hclParser.parse(fs.readFileSync(this.path, 'utf8'));
            return data

        } catch (err) {
            console.log('Error:', err);
        }
    }
}