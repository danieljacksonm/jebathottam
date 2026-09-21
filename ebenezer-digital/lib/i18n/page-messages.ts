export type HomeMessages = {
  kicker: string;
  build: string;
  digital: string;
  experiences: string;
  sceneBuild: string;
  sceneDigital: string;
  sceneExperiences: string;
  subtextSuffix: string;
  ctaStart: string;
  ctaWork: string;
  ctaServices: string;
};

export type StudioMessages = {
  work: string;
  process: string;
  about: string;
  whatWeDo: string;
  servicesIntro: string;
  startProject: string;
};

export type CommonCopy = {
  skipToContent: string;
  menu: string;
  close: string;
  ecosystem: string;
  letsTalk: string;
  loading: string;
  exploreServices: string;
  all: string;
  ongoing: string;
  completed: string;
  web: string;
  travel: string;
  project: string;
  viewCaseStudy: string;
  seeHowWeBuild: string;
  viewLiveSite: string;
  noProjectsFilter: string;
  previous: string;
  continue: string;
  sending: string;
  sendProject: string;
  privacy: string;
  terms: string;
  rights: string;
};

export type ContactCopy = {
  kicker: string;
  titleLine1: string;
  titleLine2: string;
  titleLine3: string;
  intro: string;
  email: string;
  phone: string;
  whatsapp: string;
  location: string;
  locationValue: string;
  hours: string;
  hoursValue: string;
  receivedKicker: string;
  receivedTitle: string;
  receivedBody: string;
  stepService: string;
  stepBudget: string;
  stepMessage: string;
  stepDetails: string;
  optWeb: string;
  optData: string;
  optTravel: string;
  optOther: string;
  messagePlaceholder: string;
  namePlaceholder: string;
  emailPlaceholder: string;
  errorBody: string;
  contactPageIntro: string;
};

export type PortfolioCopy = {
  kicker: string;
  titleLine1: string;
  titleLine2: string;
  titleLine3: string;
  intro: string;
};

export type FooterCopy = {
  titleLine1: string;
  titleLine2: string;
  titleLine3: string;
  titleAccent: string;
  newsletterPlaceholder: string;
  servicesHeading: string;
  ecosystemHeading: string;
  companyHeading: string;
  supportHeading: string;
  linkWebDev: string;
  linkDataEntry: string;
  linkTravel: string;
  linkVirtualAssist: string;
  linkAbout: string;
  linkWork: string;
  linkCaseStudies: string;
  linkProducts: string;
  linkMedia: string;
  linkFaq: string;
  linkCareers: string;
  linkContact: string;
  linkPrivacy: string;
  linkTerms: string;
  defaultDescription: string;
};

export type WorkCopy = {
  kicker: string;
  titleLine1: string;
  titleLine2: string;
  intro: string;
  caseStudy: string;
  viewLive: string;
  loading: string;
  emptyFilter: string;
};

export type ProcessCopy = {
  kicker: string;
  titleLine1: string;
  titleLine2: string;
  intro: string;
  steps: { title: string; body: string }[];
};

export type WhyCopy = {
  kicker: string;
  titleLine1: string;
  titleLine2: string;
  intro: string;
  pillars: { title: string; body: string }[];
};

export type StudioSiteCopy = {
  home: HomeMessages;
  studio: StudioMessages;
  common: CommonCopy;
  stats: { value: string; label: string }[];
  contact: ContactCopy;
  portfolio: PortfolioCopy;
  footer: FooterCopy;
  work: WorkCopy;
  process: ProcessCopy;
  why: WhyCopy;
};

export const EN_HOME: HomeMessages = {
  kicker: "Ebenezer Digital Services",
  build: "BUILD",
  digital: "DIGITAL",
  experiences: "EXPERIENCES.",
  sceneBuild: "Websites, systems, and operations that ship on time.",
  sceneDigital: "Clear code, reliable delivery, and interfaces people trust.",
  sceneExperiences: "Digital work for businesses that need a dependable partner.",
  subtextSuffix: "Web development, e-commerce, automation, and ongoing support for teams worldwide.",
  ctaStart: "Start a project →",
  ctaWork: "View our work",
  ctaServices: "Our services",
};

export const EN_STUDIO: StudioMessages = {
  work: "Work",
  process: "Process",
  about: "About",
  whatWeDo: "WHAT WE DO.",
  servicesIntro:
    "From admin tasks to web development and travel support — a range of digital services tailored to your needs.",
  startProject: "Start a project →",
};

export const EN_SITE_PAGES: Omit<StudioSiteCopy, "home" | "studio"> = {
  common: {
    skipToContent: "Skip to content",
    menu: "Menu",
    close: "Close",
    ecosystem: "Ecosystem",
    letsTalk: "Let's talk",
    loading: "Loading…",
    exploreServices: "Explore services",
    all: "All",
    ongoing: "Ongoing",
    completed: "Completed",
    web: "Web",
    travel: "Travel",
    project: "Project",
    viewCaseStudy: "View case study →",
    seeHowWeBuild: "See how we build",
    viewLiveSite: "View live site →",
    noProjectsFilter: "No projects in this filter.",
    previous: "Previous",
    continue: "Continue",
    sending: "Sending…",
    sendProject: "Send project →",
    privacy: "Privacy",
    terms: "Terms",
    rights: "All rights reserved.",
  },
  stats: [
    { value: "Build", label: "Software & web products" },
    { value: "Ship", label: "Store, Tools, SaaS & AI" },
    { value: "Publish", label: "News & Journal" },
    { value: "Support", label: "Clear project communication" },
  ],
  contact: {
    kicker: "Begin",
    titleLine1: "LET'S BUILD",
    titleLine2: "SOMETHING",
    titleLine3: "EXCEPTIONAL.",
    intro: "Send a message with your requirements and we will get back to you as soon as possible.",
    email: "Email",
    phone: "Phone",
    whatsapp: "WhatsApp",
    location: "Location",
    locationValue: "Remote / Worldwide",
    hours: "Working Hours",
    hoursValue: "Mon–Sat · reply within one business day",
    receivedKicker: "Received",
    receivedTitle: "PROJECT RECEIVED.",
    receivedBody: "We'll reply soon.",
    stepService: "What are you building?",
    stepBudget: "What's your budget?",
    stepMessage: "Tell us about it.",
    stepDetails: "How do we reach you?",
    optWeb: "Web Development",
    optData: "Data Entry & Admin",
    optTravel: "Travel & Booking",
    optOther: "Other Services",
    messagePlaceholder: "Tell us about your project...",
    namePlaceholder: "Your name",
    emailPlaceholder: "your@email.com",
    errorBody: "Something went wrong. Please try again or email us.",
    contactPageIntro: "Send a message with your requirements and we will get back to you as soon as possible.",
  },
  portfolio: {
    kicker: "Selected work",
    titleLine1: "WORK",
    titleLine2: "IN THE",
    titleLine3: "WORLD.",
    intro: "Real client projects — ongoing builds and completed deliveries across web, travel, and business systems.",
  },
  footer: {
    titleLine1: "LET'S",
    titleLine2: "MAKE",
    titleLine3: "DIGITAL",
    titleAccent: "MATTER.",
    newsletterPlaceholder: "Enter your email",
    servicesHeading: "Services",
    ecosystemHeading: "Ecosystem",
    companyHeading: "Company",
    supportHeading: "Support",
    linkWebDev: "Web Development",
    linkDataEntry: "Data Entry",
    linkTravel: "Travel Booking",
    linkVirtualAssist: "Virtual Assistance",
    linkAbout: "About Us",
    linkWork: "Our Work",
    linkCaseStudies: "Case studies",
    linkProducts: "Products",
    linkMedia: "Media",
    linkFaq: "FAQ",
    linkCareers: "Careers",
    linkContact: "Contact",
    linkPrivacy: "Privacy Policy",
    linkTerms: "Terms of Service",
    defaultDescription: "Reliable digital work for businesses everywhere. We deliver excellence in every project.",
  },
  work: {
    kicker: "Work",
    titleLine1: "OUR",
    titleLine2: "WORK.",
    intro:
      "Ongoing builds and completed projects for real clients — ministry platforms, shop systems, travel sites, and business tools.",
    caseStudy: "Case study →",
    viewLive: "View live site →",
    loading: "Loading projects…",
    emptyFilter: "No projects in this filter.",
  },
  process: {
    kicker: "Process",
    titleLine1: "HOW WE",
    titleLine2: "WORK WITH YOU.",
    intro: "A simple, transparent process from first message to final delivery.",
    steps: [
      {
        title: "You contact us",
        body: "Reach out by email or WhatsApp with a short description of what you need. No commitment yet—just tell us about your project.",
      },
      {
        title: "Requirement discussion",
        body: "We ask a few questions to understand your goals, format, and preferences. This helps us give you an accurate quote and timeline.",
      },
      {
        title: "Clear quote & timeline",
        body: "You receive a clear quote and delivery timeline. We only start work once you are satisfied with the terms.",
      },
      {
        title: "Work execution",
        body: "We do the work and keep you updated. If anything changes, we communicate immediately so there are no surprises.",
      },
      {
        title: "Delivery & support",
        body: "We deliver as agreed. If you need small revisions or have questions, we are here to support you.",
      },
    ],
  },
  why: {
    kicker: "About",
    titleLine1: "WE FOCUS ON",
    titleLine2: "WHAT MATTERS.",
    intro: "Getting the job done well, on time, and at a fair price.",
    pillars: [
      {
        title: "Communication you can count on",
        body: "We reply quickly and in plain language. You will always know where your project stands.",
      },
      {
        title: "Quality without the jargon",
        body: "We deliver work that meets your standards. No technical overload—just results that fit your business.",
      },
      {
        title: "Affordable pricing",
        body: "Transparent quotes so you can plan. We aim to offer value that works for startups and established clients alike.",
      },
      {
        title: "Long-term support",
        body: "Need follow-up work or small changes? We are here for ongoing support so you can rely on us again and again.",
      },
    ],
  },
};
