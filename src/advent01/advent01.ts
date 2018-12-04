
import { ISolution, InputFile } from '../shared';

class Solution1 implements ISolution {
   _inputFileName : string = './src/advent01/input.txt';

   dayNumber : Number = 1;

   solvePart1() : string {
      let frequency : number = 0;

      var inputFile = new InputFile(this._inputFileName);
      var lines = inputFile.readLines();

      for (var line of lines) {
         frequency += +line;
      }

      return frequency.toString();
   }

   solvePart2() : string {
      let frequency : number = 0;

      var inputFile = new InputFile(this._inputFileName);
      var lines = inputFile.readLines();
      var history : any = {};

      while(true) {
         for (var line of lines) {
            frequency += +line;

            let key = frequency.toString();
            if (key in history)
               return key;

            history[key] = key;
         }
      }

      return '';
   }
}

export default new Solution1() as ISolution;
