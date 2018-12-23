
import { ISolution, InputFile } from '../shared';
import Graph from 'node-dijkstra';

enum RegionType {
   Rocky = 0,
   Wet = 1,
   Narrow = 2,
}

enum RescueTool {
   Torch = 0,
   Gear = 1,
   Nothing = 2,
}

interface IPoint {
   x: number;
   y: number;
}

interface ICaveInput {
   depth: number;
   target : IPoint;
}

interface ICaveRegion {
   type: RegionType
}

interface ICaveStats extends ICaveRegion {
   geologic: number;
   erosion: number;
}

class Solution22 implements ISolution {
   _inputFileName: string = './src/advent22/input.txt';
   _demoFileName: string = './src/advent22/demo.txt';

   dayNumber: Number = 22;

   getInputFromFile(fileName: string): ICaveInput {
      let inputFile = new InputFile(fileName);
      let lines = inputFile.readLines();

      let depth = lines[0].replace('depth: ','');
      let target = lines[1].replace('target: ','').split(',');

      return {
         depth: +depth,
         target: {
            x: +target[0],
            y: +target[1]
         }
      };
   }

   getCaveRegions(input: ICaveInput, padX: number = 0, padY: number = 0): ICaveRegion[][] {
      let cave: ICaveStats[][] = [];

      for(let y = 0; y <= input.target.y + padY; y++) {
         cave[y] = [];
         for(let x = 0; x <= input.target.x + padX; x++) {
            let stats = { geologic: 0, erosion: 0, type: RegionType.Rocky };

            let isMouth = x === 0 && y === 0;
            let isTarget = x === input.target.x && y === input.target.y;

            if (!isMouth && !isTarget) {
               if (y === 0) {
                  stats.geologic = x * 16807;
               } else if (x === 0) {
                  stats.geologic = y * 48271;
               } else {
                  stats.geologic = cave[y][x-1].erosion * cave[y-1][x].erosion;
               }
            }
            stats.erosion = (stats.geologic + input.depth) % 20183;
            stats.type = stats.erosion % 3;
            cave[y][x] = stats;
         }
      }

      //this.printCave(cave);
      return cave;
   }

   sumRiskLevel(input: ICaveInput): number {
      let cave = this.getCaveRegions(input);
      let total: number = 0;

      for(let y = 0; y <= input.target.y; y++) {
         for(let x = 0; x <= input.target.x; x++) {
            total += cave[y][x].type;
         }
      }

      return total;
   }

   getNodeId(pos: IPoint, tool: RescueTool): string {
      return `${pos.x}|${pos.y}|${tool}`;
   }

   regionTools(type: RegionType): RescueTool[] {
      switch(type) {
         case RegionType.Rocky:
         return [RescueTool.Torch, RescueTool.Gear];
         case RegionType.Wet:
         return [RescueTool.Gear, RescueTool.Nothing];
         case RegionType.Narrow:
         return [RescueTool.Torch, RescueTool.Nothing];
      }
      throw 'Invalid region type!';
   }

   addNodes(g: Graph, cave: ICaveRegion[][], srcPos: IPoint) {
      let srcType = cave[srcPos.y][srcPos.x].type;
      let srcTools = this.regionTools(srcType);

      type EdgeRef = { [id: string]: number }
      type NodeRef = { [id: string]: EdgeRef }

      function edge(nodeId: string, weight: number, ref: EdgeRef = {}): EdgeRef {
         ref[nodeId] = weight;
         return ref;
      }

      // Add edges for changing allowable tools within this region
      let nodes: NodeRef = {};
      nodes[this.getNodeId(srcPos, srcTools[0])] = edge(this.getNodeId(srcPos, srcTools[1]), 7);
      nodes[this.getNodeId(srcPos, srcTools[1])] = edge(this.getNodeId(srcPos, srcTools[0]), 7);

      let visits: IPoint[] = ([
         {x: srcPos.x, y: srcPos.y + 1},
         {x: srcPos.x, y: srcPos.y - 1},
         {x: srcPos.x + 1, y: srcPos.y},
         {x: srcPos.x - 1, y: srcPos.y},
      ]).filter((v) => v.y >= 0 && v.x >= 0 && v.y < cave.length && v.x < cave[0].length);

      // Find and add edges for valid adjacent regions
      for(let destPos of visits) {
         let destType = cave[destPos.y][destPos.x].type;
         let destTools = this.regionTools(destType);

         // Only add edges for the intersection of tools allowed by src and dest
         for (let srcTool of srcTools.filter((t) => destTools.indexOf(t) >= 0)) {
            let srcId = this.getNodeId(srcPos, srcTool);
            edge(this.getNodeId(destPos, srcTool), 1, nodes[srcId] || {})
         }
      }

      for (let nodeId in nodes) {
         g.addNode(nodeId, nodes[nodeId]);
      }
   }

   shortestPath(input: ICaveInput): number {
      // Construct a graph & use Dijkstra's algorithm to find shortest cost path
      // Using separate states(nodes) per cave region to account for cost of changing tools
      // Pad X/Y margin to allow wider graph search

      let cave = this.getCaveRegions(input, 100, 100);
      let g = new Graph();
      for(let y = 0; y < cave.length - 1; y++) {
         for(let x = 0; x < cave[y].length - 1; x++) {
            this.addNodes(g, cave, {x, y});
         }
      }

      let originId = this.getNodeId({x: 0, y: 0}, RescueTool.Torch);
      let targetId = this.getNodeId(input.target, RescueTool.Torch);
      return +(g.path(originId, targetId, { cost: true }).cost);
   }

   printCave(cave: ICaveRegion[][]) {
      console.log('');

      for(let y = 0; y < cave.length; y++) {
         let line = cave[y].map((r) => {
            let ch = '';
            switch (r.type) {
               case RegionType.Rocky: ch = '.'; break;
               case RegionType.Wet: ch = '='; break;
               case RegionType.Narrow: ch = '|'; break;
            }
            return ch;
         }).join('');

         console.log(line);
      }
   }

   solveDemo1(): string {
      return this.sumRiskLevel(this.getInputFromFile(this._demoFileName)).toString();
   }

   solveDemo2(): string {
      return this.shortestPath(this.getInputFromFile(this._demoFileName)).toString()
   }

   solvePart1(): string {
      return this.sumRiskLevel(this.getInputFromFile(this._inputFileName)).toString();
   }

   solvePart2(): string {
      return this.shortestPath(this.getInputFromFile(this._inputFileName)).toString();
   }
}

export default new Solution22();
