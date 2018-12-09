
import { ISolution, InputFile, Util } from '../shared';

class Player {
   id : number;
   score : number;

   constructor(id : number) {
      this.id = id;
      this.score = 0;
   }
}

class MarbleGame {
   _players : Player[];
   _marbles : number[];
   _poolNext : number;
   _poolMax : number;
   _currentPlayer : number = 0;
   _currentMarble : number = 0;

   constructor(playerCount : number, marbleCount : number) {
      this._players = Util.range(playerCount, 1).map((n) => new Player(n));
      this._marbles = [0];
      this._poolNext = 1;
      this._poolMax = marbleCount;
   }

   findWinner() : Player {
      this.start();
      return this._players.reduce((a, c) => a.score > c.score ? a : c, new Player(0));
   }

   findNextMarble(arr : number[], current : number, n : number) {
      let m = (current + n) % arr.length;
      return m < 0 ? arr.length - Math.abs(m) : m;
   }

   start() {
      while (this._poolNext <= this._poolMax) {
         if (this._poolNext > 0 && this._poolNext % 1000 === 0) {
            console.log(this._poolNext);
         }

         // TODO: This is unbearably slow...
         // change _players and _marbles from array to ring buffer
         // http://www.collectionsjs.com/deque

         let player = this._players[this._currentPlayer];

         if (this._poolNext % 23 === 0) {
            let circleIndex = this.findNextMarble(this._marbles, this._currentMarble, -7);
            player.score += this._poolNext;
            player.score += this._marbles[circleIndex];
            this._marbles.splice(circleIndex, 1);
            this._currentMarble = circleIndex;
         } else {
            if (this._marbles.length === 1 || this._currentMarble === this._marbles.length - 2) {
               this._marbles.push(this._poolNext);
               this._currentMarble = this._marbles.length - 1;
            } else {
               let circleIndex = this.findNextMarble(this._marbles, this._currentMarble, 2);
               this._marbles.splice(circleIndex, 0, this._poolNext);
               this._currentMarble = circleIndex;
            }
         }

         this._currentPlayer++;
         if (this._currentPlayer >= this._players.length) {
            this._currentPlayer = 0;
         }
         this._poolNext++;

         //console.log(`[${player.id}][${this._currentMarble}] ${this._marbles.join(',') }`);
         //console.log(game._players.map((p) => `Player ${p.id} = ${p.score()}`));
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
      return this.createGame(players, marbles).findWinner().score.toString();
   }

   solvePart2() : string {
      let [players,marbles] = this.parseInput(this._inputFileName);
      return this.createGame(players, marbles*100).findWinner().score.toString();
   }
}

export default new Solution9();
