
import result from './advent08';
import { expect } from 'chai';
import 'mocha';

describe(`Advent of Code Day ${result.dayNumber}`, () => {

  it('should solve the part 1 demo', () => {
    expect(result.solveDemo1()).to.equal('138');
  });

  it('should solve part 1', () => {
    expect(result.solvePart1()).to.equal('37262');
  });

  it('should solve the part 2 demo', () => {
    expect(result.solveDemo2()).to.equal('66');
   });

  it('should solve part 2', () => {
    expect(result.solvePart2()).to.equal('20839');
  });
});