
import csvParser from 'csv-parser';
var hclParser = require("hcl-parser")
import fs from 'fs';

export abstract class IFileReader {
    protected path: string
    constructor(path: string) {
        this.path = path
    }
    abstract read(): any;
}


export class CsvReader extends IFileReader {

    async read() {
        const results = [];
        try {
           return  new Promise((resolve, reject) => {
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