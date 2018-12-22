
import result from './advent22';
import { expect } from 'chai';
import 'mocha';

describe(`Advent of Code Day ${result.dayNumber}`, () => {

  it('should solve the part 1 demo', () => {
    expect(result.solveDemo1()).to.equal('114');
  });

  it('should solve part 1', () => {
    expect(result.solvePart1()).to.equal('5622');
  });

  it('should solve part 2', () => {
    expect(result.solvePart2()).to.equal('');
  });
});