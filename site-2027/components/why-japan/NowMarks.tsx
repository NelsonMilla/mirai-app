'use client';
// Time-relative labels for the Why now section. The page is static and stays up for months, so
// "Today" and "Ahead" are computed from the reader's clock, and only after mount: the server
// snapshot is null, so hydration matches and no-JS readers see no time-relative label at all.
import { useSyncExternalStore } from 'react';
import s from './Now.module.css';

type Phase = 'before2027' | 'jan2027' | 'later';

const JAN_2027 = new Date(2027, 0, 1).getTime();
const FEB_2027 = new Date(2027, 1, 1).getTime();

function phase(): Phase {
  const now = Date.now();
  return now < JAN_2027 ? 'before2027' : now < FEB_2027 ? 'jan2027' : 'later';
}
const subscribe = () => () => {};
const usePhase = () => useSyncExternalStore<Phase | null>(subscribe, phase, () => null);

const todayText = () =>
  new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

/** Gold Today rule between Oct 2026 and the 2027 year, while today is before Jan 1 2027. */
export function TodayRule() {
  if (usePhase() !== 'before2027') return null;
  return (
    <li className={s.today}>
      {/* Added label: plain and literal, computed from the reader's date. */}
      <span className={s.todayLabel}>Today · <time dateTime={new Date().toISOString().slice(0, 10)}>{todayText()}</time></span>
    </li>
  );
}

/** During January 2027, Today sits on the Jan 2027 date line, where it is true. */
export function TodayInline() {
  if (usePhase() !== 'jan2027') return null;
  return <span className={s.todayInline}>Today</span>;
}

/** Plain mono "Ahead" beside the 2027 numeral, while today is before Jan 1 2027. */
export function AheadLabel() {
  if (usePhase() !== 'before2027') return null;
  return <span className={s.aheadLabel}>Ahead</span>;
}
