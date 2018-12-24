
import { ISolution, InputFile } from '../shared';

type Attack = 'cold' | 'bludgeoning' | 'slashing' | 'radiation' | 'fire';
type Team = 'reindeer' | 'virus';
type Winner = { teamName: Team | null, units: number };

class Group {
   constructor(
      public teamIndex: number,
      public teamName: Team,
      public count: number,
      public health: number,
      public attack: Attack,
      public damage: number,
      public init: number,
      public weakness: Attack[],
      public immunity: Attack[],
      public target: Group | null = null,
      public id: string = ''
   ) {
      this.id = `${this.teamName.substring(0,1).toUpperCase()}${this.teamIndex}`;
   }

   get power(): number {
      return this.count * this.damage;
   }

   getDamageTo(defender: Group) {
      let multiplier = 1;
      if (defender.weakness.indexOf(this.attack) >= 0) {
         multiplier = 2;
      }
      if (defender.immunity.indexOf(this.attack) >= 0) {
         multiplier = 0;
      }
      return this.power * multiplier;
   }

   fight(defender: Group) {
      let dmg = this.getDamageTo(defender);
      let dead = Math.floor(dmg / defender.health);
      defender.count = dead >= defender.count ? 0 : defender.count - dead;
      Battle.log(`${this.id} attacks ${defender.id}, killing ${dead} units`);
   }
}

class Battle {
   public groups: Group[];
   public stalemate: boolean = false;

   constructor(groups: Group[]) {
      // Store in initiative order to save resorting later
      this.groups = groups.sort((a,b) => b.init - a.init);
   }

   static log(msg: string) {
      // console.log(msg)
   }

   getGroups(teamName: Team | null): Group[] {
      let result = this.groups;
      if (teamName != null) {
         result = result.filter((g) => g.teamName === teamName);
      }
      return result;
   }

   teamCount(teamName: Team): number {
      return this.getGroups(teamName).reduce((a,c) => a + c.count, 0);
   }

   groupsByTargetOrder(): Group[] {
      return this.groups
         .filter((g) => g.power > 0)
         .sort((a,b) => {
            if (a.power === b.power) {
               return b.init - a.init;
            }
            return b.power - a.power;
         });
   }

   groupsByDamageOrder(attacker: Group): Group[] {
      return this.groups
         .filter((g) => g.power > 0 && g.teamName !== attacker.teamName)
         .sort((a,b) => {
            let da = attacker.getDamageTo(a);
            let db = attacker.getDamageTo(b);
            if(da === db) {
               if (a.power === b.power) {
                  return b.init - a.init;
               }
               return b.power - a.power;
            }
            return db - da;
         });
   }

   done(): boolean {
      return this.teamCount('reindeer') <= 0 || this.teamCount('virus') <= 0 || this.stalemate;
   }

   winner(): Winner | null {
      let rCount = this.teamCount('reindeer');
      let vCount = this.teamCount('virus');
      if (rCount > 0 && vCount <= 0) {
         return { teamName: 'reindeer', units: rCount };
      }
      if (vCount > 0 && rCount <= 0) {
         return { teamName: 'virus', units: vCount };
      }

      return null
   }

   targetPhase() {
      let gto = this.groupsByTargetOrder();
      gto.forEach((gr) => { gr.target = null; });

      gto.forEach((gr) => {
         let tgt = gto.filter((w1) => w1.target !== null).map((w2) => w2.target);
         let dmg = this.groupsByDamageOrder(gr).filter((w1) => tgt.indexOf(w1) < 0);
         if (dmg.length > 0) {
            gr.target = dmg[0];
         }
      });
   }

   attackPhase() {
      let gio = this.groups;

      gio.forEach((gr) => {
         if (gr.power > 0 && gr.target !== null) {
            gr.fight(gr.target);
         }
      });
   }

   logGroupUnits(teamName: Team) {
      Battle.log(`Team: ${teamName.toUpperCase()}`);
      this.getGroups(teamName)
         .sort((a,b) => a.teamIndex - b.teamIndex)
         .forEach((t) => Battle.log(`${t.id} has ${t.count} units`));
   }

   fight(): Winner | null {
      let round = 1;
      let lastUnits = 0;
      while(!this.done()) {
         Battle.log(`ROUND ${round}... FIGHT!`);
         Battle.log(`==================`)
         this.logGroupUnits('reindeer');
         this.logGroupUnits('virus');

         this.targetPhase();
         this.attackPhase();

         // boosting sometimes causes stalemate conditions
         let totalUnits = this.groups.reduce((a,c) => a + c.count, 0);
         if (totalUnits === lastUnits) {
            this.stalemate = true;
         }
         lastUnits = totalUnits;
         round++;
      }

      return this.winner();
   }
}


class Solution24 implements ISolution {
   _inputFileName : string = './src/advent24/input.txt';
   _demoFileName : string = './src/advent24/demo.txt';

   dayNumber : Number = 24;

   createBattle(fileName: string, boost: number = 0): Battle {
      let inputFile = new InputFile(fileName);
      let lines = inputFile.readLines();
      let groups = [];

      let rGroupId = 0;
      let vGroupId = 0;
      let teamName: Team | null = null;
      let re = /(\d+) units each with (\d+) hit points (.*)with an attack that does (\d+) ([a-z]+) damage at initiative (\d+)/;
      for(let line of lines) {
         line = line.trim();
         if (line.startsWith('Immune System')) { teamName = 'reindeer'; continue; }
         if (line.startsWith('Infection')) { teamName = 'virus'; continue; }

         if (line.length > 0 && teamName !== null) {
            let groupId = 0;
            if (teamName === 'reindeer') { groupId = ++rGroupId; }
            if (teamName === 'virus') { groupId = ++vGroupId; }

            let matches = re.exec(line)!;
            if (matches === null) {console.log(`line=${line}`);}
            let count = +matches[1];
            let health = +matches[2];
            let damage = +matches[4];
            damage = damage + (teamName === 'reindeer' ? boost : 0);
            let attack = <Attack>matches[5];
            let init = +matches[6];

            function modsByType(s: string, t: string) {
               return s.replace('(','').replace(')','').split(';')
                  .map((m) => m.trim())
                  .filter((m) => m.startsWith(t))
                  .map((m) => m.replace(`${t} to `,''));
            }

            let weakMods = modsByType(matches[3], 'weak');
            let immuneMods = modsByType(matches[3], 'immune');

            groups.push(new Group(
               groupId, teamName, count, health, attack, damage, init,
               weakMods.length > 0 ? weakMods[0].split(',').map((m) => <Attack>m.trim()) : [],
               immuneMods.length > 0 ? immuneMods[0].split(',').map((m) => <Attack>m.trim()) : []
            ))
         }
      }

      return new Battle(groups);
   }

   findUnitsLeft(fileName: string): string {
      let battle = this.createBattle(fileName);
      let winner = battle.fight();
      return winner !== null ? winner.units.toString() : 'zz';
   }

   findMinBoost(fileName: string): string {
      let boost = 0;

      while (true) {
         let battle = this.createBattle(fileName, boost);
         let winner = battle.fight();

         if (winner !== null) {
            //console.log(`[${boost}] winner = ${winner.teamName} by ${winner.units} units`);
            if (winner.teamName === 'reindeer') {
               return winner.units.toString();
            }
         } else {
            //console.log('No winner!');
         }
         boost++;
      }
   }

   solveDemo1(): string {
      return this.findUnitsLeft(this._demoFileName);
   }

   solveDemo2(): string {
      return this.findMinBoost(this._demoFileName);
   }

   solvePart1() : string {
      return this.findUnitsLeft(this._inputFileName);
   }

   solvePart2() : string {
      // bug somewhere...
      // should be boost = 94, units left 515
      // getting boost = 92, units left 458
      return this.findMinBoost(this._inputFileName);
   }
}

export default new Solution24();
