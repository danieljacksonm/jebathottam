/**
 * 50 SEO / AI-friendly article angles — one unique post per tourist place.
 * Each angle targets a clear search intent with structured, factual framing.
 */
export const SEO_ANGLES = [
  {
    key: "complete-guide",
    slug: "complete-travel-guide",
    title: (p, d) => `${p} complete travel guide (${d})`,
    excerpt: (p, d) =>
      `A practical, detailed visitor guide to ${p} in ${d} — timing, access, etiquette, and how to plan without rushing.`,
    tags: ["Travel guide", "SEO"],
    minutes: 9,
    intent: "overview",
  },
  {
    key: "best-time",
    slug: "best-time-to-visit",
    title: (p, d) => `Best time to visit ${p}`,
    excerpt: (p) =>
      `Season-by-season advice for ${p}: weather windows, crowds, closures, and when flexibility matters most.`,
    tags: ["Best time", "Seasons"],
    minutes: 7,
    intent: "season",
  },
  {
    key: "how-to-reach",
    slug: "how-to-reach",
    title: (p, d) => `How to reach ${p} from major hubs`,
    excerpt: (p, d) =>
      `Airport, rail, road, and local-transfer options for ${p} near ${d} — with buffer time for real travel days.`,
    tags: ["How to reach", "Transport"],
    minutes: 7,
    intent: "access",
  },
  {
    key: "tickets",
    slug: "tickets-entry-tips",
    title: (p) => `${p} tickets, entry fees & booking tips`,
    excerpt: (p) =>
      `What to know before you buy: timed entry, queues, free days, and on-the-ground ticket realities for ${p}.`,
    tags: ["Tickets", "Planning"],
    minutes: 6,
    intent: "tickets",
  },
  {
    key: "one-day",
    slug: "one-day-itinerary",
    title: (p) => `One day at ${p}: a calm itinerary`,
    excerpt: (p) =>
      `A realistic single-day plan for ${p} with morning light, rest stops, and evening wind-down — not a checklist marathon.`,
    tags: ["Itinerary", "One day"],
    minutes: 8,
    intent: "itinerary",
  },
  {
    key: "half-day",
    slug: "half-day-visit",
    title: (p) => `Half-day visit to ${p}`,
    excerpt: (p) =>
      `When you only have a few hours at ${p}: what to prioritise, what to skip, and how to leave without regret.`,
    tags: ["Half day", "Itinerary"],
    minutes: 5,
    intent: "itinerary",
  },
  {
    key: "with-kids",
    slug: "with-kids",
    title: (p) => `${p} with kids: family pacing tips`,
    excerpt: (p) =>
      `Family-friendly advice for ${p} — walking load, shade, toilets, snacks, and calmer timing for children.`,
    tags: ["Family", "Kids"],
    minutes: 6,
    intent: "family",
  },
  {
    key: "with-elders",
    slug: "with-elders",
    title: (p) => `${p} with elders: comfort-first tips`,
    excerpt: (p) =>
      `Accessibility, rest points, heat/cold care, and slower pacing ideas for visiting ${p} with older travellers.`,
    tags: ["Family", "Seniors"],
    minutes: 6,
    intent: "family",
  },
  {
    key: "honeymoon",
    slug: "honeymoon-visit",
    title: (p) => `${p} for couples & honeymoon travellers`,
    excerpt: (p) =>
      `Romantic timing, quieter photo windows, and how to enjoy ${p} without tour-group rush.`,
    tags: ["Honeymoon", "Couples"],
    minutes: 6,
    intent: "couples",
  },
  {
    key: "photography",
    slug: "photography-tips",
    title: (p) => `${p} photography tips`,
    excerpt: (p) =>
      `Light, angles, crowd ethics, and gear notes for memorable photos at ${p} — without unsafe edges or flash bans.`,
    tags: ["Photography"],
    minutes: 7,
    intent: "photo",
  },
  {
    key: "sunrise-sunset",
    slug: "sunrise-sunset",
    title: (p) => `Sunrise & sunset at ${p}`,
    excerpt: (p) =>
      `Whether dawn or dusk is worth it at ${p}, what weather hides, and how early to arrive.`,
    tags: ["Sunrise", "Sunset"],
    minutes: 5,
    intent: "photo",
  },
  {
    key: "history",
    slug: "history-and-meaning",
    title: (p) => `History & meaning of ${p}`,
    excerpt: (p) =>
      `A clear, respectful overview of why ${p} matters — context that makes the visit richer than a quick photo stop.`,
    tags: ["History", "Culture"],
    minutes: 8,
    intent: "culture",
  },
  {
    key: "culture-etiquette",
    slug: "culture-etiquette",
    title: (p) => `Culture & etiquette at ${p}`,
    excerpt: (p) =>
      `Dress codes, photography rules, silence zones, and respectful behaviour for visitors at ${p}.`,
    tags: ["Etiquette", "Culture"],
    minutes: 5,
    intent: "culture",
  },
  {
    key: "food-nearby",
    slug: "food-nearby",
    title: (p) => `What to eat near ${p}`,
    excerpt: (p) =>
      `Practical food stops around ${p}: local specialities, hygiene cues, and when to eat before or after your visit.`,
    tags: ["Food"],
    minutes: 5,
    intent: "food",
  },
  {
    key: "budget",
    slug: "budget-tips",
    title: (p) => `Budget tips for visiting ${p}`,
    excerpt: (p) =>
      `Where to save and where not to cut corners around ${p} — tickets, transfers, food, and timing.`,
    tags: ["Budget"],
    minutes: 6,
    intent: "budget",
  },
  {
    key: "luxury",
    slug: "luxury-experience",
    title: (p) => `A luxury-paced visit to ${p}`,
    excerpt: (p) =>
      `Private transfers, quieter slots, and comfort-first sequencing for a premium visit to ${p}.`,
    tags: ["Luxury"],
    minutes: 5,
    intent: "luxury",
  },
  {
    key: "packing",
    slug: "what-to-pack",
    title: (p) => `What to pack for ${p}`,
    excerpt: (p) =>
      `Footwear, layers, sun/rain protection, and small essentials that make ${p} easier on the day.`,
    tags: ["Packing"],
    minutes: 4,
    intent: "packing",
  },
  {
    key: "safety",
    slug: "safety-tips",
    title: (p) => `Safety tips for ${p}`,
    excerpt: (p) =>
      `Crowd awareness, weather risks, scam patterns to ignore, and sensible precautions at ${p}.`,
    tags: ["Safety"],
    minutes: 5,
    intent: "safety",
  },
  {
    key: "mistakes",
    slug: "common-mistakes",
    title: (p) => `Common mistakes at ${p} (and how to avoid them)`,
    excerpt: (p) =>
      `The errors first-timers make at ${p} — timing, tickets, footwear, and overpacking the day.`,
    tags: ["Tips"],
    minutes: 6,
    intent: "tips",
  },
  {
    key: "hidden-tips",
    slug: "local-tips",
    title: (p) => `Local tips for ${p}`,
    excerpt: (p) =>
      `Practical on-the-ground tips for ${p}: quieter approaches, better photo windows, and less stressful pacing.`,
    tags: ["Local tips"],
    minutes: 6,
    intent: "tips",
  },
  {
    key: "nearby",
    slug: "nearby-attractions",
    title: (p, d) => `Places near ${p} worth combining`,
    excerpt: (p, d) =>
      `Smart combinations around ${p} in ${d} so you do not zigzag across the region in one exhausting day.`,
    tags: ["Nearby", "Itinerary"],
    minutes: 7,
    intent: "nearby",
  },
  {
    key: "2-days",
    slug: "two-day-plan",
    title: (p) => `2 days around ${p}`,
    excerpt: (p) =>
      `A slower two-day rhythm if ${p} is your trip anchor — with buffer for weather and rest.`,
    tags: ["Itinerary", "2 days"],
    minutes: 7,
    intent: "itinerary",
  },
  {
    key: "weather",
    slug: "weather-guide",
    title: (p) => `Weather guide for ${p}`,
    excerpt: (p) =>
      `How heat, rain, fog, wind, or cold change the ${p} experience — and what to do when forecasts fail.`,
    tags: ["Weather"],
    minutes: 5,
    intent: "season",
  },
  {
    key: "monsoon-winter",
    slug: "off-season-visit",
    title: (p) => `Visiting ${p} in off-season`,
    excerpt: (p) =>
      `Pros and cons of quieter seasons at ${p}: fewer crowds, weather trade-offs, and flexible planning.`,
    tags: ["Off season"],
    minutes: 5,
    intent: "season",
  },
  {
    key: "accessibility",
    slug: "accessibility",
    title: (p) => `Accessibility notes for ${p}`,
    excerpt: (p) =>
      `Steps, slopes, seating, and mobility considerations at ${p} — confirm on-site facilities before you go.`,
    tags: ["Accessibility"],
    minutes: 5,
    intent: "access",
  },
  {
    key: "opening-hours",
    slug: "opening-hours",
    title: (p) => `${p} opening hours & timing strategy`,
    excerpt: (p) =>
      `How to think about opening hours at ${p}: early entry, midday heat, and last-entry cutoffs.`,
    tags: ["Timing"],
    minutes: 4,
    intent: "tickets",
  },
  {
    key: "guided-vs-solo",
    slug: "guided-or-solo",
    title: (p) => `Guided tour vs solo visit at ${p}`,
    excerpt: (p) =>
      `When a guide adds value at ${p}, when independent visiting works, and how Canaan can help you choose.`,
    tags: ["Tours"],
    minutes: 5,
    intent: "tours",
  },
  {
    key: "group-travel",
    slug: "group-travel",
    title: (p) => `${p} for group travel`,
    excerpt: (p) =>
      `Meeting points, pacing for mixed ages, and vehicle logistics when visiting ${p} as a group.`,
    tags: ["Group"],
    minutes: 5,
    intent: "group",
  },
  {
    key: "solo-travel",
    slug: "solo-travel",
    title: (p) => `Solo travel tips for ${p}`,
    excerpt: (p) =>
      `Confidence tips for solo visitors at ${p}: timing, safety habits, and connecting with the place calmly.`,
    tags: ["Solo"],
    minutes: 5,
    intent: "solo",
  },
  {
    key: "first-timers",
    slug: "first-timers",
    title: (p) => `${p} for first-timers`,
    excerpt: (p) =>
      `What first-time visitors should know about ${p} before arrival — expectations, timing, and must-do vs nice-to-do.`,
    tags: ["First visit"],
    minutes: 7,
    intent: "overview",
  },
  {
    key: "return-visit",
    slug: "return-visit",
    title: (p) => `Returning to ${p}: a second-visit plan`,
    excerpt: (p) =>
      `If you have seen ${p} once, here is a deeper, quieter way to experience it again.`,
    tags: ["Return visit"],
    minutes: 5,
    intent: "tips",
  },
  {
    key: "architecture",
    slug: "architecture-highlights",
    title: (p) => `Architecture & design highlights of ${p}`,
    excerpt: (p) =>
      `What to notice in the built form of ${p} — materials, layout, viewpoints, and details worth lingering on.`,
    tags: ["Architecture"],
    minutes: 6,
    intent: "culture",
  },
  {
    key: "nature",
    slug: "nature-and-landscape",
    title: (p) => `Nature & landscape around ${p}`,
    excerpt: (p) =>
      `Terrain, viewpoints, wildlife etiquette, and outdoor comfort tips around ${p}.`,
    tags: ["Nature"],
    minutes: 6,
    intent: "nature",
  },
  {
    key: "beach-or-water",
    slug: "water-and-views",
    title: (p) => `Views, water & open-air tips for ${p}`,
    excerpt: (p) =>
      `How to enjoy open-air moments at ${p}: shade, hydration, viewpoints, and weather-aware timing.`,
    tags: ["Views"],
    minutes: 5,
    intent: "nature",
  },
  {
    key: "shopping",
    slug: "shopping-nearby",
    title: (p) => `Shopping near ${p}`,
    excerpt: (p) =>
      `Souvenir realism near ${p}: what is worth buying, what to skip, and how to avoid pressure selling.`,
    tags: ["Shopping"],
    minutes: 4,
    intent: "shopping",
  },
  {
    key: "stay-nearby",
    slug: "where-to-stay-nearby",
    title: (p, d) => `Where to stay near ${p}`,
    excerpt: (p, d) =>
      `Base areas that make ${p} easier — quieter nights vs central access in ${d}, without invented hotel rates.`,
    tags: ["Hotels", "Stay"],
    minutes: 6,
    intent: "stay",
  },
  {
    key: "night-visit",
    slug: "evening-or-night",
    title: (p) => `Evening visits to ${p}`,
    excerpt: (p) =>
      `Whether ${p} works after dark: lighting, safety, last entry, and atmosphere tips.`,
    tags: ["Evening"],
    minutes: 4,
    intent: "timing",
  },
  {
    key: "crowd-strategy",
    slug: "avoid-crowds",
    title: (p) => `How to avoid crowds at ${p}`,
    excerpt: (p) =>
      `Timing tactics and route choices that reduce peak congestion at ${p} in busy seasons.`,
    tags: ["Crowds"],
    minutes: 5,
    intent: "tips",
  },
  {
    key: "digital-nomad",
    slug: "short-stop-travel",
    title: (p) => `Fitting ${p} into a short city break`,
    excerpt: (p) =>
      `How to include ${p} in a tight schedule without burning the rest of your trip.`,
    tags: ["City break"],
    minutes: 5,
    intent: "itinerary",
  },
  {
    key: "visa-border",
    slug: "travel-documents",
    title: (p, d) => `Travel documents & planning notes for ${p}`,
    excerpt: (p, d) =>
      `Passport, visa, and entry practicalities when ${p} is part of a ${d} trip — confirm rules for your nationality.`,
    tags: ["Visa", "Documents"],
    minutes: 5,
    intent: "planning",
  },
  {
    key: "sustainable",
    slug: "responsible-visit",
    title: (p) => `Responsible travel at ${p}`,
    excerpt: (p) =>
      `Low-impact visiting at ${p}: litter, wildlife, community respect, and quieter tourism habits.`,
    tags: ["Responsible travel"],
    minutes: 5,
    intent: "responsible",
  },
  {
    key: "ai-faq",
    slug: "faq",
    title: (p) => `${p} FAQ: answers travellers ask`,
    excerpt: (p) =>
      `Clear answers to frequent questions about ${p} — timing, tickets, difficulty, and what to expect.`,
    tags: ["FAQ", "SEO"],
    minutes: 7,
    intent: "faq",
  },
  {
    key: "compare",
    slug: "worth-visiting",
    title: (p) => `Is ${p} worth visiting?`,
    excerpt: (p) =>
      `An honest worth-it assessment of ${p} based on trip length, interests, season, and walking comfort.`,
    tags: ["Worth visiting"],
    minutes: 6,
    intent: "overview",
  },
  {
    key: "video-reel",
    slug: "photo-spots",
    title: (p) => `Best photo spots at ${p}`,
    excerpt: (p) =>
      `Named viewpoints and angles at ${p} that work for phones and cameras — with crowd and safety notes.`,
    tags: ["Photo spots"],
    minutes: 5,
    intent: "photo",
  },
  {
    key: "rainy-day",
    slug: "rainy-day-plan",
    title: (p) => `Rainy-day plan around ${p}`,
    excerpt: (p) =>
      `What to do if rain hits your ${p} day — covered options, delays, and when to reschedule.`,
    tags: ["Weather", "Backup"],
    minutes: 4,
    intent: "season",
  },
  {
    key: "festival",
    slug: "festivals-events",
    title: (p) => `Festivals & special days near ${p}`,
    excerpt: (p) =>
      `How holidays and peak events change access, crowds, and atmosphere at ${p} — plan buffers.`,
    tags: ["Festivals"],
    minutes: 5,
    intent: "season",
  },
  {
    key: "canaan-plan",
    slug: "plan-with-canaan",
    title: (p, d) => `Plan ${p} with Canaan Travel Hub`,
    excerpt: (p, d) =>
      `What to send when you enquire about ${p} in ${d}: dates, travellers, pace, and must-dos. Human planning, no fake prices.`,
    tags: ["Canaan", "Planning"],
    minutes: 5,
    intent: "conversion",
  },
  {
    key: "checklist",
    slug: "visit-checklist",
    title: (p) => `${p} visit checklist`,
    excerpt: (p) =>
      `A compact pre-visit checklist for ${p}: documents, footwear, tickets, water, and timing.`,
    tags: ["Checklist"],
    minutes: 4,
    intent: "planning",
  },
  {
    key: "seo-things-to-do",
    slug: "things-to-do",
    title: (p) => `Things to do at ${p}`,
    excerpt: (p) =>
      `The best things to do at ${p} beyond a quick photo — walks, viewpoints, learning stops, and rest.`,
    tags: ["Things to do", "SEO"],
    minutes: 7,
    intent: "overview",
  },
  {
    key: "detailed-walkthrough",
    slug: "detailed-walkthrough",
    title: (p) => `${p} detailed walkthrough`,
    excerpt: (p) =>
      `A step-by-step walkthrough of a typical visit to ${p}: arrival, main zones, pacing, and exit.`,
    tags: ["Walkthrough", "Detailed"],
    minutes: 10,
    intent: "overview",
  },
];

if (SEO_ANGLES.length !== 50) {
  throw new Error(`Expected 50 SEO angles, got ${SEO_ANGLES.length}`);
}

export function paragraphsForAngle(angle, place, dest) {
  const p = place.nameEn;
  const d = dest.nameEn;
  const c = dest.country;
  const summary = place.summaryEn;
  const base = [
    `${p} is a recognised visitor highlight in ${d}, ${c}. ${summary}`,
    `This ${angle.intent} guide is written for real trip planning — clear expectations, flexible timing, and respectful visiting — not checklist spam.`,
  ];

  const byIntent = {
    overview: [
      `Start with how many hours you truly have. ${p} rewards unhurried attention; rushing usually costs the best light and calmest paths.`,
      `Confirm opening status, ticket rules, and dress or footwear needs the day before. Local conditions change with season, maintenance, and holidays.`,
      `Combine ${p} with at most one nearby stop unless distances are short. Canaan can sequence ${d} days around your energy and group profile.`,
      `Published package prices apply only where Canaan lists verified India circuits. For ${p}, enquire with dates — we do not invent rates.`,
    ],
    season: [
      `The best season for ${p} depends on your priority: clear views, fewer crowds, comfortable walking temperatures, or festival atmosphere.`,
      `Peak weeks raise queues and prices nearby. Shoulder periods often feel better if weather remains acceptable.`,
      `Always keep a buffer morning. Fog, rain, heat, or wind can reshape a ${p} day without warning.`,
      `Ask Canaan about your exact month before locking tight connections after ${p}.`,
    ],
    access: [
      `Most travellers reach ${p} via the main gateway for ${d}, then continue by taxi, transit, walking, or organised transfer.`,
      `Build buffer time after long flights. Arriving tired and forcing ${p} the same hour rarely feels good.`,
      `Save offline maps and your stay address. Signage quality varies by country and neighbourhood.`,
      `Canaan can arrange airport-to-hotel and sightseeing transfers as part of a custom ${d} plan.`,
    ],
    tickets: [
      `Many major sites now use timed entry. If ${p} requires advance tickets, book reputable channels and keep QR codes offline.`,
      `Budget for possible extras: audio guides, peak surcharges, or separate zones inside the complex.`,
      `Free or discounted days, if any, attract heavier crowds — decide whether saving money is worth the denser experience.`,
      `Rules change; verify current entry policy close to travel rather than relying on old blog posts alone.`,
    ],
    itinerary: [
      `A strong ${p} day has one clear peak experience, one soft pause (café, shade, museum room), and a calm exit.`,
      `Put the hardest walking or the best light first. Save shopping and optional add-ons for later.`,
      `If travelling with mixed ages, schedule a sit-down meal within two hours of arrival at ${p}.`,
      `Share your preferred pace with Canaan so ${d} days do not stack too many distant stops.`,
    ],
    family: [
      `At ${p}, plan shorter loops than guidebooks suggest. Children and elders tire faster in heat, cold, or crowds.`,
      `Carry water, snacks, and a light layer. Identify toilets and seating before you commit to a long inner path.`,
      `Skip risky edges and dense selfie clusters. Safety beats content.`,
      `Tell Canaan ages and mobility needs when you enquire — we adjust walking load and transfer timing.`,
    ],
    couples: [
      `Couples often enjoy ${p} most at softer light with fewer forced photos. Leave room for a long meal afterward.`,
      `Private transfers reduce friction between ${p} and your stay — useful on honeymoon pacing.`,
      `Choose one signature viewpoint rather than racing every angle.`,
      `Enquire with Canaan for a custom couple-friendly ${d} day that keeps ${p} unhurried.`,
    ],
    photo: [
      `Great photos at ${p} come from timing and patience more than gear. Arrive early or stay for late light when safe and allowed.`,
      `Respect photography bans indoors or at sacred zones. Ask before close portraits of people.`,
      `Watch footing near edges, wet stone, and traffic. No image is worth a fall.`,
      `A simple wide-to-short zoom covers most travel days at ${p}.`,
    ],
    culture: [
      `Understanding a little context makes ${p} feel larger than a backdrop. Read a short history note the evening before.`,
      `Dress modestly where required. Remove footwear if asked. Keep voices low in sacred or memorial spaces.`,
      `Guides can unlock stories you will miss alone — especially useful at complex heritage sites.`,
      `Canaan can include licensed local guiding in custom ${d} itineraries when available.`,
    ],
    food: [
      `Eat before long entry queues if ${p} has limited food inside. Carry water either way.`,
      `Choose busy, clean-looking places near ${p} for everyday meals; be cautious with ice and raw salads if your stomach is sensitive.`,
      `Try a local speciality linked to ${d}, but keep the meal proportional to the walking still ahead.`,
      `Dietary needs should be shared with Canaan before travel so stays and drivers can prepare.`,
    ],
    budget: [
      `The biggest budget levers around ${p} are season, transfer type, and how many paid extras you stack.`,
      `Shared transit saves money; private cars save energy. Pick based on elders, kids, and luggage.`,
      `Avoid pressure sellers at exits. Decide your souvenir budget before you enter.`,
      `Canaan quotes custom plans honestly — no fake “from” prices for unverified international products.`,
    ],
    luxury: [
      `Luxury at ${p} usually means timing, privacy, and recovery — not rushing more sights.`,
      `Ask for earlier or later slots, hotel-near bases, and chauffeured links when the walking load is high.`,
      `A quieter café or lounge after ${p} often improves the whole day more than another ticketed stop.`,
      `Enquire with Canaan for a comfort-first ${d} circuit that treats ${p} as a highlight, not a checkbox.`,
    ],
    packing: [
      `For ${p}, pack footwear with grip, sun or rain protection, and a refillable bottle.`,
      `Layers matter: air-conditioned museums, windy viewpoints, and hot plazas can appear in the same afternoon.`,
      `A small dry bag protects phones on boats, mist, or sudden showers.`,
      `Travel light inside the site if lockers are limited — big backpacks slow everyone down.`,
    ],
    safety: [
      `Keep valuables minimal at ${p}. Use hotel safes and stay aware in dense crowds.`,
      `Follow official barriers and lifeguard or ranger advice. Weather and terrain can turn quickly.`,
      `Use licensed taxis or pre-booked transfers after dark when you leave ${p}.`,
      `Travel insurance is wise for international itineraries that include active sightseeing days.`,
    ],
    tips: [
      `The simplest tip for ${p}: arrive earlier than you think and leave buffer for security or ticket lines.`,
      `Download offline maps and screenshots of tickets. Mobile signal can be weak in thick walls or remote viewpoints.`,
      `Do not over-schedule the rest of the day. ${p} often takes longer than marketing photos suggest.`,
      `When something is closed, switch to a café or nearby walk rather than forcing a stressful substitute.`,
    ],
    nearby: [
      `Pair ${p} with nearby stops that share the same geographic cluster in ${d}. Avoid crossing the whole region twice.`,
      `If distances are long, make ${p} the only major ticketed stop of the day.`,
      `Ask drivers or Canaan planners which combinations are realistic for your season and traffic.`,
      `A good nearby pairing leaves you at your hotel before exhaustion sets in.`,
    ],
    nature: [
      `Outdoor time around ${p} needs sun care, water, and weather humility.`,
      `Stay on marked paths. Shortcuts damage landscapes and can be unsafe.`,
      `Wildlife and livestock are not props — keep distance and never feed animals.`,
      `After rain, stone and clay can be slippery; slow down and use handrails where present.`,
    ],
    shopping: [
      `Shopping near ${p} should be optional. Decide what you actually want before vendors engage.`,
      `Compare quality on simple goods like textiles, spices, or crafts; walk away from pressure.`,
      `Avoid wildlife products and questionable “antiques.”`,
      `Keep a soft foldable bag and leave luggage space for the return journey.`,
    ],
    stay: [
      `Stay close to ${p} if it is your main reason for visiting ${d}; stay central if you will spread across many neighbourhoods.`,
      `Quiet nights matter after heavy sightseeing — check reviews for noise if you are a light sleeper.`,
      `Canaan helps with hotel shortlists as digital tourism support; we do not invent nightly rates here.`,
      `Share budget band and neighbourhood preferences when you enquire.`,
    ],
    timing: [
      `Evening atmosphere at ${p} can be beautiful when access allows — confirm last entry and lighting.`,
      `After dark, stick to well-lit routes and pre-arranged transport.`,
      `Some viewpoints are daytime-only for safety. Do not force unsafe night photos.`,
      `Build dinner nearby so you are not hunting for food exhausted.`,
    ],
    tours: [
      `A guide helps at ${p} when history is dense or navigation is confusing. Solo visiting works when signage and space are clear.`,
      `Small groups usually beat megaphone crowds for questions and photos.`,
      `Read recent reviews of operators; licensing and safety standards matter.`,
      `Canaan can recommend guided or independent styles based on your interests.`,
    ],
    group: [
      `Groups should appoint one timekeeper and one meeting point at ${p}.`,
      `Mixed fitness levels need a short route and a longer optional loop.`,
      `Pre-booked vehicles beat hunting for multiple taxis at exits.`,
      `Share headcount and ages with Canaan for realistic transfer sizing.`,
    ],
    solo: [
      `Solo travellers can enjoy ${p} at their own shutter speed — linger where groups cannot.`,
      `Tell someone your plan, keep phone charged, and use official transport options.`,
      `Mid-morning can be a sweet spot between dawn crowds and afternoon heat.`,
      `Canaan still helps solo guests with transfers and hotel placement on enquiry.`,
    ],
    planning: [
      `Before ${p}, confirm passport validity, visas for ${c}, and any site-specific ID rules.`,
      `Save emergency numbers and your embassy/consulate info when travelling internationally.`,
      `Align flights so you are not arriving at midnight and forcing ${p} at sunrise without sleep.`,
      `Send Canaan your nationality, dates, and must-dos for a document-aware plan.`,
    ],
    responsible: [
      `Carry a refill bottle and refuse unnecessary plastic where you can around ${p}.`,
      `Stay on paths, keep music low, and leave heritage surfaces untouched.`,
      `Support local guides and eateries fairly.`,
      `Responsible visitors keep ${p} welcoming for the next traveller — and for residents.`,
    ],
    faq: [
      `How long do I need? Many visitors plan 1.5–3 hours for ${p}, more if lines or viewpoints are extensive.`,
      `Do I need tickets in advance? Often yes in peak season — check the official channel close to travel.`,
      `Is it suitable for kids or elders? Usually with pacing, shade, and fewer stairs if alternatives exist.`,
      `Still unsure? Enquire with Canaan and describe your group — we will give a clear next step.`,
    ],
    conversion: [
      `To plan ${p} with Canaan, send travel dates, origin city, group size, and whether ${d} is your only stop.`,
      `Mention walking comfort, must-see vs optional, and hotel style.`,
      `We respond with human planning for flights, hotels, visas, and sightseeing support — not fake live inventory.`,
      `Published prices exist only for verified Canaan packages (select India circuits). ${p} is custom or enquiry-based.`,
    ],
  };

  const extra = byIntent[angle.intent] ?? byIntent.overview;
  return [...base, ...extra];
}
