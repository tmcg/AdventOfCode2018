
import { ISolution, InputFile } from '../shared';

class Tree {
   children : Tree[] = [];
   metadata : number[] = [];
   value : number | null;

   static *generator<T>(source : T[]) {
      for(let n of source) {
         yield +n;
      }
   }

   static *depthFirst(root : Tree) : IterableIterator<Tree> {
      yield root;

      for (let child of root.children) {
         for (let node of Tree.depthFirst(child)) {
            yield node;
         }
      }
   }

   constructor(source : IterableIterator<number>) {
      let childrenCount : number = source.next().value;
      let metadataCount : number = source.next().value;
      this.value = null;

      for(let i = 0; i < childrenCount; i++) {
         this.children.push(new Tree(source));
      }

      for (let i = 0; i < metadataCount; i++) {
         this.metadata.push(source.next().value);
      }
   }

   getMetaTotal() : number {
      let sum = 0;
      for(let node of Tree.depthFirst(this)) {
         sum += node.metadata.reduce((a,c) => a + c, 0);
      }
      return sum;
   }

   getValue() : number {
      if (this.value === null) {
         let seq : number[] = this.metadata;
         if (this.children.length > 0) {
            seq = this.metadata.map((m) => {
               if (m-1 >= 0 && m-1 < this.children.length) {
                  return this.children[m-1].getValue();
               }
               return 0;
            });
         }
         this.value = seq.reduce((a,c) => a + c, 0);
      }
      return this.value;
   }
}

class Solution8 implements ISolution {
   _inputFileName : string = './src/advent08/input.txt';
   _demoFileName : string = './src/advent08/demo.txt';

   dayNumber : Number = 8;

   parseTree(fileName : string) : Tree {
      let inputFile = new InputFile(fileName);
      let input = inputFile.readText().split(' ');
      return new Tree(Tree.generator(input));
   }

   solveDemo1() : string {
      let tree = this.parseTree(this._demoFileName);
      return tree.getMetaTotal().toString();
   }

   solveDemo2() : string {
      let tree = this.parseTree(this._demoFileName);
      return tree.getValue().toString();
   }

   solvePart1() : string {
      let tree = this.parseTree(this._inputFileName);
      return tree.getMetaTotal().toString();
   }

   solvePart2() : string {
      let tree = this.parseTree(this._inputFileName);
      return tree.getValue().toString();
   }
}

export default new Solution8();
