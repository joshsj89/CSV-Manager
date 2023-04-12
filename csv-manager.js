// FILE: csv-manager.js
// PROVIDES: A class to write to CSV files
// CLASS: CSVManager
// WRITTEN BY: Josh Kindarara
//
// CONSTRUCTOR
//  constructor(filename)
//      Precondition: A string must be passed in.
//      Postcondition: Appends string argument to the directory from which 
//      the program is being run. If the file does not exist, a new empty
//      one will be created.
//
// PRIVATE METHODS
//  _referenceToIndices(parts)
//      Precondition: The argument must be an array of two elements where the first element
//      is a string that represents the column letters of a cell, and the second element is a
//      string that represents the row number of the cell. The column letters must only contain
//      capital letters.
//      Postcondition: Converts column letter into a valid index for an array. Converts
//      row number string to its respective number. It returns an array of two elements, where
//      the first element is a number that represents the row index of the cell, and the second
//      element is a number that represents the column index of the cell.
//
//  _splitCellReference(cell)
//      Precondition: The argument must be a string that represents a valid cell reference
//      (column letters followed by row numbers)
//      Postcondition: Splits cell into 2 strings of letters and numbers and returns an 
//      array holding them. The first element represents the column letters, and the second
//      element represents the row number. The column letters will be capitalized.
//
// PUBLIC METHODS
//  writeRow(data)
//      Precondition: The argument must be an array. Each element of the inner array
//      should contain a string that represents the value in the cell.
//      Postcondition: Each element of the array is written into a row of the CSV file.
//
//  writeFile(arr)
//      Precondition: The argument must be an array of arrays. The elements of the inner
//      arrays represent the rows of a CSV file. Each element of the inner arrays should
//      contain a string that represents the value in the cell.
//      Postcondition: Writes the contents of each inner array on each row with double
//      line breaks between them.
//
//  parseFile()
//      Precondition: The file must contain rows of data separated by double line breaks
//      and fields/cells separated by commas.
//      Postcondition: Returns an array of arrays where each inner array represents a
//      row of data in the CSV file, and each element in the inner array represents a
//      field in the CSV row. This method does not modify the contents of the file.
//
//  getCell(cell)
//      Precondition: The argument must be a string that represents a valid cell reference
//      (column letters followed by row numbers)
//      Postcondition: The value in the cell that is specified by the cell argument is
//      returned if it exists. If it doesn't exist, an empty string is returned.
//
//  clear()
//      Postcondition: The CSV file is cleared.
//
//  rename(filename)
//      Precondition: A string must be passed in.
//      Postcondition: The CSV file is renamed to the new filename. If no errors occur,
//      _filename and _filepath will be updated to reflect the filename and path.
//
//  filename()
//      Postcondition: Returns the name of the CSV file with the extension.
//
//  filename(filename)
//      Precondition: A string must be passed in.
//      Postcondition: Sets the name of the CSV file to string passed in and changes
//      the _filepath to point to the new location.
//
//  filepath()
//      Postcondition: Returns the full path of the CSV file.
//
// INVARIANT
//      1. _filename must be a string that ends with the extension ".csv".
//      2. _filepath must be a string that ends with _filename.
//
// CURRENT ISSUES / KNOWN BUGS
//  1.  None as of now.
//
// FUTURE ADDITIONS
//  1.  A deleteRow(rowIndex) method. It could probably use parseFile(), clear(), and writeFile().
//  2.  A getRow(rowIndex) function
//  3.  a readRow(rowIndex) function
//

const fs = require('fs');
const path = require('path');

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

    writeFile(arr) {
        for (let i = 0; i < arr.length; i++) {
            this.writeRow(arr[i]);
        }
    }

    parseFile() {
        const data = fs.readFileSync(this._filepath, 'utf8');

        const rows = data.trim().split('\r\n\r\n');
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

    _referenceToIndices(parts) {
        const rowIndex = Number(parts[1]) - 1;
        let colIndex = 0;

        for (let i = 0; i < parts[0].length; i++) {
            colIndex *= 26;
            colIndex += parts[0].charCodeAt(i) - 64; // 64 is 'A'.charCodeAt(0) - 1
        }

        colIndex--;
        return [rowIndex,colIndex];
    }

    _splitCellReference(cell) {
        const regex = /(([A-Z]|[a-z])+[1-9]\d*)/;
        const regex2 = /(([A-Z]|[a-z])+)/;
        
        const matches = cell.match(regex);
        if (matches && matches['index'] === 0) {
            const splits = cell.split(regex2);
            const parts = [splits[1].toUpperCase(), splits[3]];
            return parts;
        } else {
            throw Error('The cell reference passed into getCell() is not valid.');
        }
    }

    getCell(cell) {

        const cvsArray = this.parseFile();

        const parts = this._splitCellReference(cell);
        const indices = this._referenceToIndices(parts);

        if (!cvsArray[indices[0]]) {
            return '';
        } else if (!cvsArray[indices[0]][indices[1]]) {
            return '';
        }

        return cvsArray[indices[0]][indices[1]];
    }

    clear() {
        fs.truncateSync(this._filepath, 0);
    }

    rename(filename) {
        filename = `${filename}.csv`;
        const filepath = path.join(__dirname, filename);

        try {
            fs.renameSync(this._filepath, filepath);
        } catch(err) {
            switch (err.code) {
                case 'ENOENT':
                    console.error('File not found.');
                    break;
                case 'EACCES':
                    console.error('The user does not have permission to modify the file.');
                    break;
                case 'EBUSY':
                    console.error('The file is being used by another program.');
                    break;
                default:
                    console.error('Error: ', err);
            }

            return;
        }

        this._filename = filename;
        this._filepath = filepath;
    }

    get filename() {
        return this._filename;
    }

    set filename(filename) {
        this._filename = `${filename}.csv`;
        this._filepath = path.join(__dirname, this._filename);
    }

    get filepath() {
        return this._filepath;
    }
}

module.exports = CSVManager;