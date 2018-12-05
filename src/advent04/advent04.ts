
import { ISolution, InputFile } from '../shared';
import { from } from 'rxjs';
import { map, groupBy, mergeMap, toArray } from 'rxjs/operators';

type EventType = 'shift' | 'sleep' | 'wake';

type GuardShiftMinutes = {
   guardNumber: number,
   shiftNumber: number,
   sleepingMinutes: number[],
};

type GuardTopMinutes = {
   guardNumber : number,
   totalMinutes : number,
   topMinute: number,
   topFrequency: number,
};

class GuardEvent {
   guardNumber : number | null;
   shiftNumber : number | null;
   eventType : EventType;
   eventTime : Date;

   constructor(line: string) {
      this.shiftNumber = null;

      let reShift = /\[(.+)\] Guard #(\d+) begins shift/;
      let reSleep = /\[(.+)\] (.*)/;

      let parseEventTime = (dateString : string) => {
         // add 500 years for easy date handling!
         return new Date(dateString.replace('1518','2018') + ' +0000');
      }

      let shiftMatches = reShift.exec(line);
      if (shiftMatches !== null) {
         this.eventType = 'shift';
         this.eventTime = parseEventTime(shiftMatches[1]);
         this.guardNumber = +shiftMatches[2];
         return;
      }

      let sleepMatches = reSleep.exec(line);
      if (sleepMatches !== null) {
         this.eventType = sleepMatches[2] === 'falls asleep' ? 'sleep' : 'wake';
         this.eventTime = parseEventTime(sleepMatches[1]);
         this.guardNumber = null;
         return;
      }

      throw 'Unknown event type';
   }

   compareTime(g : GuardEvent) {
      if (this.eventTime < g.eventTime) return -1;
      if (this.eventTime > g.eventTime) return 1;
      return 0;
   }
}

class Solution4 implements ISolution {
   _inputFileName : string = './src/advent04/input.txt';

   dayNumber : Number = 4;

   getRange(size : number, startAt : number = 0) : number[] {
      return [...Array(size).keys()].map(i => i + startAt);
   }

   getMostFrequent(arr : number[]) : number {
      return arr.reduce((a,b,i,r) =>
         (r.filter(v => v === a).length >= r.filter(v => v === b).length ? a : b), 0);
   }

   getGuardEvents(lines : string[]) : GuardEvent[] {
      let events = lines
         .map((s) => new GuardEvent(s))
         .sort((a,b) => a.compareTime(b));

      let lastGuard : number | null = 0;
      let lastShift : number = 0;
      events.forEach((e) => {
         if (e.eventType == 'shift') {
            lastGuard = e.guardNumber;
            lastShift += 1;
            e.shiftNumber = lastShift;
         } else {
            e.guardNumber = lastGuard;
            e.shiftNumber = lastShift;
         }
      });

      return events;
   }

   getGuardTopMinutes(events : GuardEvent[]) : GuardTopMinutes[] {
      let results : GuardTopMinutes[] = [];
      from(events)
         .pipe(
            // shifts
            groupBy((g) => g.shiftNumber!),
            mergeMap((gr) => gr.pipe(toArray())),
            // sleeps
            map((g) : GuardShiftMinutes => {
               let sleepingMinutes : number[] = [];
               let sleepingEvents = g.slice(1); // remove the shift start event

               while(sleepingEvents.length > 0) {
                  let startMinute = sleepingEvents[0].eventTime.getMinutes();
                  let finishMinute = sleepingEvents[1].eventTime.getMinutes();
                  sleepingMinutes.push(...this.getRange(finishMinute - startMinute, startMinute));
                  sleepingEvents = sleepingEvents.slice(2);
               }

               // calculate an array of all sleeping minutes in a guard's shift
               return {
                  guardNumber: g[0].guardNumber!,
                  shiftNumber: g[0].shiftNumber!,
                  sleepingMinutes: sleepingMinutes,
               };
            }),
            // guards
            groupBy((s) => s.guardNumber),
            mergeMap((gr) => gr.pipe(toArray())),
            map((s) : GuardTopMinutes => {
               // concatenate all sleeping minutes arrays for a guard across all shifts
               let allSleepingMinutes : number[] = [];
               s.forEach(t => allSleepingMinutes.push(...t.sleepingMinutes));

               // determine the minute the guard sleeps the most, and how often the guard sleeps in that minute
               let topMinute = this.getMostFrequent(allSleepingMinutes);
               let topFrequency = allSleepingMinutes.filter((n) => n === topMinute).length;

               return {
                  guardNumber: s[0].guardNumber,
                  totalMinutes: allSleepingMinutes.length,
                  topMinute: topMinute,
                  topFrequency: topFrequency,
               }
            }),
            toArray()
         ).subscribe((e) => results = e);

      return results;
   }

   getGuardTopMinutesFromInput() : GuardTopMinutes[] {
      let inputFile = new InputFile(this._inputFileName);
      let events = this.getGuardEvents(inputFile.readLines());
      return this.getGuardTopMinutes(events);
   }

   solvePart1() : string {
      let topMinutes = this.getGuardTopMinutesFromInput();
      let topGuard = topMinutes.sort((a,b) => b.totalMinutes - a.totalMinutes)[0];
      return (topGuard.guardNumber * topGuard.topMinute).toString();
   }

   solvePart2() : string {
      let topMinutes = this.getGuardTopMinutesFromInput();
      let topGuard = topMinutes.sort((a,b) => b.topFrequency - a.topFrequency)[0];
      return (topGuard.guardNumber * topGuard.topMinute).toString();
   }
}

export default new Solution4();
