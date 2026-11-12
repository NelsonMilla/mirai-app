import type { NextConfig } from 'next';

// Every page the 2026 static site (new-site/) served on www.miraitech.city, sent
// permanently to its closest home here, so indexed pages and inbound links keep
// working (and keep their ranking) when this site takes over the domain.
// `/:rest*` also matches the bare path and any trailing slash or subpage.
const OLD_PAGES: [string, string][] = [
  ['/experience', '/#life'],
  ['/program', '/#2026'],
  ['/conferences', '/#2026'],
  ['/summit-i', '/#2026'],
  ['/summit-ii', '/#2026'],
  ['/fashion-show', '/#2026'],
  ['/pricing', '/#2027'],
  ['/summit-bundle', '/#2027'],
  ['/startups', '/#2027'],
  ['/sponsor', '/#2027'],
  ['/stay', '/#2027'],
  ['/citizens', '/'],
  ['/conduct', '/'], // TODO: bring the code of conduct over before 2027 registration opens
  ['/jp/summit-i', '/jp'],
];

const nextConfig: NextConfig = {
  async redirects() {
    return [
      ...OLD_PAGES.map(([from, to]) => ({ source: `${from}/:rest*`, destination: to, permanent: true })),
      { source: '/mirai_oct1.ics', destination: '/', permanent: true },
    ];
  },
};

export default nextConfig;
