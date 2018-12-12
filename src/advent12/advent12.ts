
import { ISolution, InputFile } from '../shared';

class CaveRule {
   input : string;
   output : string;

   constructor(input : string, output : string) {
      this.input = input;
      this.output = output;
   }
}

class CaveGarden {
   state : string;
   offset : number;
   rules : CaveRule[];

   constructor(state : string, rules : CaveRule[]) {
      this.state = state;
      this.rules = rules;
      this.offset = 0;
   }

   step() {
      let test = '....' + this.state + '....';
      let result = '';

      for (let i = 2; i < test.length - 2; i++) {
         let add = '.';
         let input = test.substring(i-2,i+3);
         for (let rule of this.rules) {
            if (input === rule.input) {
               add = rule.output;
               break;
            }
         }
         result += add;
      }
      this.offset += result.indexOf('#') - 2;
      this.state = result.replace(/^\.*/,'').replace(/\.*$/,'');
   }

   sumOfPots() : number {
      return this.state.split('')
         .map((v,i) => v === '#' ? i + this.offset : 0)
         .reduce((a,c) => a + c, 0);
   }
}

class Solution12 implements ISolution {
   _inputFileName : string = './src/advent12/input.txt';
   _demoFileName : string = './src/advent12/demo.txt';

   dayNumber : Number = 12;

   parseCaveGarden(fileName : string) : CaveGarden {
      let inputFile = new InputFile(fileName);
      let input = inputFile.readLines();

      let caveState : string = input[0]
            .substring("initial state: ".length)
            .trim();

      let caveRules : CaveRule[] = input
            .filter((i) => i.indexOf('=>') > 0)
            .map((i) => [i.substring(0,5), i.substring(9,10)])
            .filter((i) => i[1] === '#')
            .map((i) => new CaveRule(i[0], i[1]));

      return new CaveGarden(caveState, caveRules);
   }

   solveDemo1() : string {
      let garden = this.parseCaveGarden(this._demoFileName);

      for (let g = 0; g < 20; g++) {
         garden.step();
      }

      return garden.sumOfPots().toString();
   }

   solvePart1() : string {
      let garden = this.parseCaveGarden(this._inputFileName);

      for (let g = 0; g < 20; g++) {
         garden.step();
      }

      return garden.sumOfPots().toString();
   }

   solvePart2() : string {
      let garden = this.parseCaveGarden(this._inputFileName);
      let maxGen = 150;
      let pattern = [];

      for (let g = 0; g < maxGen; g++) {
         garden.step();
         if (g >= maxGen - 10) {
            pattern.push(garden.sumOfPots());
         }
      }

      let patternMap = pattern.map((v,i,a) => a[i+1] - a[i]);
      //console.log(patternMap);  // A pattern emerges... [38, 38, 38, 38, 38, 38, 38, 38, 38, NaN]
      return (garden.sumOfPots() + ((50000000000 - maxGen) * patternMap[0])).toString();
   }
}

export default new Solution12();
