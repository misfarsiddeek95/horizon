import type { V2Crro } from "./types";

export const CRRO_IDS = [1, 2, 3, 4] as const;

export const CRROS_V2: Record<1 | 2 | 3 | 4, V2Crro> = {
  1: {
    id: 1,
    kind: "Risk",
    tabTitle: "Raw material supply",
    tabType: "Coconut shell charcoal availability & cost",
    title: "Climate risk to raw material supply",
    desc: "Climate pressure can tighten coconut shell charcoal supply and raise input costs.",
    color: "#174A7E",
    factors: [
      {
        title: "Climate variability",
        text: "Changing climate conditions can affect coconut productivity and raw-material availability.",
      },
      {
        title: "Demand & shell availability",
        text: "Market demand and the availability of coconut shells influence feedstock supply and pricing.",
      },
      {
        title: "Sourcing regions",
        text: "Supply exposure spans multiple sourcing regions, creating differing climate and availability risks.",
      },
      {
        title: "Plantation ageing & replanting",
        text: "Ageing plantations and replanting cycles can influence future shell availability and supply resilience.",
      },
    ],
    meaning: [
      {
        title: "Core feedstock",
        text: "Coconut shell charcoal is a key raw material for activated carbon production.",
      },
      {
        title: "Multi-country exposure",
        text: "The analysis considers sourcing across Sri Lanka, India, Indonesia and Thailand.",
      },
      {
        title: "Business effect",
        text: "Tighter supply can translate into higher raw-material costs.",
      },
      {
        title: "Key management lever",
        text: "Multi-country sourcing, fallback imports and replanting.",
      },
    ],
    driver:
      "Estimated Average Coconut Shell Charcoal Cost Increase Across Major Sourcing Regions",
    driverSubtitle: "Compared with the FY 2025/26 baseline",
    driverAxis: "CSC cost increase from baseline",
    driverUnit: "%",
    driverFormat: "percent",
    finance: "Estimated Incremental Raw Material Cost Increase",
    financeSubtitle: "Compared with FY 2025/26 raw material costs",
    financeAxis: "Incremental raw material cost",
    financeUnit: "LKR bn",
    financeFormat: "number",
    upper: [30, 88, 160],
    lower: [20, 55, 108],
    finU: [8.3, 22.8, 43.9],
    finL: [5.5, 14.3, 29.2],
    lens: "How this risk behaves across climate futures",
    net: "Lower physical stress supports a more stable sourcing outlook, though ageing plantations and under replanting remain constraints.",
    div: "Higher physical stress amplifies yield variability and feedstock constraints, increasing charcoal availability and cost pressure.",
  },
  2: {
    id: 2,
    kind: "Risk",
    tabTitle: "Physical water risk",
    tabType: "Operational exposure to water stress",
    title: "Physical water risk",
    desc: "Water stress can constrain washing-dependent production and create revenue exposure.",
    color: "#168E95",
    factors: [
      {
        title: "Water availability & quality",
        text: "Changing availability and water quality can affect usable-water supply for operations.",
      },
      {
        title: "Hydrological variability",
        text: "Changing climate conditions affect rainfall patterns and basin-level water stress.",
      },
      {
        title: "Washing dependency",
        text: "Selected activated carbon grades require product washing, creating direct water exposure.",
      },
      {
        title: "RO, reuse & storage",
        text: "Recycling, rainwater harvesting and storage support operational water resilience.",
      },
    ],
    meaning: [
      {
        title: "Washing dependency",
        text: "Selected activated carbon grades, including Energy Storage Carbons, require product washing",
      },
      {
        title: "Usable water",
        text: "Availability and water quality matter, not rainfall alone",
      },
      {
        title: "Business effect",
        text: "Severe constraints can reduce washing-dependent production and revenue",
      },
      {
        title: "Key management lever",
        text: "RO, recycling, rainwater harvesting and storage",
      },
    ],
    driver: "Estimated Loss of Usable Water for Product Washing",
    driverSubtitle:
      "Quantified operational impact under physical climate-related water constraints",
    driverAxis: "Usable washing water loss",
    driverUnit: "%",
    driverFormat: "percent",
    finance: "Incremental Revenue Loss",
    financeSubtitle:
      "Estimated financial effect of reduced usable washing water on washing-dependent grades",
    financeAxis: "Revenue loss",
    financeUnit: "LKR bn",
    financeFormat: "number",
    upper: [10, 30, 30],
    lower: [5, 15, 20],
    finU: [1.7, 8, 8],
    finL: [0.5, 2, 3],
    lens: "How water exposure changes by scenario",
    net: "Lower physical stress and stronger adaptation reduce water constraints on washing-dependent production.",
    div: "Greater hydrological stress and water-quality variability increase usable-water constraints and revenue exposure.",
  },
  3: {
    id: 3,
    kind: "Opportunity",
    tabTitle: "Renewable energy",
    tabType: "Lower-carbon, more resilient energy use",
    title: "Renewable energy opportunity",
    desc: "A higher renewable share can reduce fossil-fuel exposure and improve cost predictability",
    color: "#4A9B52",
    factors: [
      {
        title: "Fossil-fuel volatility",
        text: "Fossil-fuel price volatility and supply disruption create exposure.",
      },
      {
        title: "Renewable share",
        text: "Higher renewable energy use reduces dependence on fossil fuels.",
      },
      {
        title: "Solar, dendro & waste heat",
        text: "Solar, dendro and waste-heat conversions support additional renewable energy.",
      },
      {
        title: "Investment timing",
        text: "The pace and value of renewable deployment depend on transition timing.",
      },
    ],
    meaning: [
      {
        title: "Energy exposure",
        text: "The opportunity responds to fossil-fuel price volatility and supply disruption",
      },
      {
        title: "Transition pathway",
        text: "Solar, dendro and newer waste-heat conversions support additional renewable energy use",
      },
      {
        title: "Business effect",
        text: "Lower fossil dependence can reduce cost pressure over time",
      },
      {
        title: "Key management lever",
        text: "Renewables, waste heat and energy diversification",
      },
    ],
    driver: "Renewable Energy Share under the ACTIVATE 2030 Boundary",
    driverSubtitle:
      "Excluding legacy waste-heat utilisation for steam generation",
    driverAxis: "Renewable energy share",
    driverUnit: "%",
    driverFormat: "percent",
    driverSingleEstimate: true,
    finance: "Estimated Reduction in Fossil-Fuel-Related Cost of Sales",
    financeSubtitle:
      "Estimated financial benefit from reduced exposure to fossil-fuel-related costs",
    financeAxis: "Anticipated cost reduction",
    financeUnit: "%",
    financeFormat: "percent",
    upper: [9, 30, 50],
    lower: [9, 30, 50],
    finU: [0, 15, 15],
    finL: [0, 5, 10],
    lens: "How the opportunity scales across climate futures",
    net: "Faster decarbonisation strengthens renewable-energy value and reduces fossil-fuel cost exposure.",
    div: "A slower, uneven transition prolongs fossil-fuel and energy-security exposure, increasing the value of diversification.",
  },
  4: {
    id: 4,
    kind: "Opportunity",
    tabTitle: "Future-focused carbon solutions",
    tabType: "Growth through higher-value solutions",
    title: "Value-added carbon opportunity",
    desc: "Growing climate-solution demand can create a market opportunity for Energy Storage Carbons",
    color: "#7253A6",
    factors: [
      {
        title: "Energy-storage market demand",
        text: "Customers increasingly seek specialised carbon solutions for energy-storage applications.",
      },
      {
        title: "Production expansion",
        text: "R&D and product development enable production scaling.",
      },
      {
        title: "Climate-solution applications",
        text: "Changing customer requirements accelerate demand for climate-solution-focused products.",
      },
      {
        title: "Portfolio diversification",
        text: "Differentiated products support portfolio growth and margin enhancement.",
      },
    ],
    meaning: [
      {
        title: "Market signal",
        text: "Energy-storage demand creates a climate-solution growth opportunity",
      },
      {
        title: "Business linkage",
        text: "Energy Storage Carbon is the principal growth pathway linked to this climate-solution demand",
      },
      {
        title: "Business effect",
        text: "Higher demand and production can translate into revenue uplift",
      },
      {
        title: "Key management lever",
        text: "Disciplined capacity expansion and portfolio diversification",
      },
    ],
    driver: "Indicative Energy Storage Carbon Production Expansion",
    driverSubtitle:
      "Production multiple relative to the FY 2025/26 baseline, where FY 2025/26 = 1.0",
    driverAxis: "Production multiple",
    driverUnit: "×",
    driverFormat: "multiple",
    finance: "Climate-Solution Revenue Opportunity",
    financeSubtitle:
      "Indicative revenue range across the short, medium and long term",
    financeAxis: "Estimated revenue uplift",
    financeUnit: "LKR bn",
    financeFormat: "number",
    upper: [1.4, 3, 3.4],
    lower: [1, 1.4, 3],
    finU: [5, 10, 12.5],
    finL: [4, 5, 10],
    lens: "How innovation performs across climate futures",
    net: "Faster decarbonisation creates the strongest growth pathway for Energy Storage Carbon demand.",
    div: "Energy-storage growth is more uneven, while water and emissions pressures continue to support purification demand.",
  },
};
