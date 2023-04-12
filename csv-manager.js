// FILE: csv-manager.js
// PROVIDES: A class to write to CSV files
// CLASS: CSVManager
// WRITTEN BY: Josh Kindarara
//
// CONSTRUCTOR
//  constructor(filename)
//      Precondition: A non-empty string must be passed in.
//      Postcondition: Appends string argument to the directory from which 
//      the program is being run. If the file does not exist, a new empty
//      one will be created.
//
// METHODS
//  writeRow(data)
//      Precondition: The argument must be an array.
//      Postcondition: Each element of the array is written into a row of the CSV file.
//
//  parseFile()
//      Precondition: The file must contain rows of data separated by double line breaks
//      and fields/cells separated by commas.
//      Postcondition: Returns an array of arrays where each inner array represents a
//      row of data in the CSV file, and each element in the inner array represents a
//      field in the CSV row. This method does not modify the contents of the file.
//
//  clear()
//      Postcondition: The CSV file is cleared.
//
//  filename()
//      Postcondition: Returns the name of the CSV file with the extension.
//
//  filename(filename)
//      Precondition: A non-empty string must be passed in.
//      Postcondition: Sets the name of the CSV file to string passed in and changes
//      the _filepath to point to the new location.
//
//  filepath()
//      Postcondition: Returns the full path of the CSV file.
//
// INVARIANT
//      1. _filename must be a string.
//      2. _filepath must be a string that ends with _filename.
//

const fs = require('fs');
const path = require('path');
//const readline = require('readline');

class CSVManager {
    constructor(filename) {
        this._filename = `${filename}.csv`;
        this._filepath = path.join(__dirname, this._filename);

        // Creates an empty file if the file doesn't exist
        try {
            fs.accessSync(this._filepath, fs.constants.F_OK);
        } catch (err) {
            fs.writeFileSync(this._filepath, '');
        }
    }

    writeRow(data) {
        let csv = '';

        data.forEach((item, i) => {
            if (item.includes(',')) {
                data[i] = `"${item}"`;
            }
        });
        
        csv += data.join(',') + '\n\n';

        fs.appendFileSync(this._filepath, csv);
    }
    
    /*
    readrow() {
        fs.readFile(this._filepath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }
            
            const fileStream = fs.createReadStream(this._filepath);
            const rl = readline.createInterface({
                input: fileStream,
                crlfDelay: Infinity
            });

            rl.on('line', (line) => {
                console.log(line);
                rl.close();
            })
            
            const rows = data.split('\n\n');
            let rowsResult = [];
            rows.forEach((row, i) => {
                if (i < rows.length - 1) { // skip last element (empty string)
                    rowsResult.push(row.split(','));
                }
            });
            
            return rowsResult;
        })
    }
    */

    parseFile() {
        const data = fs.readFileSync(this._filepath, 'utf8');

        const rows = data.trim().split('\n\n');
        const regex = /("[^"]*"|[^,"]+)/g;
        let rowsResult = [];
        rows.forEach((row) => {
            const rowResult = [];
            row.match(regex).forEach((value) => {
                rowResult.push(value.trim().replace(/"/g, ''));
            });
            rowsResult.push(rowResult);
        });
        
        return rowsResult;
    }

    clear() {
        fs.truncateSync(this._filepath, 0);
    }

    get filename() {
        return this._filename;
    }

    set filename(filename) {
        // try using fs.rename()
        this._filename = `${filename}.csv`;
        this._filepath = path.join(__dirname, this._filename);
    }

    get filepath() {
        return this._filepath;
    }
}

module.exports = CSVManager;