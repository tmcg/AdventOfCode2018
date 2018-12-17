
import { ISolution, InputFile, OutputFile } from '../shared';

interface IClayLine {
   x1 : number;
   x2 : number;
   y1 : number;
   y2 : number
}

class Ground {
   lines : IClayLine[];
   scan : string[][] = [];
   minX : number;
   maxX : number;
   minY : number;
   maxY : number;
   startY : number;

   constructor(fileName : string) {
      let inputFile = new InputFile(fileName);
      this.lines = inputFile.readLines()
         .map((s) => {
            let c = s.split(',');
            let c1 = c[0].trim().split('=');
            let c2 = c[1].trim().split('=');

            let xc = c1[0] === 'x' ? c1[1]+'..'+c1[1] : c2[1];
            let yc = c1[0] === 'y' ? c1[1]+'..'+c1[1] : c2[1];
            let xx = xc.split('..');
            let yy = yc.split('..');
            return <IClayLine>{ x1: +xx[0], x2: +xx[1], y1: +yy[0], y2: +yy[1] };
         });

      this.minX = this.lines.map((c) => c.x1).reduce((a,c) => c < a ? c : a, 99999) - 1;
      this.maxX = this.lines.map((c) => c.x2).reduce((a,c) => c > a ? c : a, 0) + 1;
      this.minY = this.lines.map((c) => c.y1).reduce((a,c) => c < a ? c : a, 99999);
      this.maxY = this.lines.map((c) => c.y2).reduce((a,c) => c > a ? c : a, 0);
      this.startY = this.minY;
      this.minY = Math.min(0, this.minY); // water source

      // Initialise scan
      for (let j = 0; j < this.maxY - this.minY + 1; j++) {
         this.scan[j] = [];
         for (let i = 0; i < this.maxX - this.minX + 1; i++) {
            this.scan[j][i] = '.';
         }
      }

      // Initialise clay lines
      for (let line of this.lines) {
         for (let y = line.y1; y < line.y2 + 1; y++) {
            for (let x = line.x1; x < line.x2 + 1; x++) {
               this.setScan(x, y, '#');
            }
         }
      }

      // Initialise source
      this.setScan(500, 0, '+');
      this.flow(500, 0);
   }

   getScan(x : number, y : number) : string {
      return this.scan[y-this.minY][x-this.minX];
   }

   setScan(x : number, y : number, v : string) : void {
      this.scan[y-this.minY][x-this.minX] = v;
   }

   flow(x : number, y : number) {
      if (y < this.maxY) {
         //this.print();

         if (this.getScan(x, y + 1) === '.') {
            this.setScan(x, y + 1, '|');
            this.flow(x, y + 1);
         }

         let c = this.getScan(x, y + 1);
         if ((c === '#' || c === '~')) {
            // hit water or wall, flow right, then left
            if (this.getScan(x + 1, y) === '.') {
               this.setScan(x + 1, y, '|');
               this.flow(x + 1, y);
            }
            if (this.getScan(x - 1, y) === '.') {
               this.setScan(x - 1, y, '|');
               this.flow(x - 1, y);
            }
         }

         // if we're in a container, change | to ~
         this.settleWater(this.findClayLeft(x, y), this.findClayRight(x, y), y);
      }
   }

   findClayLeft(x : number, y : number) : number | null {
      return this.findClay(x, y, -1);
   }

   findClayRight(x : number, y : number) : number | null {
      return this.findClay(x, y, 1);
   }

   findClay(x : number, y : number, step : number) : number | null {
      let cx = x;
      while (cx >= this.minX && cx <= this.maxX) {
         let c = this.getScan(cx, y);
         if (c === '#') { return cx; }
         if (c === '.') { return null; }
         cx += step;
      }
      return null;
   }

   settleWater(x1: number | null, x2 : number | null, y: number) {
      if (x1 !== null && x2 !== null) {
         for(let i = x1 + 1; i < x2; i++) {
            this.setScan(i, y, '~');
         }
      }
   }

   waterCount(tiles : string[]) : number {
      let result = 0;
      for (let j = this.startY; j < this.scan.length; j++) {
         for (let i = 0; i < this.scan[j].length; i++) {
            let c = this.scan[j][i]
            result += tiles.join('').includes(c) ? 1 : 0;
         }
      }
      return result;
   }

   print() : void {
      console.log('====================');
      for (let line of this.scan) {
         console.log(line.join(''));
      }
   }

   printToFile(fileName : string) : void {
      let lines : string[] = [];
      for(let line of this.scan) {
         lines.push(line.join(''));
      }
      new OutputFile(fileName).writeLines(lines);
   }
}

class Solution17 implements ISolution {
   _inputFileName : string = './src/advent17/input.txt';
   _demoFileName : string = './src/advent17/demo.txt';
   //_outputFileName : string = './src/advent17/output.txt';

   dayNumber : Number = 17;

   solveDemo1() : string {
      let g = new Ground(this._demoFileName);
      return g.waterCount(['|','~']).toString();
   }

   solvePart1() : string {
      let g = new Ground(this._inputFileName);
      //g.printToFile(this._outputFileName);
      return g.waterCount(['|','~']).toString();
   }

   solvePart2() : string {
      let g = new Ground(this._inputFileName);
      //g.printToFile(this._outputFileName);
      return g.waterCount(['~']).toString();
   }
}

export default new Solution17();
