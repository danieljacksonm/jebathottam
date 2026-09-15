/**
 * Default tourist places for destinations that need place-level blogs.
 * Real, well-known attractions only — enquiry-first, no invented prices.
 */

/** @type {Record<string, { slug: string; nameEn: string; summaryEn: string }[]>} */
export const DEFAULT_PLACES = {
  manali: [
    { slug: "solang-valley", nameEn: "Solang Valley", summaryEn: "Adventure valley near Manali for snow and summer activities when open." },
    { slug: "hadimba-temple", nameEn: "Hadimba Temple", summaryEn: "Cedar-forest temple stop with calm walks around Old Manali approaches." },
    { slug: "rohtang-pass", nameEn: "Rohtang Pass", summaryEn: "High pass access is seasonal and permit-dependent — confirm before planning." },
  ],
  "leh-ladakh": [
    { slug: "pangong-lake", nameEn: "Pangong Lake", summaryEn: "High-altitude lake day or overnight — acclimatise in Leh first." },
    { slug: "nubra-valley", nameEn: "Nubra Valley", summaryEn: "Sand dunes and monasteries beyond Khardung La when roads allow." },
    { slug: "magnetic-hill", nameEn: "Magnetic Hill", summaryEn: "Popular roadside optical illusion stop on the Leh–Kargil highway." },
  ],
  andaman: [
    { slug: "havelock", nameEn: "Havelock (Swaraj Dweep)", summaryEn: "Radhanagar Beach and scuba bases — ferry timing drives the plan." },
    { slug: "neil-island", nameEn: "Neil Island (Shaheed Dweep)", summaryEn: "Quieter beaches and snorkel spots for calmer island days." },
    { slug: "cellular-jail", nameEn: "Cellular Jail", summaryEn: "Port Blair heritage site — evening light-and-sound when operating." },
  ],
  "agra-taj-mahal": [
    { slug: "taj-mahal", nameEn: "Taj Mahal", summaryEn: "Sunrise visits reduce heat and crowds — tickets and ID rules apply." },
    { slug: "agra-fort", nameEn: "Agra Fort", summaryEn: "Mughal fort complex often paired with the Taj on the same day." },
    { slug: "mehtab-bagh", nameEn: "Mehtab Bagh", summaryEn: "Yamuna-side garden for sunset Taj views when open." },
  ],
  dubai: [
    { slug: "burj-khalifa", nameEn: "Burj Khalifa", summaryEn: "Observation decks book ahead in peak season — evenings are popular." },
    { slug: "dubai-desert-safari", nameEn: "Desert safari", summaryEn: "Dune drives and camp evenings — choose reputable operators." },
    { slug: "dubai-marina", nameEn: "Dubai Marina", summaryEn: "Waterfront walks and dinner cruises for skyline evenings." },
  ],
  singapore: [
    { slug: "gardens-by-the-bay", nameEn: "Gardens by the Bay", summaryEn: "Supertree Grove and conservatories — iconic night light shows." },
    { slug: "marina-bay-sands", nameEn: "Marina Bay Sands", summaryEn: "Bayfront skyline views and ArtScience Museum area." },
    { slug: "sentosa", nameEn: "Sentosa", summaryEn: "Beaches and family attractions — plan transport from the mainland." },
  ],
  bangkok: [
    { slug: "grand-palace", nameEn: "Grand Palace", summaryEn: "Dress code enforced — mornings are cooler for the complex walk." },
    { slug: "wat-arun", nameEn: "Wat Arun", summaryEn: "Riverside temple best at soft light; ferry crossings add atmosphere." },
    { slug: "chatuchak", nameEn: "Chatuchak Weekend Market", summaryEn: "Vast weekend market — go early and travel light." },
  ],
  phuket: [
    { slug: "patong-beach", nameEn: "Patong Beach", summaryEn: "Busy north beach strip — lively nights and water-sport vendors." },
    { slug: "phi-phi", nameEn: "Phi Phi day trip", summaryEn: "Boat trips when seas allow — book reputable operators." },
    { slug: "old-phuket-town", nameEn: "Old Phuket Town", summaryEn: "Sino-Portuguese streets and cafés away from the densest beach strip." },
  ],
  tokyo: [
    { slug: "senso-ji", nameEn: "Senso-ji (Asakusa)", summaryEn: "Historic temple approach with Nakamise shopping lane." },
    { slug: "shibuya-crossing", nameEn: "Shibuya Crossing", summaryEn: "Iconic intersection — evenings feel electric; keep valuables secure." },
    { slug: "teamlab", nameEn: "teamLab Borderless / Planets", summaryEn: "Immersive digital museums — buy timed tickets early." },
  ],
  kyoto: [
    { slug: "fushimi-inari", nameEn: "Fushimi Inari Shrine", summaryEn: "Torii tunnel hike — start early to beat tour peaks." },
    { slug: "arashiyama", nameEn: "Arashiyama bamboo grove", summaryEn: "Bamboo paths and riverside walks — mornings are quieter." },
    { slug: "kinkaku-ji", nameEn: "Kinkaku-ji", summaryEn: "Golden Pavilion reflection views — classic Kyoto photo stop." },
  ],
  seoul: [
    { slug: "gyeongbokgung", nameEn: "Gyeongbokgung Palace", summaryEn: "Flagship palace with changing-of-the-guard ceremonies on schedule days." },
    { slug: "bukchon", nameEn: "Bukchon Hanok Village", summaryEn: "Traditional houses — keep noise low; residents live here." },
    { slug: "myeongdong", nameEn: "Myeongdong", summaryEn: "Shopping and street food evenings in central Seoul." },
  ],
  "hong-kong": [
    { slug: "victoria-peak", nameEn: "Victoria Peak", summaryEn: "Harbour views via tram or bus — clear evenings are best." },
    { slug: "star-ferry", nameEn: "Star Ferry", summaryEn: "Classic harbour crossing between Kowloon and Hong Kong Island." },
    { slug: "tsim-sha-tsui", nameEn: "Tsim Sha Tsui waterfront", summaryEn: "Promenade skyline views and Avenue of Stars walks." },
  ],
  vietnam: [
    { slug: "ha-long-bay", nameEn: "Ha Long Bay", summaryEn: "Overnight or day cruises among limestone karsts — season and operator quality matter." },
    { slug: "hoi-an", nameEn: "Hoi An Ancient Town", summaryEn: "Lantern-lit old town — walkable heritage evenings." },
    { slug: "ho-chi-minh-city", nameEn: "Ho Chi Minh City", summaryEn: "Cu Chi tunnels day trips and dense city food culture." },
  ],
  cambodia: [
    { slug: "angkor-wat", nameEn: "Angkor Wat", summaryEn: "Sunrise tickets and temple circuit pacing — hire a local guide when possible." },
    { slug: "bayon", nameEn: "Bayon Temple", summaryEn: "Face towers of Angkor Thom — softer light mid-morning." },
    { slug: "tonle-sap", nameEn: "Tonlé Sap lake villages", summaryEn: "Floating or stilt villages — choose ethical tour operators." },
  ],
  "sri-lanka": [
    { slug: "sigiriya", nameEn: "Sigiriya Rock", summaryEn: "Early climbs beat heat — fitness and footwear required." },
    { slug: "ella", nameEn: "Ella", summaryEn: "Train approaches, Nine Arch Bridge, and tea-country walks." },
    { slug: "galle-fort", nameEn: "Galle Fort", summaryEn: "UNESCO coastal fort for sunset rampart walks." },
  ],
  maldives: [
    { slug: "male-transfer", nameEn: "Malé & seaplane transfers", summaryEn: "Most resorts need speedboat or seaplane — build buffer time." },
    { slug: "house-reef", nameEn: "House reef snorkelling", summaryEn: "Many resorts offer reef access — reef-safe sunscreen matters." },
    { slug: "sandbank", nameEn: "Sandbank picnic", summaryEn: "Day excursions when weather allows — confirm inclusions." },
  ],
  nepal: [
    { slug: "pashupatinath", nameEn: "Pashupatinath", summaryEn: "Sacred Hindu site in Kathmandu — dress modestly and follow temple rules." },
    { slug: "pokhara", nameEn: "Pokhara", summaryEn: "Phewa Lake and Annapurna viewpoints for trekking gateways." },
    { slug: "boudhanath", nameEn: "Boudhanath Stupa", summaryEn: "Large stupa circuit with prayer flags and cafés around the mandala." },
  ],
  bhutan: [
    { slug: "tigers-nest", nameEn: "Tiger's Nest (Paro Taktsang)", summaryEn: "Steep monastery hike — start early and carry water." },
    { slug: "thimphu", nameEn: "Thimphu", summaryEn: "Capital temples and markets with measured tourism pacing." },
    { slug: "punakha-dzong", nameEn: "Punakha Dzong", summaryEn: "Riverside fortress-monastery on classic west Bhutan circuits." },
  ],
  malaysia: [
    { slug: "petronas-towers", nameEn: "Petronas Towers", summaryEn: "KLCC skydeck and park — book tickets in peak periods." },
    { slug: "penang", nameEn: "George Town, Penang", summaryEn: "Street art, heritage shophouses, and food trails." },
    { slug: "langkawi", nameEn: "Langkawi", summaryEn: "Island beaches and cable car views — ferry or flight access." },
  ],
  qatar: [
    { slug: "museum-islamic-art", nameEn: "Museum of Islamic Art", summaryEn: "Doha waterfront museum — strong stopover half-day." },
    { slug: "souq-waqif", nameEn: "Souq Waqif", summaryEn: "Traditional market lanes for evening food and crafts." },
    { slug: "katara", nameEn: "Katara Cultural Village", summaryEn: "Amphitheatre and beachfront cultural district." },
  ],
  oman: [
    { slug: "mutrah-souq", nameEn: "Mutrah Souq", summaryEn: "Muscat's classic souq beside the corniche." },
    { slug: "nizwa-fort", nameEn: "Nizwa Fort", summaryEn: "Day-trip fort and Friday livestock market traditions." },
    { slug: "wahiba-sands", nameEn: "Wahiba Sands", summaryEn: "Desert camps and dune evenings — 4x4 access required." },
  ],
  jordan: [
    { slug: "petra", nameEn: "Petra", summaryEn: "Siq walk to the Treasury — plan two days if possible." },
    { slug: "wadi-rum", nameEn: "Wadi Rum", summaryEn: "Jeep camps under desert skies — nights get cold." },
    { slug: "dead-sea", nameEn: "Dead Sea", summaryEn: "Float stops and spa hotels — protect eyes from salt." },
  ],
  turkey: [
    { slug: "hagia-sophia", nameEn: "Hagia Sophia", summaryEn: "Istanbul's landmark mosque-museum history — queues peak midday." },
    { slug: "cappadocia", nameEn: "Cappadocia", summaryEn: "Balloon mornings when weather allows — book flexible tickets." },
    { slug: "ephesus", nameEn: "Ephesus", summaryEn: "Ancient coastal ruins near Izmir/Selçuk — heat and walking matter." },
  ],
  egypt: [
    { slug: "giza-pyramids", nameEn: "Giza Pyramids", summaryEn: "Sphinx and plateau — hire licensed guides; avoid aggressive vendors." },
    { slug: "luxor-temples", nameEn: "Luxor & Karnak", summaryEn: "Nile temple corridor — often paired with Valley of the Kings." },
    { slug: "abu-simbel", nameEn: "Abu Simbel", summaryEn: "Southern temples near Aswan — early convoy or flight options." },
  ],
  morocco: [
    { slug: "jemaa-el-fna", nameEn: "Jemaa el-Fnaa", summaryEn: "Marrakech square evenings — food stalls and performers." },
    { slug: "fes-medina", nameEn: "Fes medina", summaryEn: "Labyrinthine UNESCO medina — local guides reduce stress." },
    { slug: "sahara-camp", nameEn: "Sahara desert camp", summaryEn: "Merzouga or similar dune camps — multi-day driving from cities." },
  ],
  "kenya-safari": [
    { slug: "maasai-mara", nameEn: "Maasai Mara", summaryEn: "Big-five game drives — migration timing varies by year." },
    { slug: "amboseli", nameEn: "Amboseli", summaryEn: "Elephant herds with Kilimanjaro backdrop on clear days." },
    { slug: "nairobi-park", nameEn: "Nairobi National Park", summaryEn: "City-edge wildlife when time is short before flights." },
  ],
  "cape-town": [
    { slug: "table-mountain", nameEn: "Table Mountain", summaryEn: "Cableway or hike when wind allows — weather closes access often." },
    { slug: "cape-point", nameEn: "Cape Point", summaryEn: "Peninsula drive with penguins at Boulders when included." },
    { slug: "stellenbosch", nameEn: "Stellenbosch Winelands", summaryEn: "Day-trip wine estates — designate a driver." },
  ],
  paris: [
    { slug: "eiffel-tower", nameEn: "Eiffel Tower", summaryEn: "Timed tickets beat queues — Trocadéro views are free." },
    { slug: "louvre", nameEn: "Louvre Museum", summaryEn: "Book a timed entry and pick a wing — do not try the whole museum." },
    { slug: "notre-dame", nameEn: "Notre-Dame & Île de la Cité", summaryEn: "Cathedral area and Sainte-Chapelle nearby for stained glass." },
  ],
  london: [
    { slug: "british-museum", nameEn: "British Museum", summaryEn: "Free entry galleries — go early for quieter rooms." },
    { slug: "tower-of-london", nameEn: "Tower of London", summaryEn: "Crown Jewels and river views — allow half a day." },
    { slug: "westminster", nameEn: "Westminster & Big Ben", summaryEn: "Parliament square walks and Abbey visits by ticket." },
  ],
  rome: [
    { slug: "colosseum", nameEn: "Colosseum", summaryEn: "Combined Forum tickets — book ahead for underground options." },
    { slug: "vatican", nameEn: "Vatican Museums & St Peter's", summaryEn: "Dress code and long queues — early entries help." },
    { slug: "trevi-fountain", nameEn: "Trevi Fountain", summaryEn: "Crowded icon — visit early morning or late evening." },
  ],
  barcelona: [
    { slug: "sagrada-familia", nameEn: "Sagrada Família", summaryEn: "Timed tickets essential — towers sell out first." },
    { slug: "park-guell", nameEn: "Park Güell", summaryEn: "Gaudí park with timed monument zone entry." },
    { slug: "gothic-quarter", nameEn: "Gothic Quarter", summaryEn: "Medieval lanes and tapas evenings in Ciutat Vella." },
  ],
  switzerland: [
    { slug: "interlaken", nameEn: "Interlaken", summaryEn: "Adventure base between lakes — Jungfrau region day trips." },
    { slug: "lucerne", nameEn: "Lucerne", summaryEn: "Chapel Bridge and lake steamers for classic Alpine towns." },
    { slug: "matterhorn", nameEn: "Zermatt / Matterhorn", summaryEn: "Car-free resort town — Gornergrat or cable views when open." },
  ],
  greece: [
    { slug: "acropolis", nameEn: "Acropolis of Athens", summaryEn: "Morning tickets and water — marble paths get hot." },
    { slug: "santorini", nameEn: "Santorini", summaryEn: "Caldera sunsets in Oia — ferry winds can delay plans." },
    { slug: "mykonos", nameEn: "Mykonos", summaryEn: "Cycladic lanes and beaches — nightlife optional, not required." },
  ],
  iceland: [
    { slug: "golden-circle", nameEn: "Golden Circle", summaryEn: "Þingvellir, Geysir, and Gullfoss — classic first-day loop." },
    { slug: "blue-lagoon", nameEn: "Blue Lagoon", summaryEn: "Geothermal spa near Keflavík — book slots; alternatives exist." },
    { slug: "south-coast", nameEn: "South Coast waterfalls", summaryEn: "Seljalandsfoss and Skógafoss on Ring Road day drives." },
  ],
  norway: [
    { slug: "bergen", nameEn: "Bergen & Bryggen", summaryEn: "UNESCO wharf and fjord ferry gateways." },
    { slug: "geiranger", nameEn: "Geirangerfjord", summaryEn: "Cruise or drive viewpoints — seasonal road access." },
    { slug: "tromso", nameEn: "Tromsø", summaryEn: "Northern lights season winters — no aurora guarantees." },
  ],
  amsterdam: [
    { slug: "rijksmuseum", nameEn: "Rijksmuseum", summaryEn: "Dutch Masters — book timed tickets for peak months." },
    { slug: "anne-frank", nameEn: "Anne Frank House", summaryEn: "Online tickets only — book weeks ahead." },
    { slug: "canal-belt", nameEn: "Canal Belt", summaryEn: "UNESCO canals for evening boat or bike loops." },
  ],
  "new-york": [
    { slug: "statue-of-liberty", nameEn: "Statue of Liberty & Ellis Island", summaryEn: "Ferry tickets sell out — Crown access needs early booking." },
    { slug: "central-park", nameEn: "Central Park", summaryEn: "Soft mornings and museum-edge walks without ticket stress." },
    { slug: "times-square", nameEn: "Times Square & Broadway", summaryEn: "Evening lights and theatre — pick shows before travel." },
  ],
  "los-angeles": [
    { slug: "santa-monica", nameEn: "Santa Monica Pier", summaryEn: "Pacific sunsets and beach cycling paths." },
    { slug: "hollywood", nameEn: "Hollywood Boulevard", summaryEn: "Walk of Fame and studio tour options nearby." },
    { slug: "griffith", nameEn: "Griffith Observatory", summaryEn: "City and Hollywood Sign views — parking fills early." },
  ],
  "las-vegas": [
    { slug: "strip", nameEn: "Las Vegas Strip", summaryEn: "Resort walks and fountain shows — hydrate in summer heat." },
    { slug: "grand-canyon", nameEn: "Grand Canyon day trip", summaryEn: "West or South Rim tours — long days; start early." },
    { slug: "red-rock", nameEn: "Red Rock Canyon", summaryEn: "Scenic drive loop west of the city for quieter geology." },
  ],
  canada: [
    { slug: "banff", nameEn: "Banff National Park", summaryEn: "Lake Louise and Moraine when roads/lifts allow — summer peaks." },
    { slug: "niagara", nameEn: "Niagara Falls", summaryEn: "Boat or walkway views from Toronto day trips." },
    { slug: "cn-tower", nameEn: "CN Tower, Toronto", summaryEn: "SkyPod views over Lake Ontario — EdgeWalk optional." },
  ],
  mexico: [
    { slug: "chichen-itza", nameEn: "Chichén Itzá", summaryEn: "Mayan pyramid day trip — heat and early starts recommended." },
    { slug: "tulum", nameEn: "Tulum ruins & beach", summaryEn: "Cliff ruins above Caribbean water — combine carefully with beach time." },
    { slug: "cancun", nameEn: "Cancún Hotel Zone", summaryEn: "Resort beach base for Riviera Maya circuits." },
  ],
  peru: [
    { slug: "machu-picchu", nameEn: "Machu Picchu", summaryEn: "Permit and train tickets — acclimatise in Cusco first." },
    { slug: "cusco", nameEn: "Cusco", summaryEn: "Andean capital for Sacred Valley pacing and altitude rest." },
    { slug: "sacred-valley", nameEn: "Sacred Valley", summaryEn: "Pisac and Ollantaytambo between Cusco and Aguas Calientes." },
  ],
  sydney: [
    { slug: "opera-house", nameEn: "Sydney Opera House", summaryEn: "Harbour walks and guided tours — Circular Quay ferries nearby." },
    { slug: "bondi", nameEn: "Bondi Beach", summaryEn: "Coastal walk to Coogee for cliff views and ocean pools." },
    { slug: "harbour-bridge", nameEn: "Sydney Harbour Bridge", summaryEn: "Pylon Lookout or BridgeClimb for skyline angles." },
  ],
  "new-zealand": [
    { slug: "milford-sound", nameEn: "Milford Sound", summaryEn: "Fiord cruises from Te Anau or Queenstown day tours — weather cancels." },
    { slug: "rotorua", nameEn: "Rotorua", summaryEn: "Geothermal parks and Māori cultural evenings on North Island." },
    { slug: "queenstown", nameEn: "Queenstown", summaryEn: "Adventure capital and lake views — South Island touring hub." },
  ],
  kerala: [
    { slug: "alleppey", nameEn: "Alleppey backwaters", summaryEn: "Houseboat routes and village canals in Kuttanad." },
    { slug: "munnar", nameEn: "Munnar", summaryEn: "Tea hills and cooler air above the plains." },
    { slug: "fort-kochi", nameEn: "Fort Kochi", summaryEn: "Chinese fishing nets, heritage lanes, and spice markets." },
  ],
  rajasthan: [
    { slug: "jaipur", nameEn: "Jaipur", summaryEn: "Pink City forts, bazaars, and Hawa Mahal." },
    { slug: "udaipur", nameEn: "Udaipur", summaryEn: "Lake Pichola, City Palace, and romantic old-town walks." },
    { slug: "jaisalmer", nameEn: "Jaisalmer", summaryEn: "Golden Fort and Thar desert camps — nights get cold." },
  ],
};
