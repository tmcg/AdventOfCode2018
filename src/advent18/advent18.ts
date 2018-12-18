
import { ISolution, InputFile, Util } from '../shared';

class Acre {
   curr : string;
   next : string;

   constructor(type : string) {
      this.curr = type;
      this.next = type;
   }

   step(adjacent : Acre[]) {
      let treeCount = adjacent.reduce((a,c) => c.curr === '|' ? a + 1 : a, 0);
      let yardCount = adjacent.reduce((a,c) => c.curr === '#' ? a + 1 : a, 0);
      if (this.curr === '.' && treeCount >= 3) {
         this.next = '|';
      } else if (this.curr === '|' && yardCount >= 3) {
         this.next = '#'
      } else if (this.curr === '#' && (treeCount === 0 || yardCount === 0)) {
         this.next = '.'
      }
   }

   flip() {
      this.curr = this.next;
   }
}

class Area {
   scan : Acre[][] = [];
   width : number;
   height : number;
   treeCount : number = 0;
   yardCount : number = 0;

   constructor(fileName : string) {
      let inputFile = new InputFile(fileName);
      let input = inputFile.readLines();

      for (let line of input) {
         this.scan.push(line.split('').map((c) => new Acre(c)));
      }

      this.width = this.scan[0].length;
      this.height = this.scan.length;
   }

   step() {
      for (let j = 0; j < this.height; j++) {
         for (let i = 0; i < this.width; i++) {
            this.scan[j][i].step(this.adjacent(i,j));
         }
      }

      this.treeCount = 0;
      this.yardCount = 0;
      for (let j = 0; j < this.height; j++) {
         for (let i = 0; i < this.width; i++) {
            this.scan[j][i].flip();
            if (this.scan[j][i].curr === '|') { this.treeCount++; }
            if (this.scan[j][i].curr === '#') { this.yardCount++; }
         }
      }
   }

   adjacent(x : number, y : number) : Acre[] {
      let result : Acre[] = [];
      for (let dy = -1; dy <= 1; dy++) {
         for (let dx = -1; dx <= 1; dx++) {
            if (0 <= x + dx && x + dx < this.width &&
                0 <= y + dy && y + dy < this.height &&
                (dx !== 0 || dy !== 0)) {
                  result.push(this.scan[y + dy][x + dx]);
            }
         }
      }
      return result;
   }
}

class Solution18 implements ISolution {
   _inputFileName : string = './src/advent18/input.txt';

   dayNumber : Number = 18;

   solvePart1() : string {
      let a = new Area(this._inputFileName);

      for (let i of Util.range(10)) {
         a.step();
      }

      return (a.treeCount * a.yardCount).toString();
   }

   solvePart2() : string {
      let a = new Area(this._inputFileName);
      let end = -1;

      for (let i of Util.range(1000)) {
         a.step();
         // console.log(`${i} = ${a.treeCount * a.yardCount}`);

         // Pattern starts repeating every 28 steps from 192556
         if (a.treeCount * a.yardCount === 192556) {
            end = ((1000000000 - i) % 28) + i - 1;
         }
         if (i === end) {
            return (a.treeCount * a.yardCount).toString();
         }
      }

      return '';
   }
}

export default new Solution18();
