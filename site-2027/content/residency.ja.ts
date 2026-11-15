// Japanese copy for the Residency 2027 landing page. Same shape as residency.ts:
// hrefs, numbers, company names and other data are inherited; only the words are overridden.
// DRAFT TRANSLATION by Claude, 2026-11-12. Have a native speaker review before launch.
// Tone rules (see residency.ts): Japan built the path; founders learn and use it.
// Never imply anyone shapes or reforms Japanese regulation. KBIC is never a host.
import { residency, type Residency } from './residency';

export const residencyJa: Residency = {
  ...residency,

  // TODO: confirm this is the residency form (it was the Aug 2026 sprint form).
  apply: '2027年3月に応募する',
  talk: 'まずは相談する',

  seo: {
    title: 'Mirai Tech City レジデンシー｜富士山と神戸｜2027年3月',
    description:
      '日本で過ごす1か月のレジデンシー。創業初期の再生医療スタートアップが、富士山で3週間集中して取り組み、神戸で1週間の面談を行い、ティム・\u2060ドレイパー氏ら投資家を迎えるデモデイに臨みます。',
  },

  hero: {
    ...residency.hero,
    eyebrow: 'レジデンシー・2027年3月',
    sub: '創業初期の再生医療スタートアップのための、1か月のレジデンシーです。富士山のふもとで3週間集中して取り組み、神戸で1週間の面談を行い、ティム・\u2060ドレイパー氏ら投資家を迎えるデモデイに臨みます。',
    meta: ['2027年3月', '富士山 → 神戸', '再生医療'],
    // The giant Latin word "Fuji" sits behind the summit; pre is the line above it.
    pre: '1か月の舞台は',
    survey: ['3,776 m', '北緯35.3606° 東経138.7274°'],
    scrollCue: 'スクロール',
  },

  legend: {
    eyebrow: 'なぜ富士山か',
    headline: '富士山には、不老不死を求める古い伝説が残っています',
    paragraphs: [
      '一説には、秦の始皇帝が徐福を海の向こうへ遣わし、不死の薬を探させ、徐福は日本にたどり着いたと伝えられています。',
      '日本最古の物語ともいわれる竹取物語では、帝が不死の薬を、天にもっとも近い山である富士山の頂で燃やさせます。山の名を「不死（ふし）」に由来するとする言い伝えもあります。',
      '3月、私たちは再生医療という実際の課題に取り組む創業者を、この山にお迎えします。',
    ],
  },

  mission: {
    eyebrow: '私たちについて',
    big: '1万',
    unit: 'の治療法',
    headline: '1万の治療法',
    body: [
      'Mirai Tech City は、最先端のバイオテクノロジーのためのコミュニティです。どう事業として形にし、どう安全に、早く患者さんに届けるかを一緒に考えます。',
      '希少疾患は1万種類以上あります。私たちの目標は、このコミュニティを通じて1万の治療法を届けることです。',
      '日本の「再生医療等の安全性の確保等に関する法律」（再生医療等安全性確保法、ASRM）は、再生医療がヒトを対象とした最初の臨床研究に進むための、明確で安全な道筋を示しています。私たちは、創業者がその仕組みを学び、活用できるよう支援します。',
      '神戸大学と連携しており、日本のバイオ分野に幅広いネットワークがあります。',
    ],
  },

  receive: {
    eyebrow: 'プログラム',
    headline: '4週間で得られるもの',
    items: [
      { ...residency.receive.items[0], title: 'ASRMワークショップ', body: 'ASRMが日本でどのように運用されているか、ASRMに基づく研究計画をどう作成し提出するかを学ぶワークショップです。' },
      { ...residency.receive.items[1], title: '投資家に示せる数字', body: 'ユニットエコノミクスと財務計画を、投資家に示せる水準まで磨き上げます。' },
      { ...residency.receive.items[2], title: '面談の手配', body: '日本で会いたい人や組織を整理します。最終週には、面談を私たちが手配します。' },
      { ...residency.receive.items[3], title: 'Pitch Fight Club', body: '自社の紹介の仕方とスタートアップの基本を学び、ピッチ練習を何度も繰り返します。' },
    ],
  },

  month: {
    eyebrow: '1か月の流れ',
    headline: '3週間の集中、1週間の面談。',
    stages: [
      { ...residency.month.stages[0], when: '第1〜3週', place: '富士山', title: '集中して取り組む', body: '富士山のふもとで共に暮らし、共に働きます。自社の事業、日本での展開計画、ワークショップ、ピッチ練習に取り組みます。' },
      { ...residency.month.stages[1], when: '第4週', place: '神戸', title: '面談', body: '神戸医療産業都市に移り、事前に整理した相手との面談を行います。面談は私たちが手配します。' },
      { ...residency.month.stages[2], when: '月末', place: '神戸', title: 'デモデイ', body: 'ティム・\u2060ドレイパー氏ら投資家の前でピッチを行います。' },
    ],
  },

  kobe: {
    eyebrow: '第4週・神戸',
    headline: '最終週：神戸で面談、そしてデモデイ',
    meetings: {
      place: 'ポートアイランド・神戸医療産業都市',
      title: '面談',
      body: '日本最大級のバイオメディカルクラスターである、ポートアイランドの神戸医療産業都市に移ります。最初の3週間で整理した相手との面談を、私たちが手配します。',
    },
    demo: {
      place: '六甲アイランド・神戸ファッション美術館',
      title: 'デモデイ',
      body: '1か月の締めくくりは、神戸ファッション美術館のオルビスホールでのデモデイです。UFOのような形をしたこの建物で、2026年10月にCohort 0がピッチを行いました。ティム・\u2060ドレイパー氏ら投資家の前でピッチを行います。',
    },
    venue: { name: '神戸ファッション美術館', nickname: 'UFOの建物', hall: 'オルビスホール', island: '六甲アイランド' },
    route: 'ポートアイランド → 六甲アイランド',
    investors: 'ティム・\u2060ドレイパー氏ら投資家が参加',
    mark: '舞台',
  },

  fit: {
    ...residency.fit,
    eyebrow: '対象',
    headline: '創業初期の再生医療',
    body: 'このレジデンシーは、再生医療に直接取り組む、またはそれを支える分野で活動する、創業初期のスタートアップが対象です。',
    yes: ['再生医療に直接取り組んでいる', '再生医療に必要なツール、機器、データ、サービスを開発している'],
    // TODO: cohort size, price/terms and exact dates are not confirmed. Do not state them.
  },

  cohort0: {
    ...residency.cohort0,
    eyebrow: 'Cohort 0・神戸・2026年10月',
    headline: '7社が来日し、5社が日本での拠点づくりを進めています',
    lead: '7社が、初めて日本でのビジネスに取り組みました。うち5社は現在、日本に恒久的な拠点を設ける準備を進めています。Antlerの支援対象となった企業、GlobalDealから現物支援を受けた企業もあり、全社が日本で新たなパートナーシップを築きました。',
    stats: [
      { value: '7', label: '日本に初めて進出した企業' },
      { value: '5', label: '恒久的な拠点を準備中' },
      { value: '150+', label: '参加者' },
      { value: '76', label: '登壇者' },
      { value: '17', label: 'デモデイ登壇チーム' },
    ],
    companiesLabel: '日本に恒久的な拠点を準備中',
    note: '各社の計画は進行中です（2026年11月時点）。',
    filmCaption: 'デモデイ・神戸・2026年10月26日',
    filmLabel: '2026年デモデイの映像：登壇するチーム、笑顔の観客、集合写真に収まるCohort 0の参加者。',
    network: '名の登壇者（2026年、神戸大学からハーバード大学まで）',
  },

  life: {
    eyebrow: '日本での暮らし',
    headline: '資金調達に至らなくても、日本での1か月は充実します',
    lead: '神戸で過ごしたCohort 0の実際の写真です。食事、ラボ、旅、そして人々。',
  },

  voices: {
    ...residency.voices,
    eyebrow: '参加者の声',
    headline: 'Cohort 0より',
    // TODO: testimonials are being collected.
  },

  final: {
    eyebrow: 'レジデンシー・2027年3月',
    headline: '次のコホートへ',
    body: '創業初期の再生医療スタートアップの応募を受け付けています。',
  },

  nav: [
    { href: '/jp#program', label: 'プログラム' },
    { href: '/jp#month', label: '1か月の流れ' },
    { href: '/jp#cohort-0', label: 'Cohort 0' },
    { href: '/blog', label: 'ブログ' },
  ],
  navCta: '応募する',
  home: '/jp',
  langSwitch: { href: '/', label: 'English', lang: 'en' },
  footerLine: 'レジデンシー・2027年3月・富士山 → 神戸',
  newTab: '（新しいタブで開きます）',
  fujiAlt: '静かな湖の向こうに見える、朝日の富士山',
  photoText: {
    // Kobe week + Demo Day (content/photos-kobe.json)
    'ufo-exterior-night-01': { alt: '夜、木々の間から見上げる、ライトアップされた神戸ファッション美術館のUFOのような入口。', caption: 'デモデイの夜の神戸ファッション美術館（六甲アイランド）。' },
    'ufo-exterior-day-01': { alt: '広い石段の上にそびえる、神戸ファッション美術館の白いUFOのような入口。', caption: '六甲アイランドの神戸ファッション美術館の入口。' },
    'ufo-exterior-night-02': { alt: '夜、濡れた広場と照らされた木々の上に輝く神戸ファッション美術館のUFO。', caption: '' },
    'ufo-banner-01': { alt: '会場の入口ホールに立つ、Mirai Tech City Kobe 2026のウェルカムバナー。', caption: '会場入口のウェルカムバナー：サミットI、サミットII、デモデイ。' },
    'orbis-hall-interior-01': { alt: '開場前の神戸ファッション美術館オルビスホール。ステージとスクリーンに向かう階段状の客席。', caption: '' },
    'orbis-hall-interior-02': { alt: 'オルビスホールのステージ。スクリーンにサミットIIのスライド、横にMirai Tech Cityのバナースタンド。', caption: '' },
    'lab-supercomputer-01': { alt: '暗い大きなホールで、ガラス越しに並ぶコンピューターの筐体。', caption: 'Cohort 0のラボ見学（2026年10月）。' },
    'ufo-loop': { alt: '夜の神戸ファッション美術館のUFOの映像。', caption: '' },
    'people-group-night-street-01': { alt: '夜の通りで寄り添い、カメラに笑顔を向ける大勢のグループ。', caption: '' },
    'meal-pub-01': { alt: '木の内装のパブで丸いテーブルを囲み、笑い合うグループ。', caption: 'みんなで夕食。' },
    'meal-long-table-01': { alt: '曲線の壁のレストランで、長いテーブルを囲んで食事と会話を楽しむ人々。', caption: '長いテーブルで夕食。' },
    'people-group-station-01': { alt: '曲線を描く大きな近代的な建物の中に並んで立つ4人。', caption: '' },
    'people-friends-hike-01': { alt: '木々に囲まれた丘の上の山道で、笑顔で立つ5人。', caption: '丘をハイキング。' },
    'people-friends-travel-01': { alt: 'スーツケースを持ち、駅のホームで笑顔で親指を立てる4人。', caption: '神戸に到着。' },
    'japan-forest-bridge-01': { alt: '緑の渓谷にかかる赤い手すりの橋を、一人が歩いていく。', caption: '' },
    'people-group-house-01': { alt: '明るい部屋に集まり、カメラに向かって笑顔で手を振る仲間たち。', caption: '家に全員集合。' },
    'meal-hibachi-01': { alt: '長い鉄板焼きのカウンターで、笑顔で親指を立てる2人。', caption: '鉄板焼きの夜。' },
    'japan-ropeway-01': { alt: '街と海を見下ろす山の斜面の上を進むロープウェイ。写真を撮る人。', caption: '' },
    'meal-wagyu-01': { alt: '鉄板の上に並んだ、霜降りの和牛。', caption: '和牛の夜。' },
    'japan-osaka-street-01': { alt: '提灯と看板が並ぶ夜のアーケード街。遠くに明かりのともる塔。', caption: '' },
    'japan-kyoto-shrine-01': { alt: '淡い空の下、緑の瓦屋根と松に囲まれた大きな朱色の門。', caption: '' },
    'people-group-kyoto-01': { alt: '大きな朱色の門の前で笑顔を見せる3人。1人が手を振っている。', caption: '京都への日帰り旅行。' },
    'people-group-laughing-01': { alt: 'ガラス張りの壁の前、木の床に集まった約20人。全員が笑顔。', caption: '全員で。' },
    'people-group-neon-street-01': { alt: '夜の街のネオン看板の前で、笑顔で両手を上げる3人。', caption: '夜の街へ。' },
    'japan-kobe-harbor-01': { alt: '船が停泊する港と長い海岸線。背後に山と青空。', caption: '' },
    'lab-surgical-robot-01': { alt: '病院のような研究施設で、手術支援ロボットのアームを囲む見学者。', caption: 'ラボ見学。' },
    'demo-day-pitch-01': { alt: '暗いステージで、赤いだるまの横に立ち発表するスーツ姿の登壇者。', caption: '' },
    'demo-day-pitch-02': { alt: '暗いステージで、大きな赤いだるまの横でマイクを持つスーツ姿の登壇者。', caption: '' },
  },
  marks: { program: 'みらい', month: 'ふじ', kobe: 'ぶたい', cohort: 'じっせき', life: 'くらし', apply: 'おうぼ' },
  ui: { source: '出典', primaryNav: 'メイン', footerNav: 'フッター', menu: 'メニュー', close: '閉じる', play: '再生', pause: '一時停止', rss: 'RSS' },

  credits: '富士山と精進湖の朝日（撮影：hogeasdf、CC BY 2.0、Wikimedia Commons）。色調補正とトリミングを加えています。',
};
