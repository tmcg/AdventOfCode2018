
import result from './advent02';
import { expect } from 'chai';
import 'mocha';

describe(`Advent of Code Day ${result.dayNumber}`, () => {

  it('should solve part 1', () => {
    expect(result.solvePart1()).to.equal('6916');
  });

  it('should solve part 2', () => {
    expect(result.solvePart2()).to.equal('oeylbtcxjqnzhgyylfapviusr');
  });

  it('should get repeating counts', () => {
    expect(result.getLineRepeatingCounts('abcdef')).to.eql([0,0]);
    expect(result.getLineRepeatingCounts('bababc')).to.eql([1,1]);
    expect(result.getLineRepeatingCounts('abbcde')).to.eql([1,0]);
    expect(result.getLineRepeatingCounts('abcccd')).to.eql([0,1]);
    expect(result.getLineRepeatingCounts('aabcdd')).to.eql([1,0]);
    expect(result.getLineRepeatingCounts('abcdee')).to.eql([1,0]);
    expect(result.getLineRepeatingCounts('ababab')).to.eql([0,1]);
  });

  it('should get closest line', () => {
    expect(result.getClosestLine('fghij','fguij')).to.eql([1,'fgij']);
  });
});