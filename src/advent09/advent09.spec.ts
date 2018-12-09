
import result from './advent09';
import { expect } from 'chai';
import 'mocha';

describe(`Advent of Code Day ${result.dayNumber}`, () => {

  it('should find next marble', () => {
    let game = result.createGame(1,1);
    expect(game.findNextMarble([0], 0, -2)).to.equal(0);
    expect(game.findNextMarble([0], 0, -1)).to.equal(0);
    expect(game.findNextMarble([0], 0, 0)).to.equal(0);
    expect(game.findNextMarble([0], 0, 1)).to.equal(0);
    expect(game.findNextMarble([0], 0, 2)).to.equal(0);

    expect(game.findNextMarble([0,1], 0, -2)).to.equal(0);
    expect(game.findNextMarble([0,1], 0, -1)).to.equal(1);
    expect(game.findNextMarble([0,1], 0, 0)).to.equal(0);
    expect(game.findNextMarble([0,1], 0, 1)).to.equal(1);
    expect(game.findNextMarble([0,1], 0, 2)).to.equal(0);

    expect(game.findNextMarble([0,1], 1, -2)).to.equal(1);
    expect(game.findNextMarble([0,1], 1, -1)).to.equal(0);
    expect(game.findNextMarble([0,1], 1, 0)).to.equal(1);
    expect(game.findNextMarble([0,1], 1, 1)).to.equal(0);
    expect(game.findNextMarble([0,1], 1, 2)).to.equal(1);

    expect(game.findNextMarble([0,1,2,3,4,5,6,7,8,9,10], 1, -2)).to.equal(10);
    expect(game.findNextMarble([0,1,2,3,4,5,6,7,8,9,10], 1, -1)).to.equal(0);
    expect(game.findNextMarble([0,1,2,3,4,5,6,7,8,9,10], 1, 0)).to.equal(1);
    expect(game.findNextMarble([0,1,2,3,4,5,6,7,8,9,10], 1, 1)).to.equal(2);
    expect(game.findNextMarble([0,1,2,3,4,5,6,7,8,9,10], 1, 2)).to.equal(3);
  });

  it('should solve the part 1 demo', () => {
    expect(result.createGame(9, 25).findWinner().score.toString()).to.equal('32');

    expect(result.createGame(10, 1618).findWinner().score.toString()).to.equal('8317');
    expect(result.createGame(13, 7999).findWinner().score.toString()).to.equal('146373');
    expect(result.createGame(17, 1104).findWinner().score.toString()).to.equal('2764');
    expect(result.createGame(21, 6111).findWinner().score.toString()).to.equal('54718');
    expect(result.createGame(30, 5807).findWinner().score.toString()).to.equal('37305');
  });

  it('should solve part 1', () => {
    expect(result.solvePart1()).to.equal('383475');
  });

  it('should solve part 2', () => {
    expect(result.solvePart2()).to.equal('3148209772');
  });
});