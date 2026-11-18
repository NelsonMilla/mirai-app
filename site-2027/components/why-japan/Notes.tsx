// Footnote marker (links to its note and back) and the "Sources and notes" list.
import { whyJapan as t } from '@/content/why-japan';
import s from './Notes.module.css';

export const Fn = ({ n }: { n: number }) => (
  <sup className={s.fn}><a href={`#fn${n}`} id={`fnref${n}`} aria-label={`Note ${n}`}>{n}</a></sup>
);

export function Notes() {
  return (
    <section className={s.notes} aria-labelledby="notes-title">
      <h2 id="notes-title" className="mono">{t.notesTitle}</h2>
      <ol>
        {t.notes.map((n, i) => (
          <li key={i} id={`fn${i + 1}`}>
            {n} <a href={`#fnref${i + 1}`} aria-label={`Back to reference ${i + 1}`}>Back</a>
          </li>
        ))}
      </ol>
      <p className={s.credit}>
        Lead photo: {t.aerial.credit}{' '}
        <a href={t.aerial.source} target="_blank" rel="noopener">Source</a> ·{' '}
        <a href={t.aerial.license} target="_blank" rel="noopener">Licence</a>. Resized and colour graded.
      </p>
    </section>
  );
}
