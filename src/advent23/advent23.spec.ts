
import result from './advent23';
import { expect } from 'chai';
import 'mocha';

describe(`Advent of Code Day ${result.dayNumber}`, () => {

  it('should solve part 1', () => {
    expect(result.solvePart1()).to.equal('595');
  });

  it('should solve part 2', () => {
    expect(result.solvePart2()).to.equal('88122632');
  });
});