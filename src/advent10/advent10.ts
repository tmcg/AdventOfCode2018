
import { ISolution, InputFile } from '../shared';

class Point {
   _x : number;
   _y : number;
   _dx : number;
   _dy : number;

   constructor (x : number, y : number, dx : number, dy : number) {
      this._x = x;
      this._y = y;
      this._dx = dx;
      this._dy = dy;
   }

   step() {
      this._x += this._dx;
      this._y += this._dy;
   }
}

class Solution10 implements ISolution {
   _inputFileName : string = './src/advent10/input.txt';
   _demoFileName : string = './src/advent10/demo.txt';
   _enablePrint : boolean = false; // Set to true show the hidden text;

   dayNumber : Number = 10;

   parseInput(fileName : string) : Point[] {
      let inputFile = new InputFile(fileName);
      return inputFile.readLines().map((line) => {
         let data = line.replace('position=<','').replace('> velocity=<',',').replace('>','').split(',');
         return new Point(+data[0], +data[1], +data[2], +data[3]);
      });
   }

   calculateHeight(points : Point[]) : [number, number] {
      let min : number = 1000000;
      let max : number = -1000000;
      points.forEach((c) => {
         if (c._y < min) { min = c._y; }
         if (c._y > max) { max = c._y; }
      });

      return [min, max];
   }

   print(points : Point[], h1 : number, h2 : number, time: number) {
      if (!this._enablePrint) { return; }

      console.log('');
      console.log('------------------------------');
      console.log(`Time = ${time}`);
      console.log('');

      let minX = points.reduce((a,c) => a < c._x ? a : c._x, 1000000);

      for(let y = h1; y <= h2; y++) {
         let arr = new Array<string>(100);
         arr.fill(' ');

         for (let pt of points.filter((p) => p._y === y)) {
            arr[pt._x - minX] = '#';
         }
         console.log(arr.join(''));
      }
   }

   findMessage(fileName : string, maxHeight : number) : number {
      let points = this.parseInput(fileName);
      let currTime : number = 0;
      let maxTime : number = 50000;
      let timeToPrint : number = 0;

      while (currTime < maxTime) {
         let [h1,h2] = this.calculateHeight(points);
         if (h2 - h1 <= maxHeight) {
            timeToPrint = currTime;
            this.print(points, h1, h2, currTime);
         }
         points.forEach((p) => { p.step(); });
         currTime++;
      }
      return timeToPrint;
   }

   solveDemo1() : string {
      this.findMessage(this._demoFileName, 7);
      return 'HI';
   }

   solvePart1() : string {
      this.findMessage(this._inputFileName, 9);
      return 'BLGNHPJC';
   }

   solvePart2() : string {
      return this.findMessage(this._inputFileName, 9).toString();
   }
}

export default new Solution10();
