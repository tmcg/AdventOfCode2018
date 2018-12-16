
import { ISolution, InputFile } from '../shared';

type OpCode =
   'addr' | 'addi' | 'mulr' | 'muli' | 'banr' | 'bani' | 'borr' | 'bori' |
   'setr' | 'seti' | 'gtir' | 'gtri' | 'gtrr' | 'eqir' | 'eqri' | 'eqrr';

class Registers {
   static Max : number = 4;
   private values : number[] = [0,0,0,0]

   constructor(r0 : number, r1 : number, r2 : number, r3 : number) {
      this.values = [r0, r1, r2, r3];
   }

   static fromInput(v : string) : Registers {
      let rv = v.split(',').map((s) => +s);
      return new Registers(rv[0], rv[1], rv[2], rv[3]);
   }

   get(r : number) : number {
      return this.values[r];
   }

   set(r : number, v : number) : void {
      this.values[r] = v;
   }

   equals(b : Registers) {
      return this.values.join(',') === b.values.join(',');
   }
}

class Instruction {
   static OpCodeMap : OpCode[] = [
      'eqir','addi','gtir','setr','mulr','seti','muli','eqri',
      'bori','bani','gtrr','eqrr','addr','gtri','borr','banr'

      //'addr','addi','mulr','muli','banr','bani','borr','bori',
      //'setr','seti','gtir','gtri','gtrr','eqir','eqri','eqrr'
   ]

   public op : OpCode;
   public a : number;
   public b : number;
   public c : number;

   constructor(op : OpCode, a : number, b : number,c : number) {
      this.op = op;
      this.a = a;
      this.b = b;
      this.c = c;
   }

   static fromInput(v : string) : Instruction {
      let values = v.split(' ').map((s) => +s);
      let op = Instruction.OpCodeMap[values[0]];

      return new Instruction(op, values[1], values[2], values[3]);
   }

   toImmediateA(reg : Registers) : number {
      return this.isImmediateA() ? this.a : reg.get(this.a);
   }

   toImmediateB(reg : Registers) : number {
      return this.isImmediateB() ? this.b : reg.get(this.b);
   }

   isImmediateA() : boolean {
      return this.op === 'gtir' || this.op === 'eqir' || this.op === 'seti';
   }

   isImmediateB() : boolean {
      return this.op === 'addi' || this.op === 'muli' || this.op === 'bani' ||
         this.op === 'bori' || this.op === 'gtri' || this.op === 'eqri';
   }

   canExecute() : boolean {
      return (this.a < Registers.Max || this.isImmediateA()) &&
         (this.b < Registers.Max || this.isImmediateB());
   }

   execute(reg : Registers) : void{
      switch (this.op) {
         case 'addr': case 'addi':
         reg.set(this.c, this.toImmediateA(reg) + this.toImmediateB(reg));
         break;
         case 'mulr': case 'muli':
         reg.set(this.c, this.toImmediateA(reg) * this.toImmediateB(reg));
         break;
         case 'banr': case 'bani':
         reg.set(this.c, this.toImmediateA(reg) & this.toImmediateB(reg));
         break;
         case 'borr': case 'bori':
         reg.set(this.c, this.toImmediateA(reg) | this.toImmediateB(reg));
         break;
         case 'setr': case 'seti':
         reg.set(this.c, this.toImmediateA(reg));
         break;
         case 'gtir': case 'gtri': case 'gtrr':
         reg.set(this.c, this.toImmediateA(reg) > this.toImmediateB(reg) ? 1 : 0)
         break;
         case 'eqir': case 'eqri': case 'eqrr':
         reg.set(this.c, this.toImmediateA(reg) === this.toImmediateB(reg) ? 1 : 0)
         break;
      }
   }
}

class InstructionTest {
   constructor(public before : string, public instr : string, public after: string) {
   }

   possible() : OpCode[] {
      let possibles : OpCode[] = []
      for (let code of Instruction.OpCodeMap) {
         let regBefore = Registers.fromInput(this.before);
         let regAfter = Registers.fromInput(this.after);

         let testNums = this.instr.split(' ');
         let testInstr = new Instruction(code, +testNums[1], +testNums[2], +testNums[3]);

         if (testInstr.canExecute()) {
            testInstr.execute(regBefore);
            if (regBefore.equals(regAfter)) {
               possibles.push(code);
            }
         }
      }

      return possibles;
   }
}

class Solution16 implements ISolution {
   _testsFileName : string = './src/advent16/inputTests.txt';
   _codeFileName : string = './src/advent16/inputCode.txt';

   dayNumber : Number = 16;

   getInstructionTests() : InstructionTest[] {
      let inputFile = new InputFile(this._testsFileName);
      let lines = inputFile.readLines().filter((s) => s !== '');

      let tests : InstructionTest[] = [];
      for(let i = 0; i < lines.length; i+= 3) {
         let re = /\d+/g;

         let beforeMatch = lines[i].match(re);
         let afterMatch = lines[i+2].match(re);
         if (beforeMatch != null && afterMatch != null) {
            let before = beforeMatch.join(',');
            let after = afterMatch.join(',');
            tests.push(new InstructionTest(before, lines[i+1], after));
         }
      }

      return tests;
   }

   getInstructionCode() : Instruction[] {
      let inputFile = new InputFile(this._codeFileName);
      let lines = inputFile.readLines().filter((s) => s !== '');

      return lines.map((s) => Instruction.fromInput(s));
   }

   solvePart1() : string {
      return this.getInstructionTests()
         .filter((t) => t.possible().length >= 3)
         .reduce((a,c) => a + 1, 0)
         .toString();
   }

   solvePart2() : string {
      /*
      // Progressively find the number of each instruction
      // & order them by number in Instructions.OpCodeMap
      let tests = this.getInstructionTests();
      tests.map((t) => { return { num: t.instr.substring(0, 2), codes: t.possible() }})
      .filter((t) => t.codes.length === 1)
      .forEach((t) => console.log(`${t.num} = ${t.codes[0]}`));
      */

      let program = this.getInstructionCode();
      let registers = Registers.fromInput('0,0,0,0');

      for(let instruction of program) {
         instruction.execute(registers);
      }

      return registers.get(0).toString();
   }
}

export default new Solution16();
