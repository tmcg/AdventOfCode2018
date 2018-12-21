
import { ISolution, InputFile, Util } from '../shared';

type OpCode =
   'addr' | 'addi' | 'mulr' | 'muli' | 'banr' | 'bani' | 'borr' | 'bori' |
   'setr' | 'seti' | 'gtir' | 'gtri' | 'gtrr' | 'eqir' | 'eqri' | 'eqrr' |
   '#ip';

class Computer {
   static MaxRegisters : number = 6;
   private reg : number[];
   private ip : number;
   private cycle : number;
   private direct : Instruction[];
   private code : Instruction[];

   constructor() {
      this.reg = this.initRegisters();
      this.ip = 0;
      this.cycle = 0;
      this.direct = [];
      this.code = [];
   }

   private initRegisters() : number[] {
      return Util.range(Computer.MaxRegisters).map((n) => 0);
   }

   loadProgram(program : Instruction[]) {
      this.direct = program.filter((s) => s.op.substring(0,1) === '#');
      this.code = program.filter((s) => s.op.substring(0,1) !== '#');

      for(let d of this.direct) {
         if (d.op === '#ip') {
            this.ip = d.a;
         }
      }
   }

   step(print : boolean = false) : boolean {
      let ipVal = this.getRegisterValue(this.ip);

      if (ipVal >= 0 && ipVal < this.code.length) {
         let inst = this.code[ipVal];
         inst.execute(this, print);

         this.reg[this.ip]++;
         this.cycle++;

         if (print && this.cycle % 1000000 === 0) {
            console.log(`cycle: ${this.cycle/100000}M`);
         }

         return true;
      }

      return false;
   }

   getRegisterValue(n : number) : number {
      return this.reg[n];
   }

   setRegisterValue(n : number, v : number) {
      this.reg[n] = v;
   }

   getInstructionPointer() : number {
      return this.reg[this.ip];
   }

   getAllRegisterValues() : number[] {
      return Util.range(Computer.MaxRegisters).map((n) => this.getRegisterValue(n));
   }

   equals(b : Computer) {
      return this.reg.join(',') === b.reg.join(',');
   }
}

class Instruction {
   constructor(public op : OpCode, public a : number, public b : number, public c : number) {
      this.op = op;
      this.a = a;
      this.b = b;
      this.c = c;
   }

   static fromInput(v : string) : Instruction {
      let values = v.split(' ');

      if (values[0] === '#ip') {
         return new Instruction(<OpCode>values[0], +values[1], 0, 0);
      }

      return new Instruction(<OpCode>values[0], +values[1], +values[2], +values[3]);
   }

   toImmediateA(comp : Computer) : number {
      return this.isImmediateA() ? this.a : comp.getRegisterValue(this.a);
   }

   toImmediateB(comp : Computer) : number {
      return this.isImmediateB() ? this.b : comp.getRegisterValue(this.b);
   }

   isImmediateA() : boolean {
      return this.op === 'gtir' || this.op === 'eqir' || this.op === 'seti';
   }

   isImmediateB() : boolean {
      return this.op === 'addi' || this.op === 'muli' || this.op === 'bani' ||
         this.op === 'bori' || this.op === 'gtri' || this.op === 'eqri';
   }

   canExecute() : boolean {
      return (this.a < Computer.MaxRegisters || this.isImmediateA()) &&
         (this.b < Computer.MaxRegisters || this.isImmediateB());
   }

   execute(comp : Computer, print: boolean = false) : void{

      let log = '';
      if (print) {
         log += `ip=${comp.getInstructionPointer()}`;
         log += ` [${comp.getAllRegisterValues().join(',')}]`;
         log += ` ${this.op} ${this.a} ${this.b} ${this.c}`
      }

      switch (this.op) {
         case 'addr': case 'addi':
         comp.setRegisterValue(this.c, this.toImmediateA(comp) + this.toImmediateB(comp));
         break;
         case 'mulr': case 'muli':
         comp.setRegisterValue(this.c, this.toImmediateA(comp) * this.toImmediateB(comp));
         break;
         case 'banr': case 'bani':
         comp.setRegisterValue(this.c, this.toImmediateA(comp) & this.toImmediateB(comp));
         break;
         case 'borr': case 'bori':
         comp.setRegisterValue(this.c, this.toImmediateA(comp) | this.toImmediateB(comp));
         break;
         case 'setr': case 'seti':
         comp.setRegisterValue(this.c, this.toImmediateA(comp));
         break;
         case 'gtir': case 'gtri': case 'gtrr':
         comp.setRegisterValue(this.c, this.toImmediateA(comp) > this.toImmediateB(comp) ? 1 : 0)
         break;
         case 'eqir': case 'eqri': case 'eqrr':
         comp.setRegisterValue(this.c, this.toImmediateA(comp) === this.toImmediateB(comp) ? 1 : 0)
         break;
      }

      if (print) {
         log += ` [${comp.getAllRegisterValues().join(',')}]`
         console.log(log);
      }
   }
}

class Solution19 implements ISolution {
   _inputFileName : string = './src/advent19/input.txt';
   _demoFileName : string = './src/advent19/demo.txt';

   dayNumber : Number = 19;

   solveDemo1() : string {
      let inputFile = new InputFile(this._demoFileName);
      let lines = inputFile.readLines();

      let program = lines.map((s) => Instruction.fromInput(s));
      let comp = new Computer();
      comp.loadProgram(program);

      while (comp.step()) {}
      return comp.getRegisterValue(0).toString();
   }

   solvePart1() : string {
      let inputFile = new InputFile(this._inputFileName);
      let lines = inputFile.readLines();

      let program = lines.map((s) => Instruction.fromInput(s));
      let comp = new Computer();
      comp.loadProgram(program);

      while (comp.step()) {}
      return comp.getRegisterValue(0).toString();
   }

   solvePart2() : string {
      let inputFile = new InputFile(this._inputFileName);
      let lines = inputFile.readLines();

      let program = lines.map((s) => Instruction.fromInput(s));
      let comp = new Computer();
      comp.setRegisterValue(0, 1);
      comp.loadProgram(program);

      // Can't simulate this, it'll take forever.
      //while (comp.step(true)) {}

      // A pattern emerges, register 2 contains 10551277 and the
      // program code loops to find the sum of divisors:
      // 1 + 11 + 959207 + 10551277
      return '11510496';
   }
}

export default new Solution19();
