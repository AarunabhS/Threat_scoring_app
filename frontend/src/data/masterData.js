// Normalized dataset for the dashboard.
// rawData is full feed; we transform it into:
// - metrics: 0–5 scores (scaled from IT spend/tech count/rank placeholders)
// - profile: simple insights (description, HQ, employees, etc.)
// - raw: untouched source data

const rawData = [
  {
    name: "Beam Data",
    region: "Ontario",
    country: "Canada",
    employees: "1-10",
    description: "Beam Data is an IT consultancy that provides data science consulting, corporate training, and artificial intelligence solutions.",
    status: "active",
    ipo_status: "private",
    rank: 409740,
    it_spend: 1467000,
    industries: ["AI", "Consulting", "Corporate Training", "IT"],
    tech_count: 4,
    heat_score: 86,
    founders: ["Shaohua Zhang"],
    website: "http://beamdata.ca/",
    products: ["AI Strategy", "AI Implementation", "AI Infrastructure", "Data Analytics"]
  },
  {
    name: "BRONSON CONSULTING",
    region: "Ontario",
    country: "Canada",
    employees: "11-50",
    description: "Bronson Consulting offers a wide-spectrum of management consulting services.",
    status: "active",
    ipo_status: "private",
    rank: 1909715,
    it_spend: 421514,
    industries: ["Management Consulting", "Project Management"],
    tech_count: 34,
    heat_score: 58,
    founders: [],
    website: "http://bronson.ca",
    products: ["AI & Automation Consulting", "Data & Tech Consulting", "Project Management"]
  },
  {
    name: "Xorbix Technologies",
    region: "Wisconsin",
    country: "United States",
    employees: "11-50",
    description: "Xorbix is a technology company specializing in mobile app development and custom software development.",
    status: "active",
    ipo_status: "private",
    rank: 363118,
    it_spend: 223141,
    industries: ["Mobile", "Software"],
    tech_count: 9,
    heat_score: 44,
    founders: ["Asif Bakar"],
    website: "http://www.xorbix.com",
    products: ["Custom Software Dev", "Mobile App Dev", "Managed SaaS"]
  },
  {
    name: "DATA212",
    region: "Ontario",
    country: "Canada",
    employees: "1-10",
    description: "DATA212 is a cycle analytics support service for corporate businesses and government organizations.",
    status: "closed",
    ipo_status: "private",
    rank: 728363,
    it_spend: 263340,
    industries: ["Analytics", "IT", "Outsourcing"],
    tech_count: 2,
    heat_score: 12,
    founders: ["Misha Zhyruk"],
    website: "https://www.data212.pro",
    products: []
  },
  {
    name: "Tredence",
    region: "California",
    country: "United States",
    employees: "1001-5000",
    description: "Tredence is a data science solutions provider that offers AI-enabled data strategy solutions.",
    status: "active",
    ipo_status: "private",
    rank: 2152,
    it_spend: 46852050,
    industries: ["Analytics", "AI", "Consulting", "IT"],
    tech_count: 35,
    heat_score: 78,
    founders: ["Shub Bhowmick", "Sumit Mehra", "Shashank Dubey"],
    website: "http://tredence.com",
    products: ["ATOM.AI", "Customer Cosmos", "Supply Chain Control Tower", "Sancus Data Quality"]
  },
  {
    name: "Adastra",
    region: "Ontario",
    country: "Canada",
    employees: "1001-5000",
    description: "AI First. Data, Analytics and Cloud, Always. Adastra offers data processing and information management services.",
    status: "active",
    ipo_status: "private",
    rank: 24547,
    it_spend: 16974741,
    industries: ["BI", "Data Governance", "Data Integration", "Generative AI"],
    tech_count: 32,
    heat_score: 74,
    founders: ["Jan Cervinka", "Jan Mrazek", "Petr Jech"],
    website: "https://adastracorp.com",
    products: ["Data Governance", "Master Data Management", "Data Mesh", "Data Quality"]
  },
  {
    name: "OnGraph Technologies",
    region: "Uttar Pradesh",
    country: "India",
    employees: "251-500",
    description: "OnGraph is a leading app development company ready to empower businesses with cutting-edge digital solutions.",
    status: "active",
    ipo_status: "private",
    rank: 279968,
    it_spend: 3219105,
    industries: ["Cloud Data", "E-Commerce", "IoT", "Web Dev"],
    tech_count: 73,
    heat_score: 69,
    founders: ["Nitin Gupta"],
    website: "https://www.ongraph.com",
    products: ["AI Development", "Voice Agent", "Blockchain Development", "White Label Apps"]
  },
  {
    name: "Keyrus",
    region: "Ile-de-France",
    country: "France",
    employees: "1001-5000",
    description: "Keyrus is a specialist in performance management consulting and the integration of innovative technological solutions.",
    status: "active",
    ipo_status: "public",
    rank: 321414,
    it_spend: 27429465,
    industries: ["Architecture", "IT", "Management Consulting"],
    tech_count: 56,
    heat_score: 82,
    founders: ["Philippe Corrot"],
    website: "http://www.keyrus.com",
    products: ["Data & Digital Strategy", "AI Solutions", "Enterprise Performance Mgmt"]
  },
  {
    name: "Markovate Inc.",
    region: "California",
    country: "United States",
    employees: "51-100",
    description: "Markovate specializes in crafting bespoke digital and AI-powered solutions to catalyze transformative growth.",
    status: "active",
    ipo_status: "private",
    rank: 219673,
    it_spend: 848737,
    industries: ["AI", "Blockchain", "Product Design", "Web3"],
    tech_count: 21,
    heat_score: 71,
    founders: ["Rajeev Sharma"],
    website: "https://www.markovate.com",
    products: ["Generative AI", "Adaptive AI", "Digital Twin", "Virtual Coaching"]
  },
  {
    name: "Synergo Group",
    region: "Ontario",
    country: "Canada",
    employees: "11-50",
    description: "Mobile and Web Application Development Company in Toronto driving business success across fintech and healthtech.",
    status: "active",
    ipo_status: "private",
    rank: 372192,
    it_spend: 1055134,
    industries: ["Fintech", "Health Care", "Mobile Apps", "IoT"],
    tech_count: 37,
    heat_score: 64,
    founders: [],
    website: "https://synergogroup.net/",
    products: ["Custom Apps", "AI & Big Data", "DevOps", "Cloud Computing"]
  },
  {
    name: "Denologix",
    region: "Ontario",
    country: "Canada",
    employees: "101-250",
    description: "Denologix is an Analytics & Information Management company providing Big Data, AI, and Machine Learning solutions.",
    status: "active",
    ipo_status: "private",
    rank: 668401,
    it_spend: 1740220,
    industries: ["AI", "Big Data", "Machine Learning"],
    tech_count: 20,
    heat_score: 55,
    founders: ["Shaz Ahmed"],
    website: "http://www.denologix.com/",
    products: []
  },
  {
    name: "AI Superior",
    region: "Hessen",
    country: "Germany",
    employees: "11-50",
    description: "Data Science Services and Custom Machine Learning Solutions provider unlocking the potential of data.",
    status: "active",
    ipo_status: "private",
    rank: 242901,
    it_spend: 733861,
    industries: ["Analytics", "Data Mining", "Machine Learning", "Software"],
    tech_count: 43,
    heat_score: 62,
    founders: ["Ivan Tankoyeu", "Sergey Sukhanov"],
    website: "https://aisuperior.com/",
    products: ["AI Software Dev", "AI Consulting", "Generative AI", "AI Training"]
  }
];

const scale = (val, min, max) => {
  if (val === undefined || val === null) return 0;
  if (max === min) return 3;
  const clamped = Math.max(min, Math.min(max, val));
  return Math.round((1 + 4 * (clamped - min) / (max - min)) * 10) / 10; // 1–5 scale, 1 decimal
};

const safeMin = (arr) => arr.length ? Math.min(...arr) : 0;
const safeMax = (arr) => arr.length ? Math.max(...arr) : 0;

const spends = rawData.map(c => c.it_spend || 0);
const techs = rawData.map(c => c.tech_count || 0);
const ranks = rawData.map(c => c.rank || 0);

const minSpend = safeMin(spends);
const maxSpend = safeMax(spends);
const minTech = safeMin(techs);
const maxTech = safeMax(techs);
const minRank = safeMin(ranks);
const maxRank = safeMax(ranks);

export const masterData = rawData.map(company => {
  const { it_spend, tech_count, rank } = company;
  return {
    name: company.name,
    metrics: {
      marketPresence: scale(it_spend, minSpend, maxSpend),
      technicalDepth: scale(tech_count, minTech, maxTech),
      serviceProductFit: 3.5,     // placeholder if no direct signal
      deliveryExcellence: 3.5,    // placeholder if no direct signal
      customerOutcomes: 3.5,      // placeholder if no direct signal
      financialHealth: scale(rank ? -rank : 0, -maxRank, -minRank || -1), // invert rank: better rank → higher score
      talentCulture: 3.5,         // placeholder if no direct signal
      pricingValue: 3.5           // placeholder if no direct signal
    },
    profile: {
      description: company.description,
      headquarters: [company.region, company.country].filter(Boolean).join(", "),
      employees: company.employees,
      ipoStatus: company.ipo_status,
      status: company.status,
      website: company.website,
      industries: company.industries || [],
      products: company.products || [],
      founders: company.founders || [],
      itSpend: company.it_spend,
      rank: company.rank,
      techCount: company.tech_count
    },
    raw: company
  };
});

export const metricConfig = [
  { key: 'marketPresence', label: 'Market Presence', color: '#8B5CF6' },
  { key: 'technicalDepth', label: 'Technical Depth & Innovation', color: '#06B6D4' },
  { key: 'serviceProductFit', label: 'Service/Product Fit', color: '#10B981' },
  { key: 'deliveryExcellence', label: 'Delivery Excellence', color: '#F59E0B' },
  { key: 'customerOutcomes', label: 'Customer Outcomes', color: '#EF4444' },
  { key: 'financialHealth', label: 'Financial Health', color: '#8B5CF6' },
  { key: 'talentCulture', label: 'Talent & Culture', color: '#06B6D4' },
  { key: 'pricingValue', label: 'Pricing & Value', color: '#10B981' }
];
