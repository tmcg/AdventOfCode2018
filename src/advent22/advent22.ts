
import { ISolution, InputFile } from '../shared';

interface IPoint {
   x : number;
   y : number;
}

interface ICaveInput {
   depth: number;
   target : IPoint;
}

interface ICaveStats {
   pos : IPoint;
   geo : number;
   ero : number;
   type: number;
}

class Solution22 implements ISolution {
   _inputFileName : string = './src/advent22/input.txt';
   _demoFileName : string = './src/advent22/demo.txt';

   dayNumber : Number = 22;

   getInputFromFile(fileName : string) : ICaveInput {
      let inputFile = new InputFile(fileName);
      let lines = inputFile.readLines();

      let depth = lines[0].replace('depth: ','');
      let target = lines[1].replace('target: ','').split(',');

      return {
         depth: +depth,
         target: {
            x: +target[0],
            y: +target[1]
         }
      };
   }

   sumRiskLevel(input : ICaveInput) : number {
      let cave : ICaveStats[][] = [];
      let total : number = 0;

      console.log(input.depth);
      console.log(input.target);

      for(let y = 0; y <= input.target.y; y++) {
         cave[y] = [];
         for(let x = 0; x <= input.target.x; x++) {
            let stats = { pos: {x: x, y: y }, geo: 0, ero: 0, type: 0 };

            let isMouth = x === 0 && y === 0;
            let isTarget = x === input.target.x && y === input.target.y;

            if (!isMouth && !isTarget) {
               if (y === 0) {
                  stats.geo = x * 16807;
               } else if (x === 0) {
                  stats.geo = y * 48271;
               } else {
                  stats.geo = cave[y][x-1].ero * cave[y-1][x].ero;
               }
            }
            stats.ero = (stats.geo + input.depth) % 20183;
            stats.type = stats.ero % 3;1
            cave[y][x] = stats;
            total += stats.type;
         }
      }

      return total;
   }

   solveDemo1() : string {
      return this.sumRiskLevel(this.getInputFromFile(this._demoFileName)).toString();
   }

   solvePart1() : string {
      return this.sumRiskLevel(this.getInputFromFile(this._inputFileName)).toString();
   }

   solvePart2() : string {
      let input = this.getInputFromFile(this._inputFileName);

      return this.dayNumber.toString();
   }
}

export default new Solution22();
