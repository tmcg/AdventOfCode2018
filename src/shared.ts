
import * as fs from 'fs';
import * as os from 'os';

export interface ISolution {
   readonly dayNumber: Number;
   solvePart1() : string;
   solvePart2() : string;
}

export class InputFile {
   _fileName : string;

   constructor(fileName : string) {
      this._fileName = fileName;
   }

   readLines() : string[] {
      return this.readText().split(os.EOL);
   }

   readText() : string {
      return fs.readFileSync(this._fileName, 'utf8');
   }
}