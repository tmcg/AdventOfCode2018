
import { ISolution } from '../shared';

class FuelGrid {
   _cells : number[][] = [];
   _maxX : number = 300;
   _maxY : number = 300;

   constructor(serial : number) {
      for (let iy = 0; iy < this._maxY; iy++) {
         this._cells[iy] = [];
         for (let ix = 0; ix < this._maxX; ix++) {
            let x = ix + 1;
            let y = iy + 1;
            let rackId = x + 10;
            let power = ((rackId * y) + serial) * rackId;
            this._cells[iy][ix] = (Math.floor(power / 100) % 10) - 5;
         }
      }
   }

   getCell(x : number, y: number) : number {
      return this._cells[y-1][x-1];
   }

   findMax3x3() : string {
      let max = -1000000;
      let x = 0;
      let y = 0;
      for (let iy = 0; iy < this._maxY - 2; iy++) {
         for (let ix = 0; ix < this._maxX - 2; ix++) {
            let val = this.getValue3x3(ix, iy);
            if (val > max) {
               max = val;
               x = ix + 1;
               y =  iy + 1;
            }
         }
      }

      return `${x},${y}`;
   }

   getValue3x3(ax : number, ay: number) {
      let val = 0;
      for (let iy = 0; iy < 3; iy++) {
         for (let ix = 0; ix < 3; ix++) {
            val += this._cells[ay+iy][ax+ix];
         }
      }
      return val;
   }
}

class Solution11 implements ISolution {
   dayNumber : Number = 11;

   createGrid(serial : number) {
      return new FuelGrid(serial);
   }

   solvePart1() : string {
      return this.createGrid(3613).findMax3x3();
   }

   solvePart2() : string {
      return 'unsolved';
   }
}

export default new Solution11();
