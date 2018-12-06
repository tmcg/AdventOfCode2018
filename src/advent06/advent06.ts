
import { ISolution, InputFile } from '../shared';

class Board {
   locations : Location[][] = [];
   coords : Coordinate[];

   constructor(coords : Coordinate[]) {
      this.coords = coords;

      // Find min/max x & min/max y from coordinates, with a small buffer
      let buffer : number = 50;
      let minX = Math.min(...coords.map((c) => c.x)) - buffer;
      let maxX = Math.max(...coords.map((c) => c.x)) + buffer;
      let minY = Math.min(...coords.map((c) => c.y)) - buffer;
      let maxY = Math.max(...coords.map((c) => c.y)) + buffer;

      for(let y = 0; y < maxY - minY; y++) {
         this.locations[y] = [];
         for (let x = 0; x < maxX - minX; x++) {
            this.locations[y][x] = <Location> { x: x, y: y, distance: null, coordIds: [] }
         }
      }
   }

   static manhattanDistance(a : Point, b : Point) : number {
      // Manhattan distance between two points
      return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
   }

   *allLocations() : Iterable<Location> {
      for (let y = 0; y < this.locations.length; y++) {
         for (let x = 0; x < this.locations[y].length; x++) {
            yield this.locations[y][x];
         }
      }
   }

   calculateNearestDistances() {
      // For each board location, calculate and store points with shortest distance
      // If there's a single coordinate then location is within the coordinate's area

      for (let loc of this.allLocations()) {
         loc.distance = null;
         loc.coordIds = [];

         for (let cx = 0; cx < this.coords.length; cx++) {
            let dist = Board.manhattanDistance(loc, this.coords[cx]);
            if (loc.distance === null || dist < loc.distance) {
               loc.distance = dist;
               loc.coordIds = [this.coords[cx].id];
            } else if (dist === loc.distance && loc.coordIds.indexOf(this.coords[cx].id) < 0) {
               loc.coordIds.push(this.coords[cx].id);
            }
         }
      }
   }

   getMaxFiniteAreaSize() {
      this.calculateNearestDistances();

      // For each coord touching board edge, the total area is infinite so ignore
      // For each coord not touching board edge, the total area is finite so calculate
      let findInfinite = (locs : Array<Location>) => {
         return locs.filter((a) => a.coordIds.length == 1).map((a) => a.coordIds[0]);
      }

      let coordIdSet = new Set(this.coords.map((c) => c.id));

      let infiniteAreaSet = new Set(
         findInfinite(this.locations[0])
         .concat(findInfinite(this.locations[this.locations.length - 1]))
         .concat(findInfinite(this.locations.map((a) => a[0])))
         .concat(findInfinite(this.locations.map((a) => a[a.length - 1])))
      );

      let finiteAreaSet = new Set([...coordIdSet].filter((c) => !infiniteAreaSet.has(c)));

      let areaSizes = this.coords.map((c) => { return { id: c.id, areaSize: 0 }; });
      for (let loc of this.allLocations()) {
         if (loc.coordIds.length === 1 && finiteAreaSet.has(loc.coordIds[0])) {
            areaSizes.find((a) => a.id === loc.coordIds[0])!.areaSize += 1;
         }
      }

      return Math.max(...areaSizes.map((c) => c.areaSize));
   }

   calculateTotalDistances() {
      // For each board location, calculate and sum the distances to all coordinates
      for (let loc of this.allLocations()) {
         loc.distance = this.coords.reduce((acc, curr) => acc + Board.manhattanDistance(loc, curr), 0);
         loc.coordIds = [];
      }
   }

   getMaxDistanceAreaSize(maxDistance : number) : number {
      this.calculateTotalDistances();

      // Find count of all locations with total distance < maxDistance
      return Array.from(this.allLocations())
         .filter((loc) => loc.distance! < maxDistance)
         .reduce((acc) => acc + 1, 0);
   }
}

interface Coordinate extends Point {
   id : number;
}

interface Location extends Point {
   distance : number | null;
   coordIds : number[];
}

interface Point {
   x : number;
   y : number;
}

class Solution6 implements ISolution {
   _inputFileName : string = './src/advent06/input.txt';

   dayNumber : Number = 6;

   parseCoordinates(lines : string[]) : Coordinate[] {
      return Array.from(lines.entries()).map((e) => {
         let [x,y] = e[1].split(',');
         return <Coordinate> { id: e[0]+1, areaSize: 0, x: +x, y: +y };
      });
   }

   manhattanDistance(a : Point, b : Point) : number {
      return Board.manhattanDistance(a, b);
   }

   solvePart1() : string {
      let inputFile = new InputFile(this._inputFileName);
      let board = new Board(this.parseCoordinates(inputFile.readLines()));

      return board.getMaxFiniteAreaSize().toString();
   }

   solvePart2() : string {
      let inputFile = new InputFile(this._inputFileName);
      let board = new Board(this.parseCoordinates(inputFile.readLines()));

      return board.getMaxDistanceAreaSize(10000).toString();
   }
}

export default new Solution6();
