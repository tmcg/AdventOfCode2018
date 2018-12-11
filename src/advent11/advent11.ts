
import { ISolution } from '../shared';

class FuelCell {
   x : number;
   y : number;
   power : number;
   powerMax : number | null = null;
   sizeMax : number | null = null;

   constructor(x : number, y : number, serial : number) {
      this.x = x;
      this.y = y;
      this.power = (Math.floor(((((x + 10) * y) + serial) * (x + 10)) / 100) % 10) - 5;
   }
}

class FuelGrid {
   _cells : FuelCell[][] = [];
   _maxX : number = 300;
   _maxY : number = 300;

   constructor(serial : number) {
      for (let iy = 0; iy < this._maxY; iy++) {
         this._cells[iy] = [];
         for (let ix = 0; ix < this._maxX; ix++) {
            this._cells[iy][ix] = new FuelCell(ix + 1, iy + 1, serial);
         }
      }
   }

   getPower(x : number, y: number) : number {
      return this._cells[y-1][x-1].power;
   }

   findMaxOf3x3() : string {
      let max : number | null = null;
      let x = 0;
      let y = 0;
      for (let iy = 0; iy < this._maxY - 2; iy++) {
         for (let ix = 0; ix < this._maxX - 2; ix++) {
            let val = this.getPowerValues(ix, iy, 3)[2];
            if (max === null || val > max) {
               max = val;
               x = ix + 1;
               y =  iy + 1;
            }
         }
      }

      return `${x},${y}`;
   }

   findMaxOfAny() : string {
      this.calculatePowerValuesOfAny();
      let cellMax : FuelCell | null = null;

      for (let iy = 0; iy < this._maxY; iy++) {
         for (let ix = 0; ix < this._maxX; ix++) {
            let cell = this._cells[iy][ix];
            if (cellMax === null || cell.powerMax! > cellMax.powerMax! ) {
               cellMax = cell;
            }
         }
      }

      return `${cellMax!.x},${cellMax!.y},${cellMax!.sizeMax}`;
   }

   calculatePowerValuesOfAny() {
      for (let iy = 0; iy < this._maxY; iy++) {
         for (let ix = 0; ix < this._maxX; ix++) {
            let powerValues : number[] = this.getPowerValues(ix, iy);
            let powerMax : number | null = null;
            let sizeMax : number | null = null;
            for (let i = 0; i < powerValues.length; i++) {
               if (powerMax === null || powerValues[i] > powerMax) {
                  powerMax = powerValues[i];
                  sizeMax = i + 1;
               }
            }
            this._cells[iy][ix].powerMax = powerMax;
            this._cells[iy][ix].sizeMax = sizeMax;
         }
      }
   }

   getPowerValues(ax : number, ay : number, size = 0) : number[] {
      if (size > 1) {
         // calculate sum of N x N outer edge and recursively inner squares
         let innerValues = this.getPowerValues(ax, ay, size - 1);
         let outerValue = 0;
         for (let tx = ax; tx <= ax + size - 1; tx++) {
            outerValue += this._cells[ay + size - 1][tx].power;
         }
         for (let ty = ay; ty <= ay + size - 2; ty++) {
            outerValue += this._cells[ty][ax + size - 1].power;
         }
         innerValues.push(outerValue + innerValues[innerValues.length - 1]);
         return innerValues;
      } else if (size === 1) {
         return [this._cells[ay][ax].power];
      }

      // dynamically find the max square size
      return this.getPowerValues(ax, ay, Math.min(this._maxX - ax, this._maxY - ay));
   }
}

class Solution11 implements ISolution {
   dayNumber : Number = 11;

   createGrid(serial : number) {
      return new FuelGrid(serial);
   }

   solvePart1() : string {
      return this.createGrid(3613).findMaxOf3x3();
   }

   solvePart2() : string {
      return this.createGrid(3613).findMaxOfAny();
   }
}

export default new Solution11();
