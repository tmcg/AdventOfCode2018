
import result from './advent10';
import { expect } from 'chai';
import 'mocha';

describe(`Advent of Code Day ${result.dayNumber}`, () => {

  it('should solve the part 1 demo', () => {
    expect(result.solveDemo1()).to.equal('HI');
  });

  it('should solve part 1', () => {
    expect(result.solvePart1()).to.equal('BLGNHPJC');
  });

  it('should solve part 2', () => {
    expect(result.solvePart2()).to.equal('10476');
  });
});