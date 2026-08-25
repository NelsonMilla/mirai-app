'use client';

import { useMemo, useRef, useState } from 'react';
import { useActiveSection } from '@/hooks/useActiveSection';
import {
  EXPERIENCE_LAST_CHECKED,
  EXPERIENCE_SECTIONS,
  type ExperienceEntry,
} from '@/content/experience';

const SECTION_IDS = EXPERIENCE_SECTIONS.map((section) => section.id);

const FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Essentials', value: 'essential' },
  { label: 'Food', value: 'food' },
  { label: 'Day trips', value: 'full day' },
  { label: 'After hours', value: 'nightlife' },
  { label: 'With a partner', value: 'partner' },
  { label: 'Work', value: 'work' },
] as const;

function entryMatches(
  entry: ExperienceEntry,
  query: string,
  filter: string,
  context: string,
) {
  const matchesFilter = filter === 'all' || entry.tags.includes(filter);
  if (!matchesFilter) return false;
  if (!query) return true;

  const haystack = [
    entry.title,
    entry.dek,
    entry.summary,
    ...entry.facts,
    ...entry.tags,
    context,
  ]
    .join(' ')
    .toLocaleLowerCase();

  return haystack.includes(query);
}

export function ExperienceGuide() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const mobileDirectoryRef = useRef<HTMLDetailsElement>(null);
  const normalizedQuery = query.trim().toLocaleLowerCase();

  const filteredSections = useMemo(
    () =>
      EXPERIENCE_SECTIONS.map((section) => ({
        ...section,
        groups: section.groups
          .map((group) => ({
            ...group,
            entries: group.entries.filter((entry) =>
              entryMatches(
                entry,
                normalizedQuery,
                filter,
                [section.title, section.navLabel, group.title, group.sourceTitle].join(' '),
              ),
            ),
          }))
          .filter((group) => group.entries.length > 0),
      })).filter((section) => section.groups.length > 0),
    [filter, normalizedQuery],
  );

  const visibleSectionIds = filteredSections.map((section) => section.id);
  const activeSection = useActiveSection(
    visibleSectionIds.length > 0 ? visibleSectionIds : SECTION_IDS,
  );

  const resultCount = filteredSections.reduce(
    (sectionTotal, section) =>
      sectionTotal +
      section.groups.reduce((groupTotal, group) => groupTotal + group.entries.length, 0),
    0,
  );

  const activeLabel =
    EXPERIENCE_SECTIONS.find((section) => section.id === activeSection)?.navLabel ??
    'Start here';

  const clearSearch = () => {
    setQuery('');
    setFilter('all');
  };

  return (
    <div className="experience-guide-shell">
      <div className="experience-mobile-directory">
        <details ref={mobileDirectoryRef}>
          <summary>
            <span>Explore guide</span>
            <strong>{activeLabel}</strong>
          </summary>
          <nav aria-label="Experience guide sections">
            {filteredSections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                aria-current={activeSection === section.id ? 'location' : undefined}
                onClick={() => {
                  if (mobileDirectoryRef.current) mobileDirectoryRef.current.open = false;
                }}
              >
                <span>{section.eyebrow.split(' / ')[0]}</span>
                {section.navLabel}
              </a>
            ))}
          </nav>
        </details>
      </div>

      <aside className="experience-directory" aria-label="Experience guide directory">
        <p className="experience-directory-label">Explore the guide</p>
        <nav aria-label="Experience guide sections">
          {filteredSections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              aria-current={activeSection === section.id ? 'location' : undefined}
            >
              <span>{section.eyebrow.split(' / ')[0]}</span>
              {section.navLabel}
            </a>
          ))}
        </nav>
        {!normalizedQuery && filter === 'all' && (
          <div className="experience-directory-utility">
            <span>Last southern-branch train</span>
            <strong>00:00</strong>
            <a href="#midnight-mechanic">Understand the cutoff</a>
          </div>
        )}
      </aside>

      <article className="experience-guide-content" id="guide-content">
        <div className="experience-search" role="search">
          <label htmlFor="experience-search-input">Find a place, need, or moment</label>
          <div className="experience-search-row">
            <input
              id="experience-search-input"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Try “rainy day”, “Kyoto”, or “last train”"
              autoComplete="off"
            />
            {(query || filter !== 'all') && (
              <button type="button" onClick={clearSearch}>
                Clear
              </button>
            )}
          </div>
          <div className="experience-filters" role="group" aria-label="Filter the guide">
            {FILTERS.map((item) => (
              <button
                key={item.value}
                type="button"
                className={filter === item.value ? 'is-active' : undefined}
                aria-pressed={filter === item.value}
                onClick={() => setFilter(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <p className="experience-result-count" aria-live="polite">
            {resultCount} {resultCount === 1 ? 'guide entry' : 'guide entries'}
          </p>
        </div>

        {filteredSections.length > 0 ? (
          filteredSections.map((section) => (
            <section className="experience-guide-section" id={section.id} key={section.id}>
              <header className="experience-section-header">
                <p>{section.eyebrow}</p>
                <h2>{section.title}</h2>
                <div>{section.intro}</div>
              </header>

              {section.groups.map((group) => (
                <div className="experience-group" id={group.id} key={group.id}>
                  <header className="experience-group-header">
                    <p>From the source guide · {group.sourceTitle}</p>
                    <h3>{group.title}</h3>
                    <div>{group.intro}</div>
                  </header>

                  <div className="experience-entry-list">
                    {group.entries.map((entry, index) => (
                      <article className="experience-entry" id={entry.id} key={entry.id}>
                        <div className="experience-entry-index" aria-hidden="true">
                          {String(index + 1).padStart(2, '0')}
                        </div>
                        <div className="experience-entry-main">
                          <h4>{entry.title}</h4>
                          <p className="experience-entry-dek">{entry.dek}</p>
                          <p className="experience-entry-summary">{entry.summary}</p>
                          <ul className="experience-entry-tags" aria-label="Topics">
                            {entry.tags.slice(0, 3).map((tag) => (
                              <li key={tag}>{tag}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="experience-entry-facts">
                          <p>Know before you go</p>
                          <ul>
                            {entry.facts.map((fact) => (
                              <li key={fact}>{fact}</li>
                            ))}
                          </ul>
                          {entry.note && <div className="experience-entry-note">{entry.note}</div>}
                          <span>Source guide dated {EXPERIENCE_LAST_CHECKED}</span>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          ))
        ) : (
          <div className="experience-empty">
            <p>No guide entries match that search.</p>
            <button type="button" onClick={clearSearch}>
              Show the whole guide
            </button>
          </div>
        )}
      </article>
    </div>
  );
}
