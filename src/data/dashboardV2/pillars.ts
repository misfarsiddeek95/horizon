import { PILLARS } from "@/data/activateDashboard";
import type { PillarId, V2Pillar } from "./types";

const PDF_BASE = "/pdf/Sustainability-Dashboard";

export const IMPACT_REPORT_URL = `${PDF_BASE}/ACTIVATE-2030/AR Disclosure on Activate 2030 achievements.pdf`;

export const ACTIVATE_ROADMAP_URL = `${PDF_BASE}/ACTIVATE-2030/ACTIVATE 2030 - Haycarb ESG Roadmap.pdf`;

export const STORY_PDFS: Record<PillarId, string> = {
  restore: `${PDF_BASE}/ACTIVATE-2030/Restore Impact Story - From LPG to Waste Heat - A Climate-Smart Dryer Upgrade.pdf`,
  inspire: `${PDF_BASE}/ACTIVATE-2030/Inspire Impact Story - Safety Through Systems and Digitalization.pdf`,
  excite: `${PDF_BASE}/ACTIVATE-2030/Excite Impact Story - Customer Centric Production.pdf`,
  uplift: `${PDF_BASE}/ACTIVATE-2030/Uplift Impact Story - Growing Beyond the Traditional Coconut Triangle.pdf`,
  innovate: `${PDF_BASE}/ACTIVATE-2030/Innovate Impact Story - Energy Storage Carbons for a Changing Energy Future.pdf`,
};

export const PILLAR_IDS: PillarId[] = [
  "restore",
  "inspire",
  "excite",
  "uplift",
  "innovate",
];

const pillarData: Record<PillarId, Omit<V2Pillar, "accent">> = {
  restore: {
    id: "restore",
    name: "RESTORE",
    descriptor: "Our Natural World",
    desc: "Protecting and restoring the natural systems connected to our operations and value chain",
    overview:
      "RESTORE focuses on the natural resources and environmental systems that shape how we operate: the energy we use, the water we manage, the materials we transform and the ecosystems connected to our sites. In FY2025/26, our focus was on practical action: expanding renewable energy, improving waste heat recovery, strengthening water reuse, supporting circularity and embedding climate-conscious practices across our operations. ",
    standout: "100%",
    standoutText:
      "of Shizuka’s water requirement was met through harvested rainwater in FY2025/26",
    impacts: [
      { value: "11,348 GJ", label: "of solar energy generated during FY2025/26" },
      { value: "30,500 m³", label: "of water recycled and reused across the Group" },
      { value: "3,816 MT", label: "of non-hazardous waste recycled" },
    ],
    progress: [
      { label: "Renewable-energy use", pct: 68 },
      { label: "Energy intensity", pct: 69 },
      { label: "Scope 1 & 2 emissions", pct: 44 },
      { label: "Water reuse & recycling", pct: 27 },
    ],
    commitments: [
      {
        name: "Renewable-energy use",
        current: "9% increase",
        note: "vs FY2022/23 baseline",
        target: "50% increase",
        status: "18% · Progressing",
        tone: "progressing",
        pct: 18,
      },
      {
        name: "Energy intensity",
        current: "18.44",
        note: "GJ/Rs. Mn",
        target: "17.83 GJ/Rs. Mn",
        status: "69% · On track",
        tone: "ontrack",
        pct: 69,
      },
      {
        name: "Scope 1 and 2 emissions",
        current: "29,369",
        note: "tCO₂e",
        target: "19,464 tCO₂e",
        status: "Requires acceleration",
        tone: "acceleration",
      },
      {
        name: "Solid-waste intensity",
        current: "0.08",
        note: "MT/Rs. Mn",
        target: "0.094 MT/Rs. Mn",
        status: "100% · Target achieved / exceeded",
        tone: "achieved",
        pct: 100,
      },
      {
        name: "Sustainable raw-material packaging",
        current: "700k–800k bags/sacks",
        note: "with greater bulk-bag use",
        target: "25% reduction",
        status: "Progressing",
        tone: "progressing",
      },
      {
        name: "Sustainable water sourcing",
        current: "16%",
        note: "of total water",
        target: "10%",
        status: "100% · Target achieved / exceeded",
        tone: "achieved",
        pct: 100,
      },
      {
        name: "Water reuse and recycling",
        current: "4%",
        note: "of total water",
        target: "15%",
        status: "27% · Progressing",
        tone: "progressing",
        pct: 27,
      },
      {
        name: "Water intensity",
        current: "11.79",
        note: "m³/Rs. Mn",
        target: "7.46 m³/Rs. Mn",
        status: "Requires acceleration",
        tone: "acceleration",
      },
    ],
    story: "Restoring value through waste heat utilisation",
    storyText:
      "A closer look at how Haycarb is improving dryer efficiency by replacing LPG use with recovered waste heat, reducing fuel dependency and supporting lower-emission operations.",
    page: "10",
  },
  inspire: {
    id: "inspire",
    name: "INSPIRE",
    descriptor: "Our Teams",
    desc: "Creating an inclusive, safe and future-ready workplace where our teams can grow and contribute",
    overview: "",
    standout: "Rs. 73 Mn",
    standoutText:
      "in relief assistance following Cyclone Ditwah",
    impacts: [
      { value: "64,893", label: "Training hours" },
      { value: "15.4%", label: "Female representation" },
      { value: "60+", label: "Internship opportunities provided" },
    ],
    commitments: [
      {
        name: "Maximum employee attrition",
        current: "14.7%",
        note: "employee attrition",
        target: "Maximum 5%",
        status: "Requires acceleration",
        tone: "acceleration",
      },
      {
        name: "Permanent employee appraisals",
        current: "100%",
        note: "coverage",
        target: "100%",
        status: "100% · Target achieved / exceeded",
        tone: "achieved",
        pct: 100,
      },
      {
        name: "Training-needs mapping",
        current: "100%",
        note: "coverage",
        target: "100%",
        status: "100% · Target achieved / exceeded",
        tone: "achieved",
        pct: 100,
      },
      {
        name: "Average training hours / employee",
        current: "31.1",
        note: "hours",
        target: "40 hours",
        status: "71% · On track",
        tone: "ontrack",
        pct: 71,
      },
      {
        name: "Health & safety - RIR / LTIF / fatalities",
        current: "RIR 2.12; LTIF 1.4",
        note: "RIR / LTIF",
        target: "0 fatalities; <1",
        status: "Requires acceleration",
        tone: "acceleration",
      },
    ],
    story: "Digitalising steam operations for efficiency and safety",
    storyText:
      "A closer look at how Haycarb is using digital monitoring and control to improve boiler efficiency, strengthen operational reliability and support safer working conditions for employees.",
    page: "14",
  },
  excite: {
    id: "excite",
    name: "EXCITE",
    descriptor: "Our Customers",
    desc: "Partnering with customers to deliver responsible solutions and strengthen shared sustainability outcomes.",
    overview: "",
    standout: "19",
    standoutText:
      "New customers acquired across the Activated Carbon Segment",
    impacts: [
      { value: "64", label: "customer initiatives" },
      { value: "21", label: "joint projects" },
      { value: "93%", label: "quality satisfaction" },
    ],
    commitments: [
      {
        name: "Customer satisfaction",
        current: ">90%",
        note: "customer satisfaction",
        target: ">90%",
        status: "100% · Target achieved / exceeded",
        tone: "achieved",
        pct: 100,
      },
      {
        name: "Increase in global market share",
        current: "Stability in demand",
        note: "reported position",
        target: "Additional 1%",
        status: "Progressing",
        tone: "progressing",
      },
    ],
    story: "Strengthening customer value through technical excellence",
    storyText:
      "A closer look at how Haycarb is enhancing product reliability, quality and technical responsiveness to meet evolving customer needs across specialised activated carbon applications.",
    page: "18",
  },
  uplift: {
    id: "uplift",
    name: "UPLIFT",
    descriptor: "Communities & Supply Chain",
    desc: "Supporting resilient communities and responsible supply chains through shared value creation.",
    overview: "",
    standout: "Rs 52.7 Mn",
    standoutText: "Invested in CSR Initiatives",
    impacts: [
      { value: "148", label: "New coconut shell and charcoal suppliers added" },
      { value: "35,000 +", label: "Coconut seedlings distributed" },
      { value: ">95%", label: "of locally sourced Sri Lankan charcoal produced using Haritha Angara pits" },
    ],
    commitments: [
      {
        name: "CSR beneficiaries",
        current: ">135,000",
        note: "beneficiaries",
        target: ">150,000 equivalent",
        status: "On track",
        tone: "ontrack",
        pct: 70,
      },
      {
        name: "Green charcoal across manufacturing",
        current: "61%",
        note: "of manufacturing",
        target: ">75%",
        status: "On track",
        tone: "ontrack",
        pct: 58,
      },
      {
        name: "Suppliers assessed on ESG standards",
        current: "24%",
        note: "of suppliers",
        target: "40%",
        status: "Progressing",
        tone: "progressing",
        pct: 54,
      },
    ],
    story: "Supporting livelihoods through resilient coconut cultivation",
    storyText:
      "A closer look at how Haycarb is supporting coconut-growing communities through seedling distribution, helping strengthen farmer livelihoods and long term raw material resilience.",
    page: "22",
  },
  innovate: {
    id: "innovate",
    name: "INNOVATE",
    descriptor: "Our Future Solutions",
    desc: "Advancing future ready carbon solutions through innovation, R&D and next generation applications.",
    overview: "",
    standout: "Rs 916 Mn",
    standoutText: "Revenue generated from new products",
    impacts: [
      { value: "Rs. 1,425 Mn", label: "Invested in energy storage carbon manufacturing" },
      { value: "14", label: "New products introduced" },
      { value: "30+", label: "chemists and specialists advancing next-generation carbon solutions" },
    ],
    commitments: [
      {
        name: "Product and process certifications",
        current: "32",
        note: "certifications",
        target: "No phased target disclosed",
        status: "Progressing",
        tone: "progressing",
      },
      {
        name: "Sustainable innovation investment",
        current: "Rs. 262 Mn",
        note: "FY2025/26 investment",
        target: "No phased target disclosed",
        status: "Progressing",
        tone: "progressing",
      },
    ],
    story: "Advancing future-ready carbon solutions",
    storyText:
      "A closer look at how Haycarb is developing high-value activated carbon solutions, including energy storage carbons, to support emerging applications in a changing energy future.",
    page: "26",
  },
};

const ACCENTS: Record<PillarId, string> = {
  restore: "#159a91",
  inspire: "#9b5d3d",
  excite: "#78b84f",
  uplift: "#56a9a7",
  innovate: "#e8892d",
};

export const PILLARS_V2: Record<PillarId, V2Pillar> = Object.fromEntries(
  PILLAR_IDS.map((id) => [id, { ...pillarData[id], accent: ACCENTS[id] }])
) as Record<PillarId, V2Pillar>;

export const PILLAR_ICONS: Record<PillarId, string> = {
  restore: PILLARS.RESTORE.iconData,
  inspire: PILLARS.INSPIRE.iconData,
  excite: PILLARS.EXCITE.iconData,
  uplift: PILLARS.UPLIFT.iconData,
  innovate: PILLARS.INNOVATE.iconData,
};
