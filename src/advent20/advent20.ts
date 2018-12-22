
import { ISolution, InputFile } from '../shared';
import Deque from 'double-ended-queue';

class ElfRoom {
   constructor(
      public x : number,
      public y : number,
      public distance : number) {}
}

class ElfMap {
   rooms : { [id: string] : ElfRoom } = {};

   constructor(input : string) {
      let current = this.getRoom(0,0);
      current.distance = 0;

      let stack : Deque<ElfRoom> = new Deque();
      stack.push(current);

      for (let ch of input) {
         switch(ch) {
            case "N": current = this.addRoom(current, 0, -1); break;
            case "E": current = this.addRoom(current, 1, 0); break;
            case "W": current = this.addRoom(current, -1, 0); break;
            case "S": current = this.addRoom(current, 0, 1); break;
            case "(": stack.push(current); break;
            case "|": current = stack.peekBack()!; break;
            case ")": current = stack.pop()!; break;
         }
      }
   }

   getRoom(x : number, y : number) : ElfRoom {
      let id = `${x},${y}`;
      let room = this.rooms[id];
      if (!room) {
         room = new ElfRoom(x, y, Number.POSITIVE_INFINITY);
         this.rooms[id] = room;
      }
      return room;
   }

   addRoom(current : ElfRoom, dx : number, dy : number) {
      let next = this.getRoom(current.x + dx, current.y + dy);
      next.distance = Math.min(current.distance + 1, next.distance);
      return next;
   }

   getAllRooms() {
      return Object.keys(this.rooms).map((k) => this.rooms[k]);
   }

   findMaxPath() : number {
      return this.getAllRooms().reduce((a,c) => a > c.distance ? a : c.distance, 0);
   }

   countMinPaths(min : number) : number {
      return this.getAllRooms().filter((r) => r.distance >= min).length;
   }
}

class Solution20 implements ISolution {
   _inputFileName : string = './src/advent20/input.txt';

   dayNumber : Number = 20;

   findMaxPath(input : string) : number {
      return new ElfMap(input).findMaxPath();
   }

   countMinPaths(input : string, min : number) : number {
      return new ElfMap(input).countMinPaths(min);
   }

   solvePart1() : string {
      let input = new InputFile(this._inputFileName).readText();
      return this.findMaxPath(input).toString();
   }

   solvePart2() : string {
      let input = new InputFile(this._inputFileName).readText();
      return this.countMinPaths(input, 1000).toString();
   }
}

export default new Solution20();
