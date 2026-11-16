# Residency 2027 landing page: English copy

Every piece of English text on the homepage (`/`), in page order. Edit the quoted
text (the lines starting with `>`), then ask Claude to put it into the site.

- Leave the `grey keys` alone. They say where each line lives in
  `content/residency.ts`, so the edits can be carried over exactly.
- *Italic notes* explain how the page lays a line out (where it breaks, how
  big it is). Break the rule and the layout still works, but may look off.
- Changing the English does not change the Japanese page (`/jp`). Claude will
  list the Japanese lines that need a matching update.
- House rules still apply: plain, literal copy; Japan built the path (ASRM) and
  founders learn and use it; KBIC is never a "host"; no invented dates, prices,
  cohort sizes or outcomes.

---

## Browser tab and search results

**Page title** `seo.title`
> Mirai Tech City Residency · Mount Fuji and Kobe · March 2027

**Search and share description** `seo.description`
> A one-month residency in Japan for early-stage regenerative medicine startups: three weeks of focused work at Mount Fuji, a week of meetings in Kobe, and a Demo Day with investors including Tim Draper.

---

## Buttons and links (used all over the page)

**Main button** `apply`
> Apply for March 2027

**Main button links to** `applyHref` *(not confirmed: this is still the August 2026 sprint form)*
> https://form.typeform.com/to/sG9eS2Ok

**Second link** `talk`
> Talk to us first

**Second link goes to** `talkHref`
> https://calendly.com/nelson-frontierhumans/mtc-acceleration-sprint

---

## Header

**Line under "Mirai Tech City"** `hero.eyebrow` *(the same text is the eyebrow in the opening)*
> Residency · March 2027

**Menu links** `nav`
> - Program
> - The month
> - Cohort 0
> - Blog

**Header button** `navCta` *(short: it sits in the top bar)*
> Apply

**Skip link** (keyboard users only) `app/(en)/page.tsx`
> See the program

---

## 1 · Opening

**Eyebrow** `hero.eyebrow` *(see Header above)*

**Headline, small line** `hero.pre`
> Build Your Biotech Startup in

**Headline, giant word** `hero.word` *(set huge behind the summit, sized to fit the screen: one word; the shorter it is, the bigger it gets)*
> Japan

**Intro** `hero.sub` *(the first sentence is set large; the rest is smaller under it)*
> A one-month residency for early-stage regenerative medicine startups. Three weeks of focused work at the foot of Mount Fuji, one week of meetings in Kobe, and a Demo Day with investors including Tim Draper.

**Survey marks on the mountain** `hero.survey`
> - 3,776 m
> - 35.3606° N 138.7274° E

**Seal** `hero.kanji`
> 不死

**Scroll cue** `hero.scrollCue`
> Scroll

### Why Fuji (the legend, still inside the opening)

**Eyebrow** `legend.eyebrow`
> Why Fuji

**Headline** `legend.headline`
> Fuji's oldest legends are about the search for eternal life

**Paragraphs** `legend.paragraphs`
> The first emperor of China sent Xu Fu across the sea to find the elixir of immortality, and he landed in Japan.
>
> In The Tale of the Bamboo Cutter, often called the oldest Japanese story, an emperor has the elixir of life burned on the summit of Mount Fuji, the mountain closest to heaven. One popular reading of the name is 不死, fushi: without death.
>
> We are bringing founders who are working on the real thing to the mountain.

**Photo credit** `credits` *(required by the photo's licence: keep the author and CC BY 2.0)*
> Mt. Fuji and Lake Shojiko at sunrise, by hogeasdf, CC BY 2.0, via Wikimedia Commons. Colour graded and cropped.

---

## 2 · Program (未来)

**Chapter mark reading** `marks.program`
> Mirai

**Eyebrow** `mission.eyebrow`
> Who we are

**Number and word: the gold phrase** `mission.big` + `mission.unit` *(not shown on its own: together they are the section's heading for screen readers and search, and the words that turn gold inside the first paragraph below, so that paragraph must contain "10,000 cures" exactly)*
> 10,000
>
> cures

**The four paragraphs, in page order** *(all four are set large, at one size. The first is the headline, always lit, and its second sentence starts a new line; the others brighten as you read them. The keys say where each one lives)*
> - `mission.body[1]` There are more than 10,000 rare diseases. Our goal is 10,000 cures, shipped through our community.
> - `mission.body[0]` Mirai Tech City is a community for frontier biotech: how to build it, and how to bring it to patients fast and safely.
> - `mission.body[2]` Japan's Act on the Safety of Regenerative Medicine (ASRM) gives regenerative medicine a clear, safe path to first-in-human studies. We help founders learn it and use it.
> - `mission.body[3]` We work with Kobe University and have a wide network across Japanese biotech.

**Eyebrow** `receive.eyebrow`
> The program

**Headline** `receive.headline`
> What you get in four weeks

**The four items** `receive.items` *(each has a number, a kanji, a title and one or two sentences)*
> **01 · 法 · ASRM workshops**
> Workshops on how ASRM works in Japan and how to write and submit an ASRM research proposal.
>
> **02 · 数 · Investable numbers**
> Polish your unit economics and financials until they are ready for investors.
>
> **03 · 縁 · Meetings arranged for you**
> Map the people and organizations you want to meet in Japan. In the last week, we arrange the meetings.
>
> **04 · 闘 · Pitch Fight Club**
> Learn to pitch your company and the startup basics, then pitch again, and again.

---

## 3 · The month (富士)

**Chapter mark reading** `marks.month`
> Fuji

**Eyebrow** `month.eyebrow`
> The month

**Headline** `month.headline` *(breaks into two lines after the first full stop)*
> Three weeks of focus. One week of meetings.

**The three stages** `month.stages` *(when · place · title, then one or two sentences)*
> **Weeks 1–3 · Mount Fuji · Deep work**
> Live and work together at the foot of the mountain: your company, your Japan landing plan, workshops and pitch practice.
>
> **Week 4 · Kobe · Meetings**
> Move to the Kobe Biomedical Innovation Cluster for the meetings we arrange with the stakeholders you mapped.
>
> **End of the month · Kobe · Demo Day**
> Pitch to investors, including Tim Draper.

**Photo caption, Kobe stage** `photoText.lab-surgical-robot-01`
> Lab visit.

---

## 4 · Kobe: the last week and Demo Day (舞台)

**Chapter mark reading** `marks.kobe`
> The stage

**Eyebrow** `kobe.eyebrow`
> Week 4 · Kobe

**Headline** `kobe.headline` *(breaks into two lines after the colon)*
> The last week: meetings + Demo Day

**Meetings, place** `kobe.meetings.place` *(the map label at the meetings stop; island names on the map come from the route line below)*
> Kobe Biomedical Innovation Cluster

**Meetings, title** `kobe.meetings.title`
> Meetings

**Meetings, text** `kobe.meetings.body`
> Move into the Kobe Biomedical Innovation Cluster on Port Island, Japan's largest biomedical cluster. We arrange meetings with the people and organizations you mapped in the first three weeks.

**Photo caption, meetings** `photoText.lab-supercomputer-01`
> Fugaku supercomputer during Cohort 0, October 2026.

**Demo Day, place** `kobe.demo.place` *(the part after "·" is the map label at the Demo Day stop)*
> Rokko Island · Kobe Fashion Museum

**Demo Day, title** `kobe.demo.title`
> Demo Day

**Demo Day, text** `kobe.demo.body`
> The month ends on stage in Orbis Hall, inside the Kobe Fashion Museum, the UFO-shaped building where Cohort 0 pitched in October 2026. You pitch to investors, including Tim Draper.

**Photo caption, the museum by day** `photoText.ufo-exterior-day-01`
> The Kobe Fashion Museum entrance on Rokko Island.

**Over the night video: nickname · hall** `kobe.venue.nickname` · `kobe.venue.hall`
> The UFO building · Orbis Hall

**Over the night video: investors line** `kobe.investors`
> Investors including Tim Draper

**Map: route label** `kobe.route`
> Port Island → Rokko Island

---

## 5 · Cohort 0 (実績)

**Chapter mark reading** `marks.cohort`
> Jisseki

**Eyebrow** `cohort0.eyebrow`
> Cohort 0 · Kobe, October 2026

**Headline** `cohort0.headline`
> Five out of seven are building a base in Japan.

**Paragraph** `cohort0.lead` *(the GlobalDeal wording needs Karen's sign-off)*
> Seven companies came to do business in Japan for the first time. Five are now working to establish a permanent presence here. Some were picked up by Antler, others received in-kind support from GlobalDeal, and every one of them made new partnerships in Japan.

**Numbers** `cohort0.stats` *(number · label)*
> - 7 · First-time Japan entrants
> - 5 · Establishing a permanent presence
> - 150+ · Attendees
> - 76 · Speakers
> - 17 · Demo Day teams

**The five companies** `cohort0.companies`
> - Avenyx Bio
> - aeon.science
> - Cingularity
> - Muse Bio
> - Probabilistic Bio

**Label over the company list** `cohort0.companiesLabel`
> Establishing a permanent presence in Japan

**Small note under the list** `cohort0.note`
> Company plans in progress, November 2026.

**Video caption** `cohort0.filmCaption`
> Demo Day · Kobe · Oct 26 2026

**Speaker line** `cohort0.network` *(the page puts the speaker count in front: "76 speakers in 2026, …". Only name institutions whose speakers are in the face strip)*
> speakers in 2026, from Kobe University to Harvard

The eight speaker names in the face strip come from `content/speakers-2026.json`, not from this file.

---

## 6 · Life in Japan (暮らし)

**Chapter mark reading** `marks.life`
> Kurashi · Daily life

**Eyebrow** `life.eyebrow`
> Life in Japan

**Headline** `life.headline` *(breaks into two lines after the comma)*
> Come to build your company, stay for the great people

**Paragraph** `life.lead`
> Real photos from Cohort 0 in Kobe: the dinners, the labs, the trips, the people.

**Photo captions, in page order** `photoText.<photo>`
> - `meal-pub-01` Dinner with the group.
> - `people-friends-travel-01` Arriving in Kobe.
> - `meal-long-table-01` Dinner at a long table.
> - `meal-wagyu-01` Wagyu night.
> - `people-group-neon-street-01` Night out in the city.
> - `people-group-laughing-01` Everyone together.
> - `people-friends-hike-01` A hike in the hills.
> - `meal-hibachi-01` Teppanyaki night.

---

## 7 · In their words

The section is hidden when there are no testimonials. One quote runs full width;
two or more sit in two columns.

**Eyebrow** `voices.eyebrow`
> In their words

**Headline** `voices.headline`
> From Cohort 0

**Testimonials** `voices.items` *(copy the template once per quote)*
> **Quote:** Thanks to you at Mirai Tech City, I toured Nobel laureate Yamanaka's lab and was introduced to many brilliant scientists.
> **Name:** Max Koko
> **Role:** CEO, Founder
> **Company:** Probabilistic Bio
>
> **Quote:**
> **Name:**
> **Role:**
> **Company:**

---

## 8 · Apply (応募)

**Chapter mark reading** `marks.apply`
> Ōbo · Apply

**Eyebrow** `fit.eyebrow`
> Who it is for

**Headline** `fit.headline`
> Early-stage regenerative medicine

**Paragraph** `fit.body`
> The residency is for early-stage startups working directly on regenerative medicine, or in a field that supports it.

**Two fit lines** `fit.yes`
> - Working directly on regenerative medicine
> - Building tools, devices, data or services that regenerative medicine depends on

**Eyebrow, final call** `final.eyebrow`
> Residency · March 2027

**Headline, final call** `final.headline` *(set very large: keep it short)*
> Join the next cohort

**Paragraph, final call** `final.body`
> Applications are open for early-stage regenerative medicine startups.

---

## Footer

**Line under "Mirai Tech City"** `footerLine`
> Residency · March 2027 · Mount Fuji → Kobe

**Contact email** `components/SiteFooter.tsx`
> team@miraitech.city

The footer links repeat the menu links, plus RSS and 日本語. The photo credit repeats `credits`.

---

## Text for screen readers (not visible on the page)

Alt text describes what a photo shows, for people who can't see it. Keep it
literal: what is in the frame, no story.

**Fuji photo** `fujiAlt`
> Mount Fuji at sunrise, across a still lake

**Month, Kobe harbor** `photoText.japan-kobe-harbor-01`
> A harbor with ships and a long waterfront, mountains and a blue sky with streaky clouds.

**Month, lab visit** `photoText.lab-surgical-robot-01`
> Visitors standing around a robotic surgical arm over a draped table in a hospital-style lab.

**Month, Demo Day** `photoText.demo-day-pitch-02`
> A speaker in a suit holding a microphone on a dark stage beside a large red daruma doll.

**Kobe, meetings photo** `photoText.lab-supercomputer-01`
> Rows of computer cabinets behind a glass wall in a large dark hall.

**Kobe, museum by day** `photoText.ufo-exterior-day-01`
> The white saucer-shaped entrance of the Kobe Fashion Museum above a wide stone staircase.

**Kobe, night video** `photoText.ufo-loop`
> The Kobe Fashion Museum saucer glowing above a wet plaza with lit trees at night.

**Cohort 0, Demo Day video** `cohort0.filmLabel`
> Demo Day 2026 footage: teams on stage, the audience laughing, the cohort gathering for a group photo.

**Life photos** `photoText.<photo>`
> - `meal-pub-01` A group seated around a round table in a wood-panelled pub, laughing, with one person cheering.
> - `people-friends-travel-01` Four people smiling and giving thumbs up on a station platform with luggage.
> - `meal-long-table-01` A long dinner table of people talking and eating in a curved-wall restaurant.
> - `meal-wagyu-01` A metal tray of raw marbled wagyu beef cuts on a griddle.
> - `people-group-neon-street-01` Three smiling people with arms raised in front of bright neon billboards on a night street.
> - `people-group-laughing-01` About twenty people posed on a wooden floor in front of a glass wall, one person lying on the floor, all smiling.
> - `people-friends-hike-01` Five people standing and smiling on a wooded hilltop trail.
> - `meal-hibachi-01` Two smiling diners giving a thumbs up at a long hibachi counter.

**Apply, closing photo** `photoText.people-group-night-street-01`
> A large group posing close together on a night street, smiling at the camera.

**Small labels** `ui`, `newTab`
> - Opens a new tab: (opens in a new tab)
> - Menu button: Menu
> - Close button: Close
> - Video buttons: Play / Pause
> - Credit link: Source
> - Feed link: RSS
> - Menu names: Primary / Footer
