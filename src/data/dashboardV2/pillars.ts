import { PILLARS } from "@/data/activateDashboard";
import type { PillarId, V2Pillar } from "./types";

export const IMPACT_REPORT_URL =
  "https://www.haycarb.com/wp-content/uploads/2026/08/Sustainability-Impact-Report-Jul-2026.pdf";

export const ACTIVATE_ROADMAP_URL =
  "https://www.haycarb.com/wp-content/uploads/2025/07/ACTIVATE-Haycarb-PLC-ESG-Roadmap-2030.pdf";

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
    desc: "Protecting and restoring the natural systems connected to our operations and value chain.",
    overview:
      "RESTORE focuses on the natural resources and environmental systems that shape how we operate: the energy we use, the water we manage, the materials we transform and the ecosystems connected to our sites. In FY2025/26, our focus was on practical action: expanding renewable energy, improving waste heat recovery, strengthening water reuse, supporting circularity and embedding climate-conscious practices across our operations.",
    standout: "100%",
    standoutText:
      "of Shizuka’s water requirement was met through harvested rainwater in FY2025/26.",
    impacts: [
      { value: "11,348 GJ", label: "solar energy generated" },
      { value: "30,500 m³", label: "water recycled & reused" },
      { value: "3,816 MT", label: "non-hazardous waste recycled" },
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
    story: "Restoring value through responsible resource use",
    storyText:
      "A closer look at how resource efficiency, water stewardship and circular practices are being translated into action.",
    page: "10",
  },
  inspire: {
    id: "inspire",
    name: "INSPIRE",
    descriptor: "Our Teams",
    desc: "Creating an inclusive, safe and future-ready workplace where our teams can grow and contribute.",
    overview: "",
    standout: "96%",
    standoutText:
      "of employees completed targeted capability and engagement programmes during FY2025/26.",
    impacts: [
      { value: "18,420", label: "learning hours" },
      { value: "42%", label: "women in selected programmes" },
      { value: "0.31", label: "LTIFR indicator" },
    ],
    progress: [
      { label: "Employee engagement", pct: 78 },
      { label: "Learning pathways", pct: 72 },
      { label: "Safety performance", pct: 84 },
    ],
    story: "Building capability for a changing future",
    storyText:
      "See how Haycarb is strengthening skills, inclusion and employee wellbeing across its teams.",
    page: "14",
  },
  excite: {
    id: "excite",
    name: "EXCITE",
    descriptor: "Our Customers",
    desc: "Partnering with customers to deliver responsible solutions and strengthen shared sustainability outcomes.",
    overview: "",
    standout: "87%",
    standoutText:
      "of strategic customer engagements included sustainability-related collaboration themes.",
    impacts: [
      { value: "64", label: "customer initiatives" },
      { value: "21", label: "joint projects" },
      { value: "93%", label: "quality satisfaction" },
    ],
    progress: [
      { label: "Customer partnerships", pct: 82 },
      { label: "Responsible products", pct: 76 },
      { label: "Transparency initiatives", pct: 71 },
    ],
    story: "Turning customer collaboration into impact",
    storyText:
      "Explore how sustainability is being embedded into customer relationships and product development.",
    page: "18",
  },
  uplift: {
    id: "uplift",
    name: "UPLIFT",
    descriptor: "Communities & Supply Chain",
    desc: "Supporting resilient communities and more responsible supply chains through shared value creation.",
    overview: "",
    standout: "14,600+",
    standoutText:
      "people reached through community and supplier-focused initiatives during the year.",
    impacts: [
      { value: "148", label: "supplier engagements" },
      { value: "32", label: "community projects" },
      { value: "8", label: "regional programmes" },
    ],
    progress: [
      { label: "Supplier capability", pct: 73 },
      { label: "Community reach", pct: 81 },
      { label: "Responsible sourcing", pct: 65 },
    ],
    story: "Shared progress across communities and supply chains",
    storyText:
      "See how local partnerships and supplier engagement are contributing to stronger, more resilient ecosystems.",
    page: "22",
  },
  innovate: {
    id: "innovate",
    name: "INNOVATE",
    descriptor: "Our Future Solutions",
    desc: "Advancing future-focused carbon solutions through innovation, R&D and lower-impact technologies.",
    overview: "",
    standout: "27%",
    standoutText:
      "of active development projects incorporated enhanced sustainability criteria in FY2025/26.",
    impacts: [
      { value: "19", label: "active R&D projects" },
      { value: "7", label: "pilot solutions" },
      { value: "4", label: "commercial trials" },
    ],
    progress: [
      { label: "R&D pipeline", pct: 75 },
      { label: "Low-impact innovation", pct: 63 },
      { label: "Commercialisation", pct: 58 },
    ],
    story: "Designing the next generation of carbon solutions",
    storyText:
      "Explore the technologies and collaborations shaping Haycarb’s future product portfolio.",
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
