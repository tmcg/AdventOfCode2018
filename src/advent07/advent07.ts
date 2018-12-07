
import { ISolution, InputFile } from '../shared';

type Edge = { name1 : string, name2 : string }
type Node = { name : string, from : string[], delay: number }

function compareString(s1 : string, s2 : string) : number {
   return (s1 < s2) ? -1 : (s1 > s2 ? 1 : 0);
}

class DirectedGraph {
   _edges : Edge[] = [];

   getNodeNames() : string[] {
      let nodes : Set<string> = new Set();
      for (let edge of this._edges) {
         nodes.add(edge.name1);
         nodes.add(edge.name2);
      }
      return Array.from(nodes).sort(compareString);
   }

   getNodes(delayFn : (s : string) => number = (s) => 0) : Node[] {
      return this.getNodeNames().map((name) => {
         let fromNames = new Set(this._edges.filter((e) => e.name2 == name).map((e) => e.name1));

         return {
            name: name,
            from: Array.from(fromNames).sort(compareString),
            delay: delayFn(name),
         };
      });
   }

   addEdge(name1 : string, name2 : string) {
      this._edges.push({ name1: name1, name2: name2 });
      this._edges = this._edges.sort((e1, e2) => compareString(e1.name1, e2.name1));
   }

   print() {
      for (let edge of this._edges) {
         console.log(`${edge.name1} -> ${edge.name2}`);
      }
   }
}

class Solution7 implements ISolution {
   _inputFileName : string = './src/advent07/input.txt';
   _demoFileName : string = './src/advent07/demo.txt';

   dayNumber : Number = 7;

   getRange(size : number, startAt : number = 0) : number[] {
      return [...Array(size).keys()].map(i => i + startAt);
   }

   parseGraph(lines : string[]) : DirectedGraph {
      let re = /Step (.) must be finished before step (.) can begin/;
      let g = new DirectedGraph();
      for(let line of lines) {
         let match = re.exec(line)!;
         g.addEdge(match[1], match[2]);
      }
      //g.print();
      return g;
   }

   // Early Part 1 Implementation
   findTraversalOrderEarly(nodes : Node[]) : string {
      let result : string = '';
      let resultMax = nodes.length;

      while (result.length < resultMax) {
         let name = nodes.filter((r) => r.from.length == 0).map((r) => r.name)[0];
         result += name;
         // Remove node from other nodes
         nodes.forEach((r) => r.from = r.from.filter((n) => n !== name));
         // Remove node from main list
         nodes = nodes.filter((r) => r.name !== name);
      }
      return result;
   }

   findTraversalOrder(nodes : Node[], numWorkers : number = 1) : string {
      return this.findTraversalWithWorkers(nodes, numWorkers)[0];
   }

   findTraversalTime(nodes : Node[], numWorkers : number = 1) : number {
      return this.findTraversalWithWorkers(nodes, numWorkers)[1];
   }

   findTraversalWithWorkers(nodes : Node[], numWorkers : number) : [string, number] {
      let result : string = '';
      let resultMax = nodes.length;
      let clock = 0;

      type WorkerElf = { job : string, finish: number };
      let workers = this.getRange(numWorkers).map((k) => <WorkerElf> { job: '.', finish: 0 });

      while (result.length < resultMax) {
         for (let worker of workers) {
            if (worker.job !== '.' && worker.finish <= clock) {
               result += worker.job;
               // The job is finished, remove node from other nodes
               nodes.forEach((n) => n.from = n.from.filter((f) => f !== worker.job));
               worker.job = '.';
            }

            if (worker.job === '.') {
               // The worker is waiting, find an available job
               let nextJobs = nodes.filter((r) => r.from.length == 0);
               if (nextJobs.length > 0) {
                  worker.job = nextJobs[0].name;
                  worker.finish = clock + nextJobs[0].delay;
                  nodes = nodes.filter((n) => n.name !== worker.job);
               }
            }
         }

         //console.log(`${clock}: ${workers.map((w) => w.job).join(' ')}`);
         clock++;
      }

      return [result, clock - 1];
   }

   solveDemo1() : string {
      let demoFile = new InputFile(this._demoFileName);
      let graph = this.parseGraph(demoFile.readLines());

      return this.findTraversalOrder(graph.getNodes());
   }

   solveDemo2() : string {
      let demoFile = new InputFile(this._demoFileName);
      let graph = this.parseGraph(demoFile.readLines());

      let nodes = graph.getNodes((s) => 1 + s.charCodeAt(0) - 'A'.charCodeAt(0));
      return this.findTraversalTime(nodes, 2).toString();
   }

   solvePart1() : string {
      let inputFile = new InputFile(this._inputFileName);
      let graph = this.parseGraph(inputFile.readLines());

      return this.findTraversalOrder(graph.getNodes());
   }

   solvePart2() : string {
      let inputFile = new InputFile(this._inputFileName);
      let graph = this.parseGraph(inputFile.readLines());

      let nodes = graph.getNodes((s) => 61 + s.charCodeAt(0) - 'A'.charCodeAt(0));
      return this.findTraversalTime(nodes, 5).toString();
   }
}

export default new Solution7();
