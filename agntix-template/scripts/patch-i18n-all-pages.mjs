import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const patch = {
  en: {
    destinationsSection: {
      eyebrow: "Destination",
      title: "Kodaikanal",
      subtitle: "Our only tour destination for now — complete packages in the Princess of the Hills.",
      featured: "Featured",
      from: "From",
      viewAll: "View Kodaikanal",
    },
    film: {
      frameEyebrow: "In the film of your day",
      frameBody: "Stay with this frame. Let the air settle before you move on.",
      finaleEyebrow: "The day returns to gold",
      finaleTitle: "You have walked through the mist.",
      finaleBody: "Now, if your heart is still on the ridge — Canaan will take you there.",
      openLine1: "Escape Into The Mist.",
      openLine2: "Kodaikanal Awaits.",
      openHint: "Begin the day",
      brandSub: "Travel Hub",
    },
    homeCinematic: {
      whyKodaiEyebrow: "Why Kodaikanal",
      whyKodaiTitle: "A place that asks you to slow down.",
      whyKodaiBody:
        "Mist over pine. Quiet lakes. Roads that open only when you are ready. Canaan presents Kodaikanal as an experience — not a checklist.",
      immersiveEyebrow: "Immersive experiences",
      immersiveTitle: "Drift through the hills.",
      whyCanaanEyebrow: "Why Canaan",
      whyCanaanTitle: "Premium feels effortless.",
      whyCanaan: {
        quiet: {
          title: "Quiet luxury",
          body: "Every detail arranged before you ask — stays, transfers, pacing.",
        },
        specialists: {
          title: "Kodai specialists",
          body: "One destination, deeply known. Roads, seasons, hidden quiet.",
        },
        trusted: {
          title: "Trusted care",
          body: "Clear guidance, private hosts, and calm communication.",
        },
        human: {
          title: "Human hospitality",
          body: "Not a template tour — a journey shaped around you.",
        },
      },
      storiesEyebrow: "Customer stories",
      mapEyebrow: "Interactive map",
      mapTitle: "Trace the hills.",
      mapSelected: "Selected",
      mapNote: "Included across curated Canaan packages.",
      galleryEyebrow: "Gallery",
      galleryTitle: "Frames of Kodai.",
      timelineEyebrow: "Travel story",
      timelineTitle: "A day written in mist.",
      digitalEyebrow: "Also available",
      digitalTitle: "Digital tourism services",
      digitalBody:
        "Packages are Kodaikanal-only. Flights, hotels, and visas support your journey.",
      digitalCta: "View services",
      digitalSoft: "Stay close to the mist.",
      digitalDone: "You are on the list.",
      digitalEmail: "Email",
      digitalJoin: "Join",
      heroEyebrow: "Canaan Travel Hub · Kodaikanal",
      heroTitle: "Every Journey Begins With Wonder.",
      heroSub: "Discover Kodaikanal Like Never Before.",
      heroExplore: "Explore Experiences",
      heroWatch: "Watch Story",
      heroScroll: "Scroll",
      heroStoryTitle: "Kodaikanal story",
      heroStoryNote: "Embed your cinematic Kodaikanal film here.",
    },
  },
  ta: {
    destinationsSection: {
      eyebrow: "இடம்",
      title: "கொடைக்கானல்",
      subtitle: "இப்போது எங்கள் ஒரே சுற்றுலா இடம் — மலை இளவரசியின் முழு பேக்கேஜ்கள்.",
      featured: "சிறப்பு",
      from: "தொடங்கி",
      viewAll: "கொடைக்கானல் காண",
    },
    film: {
      frameEyebrow: "உங்கள் நாளின் திரைப்படத்தில்",
      frameBody: "இந்த காட்சியுடன் இருங்கள். அடுத்த இடத்திற்குச் செல்வதற்கு முன் காற்று அமையட்டும்.",
      finaleEyebrow: "நாள் மீண்டும் பொன்னாகிறது",
      finaleTitle: "நீங்கள் மூடுபனி வழியாக நடந்து வந்துள்ளீர்கள்.",
      finaleBody: "இப்போதும் உங்கள் இதயம் முகட்டில் இருந்தால் — கானான் உங்களை அங்கு அழைத்துச் செல்லும்.",
      openLine1: "மூடுபனியில் தப்பிச் செல்லுங்கள்.",
      openLine2: "கொடைக்கானல் காத்திருக்கிறது.",
      openHint: "நாளைத் தொடங்குங்கள்",
      brandSub: "Travel Hub",
    },
    homeCinematic: {
      whyKodaiEyebrow: "ஏன் கொடைக்கானல்",
      whyKodaiTitle: "மெதுவாக இருக்கச் சொல்லும் இடம்.",
      whyKodaiBody:
        "பைன் மீது மூடுபனி. அமைதியான ஏரிகள். நீங்கள் தயாரானபோது திறக்கும் சாலைகள். கானான் கொடையை அனுபவமாகக் காட்டுகிறது — பட்டியலாக அல்ல.",
      immersiveEyebrow: "ஆழ்ந்த அனுபவங்கள்",
      immersiveTitle: "மலைகளில் மிதந்து செல்லுங்கள்.",
      whyCanaanEyebrow: "ஏன் கானான்",
      whyCanaanTitle: "பிரீமியம் எளிதாக உணரப்படும்.",
      whyCanaan: {
        quiet: {
          title: "அமைதியான ஆடம்பரம்",
          body: "நீங்கள் கேட்பதற்கு முன் ஒவ்வொரு விவரமும் — தங்கல், பயணம், வேகம்.",
        },
        specialists: {
          title: "கொடை நிபுணர்கள்",
          body: "ஒரு இடம், ஆழமாக அறியப்பட்டது. சாலைகள், பருவங்கள், மறைந்த அமைதி.",
        },
        trusted: {
          title: "நம்பகமான பராமரிப்பு",
          body: "தெளிவான வழிகாட்டல், தனியார் வழிகாட்டிகள், அமைதியான தொடர்பு.",
        },
        human: {
          title: "மனித விருந்தோம்பல்",
          body: "வார்ப்புரு சுற்று அல்ல — உங்களைச் சுற்றி வடிவமைக்கப்பட்ட பயணம்.",
        },
      },
      storiesEyebrow: "வாடிக்கையாளர் கதைகள்",
      mapEyebrow: "ஊடாடும் வரைபடம்",
      mapTitle: "மலைகளைத் தொடருங்கள்.",
      mapSelected: "தேர்வு",
      mapNote: "கானான் பேக்கேஜ்களில் சேர்க்கப்பட்டுள்ளது.",
      galleryEyebrow: "கேலரி",
      galleryTitle: "கொடையின் காட்சிகள்.",
      timelineEyebrow: "பயணக் கதை",
      timelineTitle: "மூடுபனியில் எழுதப்பட்ட ஒரு நாள்.",
      digitalEyebrow: "மேலும் கிடைக்கும்",
      digitalTitle: "டிஜிட்டல் சுற்றுலா சேவைகள்",
      digitalBody:
        "பேக்கேஜ்கள் கொடைக்கானல் மட்டும். விமானம், ஹோட்டல், விசா உங்கள் பயணத்திற்கு உதவும்.",
      digitalCta: "சேவைகளைக் காண",
      digitalSoft: "மூடுபனிக்கு அருகில் இருங்கள்.",
      digitalDone: "நீங்கள் பட்டியலில் உள்ளீர்கள்.",
      digitalEmail: "மின்னஞ்சல்",
      digitalJoin: "சேர",
      heroEyebrow: "கானான் டிராவல் ஹப் · கொடைக்கானல்",
      heroTitle: "ஒவ்வொரு பயணமும் ஆச்சரியத்துடன் தொடங்கும்.",
      heroSub: "இதுவரை இல்லாதபடி கொடைக்கானலைக் கண்டுபிடியுங்கள்.",
      heroExplore: "அனுபவங்களை ஆராயுங்கள்",
      heroWatch: "கதையைப் பாருங்கள்",
      heroScroll: "உருட்டவும்",
      heroStoryTitle: "கொடைக்கானல் கதை",
      heroStoryNote: "உங்கள் கொடைக்கானல் திரைப்படத்தை இங்கே இணைக்கலாம்.",
    },
  },
  hi: {
    destinationsSection: {
      eyebrow: "गंतव्य",
      title: "कोडाइकनाल",
      subtitle: "अभी हमारा एकमात्र टूर डेस्टिनेशन — पहाड़ियों की रानी के पूरे पैकेज।",
      featured: "विशेष",
      from: "शुरू से",
      viewAll: "कोडाइकनाल देखें",
    },
    film: {
      frameEyebrow: "आपके दिन की फ़िल्म में",
      frameBody: "इस फ्रेम के साथ रुकें। आगे बढ़ने से पहले हवा को थमने दें।",
      finaleEyebrow: "दिन फिर सोने जैसा लौटता है",
      finaleTitle: "आप कोहरे से होकर चल चुके हैं।",
      finaleBody: "अगर दिल अभी भी चोटी पर है — कनान आपको वहाँ ले जाएगा।",
      openLine1: "कोहरे में खो जाएँ।",
      openLine2: "कोडाइकनाल इंतज़ार कर रहा है।",
      openHint: "दिन शुरू करें",
      brandSub: "Travel Hub",
    },
    homeCinematic: {
      whyKodaiEyebrow: "क्यों कोडाइकनाल",
      whyKodaiTitle: "एक जगह जो धीमा होने को कहती है।",
      whyKodaiBody:
        "चीड़ पर कोहरा। शांत झीलें। सड़कें जो तब खुलती हैं जब आप तैयार हों। कनान कोडई को अनुभव बनाता है — चेकलिस्ट नहीं।",
      immersiveEyebrow: "इमर्सिव अनुभव",
      immersiveTitle: "पहाड़ियों में बहते चलें।",
      whyCanaanEyebrow: "क्यों कनान",
      whyCanaanTitle: "प्रीमियम सहज लगता है।",
      whyCanaan: {
        quiet: {
          title: "शांत विलासिता",
          body: "आपके पूछने से पहले हर विवरण — ठहराव, ट्रांसफर, रफ्तार।",
        },
        specialists: {
          title: "कोडई विशेषज्ञ",
          body: "एक गंतव्य, गहराई से जाना हुआ। सड़कें, मौसम, छिपी शांति।",
        },
        trusted: {
          title: "भरोसेमंद देखभाल",
          body: "स्पष्ट मार्गदर्शन, निजी होस्ट, शांत संवाद।",
        },
        human: {
          title: "मानवीय आतिथ्य",
          body: "टेम्पलेट टूर नहीं — आपके इर्द-गिर्द बनी यात्रा।",
        },
      },
      storiesEyebrow: "यात्री कहानियाँ",
      mapEyebrow: "इंटरैक्टिव मैप",
      mapTitle: "पहाड़ियों का पता लगाएँ।",
      mapSelected: "चयनित",
      mapNote: "कनान के चुनिंदा पैकेज में शामिल।",
      galleryEyebrow: "गैलरी",
      galleryTitle: "कोडई के फ़्रेम।",
      timelineEyebrow: "यात्रा कहानी",
      timelineTitle: "कोहरे में लिखा एक दिन।",
      digitalEyebrow: "और उपलब्ध",
      digitalTitle: "डिजिटल पर्यटन सेवाएँ",
      digitalBody:
        "पैकेज केवल कोडाइकनाल। फ़्लाइट, होटल और वीज़ा आपकी यात्रा में मदद करते हैं।",
      digitalCta: "सेवाएँ देखें",
      digitalSoft: "कोहरे के पास रहें।",
      digitalDone: "आप सूची में हैं।",
      digitalEmail: "ईमेल",
      digitalJoin: "जुड़ें",
      heroEyebrow: "कनान ट्रैवल हब · कोडाइकनाल",
      heroTitle: "हर यात्रा आश्चर्य से शुरू होती है।",
      heroSub: "कोडाइकनाल को पहले कभी न देखे अंदाज़ में खोजें।",
      heroExplore: "अनुभव देखें",
      heroWatch: "कहानी देखें",
      heroScroll: "स्क्रॉल",
      heroStoryTitle: "कोडाइकनाल कहानी",
      heroStoryNote: "अपनी कोडाइकनाल फ़िल्म यहाँ जोड़ें।",
    },
  },
};

for (const locale of ["en", "ta", "hi"]) {
  const path = join(root, `messages/${locale}.json`);
  const data = JSON.parse(readFileSync(path, "utf8"));
  Object.assign(data, patch[locale]);
  // ensure film keys merged if partial existed
  data.film = { ...(data.film || {}), ...patch[locale].film };
  writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
  console.log("patched", locale);
}
