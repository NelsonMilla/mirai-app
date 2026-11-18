// The /why-japan page body: the Japan thesis from the 2026 /conferences page (copy in
// content/why-japan.ts). Sections were chosen in a design gauntlet (Nov 18 2026): hero = real
// 2026 people beside the claim, reasons = numbers wall + the iPS spread, why now = years as
// monuments with a live "Today" mark, then a closing beat that hands 2027 to the residency. Each
// section is a slot so a design round can swap one in place: <WhyJapan hero={<Variant />} />.
import { Hero } from './why-japan/Hero';
import { Reasons } from './why-japan/Reasons';
import { Now } from './why-japan/Now';
import { Closing } from './why-japan/Closing';
import { Notes } from './why-japan/Notes';

type Slots = { hero?: React.ReactNode; reasons?: React.ReactNode; now?: React.ReactNode; notes?: React.ReactNode };

export function WhyJapan({ hero, reasons, now, notes }: Slots = {}) {
  return (
    <div className="wjPage">
      {hero ?? <Hero />}
      {reasons ?? <Reasons />}
      {now ?? <Now />}
      <Closing />
      {notes ?? <Notes />}
    </div>
  );
}
