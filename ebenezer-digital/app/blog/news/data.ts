import { photoForStory } from "@/lib/news-photos";

export type NewsRegion =
  | "World"
  | "Asia"
  | "Europe"
  | "Americas"
  | "Africa"
  | "Middle East"
  | "India"
  | "Tech"
  | "Business"
  | "Science"
  | "Climate"
  | "Sports";

export type NewsArticle = {
  id: string;
  slug: string;
  title: string;
  dek: string;
  body: string[];
  region: NewsRegion;
  topic: string;
  location: string;
  sourceLabel: string;
  publishedAt: string;
  coverImage: string;
  breaking?: boolean;
  featured?: boolean;
  originalUrl?: string;
  byline?: string;
  origin?: "seed" | "cms" | "live";
};

export const NEWS_REGIONS: NewsRegion[] = [
  "World",
  "Asia",
  "Europe",
  "Americas",
  "Africa",
  "Middle East",
  "India",
  "Tech",
  "Business",
  "Science",
  "Climate",
  "Sports",
];

/** Editorial world desk — original summaries for Ebenezer News (.info) */
const WORLD_NEWS_SEED: NewsArticle[] = [
  {
    id: "n1",
    slug: "global-leaders-push-new-climate-funding-deal",
    title: "Global leaders push a fresh climate funding deal before COP talks",
    dek: "Finance ministers signal faster money for adaptation in vulnerable countries, while energy producers seek clearer transition timelines.",
    body: [
      "Negotiators from more than forty countries are circulating a draft climate finance framework ahead of the next major summit. The plan focuses on adaptation funds for coastal and agricultural economies facing rising heat and flood risk.",
      "Supporters say clearer payment schedules will unlock private capital. Critics argue the package still underestimates loss-and-damage needs in small island states.",
      "Markets watched energy and green-tech stocks closely as wording on fossil-fuel phase-down language remained unresolved late into overnight sessions.",
    ],
    region: "World",
    topic: "Climate policy",
    location: "Geneva",
    sourceLabel: "Ebenezer World Desk",
    publishedAt: "2026-08-12T06:30:00.000Z",
    coverImage: "/images/journal/hero.jpg",
    breaking: true,
    featured: true,
  },
  {
    id: "n2",
    slug: "asia-chip-supply-routes-shift-after-new-export-rules",
    title: "Asia chip supply routes shift after new export rules",
    dek: "Manufacturers in Taiwan, South Korea, and Southeast Asia rework logistics as semiconductor controls tighten across major markets.",
    body: [
      "Semiconductor exporters are rerouting inventory and expanding dual-sourcing after fresh compliance rules landed this week. Contract manufacturers report longer lead times for specialty tools.",
      "Analysts expect higher short-term costs, but also a faster build-out of packaging capacity in Vietnam, Malaysia, and India.",
      "Consumer electronics brands warned that flagship launches may see selective delays if advanced-node allocations stay tight through Q4.",
    ],
    region: "Asia",
    topic: "Semiconductors",
    location: "Singapore",
    sourceLabel: "Ebenezer Asia Desk",
    publishedAt: "2026-08-12T05:10:00.000Z",
    coverImage: "/images/portfolio/portfolio-screenshot-agency.png",
    featured: true,
  },
  {
    id: "n3",
    slug: "europe-energy-grids-brace-for-summer-peak-demand",
    title: "European energy grids brace for another summer peak",
    dek: "Utilities across Spain, Italy, and Germany activate contingency plans as heatwaves lift electricity demand and strain water cooling for plants.",
    body: [
      "Grid operators published peak-demand alerts after consecutive days above seasonal norms. Households are being asked to shift heavy appliance use off evening hours.",
      "Renewable output helped midday supply, but evening ramps remain the pressure point. Storage and interconnection upgrades are still catching up.",
      "Retailers and hospitals confirmed backup generation tests as municipalities opened cooling centers in major cities.",
    ],
    region: "Europe",
    topic: "Energy",
    location: "Brussels",
    sourceLabel: "Ebenezer Europe Desk",
    publishedAt: "2026-08-12T04:20:00.000Z",
    coverImage: "/images/portfolio/canaan-cover.png",
  },
  {
    id: "n4",
    slug: "americas-central-banks-signal-patience-on-rates",
    title: "Americas central banks signal patience on rate cuts",
    dek: "Policymakers from the US, Canada, and Brazil stress data dependence as inflation cools unevenly across services and housing.",
    body: [
      "Officials said labor markets remain resilient enough to wait for clearer price trends before easing further. Bond yields moved modestly after the remarks.",
      "Business groups welcomed stability but warned that credit costs still weigh on small manufacturers and housing starts.",
      "Emerging-market currencies in Latin America held steady as investors priced a slower path for global monetary easing.",
    ],
    region: "Americas",
    topic: "Economy",
    location: "Washington / São Paulo",
    sourceLabel: "Ebenezer Americas Desk",
    publishedAt: "2026-08-11T22:45:00.000Z",
    coverImage: "/images/portfolio/krishna-cover.png",
    featured: true,
  },
  {
    id: "n5",
    slug: "africa-digital-payments-surge-in-east-corridor",
    title: "East Africa digital payments surge as cross-border rails expand",
    dek: "Mobile money corridors between Kenya, Uganda, Tanzania, and Rwanda report record settlement volumes for small traders.",
    body: [
      "Interoperability upgrades reduced settlement friction for informal traders moving goods across borders. Average transaction fees on selected corridors fell for the third quarter in a row.",
      "Regulators are watching fraud patterns and KYC standards as volumes climb. Fintech founders say SME credit products will be the next wave.",
      "Development banks pointed to the trend as evidence that local payment rails can support regional trade without waiting for full banking inclusion.",
    ],
    region: "Africa",
    topic: "Fintech",
    location: "Nairobi",
    sourceLabel: "Ebenezer Africa Desk",
    publishedAt: "2026-08-11T19:00:00.000Z",
    coverImage: "/images/portfolio/manavarkal-hero.jpg",
  },
  {
    id: "n6",
    slug: "middle-east-ports-invest-in-green-shipping-hubs",
    title: "Gulf ports invest in green shipping hubs",
    dek: "Major terminals announce hydrogen bunkering studies and shore-power upgrades aimed at cleaner long-haul routes.",
    body: [
      "Port authorities outlined multi-year investment plans for alternative fuels and digital customs lanes. Shipping lines see the Gulf as a potential refueling waypoint for Asia–Europe traffic.",
      "Environmental groups urged transparent emissions accounting. Operators say early movers will win preferential contracts from cargo owners with net-zero targets.",
      "Regional logistics stocks gained as investors priced in longer-term infrastructure spend.",
    ],
    region: "Middle East",
    topic: "Shipping",
    location: "Dubai",
    sourceLabel: "Ebenezer MENA Desk",
    publishedAt: "2026-08-11T16:30:00.000Z",
    coverImage: "/images/journal/hero.jpg",
  },
  {
    id: "n7",
    slug: "india-monsoon-outlook-shapes-food-inflation-watch",
    title: "India monsoon outlook puts food inflation back on watch",
    dek: "Meteorology updates and early sowing data keep policymakers focused on vegetable and pulse prices into the festive season.",
    body: [
      "Agricultural desks report mixed rainfall distribution across key producing states. Traders are monitoring onion, tomato, and pulse arrivals in wholesale markets.",
      "Officials reiterated buffer stock readiness while urging states to tighten logistics for perishable crops.",
      "Consumer brands in packaged foods said they will keep promotional calendars flexible until September clarity improves.",
    ],
    region: "India",
    topic: "Agriculture",
    location: "New Delhi",
    sourceLabel: "Ebenezer India Desk",
    publishedAt: "2026-08-11T14:15:00.000Z",
    coverImage: "/images/portfolio/canaan-cover.png",
    featured: true,
  },
  {
    id: "n8",
    slug: "tech-ai-regulation-frameworks-diverge-across-blocs",
    title: "AI regulation frameworks diverge across major blocs",
    dek: "Companies racing to ship generative tools face different compliance clocks in the EU, US, India, and East Asia.",
    body: [
      "Legal teams are mapping product features against emerging disclosure, safety testing, and watermarking rules. Startups warn that fragmented standards raise cost for smaller labs.",
      "Large platforms said they can absorb multi-region compliance; open-source maintainers called for clearer guidance on distribution responsibility.",
      "Investors are favoring firms with documented evaluation pipelines and enterprise audit trails.",
    ],
    region: "Tech",
    topic: "Artificial intelligence",
    location: "Global",
    sourceLabel: "Ebenezer Tech Desk",
    publishedAt: "2026-08-11T12:00:00.000Z",
    coverImage: "/images/portfolio/portfolio-screenshot-agency.png",
    breaking: true,
  },
  {
    id: "n9",
    slug: "business-shipping-costs-ease-on-key-asia-europe-lanes",
    title: "Container rates ease on key Asia–Europe lanes",
    dek: "Spot prices cool after capacity additions, though Red Sea risk premiums remain in long-term contracts.",
    body: [
      "Freight indexes showed a second weekly decline on Shanghai–North Europe routes. Importers of furniture and electronics welcomed the relief after months of elevated costs.",
      "Carriers cautioned that peak-season demand could still tighten space. Insurance and security surcharges continue on selected corridors.",
      "Retail planners said lower spot rates will not instantly change shelf prices already locked in for autumn ranges.",
    ],
    region: "Business",
    topic: "Trade",
    location: "Shanghai / Rotterdam",
    sourceLabel: "Ebenezer Business Desk",
    publishedAt: "2026-08-11T09:40:00.000Z",
    coverImage: "/images/portfolio/krishna-cover.png",
  },
  {
    id: "n10",
    slug: "science-mars-sample-prep-moves-to-next-phase",
    title: "Mars sample return prep moves into a tighter engineering phase",
    dek: "Mission partners finalize landing architectures and contamination protocols for a multi-year retrieval sequence.",
    body: [
      "Engineering reviews focused on ascent vehicle mass and Earth-return capsule heat-shield margins. Scientists emphasized chain-of-custody rules for any returned material.",
      "Budget committees in partner agencies are scrutinizing schedule risk. Public outreach teams prepared education modules around planetary protection.",
      "If timelines hold, the program would mark a rare multi-nation deep-space logistics milestone.",
    ],
    region: "Science",
    topic: "Space",
    location: "International",
    sourceLabel: "Ebenezer Science Desk",
    publishedAt: "2026-08-10T21:00:00.000Z",
    coverImage: "/images/journal/hero.jpg",
  },
  {
    id: "n11",
    slug: "climate-cities-trial-cool-roof-mandates",
    title: "Cities trial cool-roof mandates to cut urban heat",
    dek: "Municipal pilots from South Asia to Latin America test reflective coatings and tree corridors for dense neighborhoods.",
    body: [
      "Early measurements show lower rooftop temperatures in pilot blocks, with mixed results on indoor comfort depending on building ventilation.",
      "Housing officials said incentives work better than abrupt bans for informal settlements. Architects called for local material standards.",
      "Public-health researchers are tracking heat-related clinic visits as a practical success metric.",
    ],
    region: "Climate",
    topic: "Cities",
    location: "Multi-city",
    sourceLabel: "Ebenezer Climate Desk",
    publishedAt: "2026-08-10T18:20:00.000Z",
    coverImage: "/images/portfolio/manavarkal-hero.jpg",
  },
  {
    id: "n12",
    slug: "sports-world-athletics-records-fall-in-diamond-meets",
    title: "World athletics records tumble across Diamond League meets",
    dek: "Sprint and middle-distance fields delivered season-best marks as Olympic cycle intensity rises.",
    body: [
      "Coaches credited denser competition calendars and improved recovery science. Anti-doping agencies reiterated testing frequency for top meets.",
      "Broadcasters reported higher streaming peaks among younger audiences. Federations discussed prize-money reforms for mid-tier athletes.",
      "National squads are using the results to finalize winter training camps.",
    ],
    region: "Sports",
    topic: "Athletics",
    location: "Global circuit",
    sourceLabel: "Ebenezer Sports Desk",
    publishedAt: "2026-08-10T15:00:00.000Z",
    coverImage: "/images/portfolio/canaan-cover.png",
  },
  {
    id: "n13",
    slug: "world-cyber-alert-hits-hospital-networks",
    title: "Global cyber alert hits hospital networks in three regions",
    dek: "Security agencies urge patching after ransomware groups target clinical scheduling and imaging systems.",
    body: [
      "Incident response teams reported interrupted outpatient bookings, while emergency care largely stayed online through contingency protocols.",
      "Vendors released emergency patches for known remote-access flaws. Hospitals without segmented networks faced longer recovery times.",
      "Governments advised healthcare providers to isolate backups and rehearse downtime procedures this week.",
    ],
    region: "World",
    topic: "Cybersecurity",
    location: "Multi-region",
    sourceLabel: "Ebenezer World Desk",
    publishedAt: "2026-08-10T11:30:00.000Z",
    coverImage: "/images/portfolio/portfolio-screenshot-agency.png",
    breaking: true,
  },
  {
    id: "n14",
    slug: "asia-tourism-rebounds-on-visa-easing",
    title: "Asia tourism rebounds as visa rules ease across hubs",
    dek: "Airports in Thailand, Japan, and the Gulf report stronger leisure arrivals for late-summer travel.",
    body: [
      "Airlines added seasonal capacity on leisure routes. Hotels in secondary cities saw stronger midweek occupancy than last year.",
      "Travel operators warned that staffing shortages still limit peak-day experience quality. Digital check-in tools are spreading faster among mid-size hotels.",
      "Currency swings remain a factor for long-haul European and North American travelers.",
    ],
    region: "Asia",
    topic: "Travel",
    location: "Bangkok / Tokyo",
    sourceLabel: "Ebenezer Asia Desk",
    publishedAt: "2026-08-10T08:00:00.000Z",
    coverImage: "/images/portfolio/canaan-cover.png",
  },
  {
    id: "n15",
    slug: "europe-housing-policy-targets-young-renters",
    title: "European capitals trial new housing support for young renters",
    dek: "Cities experiment with deposit guarantees and faster permitting for mid-rise apartments near transit.",
    body: [
      "Mayors argue that secure rental pathways reduce emigration of skilled workers. Landlord associations asked for clearer eviction timelines alongside tenant protections.",
      "Construction firms say permitting speed matters more than another subsidy layer. Architects pushed mixed-income rules to avoid mono-demographic blocks.",
      "Early enrollment numbers will be watched closely through autumn.",
    ],
    region: "Europe",
    topic: "Housing",
    location: "Berlin / Lisbon",
    sourceLabel: "Ebenezer Europe Desk",
    publishedAt: "2026-08-09T20:10:00.000Z",
    coverImage: "/images/journal/hero.jpg",
  },
  {
    id: "n16",
    slug: "americas-wildfire-season-stretches-logistics",
    title: "Americas wildfire season stretches air and ground logistics",
    dek: "Crews share aircraft across borders as dry conditions extend fire lines in western forests.",
    body: [
      "Mutual-aid agreements moved water bombers and hotshot teams between states and provinces. Communities near active fronts received updated evacuation maps.",
      "Insurers revised near-term loss estimates. Utilities pre-emptively de-energized high-risk lines during extreme wind events.",
      "Scientists linked longer seasons to hotter nights and reduced winter snowpack in key watersheds.",
    ],
    region: "Americas",
    topic: "Disasters",
    location: "Western Americas",
    sourceLabel: "Ebenezer Americas Desk",
    publishedAt: "2026-08-09T17:45:00.000Z",
    coverImage: "/images/portfolio/manavarkal-hero.jpg",
  },
  {
    id: "n17",
    slug: "africa-renewables-auction-draws-record-bids",
    title: "African renewables auction draws record private bids",
    dek: "Solar and wind packages attracted stronger competition as currency-hedging tools improved bankability.",
    body: [
      "Winning tariffs came in below previous rounds in several markets. Transmission bottlenecks remain the main delivery risk.",
      "Local content rules are pushing manufacturers to expand regional assembly. Communities near projects asked for clearer benefit-sharing plans.",
      "Development finance institutions said blended finance is still essential for first-of-kind storage add-ons.",
    ],
    region: "Africa",
    topic: "Energy transition",
    location: "Cape Town",
    sourceLabel: "Ebenezer Africa Desk",
    publishedAt: "2026-08-09T13:20:00.000Z",
    coverImage: "/images/portfolio/krishna-cover.png",
  },
  {
    id: "n18",
    slug: "india-startup-funding-shifts-to-profit-first",
    title: "India startup funding shifts toward profit-first models",
    dek: "Investors favor capital-efficient SaaS, D2C, and deep-tech teams after a quieter fundraising year.",
    body: [
      "Founders report longer diligence cycles and sharper unit-economics questions. Late-stage rounds remain selective.",
      "Public markets watched listed new-age names for cues on consumer demand. Talent is moving toward AI infrastructure and enterprise automation roles.",
      "Accelerators are rewriting playbooks around cash runway and secondary sales for early employees.",
    ],
    region: "India",
    topic: "Startups",
    location: "Bengaluru / Mumbai",
    sourceLabel: "Ebenezer India Desk",
    publishedAt: "2026-08-09T10:00:00.000Z",
    coverImage: "/images/portfolio/portfolio-screenshot-agency.png",
  },
  {
    id: "n19",
    slug: "tech-quantum-networks-leave-lab-for-city-trials",
    title: "Quantum networks leave the lab for city-scale trials",
    dek: "Metro fiber experiments test secure key distribution between government and research campuses.",
    body: [
      "Engineers caution that commercial products remain years away, but city trials validate noise handling in real fiber plants.",
      "Telecom operators are studying co-existence with classical traffic. Cryptographers debate timelines for post-quantum migration in banking.",
      "Universities published open datasets to accelerate algorithm benchmarking.",
    ],
    region: "Tech",
    topic: "Quantum",
    location: "Global labs",
    sourceLabel: "Ebenezer Tech Desk",
    publishedAt: "2026-08-08T22:00:00.000Z",
    coverImage: "/images/journal/hero.jpg",
  },
  {
    id: "n20",
    slug: "business-luxury-brands-court-middle-class-asia",
    title: "Luxury brands court Asia’s rising middle class with entry lines",
    dek: "Houses expand accessible accessories and beauty while protecting haute exclusivity.",
    body: [
      "Retailers said beauty and leather small goods are driving traffic in malls and airports. Flagship renovations emphasize experiential lounges.",
      "Analysts watch inventory discipline after previous overstock cycles. Resale platforms remain a parallel demand signal for authenticity-conscious buyers.",
      "Marketing budgets are shifting toward short-form video creators in Indonesia, India, and Korea.",
    ],
    region: "Business",
    topic: "Retail",
    location: "Hong Kong / Seoul",
    sourceLabel: "Ebenezer Business Desk",
    publishedAt: "2026-08-08T16:40:00.000Z",
    coverImage: "/images/portfolio/canaan-cover.png",
  },
  {
    id: "n21",
    slug: "middle-east-water-tech-attracts-sovereign-capital",
    title: "Water tech attracts sovereign capital across the Middle East",
    dek: "Desalination efficiency, leakage detection, and wastewater reuse draw long-horizon funds.",
    body: [
      "Sovereign investors are pairing utility contracts with manufacturing localization. Startups focused on membrane longevity and AI leak detection raised new rounds.",
      "Municipalities want measurable reductions in non-revenue water. Farmers asked for clearer pricing on treated reuse for agriculture.",
      "The theme is becoming a climate-adaptation investment story beyond oil diversification narratives.",
    ],
    region: "Middle East",
    topic: "Water",
    location: "Riyadh / Abu Dhabi",
    sourceLabel: "Ebenezer MENA Desk",
    publishedAt: "2026-08-08T12:15:00.000Z",
    coverImage: "/images/portfolio/manavarkal-hero.jpg",
  },
  {
    id: "n22",
    slug: "science-gene-editing-therapies-enter-wider-trials",
    title: "Gene-editing therapies enter wider clinical trials",
    dek: "Hospitals expand enrollment for rare-disease programs as delivery methods improve.",
    body: [
      "Researchers report better targeting accuracy and fewer off-target signals in early cohorts. Access and cost remain central ethical debates.",
      "Regulators asked for longer follow-up windows. Patient advocacy groups pushed for transparent waitlist criteria.",
      "Biotech indexes moved as investors differentiated platform companies from single-indication bets.",
    ],
    region: "Science",
    topic: "Biotech",
    location: "Boston / London",
    sourceLabel: "Ebenezer Science Desk",
    publishedAt: "2026-08-08T09:00:00.000Z",
    coverImage: "/images/portfolio/portfolio-screenshot-agency.png",
  },
  {
    id: "n23",
    slug: "sports-womens-football-broadcast-rights-climb",
    title: "Women’s football broadcast rights climb to new highs",
    dek: "Leagues secure richer media deals as audiences and sponsorship categories expand.",
    body: [
      "Rights packages now include dedicated streaming windows and highlight subscriptions. Clubs are investing in academies and medical staff parity.",
      "Sponsors from banking, sportswear, and tech entered multi-year agreements. Fans called for affordable ticket schemes in major cities.",
      "The commercial shift is reshaping calendar planning across confederations.",
    ],
    region: "Sports",
    topic: "Football",
    location: "Global",
    sourceLabel: "Ebenezer Sports Desk",
    publishedAt: "2026-08-07T19:30:00.000Z",
    coverImage: "/images/portfolio/krishna-cover.png",
  },
  {
    id: "n24",
    slug: "climate-ocean-observatories-warn-on-coral-bleaching",
    title: "Ocean observatories warn of widening coral bleaching risk",
    dek: "Marine institutes publish heat-stress maps showing longer exposure windows across tropical reefs.",
    body: [
      "Tourism economies dependent on reef diving face harder seasons. Conservation groups urged temporary fishing restrictions in stressed zones.",
      "Scientists said local water quality still matters even when global temperatures dominate the trend. Restoration nurseries reported mixed survival rates.",
      "Insurers and coastal hotels are revisiting nature-risk disclosures for upcoming reporting cycles.",
    ],
    region: "Climate",
    topic: "Oceans",
    location: "Pacific / Indian Ocean",
    sourceLabel: "Ebenezer Climate Desk",
    publishedAt: "2026-08-07T14:00:00.000Z",
    coverImage: "/images/journal/hero.jpg",
    featured: true,
  },
];

export const WORLD_NEWS: NewsArticle[] = WORLD_NEWS_SEED.map((n) => ({
  ...n,
  coverImage: photoForStory(n.region, n.title, n.topic),
  breaking: false,
  featured: false,
  origin: "seed" as const,
}));

export function getNewsBySlug(slug: string): NewsArticle | undefined {
  return WORLD_NEWS.find((n) => n.slug === slug);
}

export function getAllNews(): NewsArticle[] {
  return [...WORLD_NEWS].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function formatNewsTime(value: string): string {
  return new Date(value).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatNewsClock(value: string): string {
  return new Date(value).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function relativeNewsTime(value: string): string {
  const ms = Math.max(0, Date.now() - new Date(value).getTime());
  const secs = Math.floor(ms / 1000);
  if (secs < 8) return "Updated just now";
  if (secs < 60) return `Updated ${secs}s ago`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `Updated ${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Updated ${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `Updated ${days}d ago`;
}

export function readingMinutes(article: Pick<NewsArticle, "title" | "dek" | "body">): number {
  const words = `${article.title} ${article.dek} ${article.body.join(" ")}`
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function splitNewsHeadline(title: string): string[] {
  const words = title.trim().split(/\s+/);
  if (words.length <= 4) return [title];
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
}

export const NEWS_NAV = [
  "World",
  "India",
  "Politics",
  "Business",
  "Technology",
  "Science",
  "Sports",
  "Culture",
  "Entertainment",
  "Opinion",
] as const;

export type NewsNavId = (typeof NEWS_NAV)[number];

export function storiesForNav(all: NewsArticle[], nav: string): NewsArticle[] {
  const tests: Record<string, (n: NewsArticle) => boolean> = {
    World: (n) =>
      ["World", "Asia", "Europe", "Americas", "Africa", "Middle East"].includes(n.region),
    India: (n) => n.region === "India",
    Politics: (n) =>
      /politic|election|minister|parliament|president|modi|congress|bjp|white house|policy|regulation/i.test(
        `${n.topic} ${n.title}`
      ),
    Business: (n) => n.region === "Business" || /trade|funding|capital|markets|bank|economy/i.test(`${n.topic} ${n.title}`),
    Technology: (n) => n.region === "Tech" || /tech|ai |chip|software|app /i.test(`${n.topic} ${n.title}`),
    Science: (n) => n.region === "Science" || /science|space|nasa|research/i.test(`${n.topic} ${n.title}`),
    Sports: (n) => n.region === "Sports" || /cricket|football|tennis|olymp|ipl/i.test(`${n.topic} ${n.title}`),
    Culture: (n) => /culture|art|heritage|tourism|cities|travel|book/i.test(`${n.topic} ${n.title}`),
    Entertainment: (n) => /film|movie|music|celebrity|entertainment|hollywood|bollywood/i.test(`${n.topic} ${n.title}`),
    Opinion: (n) => /opinion|editorial|analysis|comment|ethics/i.test(`${n.topic} ${n.title} ${n.dek}`),
  };
  const test = tests[nav];
  return test ? all.filter(test) : all;
}

export const WORLD_DESKS = [
  { id: "geneva", label: "Geneva", x: 52, y: 36, region: "World" as NewsRegion },
  { id: "singapore", label: "Singapore", x: 78, y: 58, region: "Asia" as NewsRegion },
  { id: "brussels", label: "Brussels", x: 50, y: 32, region: "Europe" as NewsRegion },
  { id: "washington", label: "Washington", x: 24, y: 40, region: "Americas" as NewsRegion },
  { id: "nairobi", label: "Nairobi", x: 56, y: 62, region: "Africa" as NewsRegion },
  { id: "dubai", label: "Dubai", x: 60, y: 46, region: "Middle East" as NewsRegion },
  { id: "delhi", label: "New Delhi", x: 70, y: 46, region: "India" as NewsRegion },
  { id: "boston", label: "Boston", x: 28, y: 36, region: "Science" as NewsRegion },
] as const;

export const INDIA_STATES = [
  "Tamil Nadu",
  "Kerala",
  "Karnataka",
  "Andhra Pradesh",
  "Telangana",
  "Delhi",
  "Maharashtra",
] as const;
