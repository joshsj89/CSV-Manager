# CONSTRUCTOR

## constructor(filename)
### Precondition:
A string must be passed in.

### Postcondition:
Appends string argument to the directory from which the program is being run. If the file does not exist, a new empty one will be created.

# PRIVATE METHODS

## _referenceToIndices(parts)
### Precondition:
The argument must be an array of two elements where the first element is a string that represents the column letters of a cell, and the second element is a string that represents the row number of the cell. The column letters must only contain capital letters.

### Postcondition:
Converts column letter into a valid index for an array. Converts row number string to its respective number. It returns an array of two elements, where the first element is a number that represents the row index of the cell, and the second element is a number that represents the column index of the cell.

## _splitCellReference(cell)
### Precondition:
The argument must be a string that represents a valid cell reference (column letters followed by row numbers).

### Postcondition:
Splits cell into 2 strings of letters and numbers and returns an array holding them. The first element represents the column letters, and the second element represents the row number. The column letters will be capitalized.

# PUBLIC METHODS

## writeRow(data)
### Precondition:
The argument must be an array. Each element of the inner array should contain a string that represents the value in the cell.

### Postcondition:
Each element of the array is written into a row of the CSV file.

## writeRows(arr)
### Precondition:
The argument must be an array of arrays. The elements of the inner arrays represent the rows of a CSV file. Each element of the inner arrays should contain a string that represents the value in the cell.

### Postcondition:
Appends the contents of each inner array on each row with double line breaks between them.

## writeFile(arr)
### Precondition:
The argument must be an array of arrays. The elements of the inner arrays represent the rows of a CSV file. Each element of the inner arrays should contain a string that represents the value in the cell.

### Postcondition:
Clears file and writes the contents of each inner array on each row with double line breaks between them.

## parseFile()
### Precondition:
The file must contain rows of data separated by double line breaks and fields/cells separated by commas.

### Postcondition:
Returns an array of arrays where each inner array represents a row of data in the CSV file, and each element in the inner array represents a field in the CSV row. This method does not modify the contents of the file.

## getCell(cell)
### Precondition:
The argument must be a string that represents a valid cell reference (column letters followed by row numbers).

### Postcondition:
The value in the cell that is specified by the cell argument is returned if it exists. If it doesn't exist, an empty string is returned.

## getRow(rowNum)
### Precondition:
The argument must be a positive integer. It can be passed as a string or number.

### Postcondition:
Returns the row to which rowNum refers to as an array. If the index is out of range, an empty array is returned.

## clear()
### Postcondition:
The CSV file is cleared.

## deleteRow(rowNum)
### Precondition:
The argument must be a positive integer. It can be passed as a string or number.

### Postcondition:
The row to which rowNum refers to will be removed from the CSV file.

## deleteRowAndShift(rowNum)
### Precondition:
The argument must be a positive integer. It can be passed as a string or number.

### Postcondition:
The row to which rowNum refers to will be removed from the CSV file. All rows below the deleted row will be shifted up.

## rename(filename)
### Precondition:
A string must be passed in.

### Postcondition:
The CSV file is renamed to the new filename. If no errors occur, _filename and _filepath will be updated to reflect the filename and path.

## filename()
### Postcondition:
Returns the name of the CSV file with the extension.

## filename(filename)
### Precondition:
A string must be passed in.

### Postcondition:
Sets the name of the CSV file to string passed in and changes the _filepath to point to the new location.

## filepath()
### Postcondition:
Returns the full path of the CSV file.

# OPERATIONS

## copy(obj)
### Precondition:
An instance of the CSVManager must be passed in as the argument.

### Postcondition:
Copies the file pointed to by obj's filepath to the file pointed to by the instance calling the function. The file pointed to by the current instance of the object will be overwritten.

# NON-MEMBER FUNCTIONS

## compare(obj1, obj2)
### Precondition:
Two instances of CSVManager must be passed in as arguments.

### Postcondition:
Returns true if the contents of the two CSV files are the same.

# INVARIANT

1. _filename must be a string that ends with the extension ".csv".
2. _filepath must be a string that ends with _filename.

# CURRENT ISSUES / KNOWN BUGS

1. If the CSV file was written in a Windows text editor, parseFile() won't detect multiple rows because Windows makes a double line break '\r\n\r\n' while for Linux and macOS, '\n\n' is a double line break. A possible fix is changing to single line breaks and just splitting at '\n' which should work on all platforms.
