/**
 * Single source of truth for every string on the page.
 *
 * All company facts (services, statistics, values, operating model, clients,
 * certifications, contact details) come from the Ramses Services company
 * profile. Nothing here is invented — do not add a client, certification or
 * statistic that is not in the profile.
 *
 * `en` is typed as `typeof ar`, so the two locales can never drift apart.
 */

export const SECTIONS = [
  "home",
  "about",
  "services",
  "operations",
  "equipment",
  "clients",
  "contact",
] as const;

export type SectionId = (typeof SECTIONS)[number];

export const CONTACT = {
  phone: "057/2404004",
  phoneHref: "tel:+20572404004",
  mobile: "01050804473",
  mobileHref: "tel:+201050804473",
  whatsapp: "https://wa.me/201050804473",
  email: "info@ramsesservice.com",
  emailHref: "mailto:info@ramsesservice.com",
  website: "www.ramsesservice.com",
  websiteHref: "https://www.ramsesservice.com",
  mapCairoHref: "https://maps.app.goo.gl/VEeQfW7EWKZgvCsg8?g_st=iw",
  mapDamiettaHref: "https://maps.app.goo.gl/KDU4zizD6TnMmntc6?g_st=iw",
} as const;

const ar = {
  meta: {
    title: "رمسيس سيرفيس | حلول متكاملة للنظافة والتشغيل",
    description:
      "رمسيس سيرفيس شركة متخصصة في خدمات النظافة المتكاملة وإدارة عمليات النظافة للمؤسسات الحكومية والخاصة في مصر، بخبرة تتجاوز 10 سنوات.",
  },
  dir: "rtl",
  langLabel: "EN",
  langSwitchTo: "التبديل إلى الإنجليزية",
  nav: {
    home: "الرئيسية",
    about: "من نحن",
    services: "خدماتنا",
    operations: "منظومة التشغيل",
    equipment: "المعدات",
    clients: "عملاؤنا",
    contact: "تواصل معنا",
  },
  cta: "اطلب معاينة",
  menu: { open: "فتح القائمة", close: "إغلاق القائمة" },
  loader: { tagline: "حلول متكاملة للنظافة والتشغيل", loading: "جارٍ التحميل" },

  hero: {
    eyebrow: "خدمات نظافة احترافية في مصر",
    title: "رمسيس سيرفيس",
    subtitle: "حلول متكاملة للنظافة والتشغيل",
    text: "أكثر من 10 سنوات من الخبرة في تقديم خدمات نظافة احترافية لمختلف القطاعات.",
    primary: "اكتشف خدماتنا",
    secondary: "تواصل معنا",
    scroll: "مرّر للأسفل",
  },

  about: {
    label: "من نحن",
    heading: "شريككم الاستراتيجي في النظافة والتشغيل",
    lead: "نسعى لأن نكون شريككم الاستراتيجي في النظافة والتشغيل",
    body: [
      "رمسيس سيرفيس شركة متخصصة في تقديم خدمات النظافة المتكاملة وإدارة عمليات النظافة للمؤسسات الحكومية والخاصة في مصر.",
      "تمتلك الشركة أكثر من 10 سنوات من الخبرة العملية، وتعمل من خلال منظومة احترافية تعتمد على كوادر بشرية مدربة، ومعدات مناسبة، وإشراف ومتابعة للجودة، ودعم تشغيلي مستمر.",
    ],
    points: [
      "كوادر بشرية مدربة",
      "معدات مناسبة لكل موقع",
      "إشراف ومتابعة للجودة",
      "دعم تشغيلي مستمر",
    ],
    imageAlt: "فريق رمسيس سيرفيس أثناء العمل في أحد المواقع",
  },

  stats: {
    label: "أرقامنا",
    heading: "خبرة موثوقة بالأرقام",
    items: [
      { value: 10, suffix: "+", label: "سنوات خبرة" },
      { value: 500, suffix: "+", label: "عامل ومشرف وفني" },
      { value: 50, suffix: "+", label: "موقعًا تتم خدمته" },
      { value: 95, suffix: "%", label: "معدل رضا العملاء" },
    ],
  },

  vmv: {
    label: "هويتنا",
    heading: "رؤيتنا ورسالتنا وقيمنا",
    tabs: [
      {
        key: "vision",
        title: "رؤيتنا",
        text: "أن تكون رمسيس سيرفيس الشريك الاستراتيجي الأول للمنشآت والمؤسسات في خدمات النظافة المتكاملة وإدارة المرافق.",
        list: [] as string[],
      },
      {
        key: "mission",
        title: "رسالتنا",
        text: "تقديم خدمات نظافة متكاملة وفق أساليب تشغيل حديثة ومعايير مهنية، من خلال كوادر مدربة ومعدات مناسبة تحقق رضا العملاء وتحافظ على استدامة جودة الخدمة.",
        list: [] as string[],
      },
      {
        key: "values",
        title: "قيمنا",
        text: "القيم التي توجّه عملنا اليومي في كل موقع نخدمه.",
        list: [
          "الجودة والاحترافية",
          "الالتزام والمسؤولية",
          "النزاهة والشفافية",
          "التطوير المستمر",
          "سرعة الاستجابة",
          "رضا العملاء",
          "العمل بروح الفريق",
        ],
      },
    ],
  },

  services: {
    label: "خدماتنا",
    heading: "خدمات نظافة متكاملة لكل قطاع",
    intro: "نغطي احتياجات النظافة والتشغيل لمختلف أنواع المنشآت وفق طبيعة كل موقع.",
    more: "اعرف المزيد",
    items: [
      {
        title: "نظافة المستشفيات والمنشآت الطبية",
        text: "برامج نظافة دقيقة تراعي طبيعة البيئة الطبية ومعايير السلامة داخل المنشآت الصحية.",
      },
      {
        title: "نظافة المصانع والمخازن",
        text: "خدمات نظافة صناعية للمساحات الكبيرة وخطوط الإنتاج والمخازن مع الالتزام بمعايير السلامة المهنية.",
      },
      {
        title: "نظافة المنشآت الإدارية",
        text: "نظافة يومية منتظمة للمقرات الإدارية والمكاتب تحافظ على بيئة عمل مرتبة ومنظمة.",
      },
      {
        title: "تنظيف الواجهات الزجاجية",
        text: "تنظيف الواجهات الزجاجية باستخدام معدات مناسبة وفرق مدربة على أعمال الارتفاعات.",
      },
      {
        title: "نظافة المولات والمراكز التجارية",
        text: "تشغيل ونظافة مستمرة للمساحات ذات الكثافة العالية من الزوار على مدار ساعات العمل.",
      },
      {
        title: "نظافة المدارس والجامعات",
        text: "خدمات نظافة للمنشآت التعليمية تراعي سلامة الطلاب وانتظام العمل خلال اليوم الدراسي.",
      },
    ],
  },

  operations: {
    label: "منظومة التشغيل",
    heading: "منظومة تشغيل واضحة من التخطيط إلى التقرير",
    intro: "نعمل من خلال أربع مراحل مترابطة تضمن انتظام الخدمة ومتابعة الجودة.",
    steps: [
      {
        title: "إدارة التشغيل",
        items: [
          "تخطيط السياسات والأنظمة التشغيلية",
          "تحديد المعايير والإجراءات",
          "متابعة الأداء",
          "دعم العمليات اليومية",
        ],
      },
      {
        title: "مشرف الموقع",
        items: [
          "الإشراف على التنفيذ اليومي",
          "متابعة الحضور والجودة",
          "حل مشكلات الموقع",
          "التواصل مع إدارة التشغيل",
        ],
      },
      {
        title: "فريق العمل",
        items: [
          "كوادر مدربة",
          "الالتزام بالتعليمات",
          "الاستخدام المهني للمواد والأدوات",
          "العمل بروح الفريق والإنتاجية",
        ],
      },
      {
        title: "تقارير الجودة",
        items: ["تقييم الجودة", "تقارير الأداء والملاحظات", "تحليل البيانات", "التحسين المستمر"],
      },
    ],
  },

  equipment: {
    label: "المعدات",
    heading: "معدات مهنية مناسبة لطبيعة كل موقع",
    intro: "نعتمد على معدات نظافة مهنية قياسية مع صيانة دورية وجاهزية مستمرة.",
    items: [
      { title: "ماكينات جلي الأرضيات", text: "لتلميع وتنظيف الأرضيات الصلبة في المساحات الواسعة." },
      { title: "ماكينات شفط صناعية", text: "شفط الأتربة والسوائل داخل المصانع والمخازن والمنشآت الكبيرة." },
      { title: "ماكينات غسيل الأرضيات", text: "غسيل وتجفيف الأرضيات بكفاءة وفي وقت أقل." },
      { title: "معدات تنظيف الواجهات الزجاجية", text: "معدات مخصصة لأعمال الواجهات مع الالتزام بإجراءات السلامة." },
      { title: "عربات النظافة", text: "عربات تشغيل منظمة تحمل الأدوات والمواد داخل الموقع." },
      { title: "الأدوات اليدوية", text: "ممسحات ومقشات وجرادل وأدوات يدوية للاستخدام اليومي." },
      { title: "مواد نظافة آمنة", text: "مواد نظافة آمنة تُستخدم وفق طبيعة كل سطح وكل موقع." },
    ],
    notes: ["صيانة دورية للمعدات", "فرق مدربة على التشغيل", "جاهزية مستمرة"],
  },

  why: {
    label: "لماذا نحن",
    heading: "لماذا تختار رمسيس سيرفيس؟",
    items: [
      "أكثر من 10 سنوات من الخبرة",
      "أكثر من 500 عامل ومشرف وفني",
      "منظومة تشغيل وإشراف متكاملة",
      "معايير الجودة والسلامة المهنية",
      "خبرة في المواقع المتوسطة والكبيرة",
      "سرعة الاستجابة",
      "دعم تشغيلي مستمر",
      "كوادر بشرية مدربة",
      "معدات مناسبة لكل موقع",
      "تقارير أداء دورية",
      "سجل مشروعات ناجح",
    ],
  },

  quality: {
    label: "الجودة والسلامة",
    heading: "نعمل وفق معايير موثقة",
    intro: "نلتزم بمعايير الجودة والسلامة المهنية ونوثق المتابعة عبر تقارير دورية.",
    badges: [
      { code: "ISO 9001", title: "إدارة الجودة" },
      { code: "ISO 45001", title: "إدارة الصحة والسلامة المهنية" },
    ],
    items: [
      "الوعي البيئي والاستدامة",
      "الالتزام بلوائح العمل والسلامة المهنية",
      "متابعة دورية",
      "تقارير جودة موثقة",
    ],
  },

  clients: {
    label: "عملاؤنا",
    heading: "قطاعات نخدمها وأعمال سابقة",
    intro: "نخدم جهات حكومية وشركات ومنشآت طبية وتعليمية وتجارية في مختلف المحافظات.",
    sectorsLabel: "القطاعات",
    worksLabel: "من أعمالنا السابقة",
    all: "الكل",
    more: "عرض المزيد",
    less: "عرض أقل",
    sectors: [
      "هيئة ميناء دمياط",
      "دانون",
      "شركة مياه الشرب والصرف الصحي",
      "المستشفيات والمنشآت الطبية",
      "المولات والمراكز التجارية",
      "الهيئات الحكومية والوزارات",
      "المصانع والشركات الصناعية",
      "المدارس والجامعات والمؤسسات التعليمية",
    ],
    filters: [
      { key: "all", label: "الكل" },
      { key: "gov", label: "جهات حكومية" },
      { key: "health", label: "منشآت طبية" },
      { key: "commercial", label: "تجاري وفندقي" },
      { key: "education", label: "تعليمي" },
      { key: "industry", label: "صناعي" },
    ],
    works: [
      { name: "ميناء دمياط", type: "gov" },
      { name: "شركة مياه الشرب والصرف الصحي بدمياط", type: "gov" },
      { name: "مول الصياد بلازا", type: "commercial" },
      { name: "مول الصفوة", type: "commercial" },
      { name: "مستشفى الأزهر بدمياط الجديدة", type: "health" },
      { name: "مستشفى الشروق", type: "health" },
      { name: "مستشفى الصفا بدمياط", type: "health" },
      { name: "فندق كورتيل", type: "commercial" },
      { name: "مركز النور للعيون", type: "health" },
      { name: "مدارس سمارت الخاصة", type: "education" },
      { name: "Smart Private Language Schools", type: "education" },
      { name: "شركة دانون", type: "industry" },
    ],
  },

  finalCta: {
    heading: "نسعى لأن نكون شركاء نجاحكم",
    text: "دعنا نضع خطة نظافة وتشغيل تناسب طبيعة موقعك واحتياجاتك.",
    button: "اطلب معاينة لموقعك",
    secondary: "تحدث معنا على واتساب",
  },

  contact: {
    label: "تواصل معنا",
    heading: "نحن قريبون منك",
    intro: "اتصل بنا أو راسلنا لتحديد موعد معاينة مجانية لموقعك.",
    officesLabel: "مكاتبنا",
    offices: [
      {
        city: "القاهرة",
        short: "مدينة نصر – أمام السراج مول",
        full: "شارع أحمد فخري، امتداد مكرم عبيد، مدينة نصر، القاهرة",
      },
      {
        city: "دمياط الجديدة",
        short: "المنطقة المركزية – خلف بنك القاهرة",
        full: "المنطقة المركزية – خلف بنك القاهرة، دمياط الجديدة",
      },
    ],
    phoneLabel: "هاتف",
    mobileLabel: "موبايل / واتساب",
    emailLabel: "البريد الإلكتروني",
    websiteLabel: "الموقع الإلكتروني",
    call: "اتصل بنا",
    whatsapp: "واتساب",
    mail: "راسلنا",
    directions: "عرض العنوان",
    mapNote: "خريطة تفاعلية — سيتم ربط الموقع الدقيق قريبًا.",
  },

  /** Two standalone location sections — one per branch, rendered separately. */
  locations: {
    mapNote: "معاينة توضيحية — اضغط الزر لفتح الموقع الدقيق على خرائط جوجل.",
    items: [
      {
        label: "فرع القاهرة",
        city: "القاهرة",
        address: "مدينة نصر – شارع أحمد فخري، امتداد مكرم عبيد، القاهرة",
        cta: "عرض الموقع على الخريطة",
        aria: "فتح موقع فرع القاهرة على خرائط جوجل",
        href: CONTACT.mapCairoHref,
      },
      {
        label: "فرع دمياط الجديدة",
        city: "دمياط الجديدة",
        address: "المنطقة المركزية – خلف بنك القاهرة، دمياط الجديدة",
        cta: "عرض الموقع على الخريطة",
        aria: "فتح موقع فرع دمياط الجديدة على خرائط جوجل",
        href: CONTACT.mapDamiettaHref,
      },
    ],
  },

  footer: {
    about:
      "شركة متخصصة في خدمات النظافة المتكاملة وإدارة عمليات النظافة للمؤسسات الحكومية والخاصة في مصر.",
    navLabel: "روابط سريعة",
    servicesLabel: "خدماتنا",
    contactLabel: "معلومات التواصل",
    social: "تابعنا",
    socialSoon: "روابط التواصل الاجتماعي قريبًا",
    rights: "جميع الحقوق محفوظة",
    top: "العودة إلى الأعلى",
  },

  a11y: {
    logo: "شعار رمسيس سيرفيس",
    whatsapp: "تواصل معنا عبر واتساب",
    heroSequence: "لقطات متتابعة توضح أعمال النظافة على واجهة أحد المباني",
  },
};

const en: typeof ar = {
  meta: {
    title: "Ramses Services | Integrated Cleaning & Operations Solutions",
    description:
      "Ramses Services is a specialized company providing integrated cleaning services and cleaning operations management for governmental and private institutions in Egypt, with more than 10 years of experience.",
  },
  dir: "ltr",
  langLabel: "ع",
  langSwitchTo: "Switch to Arabic",
  nav: {
    home: "Home",
    about: "About",
    services: "Services",
    operations: "Operations",
    equipment: "Equipment",
    clients: "Clients",
    contact: "Contact",
  },
  cta: "Request a Site Visit",
  menu: { open: "Open menu", close: "Close menu" },
  loader: { tagline: "Integrated Cleaning & Operations Solutions", loading: "Loading" },

  hero: {
    eyebrow: "Professional cleaning services in Egypt",
    title: "Ramses Services",
    subtitle: "Integrated Cleaning & Operations Solutions",
    text: "More than 10 years of experience delivering professional cleaning services across multiple sectors.",
    primary: "Explore Our Services",
    secondary: "Contact Us",
    scroll: "Scroll",
  },

  about: {
    label: "Who We Are",
    heading: "Your strategic partner in cleaning and operations",
    lead: "We aim to be your strategic partner in cleaning and operations.",
    body: [
      "Ramses Services is a specialized company providing integrated cleaning services and cleaning operations management for governmental and private institutions in Egypt.",
      "The company has more than 10 years of practical experience and operates through a professional system based on trained human resources, suitable equipment, supervision, quality monitoring, and continuous operational support.",
    ],
    points: [
      "Trained human resources",
      "Suitable equipment per site",
      "Supervision & quality monitoring",
      "Continuous operational support",
    ],
    imageAlt: "The Ramses Services team at work on site",
  },

  stats: {
    label: "By the numbers",
    heading: "Experience you can measure",
    items: [
      { value: 10, suffix: "+", label: "Years of Experience" },
      { value: 500, suffix: "+", label: "Workers, Supervisors & Technicians" },
      { value: 50, suffix: "+", label: "Active Service Locations" },
      { value: 95, suffix: "%", label: "Client Satisfaction Rate" },
    ],
  },

  vmv: {
    label: "Our identity",
    heading: "Vision, Mission & Values",
    tabs: [
      {
        key: "vision",
        title: "Our Vision",
        text: "For Ramses Services to be the first strategic partner for facilities and institutions in integrated cleaning services and facility management.",
        list: [],
      },
      {
        key: "mission",
        title: "Our Mission",
        text: "To deliver integrated cleaning services using modern operating methods and professional standards, through trained personnel and suitable equipment that achieve client satisfaction and sustain service quality.",
        list: [],
      },
      {
        key: "values",
        title: "Our Values",
        text: "The values that guide our daily work on every site we serve.",
        list: [
          "Quality & Professionalism",
          "Commitment & Responsibility",
          "Integrity & Transparency",
          "Continuous Development",
          "Fast Response",
          "Customer Satisfaction",
          "Teamwork",
        ],
      },
    ],
  },

  services: {
    label: "Our Services",
    heading: "Integrated cleaning services for every sector",
    intro: "We cover the cleaning and operations needs of all facility types, tailored to each site.",
    more: "Learn More",
    items: [
      {
        title: "Hospitals & Medical Facilities Cleaning",
        text: "Precise cleaning programmes that respect the medical environment and the safety standards of healthcare facilities.",
      },
      {
        title: "Factories & Warehouses Cleaning",
        text: "Industrial cleaning for large areas, production lines and warehouses, in line with occupational safety standards.",
      },
      {
        title: "Administrative Facilities Cleaning",
        text: "Regular daily cleaning for head offices and workspaces that keeps the working environment tidy and organized.",
      },
      {
        title: "Glass Façade Cleaning",
        text: "Façade cleaning with suitable equipment and teams trained for work at height.",
      },
      {
        title: "Malls & Commercial Centers Cleaning",
        text: "Continuous cleaning and operations for high-traffic areas throughout opening hours.",
      },
      {
        title: "Schools & Universities Cleaning",
        text: "Cleaning services for educational facilities that protect students and keep the school day running.",
      },
    ],
  },

  operations: {
    label: "Our Operating System",
    heading: "A clear operating system from planning to reporting",
    intro: "We work through four connected stages that keep service consistent and quality monitored.",
    steps: [
      {
        title: "Operations Management",
        items: [
          "Planning policies and operational systems",
          "Defining standards and procedures",
          "Monitoring performance",
          "Supporting daily operations",
        ],
      },
      {
        title: "Site Supervisor",
        items: [
          "Supervising daily implementation",
          "Checking attendance and quality",
          "Resolving site issues",
          "Communicating with operations management",
        ],
      },
      {
        title: "Work Team",
        items: [
          "Trained personnel",
          "Adherence to instructions",
          "Professional use of materials and tools",
          "Teamwork and productivity",
        ],
      },
      {
        title: "Quality Reports",
        items: ["Quality evaluation", "Performance and issue reporting", "Data analysis", "Continuous improvement"],
      },
    ],
  },

  equipment: {
    label: "Equipment",
    heading: "Professional equipment suited to every site",
    intro: "We rely on standard professional cleaning equipment with regular maintenance and continuous readiness.",
    items: [
      { title: "Floor-Polishing Machines", text: "Polishing and cleaning hard floors across large areas." },
      { title: "Industrial Vacuum Machines", text: "Dust and liquid extraction in factories, warehouses and large facilities." },
      { title: "Floor-Washing Machines", text: "Washing and drying floors efficiently and in less time." },
      { title: "Glass Façade Equipment", text: "Dedicated façade equipment used with full safety procedures." },
      { title: "Cleaning Carts", text: "Organized service carts that carry tools and materials around the site." },
      { title: "Manual Tools", text: "Mops, brooms, buckets and hand tools for everyday work." },
      { title: "Safe Cleaning Materials", text: "Safe cleaning materials selected for each surface and each site." },
    ],
    notes: ["Regular equipment maintenance", "Trained operating teams", "Continuous readiness"],
  },

  why: {
    label: "Why us",
    heading: "Why Choose Ramses Services?",
    items: [
      "More than 10 years of experience",
      "More than 500 workers, supervisors and technicians",
      "Integrated operating and supervision system",
      "Quality and occupational-safety standards",
      "Experience with medium and large sites",
      "Fast response",
      "Continuous operational support",
      "Trained human resources",
      "Suitable equipment for each site",
      "Periodic performance reports",
      "Successful project record",
    ],
  },

  quality: {
    label: "Quality & Safety",
    heading: "We work to documented standards",
    intro: "We commit to quality and occupational-safety standards, documented through regular reporting.",
    badges: [
      { code: "ISO 9001", title: "Quality Management" },
      { code: "ISO 45001", title: "Occupational Health & Safety Management" },
    ],
    items: [
      "Environmental and sustainability awareness",
      "Compliance with labor and occupational-safety regulations",
      "Regular follow-up",
      "Documented quality reporting",
    ],
  },

  clients: {
    label: "Clients",
    heading: "Sectors we serve & selected work",
    intro: "We serve governmental bodies, companies, and medical, educational and commercial facilities.",
    sectorsLabel: "Sectors",
    worksLabel: "Selected previous work",
    all: "All",
    more: "View More",
    less: "View Less",
    sectors: [
      "Damietta Port Authority",
      "Danone",
      "Water and Sanitation Company",
      "Hospitals & medical facilities",
      "Malls & commercial centers",
      "Governmental authorities & ministries",
      "Factories & industrial companies",
      "Schools, universities & educational institutions",
    ],
    filters: [
      { key: "all", label: "All" },
      { key: "gov", label: "Government" },
      { key: "health", label: "Healthcare" },
      { key: "commercial", label: "Commercial & Hospitality" },
      { key: "education", label: "Education" },
      { key: "industry", label: "Industrial" },
    ],
    works: [
      { name: "Damietta Port", type: "gov" },
      { name: "Damietta Water & Sanitation Company", type: "gov" },
      { name: "El Sayad Plaza Mall", type: "commercial" },
      { name: "El Safwa Mall", type: "commercial" },
      { name: "Al-Azhar Hospital, New Damietta", type: "health" },
      { name: "El Shorouk Hospital", type: "health" },
      { name: "El Safa Hospital, Damietta", type: "health" },
      { name: "Curtel Hotel", type: "commercial" },
      { name: "El Nour Eye Center", type: "health" },
      { name: "Smart Private Schools", type: "education" },
      { name: "Smart Private Language Schools", type: "education" },
      { name: "Danone", type: "industry" },
    ],
  },

  finalCta: {
    heading: "We Aim to Be Your Partner in Success",
    text: "Let us create a cleaning and operations plan tailored to your site and requirements.",
    button: "Request a Site Visit",
    secondary: "Chat on WhatsApp",
  },

  contact: {
    label: "Contact",
    heading: "We are close to you",
    intro: "Call or message us to arrange a free site visit.",
    officesLabel: "Our offices",
    offices: [
      {
        city: "Cairo",
        short: "Nasr City — opposite Al Serag Mall",
        full: "Ahmed Fakhry Street, Makram Ebeid Extension, Nasr City, Cairo",
      },
      {
        city: "New Damietta",
        short: "Central district — behind Banque du Caire",
        full: "Central district — behind Banque du Caire, New Damietta",
      },
    ],
    phoneLabel: "Phone",
    mobileLabel: "Mobile / WhatsApp",
    emailLabel: "Email",
    websiteLabel: "Website",
    call: "Call us",
    whatsapp: "WhatsApp",
    mail: "Email us",
    directions: "View address",
    mapNote: "Interactive map — the exact location link will be added soon.",
  },

  locations: {
    mapNote: "Illustrative preview — tap the button to open the exact location on Google Maps.",
    items: [
      {
        label: "Cairo Branch",
        city: "Cairo",
        address: "Nasr City – Ahmed Fakhry St., Makram Ebeid Extension, Cairo",
        cta: "View on Google Maps",
        aria: "Open Cairo branch on Google Maps",
        href: CONTACT.mapCairoHref,
      },
      {
        label: "New Damietta Branch",
        city: "New Damietta",
        address: "Central Area – Behind Banque du Caire, New Damietta",
        cta: "View on Google Maps",
        aria: "Open New Damietta branch on Google Maps",
        href: CONTACT.mapDamiettaHref,
      },
    ],
  },

  footer: {
    about:
      "A specialized company providing integrated cleaning services and cleaning operations management for governmental and private institutions in Egypt.",
    navLabel: "Quick links",
    servicesLabel: "Services",
    contactLabel: "Contact details",
    social: "Follow us",
    socialSoon: "Social links coming soon",
    rights: "All rights reserved",
    top: "Back to top",
  },

  a11y: {
    logo: "Ramses Services logo",
    whatsapp: "Contact us on WhatsApp",
    heroSequence: "Image sequence showing cleaning work on a building façade",
  },
};

export const content = { ar, en };
export type Locale = keyof typeof content;
export type Dict = typeof ar;
