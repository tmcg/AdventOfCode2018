
import result from './advent06';
import { expect } from 'chai';
import 'mocha';

describe(`Advent of Code Day ${result.dayNumber}`, () => {

  it('should calculate distance', () => {
     expect(result.manhattanDistance({x: 0, y: 0},{x: 1, y: 0})).to.equal(1);
     expect(result.manhattanDistance({x: 0, y: 0},{x: 0, y: 1})).to.equal(1);
     expect(result.manhattanDistance({x: 0, y: 0},{x: 2, y: 0})).to.equal(2);
     expect(result.manhattanDistance({x: 0, y: 0},{x: 0, y: 2})).to.equal(2);
     expect(result.manhattanDistance({x: 1, y: 1},{x: 2, y: 2})).to.equal(2);
     expect(result.manhattanDistance({x: 1, y: 6},{x: 2, y: 8})).to.equal(3);
     expect(result.manhattanDistance({x: -10, y: -10},{x: 1, y: 1})).to.equal(22);
  });

  it('should solve part 1', () => {
    expect(result.solvePart1()).to.equal('3006');
  });

  it('should solve part 2', () => {
    expect(result.solvePart2()).to.equal('42998');
  });
});