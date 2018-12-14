
import result from './advent14';
import { expect } from 'chai';
import 'mocha';

describe(`Advent of Code Day ${result.dayNumber}`, () => {

  it('should solve the part 1 demo', () => {
    expect(result.solveRecipe1('9',10)).to.equal('5158916779');
    expect(result.solveRecipe1('5',10)).to.equal('0124515891');
    expect(result.solveRecipe1('18',10)).to.equal('9251071085');
    expect(result.solveRecipe1('2018',10)).to.equal('5941429882');
  });

  it('should solve part 1', () => {
    expect(result.solvePart1()).to.equal('9315164154');
  });

  it('should solve the part 2 demo', () => {
    expect(result.solveRecipe2('51589')).to.equal('9');
    expect(result.solveRecipe2('01245')).to.equal('5');
    expect(result.solveRecipe2('92510')).to.equal('18');
    expect(result.solveRecipe2('59414')).to.equal('2018');
  });

  it('should solve part 2', () => {
    expect(result.solvePart2()).to.equal('20231866');
  });
});