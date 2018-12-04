
import { ISolution, InputFile } from '../shared';

class Solution2 implements ISolution {
   _inputFileName : string = './src/advent02/input.txt';

   dayNumber : Number = 2;

   getLineRepeatingCounts(line : string) : [number, number] {
      let lineChars = line.split('');
      let history : any = {};

      for (var lineChar of lineChars) {

         let key = lineChar.toString();
         if (!(key in history))
            history[key] = 0;

         history[key] += 1;
      }

      let historyKeys = Object.keys(history);
      return [
         historyKeys.filter((s) => history[s] === 2).length > 0 ? 1 : 0,
         historyKeys.filter((s) => history[s] === 3).length > 0 ? 1 : 0
      ];
   }

   getClosestLine(line1 : string, line2 : string) : [number, string] {
      let closest = '';

      for (let i = 0; i < line1.length; i++) {
         let ch1 = line1.charAt(i);
         let ch2 = line2.charAt(i);
         if (ch1 === ch2) {
            closest += ch1;
         }
      }

      return [line1.length - closest.length, closest];
   }

   solvePart1() : string {
      let inputFile = new InputFile(this._inputFileName);
      let lines = inputFile.readLines();

      let countOfTwos = 0;
      let countOfThrees = 0;

      for(var line of lines) {
         var [twos,threes] = this.getLineRepeatingCounts(line);
         countOfTwos += twos;
         countOfThrees += threes;
      }

      return (countOfTwos * countOfThrees).toString();
   }

   solvePart2() : string {
      let inputFile = new InputFile(this._inputFileName);
      let lines = inputFile.readLines().sort();
      let lastLine : string = '';

      for(var line of lines) {
         if (lastLine !== '') {
            let [distance, closest] = this.getClosestLine(lastLine, line);
            if (distance === 1) {
               return closest;
            }
         }
         lastLine = line;
      }

      return '';
   }
}

export default new Solution2();
