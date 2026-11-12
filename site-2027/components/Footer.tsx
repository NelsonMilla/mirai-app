import Image from 'next/image';
import { site, type Copy } from '@/content/site';

export function Footer({ t = site }: { t?: Copy }) {
  const f = t.footer;
  return (
    <footer>
      <div className="see">{f.signoff}</div>
      <div className="date">{f.date}</div>
      {/* The one-eyed daruma from 2026: the second eye goes on when 2027 is announced. */}
      <Image className="daruma" src="/img/daruma.png" alt="Daruma doll" width={92} height={92} />
      <div className="doors">
        {f.links.map(l => <a key={l.href} href={l.href}>{l.label}</a>)}
      </div>
      {f.credits && <div className="credits">{f.credits}</div>}
    </footer>
  );
}
