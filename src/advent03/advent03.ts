
import { ISolution, InputFile } from '../shared';

class Rectangle {
   x : number;
   y : number;
   w : number;
   h : number;

   constructor(x : number, y : number, w : number, h : number) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
   }
}

class SuitFabric {
   _fabric : number[][] = [];

   constructor(w : number, h : number) {
      for(var i : number = 0; i < h; i++) {
         this._fabric[i] = [];
         for (var j : number = 0; j < w; j++) {
            this._fabric[i][j] = 0;
         }
      }
   }

   applyPatch(patch : ElfPatch) {
      for(var i : number = patch.location.y; i < patch.location.y + patch.location.h; i++) {
         for (var j : number = patch.location.x; j < patch.location.x + patch.location.w; j++) {
            this._fabric[i][j] += 1;
         }
      }
   }

   hasOverlap(patch : ElfPatch) {
      for(var i : number = patch.location.y; i < patch.location.y + patch.location.h; i++) {
         for (var j : number = patch.location.x; j < patch.location.x + patch.location.w; j++) {
            if (this._fabric[i][j] > 1) {
               return true;
            }
         }
      }

      return false;
   }

   getSquareCount(numberOfClaims : number) {
      let squareCount : number = 0;

      for(var i : number = 0; i < this._fabric.length; i++) {
         for (var j : number = 0; j < this._fabric[i].length; j++) {
            if (this._fabric[i][j] >= numberOfClaims) {
               squareCount++;
            }
         }
      }

      return squareCount;
   }
}

class ElfPatch {
   id : number;
   location: Rectangle;

   constructor(line: string) {
      let matches = /#(\d+) @ (\d+),(\d+): (\d+)x(\d+)/.exec(line);
      this.id = +(matches![1]);
      this.location = {
         x: +(matches![2]),
         y: +(matches![3]),
         w: +(matches![4]),
         h: +(matches![5]),
      };
   }
}

class Solution3 implements ISolution {
   _inputFileName : string = './src/advent03/input.txt';

   dayNumber : Number = 3;

   solvePart1() : string {
      let inputFile = new InputFile(this._inputFileName);
      let lines = inputFile.readLines();

      let patches = lines.map((line) => new ElfPatch(line));
      let fabric = new SuitFabric(1200,1200);

      for(let patch of patches) {
         fabric.applyPatch(patch);
      }

      return fabric.getSquareCount(2).toString();
   }

   solvePart2() : string {
      let inputFile = new InputFile(this._inputFileName);
      let lines = inputFile.readLines();

      let patches = lines.map((line) => new ElfPatch(line));
      let fabric = new SuitFabric(1200,1200);

      for(let patch of patches) {
         fabric.applyPatch(patch);
      }

      for(let patch of patches) {
         if (!fabric.hasOverlap(patch)) {
            return patch.id.toString();
         }
      }

      return 'unsolved';
   }
}

export default new Solution3();
