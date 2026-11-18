// /why-japan copy. Carried over word for word from the 2026 /conferences page (new-site), whose
// copy Nelson approved; only the 2026 ticket, speaker and pass lines were left out.
// Tone rule: Japan is the actor; founders arrive to learn the routes, never to change them.
// `fn` numbers point into `notes` (1-based).

export const whyJapan = {
  seoTitle: 'Why Japan for biotech',
  seoDescription:
    'The only developed country where a therapy can sell on Phase 1 safety data, and where the fastest route to market is the official one.',

  eyebrow: 'Why Japan',
  headline: 'Japan is the best global ecosystem for frontier biotech.',
  lead: 'The only developed country where a therapy can sell on Phase 1 safety data, and where the fastest route to market is the official one.',
  // The page's lead film (Nelson, Nov 18 2026: KBIC, more visual impact): a silent loop cut from
  // Mirai's own 4K film of the 2026 visits on Port Island. Shot list: public/media/kbic-loop.json.
  film: {
    label: 'A short silent film from Port Island in Kobe: the RIKEN computing centre, supercomputer hardware, a 3D anatomy display, a clinical training lab and a cleanroom.',
    caption: 'Port Island, Kobe · October 2026', // added plain label
  },

  routes: {
    label: 'Why Japan',
    title: 'A year to market, not a decade.',
    // Plain strings are text; { b } is bold, with an optional footnote number.
    lead: [
      'Under the ', { b: 'Act on the Safety of Regenerative Medicine', fn: 1 },
      ', a cell or gene therapy can be sold on a self-pay basis once it has Phase 1 safety data, in ', { b: 'six to twelve months' },
      '. For small molecules, biologics and devices, ', { b: 'Conditional Early Approval', fn: 2 },
      ' does the same nationally, around ', { b: 'four years ahead of the FDA' },
      '. Japan designed both routes deliberately, and founders arrive to learn them.',
    ] as (string | { b: string; fn?: number })[],
  },

  cards: [
    {
      wide: true,
      label: 'Research base',
      title: 'Nobel-winning researchers',
      body: "At Kyoto and Osaka, RIKEN's labs, purpose-built clinical clusters.",
      fact: { label: 'Conditional Early Approval', value: '4 years ahead of the FDA' },
    },
    {
      wide: true,
      img: { src: '/img/why-japan/lab-hood.webp', alt: 'A scientist at a laminar flow hood, handling culture vessels', pos: '42% 46%' },
      label: 'Where the field began',
      title: 'Japan invented iPS cells',
      body: 'The first therapies reached market here in 2026.',
      fact: { label: 'Act on the Safety of Regenerative Medicine', value: '6–12 months' },
    },
    {
      label: 'Patient follow-up',
      title: 'One national database',
      body: 'Every patient is followed for life, to a standard the FDA and EMA accept.',
    },
    {
      label: 'Health market, per year',
      figure: '$146B',
      fn: 5,
      body: '¥23.8 trillion. 3.7% of GDP, the third-largest pharmaceutical market and R&D spender in the world. Biotech R&D up 32% last year.',
    },
    {
      label: 'AMED grants match registered VC',
      figure: '2:1',
      fn: 6,
      body: 'Non-dilutive. Raise a round and the state matches it twice over.',
    },
    {
      label: 'National insurance covers',
      figure: '70–90%',
      fn: 7,
      body: 'Of what a patient pays, with a monthly cap. Patients do not wait for reimbursement decisions.',
    },
    {
      label: 'What the route returns',
      ledger: [
        { figure: '10×', label: 'To first revenue', bold: 'Faster' },
        { figure: '100×', label: 'Than the Phase 3 route', bold: 'Cheaper' },
        { figure: '+61%', label: 'From the same patent', bold: 'Commercial value' },
      ],
    },
  ],

  now: {
    label: 'The path, the standard & the demand',
    title: 'Why now.',
    entries: [
      { date: '2025', head: 'ICH E6(R3) becomes the global clinical-data standard', fn: 3 },
      {
        date: 'Feb 2026',
        head: "Biotech named one of Japan's seventeen national strategic sectors",
        bold: 'The strategy.',
        body: 'Two-thirds of the drugs approved in the US and Europe over the last decade never began development in Japan. Japan set out to change that, backed by long-term national strategy.',
      },
      {
        date: '',
        bold: 'The standard.',
        body: 'Data generated here to ICH E6(R3) can be used directly in FDA and EMA filings.',
      },
      { date: 'Jun 2026', head: 'Annex 2 adopted: real-world data counts as evidence', fn: 4 },
      {
        date: 'Oct 2026',
        bold: 'The demand.',
        body: "GLP-1s reached tens of millions of people in a few years. When approval lags, patients buy unregulated copies. MHLW's approach: safety first, then commercialization on the way to efficacy.",
      },
      { date: 'Jan 2027', head: 'Annex 2 in force in Europe; Japanese data files directly into the FDA and the EMA' },
    ],
  },

  // Added plain label (Nov 18 2026): the text link to the homepage program in the closing beat.
  programLink: 'See the program',

  notesTitle: 'Sources and notes',
  notes: [
    'Act on the Safety of Regenerative Medicine (MHLW). The route under which a cell or gene therapy is provided on a self-pay basis once Phase 1 safety data exists.',
    'Conditional Early Approval (PMDA). National approval on early evidence for small molecules, biologics and devices.',
    'ICH E6(R3), adopted in 2025 as the global standard for clinical data.',
    'ICH E6(R3) Annex 2, adopted June 2026; effective in the European Union from January 2027 (EMA).',
    'MHLW national health-expenditure statistics: ¥23.8 trillion, about $146 billion a year, 3.7% of GDP.',
    'AMED matching-fund programme: non-dilutive grants matched against registered venture capital.',
    "MHLW national health insurance: 70–90% of a patient's cost is covered, with a monthly cap.",
  ],
};
