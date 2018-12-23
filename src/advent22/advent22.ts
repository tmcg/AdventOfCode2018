
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

   getRegionTools(type: RegionType): RescueTool[] {
      if (type === RegionType.Rocky) { return [RescueTool.Torch, RescueTool.Gear]; }
      if (type === RegionType.Wet) { return [RescueTool.Gear, RescueTool.Nothing]; }
      return [RescueTool.Torch, RescueTool.Nothing];
   }

   addNodes(g: Graph, cave: ICaveRegion[][], srcPos: IPoint) {
      type EdgeRef = { [id: string]: number }
      type NodeRef = { [id: string]: EdgeRef }

      // Add edges for changing allowable tools within this region
      let srcTools = this.getRegionTools(cave[srcPos.y][srcPos.x].type);
      let toolA = this.getNodeId(srcPos, srcTools[0]);
      let toolB = this.getNodeId(srcPos, srcTools[1]);

      let nodes: NodeRef = {};
      nodes[toolA] = {};
      nodes[toolA][toolB] = 7;
      nodes[toolB] = {};
      nodes[toolB][toolA] = 7;

      let dests: IPoint[] = ([
         {x: srcPos.x, y: srcPos.y + 1}, {x: srcPos.x, y: srcPos.y - 1},
         {x: srcPos.x + 1, y: srcPos.y}, {x: srcPos.x - 1, y: srcPos.y},
      ]).filter((v) => v.y >= 0 && v.x >= 0 && v.y < cave.length && v.x < cave[0].length);

      // Find and add edges for valid adjacent regions
      for(let destPos of dests) {
         // Only add edges for the intersection of tools allowed by src and dest
         let destTools = this.getRegionTools(cave[destPos.y][destPos.x].type);

         for (let srcTool of srcTools.filter((t) => destTools.indexOf(t) >= 0)) {
            nodes[this.getNodeId(srcPos, srcTool)][this.getNodeId(destPos, srcTool)] = 1;
         }
      }

      g.addNode(toolA, nodes[toolA]);
      g.addNode(toolB, nodes[toolB]);
   }

   shortestPath(input: ICaveInput): number {
      // Construct a graph & use Dijkstra's algorithm to find shortest cost path
      // Using separate states(nodes) per cave region to account for cost of changing tools
      // Pad X/Y margin to allow wider graph search

      let cave = this.getCaveRegions(input, 100, 100);
      let g = new Graph();
      for(let y = 0; y < cave.length; y++) {
         for(let x = 0; x < cave[y].length; x++) {
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
         console.log(
            cave[y].map((r) => {
               switch (r.type) {
                  case RegionType.Rocky: return '.'; break;
                  case RegionType.Wet: return '='; break;
                  case RegionType.Narrow: return '|'; break;
                  default: return '';
               }
            }).join(''));
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
