
import { ISolution, InputFile, Util } from '../shared';
import Deque from 'double-ended-queue';

class MarbleGame {
   _players : Deque<number>;
   _marbles : Deque<number>;
   _poolNext : number;
   _poolMax : number;

   constructor(playerCount : number, marbleCount : number) {
      this._players = new Deque(Util.range(playerCount).map((p) => 0));
      this._marbles = new Deque([0]);
      this._poolNext = 1;
      this._poolMax = marbleCount;
      this.start();
   }

   findWinningScore() : number {
      return this._players.toArray().reduce((a, c) => a > c ? a : c, 0);
   }

   rotateCircle(n : number, clockwise : boolean) {
      if (clockwise) {
         for (let i = 0; i < n; i++) { this._marbles.push(this._marbles.shift()!); }
      } else {
         for (let i = 0; i < n; i++) { this._marbles.unshift(this._marbles.pop()!); }
      }
   }

   start() {
      while (this._poolNext <= this._poolMax) {
         let score = this._players.shift()!;

         if (this._poolNext % 23 === 0) {
            this.rotateCircle(7, false);
            score += this._poolNext;
            score += this._marbles.shift()!;
         } else {
            this.rotateCircle(2, true);
            this._marbles.unshift(this._poolNext);
         }

         this._players.push(score);
         this._poolNext++;

         //console.log(`${this._marbles.toArray().join(',') }`);
      }
   }
}

class Solution9 implements ISolution {
   _inputFileName : string = './src/advent09/input.txt';

   dayNumber : Number = 9;

   parseInput(fileName : string) {
      let inputFile = new InputFile(fileName);
      let input = inputFile.readText().split(' ');
      return [+input[0], +input[6]];
   }

   createGame(playerCount : number, marbleCount : number) : MarbleGame {
      return new MarbleGame(playerCount, marbleCount);
   }

   solvePart1() : string {
      let [players,marbles] = this.parseInput(this._inputFileName);
      return this.createGame(players, marbles).findWinningScore().toString();
   }

   solvePart2() : string {
      let [players,marbles] = this.parseInput(this._inputFileName);
      return this.createGame(players, marbles*100).findWinningScore().toString();
   }
}

export default new Solution9();
