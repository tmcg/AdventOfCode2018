
import result from './advent09';
import { expect } from 'chai';
import 'mocha';

describe(`Advent of Code Day ${result.dayNumber}`, () => {

  it('should solve the part 1 demo', () => {
    expect(result.createGame(9, 25).findWinningScore().toString()).to.equal('32');
    expect(result.createGame(10, 1618).findWinningScore().toString()).to.equal('8317');
    expect(result.createGame(13, 7999).findWinningScore().toString()).to.equal('146373');
    expect(result.createGame(17, 1104).findWinningScore().toString()).to.equal('2764');
    expect(result.createGame(21, 6111).findWinningScore().toString()).to.equal('54718');
    expect(result.createGame(30, 5807).findWinningScore().toString()).to.equal('37305');
  });

  it('should solve part 1', () => {
    expect(result.solvePart1()).to.equal('383475');
  });

  it('should solve part 2', () => {
    expect(result.solvePart2()).to.equal('3148209772');
  });
});