
import { ISolution, InputFile } from '../shared';

class Solution14 implements ISolution {
   _inputFileName : string = './src/advent14/input.txt';

   dayNumber : Number = 14;

   solveRecipe1(input : string, count : number) : string {
      let scores = [3,7];
      let elves : number[] = [0,1];

      while (scores.length < (+input + count)) {
         let total = scores[elves[0]] + scores[elves[1]];
         (total < 10 ? [''+total] : (''+total).split('')).forEach((s) => scores.push(+s));
         elves = elves.map((e) => (e + scores[e] + 1) % scores.length);
      }

      return scores.slice(+input, +input + count).join('');
   }

   solveRecipe2(input : string) : string {
      let scores = [3,7];
      let elves : number[] = [0,1];
      let testLen = 0;
      let testPos = -1;

      while(testPos < 0) {
         let total = scores[elves[0]] + scores[elves[1]];
         (total < 10 ? [''+total] : (''+total).split('')).forEach((s) => scores.push(+s));
         elves = elves.map((e) => (e + scores[e] + 1) % scores.length);

         testLen = Math.min(scores.length, (''+input).length + 2);
         testPos = scores.slice(scores.length - testLen, scores.length).join('').indexOf(input);
      }

      return (scores.length - testLen + testPos).toString();
   }

   solvePart1() : string {
      let input = new InputFile(this._inputFileName).readText();
      return this.solveRecipe1(input,10);
   }

   solvePart2() : string {
      let input = new InputFile(this._inputFileName).readText();
      return this.solveRecipe2(input);
   }
}

export default new Solution14();
