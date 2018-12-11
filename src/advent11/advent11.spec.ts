
import result from './advent11';
import { expect } from 'chai';
import 'mocha';

describe(`Advent of Code Day ${result.dayNumber}`, () => {

  it('should solve the part 1 demo', () => {
    expect(result.createGrid(57).getPower(122,79)).to.equal(-5);
    expect(result.createGrid(39).getPower(217,196)).to.equal(0);
    expect(result.createGrid(71).getPower(101,153)).to.equal(4);

    expect(result.createGrid(18).findMaxOf3x3()).to.equal('33,45');
    expect(result.createGrid(42).findMaxOf3x3()).to.equal('21,61');
  });

  it('should solve part 1', () => {
    expect(result.solvePart1()).to.equal('20,54');
  });

  it('should solve the part 2 demo', () => {
    expect(result.createGrid(18).findMaxOfAny()).to.equal('90,269,16');
    expect(result.createGrid(42).findMaxOfAny()).to.equal('232,251,12');
  });

  it('should solve part 2', () => {
    expect(result.solvePart2()).to.equal('233,93,13');
  });
});