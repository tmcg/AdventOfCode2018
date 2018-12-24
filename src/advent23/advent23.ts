
import { ISolution, InputFile, OutputFile } from '../shared';
import { execSync } from 'child_process';

class Point {
   constructor(
      public x: number,
      public y: number,
      public z: number,
   ) {}
}

class Nanobot {
   constructor(
      public location: Point,
      public range: number
   ) {}
}

class Solution23 implements ISolution {
   _inputFileName : string = './src/advent23/input.txt';
   _solveFileName: string = './src/advent23/solve.z3';
   _solver: string = 'c:\\tools\\z3\\bin\\z3.exe';

   dayNumber : Number = 23;

   getNanobots(fileName: string) {
      let inputFile = new InputFile(this._inputFileName);

      return inputFile.readLines().map((s) => {
         let matches = /pos=<(-?\d+),(-?\d+),(-?\d+)>, r=(\d+)/.exec(s)!;
         let location = new Point(+matches[1], +matches[2], +matches[3]);
         let range = +matches[4];
         return new Nanobot(location, range);
      })
   }

   distance(p1: Point, p2: Point) : number {
      return Math.abs(p2.x - p1.x) + Math.abs(p2.y - p1.y) + Math.abs(p2.z - p1.z);
   }

   solvePart1() : string {
      let bots = this.getNanobots(this._inputFileName);

      let mr = bots.reduce((a,c) => a > c.range ? a : c.range, 0);
      let mrBot = bots.filter((b) => b.range === mr)[0];

      return bots
         .filter((b) => this.distance(mrBot.location, b.location) <= mrBot.range)
         .length.toString();
   }

   solvePart2() : string {
      // Pre-requisites: https://github.com/Z3Prover/z3
      // Construct a theorem in SMT format and fire it at the Z3 executable
      // Solution is on the last line of output, takes ~1 minute to finish

      let z3header = `
      (declare-const x Int)
      (declare-const y Int)
      (declare-const z Int)

      (define-fun abs ((v Int)) Int
       (ite (> v 0) v (- v)))

      (define-fun dist ((x1 Int) (y1 Int) (z1 Int) (x2 Int) (y2 Int) (z2 Int)) Int
       (+ (abs (- x2 x1)) (abs (- y2 y1)) (abs (- z2 z1))))

      (define-fun inrange ((x Int) (y Int) (z Int)) Int
       (+\n`;

      let z3footer = `
      ))

      (maximize (inrange x y z))
      (minimize (dist 0 0 0 x y z))
      (check-sat)
      (get-objectives)
      (get-model)
      (eval (dist 0 0 0 x y z))
      `;

      let z3body = this.getNanobots(this._inputFileName).map((b) =>
         `(if (<= (dist x y z ${b.location.x} ${b.location.y} ${b.location.z}) ${b.range}) 1 0)`
      ).join('\n');

      let outputFile = new OutputFile(this._solveFileName);
      outputFile.writeText(z3header + z3body + z3footer);

      let result = execSync(`${this._solver} ${this._solveFileName}`).toString().trim();
      return result.split('\n').reverse().filter((s) => s !== '')[0];
   }
}

export default new Solution23();
