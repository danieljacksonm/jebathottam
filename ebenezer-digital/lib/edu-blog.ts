/**
 * Educational digital journal catalog.
 * Deterministic generator → 1000+ simple, detailed explainers (5th-grade English).
 */

export type EduAngle =
  | "how-it-works"
  | "everyday-life"
  | "tiny-parts"
  | "simple-history"
  | "stay-safe"
  | "myths-vs-truth"
  | "explore-more";

export type EduTopic = {
  key: string;
  titleBase: string;
  category: string;
  metaphor: string;
  what: string;
  steps: string[];
  funFacts: string[];
  whyItMatters: string;
  images: string[]; // 5+ Unsplash URLs
};

export const EDU_ANGLES: { id: EduAngle; label: string; titlePrefix: string }[] = [
  { id: "how-it-works", label: "How it works", titlePrefix: "How" },
  { id: "everyday-life", label: "In daily life", titlePrefix: "Where you see" },
  { id: "tiny-parts", label: "Tiny parts", titlePrefix: "The tiny parts inside" },
  { id: "simple-history", label: "Simple history", titlePrefix: "A simple history of" },
  { id: "stay-safe", label: "Stay safe", titlePrefix: "How to stay safe with" },
  { id: "myths-vs-truth", label: "Myths vs truth", titlePrefix: "Myths and truth about" },
  { id: "explore-more", label: "Explore more", titlePrefix: "Curious questions about" },
];

/** Curated Unsplash photos (stable IDs) grouped by theme */
const IMG = {
  electricity: [
    "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=2000&q=88",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=2000&q=88",
    "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=2000&q=88",
    "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=2000&q=88",
    "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=2000&q=88",
    "https://images.unsplash.com/photo-1470116945706-e6bf5d5a53ca?auto=format&fit=crop&w=2000&q=88",
  ],
  internet: [
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2000&q=88",
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=2000&q=88",
    "https://images.unsplash.com/photo-1544197150-b99a580bb7a2?auto=format&fit=crop&w=2000&q=88",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=2000&q=88",
    "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=2000&q=88",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=2000&q=88",
  ],
  wifi: [
    "https://images.unsplash.com/photo-1606904825846-647eb07f5eeb?auto=format&fit=crop&w=2000&q=88",
    "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=2000&q=88",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=2000&q=88",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=2000&q=88",
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=2000&q=88",
    "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=2000&q=88",
  ],
  ai: [
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=2000&q=88",
    "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=2000&q=88",
    "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=2000&q=88",
    "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=2000&q=88",
    "https://images.unsplash.com/photo-1675557009875-436f71457475?auto=format&fit=crop&w=2000&q=88",
    "https://images.unsplash.com/photo-1655720033654-a4239f728c49?auto=format&fit=crop&w=2000&q=88",
  ],
  computer: [
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=2000&q=88",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=2000&q=88",
    "https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=2000&q=88",
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=2000&q=88",
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=2000&q=88",
    "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=2000&q=88",
  ],
  phone: [
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=2000&q=88",
    "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=2000&q=88",
    "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?auto=format&fit=crop&w=2000&q=88",
    "https://images.unsplash.com/photo-1592890288564-76628a30a657?auto=format&fit=crop&w=2000&q=88",
    "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=2000&q=88",
    "https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=2000&q=88",
  ],
  security: [
    "https://images.unsplash.com/photo-1563986768494-4dee2763ff36?auto=format&fit=crop&w=2000&q=88",
    "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=2000&q=88",
    "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=2000&q=88",
    "https://images.unsplash.com/photo-1633265486064-086b219458ec?auto=format&fit=crop&w=2000&q=88",
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=2000&q=88",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=2000&q=88",
  ],
  cloud: [
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2000&q=88",
    "https://images.unsplash.com/photo-1544197150-b99a580bb7a2?auto=format&fit=crop&w=2000&q=88",
    "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=2000&q=88",
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=2000&q=88",
    "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=2000&q=88",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=2000&q=88",
  ],
  web: [
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=2000&q=88",
    "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=2000&q=88",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=2000&q=88",
    "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=2000&q=88",
    "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=2000&q=88",
    "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=2000&q=88",
  ],
  data: [
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=2000&q=88",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=2000&q=88",
    "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=2000&q=88",
    "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=2000&q=88",
    "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=2000&q=88",
    "https://images.unsplash.com/photo-1639322537504-6427a16b0a91?auto=format&fit=crop&w=2000&q=88",
  ],
  business: [
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=2000&q=88",
    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=2000&q=88",
    "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=2000&q=88",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=2000&q=88",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=2000&q=88",
    "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=2000&q=88",
  ],
};

function t(
  key: string,
  titleBase: string,
  category: string,
  metaphor: string,
  what: string,
  steps: string[],
  funFacts: string[],
  whyItMatters: string,
  images: string[]
): EduTopic {
  return { key, titleBase, category, metaphor, what, steps, funFacts, whyItMatters, images };
}

/** 150+ digital learning topics */
export const EDU_TOPICS: EduTopic[] = [
  t("electricity", "electricity", "Energy & Devices", "like a busy river of tiny energy packets", "Electricity is energy that can travel through wires and make lights, fans, and phones work.", ["A power plant or battery makes energy ready to move.", "Wires carry that energy like roads for cars.", "Your switch opens or closes the road.", "The device uses the energy to do work, then the circuit continues."], ["Lightning is a giant spark of electricity in the sky.", "Your body can feel a tiny shock because nerves use electricity too."], "Without electricity, most digital tools would be dark and quiet.", IMG.electricity),
  t("battery", "a battery", "Energy & Devices", "like a lunch box that stores energy for later", "A battery keeps chemical energy ready and turns it into electricity when you need it.", ["Chemicals inside hold energy.", "Two ends (plus and minus) create a path.", "When you connect a device, energy flows.", "After long use, the chemicals get tired and need recharge or replace."], ["Phone batteries are usually lithium-ion packs.", "Cold weather can make batteries feel weaker."], "Batteries let digital life move with you.", IMG.electricity),
  t("solar-power", "solar power", "Energy & Devices", "like catching sunshine in a special net", "Solar panels turn sunlight into electricity for homes, phones, and even street lights.", ["Sunlight hits the panel.", "Tiny parts in the panel free up electrons.", "Those electrons move as electricity.", "A battery or grid stores or shares the power."], ["Even cloudy days give some light energy.", "Satellites use solar panels in space."], "Clean power helps digital systems grow without dirty smoke.", IMG.electricity),
  t("circuit", "an electric circuit", "Energy & Devices", "like a circular toy train track", "A circuit is a complete loop that electricity can travel around.", ["Start at the power source.", "Travel through wires.", "Pass through a useful device like a bulb.", "Return to finish the loop."], ["If the loop breaks, the device stops.", "A short circuit is when electricity takes a dangerous shortcut."], "Every digital gadget hides many tiny circuits.", IMG.electricity),
  t("led-light", "an LED light", "Energy & Devices", "like a tiny bright pebble that sips power", "An LED makes light when electricity passes through a special material.", ["Electricity enters the LED.", "Electrons jump and release light.", "Less heat is wasted than old bulbs.", "Colors depend on the material."], ["LEDs can last for years.", "Phone screens use millions of tiny LEDs or similar pixels."], "LEDs save power in homes and screens.", IMG.electricity),
  t("internet", "the internet", "Internet & Networks", "like a giant library of roads connecting every computer", "The internet is a worldwide network that lets devices share messages, pictures, and videos.", ["Your device joins a local network.", "Data is cut into small packets.", "Routers choose paths across the world.", "Packets reassemble so you see a webpage."], ["No single company owns the whole internet.", "Fiber cables under oceans carry huge amounts of data."], "The internet is how digital products and news reach people.", IMG.internet),
  t("wifi", "Wi‑Fi", "Internet & Networks", "like invisible radio waves in your room", "Wi‑Fi sends internet data through the air using radio signals, so you do not need a cable to every device.", ["Your router talks to the internet with a wire or fiber.", "It broadcasts a Wi‑Fi signal.", "Your phone listens and replies.", "Packets hop through the air into apps."], ["Wi‑Fi is not the internet itself—it is one doorway.", "Thicker walls can weaken the signal."], "Wi‑Fi makes learning, shopping, and work easy at home.", IMG.wifi),
  t("mobile-data", "mobile data", "Internet & Networks", "like borrowing internet from tall phone towers", "Mobile data uses cell towers so your phone can go online while you walk outside.", ["Your phone finds a nearby tower.", "It sends and receives radio signals.", "The tower connects to the wider internet.", "Your plan counts how much data you use."], ["4G and 5G are different speeds of the same idea.", "Airplane mode turns these radios off."], "Mobile data keeps digital tools with you on the road.", IMG.phone),
  t("router", "a router", "Internet & Networks", "like a traffic police officer for data cars", "A router decides where each data packet should go next so messages find the right computer.", ["Packet arrives with an address.", "Router checks a map of paths.", "It forwards the packet to the next stop.", "This repeats until the packet arrives."], ["Home Wi‑Fi boxes are small routers.", "Big internet routers can fill whole rooms."], "Without routers, the internet would be stuck traffic.", IMG.internet),
  t("ip-address", "an IP address", "Internet & Networks", "like a house number for devices", "An IP address is a number label that helps the internet find your device.", ["Device joins a network.", "It gets a temporary or fixed number.", "Packets use that number as a destination.", "When you leave Wi‑Fi, the number can change."], ["IPv4 and IPv6 are two numbering systems.", "Websites also use names like ebenezerdigital.com."], "Addresses make sure your chat reaches you, not a stranger.", IMG.internet),
  t("dns", "DNS", "Internet & Networks", "like a phone book for websites", "DNS turns easy names (like google.com) into computer numbers (IP addresses).", ["You type a website name.", "Your device asks a DNS helper.", "DNS returns the matching number.", "Your browser connects to that number."], ["DNS answers are often remembered for speed.", "If DNS fails, sites look 'down' even if servers are fine."], "Friendly names make the web usable for everyone.", IMG.web),
  t("fiber-cable", "fiber internet", "Internet & Networks", "like shooting light messages through glass hair", "Fiber cables send data as flashes of light through thin glass strands.", ["Light turns on and off in patterns.", "Glass fiber guides the light.", "A receiver turns light back into electricity.", "Your router shares the result as Wi‑Fi."], ["Ocean fibers connect continents.", "Light is faster and cleaner over long distances than old copper alone."], "Fiber helps videos and cloud apps feel smooth.", IMG.internet),
  t("packet", "data packets", "Internet & Networks", "like cutting a letter into many postcards", "Big files are split into packets so they can travel on different paths and rejoin later.", ["File is sliced into pieces.", "Each piece gets labels.", "Pieces travel, maybe on different routes.", "Your device rebuilds the file."], ["If one packet is lost, only that piece is asked again.", "This design keeps the internet flexible."], "Packets are why the internet survives busy traffic.", IMG.internet),
  t("ai", "artificial intelligence", "AI & Smart Tools", "like a student that learns patterns from many examples", "AI is computer software that finds patterns and makes helpful guesses, like suggesting words or sorting photos.", ["People collect examples (data).", "A model studies the patterns.", "You ask a question or give a photo.", "The model predicts a useful answer."], ["AI is not magic and can make mistakes.", "It learns from data people choose."], "AI can explain hard topics simply—try our /ai helper after reading.", IMG.ai),
  t("chatgpt-style-ai", "chat AI helpers", "AI & Smart Tools", "like a librarian who has read many books", "Chat AI tools read your question and write a reply using patterns learned from lots of text.", ["You type a prompt.", "The model predicts likely next words.", "It builds a full answer step by step.", "You check if the answer makes sense."], ["Always verify important facts.", "Clear questions get clearer answers."], "Use Ebenezer AI at /ai to explore any idea from this journal.", IMG.ai),
  t("machine-learning", "machine learning", "AI & Smart Tools", "like practicing cricket until your aim improves", "Machine learning means a program improves by seeing many examples instead of only following fixed rules.", ["Show many labeled examples.", "The model adjusts internal settings.", "Test it on new examples.", "Use it when it is good enough."], ["More good data often helps.", "Bad or biased data can teach wrong lessons."], "Learning systems power recommendations and spam filters.", IMG.ai),
  t("neural-network", "a neural network", "AI & Smart Tools", "like a team of tiny decision makers passing notes", "A neural network is a layered set of math units that transform inputs into useful outputs.", ["Input numbers enter the first layer.", "Each layer mixes the signals.", "Later layers spot bigger patterns.", "The last layer gives the answer."], ["The name is inspired by brain cells, but it is still math on computers.", "Training needs lots of computing power."], "Neural nets help with speech, pictures, and language.", IMG.ai),
  t("prompting", "AI prompting", "AI & Smart Tools", "like giving clear instructions to a helper", "A prompt is the text you give an AI so it knows what you want.", ["Say the goal clearly.", "Add age level or style if needed.", "Give examples when helpful.", "Ask follow-ups to improve the answer."], ["Short vague prompts make vague answers.", "You stay the boss—AI is the assistant."], "Practice prompting on /ai after each journal lesson.", IMG.ai),
  t("computer", "a computer", "Computers & Code", "like a super-fast filing clerk", "A computer follows instructions to store, calculate, and show information.", ["Input comes from keyboard, touch, or network.", "The processor calculates.", "Memory holds work in progress.", "Storage keeps files for later."], ["Phones are small computers.", "Even washing machines may hide tiny computers."], "Computers run websites, shops, and learning tools.", IMG.computer),
  t("cpu", "a CPU", "Computers & Code", "like the brain of the computer", "The CPU is the chip that runs instructions one after another at great speed.", ["Fetch an instruction.", "Decode what it means.", "Do the action.", "Store the result."], ["Clock speed is only one measure of power.", "More cores can share work."], "Faster CPUs make apps feel snappy.", IMG.computer),
  t("ram", "RAM", "Computers & Code", "like a desk where you keep open books", "RAM is short-term memory that holds the apps and files you are using right now.", ["App opens and loads into RAM.", "CPU reads and writes quickly.", "Closing apps frees desk space.", "Turning off clears RAM."], ["More RAM helps many tabs at once.", "RAM is different from long-term storage."], "Enough RAM keeps digital work smooth.", IMG.computer),
  t("storage-ssd", "SSD storage", "Computers & Code", "like a tidy bookshelf that opens instantly", "An SSD stores files in memory chips so opening apps and documents is quick.", ["Files are saved as electric patterns in chips.", "No spinning disk is needed.", "The computer asks for a file by address.", "The SSD returns it fast."], ["SSDs are quieter than old hard disks.", "Still back up important files."], "Fast storage makes websites and tools feel ready.", IMG.computer),
  t("operating-system", "an operating system", "Computers & Code", "like a school principal organizing every class", "An operating system (like Windows, Android, or iOS) manages apps, files, and hardware.", ["It starts when you turn the device on.", "It shares CPU and memory fairly.", "It talks to screens and keyboards.", "It keeps apps in their own spaces."], ["Without an OS, apps would fight for hardware.", "Updates fix bugs and improve safety."], "A good OS is the stage for every digital product.", IMG.computer),
  t("algorithm", "an algorithm", "Computers & Code", "like a recipe with clear steps", "An algorithm is a step-by-step plan a computer follows to solve a problem.", ["Define the goal.", "List ordered steps.", "Handle special cases.", "Stop when finished."], ["Search and sort use famous algorithms.", "Good algorithms save time and electricity."], "Every app feature hides algorithms.", IMG.computer),
  t("binary", "binary code", "Computers & Code", "like a light switch language of on and off", "Binary uses 0 and 1 to represent all computer information.", ["On/off patterns become bits.", "Eight bits make a byte.", "Bytes build letters, pictures, and songs.", "Programs translate human ideas into binary actions."], ["Even videos are huge lists of bits.", "Compression removes repeated patterns."], "Binary is the shared language of digital machines.", IMG.computer),
  t("programming", "programming", "Computers & Code", "like writing clear orders for a robot", "Programming means creating instructions in a language computers can follow.", ["Choose a language like JavaScript or Python.", "Write steps and rules.", "Test and fix mistakes (bugs).", "Share the program as an app or website."], ["Programmers collaborate with designers and users.", "Start small: print a message, then grow."], "Programming builds the products in our store and studio.", IMG.computer),
  t("smartphone", "a smartphone", "Phones & Apps", "like a tiny computer that fits in a pocket", "A smartphone combines calling, camera, internet, and apps in one device.", ["Touch screen takes your taps.", "Chips run apps.", "Radios talk to towers and Wi‑Fi.", "Sensors notice motion and light."], ["Always update apps for safety.", "Brightness and battery are a trade-off."], "Phones are the first digital tool for many families.", IMG.phone),
  t("app", "a mobile app", "Phones & Apps", "like a mini shop inside your phone", "An app is a program made for a phone or tablet to do a special job.", ["You install it from a store.", "It uses phone features with permission.", "It may talk to internet servers.", "You update it to get fixes."], ["Read permissions before installing.", "Delete apps you do not use."], "Businesses use apps and websites to serve customers.", IMG.phone),
  t("touchscreen", "a touchscreen", "Phones & Apps", "like a glass that feels your finger", "A touchscreen senses where you touch and turns that into taps, swipes, and typing.", ["Finger changes an electric field on the glass.", "Sensors map the point.", "Software decides the action.", "The screen redraws pixels."], ["Gloves can block some screens.", "Clean screens work better."], "Touch made computers friendlier for everyone.", IMG.phone),
  t("camera-sensor", "a phone camera", "Phones & Apps", "like a grid of tiny light buckets", "Phone cameras turn light into numbers that become photos.", ["Lens focuses light.", "Sensor pixels measure brightness and color.", "Software cleans noise and sharpens.", "File is saved or shared."], ["More megapixels is not always better pictures.", "Light matters more than hype."], "Photos power social apps and online shops.", IMG.phone),
  t("password", "passwords", "Safety Online", "like a secret door key made of letters", "A password proves it is probably you before opening an account.", ["Choose a long unique phrase.", "Do not reuse it everywhere.", "Add a second check if possible.", "Store it in a safe manager."], ["Hackers try common passwords first.", "Never share OTP codes."], "Strong passwords protect your digital life and business.", IMG.security),
  t("2fa", "two-factor authentication", "Safety Online", "like needing both a key and a second stamp", "2FA asks for a second proof, like a code on your phone, after the password.", ["Enter password.", "App or SMS gives a short code.", "You type the code.", "Access opens only if both match."], ["Authenticator apps are safer than SMS when possible.", "Do not approve mystery login prompts."], "2FA blocks many account takeovers.", IMG.security),
  t("phishing", "phishing", "Safety Online", "like a fake letter that pretends to be your bank", "Phishing tricks you into giving secrets by pretending to be a trusted person or site.", ["Message creates fear or urgency.", "Link goes to a fake lookalike page.", "You type a password.", "Attacker steals it."], ["Check the real web address carefully.", "Banks rarely ask for passwords in chat."], "Spotting phishing protects families and shops.", IMG.security),
  t("https", "HTTPS", "Safety Online", "like a sealed envelope for website traffic", "HTTPS encrypts data between your browser and a website so strangers on the network cannot easily read it.", ["Browser and site agree on secret keys.", "Your data is scrambled on the way.", "Only the site can unscramble it.", "The lock icon hints this is active."], ["HTTPS does not make a site honest—only private in transit.", "Still avoid shady websites."], "Good shops and journals use HTTPS.", IMG.security),
  t("malware", "malware", "Safety Online", "like a germ for computers", "Malware is harmful software that can steal data, spy, or break devices.", ["Arrives via risky downloads or links.", "Runs without you wanting it.", "May lock files or show fake warnings.", "Removal needs updates and careful tools."], ["Keep systems updated.", "Do not install cracked apps."], "Clean devices keep digital work trustworthy.", IMG.security),
  t("cloud", "the cloud", "Cloud & Data", "like renting a locker in a giant safe building", "The cloud means using powerful computers in data centers over the internet instead of only your laptop.", ["Your file uploads to a remote server.", "That server stores and processes it.", "You open it from any device with login.", "Backups can protect against loss."], ["Cloud is still real machines in real buildings.", "Choose strong passwords for cloud accounts."], "Cloud powers SaaS tools like Ebenezer billing software.", IMG.cloud),
  t("server", "a server", "Cloud & Data", "like a restaurant kitchen that serves many tables", "A server is a computer that waits for requests and sends answers to many users.", ["Client asks for a page or file.", "Server finds or builds the answer.", "It sends the response.", "Logs help fix problems."], ["Websites need servers (or serverless platforms).", "Heavy traffic needs stronger kitchens."], "Servers keep digital products online day and night.", IMG.cloud),
  t("database", "a database", "Cloud & Data", "like a super organized notebook with search", "A database stores information in structured tables so apps can find it quickly.", ["Data is saved in rows and columns.", "Queries ask questions.", "Indexes speed searches.", "Backups protect against mistakes."], ["Your shop stock can live in a database.", "Good design prevents duplicate mess."], "Databases quietly run banks, schools, and stores.", IMG.data),
  t("backup", "backups", "Cloud & Data", "like photocopying your homework before a storm", "A backup is a second copy of important files kept somewhere safe.", ["Choose what matters.", "Copy to another disk or cloud.", "Test that restore works.", "Repeat on a schedule."], ["One copy is not a backup.", "Ransomware makes backups precious."], "Backups save businesses from heartbreak.", IMG.data),
  t("big-data", "big data", "Cloud & Data", "like counting every grain of rice in a market", "Big data means collecting and studying huge amounts of information to spot useful patterns.", ["Collect events and records.", "Clean messy entries.", "Analyze with charts or AI.", "Act on clear insights."], ["Privacy rules still matter.", "More data is not always wiser data."], "Shops use data to understand customers kindly.", IMG.data),
  t("website", "a website", "Web & Design", "like a digital shopfront open all day", "A website is a set of pages hosted on the internet that people can visit with a browser.", ["Designer plans structure.", "Developer builds pages.", "Hosting puts files on a server.", "Domain name points visitors there."], ["Mobile-friendly sites help more people.", "Clear contact forms bring enquiries."], "Ebenezer Digital builds websites that win trust.", IMG.web),
  t("browser", "a web browser", "Web & Design", "like a window that understands the web’s language", "A browser (Chrome, Edge, Firefox, Safari) fetches pages and shows them as text, images, and buttons.", ["You enter an address.", "Browser asks DNS and server.", "It reads HTML, CSS, and JavaScript.", "It paints the page on your screen."], ["Extensions can help or slow you down.", "Keep browsers updated."], "Browsers are the doorway to news, shops, and learning.", IMG.web),
  t("html-css", "HTML and CSS", "Web & Design", "like house structure and paint", "HTML builds the structure of a page; CSS chooses colors, sizes, and layout.", ["HTML tags mark headings and paragraphs.", "CSS styles how they look.", "Together they make readable pages.", "JavaScript can add interactivity later."], ["Semantic HTML helps screen readers.", "Good contrast helps reading."], "Clean HTML/CSS is the craft behind premium sites.", IMG.web),
  t("seo", "SEO", "Web & Design", "like putting clear signs so search engines find your shop", "SEO means making pages clear and useful so people can discover them on Google and Bing.", ["Use honest titles and headings.", "Write helpful content people finish.", "Add descriptions and images with meaning.", "Earn links by being useful."], ["Tricks that spam search engines can backfire.", "Speed and mobile layout matter."], "This journal is written to be searchable and shareable.", IMG.web),
  t("domain-name", "a domain name", "Web & Design", "like your brand’s easy-to-say address", "A domain name is the memorable name that points to your website’s computers.", ["You register a name.", "DNS maps it to servers.", "Visitors type the name.", "Email can use the same brand."], [".com is common; .info can host a journal; .store can host products.", "Keep renewal dates safe."], "Ebenezer uses domains with clear jobs for each product.", IMG.web),
  t("hosting", "web hosting", "Web & Design", "like renting shelf space for your site files", "Hosting is the service that keeps your website files on computers that stay online.", ["Upload or deploy your site.", "Server answers visitors 24/7.", "CDN copies can speed far-away users.", "Backups and SSL keep it safer."], ["Cheap hosting can be slow.", "Choose plans that match traffic."], "Reliable hosting keeps customers from bouncing away.", IMG.cloud),
  t("ecommerce", "online shops", "Business Digital", "like a market stall that never closes", "Ecommerce lets people browse products and pay online, then download or receive goods.", ["Show clear product pages.", "Add cart and checkout.", "Confirm payment.", "Deliver file or parcel and support."], ["Trust badges and policies help sales.", "Mobile checkout must be simple."], "Visit /products for Ebenezer digital tools and kits.", IMG.business),
  t("digital-marketing", "digital marketing", "Business Digital", "like inviting neighbors with helpful posters online", "Digital marketing means using websites, search, social posts, and email to reach the right people honestly.", ["Know your audience.", "Share useful content.", "Measure what works.", "Improve weekly."], ["Shouting ads without value feels spammy.", "Stories and tutorials build trust."], "This journal itself is marketing through teaching.", IMG.business),
  t("whatsapp-business", "WhatsApp Business", "Business Digital", "like a neat shop counter inside chat", "WhatsApp Business helps shops reply to customers with catalogs, quick replies, and labels.", ["Set a business profile.", "Save common answers.", "Share catalog links.", "Track chats you must follow up."], ["Reply fast but politely.", "Keep customer data private."], "Pair chat with a real website for stronger trust.", IMG.business),
  t("pos-billing", "POS billing", "Business Digital", "like a smart cash counter", "A Point of Sale system records sales, stock, and bills in one place for a shop.", ["Cashier scans or selects items.", "Price and tax calculate.", "Payment is taken.", "Stock reduces automatically."], ["Paper-only shops lose track easily.", "Cloud POS can show reports on phone."], "Try Ebenezer SaaS ideas from the store for shop billing.", IMG.business),
  t("ui-kit", "a UI kit", "Business Digital", "like a box of ready Lego blocks for screens", "A UI kit gives ready buttons, layouts, and styles so you can design apps faster.", ["Pick a kit that matches your brand.", "Reuse components.", "Keep spacing consistent.", "Build pages without reinventing every piece."], ["Consistency looks professional.", "Kits still need your content and offer."], "See Creator Landing Kit and Brand Kit in /products.", IMG.web),
  t("api", "an API", "Computers & Code", "like a waiter taking orders between kitchen and table", "An API lets one program request data or actions from another in an agreed way.", ["Client sends a request.", "Server checks permission.", "Server returns data or an error.", "Client shows the result."], ["Public APIs power maps and payments.", "Keys must stay secret."], "APIs connect news, payments, and AI tools.", IMG.computer),
  t("json", "JSON data", "Computers & Code", "like a labeled lunch box for information", "JSON is a simple text format computers use to share structured data.", ["Curly braces group objects.", "Keys name each field.", "Arrays hold lists.", "Apps read JSON easily."], ["Many APIs speak JSON.", "It is readable by humans too."], "JSON quietly moves data across the modern web.", IMG.data),
  t("cookie-web", "website cookies", "Safety Online", "like a sticky note a site leaves in your browser", "Cookies are small text notes sites store so they can remember settings or logins.", ["Site asks to store a cookie.", "Browser saves it.", "On return, cookie is sent back.", "You can clear cookies anytime."], ["Not all cookies are bad.", "Tracking cookies need your awareness."], "Understanding cookies helps you choose privacy settings.", IMG.security),
  t("email", "email", "Internet & Networks", "like a digital letter with an address", "Email sends messages across the internet to someone’s inbox address.", ["You write and send.", "Servers forward the message.", "Recipient’s server stores it.", "They open it in an app."], ["Spam filters try to block junk.", "Phishing loves fake emails."], "Email still runs business and learning.", IMG.internet),
  t("cloud-storage", "cloud storage", "Cloud & Data", "like a school locker you can open from any campus", "Cloud storage keeps your files on remote servers you can open with login.", ["Upload a file.", "It syncs to the cloud.", "Other devices download it.", "Sharing links can invite friends."], ["Check sharing permissions.", "Large videos use more space."], "Cloud storage supports teams and creators.", IMG.cloud),
  t("streaming", "video streaming", "Internet & Networks", "like drinking water from a tap instead of filling a huge tank first", "Streaming plays video while more of it is still downloading.", ["Player requests the next chunk.", "Network delivers pieces.", "Buffer holds a few seconds.", "Picture continues smoothly."], ["Slow Wi‑Fi causes buffering.", "Lower quality uses less data."], "Streaming changed how we learn and watch news.", IMG.internet),
  t("bluetooth", "Bluetooth", "Phones & Apps", "like a quiet short-range walkie-talkie", "Bluetooth connects nearby devices like earbuds and keyboards without Wi‑Fi internet.", ["Devices pair with a code.", "They share a short radio link.", "Audio or data flows.", "Range is usually a few meters."], ["Bluetooth is not Wi‑Fi.", "Keep pairing private in public."], "Bluetooth makes gadgets feel wireless and simple.", IMG.phone),
  t("gps", "GPS", "Phones & Apps", "like asking space clocks where you stand", "GPS uses satellite signals so your phone can estimate your location on Earth.", ["Satellites broadcast time signals.", "Phone measures delays.", "Math finds your position.", "Maps draw you as a blue dot."], ["Tall buildings can confuse signals.", "Location sharing needs care."], "GPS powers maps, delivery, and safety apps.", IMG.phone),
  t("qr-code", "QR codes", "Phones & Apps", "like a barcode square that opens a door online", "A QR code stores a link or text as a pattern your camera can read.", ["Camera sees the square.", "App decodes the pattern.", "It opens a URL or shows text.", "You confirm before entering passwords."], ["Fake QR stickers can be dangerous.", "Check the link preview."], "Shops use QR for menus, UPI, and catalogs.", IMG.phone),
  t("vpn", "a VPN", "Safety Online", "like a private tunnel through a crowded street", "A VPN encrypts your internet traffic and sends it through a remote server.", ["App creates an encrypted tunnel.", "Your traffic exits from another place.", "Sites see the VPN address.", "You still need safe browsing habits."], ["Free strange VPNs can be risky.", "VPN is not total invisibility."], "VPNs help on public Wi‑Fi when chosen carefully.", IMG.security),
  t("firewall", "a firewall", "Safety Online", "like a gate guard for network doors", "A firewall allows or blocks traffic based on safety rules.", ["Packet arrives.", "Rules check if it is allowed.", "Safe traffic passes.", "Suspicious traffic is stopped."], ["Home routers include basic firewalls.", "Servers need stronger rules."], "Firewalls are a first shield for digital systems.", IMG.security),
  t("encryption", "encryption", "Safety Online", "like turning a diary into secret code", "Encryption scrambles data so only people with the right key can read it.", ["Plain text enters.", "Algorithm mixes it with a key.", "Ciphertext travels or sits in storage.", "Key unlocks it again."], ["Strong encryption protects chats and payments.", "Lost keys can lock you out too."], "Modern digital trust depends on encryption.", IMG.security),
  t("pixel", "pixels", "Web & Design", "like tiny colored tiles that make a mosaic", "A pixel is one small colored dot on a screen; many pixels build pictures.", ["Each pixel shows red, green, blue light.", "Together they form images.", "More pixels can look sharper.", "Designers plan layouts in pixel grids."], ["Zooming photos can show pixel blocks.", "Retina screens pack pixels densely."], "Pixels are the paint of every digital image.", IMG.web),
  t("resolution", "screen resolution", "Web & Design", "like counting how many tiles fit on a wall", "Resolution tells how many pixels a screen has across and down.", ["Width × height counts pixels.", "Higher counts can look clearer.", "Apps scale layouts to fit.", "Heavy resolutions need more power."], ["Match content size to screens.", "Huge images slow websites."], "Good resolution choices keep sites fast and clear.", IMG.web),
  t("ux", "user experience", "Web & Design", "like making a classroom easy to move through", "UX means how easy and pleasant a product feels when people use it.", ["Learn user goals.", "Remove confusing steps.", "Test with real people.", "Improve based on feedback."], ["Pretty design without clarity fails.", "Fast pages feel kinder."], "Ebenezer designs for clarity first.", IMG.web),
  t("accessibility", "digital accessibility", "Web & Design", "like building ramps for every visitor", "Accessibility means websites and apps work for people with different abilities.", ["Use readable text sizes.", "Add image descriptions.", "Support keyboard navigation.", "Keep strong color contrast."], ["Captions help many learners.", "Accessible sites are often clearer for everyone."], "Inclusive design grows your audience.", IMG.web),
  t("cdn", "a CDN", "Cloud & Data", "like keeping snacks in many neighborhood shops", "A CDN copies website files to servers around the world so visitors download from nearby.", ["Origin stores the master files.", "Edge servers cache copies.", "Visitor is routed nearby.", "Pages load faster."], ["Images and scripts benefit most.", "Cache rules must refresh updates."], "CDNs help global readers reach your journal quickly.", IMG.cloud),
  t("latency", "internet latency", "Internet & Networks", "like waiting for an echo in a canyon", "Latency is the delay before data starts arriving; lower latency feels snappier.", ["Signal travels distance.", "Routers add tiny waits.", "Servers think.", "Your app shows the result."], ["Gaming and calls hate high latency.", "Fiber and good routing help."], "Understanding latency explains lag.", IMG.internet),
  t("bandwidth", "bandwidth", "Internet & Networks", "like the width of a road for data cars", "Bandwidth is how much data can flow per second on your connection.", ["Wide roads move more cars.", "Video needs more bandwidth.", "Many devices share the road.", "Upgrades widen capacity."], ["Mbps measures speed.", "Wi‑Fi interference can waste bandwidth."], "Enough bandwidth keeps families streaming and learning.", IMG.internet),
  t("iot", "the Internet of Things", "Phones & Apps", "like giving everyday objects a tiny phone", "IoT means connecting sensors and devices—like bulbs or meters—to the internet.", ["Device collects data.", "It sends updates online.", "App shows control or alerts.", "Automation can react."], ["Change default passwords on IoT gadgets.", "Not everything needs to be online."], "IoT can save energy when used wisely.", IMG.phone),
  t("robotics-simple", "simple robots", "AI & Smart Tools", "like toys that sense and move with rules", "A simple robot uses sensors, a brain (computer), and motors to act in the world.", ["Sense the environment.", "Decide with a program.", "Move motors or arms.", "Repeat and learn limits."], ["School robots teach coding.", "Factory robots repeat precise tasks."], "Robotics mixes electricity, code, and design.", IMG.ai),
  t("chatbot", "chatbots", "AI & Smart Tools", "like a receptionist who answers common questions", "A chatbot replies to typed questions using rules or AI models.", ["User asks.", "Bot matches intent.", "It answers or escalates to a human.", "Logs improve future replies."], ["Say when a bot is a bot.", "Hard problems need people."], "Businesses use chatbots; you can practice questions on /ai.", IMG.ai),
  t("recommendation", "recommendation systems", "AI & Smart Tools", "like a friend who suggests the next book", "Recommendation systems suggest videos, products, or articles based on patterns.", ["Collect what people liked.", "Find similar users or items.", "Rank suggestions.", "Show a short list."], ["Filters can create bubbles.", "You can reset interests sometimes."], "Our journal recommends related lessons in a chain.", IMG.ai),
  t("data-privacy", "data privacy", "Safety Online", "like keeping your diary closed", "Data privacy means controlling who can see your personal information.", ["Share less by default.", "Read permissions.", "Use privacy settings.", "Ask companies to delete what you can."], ["Photos can reveal locations.", "Children need extra care online."], "Respecting privacy builds digital trust.", IMG.security),
  t("open-source", "open source", "Computers & Code", "like a community cookbook everyone can improve", "Open source software shares its recipe (code) so others can study and improve it.", ["Code is public.", "Licenses set rules.", "Community fixes bugs.", "Companies may offer paid support."], ["Open source powers much of the internet.", "You still must follow the license."], "Learning from open code grows skills fast.", IMG.computer),
  t("git", "Git version control", "Computers & Code", "like save points in a video game for code", "Git remembers versions of your project so you can undo mistakes and work in a team.", ["Save a snapshot (commit).", "Branch to try ideas.", "Merge good changes.", "Push to a shared place."], ["Commit messages should explain why.", "Never commit secret keys."], "Git is daily tool for professional builders.", IMG.computer),
  t("frontend-backend", "frontend and backend", "Web & Design", "like a restaurant dining room and kitchen", "Frontend is what you see; backend is the hidden logic, database, and servers.", ["Frontend draws buttons and pages.", "Backend checks rules and data.", "APIs connect them.", "Both must stay secure."], ["A pretty frontend with a weak backend fails.", "Teams often specialize."], "Full products need both sides working together.", IMG.web),
  t("responsive-design", "responsive design", "Web & Design", "like water taking the shape of every glass", "Responsive design makes websites look good on phones, tablets, and desktops.", ["Start with mobile layout.", "Add breakpoints for larger screens.", "Flexible images scale.", "Test on real devices."], ["Most Indian users browse on phones.", "Tiny buttons frustrate people."], "Our sites and kits care about mobile first.", IMG.web),
  t("color-contrast", "color contrast", "Web & Design", "like chalk that must show on the blackboard", "Contrast is how clearly text stands out from its background.", ["Dark on light (or reverse) reads easier.", "Check small text carefully.", "Brand colors must still be readable.", "Icons need clear shapes."], ["Low contrast looks stylish but fails users.", "Accessibility tools can measure contrast."], "Readable design shows respect.", IMG.web),
  t("typography-web", "web typography", "Web & Design", "like choosing a clear voice for the page", "Typography is how fonts, sizes, and spacing help reading on screens.", ["Pick limited font families.", "Make headings clearly bigger.", "Keep line length comfortable.", "Use spacing to breathe."], ["Fancy fonts can tire eyes.", "System fonts load fast."], "This journal uses strong editorial type for trust.", IMG.web),
  t("analytics", "website analytics", "Business Digital", "like a visitor guest book with charts", "Analytics tools count visits and actions so you learn what helps people.", ["Add a careful tracking snippet.", "Watch popular pages.", "Find drop-off steps.", "Improve those steps."], ["Respect consent laws.", "Numbers need human stories too."], "Measure to serve, not to spy.", IMG.business),
  t("conversion", "conversion rate", "Business Digital", "like counting how many visitors become customers", "Conversion means a visitor does a goal action: enquire, buy, or subscribe.", ["Set a clear goal.", "Remove friction.", "Test headlines and forms.", "Track results weekly."], ["More traffic is useless if nobody acts.", "Trust increases conversion."], "Product pages on /products aim for clear next steps.", IMG.business),
  t("landing-page", "a landing page", "Business Digital", "like a focused poster with one request", "A landing page has one job: explain an offer and invite one action.", ["Promise a clear benefit.", "Show proof.", "Explain what happens next.", "Put one strong button."], ["Too many links distract.", "Speed matters."], "Creator Landing Kit in the store helps you start fast.", IMG.business),
  t("brand-kit", "a brand kit", "Business Digital", "like a school uniform for your business look", "A brand kit collects logo rules, colors, and fonts so everything looks consistent.", ["Pick primary colors.", "Choose type pairings.", "Set logo clear space.", "Reuse social templates."], ["Random styles look unprofessional.", "Consistency builds memory."], "Brand Kit Essentials lives in /products.", IMG.business),
  t("newsletter", "email newsletters", "Business Digital", "like a friendly weekly newspaper for your fans", "A newsletter sends useful updates to people who asked to hear from you.", ["Collect emails with permission.", "Write one clear idea.", "Link to deeper posts.", "Let people unsubscribe easily."], ["Value beats daily spam.", "Subject lines should be honest."], "Journal + newsletter keep learning going.", IMG.business),
  t("cms", "a CMS", "Web & Design", "like a dashboard for publishing pages", "A CMS (content management system) lets teams edit website content without coding every time.", ["Log into admin.", "Create or edit a page.", "Add images and SEO fields.", "Publish to the live site."], ["Permissions protect who can publish.", "Drafts prevent accidents."], "Ebenezer admin tools manage blog and store content.", IMG.web),
  t("ssl-certificate", "SSL certificates", "Safety Online", "like an ID card for websites", "An SSL certificate helps browsers trust a site and turn on HTTPS encryption.", ["Site proves identity to a certificate authority.", "Browser checks the certificate.", "Encrypted session starts.", "Users see safer connections."], ["Expired certificates scare visitors.", "Free certificates exist for many hosts."], "Trusted shops keep certificates fresh.", IMG.security),
  t("cache", "caching", "Cloud & Data", "like keeping yesterday’s notes on your desk", "Caching stores a recent copy of data so the next request is faster.", ["First request does hard work.", "Result is saved nearby.", "Later requests reuse it.", "Cache clears when data changes."], ["Stale cache can show old content.", "Good systems set smart timers."], "Caching makes digital products feel instant.", IMG.cloud),
  t("load-balancer", "load balancers", "Cloud & Data", "like opening more ticket counters when a line grows", "A load balancer spreads visitor requests across several servers.", ["Request arrives.", "Balancer picks a healthy server.", "Server answers.", "If one fails, traffic moves."], ["This improves uptime.", "Shops use it on big sale days."], "Reliable products plan for busy moments.", IMG.cloud),
  t("microservice", "microservices", "Computers & Code", "like many small shops instead of one giant mall", "Microservices split a big app into smaller services that talk through APIs.", ["Each service owns one job.", "Teams deploy pieces separately.", "APIs connect them.", "Monitoring watches health."], ["Smaller pieces can be easier to scale.", "Too many pieces need careful glue."], "Modern SaaS often uses this style.", IMG.computer),
  t("devops", "DevOps", "Computers & Code", "like builders and drivers working as one team", "DevOps blends development and operations so software ships safely and often.", ["Automate tests.", "Deploy with pipelines.", "Watch live errors.", "Improve quickly."], ["Blame games slow teams.", "Shared responsibility builds quality."], "Good DevOps keeps customer sites healthy.", IMG.computer),
  t("testing-software", "software testing", "Computers & Code", "like checking answers before submitting an exam", "Testing means trying software on purpose to find bugs before customers do.", ["Write expected results.", "Run automatic checks.", "Try awkward user paths.", "Fix and retest."], ["No software is perfect.", "Tests reduce scary surprises."], "Trusted digital products are tested products.", IMG.computer),
  t("agile", "agile teamwork", "Business Digital", "like improving a bicycle while riding short trips", "Agile means building in small steps, learning from feedback, and adjusting.", ["Plan a short sprint.", "Build a thin slice.", "Show users.", "Improve the next slice."], ["Long secret projects often miss needs.", "Daily communication helps."], "Studios use agile to deliver clearer websites.", IMG.business),
  t("freelance-digital", "freelance digital work", "Business Digital", "like a skilled helper you hire for a project", "Freelancers offer skills like design, writing, or development by project or month.", ["Define the scope.", "Agree on price and timeline.", "Share feedback kindly.", "Pay for delivered milestones."], ["Clear briefs prevent fights.", "Portfolios show proof."], "Ebenezer Digital offers reliable digital services.", IMG.business),
  t("portfolio-site", "a portfolio website", "Business Digital", "like a trophy shelf of your best work", "A portfolio site shows examples so clients trust your craft.", ["Pick strongest projects.", "Explain the problem and result.", "Add contact path.", "Keep it fast and mobile."], ["Too many weak samples dilute trust.", "Case studies beat vague claims."], "See our work and build yours with landing kits.", IMG.business),
  t("local-seo", "local SEO", "Business Digital", "like putting your shop on the correct street map", "Local SEO helps nearby customers find your business on maps and search.", ["Claim your business profile.", "Use real address and phone.", "Collect honest reviews.", "Put location words naturally on pages."], ["Fake reviews can hurt you.", "Photos of real work help."], "Local shops grow with clear digital presence.", IMG.business),
  t("social-proof", "social proof", "Business Digital", "like classmates recommending a teacher", "Social proof means showing real testimonials, logos, and results so new people feel safer.", ["Ask happy clients for quotes.", "Show specific outcomes.", "Use real names when allowed.", "Keep claims honest."], ["Fake proof destroys brands.", "One detailed story beats ten vague stars."], "Trust is the currency of digital sales.", IMG.business),
  t("payment-gateway", "payment gateways", "Business Digital", "like a secure cashier for the internet", "A payment gateway takes card or UPI payments and tells your shop if money succeeded.", ["Customer pays on a secure page.", "Bank checks funds.", "Gateway reports success or failure.", "Your system delivers the product."], ["Never store raw card numbers yourself.", "Test modes prevent real charges while building."], "Store checkout prepares for real gateways.", IMG.business),
  t("saas", "SaaS software", "Business Digital", "like renting a tool online instead of buying a heavy box", "SaaS means software you use in a browser with a subscription, hosted for you.", ["Sign up online.", "Data lives in the cloud.", "Updates arrive automatically.", "Pay monthly or yearly."], ["Ebenezer SaaS aims at shop billing.", "Cancel rules should be clear."], "Explore Ebenezer SaaS from /products.", IMG.business),
  t("subscription", "subscriptions", "Business Digital", "like a magazine that arrives every month", "Subscriptions charge regularly for ongoing access to a product or content.", ["Customer agrees to a plan.", "Access stays while active.", "Remind before renewals.", "Allow fair cancellation."], ["Surprise charges break trust.", "Value must remain visible."], "Memberships need honest communication.", IMG.business),
  t("digital-download", "digital downloads", "Business Digital", "like buying a book that arrives as a file", "Digital downloads sell files—templates, kits, ebooks—you receive instantly after payment.", ["Customer pays.", "System unlocks the file.", "They download and keep a copy.", "License explains allowed use."], ["Deliver clear file names.", "Support helps if download fails."], "Our store ships ZIP packs and guides.", IMG.business),
  t("license-software", "software licenses", "Business Digital", "like rules on a library card", "A license explains how you may use a digital product: personal, commercial, or team.", ["Read the license before buying.", "Personal may block client work.", "Commercial allows client projects.", "Do not resell the raw kit."], ["Clear licenses prevent disputes.", "Ask if unsure."], "Store pages list Personal and Commercial options.", IMG.business),
  t("metadata", "metadata", "Cloud & Data", "like labels on a lunch box", "Metadata is data about data—like a photo’s date or a file’s author.", ["Files carry hidden labels.", "Apps read them for search.", "Some labels reveal location.", "You can strip sensitive metadata."], ["Journalists check metadata carefully.", "SEO uses title metadata."], "Good metadata makes libraries and sites searchable.", IMG.data),
  t("compression", "file compression", "Cloud & Data", "like vacuum-packing clothes for a suitcase", "Compression makes files smaller by removing repeated patterns so they travel faster.", ["Algorithm finds repeats.", "It stores a shorter code.", "Download is quicker.", "App expands the file when needed."], ["ZIP packs use compression.", "Too much image compression looks ugly."], "Compression saves bandwidth for everyone.", IMG.data),
  t("hashing", "hashing", "Safety Online", "like a fingerprint for a file", "Hashing turns data into a fixed-size code; change one letter and the fingerprint changes.", ["Input enters a hash function.", "Output is a digest.", "Systems store digests for passwords carefully.", "Integrity checks compare hashes."], ["Hashes are one-way for passwords.", "Salting stops rainbow attacks."], "Hashing protects stored secrets.", IMG.security),
  t("virtual-machine", "virtual machines", "Cloud & Data", "like renting a computer inside another computer", "A virtual machine pretends to be a full computer running on shared hardware.", ["Host machine shares CPU and disk.", "Guest OS boots inside.", "You install software safely.", "Snapshots can rewind mistakes."], ["Useful for testing.", "Containers are a lighter cousin."], "Cloud servers often start as VMs.", IMG.cloud),
  t("container-docker", "software containers", "Cloud & Data", "like lunch boxes that include food and utensils", "Containers package an app with what it needs so it runs the same everywhere.", ["Build an image.", "Run many containers from it.", "They share the host OS kernel.", "Orchestrators manage fleets."], ["Smaller than full VMs usually.", "Great for modern web apps."], "Containers speed reliable deployments.", IMG.cloud),
  t("markdown", "Markdown", "Web & Design", "like handwriting simple symbols that become neat pages", "Markdown is plain text with small marks for headings and lists that become formatted pages.", ["# makes a heading.", "Lists use dashes.", "Links use brackets.", "Tools turn it into HTML."], ["Writers love its speed.", "Many blogs and docs use it."], "Clear writing formats help journals scale.", IMG.web),
  t("rss-feed", "RSS feeds", "Internet & Networks", "like a newspaper subscription pipe", "RSS lets readers and apps follow new articles without opening every site daily.", ["Site publishes a feed file.", "Reader checks for updates.", "New items appear in a list.", "You open what matters."], ["Podcasts often use similar feeds.", "Google and Microsoft can discover feed URLs."], "Our journal publishes RSS for wider reach.", IMG.internet),
  t("web-accessibility-alt", "image alt text", "Web & Design", "like describing a picture to a friend on the phone", "Alt text is a short description of an image for screen readers and when images fail to load.", ["Say what matters in the image.", "Keep it short and honest.", "Skip 'image of' fluff.", "Decorative images can be empty."], ["Helps SEO a bit too.", "Essential for inclusive sites."], "Every lesson image here includes meaningful alt ideas.", IMG.web),
  t("dark-mode", "dark mode", "Web & Design", "like reading with a dim bedside lamp", "Dark mode uses light text on dark backgrounds to reduce glare for some people.", ["Choose soft contrast, not harsh pure black always.", "Test both themes.", "Let users switch.", "Keep brand visible."], ["Not everyone prefers dark mode.", "Battery savings vary by screen type."], "Offer choice; do not force style.", IMG.web),
  t("pwa", "progressive web apps", "Web & Design", "like a website that can act a bit like an installed app", "PWAs can work offline-ish, sit on your home screen, and send updates using web tech.", ["Serve over HTTPS.", "Add a manifest.", "Use a service worker cache.", "Users install if they want."], ["Not every browser supports every feature.", "Still build a great mobile site first."], "PWAs blur app and web benefits.", IMG.web),
  t("notification", "push notifications", "Phones & Apps", "like a tap on the shoulder from an app", "Notifications are short alerts apps show even when you are elsewhere on the phone.", ["App asks permission.", "Server sends an event.", "OS shows the banner.", "You open or dismiss."], ["Too many alerts feel rude.", "Useful alerts respect quiet hours."], "Use notifications sparingly and kindly.", IMG.phone),
  t("bluetooth-wifi-diff", "Wi‑Fi vs Bluetooth", "Internet & Networks", "like a highway versus a short garden path", "Wi‑Fi usually connects you to the internet; Bluetooth usually links nearby gadgets to each other.", ["Wi‑Fi needs a router path to the net.", "Bluetooth pairs devices locally.", "Speeds and ranges differ.", "Both use radio waves."], ["You can use both at once.", "Interference can happen in busy air."], "Knowing the difference fixes many home mysteries.", IMG.wifi),
  t("5g", "5G networks", "Internet & Networks", "like adding express lanes to phone highways", "5G is a newer mobile network generation aiming for higher speed and lower delay.", ["Phone and tower speak 5G radio.", "More spectrum bands are used.", "Small cells densify cities.", "Apps get faster responses."], ["Coverage still varies by place.", "Your plan and phone must support it."], "Faster mobile nets help video learning on the go.", IMG.phone),
  t("satellite-internet", "satellite internet", "Internet & Networks", "like bouncing messages off a mirror in the sky", "Satellite internet sends data to space and back to reach remote places.", ["Dish talks to a satellite.", "Satellite relays to a ground station.", "Internet continues from there.", "Latency can be higher than fiber."], ["Helpful for villages far from cables.", "Weather can affect signals."], "Satellites widen who can join digital life.", IMG.internet),
  t("upi-payments", "UPI payments", "Business Digital", "like sending money with a phone tap instead of cash notes", "UPI lets people in India pay shops and friends instantly from a bank account using a phone app.", ["You scan a QR or enter a UPI ID.", "The app asks your PIN.", "Banks move the money.", "Both sides see a confirmation."], ["Never share your UPI PIN.", "Check the name before you pay."], "UPI is daily digital money for shops and families.", IMG.business),
  t("spreadsheet", "spreadsheets", "Cloud & Data", "like a huge notebook made of boxes", "A spreadsheet is a grid of cells where you store numbers and formulas so totals update themselves.", ["Type labels in the first row.", "Enter numbers in cells.", "Write a formula like SUM.", "Charts can show the story."], ["Google Sheets and Excel are common tools.", "One wrong formula can confuse a whole shop."], "Spreadsheets are the quiet engine of small business.", IMG.data),
  t("pdf-file", "PDF files", "Web & Design", "like a printed page that travels as a file", "A PDF keeps layout, fonts, and images looking the same on different phones and computers.", ["A document is exported as PDF.", "The file packs text and pictures together.", "A reader app opens it.", "You can share it without the original software."], ["PDFs are great for invoices and playbooks.", "Some PDFs can be edited; many are meant to stay fixed."], "Our store ships guides as PDFs you can keep.", IMG.web),
  t("video-call", "video calls", "Phones & Apps", "like a window that shows a far-away room", "A video call sends your live picture and voice across the internet so two places can talk at once.", ["Apps capture camera and mic.", "Data is compressed and sent.", "The other device plays it.", "Networks try to keep delay low."], ["Mute when you are not speaking.", "Good light helps more than a fancy camera."], "Video calls keep families, classes, and teams together.", IMG.phone),
  t("screenshot", "screenshots", "Phones & Apps", "like a photocopy of what is on your screen right now", "A screenshot saves the current screen as a picture you can share or keep.", ["Press the shortcut or button combo.", "The device captures pixels.", "A photo file is stored.", "You can crop before sending."], ["Do not capture passwords or OTP screens.", "Screenshots help explain bugs to support."], "A clear screenshot saves long confused messages.", IMG.phone),
  t("search-engine", "search engines", "Web & Design", "like a giant librarian who has read the public web", "A search engine finds pages that match your words and ranks the ones likely to help.", ["You type a query.", "The engine checks its index.", "It ranks useful pages.", "You click and read."], ["Clear titles help honest pages get found.", "Ads can appear above results—look carefully."], "This journal is written so search engines and humans both understand it.", IMG.web),
  t("password-manager", "a password manager", "Safety Online", "like a locked diary that remembers every door key", "A password manager stores unique passwords and fills them so you do not reuse one weak password everywhere.", ["Create one strong master password.", "Save site logins inside the manager.", "Let it generate long random passwords.", "Unlock with the master password or device check."], ["Do not reuse the master password elsewhere.", "Turn on extra approval (2FA) for the vault."], "One vault is safer than a notebook of repeated passwords.", IMG.security),
  t("smart-home", "smart homes", "Phones & Apps", "like a house that listens carefully to schedules", "Smart home devices control lights, fans, or locks through apps and automation.", ["Connect device to Wi‑Fi.", "Link to an app.", "Set routines.", "Monitor energy use."], ["Secure your Wi‑Fi first.", "Guest access should be limited."], "Smart does not mean careless—security first.", IMG.phone),
  t("wearable", "wearable tech", "Phones & Apps", "like a tiny coach on your wrist", "Wearables like smartwatches track movement and show quick alerts.", ["Sensors measure motion or heart rate.", "Chip processes signals.", "Bluetooth syncs to phone.", "App shows trends."], ["Not a full doctor replacement.", "Charge habits matter."], "Wearables make health data personal and daily.", IMG.phone),
  t("ebook", "ebooks", "Business Digital", "like paper books that weigh nothing", "Ebooks are readable files—PDF or EPUB—you open on phones and tablets.", ["Buy or download a file.", "Reader app opens it.", "You bookmark pages.", "Some allow highlighting."], ["Licenses may limit sharing.", "Eye comfort settings help."], "Digital Business Playbook is an ebook in our store.", IMG.business),
  t("online-learning", "online learning", "Business Digital", "like a classroom that fits in your pocket", "Online learning uses videos, articles, and quizzes so you can study anywhere.", ["Pick a lesson goal.", "Read or watch.", "Practice with questions.", "Ask AI or a teacher for help."], ["Short daily habits beat rare marathons.", "Notes improve memory."], "This 1000+ lesson journal is built for online learning.", IMG.business),
  t("digital-literacy", "digital literacy", "Business Digital", "like learning to read street signs in a new city", "Digital literacy means knowing how to use devices safely and wisely.", ["Learn basic apps.", "Spot scams.", "Protect passwords.", "Create more than you only consume."], ["Age does not block learning.", "Curiosity beats fear."], "Our mission is literacy through simple deep blogs.", IMG.business),
  t("cyberbullying", "cyberbullying", "Safety Online", "like mean words that follow you home through a screen", "Cyberbullying is repeated hurtful behavior online toward someone.", ["Do not reply with more hate.", "Save evidence.", "Block and report.", "Tell a trusted adult."], ["Silence can protect you.", "Platforms have report tools."], "Kind digital spaces need brave reporting.", IMG.security),
  t("screen-time", "healthy screen time", "Safety Online", "like balancing sweets with real meals", "Healthy screen time means using devices with purpose and rest for eyes and sleep.", ["Set device-free moments.", "Use night modes late.", "Stretch and blink.", "Choose quality content."], ["Not all screen time is equal.", "Family rules work best when shared."], "Digital life should support real life.", IMG.phone),
  t("creator-economy", "the creator economy", "Business Digital", "like a street of makers selling skills and stories", "Creators earn by sharing useful or entertaining content and digital products.", ["Pick a niche you know.", "Publish consistently.", "Offer a product or service.", "Serve your audience kindly."], ["Trends fade; trust lasts.", "Diversify income carefully."], "Store kits help creators launch faster.", IMG.business),
  t("no-code", "no-code tools", "Computers & Code", "like building with ready blocks instead of carving wood", "No-code tools let people create apps and sites by clicking components instead of typing all code.", ["Choose a platform.", "Drag blocks or templates.", "Connect data.", "Publish."], ["Complex products may still need developers.", "You learn logic even without code."], "No-code plus kits can start a business quickly.", IMG.computer),
  t("low-code", "low-code platforms", "Computers & Code", "like cooking with some ready sauces and some fresh chopping", "Low-code mixes visual building with small amounts of custom code.", ["Assemble UI visually.", "Add light scripts when needed.", "Connect APIs.", "Deploy."], ["Good for internal business tools.", "Governance still matters."], "Teams move faster with smart low-code.", IMG.computer),
  t("webhook", "webhooks", "Computers & Code", "like a doorbell that rings another app", "A webhook sends an automatic message to another system when something happens.", ["Event occurs (new order).", "Your server POSTs data to a URL.", "Other app reacts.", "Retries handle temporary fails."], ["Secure webhook secrets.", "Validate payloads."], "Webhooks glue modern automations.", IMG.computer),
  t("ocr", "OCR", "AI & Smart Tools", "like teaching a computer to read printed letters", "OCR turns pictures of text into editable digital text.", ["Scan or photo a page.", "Model detects characters.", "Text becomes copyable.", "You correct mistakes."], ["Clear lighting helps.", "Handwriting is harder than print."], "OCR saves typing time for offices.", IMG.ai),
  t("speech-to-text", "speech to text", "AI & Smart Tools", "like a scribe listening carefully", "Speech-to-text converts spoken words into written text.", ["Microphone captures audio.", "Model recognizes sounds as words.", "Text appears.", "You edit names and errors."], ["Accents and noise affect accuracy.", "Great for notes and accessibility."], "Talk to explore ideas, then refine with /ai.", IMG.ai),
  t("text-to-speech", "text to speech", "AI & Smart Tools", "like a storyteller reading aloud", "Text-to-speech turns written words into spoken audio.", ["Provide text.", "Voice model generates sound.", "Device plays audio.", "Speed and voice can change."], ["Helps eyes rest.", "Useful for language learning."], "Listening + reading deepens understanding.", IMG.ai),
  t("computer-vision", "computer vision", "AI & Smart Tools", "like giving cameras a brain for meaning", "Computer vision helps software understand images—faces, objects, or text.", ["Camera captures pixels.", "Model finds patterns.", "It labels what it sees.", "App acts on the label."], ["Privacy matters with face data.", "Lighting changes results."], "Vision AI powers unlock and photo tools.", IMG.ai),
  t("edge-computing", "edge computing", "Cloud & Data", "like cooking snacks in your kitchen instead of a far restaurant", "Edge computing processes data near the device to reduce delay.", ["Sensor collects data.", "Nearby box processes it.", "Only summaries go to cloud.", "Actions happen quickly."], ["Useful for factories and AR.", "Cloud still stores big history."], "Edge + cloud work as partners.", IMG.cloud),
  t("green-computing", "green computing", "Energy & Devices", "like saving electricity while using tech", "Green computing means designing and using digital systems with less energy waste.", ["Turn off unused devices.", "Prefer efficient code and servers.", "Recycle e-waste properly.", "Choose renewable-powered clouds when you can."], ["Streaming less in high quality saves energy.", "Repair beats replace sometimes."], "Digital growth should respect the planet.", IMG.electricity),
  t("e-waste", "e-waste", "Energy & Devices", "like old gadgets that need a proper recycling path", "E-waste is thrown-away electronics that can harm nature if dumped wrongly.", ["Donate or sell working devices.", "Use certified recyclers.", "Wipe data before giving away.", "Buy durable tools when possible."], ["Phones hold toxic materials.", "Batteries need special care."], "Responsible disposal is part of digital citizenship.", IMG.electricity),
  t("touchscreen-sensor", "a touchscreen", "Devices & Sensors", "like a glass notebook that feels your finger", "A touchscreen senses your finger and turns taps into commands for the phone or tablet.", ["Your finger changes a tiny electric field on the glass.", "The screen finds the touch point.", "Software decides what the tap means.", "The app reacts."], ["Most phones use capacitive touch.", "Gloves can block cheap screens."], "Touch is how most people meet digital apps.", IMG.phone),
  t("keyboard", "a computer keyboard", "Devices & Sensors", "like a piano of letters", "A keyboard sends letter and shortcut signals so you can write and control software.", ["You press a key.", "A switch closes.", "The computer reads a code.", "The character appears."], ["Mechanical and membrane keys feel different.", "Shortcuts save time."], "Clear typing skills power learning and work.", IMG.computer),
  t("mouse-pointer", "a computer mouse", "Devices & Sensors", "like a tiny hand that points on screen", "A mouse moves a pointer so you can click buttons and drag items.", ["Sensors track movement.", "The pointer follows.", "A click sends a choose signal.", "Software acts."], ["Trackpads do a similar job on laptops.", "Accessibility tools can replace the mouse."], "Pointing devices make screens feel usable.", IMG.computer),
  t("microphone", "a microphone", "Devices & Sensors", "like an ear for machines", "A microphone turns sound waves into electrical signals a computer can record or send.", ["Sound vibrates a part inside.", "Vibration becomes electricity.", "Software samples the signal.", "You hear or see captions later."], ["Noise canceling helps calls.", "Mute is a kindness tool in meetings."], "Voice tools need good mics and good manners.", IMG.phone),
  t("speaker", "a speaker", "Devices & Sensors", "like a tiny drum that pushes air", "A speaker turns electrical signals back into sound you can hear.", ["Signal drives a coil.", "A cone vibrates air.", "Your ears catch the waves.", "Music or speech appears."], ["Small earbuds use tiny drivers.", "Volume too high can hurt hearing."], "Sound completes many digital lessons.", IMG.phone),
  t("webcam", "a webcam", "Devices & Sensors", "like a small eye for video calls", "A webcam captures light as images so people can see you in a call or recording.", ["Lens focuses light.", "Sensor makes pixels.", "Software compresses video.", "The stream travels over the internet."], ["Cover the lens when unused for privacy.", "Good light beats fancy cameras."], "Video presence helps remote learning and work.", IMG.computer),
  t("printer", "a printer", "Devices & Sensors", "like a robot painter for paper", "A printer puts digital pages onto paper using ink or toner.", ["Computer sends a page description.", "Printer heats or sprays marks.", "Paper moves through rollers.", "You get a hard copy."], ["Ink costs can surprise you.", "PDF print preview prevents waste."], "Paper still matters for forms and study notes.", IMG.computer),
  t("usb", "USB", "Devices & Sensors", "like a universal plug language", "USB is a common connector and rule set for charging and moving data between devices.", ["Plug into a matching port.", "Devices negotiate power and data.", "Files or charge flow.", "You safely eject storage when needed."], ["USB-C is becoming the common shape.", "Not every cable supports fast data."], "One cable family simplifies digital life.", IMG.computer),
  t("hdmi", "HDMI", "Devices & Sensors", "like a thick garden hose for picture and sound", "HDMI cables carry high-quality video and audio from a device to a screen.", ["Source sends digital AV signals.", "Cable carries them.", "TV or monitor shows the picture.", "Sound plays too."], ["Cable quality matters less than people think for short runs.", "Adapters exist for older ports."], "HDMI links learning videos to big screens.", IMG.computer),
  t("power-bank", "a power bank", "Energy & Devices", "like a spare battery in your bag", "A power bank stores electricity so you can charge phones away from wall plugs.", ["Charge the bank at home.", "Connect your phone with a cable.", "Energy flows out.", "Bank level drops as you use it."], ["Capacity is measured in mAh.", "Air travel has battery rules."], "Portable power keeps learning online on trips.", IMG.electricity),
  t("smartwatch", "a smartwatch", "Phones & Apps", "like a tiny phone that lives on your wrist", "A smartwatch shows time, steps, and alerts without pulling out your phone every minute.", ["Sensors watch motion and sometimes heart rate.", "Chip runs watch apps.", "Bluetooth talks to your phone.", "You glance and act."], ["Battery life varies by features.", "Notifications should stay calm."], "Wearables make quick digital checks gentle.", IMG.phone),
  t("drone", "a drone", "Future Tech", "like a flying camera with four little fans", "A drone is a small aircraft you control to take photos or inspect places from above.", ["Motors spin propellers.", "Flight computer balances the craft.", "Radio link follows your commands.", "Camera captures the view."], ["Follow local flying laws.", "Keep away from airports."], "Aerial views teach geography and safety awareness.", IMG.internet),
  t("3d-printing", "3D printing", "Future Tech", "like drawing with melted plastic layer by layer", "3D printing builds solid objects from a digital design by adding thin layers.", ["Design a 3D model.", "Slicer turns it into layers.", "Printer melts material.", "Object rises from the bed."], ["Great for prototypes.", "Not every material is food-safe."], "Making physical things from files sparks inventors.", IMG.computer),
  t("self-driving-car", "self-driving cars", "Future Tech", "like a car that tries to be a careful robot driver", "Self-driving systems use sensors and software to help a car steer, brake, and see the road.", ["Cameras and radars watch surroundings.", "Software plans a safe path.", "Actuators turn the wheel and brakes.", "Humans still must stay alert where required."], ["Full autonomy is not everywhere yet.", "Weather can confuse sensors."], "Transport tech will reshape cities carefully.", IMG.internet),
  t("quantum-computing", "quantum computing", "Future Tech", "like a puzzle box that can try many answers at once", "Quantum computers use special quantum bits that can explore many possibilities differently from normal bits.", ["Qubits hold special states.", "Operations entangle them.", "Algorithms search hard problems.", "Results are read carefully."], ["Still early for everyday phones.", "Useful for research and security thinking."], "Future computing ideas start with curiosity today.", IMG.computer),
  t("metaverse-idea", "the metaverse idea", "Future Tech", "like shared imaginary rooms on the internet", "The metaverse idea means linked virtual places where people meet with avatars for play, work, or learning.", ["Put on a headset or open an app.", "Your avatar enters a space.", "You talk and move.", "Digital items can travel between worlds in some designs."], ["Hype rises and falls.", "Real value is useful shared experiences."], "Virtual spaces need the same kindness as real ones.", IMG.web),
  t("robot-arm", "robot arms", "Future Tech", "like a strong metal arm that repeats careful moves", "Robot arms in factories pick, weld, or pack items with programmed motions.", ["Sensors check position.", "Motors move joints.", "Controller follows a program.", "Safety cages protect people."], ["Cobots work nearer humans carefully.", "Maintenance keeps accuracy."], "Automation changes jobs—learning keeps people ready.", IMG.computer),
  t("fiber-optic", "fiber-optic cables", "Internet & Networks", "like glass hair that carries light messages", "Fiber-optic cables send data as pulses of light through thin glass strands—very fast and far.", ["Laser or LED flashes light.", "Light races inside the fiber.", "Receiver turns light back into electricity.", "Your internet feels quick."], ["Ocean fibers connect continents.", "Bending too sharply can break strands."], "Light in glass is how many countries talk digitally.", IMG.internet),
  t("ip-address-detail", "an IP address in detail", "Internet & Networks", "like a home address for a device on the network", "An IP address is a number label that helps the internet deliver packets to the right device.", ["Your network gives you an address.", "Packets carry from and to addresses.", "Routers read them like street signs.", "NAT can share one public address."], ["IPv4 and IPv6 are two styles.", "Addresses can change on home Wi‑Fi."], "Addresses make delivery possible on the net.", IMG.internet),
  t("domain-name-network", "a domain name and DNS", "Internet & Networks", "like a easy name instead of a hard number address", "A domain name (like example.com) is a memorable label that points to servers on the internet.", ["You type a name.", "DNS finds the IP.", "Browser connects.", "The site loads."], ["Domains are rented, not forever owned blindly.", "HTTPS locks the trip."], "Good domains help brands and journals get found.", IMG.web),
];

export type EduPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  gallery: string[];
  category: string;
  tags: string[];
  author: string;
  status: "published";
  publishedAt: string;
  seoTitle: string;
  seoDescription: string;
  relatedSlugs: string[];
  aiPrompt: string;
  promoteProducts: string[];
  angle: EduAngle;
  topicKey: string;
};

const PRODUCT_ROTATION = [
  "ebenezer-saas",
  "creator-landing-kit",
  "creator-bundle",
  "shop-pos-starter-pack",
  "brand-kit-essentials",
  "digital-business-playbook",
  "travel-enquiry-pack",
  "free-enquiry-form-kit",
];

function slugify(parts: string[]): string {
  return parts
    .join("-")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

function dayOffset(i: number): string {
  const d = new Date("2024-01-01T10:00:00.000Z");
  d.setUTCDate(d.getUTCDate() + (i % 900));
  d.setUTCHours(8 + (i % 10), i % 60, 0, 0);
  return d.toISOString();
}

function buildContent(topic: EduTopic, angle: EduAngle, title: string): string {
  const steps = topic.steps.map((s, i) => `${i + 1}. ${s}`).join("\n");
  const facts = topic.funFacts.map((f) => `• ${f}`).join("\n");
  const base = `## Let's start with a simple picture\n\nThink of ${topic.titleBase} ${topic.metaphor}. Keep that picture in your mind. We will use easy words, like a class for 10–11 year olds.\n\n${topic.what}\n\n## Why should you care?\n\n${topic.whyItMatters}\n\n`;

  const byAngle: Record<EduAngle, string> = {
    "how-it-works": `## How it works, step by step\n\n${steps}\n\n## A closer look\n\nWhen ${topic.titleBase} is working well, each step above happens quickly—sometimes in tiny fractions of a second. If one step fails, the whole chain can pause. That is why checking cables, settings, or permissions often fixes “mystery” problems.\n\n## Try this thought experiment\n\nExplain ${topic.titleBase} to a younger sibling using only the metaphor: ${topic.metaphor}. If they smile and nod, you understood it.\n\n## An India daily-life example\n\nImagine a family in Chennai or Pune using a phone, UPI, and a school WhatsApp group in one evening. Somewhere in that evening, ${topic.titleBase} is quietly helping: a message arrives, a bill is paid, a light stays on, or a page loads. Name the step you can see, then name the hidden step behind it.\n`,
    "everyday-life": `## Where you meet this every day\n\nYou probably already used ${topic.titleBase} today without naming it. School apps, lights, payments, maps, and messages all lean on ideas like this.\n\n## A day-in-the-life story\n\nMorning: a device wakes and needs power or signal.\nNoon: you open a site or app that depends on networks and data.\nEvening: you save work to storage or the cloud.\n\nSomewhere in that day, ${topic.titleBase} quietly helped.\n\n## Notice it once\n\nToday, when something digital feels “magic,” pause and ask: which part is ${topic.titleBase} playing?\n\n## Shop, farm, and school\n\nA kirana shop using a billing screen, a farmer checking weather, and a student joining online class are three different lives with one shared idea. ${topic.titleBase} shows up in all three, just wearing different clothes.\n`,
    "tiny-parts": `## The tiny parts (still in simple words)\n\n${steps}\n\nInside real machines, these steps are done by chips, radios, cables, or code. You do not need to memorize chip names. You only need the job of each part.\n\n## If a part is missing\n\nNo power → nothing starts.\nNo path → messages cannot travel.\nNo instructions → the device sits idle.\nNo memory/storage → work cannot stay.\n\n${topic.titleBase} needs its team of parts working together.\n\n## A repair habit\n\nWhen something fails, ask four questions: power, path, permission, and plan (the instructions). Most “it is broken” stories are one of those four.\n`,
    "simple-history": `## A simple history (no boring dates dump)\n\nPeople always wanted faster ways to share ideas and save work. First we had paper and messengers. Then electricity, radio, computers, and networks arrived. Each leap made ${topic.titleBase} more important.\n\n## What changed for children like you\n\nYour grandparents may have waited days for news. You can learn about ${topic.titleBase} in minutes—and then ask our AI to explain a hard word.\n\n## What did not change\n\nCuriosity, carefulness, and kindness still matter more than any gadget.\n\n## Then vs now\n\nThen: one copy, one place, slow sharing.\nNow: many copies, many devices, instant sharing—and a bigger need to check what is true.\n`,
    "stay-safe": `## Stay safe while using related tools\n\n${topic.titleBase} is helpful, but careless use can cause problems—wasted money, lost files, or leaked secrets.\n\n### Easy safety habits\n\n• Use strong unique passwords.\n• Do not tap strange links.\n• Update apps when asked.\n• Ask an adult before payments.\n• Keep backups of school and business files.\n\n## If something feels wrong\n\nStop. Screenshot. Tell a trusted adult. Change passwords on important accounts.\n\n## A 30-second safety check\n\nBefore you share a photo, pay money, or install an app, ask: “Would I still do this if a clever stranger was watching?” If the answer is no, pause.\n`,
    "myths-vs-truth": `## Myths vs truth\n\n**Myth:** “${topic.titleBase} is pure magic.”\n**Truth:** It follows clear steps you can learn.\n\n**Myth:** “Only geniuses understand this.”\n**Truth:** Clear metaphors—like ${topic.metaphor}—open the door for everyone.\n\n**Myth:** “If it is online, it must be true.”\n**Truth:** Always check sources. Ask our AI for a second explanation, then verify.\n\n**Myth:** “More features always mean better.”\n**Truth:** Simple, reliable tools often win for families and shops.\n`,
    "explore-more": `## Curious questions you can ask next\n\n• What happens if one step in ${topic.titleBase} fails?\n• How is this similar to ${topic.metaphor}?\n• What would a safer version look like for kids?\n• How do businesses use this idea to help customers?\n\n## Your mission\n\nWrite five lines in your own words. Then open Ebenezer AI and paste your lines with: “Explain this more simply and give one example from Indian daily life.”\n\n## Stretch challenge\n\nTeach one friend in 90 seconds. If they can repeat the metaphor ${topic.metaphor}, you both learned it.\n`,
  };

  return `${base}${byAngle[angle]}\n## Fun facts\n\n${facts}\n\n## FAQ — quick answers\n\n### Can a Class 5 student understand this?\nYes. That is why we start with a picture (${topic.metaphor}) and only then add steps.\n\n### Do I need to buy new gadgets?\nUsually no. Understanding ${topic.titleBase} helps you use tools you already have—phone, Wi‑Fi, a shop counter, or a website.\n\n### What should I do after reading?\nRead the linked lessons, then ask Eben AI one follow-up question in your language.\n\n## Know more in this journal\n\nUse the “Continue the chain” links below for the next lessons. Each lesson is short, clear, and connected.\n\n## Ask Ebenezer AI\n\nStill curious about “${title}”? Open /ai and ask follow-up questions in your language. The AI is there to explore—while this article stays your solid starting map.\n\n## Grow with Ebenezer tools\n\nWhen you are ready to build, visit /products for landing kits, brand kits, shop tools, and Ebenezer SaaS. Learning and building belong together.\n`;
}

function angleTitle(topic: EduTopic, angle: typeof EDU_ANGLES[number]): string {
  switch (angle.id) {
    case "how-it-works":
      return `How ${topic.titleBase} works (explained simply)`;
    case "everyday-life":
      return `Where you see ${topic.titleBase} in everyday life`;
    case "tiny-parts":
      return `The tiny parts that make ${topic.titleBase} work`;
    case "simple-history":
      return `A simple history of ${topic.titleBase}`;
    case "stay-safe":
      return `How to stay safe with ${topic.titleBase}`;
    case "myths-vs-truth":
      return `Myths and truth about ${topic.titleBase}`;
    case "explore-more":
      return `Curious questions about ${topic.titleBase}`;
  }
}

let cached: EduPost[] | null = null;

export function getEduPosts(): EduPost[] {
  if (cached) return cached;
  const posts: EduPost[] = [];
  let i = 0;
  const seenTopics = new Set<string>();
  for (const topic of EDU_TOPICS) {
    if (seenTopics.has(topic.key)) continue;
    seenTopics.add(topic.key);
    for (const angle of EDU_ANGLES) {
      const title = angleTitle(topic, angle);
      const slug = slugify(["learn", topic.key, angle.id]);
      const gallery = topic.images.slice(0, 6);
      const excerpt = `${topic.what} Written in simple English so even a Class 5 student can follow—then explore more with Ebenezer AI.`;
      posts.push({
        id: `edu-${topic.key}-${angle.id}`,
        title,
        slug,
        excerpt,
        content: buildContent(topic, angle.id, title),
        coverImage: gallery[i % gallery.length],
        gallery,
        category: `Learn · ${topic.category}`,
        tags: [topic.key, angle.id, "digital literacy", "simple english", topic.category],
        author: "Ebenezer Learn Desk",
        status: "published",
        publishedAt: dayOffset(i),
        seoTitle: `${title} | Ebenezer Journal`,
        seoDescription: excerpt.slice(0, 155),
        relatedSlugs: [],
        aiPrompt: `Explain "${title}" even more simply for a 10-year-old in India, with one local example, then give 3 practice questions.`,
        promoteProducts: [
          PRODUCT_ROTATION[i % PRODUCT_ROTATION.length],
          PRODUCT_ROTATION[(i + 3) % PRODUCT_ROTATION.length],
        ],
        angle: angle.id,
        topicKey: topic.key,
      });
      i += 1;
    }
  }

  // Chain links: same topic next angles + neighboring topics
  for (let idx = 0; idx < posts.length; idx++) {
    const p = posts[idx];
    const sameTopic = posts.filter((x) => x.topicKey === p.topicKey && x.slug !== p.slug).map((x) => x.slug);
    const neighbors = [posts[(idx + 1) % posts.length], posts[(idx + 7) % posts.length], posts[(idx + 14) % posts.length]].map(
      (x) => x.slug
    );
    p.relatedSlugs = Array.from(new Set([...sameTopic.slice(0, 4), ...neighbors])).slice(0, 6);
  }

  cached = posts;
  return posts;
}

export function getEduPostBySlug(slug: string): EduPost | undefined {
  return getEduPosts().find((p) => p.slug === slug);
}

export function eduPostCount(): number {
  return getEduPosts().length;
}
