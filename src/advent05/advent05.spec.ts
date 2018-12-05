
import result from './advent05';
import { expect } from 'chai';
import 'mocha';

describe(`Advent of Code Day ${result.dayNumber}`, () => {

  it('should reduce dabAcCaCBAcCcaDA', () => {
    expect(result.getReactionResult('dabAcCaCBAcCcaDA')).to.equal('dabCBAcaDA');
  })

  it('should solve part 1', () => {
    expect(result.solvePart1()).to.equal('10878');
  });

  it('should solve part 2', () => {
    expect(result.solvePart2()).to.equal('6874');
  });
});