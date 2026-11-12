import Image from 'next/image';
import { site, type Copy } from '@/content/site';

export function Next2027({ t = site }: { t?: Copy }) {
  const n = t.next;
  return (
    <div className="applywrap" id="2027">
      <Image className="bg" src="/img/future-city-1440.webp" alt="" aria-hidden="true" fill sizes="100vw" />
      <div className="veil" />
      <section className="apply">
        <p className="eyebrow rv">{n.eyebrow}</p>
        <h2 className="rv">{n.headline}</h2>
        <p className="sub rv">{n.lead}</p>
        <div className="row rv">
          <a className="btn accent" href={t.notifyHref}>{n.primary}</a>
          <a className="btn ghost" href={t.partnerHref}>{n.secondary}</a>
        </div>
      </section>
    </div>
  );
}
