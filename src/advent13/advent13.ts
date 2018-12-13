
import { ISolution, InputFile, Util } from '../shared';

enum Direction {
   North = '^',
   South = 'v',
   East = '>',
   West = '<',
}

enum Turn {
   Left = 0,
   Straight = 1,
   Right = 2
}

type CartAction = (cart : Cart) => void;

class Cart {
   x : number;
   y : number;
   d : Direction;
   t : Turn;
   crashed : boolean;

   constructor(x : number, y : number, d : Direction) {
      this.x = x;
      this.y = y;
      this.d = d;
      this.t = Turn.Left
      this.crashed = false;
   }

   performAction(north : CartAction, south : CartAction, east : CartAction, west : CartAction) {
      switch (this.d) {
         case Direction.North: north(this); break;
         case Direction.South: south(this); break;
         case Direction.East: east(this); break;
         case Direction.West: west(this); break;
         default: throw `Unknown direction! ${this.d}`;
      }
   }

   isNorthSouth() : boolean { return this.d === Direction.North || this.d === Direction.South };

   turn(track : string) {
      if (track === '|' || track === '-') { return; }

      let northSouth : boolean = this.isNorthSouth();
      if (track === '/' && northSouth) { this.turnRight(); return; }
      if (track === '/' && !northSouth) { this.turnLeft(); return; }
      if (track === '\\' && northSouth) { this.turnLeft(); return; }
      if (track === '\\' && !northSouth) { this.turnRight(); return; }
      if (track === '+') {
         if (this.t === Turn.Left) { this.turnLeft(); }
         if (this.t === Turn.Right) { this.turnRight(); }
         this.t = (this.t + 1) % 3;
      }
   }

   turnLeft() {
      this.performAction(
         (c) => c.d = Direction.West,
         (c) => c.d = Direction.East,
         (c) => c.d = Direction.North,
         (c) => c.d = Direction.South,
      );
   }

   turnRight() {
      this.performAction(
         (c) => c.d = Direction.East,
         (c) => c.d = Direction.West,
         (c) => c.d = Direction.South,
         (c) => c.d = Direction.North,
      );
   }

   moveForward() {
      this.performAction(
         (c) => c.y -= 1,
         (c) => c.y += 1,
         (c) => c.x += 1,
         (c) => c.x -= 1,
      );
   }
}

class Track {
   layout : string[][] = []
   carts : Cart[] = [];

   constructor(input : string[]) {
      for (let y of Util.range(input.length)) {
         let sy = input[y].split('');
         this.layout.push(sy);
         for(let x of Util.range(sy.length)) {
            let s = this.layout[y][x];
            if (s === Direction.North || s === Direction.South || s === Direction.West || s === Direction.East) {
               let cartPos = this.carts.push(new Cart(x, y, s));
               this.layout[y][x] = this.carts[cartPos-1].isNorthSouth() ? '|' : '-';
            }
         }
      }
   }

   crashCarts(x : number, y : number) : boolean {
      let carts = this.carts.filter((c) => c.x === x && c.y === y);
      if (carts.length > 1) {
         carts.forEach((c) => c.crashed = true);
         return true;
      }
      return false;
   }

   sortCarts() : Cart[] {
      return this.carts
         .filter((c) => !c.crashed)
         .sort((a,b) => {
            if (a.y < b.y || (a.y === b.y && a.x < b.x)) return -1;
            if (a.y > b.y || (a.y === b.y && a.x > b.x)) return 1;
            return 0;
         });
   }

   findCartPosition(firstCrash : boolean) : string {
      while (true) {
         this.carts = this.sortCarts();

         if (this.carts.length < 2) {
            return `${this.carts[0].x},${this.carts[0].y}`;
         }

         for (let cart of this.carts) {
            cart.moveForward();
            let crashed = this.crashCarts(cart.x, cart.y);
            if (crashed && firstCrash) {
               return `${cart.x},${cart.y}`;
            }
            cart.turn(this.layout[cart.y][cart.x]);
         }
      }
   }

   printLayout() {
      console.log();
      for (let y of Util.range(this.layout.length)) {
         console.log(this.layout[y].join(''));
      }
   }
}

class Solution13 implements ISolution {
   _inputFileName : string = './src/advent13/input.txt';
   _demoFileName1 : string = './src/advent13/demo1.txt';
   _demoFileName2 : string = './src/advent13/demo2.txt';

   dayNumber : Number = 13;

   solveDemo1() : string {
      let inputFile = new InputFile(this._demoFileName1);
      return new Track(inputFile.readLines()).findCartPosition(true);
   }

   solveDemo2() : string {
      let inputFile = new InputFile(this._demoFileName2);
      return new Track(inputFile.readLines()).findCartPosition(false);
   }

   solvePart1() : string {
      let inputFile = new InputFile(this._inputFileName);
      return new Track(inputFile.readLines()).findCartPosition(true);
   }

   solvePart2() : string {
      let inputFile = new InputFile(this._inputFileName);
      return new Track(inputFile.readLines()).findCartPosition(false);
   }
}

export default new Solution13();
