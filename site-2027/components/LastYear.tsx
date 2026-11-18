// The /2026 page body: last year's speakers (one alphabetical grid) and the agenda as it ran.
// Server-rendered, no JS. The grid is never filtered or reordered: alphabetical order is what
// keeps Joe Betts-LaCroix away from Aubrey and Natalie de Grey (checked in sync-speakers.mjs
// for a grid at most 6 across, see .grid in LastYear.module.css).
import Image from 'next/image';
import speakers from '@/content/speakers-2026.json';
import program from '@/content/program-2026.json';
import { site } from '@/content/site';
import s from './LastYear.module.css';

const t = site.lastYear;
const sessionCount = program.reduce((n, e) => n + e.days.reduce((m, d) => m + d.sessions.filter(x => !('quiet' in x)).length, 0), 0);
// "Prof. Takashi Aoi, MD PhD" → "TA"
const initials = (name: string) => name.replace(/^(Prof\.|Dr\.)\s+/, '').replace(/,.*$/, '')
  .split(/\s+/).filter(Boolean).map(w => w[0]).filter((_, i, a) => i === 0 || i === a.length - 1).join('');

export function LastYear() {
  return (
    <>
      <header className="masthead">
        <span className="mastKanji" aria-hidden="true">記録</span>
        <p className="eyebrow">{t.eyebrow}</p>
        <h1>{t.headline}</h1>
        <div className="mastRow">
          <p className="lead">{t.lead}</p>
          <p className="mono mastCount">
            {speakers.length} speakers · {sessionCount} sessions · {program.length} events
          </p>
        </div>
      </header>

      <nav className={s.jump} aria-label="On this page">
        <a href="#speakers">{t.speakersTitle}</a>
        {program.map(e => <a key={e.id} href={`#${e.id}`}>{e.name} <span>{e.dates}</span></a>)}
      </nav>

      <section id="speakers" className={s.block} aria-labelledby="speakers-title">
        <div className={s.head}>
          <h2 id="speakers-title" className={s.h2}>{t.speakersTitle}<sup>{speakers.length}</sup></h2>
          <p className={s.sub}>{t.speakersLead}</p>
        </div>
        <ul className={s.grid}>
          {speakers.map(p => (
            <li key={p.id} className={s.card}>
              <span className={`${s.photo} grain`}>
                {p.photo
                  ? <Image className="grade" src={p.photo} alt="" fill sizes="(max-width: 640px) 45vw, (max-width: 1100px) 23vw, 220px" />
                  : <span className={s.initials} aria-hidden="true">{initials(p.name)}</span>}
              </span>
              <span className={s.name}>{p.name}</span>
              {p.affiliation && <span className={s.aff}>{p.affiliation}</span>}
              <span className={s.events}>{p.events.map(e => t.events[e]).join(' · ')}</span>
            </li>
          ))}
        </ul>
      </section>

      <section id="agenda" className={s.block} aria-labelledby="agenda-title">
        <div className={s.head}>
          <h2 id="agenda-title" className={s.h2}>{t.agendaTitle}</h2>
          <p className={s.sub}>{t.agendaLead}</p>
        </div>
        {program.map(e => (
          <section key={e.id} id={e.id} className={s.event} aria-labelledby={`${e.id}-title`}>
            <h3 id={`${e.id}-title`} className={s.eventTitle}>
              {e.name} <span>{e.dates}</span>
            </h3>
            {e.days.map(d => (
              <div key={d.day} className={s.day}>
                <h4 className={s.dayTitle}>{d.day}</h4>
                <ol className={s.sessions}>
                  {d.sessions.map(x => (
                    <li key={x.time + x.title} className={'quiet' in x ? `${s.row} ${s.quiet}` : s.row}>
                      <time className={s.time}>{x.time}</time>
                      <div className={s.body}>
                        {!('quiet' in x) && (
                          <p className={s.track}>
                            {x.track}
                            {'remote' in x && <span className={s.tag}>{x.remote === 'recorded' ? t.recorded : t.online}</span>}
                          </p>
                        )}
                        <p className={s.title}>{x.title}</p>
                        {x.people && <p className={s.people}>{x.people}</p>}
                        {'winner' in x && <p className={s.winner}><span>{t.winner}</span> {x.winner}</p>}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </section>
        ))}
      </section>
    </>
  );
}
