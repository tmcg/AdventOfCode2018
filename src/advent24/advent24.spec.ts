
import result from './advent24';
import { expect } from 'chai';
import 'mocha';

describe(`Advent of Code Day ${result.dayNumber}`, () => {

  it('should solve the part 1 demo', () => {
    expect(result.solveDemo1()).to.equal('5216');
  });

  it('should solve part 1', () => {
    expect(result.solvePart1()).to.equal('26868');
  });

  it('should solve the part 2 demo', () => {
    expect(result.solveDemo2()).to.equal('51');
  });

  it('should solve part 2', () => {
    expect(result.solvePart2()).to.equal('515');
  });
});