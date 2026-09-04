export type ExperienceEntry = {
  id: string;
  title: string;
  dek: string;
  summary: string;
  facts: string[];
  note?: string;
  tags: string[];
};

export type ExperienceGroup = {
  id: string;
  title: string;
  sourceTitle: string;
  intro: string;
  entries: ExperienceEntry[];
};

export type ExperienceSection = {
  id: string;
  navLabel: string;
  eyebrow: string;
  title: string;
  intro: string;
  groups: ExperienceGroup[];
};

export const EXPERIENCE_LAST_CHECKED = "August 2026";

export const EXPERIENCE_SECTIONS: ExperienceSection[] = [
  {
    id: "island",
    navLabel: "Start here",
    eyebrow: "00 / Your base",
    title: "Start with the island.",
    intro:
      "Every route starts on Port Island. Learn the small machine that moves you between the labs, the harbor, and the rest of Kansai, and the whole month becomes legible.",
    groups: [
      {
        id: "port-island",
        title: "Port Island",
        sourceTitle: "Port Island",
        intro:
          "An 8.33-square-kilometre engineered island built between 1966 and 2009, now home to the Kobe Biomedical Innovation Cluster and your address for October.",
        entries: [
          {
            id: "port-liner",
            title: "The Port Liner",
            dek: "The front seat is still up for grabs.",
            summary:
              "Kobe's automated harbor train is your daily spine. Airport-bound and loop trains share the line before splitting, so check the destination board—especially late at night.",
            facts: [
              "Shimin Hiroba ↔ Sannomiya: about 10 min / ¥250.",
              "Sannomiya ↔ Kobe Airport: 18 min / ¥340 for the full line.",
              "All-day pass: ¥710. ICOCA and other major IC cards work.",
              "First departure from Sannomiya: 05:40. See the late-train guide before a night out.",
            ],
            tags: ["transit", "essential", "port island"],
          },
          {
            id: "research-island",
            title: "Life on a man-made research island",
            dek: "Labs by day. Sannomiya after six.",
            summary:
              "RIKEN's Kobe campus and Fugaku sit among a cluster of roughly 370 member organisations and more than 12,400 people. The island is purpose-built and quiet after work; treat Sannomiya as your high street for supermarkets, pharmacies, and evenings out.",
            facts: [
              "KBIC context: 17 lab spaces and 8 specialised hospitals.",
              "Sannomiya is about 10 minutes from Shimin Hiroba on the Port Liner.",
              "IKEA sits on the loop branch at Minami Koen, useful for its restaurant and food market too.",
            ],
            tags: ["essential", "work", "port island"],
          },
          {
            id: "sports-center",
            title: "Kobe Port Island Sports Center",
            dek: "The cheapest recovery protocol on the island.",
            summary:
              "October falls between the complex's summer 50-metre pool and winter ice-rink seasons, but the five-lane heated 25-metre pool runs year-round under a glass dome.",
            facts: [
              "Near Shimin Hiroba Station.",
              "Adults: ¥650; ¥500 after 18:00. Children: ¥300.",
              "Closed Wednesdays and on some competition days. Bring a swim cap.",
            ],
            tags: ["wellness", "under 2 hours", "port island"],
          },
          {
            id: "shiosai-park",
            title: "Shiosai Park",
            dek: "864 metres of shoreline aimed at Kobe's skyline.",
            summary:
              "The island's western promenade faces the harbor lights and Mount Rokko, with a lit BE KOBE monument and a preserved piece of the machinery that helped turn mountain into land. It is the closest place to clear your head between sessions.",
            facts: [
              "Free and always open; no gate.",
              "About 700 m from Naka Koen or 900 m from Minatojima Station.",
              "Best at dusk—or at first light when jet lag gets there first.",
            ],
            tags: ["free", "nature", "under 2 hours", "port island"],
          },
          {
            id: "animal-kingdom",
            title: "Kobe Animal Kingdom",
            dek: "A rainy-day greenhouse zoo beside a supercomputer.",
            summary:
              "Much of the park sits indoors beneath flowering canopies, with capybaras, free-flight birds, otters, lemurs, and famously motionless shoebills. It is a strong reset after a week of biotech programming and equally useful for partners and families.",
            facts: [
              "Beside Keisan Kagaku Center Station; about 14 min / ¥340 from Sannomiya.",
              "Adults ¥2,400; ages 6–12 ¥1,200; ages 4–5 ¥500; 65+ ¥1,900.",
              "Typical current-season hours: 10:00–17:00. Closed days vary; check the October calendar.",
            ],
            tags: ["rainy day", "partner", "family", "port island"],
          },
          {
            id: "everyday-logistics",
            title: "Everyday logistics",
            dek: "Load the card. Carry some cash. Learn the bins.",
            summary:
              "ICOCA solves most transit and small purchases. Seven Bank ATMs accept major foreign cards, konbini fill the island's daily gaps, and an eSIM is usually simpler than pocket wifi for a month.",
            facts: [
              "Physical ICOCA: ¥2,000, including a refundable ¥500 deposit. A ¥5,000 starting balance is practical.",
              "Keep roughly ¥10,000–20,000 in cash for small restaurants and shrines.",
              "Sort rubbish at your accommodation; public bins are rare.",
              "Mobile ICOCA works well on iPhone/Apple Watch; overseas Android support is limited.",
            ],
            tags: ["essential", "money", "connectivity", "transit"],
          },
        ],
      },
    ],
  },
  {
    id: "kobe",
    navLabel: "Kobe",
    eyebrow: "01 / Mainland commute",
    title: "Kobe is not a side trip.",
    intro:
      "Ten minutes after leaving Shimin Hiroba, you are in the city's central knot. Everything here fans out from Sannomiya on foot, by bus, or by a train ride shorter than most coffee queues.",
    groups: [
      {
        id: "kobe-city",
        title: "Kobe",
        sourceTitle: "Kobe",
        intro:
          "Use a month to move beyond the postcard: the shrine behind the city's name, a deliberately broken piece of waterfront, a mountain waterfall, and Japan's great sake coast.",
        entries: [
          {
            id: "sannomiya",
            title: "Sannomiya",
            dek: "Five railways, one city centre, and a 1,200-year-old name.",
            summary:
              "JR, Hankyu, Hanshin, the municipal subway, and the Port Liner converge across a few dense blocks. Learn this station cluster in week one. Five minutes north, Ikuta Shrine explains how the shrine-supporting households called kanbe gave Kobe its name.",
            facts: [
              "From Shimin Hiroba: about 10 min / ¥250.",
              "Ikuta Shrine is a 5-minute walk north of the station; grounds are free.",
              "The Port Liner day pass pays off at ¥710 if you make several island trips.",
            ],
            tags: ["essential", "culture", "nightlife", "under 2 hours"],
          },
          {
            id: "harborland-meriken",
            title: "Harborland & Meriken Park",
            dek: "A rebuilt waterfront, except for the part left broken on purpose.",
            summary:
              "The Port of Kobe Earthquake Memorial preserves a collapsed stretch of wharf from 1995. Around it, Port Tower, the Maritime Museum, Kawasaki Good Times World, and Harborland make the classic dusk walk.",
            facts: [
              "From Sannomiya: City Loop bus ¥300 or about 20 minutes on foot.",
              "Earthquake memorial: free and always open.",
              "Port Tower: 09:00–23:00; ¥1,000 observation floors / ¥1,200 with rooftop.",
              "Maritime Museum + Kawasaki Good Times World: 10:00–18:00; ¥900; closed Mondays.",
            ],
            tags: ["culture", "evening", "under 2 hours", "waterfront"],
          },
          {
            id: "nunobiki",
            title: "Nunobiki Falls & Herb Gardens",
            dek: "A 43-metre waterfall behind a bullet-train platform.",
            summary:
              "Walk from Shin-Kobe into the Rokko mountains for four falls, then take the ropeway over roughly 75,000 plants toward a view of the harbor and Port Island.",
            facts: [
              "Port Island → Sannomiya: about 10 min / ¥250; subway to Shin-Kobe: 2 min / ¥210.",
              "Falls: free and always open; wear shoes for stone steps.",
              "Autumn ropeway/gardens: weekdays 09:30–17:00; weekends/holidays about 21:00.",
              "Round trip with gardens: ¥2,500; evening round trip after 17:00: ¥2,000.",
            ],
            tags: ["nature", "half day", "view", "kobe"],
          },
          {
            id: "nada-sake",
            title: "Nada & the Hakutsuru Museum",
            dek: "Japan's biggest sake coast keeps its old brewhouse open for free.",
            summary:
              "Nada-gogo's brewing advantage comes from mineral-rich miyamizu water, Hyogo-grown Yamada Nishiki rice, and centuries of technique. Hakutsuru's preserved Taisho-era brewhouse turns that history into an hour-long walk from rice to pressing.",
            facts: [
              "From Port Island: about 35–40 min via Sannomiya and Hanshin Sumiyoshi.",
              "Hakutsuru: 09:30–16:30, last entry 16:00; admission free.",
              "Groups under 10 do not need a reservation. Kiku-Masamune nearby is also free and closes Tuesdays.",
            ],
            tags: ["food", "culture", "half day", "free"],
          },
          {
            id: "kobe-transit-passes",
            title: "Getting around Kobe",
            dek: "ICOCA first. Passes only when the arithmetic works.",
            summary:
              "Pay per ride on an ordinary day. The exceptions are a sightseeing loop, a city-wide digital coupon, and the Port Liner day pass when repeated island trips make them worthwhile.",
            facts: [
              "City Loop: ¥300 per ride; 1-day ticket ¥800; 2-day ticket ¥1,200.",
              "Kobe Machi-meguri digital 1-day coupon: ¥1,500, including an ¥800 attraction credit.",
              "Port Liner all-day pass: ¥710.",
            ],
            tags: ["transit", "essential", "budget"],
          },
        ],
      },
    ],
  },
  {
    id: "eat-restore",
    navLabel: "Eat + restore",
    eyebrow: "02 / Appetite + recovery",
    title: "Eat well. Soak slowly.",
    intro:
      "Kobe has spent a century and a half absorbing outside tastes without losing its own. Follow the city's food logic, then take the train over Mount Rokko to water that predates the mountain town above it.",
    groups: [
      {
        id: "food",
        title: "Food",
        sourceTitle: "Food",
        intro:
          "The useful spectrum runs from a certified teppan lunch to a discounted depachika bento. A month gives you time for both.",
        entries: [
          {
            id: "kobe-beef",
            title: "Kobe beef, decoded",
            dek: "The most name-dropped steak on earth is a bureaucratic category—and lunch is the loophole.",
            summary:
              "Certified Kobe beef must satisfy Tajima bloodline, Hyogo rearing, marbling, sex, and carcass-weight rules. Look for the official certificate and bronze cow, then compare lunch and dinner menus before booking.",
            facts: [
              "The teppanyaki cluster is within a few blocks of Sannomiya Station.",
              "Steakland Kobe-kan certified lunch: 150 g with sides for ¥3,500, 11:00–14:00.",
              "Dinner equivalent starts at ¥7,480. Verify sellers at kobe-niku.jp and use steakland-kobe.jp for that restaurant.",
            ],
            tags: ["food", "kobe", "lunch", "booking"],
          },
          {
            id: "izakaya",
            title: "Izakaya around Ikuta Shrine",
            dek: "Small plates, shared tables, and a train that stops whether you are finished or not.",
            summary:
              "Order in rounds, share dishes, and expect the small unordered tsukidashi appetizer to function as the seating charge. Standing tachinomi bars are cheaper and make meeting the person beside you easier.",
            facts: [
              "The district begins at Sannomiya and runs north toward Ikuta Shrine and west toward Motomachi.",
              "Budget ¥3,000–5,000 per person with drinks for a normal izakaya night.",
              "Groups of eight should reserve days ahead or split up.",
            ],
            tags: ["food", "nightlife", "social", "evening"],
          },
          {
            id: "nankinmachi",
            title: "Nankinmachi",
            dek: "Two streets, one plaza, and 150 years of food history.",
            summary:
              "Kobe's compact Chinatown is built for a walking lunch: steamed buns, skewers, fried snacks, and sweets sold from windows, with Daimaru's basement food hall immediately beside it.",
            facts: [
              "About a 10-minute walk southwest from Sannomiya, or 5 minutes south of Motomachi Station.",
              "Free public streets; individual shop hours vary.",
              "Go at midday rather than late evening. Most snacks cost under ¥600.",
            ],
            tags: ["food", "street food", "under 2 hours", "budget"],
          },
          {
            id: "konbini-depachika",
            title: "Konbini & depachika",
            dek: "The two ends of everyday eating.",
            summary:
              "Convenience stores cover breakfast, quick lunches, ATMs, and coffee. Department-store basement food halls turn dinner into retail theatre—and discount prepared food during the final hour.",
            facts: [
              "Kobe Hankyu food hall: near Sannomiya, 10:00–20:00.",
              "Daimaru Kobe food floors: beside Nankinmachi, 10:00–20:00.",
              "ICOCA works at most konbini tills; Seven Bank ATMs accept major foreign cards.",
            ],
            tags: ["food", "budget", "essential", "takeaway"],
          },
          {
            id: "dietary-needs",
            title: "Vegetarian & dietary needs",
            dek: "The invisible ingredient is the one to learn in Japanese.",
            summary:
              "Fish-based dashi appears in broths, sauces, and dishes with no visible meat. A saved Japanese dietary card is more reliable than improvised English; current specialist listings and attendee recommendations will age better than a printed restaurant list.",
            facts: [
              "Ask specifically about dashi, not only visible meat or fish.",
              "Konbini and depachika ingredient labels make self-catering easier.",
              "Shojin ryori at Koyasan temple lodgings is vegan by doctrine.",
            ],
            note: "For severe allergies, halal, or kosher requirements, confirm ingredients directly with the venue and share current findings in the event community.",
            tags: ["food", "vegetarian", "allergies", "essential"],
          },
        ],
      },
      {
        id: "onsen-wellness",
        title: "Onsen & wellness",
        sourceTitle: "Onsen and Wellness",
        intro:
          "Arima sits over Mount Rokko from Kobe. The two public bathhouses, free foot bath, springheads, and uphill lanes fit into a deliberate half day.",
        entries: [
          {
            id: "arima-onsen",
            title: "Arima Onsen",
            dek: "Gold water, silver water, and a 1,400-year bathing habit.",
            summary:
              "Arima's iron-and-salt kinsen oxidises rust-brown in the air; its clear ginsen is carbonated and classified locally as a radium spring. Do the town on a weekday: gold bath, foot bath, crackers, then silver bath.",
            facts: [
              "From Port Island by rail: call it about 1 hour / ¥970 each way, including the Port Liner.",
              "JR Arima Express from Sannomiya: 30 min / ¥780; the last daily return listed is 16:55.",
              "¥2,400 Yokubari ticket: round-trip bus plus admission to Kin no Yu and Gin no Yu; assigned bus seats required.",
            ],
            tags: ["wellness", "half day", "culture", "arima"],
          },
          {
            id: "kin-no-yu",
            title: "Kin no Yu",
            dek: "The air turns clear water rust-orange before it reaches the tub.",
            summary:
              "Arima's flagship public bath sits in the old town and reopened after renovation in March 2026. A free foot bath outside offers the same gold water without the full bathing ritual.",
            facts: [
              "08:00–22:00, last entry 21:30; closed 2nd and 4th Tuesdays.",
              "¥800, or ¥650 on regular weekdays. Kin + Gin combination: ¥1,200.",
              "Soap, shampoo, and dryers provided; towels are sold. Foot bath is free.",
            ],
            tags: ["wellness", "arima", "under 2 hours", "free option"],
          },
          {
            id: "gin-no-yu",
            title: "Gin no Yu",
            dek: "Clear, quietly fizzy, and best after the gold bath.",
            summary:
              "Five minutes uphill from Kin no Yu, the quieter public bath blends clear carbonated water with a spring classified locally as radioactive. Gold first and silver second is the useful order.",
            facts: [
              "09:00–21:00, last entry 20:30; closed 1st and 3rd Tuesdays.",
              "¥700, or ¥550 on regular weekdays. Two-bath ticket: ¥1,200.",
              "The men's sauna was listed as suspended for equipment failure.",
            ],
            tags: ["wellness", "arima", "under 2 hours"],
          },
          {
            id: "tattoo-guidance",
            title: "The tattoo question",
            dek: "Policies differ by bathhouse. Confirm before you travel.",
            summary:
              "Kin no Yu and Gin no Yu did not publish a tattoo ban when this guide was checked, but absence of a posted rule is not a guarantee. Large spas and ryokan may explicitly refuse tattooed guests; private reserved baths remove the communal-bath question.",
            facts: [
              "Taiko no Yu and Arima Gyoen publish tattoo prohibitions.",
              "Private kashikiri baths or in-room tubs are the most reliable workaround.",
              "Small cover stickers may be accepted at some facilities, always at staff discretion.",
            ],
            note: "Call the facility on the day. Kin no Yu: +81-78-904-0680.",
            tags: ["wellness", "tattoo", "access", "essential"],
          },
        ],
      },
    ],
  },
  {
    id: "kansai",
    navLabel: "Kansai",
    eyebrow: "03 / The wider neighbourhood",
    title: "The region is the city.",
    intro:
      "Osaka is an evening, Kyoto and Nara are day trips, Himeji is a direct run west, and Koyasan earns an overnight. Times below separate the Port Liner leg from the train leaving Sannomiya.",
    groups: [
      {
        id: "osaka",
        title: "Osaka",
        sourceTitle: "Osaka",
        intro:
          "Treat Osaka as a second neighbourhood. Three railway companies run the same corridor and deposit you in different parts of the city.",
        entries: [
          {
            id: "osaka-railways",
            title: "Three railways, one corridor",
            dek: "Choose by destination, not by brand.",
            summary:
              "JR is fastest for Umeda and onward connections. Hanshin is the cleanest route to Namba and Dotonbori. Hankyu is a slower, handsome ride into north Umeda.",
            facts: [
              "First reach Sannomiya from Shimin Hiroba: about 10 min / ¥250.",
              "JR Sannomiya → Osaka: 21–22 min / ¥420.",
              "Hankyu or Hanshin to Osaka-Umeda: about 30–31 min / ¥330.",
              "Hanshin to Osaka-Namba: roughly 40–50 min / ¥420, sometimes with an Amagasaki change.",
            ],
            tags: ["osaka", "transit", "essential"],
          },
          {
            id: "dotonbori-namba",
            title: "Dotonbori & Namba",
            dek: "Neon, takoyaki, and a moss-covered guardian one street away.",
            summary:
              "The Glico runner and giant mechanical restaurant signs deliver the expected sensory overload. Hozenji Yokocho drops the volume around Mizukake Fudo, a statue covered by decades of water and moss.",
            facts: [
              "Hanshin from Kobe-Sannomiya to Osaka-Namba: roughly 40–50 min / ¥420.",
              "Dotonbori is a few minutes north of Osaka-Namba Station.",
              "Hozenji's alley and temple forecourt are free.",
            ],
            tags: ["osaka", "food", "nightlife", "evening"],
          },
          {
            id: "namba-yasaka",
            title: "Namba Yasaka Shrine",
            dek: "A 12-metre lion head opens onto a stage.",
            summary:
              "The enormous Shishiden lion hall is said to swallow misfortune and call in victory, which keeps students and businesspeople visiting before important moments.",
            facts: [
              "About a 6-minute walk from Namba Station.",
              "Admission free. Commonly listed grounds hours are 06:00–17:00, but the shrine publishes no fixed visiting hours.",
              "Combine it with Dotonbori; they are minutes apart.",
            ],
            tags: ["osaka", "culture", "free", "under 2 hours"],
          },
          {
            id: "umeda-sky",
            title: "Umeda & the Floating Garden",
            dek: "A rooftop ring winched into the gap between two towers.",
            summary:
              "The Umeda Sky Building's 173-metre observatory gives you Osaka Bay, the Yodo River, and the city grid. Pair sunset above with dinner in Umeda's department-store basements below.",
            facts: [
              "JR Sannomiya → Osaka: 21–22 min / ¥420; Hankyu → Umeda: about 30 min / ¥330.",
              "About a 7-minute walk from Osaka Station.",
              "Observatory: 09:30–22:30, last entry 22:00; ¥2,000.",
            ],
            tags: ["osaka", "view", "evening", "under 2 hours"],
          },
          {
            id: "nakanoshima",
            title: "Nakanoshima",
            dek: "A river island moving from futures trading to future medicine.",
            summary:
              "Museums, civic architecture, and Nakanoshima Qross now share the island where the Dojima Rice Exchange helped formalise futures trading. Qross is the Osaka node of the same regenerative-medicine ecosystem you live beside in Kobe.",
            facts: [
              "Next Generation Longevity: October 15–16 at Nakanoshima Qross.",
              "From Osaka, use Fukushima, Higobashi, or Watanabebashi; the latter is about 5 minutes from Qross.",
              "Nakanoshima Museum of Art: 10:00–17:00, closed Mondays. National Museum of Art collection: ¥430.",
            ],
            tags: ["osaka", "biotech", "culture", "half day"],
          },
          {
            id: "last-trains-osaka",
            title: "Last trains back",
            dek: "The Port Liner is your leash.",
            summary:
              "The relevant deadline is where you sleep on Port Island. The final airport/medical-branch train leaves Sannomiya at 00:00; later 00:07 and 00:15 trains still serve the north loop, including Shimin Hiroba, but not the southern lab stops.",
            facts: [
              "For a southern island stop, target a central-Osaka departure around 23:15, then verify live times.",
              "For Shimin Hiroba, the last listed Sannomiya departure is 00:15.",
              "Miss the connection and take a taxi from Sannomiya; budget a few thousand yen.",
            ],
            note: "Re-confirm October timetables in a transit app before your first late Osaka night.",
            tags: ["osaka", "transit", "nightlife", "essential"],
          },
        ],
      },
      {
        id: "day-trips",
        title: "Kyoto & day trips",
        sourceTitle: "Kyoto and Day Trips",
        intro:
          "Four weekends put two former capitals, an original castle keep, an island, and a mountain monastery within reach.",
        entries: [
          {
            id: "kyoto",
            title: "Kyoto",
            dek: "Eleven centuries of capital history—and the lab that taught adult cells to forget what they were.",
            summary:
              "CiRA remains a working research institute, not a tourist stop; arrange professional visits in advance. For everyone else, October brings mild weather, thinner pre-foliage crowds, the October 22 Jidai Matsuri, and Fushimi Inari at any hour.",
            facts: [
              "Sannomiya → Kyoto by JR: about 50 min / ¥1,110 each way; add the Port Liner and transfer from your island origin. Fare marked unverified in the source; confirm.",
              "Budget Hankyu route via Juso: about 65 min / ¥640 to Kyoto-Kawaramachi. Fare marked unverified in the source; confirm.",
              "Fushimi Inari: free and always open. Jidai Matsuri route viewing is free; reserved seats start at ¥5,000.",
            ],
            tags: ["kyoto", "culture", "full day", "biotech"],
          },
          {
            id: "nara",
            title: "Nara",
            dek: "A 15-metre bronze Buddha guarded, loosely, by a thousand deer.",
            summary:
              "Todai-ji anchors the old capital with a Buddha completed in 752, while the park's sika deer have perfected bowing for crackers. Through trains make the trip possible without changing in Osaka.",
            facts: [
              "Kobe-Sannomiya → Kintetsu-Nara: about 80 min / ¥1,100 each way on direct Hanshin–Kintetsu services.",
              "Todai-ji Daibutsuden in October: 07:30–17:30; ¥800; open daily.",
              "About a 30-minute walk across the park from Kintetsu-Nara.",
            ],
            tags: ["nara", "culture", "full day", "family"],
          },
          {
            id: "himeji",
            title: "Himeji Castle",
            dek: "Four centuries, demolition orders, and air raids—zero fires in the keep.",
            summary:
              "The White Heron is Japan's largest surviving original castle keep and one of the country's first World Cultural Heritage sites. You can see it from the station and walk straight toward it.",
            facts: [
              "Sannomiya → Himeji by JR special rapid: about 40 min / ¥960 each way; add your Port Liner leg. Fare marked unverified in the source; confirm.",
              "15–20 minutes on foot from Himeji Station's north exit.",
              "October: 09:00–17:00, last entry 16:00; adults ¥2,500; under 18 free.",
            ],
            tags: ["himeji", "culture", "full day", "architecture"],
          },
          {
            id: "awaji",
            title: "Awaji Island",
            dek: "The island that supplied earth for the airport you landed on.",
            summary:
              "Tadao Ando's Yumebutai terraces an excavated hillside, the Nojima Fault museum preserves the earthquake rupture, and the Akashi Kaikyo Bridge still carries the extra metre the 1995 quake added between its towers.",
            facts: [
              "Highway bus from Sannomiya: about 50 min to Yumebutai; about 90 min / ¥2,270 to Sumoto.",
              "Yumebutai outdoor terraces: free. Green House: ¥750; 10:00–18:00.",
              "Nojima Fault museum: 09:00–17:00; ¥730. Whirlpool cruises depend on tide times.",
            ],
            tags: ["awaji", "architecture", "nature", "full day"],
          },
          {
            id: "koyasan",
            title: "Koyasan temple stay",
            dek: "Sleep in a working monastery above a lantern-lit cemetery.",
            summary:
              "An overnight shukubo stay pairs a tatami room and shojin ryori meals with an invitation to morning prayer. Walk Okunoin after dark, then return beneath the cedars in daylight.",
            facts: [
              "About 3 hours door to door from Port Island via Namba, Nankai train, and cable car.",
              "Koyasan World Heritage Ticket: ¥4,210 paper version, valid 2 consecutive days.",
              "Temple stays commonly run ¥10,000–40,000 per person with dinner and breakfast; pricing was unverified in the source, so confirm and book October weekends early.",
            ],
            tags: ["koyasan", "culture", "overnight", "vegetarian"],
          },
          {
            id: "rail-pass-question",
            title: "The rail-pass question",
            dek: "Skip the broad passes. The arithmetic does not work.",
            summary:
              "For these Kansai trips, individual fares on ICOCA usually beat the available visitor passes. The nationwide JR Pass is built for long shinkansen itineraries, not a month based in Kobe.",
            facts: [
              "Typical Sannomiya round trips: Kyoto ¥2,220 by JR / ¥1,280 by Hankyu; Nara ¥2,200; Himeji ¥1,920. Kyoto and Himeji fares were marked unverified in the source; confirm.",
              "JR West Kansai Area Pass: ¥2,800 for 1 day, only useful if you chain expensive JR trips.",
              "Exception: buy the dedicated Koyasan World Heritage Ticket for the overnight route.",
            ],
            tags: ["transit", "budget", "essential", "kansai"],
          },
        ],
      },
    ],
  },
  {
    id: "live",
    navLabel: "Live here",
    eyebrow: "04 / Build a month",
    title: "Make the month load-bearing.",
    intro:
      "A washing machine, the right train stop, and people you want to see again matter more over 31 days than a marble lobby. Choose the shape of daily life before you optimise the room.",
    groups: [
      {
        id: "where-to-stay",
        title: "Where to stay",
        sourceTitle: "Where to Stay",
        intro:
          "Week-pass visitors need zero friction. Month-long builders need a kitchen, laundry, and other humans—in roughly that order.",
        entries: [
          {
            id: "portopia-hotel",
            title: "Kobe Portopia Hotel",
            dek: "The hotel built for the island's last great invitation to the future.",
            summary:
              "The 746-room partner hotel sits at Shimin Hiroba with 13 restaurants and bars. Its Kobe Residence long-stay plan can undercut ordinary nightly hotel rates for a full month.",
            facts: [
              "Organizer block: 30 rooms at an estimated US$54–110/night; book through the event.",
              "Kobe Residence: ¥7,500 per room/night for 30–59 nights; 31 nights = ¥232,500; 1–2 guests.",
              "Cleaning Mondays and Thursdays; utility room 07:00–22:00; 30+ nights book by phone: +81-78-302-1122.",
              "Free hotel shuttles serve Sannomiya and Shin-Kobe but end before the last trains.",
            ],
            tags: ["stay", "hotel", "port island", "month"],
          },
          {
            id: "event-housing",
            title: "Event shared housing",
            dek: "Four houses, one organiser route, no public addresses.",
            summary:
              "The Sanctuary, Biopunk House, Aevitas, and ZuCity Japan follow the hacker-house pattern: shared rooms, kitchens, and colleagues. The Sanctuary is tied to the Residency track and its lab and regulatory access.",
            facts: [
              "Prices, addresses, and availability come directly from the organizers.",
              "Ask through registration as early as possible; these are not listed on hotel platforms.",
              "The Sanctuary residency starts from the event's current Residency-track price; confirm on Luma.",
            ],
            tags: ["stay", "community", "month", "booking"],
          },
          {
            id: "monthly-apartments",
            title: "Airbnb & monthly apartments",
            dek: "For 31 days, a washing machine beats a concierge.",
            summary:
              "Chuo-ku covers both Sannomiya and Port Island. Sannomiya trades a short commute for a neighbourhood that stays awake; Port Island wins on proximity and loses on evening life.",
            facts: [
              "Price against the Portopia Residence benchmark of ¥7,500 per room/night.",
              "Check exact 28+ night dates for automatic monthly discounts.",
              "October 10–12 is a domestic three-day weekend; book that arrival window early.",
              "Find housemates in the event community before booking a two-bedroom split.",
            ],
            tags: ["stay", "apartment", "month", "sannomiya"],
          },
          {
            id: "which-bed",
            title: "Which bed are you?",
            dek: "Choose by how you will use the month.",
            summary:
              "Week-pass professionals should minimise transit and booking friction. Month-long builders should prioritise community, a real kitchen, and laundry. A partner joining for the closing stretch may make a hotel or larger apartment the better compromise.",
            facts: [
              "Week pass: Portopia block or any hotel near a Port Liner station.",
              "Full month: event house, shared Sannomiya apartment, or Kobe Residence.",
              "Do not choose a southern island stop without checking the midnight branch cutoff.",
            ],
            tags: ["stay", "planning", "partner", "essential"],
          },
        ],
      },
      {
        id: "social-work",
        title: "Social life & work",
        sourceTitle: "Social Life and Where to Work",
        intro:
          "The island goes home at six. Your social life runs on the event and Sannomiya; reliable drop-in coworking lives across the bridge too.",
        entries: [
          {
            id: "sannomiya-social",
            title: "The Sannomiya izakaya grid",
            dek: "A month is long enough to become a regular.",
            summary:
              "Higashimon-gai and the streets around Ikuta Shrine stack tiny bars and izakaya floor by floor. Standing tachinomi counters are the lowest-friction rooms for meeting people outside your own group.",
            facts: [
              "About 10 min / ¥250 from Shimin Hiroba.",
              "Many small venues are cash-only. Normal izakaya budget: ¥3,000–5,000 per head.",
              "Higashimon-gai runs much later than the trains; plan your return before ordering another round.",
            ],
            tags: ["social", "nightlife", "sannomiya", "food"],
          },
          {
            id: "midnight-mechanic",
            title: "The midnight mechanic",
            dek: "Learn your branch in week one.",
            summary:
              "All late Port Liner trains call at Shimin Hiroba, but only airport-bound trains continue to Iryo Center and the southern lab stops. Your accommodation determines whether midnight or 00:15 is the real deadline.",
            facts: [
              "Southern branch departures listed late at night: 23:00, 23:15, then 00:00—the last.",
              "The 00:15 dock-bound train still reaches Shimin Hiroba around 00:25.",
              "First train from Sannomiya: 05:40. Taxis cover the bridge all night.",
            ],
            note: "Timetables change seasonally. Re-check the operator schedule for October.",
            tags: ["essential", "transit", "nightlife", "port island"],
          },
          {
            id: "dinner-for-eight",
            title: "Booking dinner for eight",
            dek: "A Friday walk-in party of eight fails.",
            summary:
              "Reserve days ahead, give an exact headcount, and call if plans change. A course with two-hour nomihodai turns the bill into one predictable per-person number.",
            facts: [
              "Tabelog and Google Maps support many online bookings; hotel desks can call phone-only venues.",
              "Collect payment from the table and pay once at the register.",
              "If you cannot reserve, split into smaller groups rather than crowding a small room.",
            ],
            tags: ["social", "food", "booking", "nightlife"],
          },
          {
            id: "space-alpha",
            title: "Space Alpha Sannomiya",
            dek: "Forty quiet desks, ¥1,320 for the day, no reservation.",
            summary:
              "A training-room business with a calm coworking floor, power at every seat, printing, a cafe corner, and a small library. Useful in the daytime; admissions close before the floor itself.",
            facts: [
              "Center Plaza 6F, about 5–7 minutes from Sannomiya Station.",
              "Weekdays 09:00–20:00, last entry 18:00; weekends/holidays to 18:00, last entry 17:00.",
              "¥660 up to 3 hours / ¥1,320 day. Groups of 4+ should book a room.",
            ],
            tags: ["work", "coworking", "sannomiya", "budget"],
          },
          {
            id: "plug078",
            title: "plug078 Motomachi",
            dek: "A civic coworking network named for Kobe's area code.",
            summary:
              "The Motomachi branch puts you beside the arcades and Chinatown. The Shin-Kobe flagship sits one minute from the shinkansen, useful when work runs right up to a Tokyo train.",
            facts: [
              "Motomachi branch: 3-5-2 Motomachi-dori, 2F; 4 minutes from Motomachi Station.",
              "Monday–Saturday 09:00–20:00; closed Sundays and holidays.",
              "¥440/hour / ¥1,980/day; memberships from ¥5,500.",
            ],
            tags: ["work", "coworking", "motomachi", "budget"],
          },
          {
            id: "social-engine",
            title: "The event is the social engine",
            dek: "Plan around the rooms where everyone converges.",
            summary:
              "Use the summit weekends for visitors and dinners, October 26 for the Frontier Human Fashion Show, and nearby conferences as shared field trips. Book a table for eight in week one before you know the eight people.",
            facts: [
              "Summits: October 17–18 and October 24–25.",
              "Frontier Human Fashion Show: October 26 at 19:00.",
              "BioJapan: October 7–9 in Yokohama. Next Generation Longevity: October 15–16 in Osaka.",
            ],
            tags: ["event", "social", "planning", "essential"],
          },
        ],
      },
      {
        id: "partner",
        title: "Bringing a partner",
        sourceTitle: "Bringing a Partner, and Your First 72 Hours",
        intro:
          "Thirty-one days is a long absence and an unusually good base for sharing Japan. The practical case is stronger than the romantic one.",
        entries: [
          {
            id: "partner-case",
            title: "The case you make at home",
            dek: "A weekday radius most tourists would trade their itinerary for.",
            summary:
              "While you are in sessions, a partner can reach Kyoto, Nara, Osaka, Arima, and Kobe's own waterfront without changing accommodation. October is mild, beyond the peak of typhoon season, and well suited to walking.",
            facts: [
              "From Sannomiya: Osaka 21–22 min by JR; Kyoto about 50 min by JR; Nara about 80 min by through train.",
              "Early October highs are around 25°C, sliding toward 19°C by month-end; pack a warm layer and compact umbrella.",
              "On-island rainy-day options include Animal Kingdom and the science museum.",
            ],
            tags: ["partner", "planning", "month", "kansai"],
          },
          {
            id: "science-museum",
            title: "Bando Kobe Youth Science Museum",
            dek: "¥400 buys a seat under 25,000 stars.",
            summary:
              "The on-island museum pairs hands-on science rooms with a 230-seat planetarium. Late Friday, weekend, and holiday shows make it possible to go after a full conference day.",
            facts: [
              "3 minutes from Minami Koen Station.",
              "Exhibitions: adults ¥600 / students ¥300. Planetarium: ¥400 / ¥200, half price after 15:30.",
              "Mon–Thu 09:30–16:30; Fri/weekends/holidays to 19:00; closed Wednesdays.",
            ],
            tags: ["partner", "family", "rainy day", "port island"],
          },
          {
            id: "plus-one",
            title: "The plus-one plan",
            dek: "Choose the overlap that gives you both a real week.",
            summary:
              "For a partner joining only part of the month, the October 24–31 closing stretch contains the second summit weekend and the October 26 fashion show. Full-month pairs can split an apartment or ask about event housing.",
            facts: [
              "Current ticket inventory and pricing can move; use the event's Luma page rather than an archived number.",
              "Fashion Show: October 26 at 19:00.",
              "Ask the organizers directly about the four shared houses.",
            ],
            tags: ["partner", "event", "planning", "tickets"],
          },
        ],
      },
    ],
  },
  {
    id: "plan",
    navLabel: "Plan",
    eyebrow: "05 / Arrival protocol",
    title: "Land. Cross the bay. Reset.",
    intro:
      "The clean arrival is island to island by boat. Keep the land backups in your pocket, arrive before opening day if you can, and move your body onto Japan time before the programme gets dense.",
    groups: [
      {
        id: "getting-there",
        title: "Getting there",
        sourceTitle: "Getting There",
        intro:
          "Kansai International is the main gateway; Kobe Airport is the sleeper option one bridge south of the event. Every route below ends on Port Island.",
        entries: [
          {
            id: "arrival-short-version",
            title: "The short version",
            dek: "KIX. Shuttle. Ferry. Port Liner.",
            summary:
              "From KIX arrivals, take the free shuttle to the ferry pier, cross Osaka Bay to Kobe Airport, then board the Port Liner across the Sky Bridge to your island station.",
            facts: [
              "KIX terminal → ferry pier shuttle: about 5 minutes from Terminal 1.",
              "Bay Shuttle: 31-minute crossing / ¥1,880 one way.",
              "Kobe Airport → Shimin Hiroba: about 8 min / ¥250; full line to Sannomiya: 18 min / ¥340.",
            ],
            tags: ["arrival", "essential", "kix", "transit"],
          },
          {
            id: "airport-choice",
            title: "Flights: pick your airport",
            dek: "KIX is the gateway. UKB is the shortcut if the routing works.",
            summary:
              "Kansai International handles the broad international network. Kobe Airport is primarily domestic with limited international routes and lands you one bridge from the venue. Tokyo works when paired with a domestic hop, shinkansen, or BioJapan—but adds another leg.",
            facts: [
              "SFO–KIX nonstop is about 12 hours in the air; confirm the current schedule and fare.",
              "Tokyo → Shin-Kobe by Nozomi: about 2 hr 40 min / roughly ¥14,420–15,000.",
              "Kobe Airport's international line-up changes by season; verify at the airport's official site.",
            ],
            tags: ["arrival", "flights", "kix", "kobe airport"],
          },
          {
            id: "bay-shuttle",
            title: "The Bay Shuttle",
            dek: "The ferry is a boat, and Osaka Bay occasionally has opinions.",
            summary:
              "The boat replaces a longer land transfer with a direct crossing between artificial islands. Ask for the combined ferry-plus-Port-Liner ticket at KIX; it costs the same as the ferry alone.",
            facts: [
              "One way ¥1,880; same-day return ¥2,510; 120-day return ¥3,060.",
              "Combined ferry + Port Liner ticket: ¥1,880. The old ¥500 visitor fare ended March 16, 2026.",
              "Reservations open 90 days ahead and close 1 hour before sailing; take your passport to the counter.",
              "Very late KIX sailings may arrive after the Port Liner stops. Re-confirm October timetables.",
            ],
            tags: ["arrival", "ferry", "kix", "essential"],
          },
          {
            id: "arrival-backups",
            title: "Bus & train backups",
            dek: "When the bay or the clock closes the ferry, go by land.",
            summary:
              "The limousine bus reaches Sannomiya without transfers; JR West's visitor Haruka ticket connects KIX to Kobe via Osaka. Both keep the trip moving when the ferry is cancelled or finished for the night.",
            facts: [
              "KIX → Sannomiya limousine bus: about 65 min / ¥2,200.",
              "JR Haruka one-way visitor ticket to Kobe via Osaka: ¥2,000; book online before arrival.",
              "From Sannomiya, Shimin Hiroba is about 10 min / ¥250 on the Port Liner.",
            ],
            tags: ["arrival", "bus", "train", "backup"],
          },
          {
            id: "visas",
            title: "Visas",
            dek: "Check the rule for your passport, not somebody else's.",
            summary:
              "Many attendees will qualify for short-stay visa exemption, while others must apply in advance. Nationality rules, passport requirements, and allowed activities change; the Japanese Ministry of Foreign Affairs is the authority.",
            facts: [
              "A 31-day stay fits inside the common 90-day short-stay permission where visa exemption applies.",
              "Do not rely on a nationality list copied into a travel guide.",
              "Re-confirm entry rules before booking and again before travel.",
            ],
            note: "This guide is not immigration advice.",
            tags: ["arrival", "visa", "essential"],
          },
        ],
      },
      {
        id: "first-72-hours",
        title: "Your first 72 hours",
        sourceTitle: "Your First 72 Hours",
        intro:
          "Jet lag is a tax on short trips; a month-long event is how you stop paying it. Put the fog onto move-in days, not the summits.",
        entries: [
          {
            id: "clock-math",
            title: "The clock math",
            dek: "Japan stays on UTC+9 all year.",
            summary:
              "Through October, Kobe is 16 hours ahead of San Francisco and 13 ahead of New York. Britain and central Europe shift one hour on October 25; Japan does not.",
            facts: [
              "Set your watch to Japan time when you board and stop re-calculating.",
              "Arrive September 28–30 if possible, so opening day is not day zero.",
              "The mid-month summits and October 26 fashion show sit well beyond the usual adjustment window.",
            ],
            tags: ["arrival", "jet lag", "planning", "essential"],
          },
          {
            id: "landing-day",
            title: "Landing day",
            dek: "Drop the bags, then stay outside.",
            summary:
              "Use late-afternoon light, walk, eat at local dinner time, and stay awake until at least 21:30 if you can. If you must nap, keep it short enough that it does not become your first night's sleep.",
            facts: [
              "The ferry-and-Port-Liner arrival naturally puts you on the island in early evening for many daytime flights.",
              "Shiosai Park is the nearest open-sky walk.",
              "Keep caffeine to the first half of the local day while adjusting.",
            ],
            note: "These are general travel habits, not medical advice. Follow your clinician's advice for sleep or medication questions.",
            tags: ["arrival", "jet lag", "wellness", "first day"],
          },
          {
            id: "days-one-three",
            title: "Days one to three",
            dek: "Morning light, simple errands, early nights.",
            summary:
              "Use the first mornings for outdoor light and the first afternoons for ICOCA, groceries, and learning your station. An early 04:30 wake-up is also a useful call window back to North America.",
            facts: [
              "Learn your building's rubbish schedule and nearest supermarket in week one.",
              "Walk Shiosai's western promenade; your body responds to light, not the view's compass direction.",
              "If melatonin is part of an established routine, know that it is not sold over the counter in Japan; discuss travel use with a clinician before departure.",
            ],
            tags: ["arrival", "jet lag", "first day", "essential"],
          },
        ],
      },
    ],
  },
];

export const EXPERIENCE_QUICK_PATHS = [
  {
    label: "I'm arriving",
    detail: "KIX → ferry → Port Island",
    href: "#getting-there",
  },
  {
    label: "I have two hours",
    detail: "Shiosai · Sannomiya · Harborland",
    href: "#shiosai-park",
  },
  {
    label: "I have an evening",
    detail: "Waterfront · izakaya · last train",
    href: "#harborland-meriken",
  },
  {
    label: "I have a free day",
    detail: "Osaka · Kyoto · Nara · Himeji",
    href: "#kansai",
  },
];

export const EXPERIENCE_ROUTE_FACTS = [
  { place: "Sannomiya", time: "~10 min", detail: "from Shimin Hiroba · ¥250" },
  { place: "Osaka", time: "21–22 min", detail: "from Sannomiya by JR · ¥420" },
  { place: "Kyoto", time: "~50 min", detail: "from Sannomiya by JR · ¥1,110" },
  { place: "Arima", time: "~1 hour", detail: "from Port Island by rail · ¥970" },
];
