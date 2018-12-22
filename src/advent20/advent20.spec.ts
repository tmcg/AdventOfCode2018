
import result from './advent20';
import { expect } from 'chai';
import 'mocha';

describe(`Advent of Code Day ${result.dayNumber}`, () => {

  it('should solve the part 1 demo', () => {
    expect(result.findMaxPath('^WNE$')).to.equal(3);
    expect(result.findMaxPath('^W(|)EW$')).to.equal(1);
    expect(result.findMaxPath('^W(SN|EW)NE$')).to.equal(3);
    expect(result.findMaxPath('^ENWWW(NEEE|SSE(EE|N))$')).to.equal(10);
    expect(result.findMaxPath('^ENNWSWW(NEWS|)SSSEEN(WNSE|)EE(SWEN|)NNN$')).to.equal(18);
  });

  it('should solve part 1', () => {
    expect(result.solvePart1()).to.equal('4108');
  });

  it('should solve part 2', () => {
    expect(result.solvePart2()).to.equal('8366');
  });
});