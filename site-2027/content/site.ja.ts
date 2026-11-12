// Japanese copy for /jp. Same shape as site.ts: data (speakers, photos, links)
// is inherited from the English file; only the words are overridden here.
// DRAFT TRANSLATION by Claude, 2026-11-04 — have a native speaker review before launch.
// The blog stays English; its section on this page is labelled as such.
import { site, type Copy } from './site';

const n = site.speakers.list.length;
const photo = (i: number, alt: string) => {
  const p = site.life.items[i].photo;
  return p ? { ...p, alt } : undefined;
};

export const ja: Copy = {
  ...site,
  lang: 'ja',
  home: '/jp',
  langSwitch: { href: '/', label: 'English', lang: 'en' },
  title: 'Mirai Tech City｜神戸 2026 開催報告・2027年に再び開催',
  description:
    '2026年10月、科学者・起業家・エンジニアが神戸に1か月滞在し、長寿・医療分野の研究と事業に取り組みました。Mirai Tech City は2027年に再び開催します。',

  nav: [
    { href: '/jp#2026', label: '2026' },
    { href: '/jp#speakers', label: '登壇者' },
    { href: '/blog', label: 'ブログ' },
    { href: '/jp#2027', label: '2027' },
  ],
  navCta: '最新情報を受け取る',

  hero: {
    eyebrow: '神戸・2026年10月',
    headline: ['Mirai Tech City', '2027年に再び開催'],
    next: '次回：2027年、日本。日程と開催地は近日発表。',
    cue: '下へ：2026年に起きたこと',
    shots: [
      { ...site.hero.shots[0], place: '神戸、2026', kicker: '2026年10月1日〜31日・神戸', lines: ['31日間'] },
      { ...site.hero.shots[1], place: 'ポートアイランド、2026', kicker: '毎日', lines: ['ラボ・トーク', '夕食'] },
      { ...site.hero.shots[2], place: '登壇者、2026', kicker: '長寿と医療', lines: [`登壇者 ${n}名`] },
      { ...site.hero.shots[3], place: '京都、週末', kicker: '10月17〜18日・10月24〜25日', lines: ['サミット 2回'] },
      { ...site.hero.shots[4], place: 'ラボ、2026', kicker: '10月26日', lines: ['デモデー'] },
      { ...site.hero.shots[5], place: '日本、2027', kicker: 'Mirai Tech City', lines: ['2027年に', '再び開催'], sub: '日程と開催地は近日発表' },
    ],
    primary: '2027年の発表を受け取る',
    secondary: '2026年を振り返る',
  },

  recap: {
    ...site.recap,
    eyebrow: '数字で見る2026',
    headline: '神戸で起きたこと',
    lead: '2026年10月1日〜31日。神戸・ポートアイランドで開かれた、長寿・医療分野のための1か月限定の街。',
    stats: site.recap.stats.map((s, i) => ({ ...s, label: ['神戸での日数', 'サミット', '登壇者', '参加者', '参加国'][i] ?? s.label })),
  },

  life: {
    eyebrow: '神戸での1か月',
    headline: 'ある1日',
    lead: '朝は自分の仕事、午後はラボ、夜は街へ。週末はもう少し遠くへ。',
    items: [
      { title: '朝は集中して仕事', body: 'コワーキングで朝食をとったら、午前中は自分の時間。トークやミーティングは午後から。' },
      { title: '午後はラボへ', body: '神戸医療産業都市はポートライナーで1駅。ラボ見学、ワークショップ、ミーティング。' },
      { title: 'ポートライナーの夕暮れ', body: '港を渡って帰る道。3週目には気にならなくなる通勤です。',
        photo: photo(2, '夕暮れのポートライナー') },
      { title: '居酒屋で夕食', body: '夕方6時にはチャットで行き先が決まります。小さなカウンターで、長い会話。',
        photo: photo(3, '神戸の居酒屋のカウンター') },
      { title: '週末は京都・大阪・奈良へ', body: 'どこも電車で1時間ほど。朝はお寺、夜には神戸に戻ります。',
        photo: photo(4, '京都の紅葉') },
      { title: '日曜は有馬温泉', body: '日本最古の温泉地のひとつ。神戸から30分です。',
        photo: photo(5, '湯けむりの立つ有馬温泉') },
    ],
  },

  moments: {
    eyebrow: '1か月の流れ',
    headline: '4つの節目',
    items: [
      { ...site.moments.items[0], date: '10月1日', title: '街がひらく', body: '参加者がポートアイランドに到着し、1か月のレジデンシーが始まりました。' },
      { ...site.moments.items[1], date: '10月17〜18日', title: 'サミット I', body: '長寿科学と医療をテーマにした2日間のトークとパネル。' },
      { ...site.moments.items[2], date: '10月24〜25日', title: 'サミット II', body: '2回目のサミット週末。トークとパネル。' },
      { ...site.moments.items[3], date: '10月26日', title: 'デモデー', body: 'レジデンシーに参加したスタートアップが、1か月で作ったものを発表しました。' },
    ],
  },

  speakers: { ...site.speakers, eyebrow: '登壇者', headline: `2026年の登壇者 ${n}名`, restLabel: 'そのほかの登壇者' },
  voices: { ...site.voices, eyebrow: '参加者の声', headline: '参加した理由' },
  built: { ...site.built, eyebrow: '神戸で生まれたもの', headline: 'この1か月から生まれたもの',
    lead: '2026年10月、ポートアイランドを拠点に活動した企業とプロジェクト。' },
  latest: { eyebrow: 'ブログ（英語）', headline: '最新の記事', all: 'すべての記事' },
  photos: { ...site.photos, eyebrow: '写真', headline: '神戸、2026年10月' },

  next: {
    eyebrow: 'Mirai Tech City 2027',
    headline: '2027年に再び開催',
    lead: '2027年の日程・会場・最初の登壇者は近日発表します。メールでご連絡いただければ、いち早くお知らせします。',
    primary: '2027年の発表を受け取る',
    secondary: 'パートナーについて相談する',
  },

  footer: { ...site.footer, signoff: '2027年にお会いしましょう', date: '日程は近日発表' },
};
