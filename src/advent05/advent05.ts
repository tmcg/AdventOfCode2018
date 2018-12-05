
import { ISolution, InputFile } from '../shared';

class Solution5 implements ISolution {
   _inputFileName : string = './src/advent05/input.txt';

   dayNumber : Number = 5;

   getReactionResult(input : string) : string {
      let result = '';
      for (let i = 0; i < input.length; i++) {
         let ch = input.charAt(i);
         if (result.length > 0) {
            let rh = result[result.length - 1];
            if (rh !== ch && rh.toLowerCase() === ch.toLowerCase()) {
               // reaction!
               result = result.substring(0, result.length - 1);
            } else {
               result += ch;
            }
         } else {
            result += ch;
         }
      }

      return result;
   }

   getReactionResultFromInput() : string {
      let inputFile = new InputFile(this._inputFileName);
      let input = inputFile.readText();

      return this.getReactionResult(input);
   }

   solvePart1() : string {
      return this.getReactionResultFromInput().length.toString()
   }

   solvePart2() : string {
      let result = this.getReactionResultFromInput()

      return result
         .toLowerCase()
         .split('')
         .filter((v,i,a) => a.indexOf(v) === i)
         .map((ch) => {
            let newInput = result.replace(new RegExp(ch, 'ig'),'');
            return this.getReactionResult(newInput).length;
         })
         .reduce((a, c) => a < c ? a : c, result.length)
         .toString();
   }
}

export default new Solution5();
