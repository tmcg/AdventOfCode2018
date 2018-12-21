
import result from './advent19';
import { expect } from 'chai';
import 'mocha';

describe(`Advent of Code Day ${result.dayNumber}`, () => {

  it('should solve the part 1 demo', () => {
    expect(result.solveDemo1()).to.equal('7');
  });

  it('should solve part 1', () => {
    expect(result.solvePart1()).to.equal('878');
  });

  it('should solve part 2', () => {
    expect(result.solvePart2()).to.equal('11510496');
  });
});